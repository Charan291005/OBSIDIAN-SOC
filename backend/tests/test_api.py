import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "database" in data

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"

def test_get_incidents():
    response = client.get("/api/v1/incidents/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    first = data[0]
    assert "id" in first
    assert "title" in first
    assert "severity" in first
    assert "risk_score" in first

def test_ai_generation():
    payload = {"query": "Investigate Cobalt Strike stager and suggest firewall containment"}
    response = client.post("/api/v1/ai/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "report" in data
    assert "confidence" in data
    assert data["confidence"] > 80

def test_ai_generation_caching():
    payload = {"query": "Analyze volumetric UDP DDoS attack"}
    # Call 1
    res1 = client.post("/api/v1/ai/generate", json=payload)
    assert res1.status_code == 200
    # Call 2 (cached)
    res2 = client.post("/api/v1/ai/generate", json=payload)
    assert res2.status_code == 200
    assert res1.json()["report"] == res2.json()["report"]

def test_analytics_overview():
    response = client.get("/api/v1/analytics/overview")
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data
    assert "recent_activity" in data
    assert "suggested_priority" in data

def test_log_upload_parsing():
    sample_log = """Oct 15 09:12:01 host sysmon: powershell.exe -enc aWV4IChOZXctT2JqZWN0IE5ldC5XZWJDbGllbnQp
Oct 15 09:12:04 host sysmon: connection to 185.158.24.42 port 443"""
    
    response = client.post(
        "/api/v1/logs/upload",
        data={"raw_logs": sample_log, "filename_override": "test_sysmon.log"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["threats_detected_count"] > 0
    assert "created_incident" in data
