from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.cheatsheet import Cheatsheet
from app.schemas.cheatsheet import CheatsheetCreate, CheatsheetUpdate


def get_cheatsheet_or_404(db: Session, slug: str) -> Cheatsheet:
    cheatsheet = db.query(Cheatsheet).filter(Cheatsheet.slug == slug).first()
    if cheatsheet is None:
        raise HTTPException(status_code=404, detail="Cheatsheet not found")
    return cheatsheet


def create_cheatsheet(db: Session, payload: CheatsheetCreate) -> Cheatsheet:
    existing = db.query(Cheatsheet).filter(Cheatsheet.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    new_cs = Cheatsheet(
        title=payload.title,
        slug=payload.slug,
        category=payload.category,
        description=payload.description,
        content=payload.content,
    )
    db.add(new_cs)
    db.commit()
    db.refresh(new_cs)
    return new_cs


def get_all_cheatsheets(db: Session) -> list[Cheatsheet]:
    return db.query(Cheatsheet).all()


def get_cheatsheet_by_slug(db: Session, slug: str) -> Cheatsheet:
    return get_cheatsheet_or_404(db, slug)


def update_cheatsheet(db: Session, slug: str, payload: CheatsheetUpdate) -> Cheatsheet:
    cs = get_cheatsheet_or_404(db, slug)
    # If slug is changing, make sure the new one doesn't collide
    if payload.slug != slug:
        conflict = db.query(Cheatsheet).filter(Cheatsheet.slug == payload.slug).first()
        if conflict:
            raise HTTPException(status_code=400, detail="Slug already exists")
    cs.title = payload.title
    cs.slug = payload.slug
    cs.category = payload.category
    cs.description = payload.description
    cs.content = payload.content
    db.commit()
    db.refresh(cs)
    return cs


def delete_cheatsheet(db: Session, slug: str) -> dict[str, str]:
    cs = get_cheatsheet_or_404(db, slug)
    db.delete(cs)
    db.commit()
    return {"message": "Deleted"}
