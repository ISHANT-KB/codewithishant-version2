from sqlalchemy import String, TIMESTAMP, text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.session import Base


class TokenBlacklist(Base):
    """Revoked JTIs. Cleanup job should purge rows older than refresh token TTL."""
    __tablename__ = "token_blacklist"

    jti: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    revoked_at: Mapped[str] = mapped_column(
        TIMESTAMP, server_default=text("CURRENT_TIMESTAMP")
    )