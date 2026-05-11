from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from ..db import get_db
from ..models.topic import Topic
from ..schemas.topic import TopicCreate, TopicResponse, TopicUpdate
from ..schemas.note import NoteResponse
from ..schemas.topic_full import TopicFullResponse
from ..lib.utils import generate_slug

from app.routes.deps import get_current_admin

router = APIRouter(prefix="/topics", tags=["Topics"])


def build_unique_slug(
    db: Session,
    name: str,
    exclude_topic_id: UUID | None = None,
) -> str:
    slug = generate_slug(name)
    base_slug = slug or "topic"
    slug = base_slug
    count = 1

    while True:
        query = db.query(Topic).filter(Topic.slug == slug)
        if exclude_topic_id is not None:
            query = query.filter(Topic.id != exclude_topic_id)

        if query.first() is None:
            return slug

        slug = f"{base_slug}-{count}"
        count += 1


def get_topic_by_id_or_404(db: Session, topic_id: UUID) -> Topic:
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if topic is None:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic


def validate_parent_topic(
    db: Session,
    parent_id: UUID | None,
    current_topic_id: UUID | None = None,
) -> UUID | None:
    if parent_id is None:
        return None

    if current_topic_id is not None and parent_id == current_topic_id:
        raise HTTPException(status_code=400, detail="A topic cannot be its own parent")

    parent_topic = db.query(Topic).filter(Topic.id == parent_id).first()
    if parent_topic is None:
        raise HTTPException(status_code=400, detail="Parent topic not found")

    if current_topic_id is not None:
        ancestor = parent_topic
        while True:
            if ancestor.id == current_topic_id:
                raise HTTPException(
                    status_code=400,
                    detail="A topic cannot be assigned beneath one of its descendants",
                )

            if ancestor.parent_id is None:
                break

            ancestor = get_topic_by_id_or_404(db, ancestor.parent_id)

    return parent_id


# -------------------------
# CREATE TOPIC
# -------------------------
@router.post("/", response_model=TopicResponse)
def create_topic(
    topic: TopicCreate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
) -> Topic:
    parent_id = validate_parent_topic(db, topic.parent_id)
    slug = build_unique_slug(db, topic.name)

    new_topic = Topic(
        name=topic.name,
        slug=slug,
        description=topic.description,
        parent_id=parent_id,
    )

    db.add(new_topic)
    db.commit()
    db.refresh(new_topic)

    return new_topic


# -------------------------
# GET ALL TOPICS
# -------------------------
@router.get("/", response_model=List[TopicResponse])
def get_topics(db: Session = Depends(get_db)):
    return db.query(Topic).all()


@router.put("/{topic_id}", response_model=TopicResponse)
def update_topic(
    topic_id: UUID,
    topic_data: TopicUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
) -> Topic:
    topic = get_topic_by_id_or_404(db, topic_id)
    parent_id = validate_parent_topic(
        db,
        topic_data.parent_id,
        current_topic_id=topic.id,
    )

    topic.name = topic_data.name
    topic.description = topic_data.description
    topic.parent_id = parent_id
    topic.slug = build_unique_slug(db, topic_data.name, exclude_topic_id=topic.id)

    db.commit()
    db.refresh(topic)

    return topic


@router.delete("/{topic_id}")
def delete_topic(
    topic_id: UUID,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    topic = get_topic_by_id_or_404(db, topic_id)
    has_children = db.query(Topic).filter(Topic.parent_id == topic.id).first() is not None

    if has_children:
        raise HTTPException(
            status_code=400,
            detail="Delete or reassign child topics before removing this topic",
        )

    db.delete(topic)
    db.commit()
    return {"message": "Deleted"}


# -------------------------
# GET NOTES OF A TOPIC
# -------------------------
@router.get("/{slug}/notes", response_model=List[NoteResponse])
def get_notes_by_topic(slug: str, db: Session = Depends(get_db)):
    topic = (
        db.query(Topic)
        .options(joinedload(Topic.notes))  # optimized
        .filter(Topic.slug == slug)
        .first()
    )

    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    return topic.notes


# -------------------------
# FULL TOPIC DATA
# -------------------------
@router.get("/{slug}/full", response_model=TopicFullResponse)
def get_full_topic(slug: str, db: Session = Depends(get_db)):
    topic = (
        db.query(Topic)
        .options(joinedload(Topic.notes))  # optimized
        .filter(Topic.slug == slug)
        .first()
    )

    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    return {
        "topic": topic,
        "notes": topic.notes,
    }


# -------------------------
# GET TOPIC BY SLUG
# -------------------------
@router.get("/{slug}", response_model=TopicResponse)
def get_topic_by_slug(slug: str, db: Session = Depends(get_db)):

    topic = db.query(Topic).filter(Topic.slug == slug).first()

    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    return topic
