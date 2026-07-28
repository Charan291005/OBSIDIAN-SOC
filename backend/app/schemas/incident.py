from pydantic import BaseModel, UUID4
from typing import Optional
from datetime import datetime
from enum import Enum

class IncidentSeverity(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class IncidentStatus(str, Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"
    CLOSED = "Closed"

class IncidentBase(BaseModel):
    title: str
    description: Optional[str] = None
    severity: IncidentSeverity = IncidentSeverity.MEDIUM
    risk_score: int = 0
    status: IncidentStatus = IncidentStatus.OPEN
    assigned_to: Optional[UUID4] = None

class IncidentCreate(IncidentBase):
    pass

class Incident(IncidentBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
