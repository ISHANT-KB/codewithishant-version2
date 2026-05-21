from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.cheatsheet import CheatsheetCreate, CheatsheetUpdate, CheatsheetResponse
from app.services import cheatsheet as cheatsheet_service
from app.api.deps import get_current_admin
from app.core.sanitize import sanitize_markdown, sanitize_plain

router = APIRouter(prefix="/cheatsheets", tags=["Cheatsheets"])


def _sanitize_create(payload: CheatsheetCreate) -> CheatsheetCreate:
    payload.title   = sanitize_plain(payload.title)
    payload.slug    = sanitize_plain(payload.slug)
    payload.content = sanitize_markdown(payload.content)
    return payload


def _sanitize_update(payload: CheatsheetUpdate) -> CheatsheetUpdate:
    if payload.title   is not None: payload.title   = sanitize_plain(payload.title)
    if payload.slug    is not None: payload.slug    = sanitize_plain(payload.slug)
    if payload.content is not None: payload.content = sanitize_markdown(payload.content)
    return payload


@router.get("/", response_model=List[CheatsheetResponse])
def get_all_cheatsheets(db: Session = Depends(get_db)):
    return cheatsheet_service.get_all_cheatsheets(db)


@router.get("/{slug}", response_model=CheatsheetResponse)
def get_cheatsheet(slug: str, db: Session = Depends(get_db)):
    return cheatsheet_service.get_cheatsheet_by_slug(db, slug)


@router.post("/", response_model=CheatsheetResponse)
def create_cheatsheet(
    payload: CheatsheetCreate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    return cheatsheet_service.create_cheatsheet(db, _sanitize_create(payload))


@router.put("/{slug}", response_model=CheatsheetResponse)
def update_cheatsheet(
    slug: str,
    payload: CheatsheetUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    return cheatsheet_service.update_cheatsheet(db, slug, _sanitize_update(payload))


@router.delete("/{slug}")
def delete_cheatsheet(
    slug: str,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    return cheatsheet_service.delete_cheatsheet(db, slug)