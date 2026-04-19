from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    is_admin: bool
    created_at: datetime

    model_config = {"from_attributes": True}
