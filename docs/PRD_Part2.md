# OBSIDIAN SOC - Product Requirements Document (Part 2)

## SYSTEM ARCHITECTURE
- **Frontend:** Render Static Site (React)
- **API:** HTTPS REST API + JWT
- **Backend:** Render Web Service (FastAPI)
- **External Services:** PostgreSQL (Render DB), Gemini 2.5 Flash (AI Analysis), Cloudinary (Uploaded Logs)

## APPLICATION LAYERS (Clean Architecture)
Frontend -> API Layer -> Controllers -> Services -> Repositories -> Database -> External Services
*Rule: Never place business logic inside API routes.*

## AUTHENTICATION & ROLES
- **Enterprise-grade Auth:** Registration, Email Validation, Login, JWT (Access/Refresh), Password Hashing (bcrypt), Session Tracking (IP, Device).
- **Roles:** Administrator, Security Analyst, Viewer.

## DATABASE DESIGN
- **Users:** id, uuid, name, email, password_hash, role, avatar, company, timezone, theme, created_at, updated_at
- **Uploaded Files:** id, user_id, filename, storage_url, file_type, file_size, upload_time, status
- **Parsed Logs:** id, file_id, timestamp, source_ip, destination_ip, username, hostname, severity, event_type, message, raw_log
- **Incidents:** id, title, description, severity, risk_score, status, assigned_to, created_at, updated_at
- **AI Reports:** id, incident_id, executive_summary, root_cause, recommendations, mitre_mapping, confidence, generated_at
- **AI Chat:** id, user_id, question, response, context, created_at
- **Activity Logs:** id, user, action, resource, timestamp, ip_address
- **Notifications:** id, title, message, type, read, created_at

## INCIDENT LIFECYCLE
Upload -> Parsing -> Normalization -> AI Investigation -> Risk Scoring -> MITRE Mapping -> Human Review -> Report Generation -> Resolved -> Archive

## LOG PARSER & AI ENGINE
- **Formats:** .log, .csv, .json, .txt -> Normalized structure.
- **AI Engine (Gemini 2.5 Flash):** Uses structured prompts, returns strictly JSON (summary, severity, risk_score, mitre, iocs, recommendations, confidence).

## AI WORKSPACE & THREAT INTELLIGENCE
- AI acts as "GitHub Copilot for SOC Analysts".
- Threat Intelligence page visualizes Top Threats, Active IPs, MITRE Heatmap, etc.

## RISK ENGINE & MITRE ATT&CK
- **Risk Scores:** 0-20 (Minimal) to 81-100 (Critical).
- **MITRE Mapping:** Initial Access, Execution, Persistence, Privilege Escalation, Defense Evasion, Credential Access, Discovery, Lateral Movement, Collection, Exfiltration, Impact.

## API ENDPOINTS
- Auth, Uploads, AI, Incidents, Reports, Analytics, Notifications.

## ENVIRONMENT VARIABLES
`DATABASE_URL`, `JWT_SECRET`, `JWT_ALGORITHM`, `ACCESS_TOKEN_EXPIRE`, `GEMINI_API_KEY`, `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`, `CORS_ORIGINS`, `PORT`

## BACKEND SERVICES & SECURITY
- JWT, Password Hashing, Input Validation, Rate Limiting, CORS, SQLi Protection, XSS/CSRF Protection, Secure Uploads, Audit Logs.
- **Error Handling:** Standardized `{ success: false, error_code, message }`. Never expose stack traces.
