from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload

from app.core.utils import generate_slug
from app.models.topic import Topic
from app.schemas.topic import TopicCreate, TopicUpdate


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


def create_topic(db: Session, payload: TopicCreate) -> Topic:
    parent_id = validate_parent_topic(db, payload.parent_id)
    slug = build_unique_slug(db, payload.name)
    new_topic = Topic(
        name=payload.name,
        slug=slug,
        description=payload.description,
        parent_id=parent_id,
    )
    db.add(new_topic)
    db.commit()
    db.refresh(new_topic)
    return new_topic


def get_topics(db: Session) -> list[Topic]:
    return db.query(Topic).all()


def update_topic(db: Session, topic_id: UUID, payload: TopicUpdate) -> Topic:
    topic = get_topic_by_id_or_404(db, topic_id)
    parent_id = validate_parent_topic(
        db,
        payload.parent_id,
        current_topic_id=topic.id,
    )
    topic.name = payload.name
    topic.description = payload.description
    topic.parent_id = parent_id
    topic.slug = build_unique_slug(db, payload.name, exclude_topic_id=topic.id)
    db.commit()
    db.refresh(topic)
    return topic


def delete_topic(db: Session, topic_id: UUID) -> dict[str, str]:
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


def get_notes_by_topic(db: Session, slug: str):
    topic = (
        db.query(Topic)
        .options(joinedload(Topic.notes))
        .filter(Topic.slug == slug)
        .first()
    )
    if topic is None:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic.notes


def get_full_topic(db: Session, slug: str) -> dict[str, object]:
    topic = (
        db.query(Topic)
        .options(joinedload(Topic.notes))
        .filter(Topic.slug == slug)
        .first()
    )
    if topic is None:
        raise HTTPException(status_code=404, detail="Topic not found")
    return {"topic": topic, "notes": topic.notes}


def get_topic_by_slug(db: Session, slug: str) -> Topic:
    topic = db.query(Topic).filter(Topic.slug == slug).first()
    if topic is None:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic
