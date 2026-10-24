from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.core.constants import get_constants
from app.api.routes_system import router as system_router
from app.api.routes_investigations import router as investigations_router

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

app.include_router(system_router)
app.include_router(investigations_router)


@app.get("/")
async def root():
    return {"message": "ProofRent API active"}