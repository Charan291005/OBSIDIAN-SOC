import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base

class ParsedLog(Base):
    __tablename__ = "parsed_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    file_id = Column(UUID(as_uuid=True), ForeignKey('uploaded_files.id'), nullable=False)
    
    timestamp = Column(DateTime(timezone=True), nullable=True, index=True)
    source_ip = Column(String(50), nullable=True, index=True)
    destination_ip = Column(String(50), nullable=True)
    username = Column(String(255), nullable=True)
    hostname = Column(String(255), nullable=True)
    severity = Column(String(50), nullable=True, index=True)
    event_type = Column(String(100), nullable=True, index=True)
    message = Column(Text, nullable=True)
    raw_log = Column(Text, nullable=False)
    
    source_file = relationship("UploadedFile", backref="parsed_logs")
