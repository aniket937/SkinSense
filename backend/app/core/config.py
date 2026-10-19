from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "SkinSense"
    VERSION: str = "0.1.0"
    API_PREFIX: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "sqlite:///./skinsense.db"
    
    # Auth
    AUTH_SECRET: str = "dev-secret-key-change-in-production"
    
    # AI
    MODEL_PROVIDER: str = "ollama"
    MODEL_NAME: str = "qwen3:8b"
    # For local HF: model name or path (e.g., "meta-llama/Llama-3.1-8B-Instruct")
    # For Ollama: just the model name pulled via `ollama pull`
    HF_MODEL_NAME: Optional[str] = None
    # Ollama endpoint; for local HF via transformers this would be unused
    MODEL_ENDPOINT: str = "http://localhost:11434/v1"
    
    # Voice (ElevenLabs)
    ELEVENLABS_API_KEY: Optional[str] = None
    ELEVENLABS_VOICE_ID: Optional[str] = None
    ENABLE_VOICE: bool = False
    
    # Environment
    ENVIRONMENT: str = "development"
    
    # OCR
    TESSERACT_PATH: Optional[str] = None
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()