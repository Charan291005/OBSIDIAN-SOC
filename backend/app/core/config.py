from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union
import json

class Settings(BaseSettings):
    PROJECT_NAME: str = "Obsidian SOC"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Auth
    JWT_SECRET: str = "insecure_default_key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # DB
    DATABASE_URL: str = "sqlite:///./obsidian_soc.db"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
