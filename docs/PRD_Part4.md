# OBSIDIAN SOC - Product Requirements Document (Part 4)

## PRODUCTION, DEPLOYMENT & ENGINEERING EXCELLENCE

### DEPLOYMENT PHILOSOPHY
- Deployable by anyone with minimal effort.
- Zero hardcoded secrets, environment-variable driven.
- Render Static Site for frontend (`npm install && npm run build`, `dist`).
- Render Web Service for backend (`pip install -r requirements.txt`, `uvicorn app.main:app --host 0.0.0.0 --port $PORT`).
- Render PostgreSQL via `DATABASE_URL`.

### ENVIRONMENT VARIABLES
- Frontend: `VITE_API_URL`, `VITE_APP_NAME`, `VITE_ENVIRONMENT`
- Backend: `DATABASE_URL`, `JWT_SECRET`, `JWT_ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `REFRESH_TOKEN_EXPIRE_DAYS`, `GEMINI_API_KEY`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CORS_ORIGINS`, `PORT`

### GITHUB REPOSITORY & DOCUMENTATION
- Full startup-grade `README.md` (Hero Image, Badges, Features, Architecture, Deployment).
- Docs for Architecture, API, Deployment, Design System, Diagrams.
- Standard repo files: `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `LICENSE`.
- CI/CD via GitHub Actions (Lint -> Test -> Build -> Verify).

### QUALITY & OPTIMIZATION
- **Frontend:** Lazy loading, skeleton loading, debounced search. React Testing Library + Vitest. Playwright E2E.
- **Backend:** Async FastAPI, caching, connection pooling. Pytest.
- **Security:** JWT, bcrypt, CORS, input validation, strict file upload validation (reject `.exe`, `.sh`, etc.).
- **Performance:** Dashboard < 2s, Upload < 10s, AI Analysis < 15s.

### DEMO MODE & PERSONAS
- **Demo Workspace:** Pre-generated incidents, sample logs, analytics data to allow instant exploration without data entry.
- **CEO Mode vs Analyst Mode:**
  - **Analyst Mode:** Deep dive SOC workspace.
  - **CEO Mode:** High-level executive dashboard showing risk, business impact, and AI executive summaries.

### FINAL DELIVERABLES
- Fully responsive React frontend + FastAPI backend.
- Deployed on Render.
- Complete documentation and portfolio readiness.
