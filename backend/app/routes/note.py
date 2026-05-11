from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from ..db import get_db
from ..models.note import Note
from ..models.topic import Topic
from ..schemas.note import NoteCreate, NoteResponse, NoteUpdate
from app.routes.deps import get_current_admin

router = APIRouter(prefix="/notes", tags=["Notes"])


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


@router.post("/", response_model=NoteResponse)
def create_note(
    note: NoteCreate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
) -> Note:
    get_topic_or_400(db, note.topic_id)
    new_note = Note(
        title=note.title,
        content=note.content,
        topic_id=note.topic_id,
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return new_note


@router.get("/", response_model=list[NoteResponse])
def get_all_notes(db: Session = Depends(get_db)) -> list[Note]:
    return db.query(Note).all()


@router.get("/{note_id}", response_model=NoteResponse)
def get_note(note_id: UUID, db: Session = Depends(get_db)) -> Note:
    return get_note_or_404(db, note_id)



@router.put("/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: UUID,
    note_data: NoteUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
) -> Note:
    note = get_note_or_404(db, note_id)
    get_topic_or_400(db, note_data.topic_id)
    note.title = note_data.title
    note.content = note_data.content
    note.topic_id = note_data.topic_id

    db.commit()
    db.refresh(note)

    return note


@router.delete("/{note_id}")
def delete_note(
    note_id: UUID,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    note = get_note_or_404(db, note_id)
    db.delete(note)
    db.commit()
    return {"message": "Deleted"}
