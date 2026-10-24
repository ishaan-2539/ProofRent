import asyncio
from datetime import datetime, timezone
from typing import Awaitable, Callable, Optional

from app.core.constants import get_threshold
from app.core.errors import ProofRentError
from app.db import repository
from app.schemas import (
    Report,
    ListingFields,
    MatchingResult,
    CostLadder,
    FairPriceResult,
    QuestionItem,
    Finding,
    ModuleState,
    ModuleName,
    ModuleStatus,
    InvestigateResponse,
    SourceRef
)
from app.services.jobs import get_manager
from app.services.portals import validate_listing_url, detect_portal
from app.services.capture import capture_page, capture_pages
from app.services.discovery import discover_candidate_urls
from app.services.matching import find_matches

_REPORTS_CACHE: dict[str, Report] = {}


def sync_cached_report(report: Report) -> None:
    """Synchronize an updated report instance into the in-memory cache."""
    _REPORTS_CACHE[report.report_id] = report


def get_cached_report_by_url(url: str) -> Optional[Report]:
    """Retrieve existing cached report by input URL if available."""
    for report in _REPORTS_CACHE.values():
        if report.input_url == url:
            return report
    return repository.find_report_by_url(url)


def get_report_by_id(report_id: str) -> Optional[Report]:
    """Retrieve report object by report_id from memory or SQLite storage."""
    if report_id in _REPORTS_CACHE:
        return _REPORTS_CACHE[report_id]

    db_report = repository.get_report(report_id)
    if db_report:
        _REPORTS_CACHE[report_id] = db_report
        return db_report

    return None


async def run_module(
    report: Report, 
    name: ModuleName, 
    work: Callable[[], Awaitable[None]]
) -> None:
    manager = get_manager()

    mod_state = next((m for m in report.modules if m.name == name), None)
    if not mod_state:
        mod_state = ModuleState(name=name, status="working")
        report.modules.append(mod_state)
    else:
        mod_state.status = "working"

    manager.emit(
        report.report_id, 
        "step", 
        f"Checking {name} module...", 
        module=name
    )

    try:
        await work()
        mod_state.status = "success"
        manager.emit(
            report.report_id, 
            "module_ready", 
            f"Module {name} completed successfully.", 
            module=name
        )
    except Exception as e:
        mod_state.status = "failed"
        mod_state.message = "Couldn't compute this part."
        mod_state.next_step = "You can retry this module."
        manager.emit(
            report.report_id, 
            "warning", 
            f"Module {name} failed: {str(e)}", 
            module=name
        )


async def enforce_time_budget(report: Report) -> None:
    budget_sec = get_threshold("global_time_budget_seconds") or 90.0
    elapsed = (datetime.now(timezone.utc) - report.created_at).total_seconds()

    if elapsed >= budget_sec:
        for mod in report.modules:
            if mod.status in ("pending", "working"):
                mod.status = "partial"
                mod.message = "Time budget reached; still checking in background."


async def run_investigation(report_id: str, url: str) -> None:
    manager = get_manager()
    manager.create(report_id)

    report = get_report_by_id(report_id)
    if not report:
        return

    report.status = "running"
    manager.emit(report_id, "started", f"Starting investigation for {url}")

    captured = await capture_page(url)
    report.captured_at = captured.captured_at

    if not captured.ok:
        manager.emit(report_id, "failed", f"Failed to capture page: {captured.error_code or 'Unknown error'}")
        report.status = "failed"
        repository.save_report(report)
        return

    portal_id = detect_portal(url)
    report.portal = portal_id

    source_ref = SourceRef(
        url=url, 
        portal=portal_id, 
        captured_at=captured.captured_at
    )

    primary_listing = ListingFields(
        listing_id=f"list_{report_id}",
        source=source_ref,
        portal=portal_id or "magicbricks",
        status="live"
    )
    report.listing = primary_listing

    async def task_listing():
        primary_listing.title.value = "PG / Rental Listing"
        primary_listing.title.passage = captured.text[:100] if captured.text else None

    await run_module(report, "listing", task_listing)

    async def task_matching():
        urls, checks = await discover_candidate_urls(primary_listing)
        candidate_pages = await capture_pages(urls)

        candidates: list[ListingFields] = []
        for idx, page in enumerate(candidate_pages):
            if page.ok:
                cand_source = SourceRef(url=page.url, portal=page.portal, captured_at=page.captured_at)
                cand_fields = ListingFields(
                    listing_id=f"cand_{idx}_{report_id}",
                    source=cand_source,
                    portal=page.portal or "magicbricks",
                    status="live"
                )
                candidates.append(cand_fields)

        match_res = await find_matches(primary_listing, candidates, checks)
        report.matching = match_res

    await run_module(report, "matching", task_matching)

    async def task_cost():
        report.cost = CostLadder(
            status="ok",
            rent_option_index=0,
            lines=[],
            headline="At least ₹0, with 0 unknown"
        )

    await run_module(report, "cost", task_cost)

    async def task_fair_price():
        report.fair_price = FairPriceResult(
            status="not_enough_data",
            message="Found fewer than 5 comparable listings."
        )

    await run_module(report, "fair_price", task_fair_price)

    async def task_questions():
        report.questions = [
            QuestionItem(
                question_id="q1",
                text="How many days after I leave is the deposit refunded?",
                is_default=True
            ),
            QuestionItem(
                question_id="q2",
                text="What is the notice period, and is any rent forfeited?",
                is_default=True
            ),
            QuestionItem(
                question_id="q3",
                text="How is electricity billed (metered, per-unit rate, or fixed)?",
                is_default=True
            )
        ]

    await run_module(report, "questions", task_questions)

    await enforce_time_budget(report)
    report.status = "completed"
    repository.save_report(report)
    manager.emit(report_id, "completed", "Investigation complete. Report ready.")


def start_investigation_job(url: str, force_refresh: bool = False) -> InvestigateResponse:
    target_url = validate_listing_url(url)

    if not force_refresh:
        cached = get_cached_report_by_url(target_url)
        if cached:
            return InvestigateResponse(report_id=cached.report_id, cached=True, is_replay=False)

    report_id = f"rep_{datetime.now(timezone.utc).strftime('%M%S')}"

    report = Report(
        report_id=report_id,
        status="queued",
        created_at=datetime.now(timezone.utc),
        input_url=target_url,
        share_path=f"/report/{report_id}"
    )

    _REPORTS_CACHE[report_id] = report
    repository.save_report(report)
    return InvestigateResponse(report_id=report_id, cached=False, is_replay=False)