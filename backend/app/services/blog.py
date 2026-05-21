from uuid import UUID
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.blog import Blog
from app.schemas.blog import BlogCreate, BlogUpdate
from app.core.utils import generate_slug


def _build_unique_slug(db: Session, title: str, exclude_id: UUID | None = None) -> str:
    base = generate_slug(title) or "blog"
    slug = base
    count = 1
    while True:
        q = db.query(Blog).filter(Blog.slug == slug)
        if exclude_id:
            q = q.filter(Blog.id != exclude_id)
        if not q.first():
            return slug
        slug = f"{base}-{count}"
        count += 1


def _get_or_404(db: Session, blog_id: UUID) -> Blog:
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog


def create_blog(db: Session, payload: BlogCreate) -> Blog:
    slug = _build_unique_slug(db, payload.title)
    blog = Blog(
        title=payload.title,
        slug=slug,
        excerpt=payload.excerpt,
        content=payload.content,
        cover_url=payload.cover_url,
        published=payload.published,
    )
    db.add(blog)
    db.commit()
    db.refresh(blog)
    return blog


def get_all_blogs(db: Session, published_only: bool = True) -> list[Blog]:
    q = db.query(Blog)
    if published_only:
        q = q.filter(Blog.published == True)
    return q.order_by(Blog.created_at.desc()).all()


def get_blog_by_slug(db: Session, slug: str, admin: bool = False) -> Blog:
    blog = db.query(Blog).filter(Blog.slug == slug).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    if not admin and not blog.published:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog


def update_blog(db: Session, blog_id: UUID, payload: BlogUpdate) -> Blog:
    blog = _get_or_404(db, blog_id)
    if payload.title   is not None:
        blog.title   = payload.title
        blog.slug    = _build_unique_slug(db, payload.title, exclude_id=blog.id)
    if payload.excerpt   is not None: blog.excerpt   = payload.excerpt
    if payload.content   is not None: blog.content   = payload.content
    if payload.cover_url is not None: blog.cover_url = payload.cover_url
    if payload.published is not None: blog.published = payload.published
    db.commit()
    db.refresh(blog)
    return blog


def delete_blog(db: Session, blog_id: UUID) -> dict:
    blog = _get_or_404(db, blog_id)
    db.delete(blog)
    db.commit()
    return {"message": "Deleted"}