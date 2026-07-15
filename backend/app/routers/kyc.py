import datetime
import hashlib
import random
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, security

router = APIRouter(prefix="/api/kyc", tags=["kyc"])


@router.get("/expiring")
def get_expiring_clients(
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(security.get_current_user_optional),
):
    horizon = datetime.datetime.utcnow() + datetime.timedelta(days=30)

    query = db.query(models.Client).filter(
        models.Client.is_demo == True,  # noqa: E712
        models.Client.notified == False,  # noqa: E712
        models.Client.kyc_expiry_date <= horizon,
    )
    clients = query.all()

    if current_user:
        own = db.query(models.Client).filter(
            models.Client.owner_id == current_user.id,
            models.Client.notified == False,  # noqa: E712
            models.Client.kyc_expiry_date <= horizon,
        ).all()
        clients = clients + own

    return {
        "expiring_clients": [
            {
                "client_id": c.client_code,
                "full_name": c.full_name,
                "kyc_expiry_date": c.kyc_expiry_date.isoformat() if c.kyc_expiry_date else None,
            }
            for c in clients
        ]
    }


def _mock_verify(name: str):
    """Deterministic, dependency-free mock of a real OCR/face-match KYC
    verification pipeline. Not a real document check -- but it produces a
    consistent, explainable pass/fail so the full product flow can be
    demoed end-to-end without a third-party verification vendor."""
    digest = hashlib.sha256(name.strip().lower().encode()).hexdigest()
    seed = int(digest[:8], 16)
    rng = random.Random(seed)

    if len(name.strip()) < 3:
        return False, "Name is too short to verify against submitted documents.", None

    if rng.random() < 0.08:  # ~8% mock failure rate, for realism
        reasons = [
            "Selfie does not sufficiently match the photo on the Aadhaar card.",
            "PAN card image is too blurry to extract details.",
            "Aadhaar and PAN name do not match closely enough.",
        ]
        return False, rng.choice(reasons), None

    pan_masked = f"XXXXX{rng.randint(1000, 9999)}{rng.choice('ABCDEFGHIJKLMNPQRSTUVWXYZ')}"
    year = rng.randint(1970, 2002)
    month = rng.randint(1, 12)
    day = rng.randint(1, 28)
    dob = f"{year:04d}-{month:02d}-{day:02d}"
    cities = ["Mumbai, Maharashtra", "Delhi, NCR", "Bengaluru, Karnataka", "Pune, Maharashtra", "Chennai, Tamil Nadu"]
    address = rng.choice(cities)
    profit = round(rng.uniform(50_000, 300_000), 2)

    return True, None, {"pan_masked": pan_masked, "dob": dob, "address": address, "profit": profit}


@router.post("/onboard")
async def onboard_client(
    name: str = Form(...),
    pan: UploadFile = File(...),
    aadhaar_front: UploadFile = File(...),
    aadhaar_back: UploadFile = File(...),
    selfie: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    ok, reason, data = _mock_verify(name)

    if not ok:
        return {"status": "failed", "reason": reason}

    existing_count = db.query(models.Client).filter(models.Client.owner_id == current_user.id).count()
    client_code = f"U{current_user.id}-{existing_count + 1:03d}"

    client = models.Client(
        owner_id=current_user.id,
        is_demo=False,
        client_code=client_code,
        full_name=name,
        pan_masked=data["pan_masked"],
        dob=data["dob"],
        address=data["address"],
        kyc_status="Verified",
        # Expiring soon on purpose, so the notification pipeline is immediately
        # demonstrable right after onboarding a new client.
        kyc_expiry_date=datetime.datetime.utcnow() + datetime.timedelta(days=25),
        notified=False,
        profit=data["profit"],
        status="Up",
    )
    db.add(client)
    db.commit()

    return {
        "status": "success",
        "message": f"{name} has been successfully onboarded and verified.",
        "data": {
            "Name": name,
            "PAN Number (Masked)": data["pan_masked"],
            "DOB": data["dob"],
            "Address": data["address"],
        },
    }
