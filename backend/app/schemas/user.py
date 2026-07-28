from pydantic import BaseModel, EmailStr, UUID4
from typing import Optional
from datetime import datetime
from app.models.user import UserRole

# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    name: str
    company: Optional[str] = None
    timezone: Optional[str] = "UTC"
    theme: Optional[str] = "dark"

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str

# Properties to receive via API on update
class UserUpdate(BaseModel):
    name: Optional[str] = None
    password: Optional[str] = None
    company: Optional[str] = None
    timezone: Optional[str] = None
    theme: Optional[str] = None

class UserInDBBase(UserBase):
    id: UUID4
    role: UserRole
    avatar: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Additional properties to return via API
class User(UserInDBBase):
    pass

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None
