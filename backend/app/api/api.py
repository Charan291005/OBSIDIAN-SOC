from fastapi import APIRouter
from app.api.endpoints import auth, incidents, ai, logs, analytics

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["incidents"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(logs.router, prefix="/logs", tags=["logs"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])

