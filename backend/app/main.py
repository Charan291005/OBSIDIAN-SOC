import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.api import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS configuration - allow localhost, Render domains, and all origins safely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["system"])
def health_check():
    """
    Application Health Endpoint for deployment monitoring (e.g. Render).
    """
    from app.database.session import DB_URL
    db_type = "sqlite" if "sqlite" in DB_URL else "postgresql"
    return {
        "status": "healthy",
        "service": "Obsidian SOC Engine",
        "version": settings.VERSION,
        "database": db_type,
        "environment": "production" if "render.com" in os.environ.get("RENDER_EXTERNAL_URL", "") else "development"
    }

@app.get("/")
def read_root():
    return {
        "service": "Obsidian SOC API",
        "status": "online",
        "docs": "/docs",
        "health": "/health"
    }

