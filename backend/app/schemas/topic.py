from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class TopicCreate(BaseModel):
    name: str
    # slug: str
    description: Optional[str] = None
    parent_id: Optional[UUID] = None


class TopicUpdate(BaseModel):
    name: str
    description: Optional[str] = None
    parent_id: Optional[UUID] = None


class TopicResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str]
    parent_id: Optional[UUID]

    model_config = {
        "from_attributes": True
    }
