from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime

from app.db.session import get_db
from app.models.audit_log import AuditLog
from app.api.deps import get_current_admin

router = APIRouter(prefix="/audit-logs", tags=["Audit"])


class AuditLogResponse(BaseModel):
    id: int
    admin_email: str
    action: str
    resource_type: str
    resource_id: str | None
    detail: str | None
    created_at: datetime

    class Config:
        from_attributes = True


@router.get("/", response_model=List[AuditLogResponse])
def get_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    return (
        db.query(AuditLog)
        .order_by(AuditLog.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )