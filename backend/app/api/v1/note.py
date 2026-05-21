from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.db.session import get_db
from app.schemas.note import NoteCreate, NoteResponse, NoteUpdate
from app.services import note as note_service
from app.services import audit as audit_service
from app.api.deps import get_current_admin, require_csrf, get_admin_email
from app.core.sanitize import sanitize_markdown, sanitize_plain

router = APIRouter(prefix="/notes", tags=["Notes"])


def _sanitize_note_create(note: NoteCreate) -> NoteCreate:
    note.title   = sanitize_plain(note.title)
    note.content = sanitize_markdown(note.content)
    return note


def _sanitize_note_update(note: NoteUpdate) -> NoteUpdate:
    if note.title   is not None: note.title   = sanitize_plain(note.title)
    if note.content is not None: note.content = sanitize_markdown(note.content)
    return note


@router.post("/", response_model=NoteResponse, dependencies=[Depends(require_csrf)])
def create_note(
    note: NoteCreate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
    admin_email: str = Depends(get_admin_email),
):
    result = note_service.create_note(db, _sanitize_note_create(note))
    audit_service.log(db, admin_email=admin_email, action="CREATE",
                      resource_type="note", resource_id=str(result.id),
                      detail=result.title)
    return result


@router.get("/", response_model=list[NoteResponse])
def get_all_notes(db: Session = Depends(get_db)):
    return note_service.get_all_notes(db)


@router.get("/{note_id}", response_model=NoteResponse)
def get_note(note_id: UUID, db: Session = Depends(get_db)):
    return note_service.get_note(db, note_id)


@router.put("/{note_id}", response_model=NoteResponse, dependencies=[Depends(require_csrf)])
def update_note(
    note_id: UUID,
    note_data: NoteUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
    admin_email: str = Depends(get_admin_email),
):
    result = note_service.update_note(db, note_id, _sanitize_note_update(note_data))
    audit_service.log(db, admin_email=admin_email, action="UPDATE",
                      resource_type="note", resource_id=str(note_id))
    return result


@router.delete("/{note_id}", dependencies=[Depends(require_csrf)])
def delete_note(
    note_id: UUID,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
    admin_email: str = Depends(get_admin_email),
):
    result = note_service.delete_note(db, note_id)
    audit_service.log(db, admin_email=admin_email, action="DELETE",
                      resource_type="note", resource_id=str(note_id))
    return result