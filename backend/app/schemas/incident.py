from pydantic import BaseModel, UUID4
from typing import Optional, List, Dict, Any
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
    host: Optional[str] = "DESKTOP-492X"
    affected_user: Optional[str] = "j.doe"
    source_ip: Optional[str] = "192.168.1.105"
    mitre_techniques: Optional[List[Dict[str, Any]]] = None
    recommended_actions: Optional[List[Dict[str, Any]]] = None
    analyst_notes: Optional[str] = None
    timeline: Optional[List[Dict[str, Any]]] = None

class IncidentCreate(IncidentBase):
    pass

class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[IncidentSeverity] = None
    risk_score: Optional[int] = None
    status: Optional[IncidentStatus] = None
    assigned_to: Optional[UUID4] = None
    host: Optional[str] = None
    affected_user: Optional[str] = None
    source_ip: Optional[str] = None
    mitre_techniques: Optional[List[Dict[str, Any]]] = None
    recommended_actions: Optional[List[Dict[str, Any]]] = None
    analyst_notes: Optional[str] = None
    timeline: Optional[List[Dict[str, Any]]] = None

class Incident(IncidentBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

