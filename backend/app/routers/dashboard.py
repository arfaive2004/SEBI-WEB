from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, security

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

# Baseline numbers so the dashboard is never empty for a brand new visitor.
BASE_TOTAL_BROKERAGE = 12_345_678.90
BASE_ACTIVE_CLIENTS = 1254
BASE_NEW_CLIENTS = 32


@router.get("/metrics", response_model=schemas.MetricsResponse)
def get_metrics(
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(security.get_current_user_optional),
):
    own_clients = []
    if current_user:
        own_clients = db.query(models.Client).filter(models.Client.owner_id == current_user.id).all()

    own_profit_sum = sum(c.profit or 0 for c in own_clients)

    return schemas.MetricsResponse(
        total_brokerage=round(BASE_TOTAL_BROKERAGE + own_profit_sum * 0.02, 2),
        active_clients=BASE_ACTIVE_CLIENTS + len(own_clients),
        new_clients=BASE_NEW_CLIENTS + len(own_clients),
    )


@router.get("/top-clients", response_model=list[schemas.TopClientOut])
def get_top_clients(
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(security.get_current_user_optional),
):
    query = db.query(models.Client).filter(models.Client.is_demo == True)  # noqa: E712
    if current_user:
        own = db.query(models.Client).filter(models.Client.owner_id == current_user.id)
        clients = query.all() + own.all()
    else:
        clients = query.all()

    clients.sort(key=lambda c: c.profit or 0, reverse=True)
    top5 = clients[:5]

    return [
        schemas.TopClientOut(rank=i + 1, name=c.full_name, profit=c.profit or 0, status=c.status or "Up")
        for i, c in enumerate(top5)
    ]
