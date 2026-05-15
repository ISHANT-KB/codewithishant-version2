from pydantic import BaseModel
from uuid import UUID
from typing import Optional


class CheatsheetCreate(BaseModel):
    title: str
    slug: str
    category: str
    description: Optional[str] = None
    content: str


class CheatsheetUpdate(BaseModel):
    title: str
    slug: str
    category: str
    description: Optional[str] = None
    content: str


class CheatsheetResponse(BaseModel):
    id: UUID
    title: str
    slug: str
    category: str
    description: Optional[str] = None
    content: str

    model_config = {
        "from_attributes": True
    }
