import uuid
from fastapi import APIRouter, HTTPException, BackgroundTasks, status
from sse_starlette.sse import EventSourceResponse

from app.core.errors import ProofRentError
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
from app.services.replay import load_replay_report
from app.db.repository import save_decision

router = APIRouter(prefix="/api", tags=["investigations"])


@router.post("/investigations", response_model=InvestigateResponse)
async def start_investigation(req: InvestigateRequest, background_tasks: BackgroundTasks):
    """Start a new investigation background job or serve from replay."""
    if req.replay_example_id:
        report_id = f"replay_{req.replay_example_id}"
        return InvestigateResponse(report_id=report_id, cached=True, is_replay=True)

    if not req.url:
        raise ProofRentError(
            code="INVALID_URL", 
            custom_message="Please provide a valid listing URL.",
            status_code=status.HTTP_400_BAD_REQUEST
        )

    inv_res = start_investigation_job(req.url, req.force_refresh)

    if not inv_res.cached:
        background_tasks.add_task(run_investigation, inv_res.report_id, req.url)

    return inv_res


@router.get("/reports/{report_id}", response_model=Report)
async def get_report(report_id: str):
    """Get the latest state of an investigation report."""
    if report_id.startswith("replay_"):
        example_id = report_id.replace("replay_", "")
        try:
            return load_replay_report(example_id)
        except FileNotFoundError:
            raise ProofRentError(
                code="INTERNAL",
                custom_message="Replay fixture not found.",
                status_code=status.HTTP_404_NOT_FOUND
            )

    report = get_report_by_id(report_id)
    if not report:
        raise ProofRentError(
            code="INTERNAL",
            custom_message="Report not found.",
            status_code=status.HTTP_404_NOT_FOUND
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


@router.post("/reports/{report_id}/decision", response_model=Report)
async def submit_decision(report_id: str, req: DecisionRequest):
    """Update user decision on candidate match override (confirmed / rejected)."""
    try:
        updated_report = save_decision(report_id, req.candidate_id, req.decision)
        return updated_report
    except ValueError as ve:
        raise ProofRentError(
            code="INTERNAL",
            custom_message=str(ve),
            next_step="Verify that the candidate_id exists in this report.",
            status_code=status.HTTP_404_NOT_FOUND
        )
    except ProofRentError:
        raise
    except Exception as e:
        raise ProofRentError(
            code="INTERNAL",
            custom_message=f"Failed to record decision: {str(e)}",
            next_step="Please try submitting your decision again.",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )