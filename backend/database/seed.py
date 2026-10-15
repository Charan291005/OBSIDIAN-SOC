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

def ensure_schema_columns():
    from sqlalchemy import inspect, text
    try:
        inspector = inspect(engine)
        if "incidents" in inspector.get_table_names():
            existing_cols = [c["name"] for c in inspector.get_columns("incidents")]
            new_cols = {
                "host": "VARCHAR(255) DEFAULT 'DESKTOP-492X'",
                "affected_user": "VARCHAR(255) DEFAULT 'j.doe'",
                "source_ip": "VARCHAR(50) DEFAULT '192.168.1.105'",
                "mitre_techniques": "JSON",
                "recommended_actions": "JSON",
                "analyst_notes": "TEXT",
                "timeline": "JSON"
            }
            with engine.begin() as conn:
                for col_name, col_type in new_cols.items():
                    if col_name not in existing_cols:
                        print(f"[Migration] Adding missing column {col_name} to incidents table...")
                        try:
                            conn.execute(text(f"ALTER TABLE incidents ADD COLUMN {col_name} {col_type}"))
                        except Exception as alter_err:
                            print(f"[Migration Note] Column {col_name}: {alter_err}")
    except Exception as inspect_err:
        print(f"[Migration Note] Inspection: {inspect_err}")

def seed_database():
    # Make sure all tables exist
    try:
        import app.models
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"[Seed Note] Table creation check: {e}")

    ensure_schema_columns()

    db = SessionLocal()

    try:
        # 1. Seed or get Users
        admin_user = db.query(User).filter(User.email == "ceo@obsidiansoc.local").first()
        if not admin_user:
            admin_user = User(
                email="ceo@obsidiansoc.local",
                name="Executive Dash",
                password_hash=get_password_hash("demo123"),
                role=UserRole.ADMIN,
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)

        analyst_user = db.query(User).filter(User.email == "analyst@obsidiansoc.local").first()
        if not analyst_user:
            analyst_user = User(
                email="analyst@obsidiansoc.local",
                name="Lead Analyst",
                password_hash=get_password_hash("demo123"),
                role=UserRole.ANALYST,
            )
            db.add(analyst_user)
            db.commit()
            db.refresh(analyst_user)

        # 2. Check if incidents already exist
        existing_count = db.query(Incident).count()
        if existing_count > 0:
            # Check if existing incidents need backfill for newly added columns
            sample = db.query(Incident).first()
            if sample and (not sample.mitre_techniques or not sample.recommended_actions):
                print("Backfilling rich SOC fields for existing incidents...")
                for inc in db.query(Incident).all():
                    if not inc.host:
                        inc.host = "DESKTOP-492X"
                    if not inc.affected_user:
                        inc.affected_user = "j.doe"
                    if not inc.source_ip:
                        inc.source_ip = "192.168.1.105"
                    if not inc.mitre_techniques:
                        inc.mitre_techniques = [
                            {"id": "T1059.001", "name": "PowerShell", "tactic": "Execution"},
                            {"id": "T1027", "name": "Obfuscated Files", "tactic": "Defense Evasion"}
                        ]
                    if not inc.recommended_actions:
                        inc.recommended_actions = [
                            {"action": f"Isolate endpoint {inc.host or 'DESKTOP-492X'} from network", "completed": False},
                            {"action": "Block C2 domain and related IOCs at border gateway", "completed": False},
                            {"action": f"Rotate corporate credentials for {inc.affected_user or 'j.doe'}", "completed": False}
                        ]
                    if not inc.analyst_notes:
                        inc.analyst_notes = "Automated AI correlation detected suspicious beaconing activity."
                    if not inc.timeline:
                        inc.timeline = [
                            {"time": "09:12", "text": "Raw log ingestion from sensor-04", "actor": "Sensor"},
                            {"time": "09:13", "text": "AI heuristic matched Cobalt Strike profile", "actor": "Obsidian AI"},
                            {"time": "09:16", "text": "Incident escalated to High Priority", "actor": "System"}
                        ]
                db.commit()
            print(f"Database already populated ({existing_count} incidents). Ready.")
            return

        print("Seeding Enterprise SOC Incidents...")
        now = datetime.utcnow()
        incidents_data = [
            {
                "title": "Suspicious PowerShell Execution (Cobalt Strike)",
                "description": "Obfuscated PowerShell command executed on DESKTOP-492X connecting to a known malicious C2 domain.",
                "severity": IncidentSeverity.CRITICAL,
                "risk_score": 98,
                "status": IncidentStatus.IN_PROGRESS,
                "assigned_to": analyst_user.id,
                "host": "DESKTOP-492X",
                "affected_user": "j.doe",
                "source_ip": "192.168.1.105",
                "mitre_techniques": [
                    {"id": "T1059.001", "name": "PowerShell", "tactic": "Execution"},
                    {"id": "T1027", "name": "Obfuscated Files or Information", "tactic": "Defense Evasion"},
                    {"id": "T1071.001", "name": "Web Protocols C2", "tactic": "Command and Control"}
                ],
                "recommended_actions": [
                    {"action": "Isolate host 192.168.1.105 (DESKTOP-492X) from corporate network", "completed": True},
                    {"action": "Block domain communication to evil-c2-listener.xyz at perimeter firewall", "completed": False},
                    {"action": "Extract process memory dump and terminate suspicious powershell.exe", "completed": False},
                    {"action": "Force credential reset and revoke Kerberos TGT for user j.doe", "completed": False}
                ],
                "analyst_notes": "Tier 2 analyst reviewed the payload. Script decoded to a Cobalt Strike stager downloading second-stage beacon. Containment initiated.",
                "timeline": [
                    {"time": "09:12", "text": "Sysmon Event 1 detected: powershell.exe with -enc argument", "actor": "EDR Sensor"},
                    {"time": "09:13", "text": "AI behavioral engine matched Cobalt Strike beaconing pattern", "actor": "Obsidian AI"},
                    {"time": "09:16", "text": "Incident auto-created with 98 Risk Score", "actor": "System"},
                    {"time": "09:20", "text": "Lead Analyst assigned and initiated host isolation", "actor": "Lead Analyst"}
                ],
                "created_at": now - timedelta(hours=2)
            },
            {
                "title": "Multiple Failed Login Attempts (Brute Force)",
                "description": "50+ failed login attempts detected on service account svc_backup within 5 minutes from anomalous external IP.",
                "severity": IncidentSeverity.MEDIUM,
                "risk_score": 58,
                "status": IncidentStatus.OPEN,
                "assigned_to": None,
                "host": "AUTH-SRV-01",
                "affected_user": "svc_backup",
                "source_ip": "185.220.101.5",
                "mitre_techniques": [
                    {"id": "T1110.001", "name": "Password Guessing", "tactic": "Credential Access"},
                    {"id": "T1078", "name": "Valid Accounts", "tactic": "Defense Evasion"}
                ],
                "recommended_actions": [
                    {"action": "Temporarily lock service account svc_backup", "completed": False},
                    {"action": "Block IP 185.220.101.5 at Edge WAF", "completed": True},
                    {"action": "Verify if MFA is enforced on all remote authentication endpoints", "completed": False}
                ],
                "analyst_notes": "Origin IP correlates with a Tor exit node. No successful authentication observed.",
                "timeline": [
                    {"time": "08:45", "text": "Rapid authentication failure alert triggered", "actor": "Auth Gateway"},
                    {"time": "08:46", "text": "Obsidian SOC correlated 52 failed attempts", "actor": "System"}
                ],
                "created_at": now - timedelta(hours=4)
            },
            {
                "title": "Volumetric UDP Reflection DDoS Attack",
                "description": "UDP reflection attack targeting external load balancers. Inbound bandwidth peaked at 45Gbps.",
                "severity": IncidentSeverity.CRITICAL,
                "risk_score": 98,
                "status": IncidentStatus.RESOLVED,
                "assigned_to": analyst_user.id,
                "host": "EDGE-LB-US-EAST",
                "affected_user": "infrastructure",
                "source_ip": "Distributed (10,400+ IPs)",
                "mitre_techniques": [
                    {"id": "T1498.001", "name": "Direct Network Flood", "tactic": "Impact"},
                    {"id": "T1498.002", "name": "Reflection Amplification", "tactic": "Impact"}
                ],
                "recommended_actions": [
                    {"action": "Engage cloud DDoS mitigation scrubbing center", "completed": True},
                    {"action": "Apply rate-limiting ACL on NTP and DNS amplification vectors", "completed": True},
                    {"action": "Validate upstream ISP BGP flowspec routes", "completed": True}
                ],
                "analyst_notes": "Automated mitigation rules routed traffic through scrubbing center. Service restored within 8 minutes.",
                "timeline": [
                    {"time": "06:10", "text": "Traffic anomaly: 45Gbps inbound UDP spike", "actor": "NetFlow"},
                    {"time": "06:12", "text": "Automated BGP diversion to scrubbing center", "actor": "DDoS Shield"},
                    {"time": "06:20", "text": "Traffic returned to baseline, incident resolved", "actor": "Lead Analyst"}
                ],
                "created_at": now - timedelta(hours=6)
            },
            {
                "title": "Data Exfiltration Anomaly to Unknown External IP",
                "description": "Unusual outbound traffic spike (4.2GB) to an unclassified IP address in Eastern Europe over encrypted port 8443.",
                "severity": IncidentSeverity.HIGH,
                "risk_score": 85,
                "status": IncidentStatus.OPEN,
                "assigned_to": None,
                "host": "FIN-SRV-04",
                "affected_user": "svc_sql",
                "source_ip": "10.0.12.44",
                "mitre_techniques": [
                    {"id": "T1048.003", "name": "Exfiltration Over Unencrypted/Encrypted Non-C2 Protocol", "tactic": "Exfiltration"},
                    {"id": "T1041", "name": "Exfiltration Over C2 Channel", "tactic": "Exfiltration"}
                ],
                "recommended_actions": [
                    {"action": "Sever outbound connection to destination IP at border router", "completed": False},
                    {"action": "Initiate forensic capture on FIN-SRV-04 file access logs", "completed": False},
                    {"action": "Audit database export queries run by svc_sql in past 24 hours", "completed": False}
                ],
                "analyst_notes": "Outbound transfer occurred outside standard maintenance window. Awaiting network packet capture review.",
                "timeline": [
                    {"time": "05:00", "text": "NetFlow volume threshold exceeded: 4.2GB outbound", "actor": "Zeek Sensor"},
                    {"time": "05:02", "text": "AI tagged anomaly as potential high-risk data exfiltration", "actor": "Obsidian AI"}
                ],
                "created_at": now - timedelta(hours=7)
            },
            {
                "title": "Potential Credential Dumping via LSASS Memory Access",
                "description": "Unsigned process minidump.exe attempted to open handles to lsass.exe process memory space.",
                "severity": IncidentSeverity.CRITICAL,
                "risk_score": 94,
                "status": IncidentStatus.OPEN,
                "assigned_to": analyst_user.id,
                "host": "WKS-DEV-99",
                "affected_user": "m.smith",
                "source_ip": "10.0.8.21",
                "mitre_techniques": [
                    {"id": "T1003.001", "name": "LSASS Memory Dumping", "tactic": "Credential Access"},
                    {"id": "T1057", "name": "Process Discovery", "tactic": "Discovery"}
                ],
                "recommended_actions": [
                    {"action": "Block minidump.exe hash across all corporate endpoints via EDR", "completed": True},
                    {"action": "Isolate WKS-DEV-99 for forensic memory triage", "completed": False},
                    {"action": "Invalidate domain admin Kerberos tickets", "completed": False}
                ],
                "analyst_notes": "Sysmon event ID 10 detected PROCESS_ALL_ACCESS right requested on lsass.exe PID.",
                "timeline": [
                    {"time": "11:05", "text": "Sysmon Event 10: LSASS memory access denied by EDR", "actor": "EDR Sensor"},
                    {"time": "11:06", "text": "Obsidian AI classified as high-confidence Mimikatz/Dumping attempt", "actor": "Obsidian AI"}
                ],
                "created_at": now - timedelta(minutes=45)
            }
        ]

        for inc_data in incidents_data:
            incident = Incident(**inc_data)
            db.add(incident)

        db.commit()
        print(f"Database seeded successfully with {len(incidents_data)} enterprise SOC incidents!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

