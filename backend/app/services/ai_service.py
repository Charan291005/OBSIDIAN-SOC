import google.generativeai as genai
import os
import json
from fastapi import HTTPException

# Configure Gemini with key from environment
api_key = os.environ.get("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

generation_config = {
    "temperature": 0.2,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "application/json", # Enforce structured response
}

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    generation_config=generation_config,
)

SYSTEM_PROMPT = """
You are a Senior Security Analyst at Obsidian SOC.
Analyze the following normalized security events.
Your response MUST be strict JSON in the following structure:
{
  "summary": "String",
  "severity": "Low|Medium|High|Critical",
  "risk_score": 0-100,
  "mitre": [{"technique_id": "T1234", "description": "String", "tactic": "String"}],
  "iocs": ["ip", "hash", "domain"],
  "recommendations": ["Action 1", "Action 2"],
  "confidence": 0.0-1.0
}
Never return plain paragraphs. Always use structured JSON responses.
"""

async def analyze_incident_logs(normalized_logs: list[dict]) -> dict:
    if not api_key:
        # Fallback if no key is provided during dev
        return {
            "summary": "AI analysis skipped due to missing API key.",
            "severity": "High",
            "risk_score": 75,
            "mitre": [],
            "iocs": [],
            "recommendations": ["Configure GEMINI_API_KEY in .env"],
            "confidence": 1.0
        }
        
    prompt = f"{SYSTEM_PROMPT}\n\nLogs to analyze:\n{json.dumps(normalized_logs, indent=2)}"
    try:
        response = model.generate_content(prompt)
        # Validate that the response is actually parseable JSON
        return json.loads(response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")
