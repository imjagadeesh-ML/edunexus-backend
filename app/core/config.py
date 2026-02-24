import os
import json
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "EduNexus AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # SECURITY
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_secret_key_change_in_production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))
    
    # DATABASE
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = json.loads(os.getenv("BACKEND_CORS_ORIGINS", '["*"]'))

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="allow")

settings = Settings()
