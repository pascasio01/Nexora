from datetime import datetime

from pydantic import AnyHttpUrl, BaseModel, Field


class ProjectBase(BaseModel):
    title: str = Field(min_length=1, max_length=180)
    description: str | None = None
    image_url: AnyHttpUrl | None = None
    link_url: AnyHttpUrl | None = None
    featured: bool = False


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=180)
    description: str | None = None
    image_url: AnyHttpUrl | None = None
    link_url: AnyHttpUrl | None = None
    featured: bool | None = None


class ProjectResponse(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
