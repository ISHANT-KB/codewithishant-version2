from pydantic import BaseModel, HttpUrl
from typing import Optional
from uuid import UUID
from datetime import datetime


class BlogCreate(BaseModel):
    title:     str
    excerpt:   Optional[str]  = None
    content:   str
    cover_url: Optional[str]  = None
    published: bool           = False


class BlogUpdate(BaseModel):
    title:     Optional[str]  = None
    excerpt:   Optional[str]  = None
    content:   Optional[str]  = None
    cover_url: Optional[str]  = None
    published: Optional[bool] = None


class BlogResponse(BaseModel):
    id:         UUID
    title:      str
    slug:       str
    excerpt:    Optional[str]
    content:    str
    cover_url:  Optional[str]
    published:  bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class BlogListResponse(BaseModel):
    """Lightweight — no content field for list views."""
    id:         UUID
    title:      str
    slug:       str
    excerpt:    Optional[str]
    cover_url:  Optional[str]
    published:  bool
    created_at: datetime

    model_config = {"from_attributes": True}