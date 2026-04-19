from pydantic import BaseModel

from app.schemas.goal import GoalResponse
from app.schemas.note import NoteResponse
from app.schemas.task import TaskResponse


class DashboardStats(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    total_goals: int
    total_notes: int


class DashboardSummary(BaseModel):
    stats: DashboardStats
    daily_focus: TaskResponse | None
    recent_tasks: list[TaskResponse]
    goals: list[GoalResponse]
    quick_notes: list[NoteResponse]


class DailyFocusResponse(BaseModel):
    daily_focus: TaskResponse | None
