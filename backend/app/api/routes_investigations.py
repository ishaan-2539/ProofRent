from fastapi import APIRouter, BackgroundTasks, status
from sse_starlette.sse import EventSourceResponse

from app.core.config import get_settings
from app.core.errors import ProofRentError
from app.db.repository import save_decision
from app.schemas import (
    DecisionRequest,
    InvestigateRequest,
    InvestigateResponse,
    Report,
)
from app.services.jobs import get_manager
from app.services.orchestrator import (
    get_report_by_id,
    run_investigation,
    start_investigation_job,
)
from app.services.replay import (
    example_id_for_url,
    load_replay_report,
    replay_events,
)

router = APIRouter(prefix="/api", tags=["investigations"])

VALID_EXAMPLE_IDS = {"match", "no_match", "hidden_fees", "blocked"}


def _replay_example_id(report_id: str) -> str:
    """'replay_match' -> 'match'. Raises 404 for unknown replay ids."""
    example_id = report_id.replace("replay_", "", 1)
    if example_id not in VALID_EXAMPLE_IDS:
        raise ProofRentError(
            code="INTERNAL",
            custom_message=f"Unknown replay example '{example_id}'.",
            next_step="Use one of: match, no_match, hidden_fees, blocked.",
            status_code=status.HTTP_404_NOT_FOUND,
        )
    return example_id


@router.post("/investigations", response_model=InvestigateResponse)
async def start_investigation(req: InvestigateRequest, background_tasks: BackgroundTasks):
    """Start a real investigation, or serve a recorded example."""
    settings = get_settings()

    # Explicit replay request (example buttons)
    if req.replay_example_id:
        return InvestigateResponse(
            report_id=f"replay_{req.replay_example_id}", cached=True, is_replay=True
        )

    # Mock mode: only the preset example URLs are available. Be honest about it
    # instead of returning the same report for every link.
    if settings.mock_mode:
        example_id = example_id_for_url(req.url)
        if not example_id:
            raise ProofRentError(
                code="INVALID_URL",
                custom_message="Mock mode is on: only the preset examples are cached.",
                next_step="Click an example, or set MOCK_MODE=false in .env and restart the backend.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        return InvestigateResponse(
            report_id=f"replay_{example_id}", cached=True, is_replay=True
        )

    if not req.url:
        raise ProofRentError(
            code="INVALID_URL",
            custom_message="Please provide a valid listing URL.",
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    inv_res = start_investigation_job(req.url, req.force_refresh)

    if not inv_res.cached:
        background_tasks.add_task(run_investigation, inv_res.report_id, req.url)

    return inv_res


@router.get("/reports/{report_id}", response_model=Report)
async def get_report(report_id: str):
    """Latest state of an investigation report."""
    if report_id.startswith("replay_"):
        example_id = _replay_example_id(report_id)
        try:
            return load_replay_report(example_id)
        except FileNotFoundError:
            raise ProofRentError(
                code="INTERNAL",
                custom_message="Replay fixture not found.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

    report = get_report_by_id(report_id)
    if not report:
        raise ProofRentError(
            code="INTERNAL",
            custom_message="Report not found.",
            status_code=status.HTTP_404_NOT_FOUND,
        )
    return report


@router.get("/reports/{report_id}/events")
async def stream_report_events(report_id: str):
    """Server-Sent Events: the live step log."""
    if report_id.startswith("replay_"):
        example_id = _replay_example_id(report_id)

        async def replay_generator():
            try:
                async for event in replay_events(example_id, report_id, delay_seconds=0.3):
                    yield {"event": event.type, "data": event.model_dump_json()}
            except FileNotFoundError:
                return

        return EventSourceResponse(replay_generator())

    manager = get_manager()

    async def event_generator():
        async for event in manager.stream(report_id):
            yield {"event": event.type, "data": event.model_dump_json()}

    return EventSourceResponse(event_generator())


@router.post("/reports/{report_id}/decision", response_model=Report)
async def submit_decision(report_id: str, req: DecisionRequest):
    """Confirm / reject a possible match."""
    try:
        return save_decision(report_id, req.candidate_id, req.decision)
    except ValueError as ve:
        raise ProofRentError(
            code="INTERNAL",
            custom_message=str(ve),
            next_step="Verify that the candidate_id exists in this report.",
            status_code=status.HTTP_404_NOT_FOUND,
        )
    except ProofRentError:
        raise
    except Exception as e:
        raise ProofRentError(
            code="INTERNAL",
            custom_message=f"Failed to record decision: {str(e)}",
            next_step="Please try submitting your decision again.",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )