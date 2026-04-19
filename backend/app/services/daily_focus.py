from datetime import date

from app.models.task import Task, TaskPriority, TaskStatus


def _priority_score(priority: TaskPriority) -> int:
    if priority == TaskPriority.high:
        return 3
    if priority == TaskPriority.medium:
        return 2
    return 1


def pick_daily_focus(tasks: list[Task]) -> Task | None:
    pending_tasks = [task for task in tasks if task.status != TaskStatus.completed]
    if not pending_tasks:
        return None

    def score(task: Task) -> tuple[int, int]:
        due_bonus = 1 if task.due_date and task.due_date <= date.today() else 0
        return (_priority_score(task.priority), due_bonus)

    return sorted(pending_tasks, key=score, reverse=True)[0]
