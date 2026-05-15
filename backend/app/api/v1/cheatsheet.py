from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.cheatsheet import CheatsheetCreate, CheatsheetUpdate, CheatsheetResponse
from app.services import cheatsheet as cheatsheet_service
from app.api.deps import get_current_admin

router = APIRouter(prefix="/cheatsheets", tags=["Cheatsheets"])


# -------------------------
# GET ALL CHEATSHEETS (public)
# -------------------------
@router.get("/", response_model=List[CheatsheetResponse])
def get_all_cheatsheets(db: Session = Depends(get_db)):
    return cheatsheet_service.get_all_cheatsheets(db)


# -------------------------
# GET BY SLUG (public)
# -------------------------
@router.get("/{slug}", response_model=CheatsheetResponse)
def get_cheatsheet(slug: str, db: Session = Depends(get_db)):
    return cheatsheet_service.get_cheatsheet_by_slug(db, slug)


# -------------------------
# CREATE (admin)
# -------------------------
@router.post("/", response_model=CheatsheetResponse)
def create_cheatsheet(
    payload: CheatsheetCreate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    return cheatsheet_service.create_cheatsheet(db, payload)


# -------------------------
# UPDATE (admin)
# -------------------------
@router.put("/{slug}", response_model=CheatsheetResponse)
def update_cheatsheet(
    slug: str,
    payload: CheatsheetUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    return cheatsheet_service.update_cheatsheet(db, slug, payload)


# -------------------------
# DELETE (admin)
# -------------------------
@router.delete("/{slug}")
def delete_cheatsheet(
    slug: str,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    return cheatsheet_service.delete_cheatsheet(db, slug)
