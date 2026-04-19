from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.routers import auth, goals, notes, projects, system, tasks, users

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Nexora Lite API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def healthcheck():
    return {"status": "ok", "service": "Nexora Lite API"}


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(tasks.router)
app.include_router(goals.router)
app.include_router(notes.router)
app.include_router(projects.router)
app.include_router(system.router)
