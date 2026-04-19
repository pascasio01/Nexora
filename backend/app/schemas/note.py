from datetime import datetime

from pydantic import BaseModel, Field


class NoteBase(BaseModel):
    title: str = Field(min_length=1, max_length=180)
    content: str = Field(min_length=1)


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=180)
    content: str | None = Field(default=None, min_length=1)


class NoteResponse(NoteBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
