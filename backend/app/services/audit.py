from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog


def log(
    db: Session,
    *,
    admin_email: str,
    action: str,           # "CREATE" | "UPDATE" | "DELETE"
    resource_type: str,    # "blog" | "note" | "topic" | "cheatsheet"
    resource_id: str = "",
    detail: str = "",
) -> None:
    """Write one audit row. Never raises — errors are swallowed so they
    never block the actual operation."""
    try:
        db.add(AuditLog(
            admin_email=admin_email,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            detail=detail,
        ))
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"[audit] failed to write log: {e}")