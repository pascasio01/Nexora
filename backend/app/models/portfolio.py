from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Portfolio(Base):
    __tablename__ = "portfolios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    about_me: Mapped[str] = mapped_column(Text, default="", nullable=False)
    featured_projects_json: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    contact_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    contact_linkedin: Mapped[str | None] = mapped_column(String(255), nullable=True)
    contact_github: Mapped[str | None] = mapped_column(String(255), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    owner = relationship("User", back_populates="portfolios")
