from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Any, Optional
import uuid
from datetime import datetime

from app.database.session import get_db
from app.models.incident import Incident as IncidentModel, IncidentSeverity, IncidentStatus
from app.schemas.incident import Incident, IncidentCreate, IncidentUpdate

router = APIRouter()

@router.get("/", response_model=List[Incident])
def read_incidents(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None, description="Search term for title or description"),
    severity: Optional[str] = Query(None, description="Filter by severity"),
    status: Optional[str] = Query(None, description="Filter by status")
) -> Any:
    """
    Retrieve incidents with optional search, severity, and status filtering.
    """
    query = db.query(IncidentModel)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                IncidentModel.title.ilike(search_filter),
                IncidentModel.description.ilike(search_filter),
                IncidentModel.host.ilike(search_filter),
                IncidentModel.affected_user.ilike(search_filter)
            )
        )
    
    if severity and severity.lower() != "all":
        query = query.filter(IncidentModel.severity.ilike(severity))
        
    if status and status.lower() != "all":
        query = query.filter(IncidentModel.status.ilike(status))

    incidents = query.order_by(IncidentModel.created_at.desc()).offset(skip).limit(limit).all()
    return incidents

@router.post("/", response_model=Incident, status_code=status.HTTP_201_CREATED)
def create_incident(
    incident_in: IncidentCreate,
    db: Session = Depends(get_db)
) -> Any:
    """
    Create a new incident.
    """
    incident = IncidentModel(
        title=incident_in.title,
        description=incident_in.description,
        severity=incident_in.severity,
        risk_score=incident_in.risk_score,
        status=incident_in.status,
        assigned_to=incident_in.assigned_to,
        host=incident_in.host or "DESKTOP-492X",
        affected_user=incident_in.affected_user or "j.doe",
        source_ip=incident_in.source_ip or "192.168.1.105",
        mitre_techniques=incident_in.mitre_techniques or [
            {"id": "T1059.001", "name": "PowerShell", "tactic": "Execution"},
            {"id": "T1027", "name": "Obfuscated Files or Information", "tactic": "Defense Evasion"}
        ],
        recommended_actions=incident_in.recommended_actions or [
            {"action": f"Isolate host {incident_in.host or 'DESKTOP-492X'} from corporate network", "completed": False},
            {"action": "Block C2 domain and associated IPs at the firewall perimeter", "completed": False},
            {"action": f"Force password reset and revoke active sessions for {incident_in.affected_user or 'j.doe'}", "completed": False}
        ],
        analyst_notes=incident_in.analyst_notes or "Case opened for SOC tier-2 investigation.",
        timeline=incident_in.timeline or [
            {"time": datetime.utcnow().strftime("%H:%M"), "text": "Incident detected & ticket created", "actor": "Obsidian AI"}
        ]
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident

@router.get("/{incident_id}", response_model=Incident)
def read_incident(
    incident_id: str,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get incident by ID (supports string UUID).
    """
    try:
        val_uuid = uuid.UUID(incident_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid incident UUID format")
        
    incident = db.query(IncidentModel).filter(IncidentModel.id == val_uuid).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident

@router.patch("/{incident_id}", response_model=Incident)
def update_incident(
    incident_id: str,
    incident_in: IncidentUpdate,
    db: Session = Depends(get_db)
) -> Any:
    """
    Update incident fields (e.g. status, analyst assignment, notes, actions).
    """
    try:
        val_uuid = uuid.UUID(incident_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid incident UUID format")

    incident = db.query(IncidentModel).filter(IncidentModel.id == val_uuid).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    update_data = incident_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(incident, field, value)

    incident.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(incident)
    return incident

@router.post("/{incident_id}/notes", response_model=Incident)
def add_incident_note(
    incident_id: str,
    payload: dict,
    db: Session = Depends(get_db)
) -> Any:
    """
    Save or append analyst notes to an incident.
    """
    try:
        val_uuid = uuid.UUID(incident_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid incident UUID format")

    incident = db.query(IncidentModel).filter(IncidentModel.id == val_uuid).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    note_text = payload.get("note", "").strip()
    if not note_text:
        raise HTTPException(status_code=400, detail="Note text cannot be empty")

    incident.analyst_notes = note_text
    incident.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(incident)
    return incident

@router.post("/seed", status_code=201)
def seed_incidents(db: Session = Depends(get_db)):
    """
    Seed database with realistic mock SOC incidents.
    """
    from database.seed import seed_database
    seed_database()
    return {"msg": "Database seeded successfully with enterprise SOC incidents"}

