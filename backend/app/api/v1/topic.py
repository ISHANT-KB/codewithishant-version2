from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.topic import TopicCreate, TopicResponse, TopicUpdate
from app.schemas.note import NoteResponse
from app.schemas.topic_full import TopicFullResponse
from app.services import topic as topic_service
from app.services import audit as audit_service
from app.api.deps import get_current_admin, require_csrf, get_admin_email
from app.core.sanitize import sanitize_markdown, sanitize_plain

router = APIRouter(prefix="/topics", tags=["Topics"])


def _sanitize_create(topic: TopicCreate) -> TopicCreate:
    topic.name        = sanitize_plain(topic.name)
    if topic.description:
        topic.description = sanitize_markdown(topic.description)
    return topic


def _sanitize_update(topic: TopicUpdate) -> TopicUpdate:
    topic.name        = sanitize_plain(topic.name)
    if topic.description:
        topic.description = sanitize_markdown(topic.description)
    return topic


@router.post("/", response_model=TopicResponse, dependencies=[Depends(require_csrf)])
def create_topic(
    topic: TopicCreate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
    admin_email: str = Depends(get_admin_email),
):
    result = topic_service.create_topic(db, _sanitize_create(topic))
    audit_service.log(db, admin_email=admin_email, action="CREATE",
                      resource_type="topic", resource_id=str(result.id),
                      detail=result.name)
    return result


@router.get("/", response_model=List[TopicResponse])
def get_topics(db: Session = Depends(get_db)):
    return topic_service.get_topics(db)


@router.put("/{topic_id}", response_model=TopicResponse, dependencies=[Depends(require_csrf)])
def update_topic(
    topic_id: UUID,
    topic_data: TopicUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
    admin_email: str = Depends(get_admin_email),
):
    result = topic_service.update_topic(db, topic_id, _sanitize_update(topic_data))
    audit_service.log(db, admin_email=admin_email, action="UPDATE",
                      resource_type="topic", resource_id=str(topic_id))
    return result


@router.delete("/{topic_id}", dependencies=[Depends(require_csrf)])
def delete_topic(
    topic_id: UUID,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
    admin_email: str = Depends(get_admin_email),
):
    result = topic_service.delete_topic(db, topic_id)
    audit_service.log(db, admin_email=admin_email, action="DELETE",
                      resource_type="topic", resource_id=str(topic_id))
    return result


@router.get("/{slug}/notes", response_model=List[NoteResponse])
def get_notes_by_topic(slug: str, db: Session = Depends(get_db)):
    return topic_service.get_notes_by_topic(db, slug)


@router.get("/{slug}/full", response_model=TopicFullResponse)
def get_full_topic(slug: str, db: Session = Depends(get_db)):
    return topic_service.get_full_topic(db, slug)


@router.get("/{slug}", response_model=TopicResponse)
def get_topic_by_slug(slug: str, db: Session = Depends(get_db)):
    return topic_service.get_topic_by_slug(db, slug)