from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator, Field, AliasChoices
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
    
    # CORS (supports JSON array, comma-separated string, or list, with CORS_ORIGINS alias)
    BACKEND_CORS_ORIGINS: Union[str, List[str]] = Field(
        default=["*"],
        validation_alias=AliasChoices("BACKEND_CORS_ORIGINS", "CORS_ORIGINS")
    )
    
    @field_validator("BACKEND_CORS_ORIGINS", mode="after")
    @classmethod
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            v_str = v.strip()
            if v_str.startswith("["):
                try:
                    return json.loads(v_str)
                except Exception:
                    pass
            return [origin.strip() for origin in v_str.split(",") if origin.strip()]
        return v
    
    @field_validator("DATABASE_URL", mode="after")
    @classmethod
    def normalize_database_url(cls, v: str) -> str:
        if v and v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
