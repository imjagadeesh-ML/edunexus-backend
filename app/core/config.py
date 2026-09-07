import os
import json
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE = BASE_DIR / ".env"

class Settings(BaseSettings):
    PROJECT_NAME: str = "EduNexus AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # SECURITY
    SECRET_KEY: str = "b9c4c5b36412f7a0dc4f5b3512b8b9a103d8d69fae5cfe15c7e14f6b2e1b1d2e"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # DATABASE
    DATABASE_URL: str = f"sqlite:///{BASE_DIR.as_posix()}/edunexus.db"
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["*"]

    model_config = SettingsConfigDict(env_file=str(ENV_FILE), case_sensitive=True, extra="allow")

settings = Settings()
