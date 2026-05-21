from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.blog import BlogCreate, BlogUpdate, BlogResponse, BlogListResponse
from app.services import blog as blog_service
from app.services import audit as audit_service
from app.api.deps import get_current_admin, require_csrf, get_admin_email
from app.core.sanitize import sanitize_markdown, sanitize_plain

router = APIRouter(prefix="/blogs", tags=["Blogs"])


def _sanitize_create(payload: BlogCreate) -> BlogCreate:
    payload.title   = sanitize_plain(payload.title)
    payload.content = sanitize_markdown(payload.content)
    if payload.excerpt:
        payload.excerpt = sanitize_plain(payload.excerpt)
    return payload


def _sanitize_update(payload: BlogUpdate) -> BlogUpdate:
    if payload.title   is not None: payload.title   = sanitize_plain(payload.title)
    if payload.content is not None: payload.content = sanitize_markdown(payload.content)
    if payload.excerpt is not None: payload.excerpt = sanitize_plain(payload.excerpt)
    return payload


# ── public ────────────────────────────────────────────────────────────────────

@router.get("/", response_model=List[BlogListResponse])
def list_blogs(db: Session = Depends(get_db)):
    return blog_service.get_all_blogs(db, published_only=True)


@router.get("/{slug}", response_model=BlogResponse)
def get_blog(slug: str, db: Session = Depends(get_db)):
    return blog_service.get_blog_by_slug(db, slug, admin=False)


# ── admin ─────────────────────────────────────────────────────────────────────

@router.get("/admin/all", response_model=List[BlogListResponse])
def list_all_blogs(
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    return blog_service.get_all_blogs(db, published_only=False)


@router.post("/", response_model=BlogResponse, dependencies=[Depends(require_csrf)])
def create_blog(
    payload: BlogCreate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
    admin_email: str = Depends(get_admin_email),
):
    blog = blog_service.create_blog(db, _sanitize_create(payload))
    audit_service.log(db, admin_email=admin_email, action="CREATE",
                      resource_type="blog", resource_id=str(blog.id),
                      detail=blog.title)
    return blog


@router.put("/{blog_id}", response_model=BlogResponse, dependencies=[Depends(require_csrf)])
def update_blog(
    blog_id: UUID,
    payload: BlogUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
    admin_email: str = Depends(get_admin_email),
):
    blog = blog_service.update_blog(db, blog_id, _sanitize_update(payload))
    audit_service.log(db, admin_email=admin_email, action="UPDATE",
                      resource_type="blog", resource_id=str(blog_id))
    return blog


@router.delete("/{blog_id}", dependencies=[Depends(require_csrf)])
def delete_blog(
    blog_id: UUID,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
    admin_email: str = Depends(get_admin_email),
):
    result = blog_service.delete_blog(db, blog_id)
    audit_service.log(db, admin_email=admin_email, action="DELETE",
                      resource_type="blog", resource_id=str(blog_id))
    return result