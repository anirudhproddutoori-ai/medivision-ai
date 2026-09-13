from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "medivision"
    JWT_SECRET: str = "supersecretkey_change_in_production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    GEMINI_API_KEY: str = ""
    UPLOAD_FOLDER: str = "uploads"
    REPORT_FOLDER: str = "reports"
    MAX_UPLOAD_SIZE: int = 52428800
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173,*"

    class Config:
        env_file = ".env"

settings = Settings()
