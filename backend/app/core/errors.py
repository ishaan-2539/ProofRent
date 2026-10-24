from typing import Optional
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.constants import get_constants
from app.schemas import ErrorResponse, ApiError


class ProofRentError(Exception):
    def __init__(
        self,
        code: str,
        custom_message: Optional[str] = None,
        next_step: Optional[str] = None,
        status_code: int = status.HTTP_400_BAD_REQUEST,
    ):
        constants = get_constants()
        error_msgs = constants.get("error_messages", {})
        self.code = code
        self.message = custom_message or error_msgs.get(code, "An unexpected error occurred.")
        self.next_step = next_step
        self.status_code = status_code
        super().__init__(self.message)


def map_tinyfish_error(error_code: str, http_status: int = 500) -> ProofRentError:
    if error_code == "SITE_BLOCKED":
        return ProofRentError(
            code="POLICY_BLOCKED",
            custom_message="Portal blocked automated access. We do not bypass protection.",
            next_step="Try a different portal listing.",
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    elif error_code in ("RATE_LIMIT_EXCEEDED", "429"):
        return ProofRentError(
            code="RATE_LIMITED",
            custom_message="TinyFish API rate limit reached.",
            next_step="Please retry in a few moments.",
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        )
    elif error_code in ("INSUFFICIENT_CREDITS", "BILLING_REJECTED"):
        return ProofRentError(
            code="INTERNAL",
            custom_message="API credits exhausted.",
            next_step="Switching to replay/cached mode.",
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    return ProofRentError(
        code="INTERNAL",
        custom_message=f"TinyFish error ({error_code}).",
        next_step="You can retry this request.",
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


async def proofrent_error_handler(request: Request, exc: ProofRentError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=ApiError(
                code=exc.code,
                message=exc.message,
                next_step=exc.next_step,
            )
        ).model_dump(),
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    if isinstance(exc.detail, dict) and "error" in exc.detail:
        return JSONResponse(status_code=exc.status_code, content=exc.detail)

    code = "INTERNAL" if exc.status_code >= 500 else "INVALID_INPUT"
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=ApiError(
                code=code,
                message=str(exc.detail),
                next_step="Check your request parameters and try again.",
            )
        ).model_dump(),
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    errors = exc.errors()
    first_err = errors[0] if errors else {}
    msg = first_err.get("msg", "Invalid request parameters.")
    loc = " -> ".join(str(l) for l in first_err.get("loc", []))

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=ErrorResponse(
            error=ApiError(
                code="INVALID_URL" if "url" in loc else "INVALID_INPUT",
                message=f"Validation error ({loc}): {msg}",
                next_step="Ensure all required fields are correctly formatted.",
            )
        ).model_dump(),
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            error=ApiError(
                code="INTERNAL",
                message="An unexpected server error occurred.",
                next_step="Please try again in a few moments.",
            )
        ).model_dump(),
    )