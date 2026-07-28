from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
import uuid

from app.database.session import get_db
from app.models.incident import Incident as IncidentModel
from app.schemas.incident import Incident, IncidentCreate

router = APIRouter()

@router.get("/", response_model=List[Incident])
def read_incidents(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Retrieve incidents.
    """
    incidents = db.query(IncidentModel).order_by(IncidentModel.created_at.desc()).offset(skip).limit(limit).all()
    return incidents

@router.get("/{incident_id}", response_model=Incident)
def read_incident(
    incident_id: uuid.UUID,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get incident by ID.
    """
    incident = db.query(IncidentModel).filter(IncidentModel.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident
