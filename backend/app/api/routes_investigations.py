import uuid
from fastapi import APIRouter, HTTPException, BackgroundTasks
from sse_starlette.sse import EventSourceResponse

from app.schemas import (
    InvestigateRequest, 
    InvestigateResponse, 
    Report, 
    DecisionRequest, 
    ErrorResponse,
    ApiError
)
from app.services.jobs import get_manager
from app.services.portals import validate_listing_url, resolve_redirects

router = APIRouter(prefix="/api", tags=["investigations"])


@router.post("/investigations", response_model=InvestigateResponse)
async def start_investigation(req: InvestigateRequest, background_tasks: BackgroundTasks):
    """Start a new investigation job or serve from cache/replay."""
    if req.replay_example_id:
        report_id = f"replay_{req.replay_example_id}"
        return InvestigateResponse(report_id=report_id, cached=True, is_replay=True)

    if not req.url:
        raise HTTPException(
            status_code=400, 
            detail=ErrorResponse(error=ApiError(code="INVALID_URL", message="Please provide a valid listing URL.")).model_dump()
        )

    # Validate portal domain and format
    target_url = validate_listing_url(req.url)
    report_id = uuid.uuid4().hex[:12]

    manager = get_manager()
    manager.create(report_id)
    manager.emit(report_id, "started", "Investigation job queued")

    return InvestigateResponse(report_id=report_id, cached=False, is_replay=False)


@router.get("/reports/{report_id}/events")
async def stream_report_events(report_id: str):
    """Server-Sent Events endpoint streaming real-time job log events to the frontend."""
    manager = get_manager()

    async def event_generator():
        async for event in manager.stream(report_id):
            yield {
                "event": event.type,
                "data": event.model_dump_json()
            }

    return EventSourceResponse(event_generator())