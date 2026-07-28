from fastapi import APIRouter
from pydantic import BaseModel
import asyncio
import random

router = APIRouter()

class AIQuery(BaseModel):
    query: str

class AIResponse(BaseModel):
    report: str
    confidence: int

@router.post("/generate", response_model=AIResponse)
async def generate_ai_report(request: AIQuery):
    # Simulate processing delay
    await asyncio.sleep(1.5)
    
    query = request.query.lower()
    
    if "ddos" in query:
        report = """### Overview
At 14:02 UTC, a massive volumetric DDoS attack was detected targeting the external load balancers. Traffic spiked to 45 Gbps, primarily UDP reflection traffic.

### Impact Assessment
The primary application gateway experienced degraded performance for 12 minutes. Automated DDoS mitigation rules successfully absorbed the attack.

### Recommendations
- Review WAF rate limiting rules.
- Blacklist the top 100 attacking IPs identified in the mitigation logs.
- Contact upstream ISP for additional scrubbing capabilities if the attack resumes."""
        confidence = 98
        
    elif "phishing" in query or "email" in query:
        report = """### Overview
Multiple employees reported receiving spear-phishing emails containing malicious macro-enabled Excel attachments. The emails originated from a spoofed vendor domain.

### Impact Assessment
Analysis confirms that 3 employees opened the attachment. EDR solutions successfully blocked the execution of the macro payload.

### Recommendations
- Force a password reset for the 3 affected user accounts.
- Add the sender's domain to the global email blocklist.
- Trigger an emergency security awareness training module for the finance team."""
        confidence = 92
        
    else:
        # Default Cobalt Strike response
        report = """### Overview
At 10:12 AM UTC, a high-severity incident was detected on host DESKTOP-492X involving the execution of an obfuscated PowerShell script. The script exhibits behaviors strongly associated with Cobalt Strike payloads, specifically attempting to establish a connection to a known malicious C2 domain.

### Impact Assessment
The incident is currently contained. The AI analysis confidence is 94% that this is a true positive attack attempt. No data exfiltration has been observed at this time.

### Recommendations
- Immediate isolation of DESKTOP-492X from the corporate network.
- Initiate full disk scan and memory dump for forensic analysis.
- Rotate credentials for the associated user account."""
        confidence = 94

    return AIResponse(report=report, confidence=confidence)
