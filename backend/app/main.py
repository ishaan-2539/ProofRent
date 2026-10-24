from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.core.constants import get_constants

settings = get_settings()
constants = get_constants()

app = FastAPI(title="ProofRent API", version=constants.get("contract_version", "1.0"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {
        "ok": True,
        "contract_version": constants.get("contract_version", "1.0")
    }