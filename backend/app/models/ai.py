import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base

class AIReport(Base):
    __tablename__ = "ai_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_id = Column(UUID(as_uuid=True), ForeignKey('incidents.id'), nullable=False)
    
    executive_summary = Column(Text, nullable=False)
    root_cause = Column(Text, nullable=True)
    recommendations = Column(JSON, nullable=True) # List of strings or structured data
    mitre_mapping = Column(JSON, nullable=True)
    confidence = Column(Float, nullable=True) # 0 to 1
    
    generated_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    incident = relationship("Incident", backref="ai_reports")

class AIChat(Base):
    __tablename__ = "ai_chats"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    
    question = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    context = Column(JSON, nullable=True) # References to logs or incidents
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    user = relationship("User", backref="ai_chats")
