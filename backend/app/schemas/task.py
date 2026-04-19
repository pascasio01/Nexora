from datetime import date, datetime

from pydantic import BaseModel, Field

from app.models.task import TaskPriority, TaskStatus


class TaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=180)
    description: str | None = None
    priority: TaskPriority = TaskPriority.medium
    status: TaskStatus = TaskStatus.pending
    due_date: date | None = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=180)
    description: str | None = None
    priority: TaskPriority | None = None
    status: TaskStatus | None = None
    due_date: date | None = None


class TaskResponse(TaskBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
