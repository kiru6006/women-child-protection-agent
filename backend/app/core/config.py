from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "WCD Protection Intelligence API"
    PROJECT_DESCRIPTION: str = "Suraksha Sentinel & Sahyog — Case Continuity & Gap-Closure Operating System"
    VERSION: str = "2.5.0"
    API_V1_STR: str = "/api/v1"
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://kiru6006.github.io",
        "*"
    ]
    
    SECRET_SALT: str = "suraksha-sentinel-salt-2026"
    DEMO_DISTRICT: str = "Patna"
    DEMO_STATE: str = "Bihar"

settings = Settings()

