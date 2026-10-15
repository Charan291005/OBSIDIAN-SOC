import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Integer, Float, ForeignKey, Text, JSON, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base
import enum

class IncidentSeverity(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class IncidentStatus(str, enum.Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"
    CLOSED = "Closed"

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    severity = Column(Enum(IncidentSeverity), default=IncidentSeverity.MEDIUM)
    risk_score = Column(Integer, default=0) # 0-100 scale
    status = Column(Enum(IncidentStatus), default=IncidentStatus.OPEN)
    
    assigned_to = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=True)
    
    # Extended SOC Attributes
    host = Column(String(255), nullable=True, default="DESKTOP-492X")
    affected_user = Column(String(255), nullable=True, default="j.doe")
    source_ip = Column(String(50), nullable=True, default="192.168.1.105")
    mitre_techniques = Column(JSON, nullable=True)
    recommended_actions = Column(JSON, nullable=True)
    analyst_notes = Column(Text, nullable=True)
    timeline = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    assignee = relationship("User", backref="assigned_incidents")
