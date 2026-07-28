import sys
import os

# Add the root directory to sys.path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.session import SessionLocal, engine
from app.models.base import Base
from app.models.user import User, UserRole
from app.models.incident import Incident, IncidentSeverity, IncidentStatus
from app.auth.security import get_password_hash
from datetime import datetime, timedelta

def seed_database():
    db = SessionLocal()

    try:
        # Check if users already exist
        if db.query(User).first():
            print("Database already seeded. Skipping...")
            return

        print("Seeding Users...")
        # Create Demo Users
        admin_user = User(
            email="ceo@obsidiansoc.local",
            name="Executive Dash",
            password_hash=get_password_hash("demo123"),
            role=UserRole.ADMIN,
        )
        
        analyst_user = User(
            email="analyst@obsidiansoc.local",
            name="Lead Analyst",
            password_hash=get_password_hash("demo123"),
            role=UserRole.ANALYST,
        )
        
        db.add(admin_user)
        db.add(analyst_user)
        db.commit()
        db.refresh(admin_user)
        db.refresh(analyst_user)

        print("Seeding Incidents...")
        now = datetime.utcnow()
        incidents_data = [
            {
                "title": "Suspicious PowerShell Execution (Cobalt Strike)",
                "description": "Obfuscated PowerShell command executed on DESKTOP-492X connecting to a known malicious C2 domain.",
                "severity": IncidentSeverity.CRITICAL,
                "risk_score": 98,
                "status": IncidentStatus.IN_PROGRESS,
                "assigned_to": analyst_user.id,
                "created_at": now - timedelta(hours=2)
            },
            {
                "title": "Multiple Failed Login Attempts",
                "description": "50+ failed login attempts detected on service account svc_backup within 5 minutes.",
                "severity": IncidentSeverity.MEDIUM,
                "risk_score": 45,
                "status": IncidentStatus.OPEN,
                "assigned_to": None,
                "created_at": now - timedelta(hours=4)
            },
            {
                "title": "Data Exfiltration Anomaly",
                "description": "Unusual outbound traffic spike (4.2GB) to an unknown IP address in Russia.",
                "severity": IncidentSeverity.HIGH,
                "risk_score": 85,
                "status": IncidentStatus.OPEN,
                "assigned_to": None,
                "created_at": now - timedelta(hours=5)
            },
            {
                "title": "Unexpected Service Creation",
                "description": "A new service 'WindowsUpdaterCore' was created by a non-admin user.",
                "severity": IncidentSeverity.LOW,
                "risk_score": 21,
                "status": IncidentStatus.CLOSED,
                "assigned_to": analyst_user.id,
                "created_at": now - timedelta(days=1)
            },
            {
                "title": "Potential Credential Dumping (LSASS)",
                "description": "Process minidump.exe accessed lsass.exe memory space.",
                "severity": IncidentSeverity.CRITICAL,
                "risk_score": 94,
                "status": IncidentStatus.OPEN,
                "assigned_to": None,
                "created_at": now - timedelta(minutes=45)
            }
        ]

        for inc_data in incidents_data:
            incident = Incident(**inc_data)
            db.add(incident)

        db.commit()
        print("Database seeded successfully with Demo Workspace data!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
