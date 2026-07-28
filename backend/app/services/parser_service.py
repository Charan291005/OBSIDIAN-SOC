import json
import csv
import re
from datetime import datetime
from io import StringIO
from fastapi import UploadFile, HTTPException

def parse_log_file(content: str, filename: str) -> list[dict]:
    """
    Parses different log formats into a normalized structure.
    Supported extensions: .json, .csv, .log, .txt
    """
    normalized_logs = []
    
    if filename.endswith('.json'):
        try:
            data = json.loads(content)
            # Handle array of logs or single object
            if isinstance(data, dict):
                data = [data]
            
            for item in data:
                normalized_logs.append({
                    "timestamp": item.get("timestamp") or item.get("time") or datetime.utcnow().isoformat(),
                    "source_ip": item.get("source_ip") or item.get("src_ip"),
                    "destination_ip": item.get("destination_ip") or item.get("dst_ip"),
                    "username": item.get("username") or item.get("user"),
                    "hostname": item.get("hostname") or item.get("host"),
                    "severity": item.get("severity") or item.get("level", "INFO"),
                    "event_type": item.get("event_type") or item.get("type", "Unknown"),
                    "message": item.get("message") or item.get("msg", ""),
                    "raw_log": json.dumps(item)
                })
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON format.")
            
    elif filename.endswith('.csv'):
        reader = csv.DictReader(StringIO(content))
        for row in reader:
            normalized_logs.append({
                "timestamp": row.get("timestamp", datetime.utcnow().isoformat()),
                "source_ip": row.get("source_ip"),
                "destination_ip": row.get("destination_ip"),
                "username": row.get("username"),
                "hostname": row.get("hostname"),
                "severity": row.get("severity", "INFO"),
                "event_type": row.get("event_type", "Unknown"),
                "message": row.get("message", ""),
                "raw_log": json.dumps(row)
            })
            
    elif filename.endswith('.log') or filename.endswith('.txt'):
        # Fallback to a generic regex pattern or simple line parsing
        # Real-world implementations would use grok or strict regex patterns per log type
        for line in content.splitlines():
            if not line.strip():
                continue
            
            # Very basic unstructured parsing (assumes syslogs loosely)
            # Timestamp usually at the beginning, IPs might be present
            ip_pattern = r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
            ips = re.findall(ip_pattern, line)
            
            normalized_logs.append({
                "timestamp": datetime.utcnow().isoformat(), # Difficult to extract reliably without grok
                "source_ip": ips[0] if len(ips) > 0 else None,
                "destination_ip": ips[1] if len(ips) > 1 else None,
                "username": None,
                "hostname": None,
                "severity": "INFO",
                "event_type": "Syslog",
                "message": line.strip(),
                "raw_log": line.strip()
            })
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported file format: {filename}")
        
    return normalized_logs
