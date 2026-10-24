from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import get_settings
from app.core.constants import get_constants
from app.core.errors import (
    ProofRentError,
    proofrent_error_handler,
    http_exception_handler,
    validation_exception_handler,
    generic_exception_handler,
)
from app.api.routes_system import router as system_router
from app.api.routes_investigations import router as investigations_router
from app.db.database import init_db

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

# Exception handlers enforcing standard ErrorResponse contract
app.add_exception_handler(ProofRentError, proofrent_error_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

app.include_router(system_router)
app.include_router(investigations_router)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/")
async def root():
    return {"message": "ProofRent API active"}