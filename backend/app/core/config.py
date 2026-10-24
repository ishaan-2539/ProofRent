from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    tinyfish_api_key: str = ""
    llm_provider: str = "gemini"
    llm_api_key: str = ""
    llm_model: str = "gemini-1.5-flash"
    database_url: str = "sqlite:///./proofrent.db"
    cors_origins: str = "http://localhost:5173"
    public_base_url: str = "http://localhost:5173"
    mock_mode: bool = False
    agent_concurrency: int = 2
    global_time_budget_seconds: int = 90
    agent_max_duration_seconds: int = 300
    log_level: str = "INFO"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

@lru_cache
def get_settings() -> Settings:
    return Settings()