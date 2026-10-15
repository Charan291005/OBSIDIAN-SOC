from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
import uuid
import json
import csv
import io
import re
from datetime import datetime

from app.database.session import get_db
from app.models.incident import Incident as IncidentModel, IncidentSeverity, IncidentStatus

router = APIRouter()

# Heuristics rules for security threats in raw logs
THREAT_PATTERNS = [
    {
        "pattern": r"(powershell.*-enc|bypass.*iex|downloadstring|invoke-webrequest.*http)",
        "name": "Suspicious PowerShell Execution (Stager Detected)",
        "severity": IncidentSeverity.CRITICAL,
        "risk_score": 96,
        "mitre_id": "T1059.001",
        "mitre_name": "PowerShell Execution",
        "tactic": "Execution"
    },
    {
        "pattern": r"(lsass\.exe|mimikatz|sekurlsa|minidump\.exe|procdump)",
        "name": "Credential Access Attempt (LSASS Memory Read)",
        "severity": IncidentSeverity.CRITICAL,
        "risk_score": 95,
        "mitre_id": "T1003.001",
        "mitre_name": "LSASS Memory Dumping",
        "tactic": "Credential Access"
    },
    {
        "pattern": r"(failed password|failed login|authentication failure|status=failed)",
        "name": "Authentication Anomaly (Brute Force Detection)",
        "severity": IncidentSeverity.HIGH,
        "risk_score": 78,
        "mitre_id": "T1110",
        "mitre_name": "Brute Force",
        "tactic": "Credential Access"
    },
    {
        "pattern": r"(beaconing|c2_domain|malicious_ip|185\.158\.24|evil-c2)",
        "name": "Command and Control Traffic (C2 Beaconing)",
        "severity": IncidentSeverity.CRITICAL,
        "risk_score": 94,
        "mitre_id": "T1071.001",
        "mitre_name": "Web Protocols C2",
        "tactic": "Command and Control"
    },
    {
        "pattern": r"(syn flood|udp reflection|amplification attack|ddos spike)",
        "name": "Volumetric Denial of Service Pattern",
        "severity": IncidentSeverity.HIGH,
        "risk_score": 88,
        "mitre_id": "T1498",
        "mitre_name": "Network Denial of Service",
        "tactic": "Impact"
    }
]

def parse_log_content(content_str: str, filename: str) -> List[Dict[str, Any]]:
    """
    Parses JSON, CSV, or plain text / syslog lines.
    """
    parsed = []
    
    # 1. Try parsing JSON
    try:
        data = json.loads(content_str)
        if isinstance(data, list):
            for idx, item in enumerate(data[:150]):
                parsed.append({
                    "id": idx + 1,
                    "timestamp": item.get("timestamp", datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")),
                    "source_ip": item.get("source_ip", item.get("src_ip", "192.168.1.45")),
                    "event_type": item.get("event", item.get("event_type", "SECURITY_EVENT")),
                    "message": item.get("message", json.dumps(item)),
                    "raw": json.dumps(item)
                })
            return parsed
    except Exception:
        pass

    # 2. Try parsing CSV
    if filename.endswith(".csv") or "," in content_str[:200]:
        try:
            reader = csv.DictReader(io.StringIO(content_str))
            for idx, row in enumerate(reader):
                if idx >= 150:
                    break
                parsed.append({
                    "id": idx + 1,
                    "timestamp": row.get("timestamp", row.get("Time", datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"))),
                    "source_ip": row.get("source_ip", row.get("src_ip", row.get("IP", "192.168.1.100"))),
                    "event_type": row.get("event", row.get("EventID", "LOG_RECORD")),
                    "message": " | ".join(f"{k}:{v}" for k, v in list(row.items())[:4]),
                    "raw": str(row)
                })
            if parsed:
                return parsed
        except Exception:
            pass

    # 3. Fallback: Parse line-by-line (Syslog / Text format)
    lines = content_str.splitlines()
    for idx, line in enumerate(lines[:150]):
        clean_line = line.strip()
        if not clean_line:
            continue
        
        # Extract IP address if present
        ip_match = re.search(r"\b(?:\d{1,3}\.){3}\d{1,3}\b", clean_line)
        src_ip = ip_match.group(0) if ip_match else "10.0.4.12"
        
        parsed.append({
            "id": idx + 1,
            "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
            "source_ip": src_ip,
            "event_type": "SYSLOG_EVENT",
            "message": clean_line[:180],
            "raw": clean_line
        })

    return parsed

@router.post("/upload")
async def upload_and_parse_logs(
    file: Optional[UploadFile] = File(None),
    raw_logs: Optional[str] = Form(None),
    filename_override: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Ingests logs, extracts security events, runs heuristic threat detection,
    and automatically creates an Incident if malicious behavior is identified.
    """
    filename = filename_override or (file.filename if file else "security_event_log.log")
    
    if file:
        content_bytes = await file.read()
        content_str = content_bytes.decode("utf-8", errors="replace")
    elif raw_logs:
        content_str = raw_logs
    else:
        raise HTTPException(status_code=400, detail="No file or log content provided.")

    parsed_events = parse_log_content(content_str, filename)
    
    if not parsed_events:
        raise HTTPException(status_code=400, detail="Unable to extract log records from provided input.")

    # Run Threat Detection across all parsed logs
    detected_threats = []
    matched_rules = set()

    for event in parsed_events:
        text_to_scan = (event["message"] + " " + event["raw"]).lower()
        for rule in THREAT_PATTERNS:
            if re.search(rule["pattern"], text_to_scan, re.IGNORECASE):
                if rule["name"] not in matched_rules:
                    matched_rules.add(rule["name"])
                    detected_threats.append(rule)

    created_incident = None
    if detected_threats:
        # Pick the highest severity threat to trigger incident creation
        primary_threat = sorted(detected_threats, key=lambda x: x["risk_score"], reverse=True)[0]
        
        now = datetime.utcnow()
        new_inc = IncidentModel(
            title=primary_threat["name"],
            description=f"Auto-generated by Obsidian Log Ingress from file '{filename}'. Detected {len(detected_threats)} distinct threat signature(s). Primary IOC: {primary_threat['mitre_name']}.",
            severity=primary_threat["severity"],
            risk_score=primary_threat["risk_score"],
            status=IncidentStatus.OPEN,
            host=f"ENDPOINT-{parsed_events[0]['source_ip'].replace('.', '-')}",
            affected_user="sec_ops",
            source_ip=parsed_events[0]["source_ip"],
            mitre_techniques=[
                {
                    "id": t["mitre_id"],
                    "name": t["mitre_name"],
                    "tactic": t["tactic"]
                }
                for t in detected_threats
            ],
            recommended_actions=[
                {"action": f"Isolate host connected to {parsed_events[0]['source_ip']}", "completed": False},
                {"action": f"Review {filename} full packet timeline in SIEM", "completed": False},
                {"action": "Deploy preventative firewall blocking rules for matched IOCs", "completed": False}
            ],
            analyst_notes=f"Automated incident generated via log ingress file '{filename}'.",
            timeline=[
                {"time": now.strftime("%H:%M"), "text": f"File '{filename}' ingested ({len(parsed_events)} entries)", "actor": "Ingress Pipeline"},
                {"time": now.strftime("%H:%M"), "text": f"Matched signature: {primary_threat['name']}", "actor": "Obsidian AI Engine"}
            ]
        )
        db.add(new_inc)
        db.commit()
        db.refresh(new_inc)
        
        created_incident = {
            "id": str(new_inc.id),
            "title": new_inc.title,
            "severity": str(new_inc.severity.value if hasattr(new_inc.severity, "value") else new_inc.severity),
            "risk_score": new_inc.risk_score
        }

    return {
        "status": "success",
        "filename": filename,
        "total_records_parsed": len(parsed_events),
        "threats_detected_count": len(detected_threats),
        "detected_threats": [t["name"] for t in detected_threats],
        "created_incident": created_incident,
        "sample_parsed_events": parsed_events[:15]
    }
