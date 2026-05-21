from datetime import datetime, timezone
from sqlalchemy import String, TIMESTAMP, text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.session import Base


class TokenBlacklist(Base):
    """Revoked JTIs. Cleanup job purges rows where expires_at has passed."""
    __tablename__ = "token_blacklist"

    jti: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    revoked_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP")
    )
    # set to now + 7 days (refresh TTL) on insert so cron knows when safe to delete
    expires_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False
    )