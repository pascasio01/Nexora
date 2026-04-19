import json

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.portfolio import Portfolio
from app.models.user import User
from app.schemas.portfolio import PortfolioResponse, PortfolioUpdate
from app.schemas.user import UserResponse
from app.utils.deps import get_current_admin, get_current_user

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/portfolio", response_model=PortfolioResponse)
def get_my_portfolio(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter(Portfolio.owner_id == current_user.id).first()
    if not portfolio:
        portfolio = Portfolio(owner_id=current_user.id, about_me="", featured_projects_json="[]")
        db.add(portfolio)
        db.commit()
        db.refresh(portfolio)

    data = {
        "id": portfolio.id,
        "owner_id": portfolio.owner_id,
        "about_me": portfolio.about_me,
        "featured_projects": json.loads(portfolio.featured_projects_json or "[]"),
        "contact_email": portfolio.contact_email,
        "contact_linkedin": portfolio.contact_linkedin,
        "contact_github": portfolio.contact_github,
        "updated_at": portfolio.updated_at,
    }
    return PortfolioResponse(**data)


@router.put("/portfolio", response_model=PortfolioResponse)
def update_my_portfolio(
    payload: PortfolioUpdate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    portfolio = db.query(Portfolio).filter(Portfolio.owner_id == current_user.id).first()
    if not portfolio:
        portfolio = Portfolio(owner_id=current_user.id)
        db.add(portfolio)

    portfolio.about_me = payload.about_me
    portfolio.featured_projects_json = json.dumps([item.model_dump(mode="json") for item in payload.featured_projects])
    portfolio.contact_email = payload.contact_email
    portfolio.contact_linkedin = str(payload.contact_linkedin) if payload.contact_linkedin else None
    portfolio.contact_github = str(payload.contact_github) if payload.contact_github else None

    db.commit()
    db.refresh(portfolio)

    return PortfolioResponse(
        id=portfolio.id,
        owner_id=portfolio.owner_id,
        about_me=portfolio.about_me,
        featured_projects=json.loads(portfolio.featured_projects_json or "[]"),
        contact_email=portfolio.contact_email,
        contact_linkedin=portfolio.contact_linkedin,
        contact_github=portfolio.contact_github,
        updated_at=portfolio.updated_at,
    )
