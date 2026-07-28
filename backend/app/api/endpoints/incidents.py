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

@router.post("/seed", status_code=201)
def seed_incidents(db: Session = Depends(get_db)):
    """
    Seed database with mock incidents for testing.
    """
    # Check if we already have incidents
    if db.query(IncidentModel).first():
        return {"msg": "Database already seeded"}

    mock_incidents = [
        IncidentModel(
            title="Suspicious PowerShell Execution",
            description="Detected obfuscated PowerShell script execution attempting to contact a known malicious C2 domain.",
            severity="High",
            risk_score=94,
            status="Open",
            assigned_to=None
        ),
        IncidentModel(
            title="Multiple Failed Login Attempts",
            description="User j.doe experienced 50 failed login attempts within 5 minutes.",
            severity="Medium",
            risk_score=65,
            status="Investigating",
            assigned_to=uuid.uuid4() # Mock analyst ID
        ),
        IncidentModel(
            title="Volumetric DDoS Attack",
            description="UDP reflection attack targeting external load balancers. Traffic peaked at 45Gbps.",
            severity="Critical",
            risk_score=98,
            status="Resolved",
            assigned_to=uuid.uuid4()
        )
    ]
    
    for inc in mock_incidents:
        db.add(inc)
    
    db.commit()
    return {"msg": "Successfully seeded 3 mock incidents"}
