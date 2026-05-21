from datetime import datetime, timezone
from sqlalchemy import String, TIMESTAMP, text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.session import Base


class AuditLog(Base):
    """Immutable record of every admin write action."""
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    admin_email: Mapped[str] = mapped_column(String, nullable=False, index=True)
    action: Mapped[str] = mapped_column(String, nullable=False)          # CREATE UPDATE DELETE
    resource_type: Mapped[str] = mapped_column(String, nullable=False)   # blog note topic cheatsheet
    resource_id: Mapped[str] = mapped_column(String, nullable=True)      # UUID or slug as string
    detail: Mapped[str] = mapped_column(String, nullable=True)           # optional extra context
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"), index=True
    )