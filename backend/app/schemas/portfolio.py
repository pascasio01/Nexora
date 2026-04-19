from datetime import datetime

from pydantic import AnyHttpUrl, BaseModel, EmailStr


class FeaturedProjectItem(BaseModel):
    title: str
    description: str | None = None
    link_url: AnyHttpUrl | None = None


class PortfolioBase(BaseModel):
    about_me: str
    featured_projects: list[FeaturedProjectItem] = []
    contact_email: EmailStr | None = None
    contact_linkedin: AnyHttpUrl | None = None
    contact_github: AnyHttpUrl | None = None


class PortfolioUpdate(PortfolioBase):
    pass


class PortfolioResponse(PortfolioBase):
    id: int
    owner_id: int
    updated_at: datetime

    model_config = {"from_attributes": True}
