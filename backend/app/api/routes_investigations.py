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
from app.services.orchestrator import (
    start_investigation_job, 
    run_investigation, 
    get_report_by_id
)

router = APIRouter(prefix="/api", tags=["investigations"])


@router.post("/investigations", response_model=InvestigateResponse)
async def start_investigation(req: InvestigateRequest, background_tasks: BackgroundTasks):
    """Start a new investigation background job or serve from replay."""
    if req.replay_example_id:
        report_id = f"replay_{req.replay_example_id}"
        return InvestigateResponse(report_id=report_id, cached=True, is_replay=True)

    if not req.url:
        raise HTTPException(
            status_code=400, 
            detail=ErrorResponse(
                error=ApiError(code="INVALID_URL", message="Please provide a valid listing URL.")
            ).model_dump()
        )

    inv_res = start_investigation_job(req.url, req.force_refresh)
    
    if not inv_res.cached:
        background_tasks.add_task(run_investigation, inv_res.report_id, req.url)

    return inv_res


@router.get("/reports/{report_id}", response_model=Report)
async def get_report(report_id: str):
    """Get the latest state of an investigation report."""
    report = get_report_by_id(report_id)
    if not report:
        raise HTTPException(
            status_code=404,
            detail=ErrorResponse(
                error=ApiError(code="INTERNAL", message="Report not found.")
            ).model_dump()
        )
    return report


@router.get("/reports/{report_id}/events")
async def stream_report_events(report_id: str):
    """Server-Sent Events endpoint streaming real-time job log events."""
    manager = get_manager()

    async def event_generator():
        async for event in manager.stream(report_id):
            yield {
                "event": event.type,
                "data": event.model_dump_json()
            }

    return EventSourceResponse(event_generator())