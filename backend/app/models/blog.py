from __future__ import annotations
from uuid import UUID, uuid4
from datetime import datetime

from sqlalchemy import String, Text, Boolean, TIMESTAMP, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class Blog(Base):
    __tablename__ = "blogs"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid4
    )
    title:      Mapped[str]          = mapped_column(String(300), nullable=False)
    slug:       Mapped[str]          = mapped_column(String(350), unique=True, nullable=False, index=True)
    excerpt:    Mapped[str | None]   = mapped_column(Text, nullable=True)
    content:    Mapped[str]          = mapped_column(Text, nullable=False)
    cover_url:  Mapped[str | None]   = mapped_column(String(500), nullable=True)
    published:  Mapped[bool]         = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime]     = mapped_column(
        TIMESTAMP, server_default=text("CURRENT_TIMESTAMP")
    )
    updated_at: Mapped[datetime]     = mapped_column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP"),
        onupdate=datetime.utcnow,
    )