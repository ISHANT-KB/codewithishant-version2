from __future__ import annotations

from uuid import UUID, uuid4

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.topic import Topic

from ..db.session import Base


class Note(Base):
    __tablename__ = "notes"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid4
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    topic_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("topics.id"), nullable=False
    )
    topic: Mapped["Topic"] = relationship(back_populates="notes")
