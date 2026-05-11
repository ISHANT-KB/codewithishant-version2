from pydantic import BaseModel
from typing import List

from .topic import TopicResponse
from .note import NoteResponse


class TopicFullResponse(BaseModel):
    topic: TopicResponse
    notes: List[NoteResponse]

    model_config = {
        "from_attributes": True
    }