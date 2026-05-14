from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.note import Note
from app.models.topic import Topic
from app.schemas.note import NoteCreate, NoteUpdate


def get_topic_or_400(db: Session, topic_id: UUID) -> Topic:
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if topic is None:
        raise HTTPException(status_code=400, detail="Topic not found")
    return topic


def get_note_or_404(db: Session, note_id: UUID) -> Note:
    note = db.query(Note).filter(Note.id == note_id).first()
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


def create_note(db: Session, payload: NoteCreate) -> Note:
    get_topic_or_400(db, payload.topic_id)
    new_note = Note(
        title=payload.title,
        content=payload.content,
        topic_id=payload.topic_id,
    )
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note


def get_all_notes(db: Session) -> list[Note]:
    return db.query(Note).all()


def get_note(db: Session, note_id: UUID) -> Note:
    return get_note_or_404(db, note_id)


def update_note(db: Session, note_id: UUID, payload: NoteUpdate) -> Note:
    note = get_note_or_404(db, note_id)
    get_topic_or_400(db, payload.topic_id)
    note.title = payload.title
    note.content = payload.content
    note.topic_id = payload.topic_id
    db.commit()
    db.refresh(note)
    return note


def delete_note(db: Session, note_id: UUID) -> dict[str, str]:
    note = get_note_or_404(db, note_id)
    db.delete(note)
    db.commit()
    return {"message": "Deleted"}
