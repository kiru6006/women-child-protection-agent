import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    PROJECT_NAME: str = "WCD Protection Intelligence API"
    PROJECT_DESCRIPTION: str = "Suraksha Sentinel & Sahyog — Case Continuity & Gap-Closure Operating System"
    VERSION: str = "3.0.0"
    API_V1_STR: str = "/api/v1"

    # Explicit origins only (never '*' when allow_credentials=True)
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "https://kiru6006.github.io",
    ]

    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./wcd_protection.db")
    SECRET_SALT: str = os.getenv("SURAKSHA_SECRET_SALT", "dev-only-local-salt-change-in-prod")
    DEV_HEADER_AUTH_ENABLED: bool = os.getenv("DEV_HEADER_AUTH_ENABLED", "true").lower() == "true"
    DEMO_DISTRICT: str = "Patna"
    DEMO_STATE: str = "Bihar"


settings = Settings()
