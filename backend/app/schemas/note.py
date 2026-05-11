from pydantic import BaseModel
from uuid import UUID

class NoteCreate(BaseModel):
    title: str
    content: str
    topic_id: UUID

class NoteResponse(BaseModel):
    id: UUID
    title: str
    content: str
    topic_id: UUID

    model_config = {
        "from_attributes": True
    }

class NoteUpdate(BaseModel):
    title: str
    content: str
    topic_id: UUID