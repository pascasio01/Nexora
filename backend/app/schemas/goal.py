from datetime import datetime

from pydantic import BaseModel, Field


class GoalBase(BaseModel):
    title: str = Field(min_length=1, max_length=180)
    description: str | None = None


class GoalCreate(GoalBase):
    pass


class GoalUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=180)
    description: str | None = None


class GoalResponse(GoalBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
