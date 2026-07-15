from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/clients", tags=["clients"])


@router.post("/notify")
def notify_client(payload: schemas.NotifyRequest, db: Session = Depends(get_db)):
    client = db.query(models.Client).filter(models.Client.client_code == payload.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found.")

    client.notified = True
    db.commit()

    return {"message": f"Notification sent to {client.full_name}!"}
