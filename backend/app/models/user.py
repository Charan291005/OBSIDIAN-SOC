import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Enum, Boolean, func
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "Administrator"
    ANALYST = "Security Analyst"
    VIEWER = "Viewer"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.VIEWER, nullable=False)
    avatar = Column(String(1024), nullable=True)
    company = Column(String(255), nullable=True)
    timezone = Column(String(50), default="UTC")
    theme = Column(String(20), default="dark")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
