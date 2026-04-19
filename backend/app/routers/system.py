from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.goal import Goal
from app.models.note import Note
from app.models.task import Task, TaskStatus
from app.models.user import User
from app.schemas.dashboard import DailyFocusResponse, DashboardStats, DashboardSummary
from app.services.daily_focus import pick_daily_focus
from app.utils.deps import get_current_user

router = APIRouter(prefix="/system", tags=["system"])


@router.get("/daily-focus", response_model=DailyFocusResponse)
def daily_focus(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    tasks = db.query(Task).filter(Task.owner_id == current_user.id).all()
    focus = pick_daily_focus(tasks)
    return DailyFocusResponse(daily_focus=focus)


@router.get("/dashboard-summary", response_model=DashboardSummary)
def dashboard_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    tasks = db.query(Task).filter(Task.owner_id == current_user.id).order_by(Task.created_at.desc()).all()
    goals = db.query(Goal).filter(Goal.owner_id == current_user.id).order_by(Goal.created_at.desc()).limit(5).all()
    notes = db.query(Note).filter(Note.owner_id == current_user.id).order_by(Note.created_at.desc()).limit(5).all()

    stats = DashboardStats(
        total_tasks=len(tasks),
        completed_tasks=len([task for task in tasks if task.status == TaskStatus.completed]),
        pending_tasks=len([task for task in tasks if task.status != TaskStatus.completed]),
        total_goals=db.query(Goal).filter(Goal.owner_id == current_user.id).count(),
        total_notes=db.query(Note).filter(Note.owner_id == current_user.id).count(),
    )

    return DashboardSummary(
        stats=stats,
        daily_focus=pick_daily_focus(tasks),
        recent_tasks=tasks[:5],
        goals=goals,
        quick_notes=notes,
    )
