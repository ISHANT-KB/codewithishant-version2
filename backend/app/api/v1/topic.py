from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.topic import TopicCreate, TopicResponse, TopicUpdate
from app.schemas.note import NoteResponse
from app.schemas.topic_full import TopicFullResponse
from app.services import topic as topic_service

from app.api.deps import get_current_admin

router = APIRouter(prefix="/topics", tags=["Topics"])


# -------------------------
# CREATE TOPIC
# -------------------------
@router.post("/", response_model=TopicResponse)
def create_topic(
    topic: TopicCreate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    return topic_service.create_topic(db, topic)


# -------------------------
# GET ALL TOPICS
# -------------------------
@router.get("/", response_model=List[TopicResponse])
def get_topics(db: Session = Depends(get_db)):
    return topic_service.get_topics(db)


@router.put("/{topic_id}", response_model=TopicResponse)
def update_topic(
    topic_id: UUID,
    topic_data: TopicUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    return topic_service.update_topic(db, topic_id, topic_data)


@router.delete("/{topic_id}")
def delete_topic(
    topic_id: UUID,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    return topic_service.delete_topic(db, topic_id)


# -------------------------
# GET NOTES OF A TOPIC
# -------------------------
@router.get("/{slug}/notes", response_model=List[NoteResponse])
def get_notes_by_topic(slug: str, db: Session = Depends(get_db)):
    return topic_service.get_notes_by_topic(db, slug)


# -------------------------
# FULL TOPIC DATA
# -------------------------
@router.get("/{slug}/full", response_model=TopicFullResponse)
def get_full_topic(slug: str, db: Session = Depends(get_db)):
    return topic_service.get_full_topic(db, slug)


# -------------------------
# GET TOPIC BY SLUG
# -------------------------
@router.get("/{slug}", response_model=TopicResponse)
def get_topic_by_slug(slug: str, db: Session = Depends(get_db)):
    return topic_service.get_topic_by_slug(db, slug)
