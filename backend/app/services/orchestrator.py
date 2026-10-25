import asyncio
import logging
from datetime import datetime, timedelta, timezone
from typing import Awaitable, Callable, Optional
from uuid import uuid4

from app.clients.tinyfish import get_tinyfish_client
from app.core.constants import get_threshold
from app.db import repository
from app.schemas import (
    CapturedPage,
    InvestigateResponse,
    ListingFields,
    MatchingResult,
    ModuleName,
    ModuleState,
    Report,
    SourceRef,
)
from app.services.capture import capture_page
from app.services.costing import build_cost_ladder
from app.services.discovery import discover_candidate_urls
from app.services.extraction import extract_listing_fields
from app.services.fair_price import compute_fair_price
from app.services.findings import build_findings
from app.services.jobs import get_manager
from app.services.matching import find_matches
from app.services.photos import find_page_images
from app.services.portals import detect_portal, validate_listing_url
from app.services.questions import build_questions

logger = logging.getLogger(__name__)

_REPORTS_CACHE: dict[str, Report] = {}

MIN_PAGE_CHARS = 100
CACHE_TTL_MINUTES = 30  # an old run must never hide a fixed pipeline for long


def sync_cached_report(report: Report) -> None:
    _REPORTS_CACHE[report.report_id] = report


def has_content(listing: Optional[ListingFields]) -> bool:
    """True if extraction produced at least something real."""
    if not listing:
        return False
    return bool(
        listing.title.value
        or listing.operator_name.value
        or listing.address_text.value
        or listing.rent_options
    )


def _is_reusable(r: Report) -> bool:
    """A cached report is reused only if it is complete, recent and actually searched other portals."""
    if r.status != "completed" or not has_content(r.listing):
        return False
    if not r.matching or r.matching.status == "not_checked":
        return False
    created = r.created_at
    if created.tzinfo is None:
        created = created.replace(tzinfo=timezone.utc)
    return datetime.now(timezone.utc) - created < timedelta(minutes=CACHE_TTL_MINUTES)


def get_cached_report_by_url(url: str) -> Optional[Report]:
    """Return a previous GOOD, RECENT report for this URL."""
    candidates = [r for r in _REPORTS_CACHE.values() if r.input_url == url]
    db_report = repository.find_report_by_url(url)
    if db_report:
        candidates.append(db_report)
    for r in candidates:
        if _is_reusable(r):
            return r
    return None


def get_report_by_id(report_id: str) -> Optional[Report]:
    if report_id in _REPORTS_CACHE:
        return _REPORTS_CACHE[report_id]
    db_report = repository.get_report(report_id)
    if db_report:
        _REPORTS_CACHE[report_id] = db_report
        return db_report
    return None


async def run_module(
    report: Report, name: ModuleName, work: Callable[[], Awaitable[None]]
) -> None:
    manager = get_manager()

    mod_state = next((m for m in report.modules if m.name == name), None)
    if not mod_state:
        mod_state = ModuleState(name=name, status="working")
        report.modules.append(mod_state)
    else:
        mod_state.status = "working"

    manager.emit(report.report_id, "step", f"Working on: {name}", module=name)

    try:
        await work()
        mod_state.status = "success"
        manager.emit(report.report_id, "module_ready", f"{name} ready.", module=name)
    except Exception as e:
        logger.exception("Module %s failed", name)
        mod_state.status = "failed"
        mod_state.message = "Couldn't compute this part."
        mod_state.next_step = f"{e}"
        manager.emit(report.report_id, "warning", f"{name} could not be completed: {e}", module=name)
        manager.emit(report.report_id, "module_ready", f"{name} finished with a problem.", module=name)


async def enforce_time_budget(report: Report) -> None:
    budget_sec = get_threshold("global_time_budget_seconds") or 90.0
    elapsed = (datetime.now(timezone.utc) - report.created_at).total_seconds()
    if elapsed >= budget_sec:
        for mod in report.modules:
            if mod.status in ("pending", "working"):
                mod.status = "partial"
                mod.message = "Time budget reached; still checking."


def _save_snapshot_safe(page: CapturedPage) -> None:
    """Keep the captured page text so every finding can link back to its evidence."""
    try:
        page.snapshot_id = repository.save_snapshot(page)
    except Exception:
        logger.warning("Could not save snapshot for %s", page.url, exc_info=True)


async def _ensure_photos(listing: ListingFields) -> None:
    """If the page text had no usable photos, try reading og:image / <img> directly.
    Best effort: failure just means the card shows a placeholder."""
    if listing.photo_urls:
        return
    try:
        urls = await find_page_images(listing.source.url)
        if urls:
            listing.photo_urls = urls
    except Exception:
        logger.info("Photo fallback failed for %s", listing.source.url, exc_info=True)


async def _extract_candidate(page: CapturedPage) -> ListingFields:
    listing = await extract_listing_fields(page)
    if has_content(listing):
        await _ensure_photos(listing)
    return listing


async def _fetch_candidate_pages(urls: list[str], report_id: str) -> list[CapturedPage]:
    """Read other portals' pages with ONE batched TinyFish Fetch call (free, parallel)."""
    manager = get_manager()
    if not urls:
        return []
    try:
        pages = await get_tinyfish_client().fetch(urls[:6])
    except Exception as e:
        manager.emit(report_id, "warning", f"Could not read other portals: {e}")
        return []

    good: list[CapturedPage] = []
    for p in pages:
        p.portal = detect_portal(p.url)
        if p.ok and len(p.text.strip()) > MIN_PAGE_CHARS:
            _save_snapshot_safe(p)
            good.append(p)
        else:
            manager.emit(
                report_id,
                "warning",
                f"Not checked: {p.url} could not be read ({p.error_code or 'empty page'}).",
                portal=p.portal,
            )
    return good


async def run_investigation(report_id: str, url: str) -> None:
    manager = get_manager()
    manager.create(report_id)

    report = get_report_by_id(report_id)
    if not report:
        return

    report.status = "running"
    portal_id = detect_portal(url)
    report.portal = portal_id
    manager.emit(report_id, "started", f"Starting investigation of your {portal_id or 'listing'} link.", portal=portal_id)

    # ---- 1. Read the listing page (TinyFish Fetch, Agent as fallback)
    manager.emit(report_id, "step", "Reading the listing page with TinyFish...", portal=portal_id)
    captured = await capture_page(url)
    report.captured_at = captured.captured_at

    if not captured.ok:
        manager.emit(
            report_id,
            "failed",
            f"Could not read the page ({captured.error_code}). Nothing was filled in from guesswork.",
        )
        report.status = "failed"
        repository.save_report(report)
        sync_cached_report(report)
        return

    _save_snapshot_safe(captured)
    manager.emit(
        report_id,
        "step",
        f"Read {len(captured.text):,} characters via {captured.fetched_via}. Extracting fields...",
        portal=portal_id,
    )

    state: dict = {"listing": None, "candidates": []}

    # ---- 2. Listing fields (LLM turns page text into fields, with quoted passages)
    async def task_listing():
        listing = await extract_listing_fields(captured)
        if has_content(listing):
            await _ensure_photos(listing)
        report.listing = listing
        state["listing"] = listing
        if not has_content(listing):
            raise RuntimeError(
                "The page was read, but no fields could be extracted. "
                "Check LLM_PROVIDER, LLM_API_KEY and LLM_MODEL in .env, and the backend terminal for the LLM error."
            )

    await run_module(report, "listing", task_listing)
    listing: Optional[ListingFields] = state["listing"]
    listing_ok = has_content(listing)

    # ---- 3. Same place on other portals (Hero 1)
    async def task_matching():
        if not listing_ok:
            report.matching = MatchingResult(
                status="not_checked",
                message="Not checked: the listing could not be read, so we could not search for the same place elsewhere.",
            )
            return

        manager.emit(report_id, "step", "Searching other portals for the same place...")
        urls, checks = await discover_candidate_urls(listing)
        manager.emit(report_id, "step", f"Found {len(urls)} possible pages on other portals. Reading them...")

        pages = await _fetch_candidate_pages(urls, report_id)
        results = await asyncio.gather(
            *[_extract_candidate(p) for p in pages], return_exceptions=True
        )

        candidates: list[ListingFields] = []
        for page, res in zip(pages, results):
            if isinstance(res, Exception):
                msg = getattr(res, "message", None) or str(res)
                manager.emit(
                    report_id,
                    "warning",
                    f"Could not extract details from {page.url}: {msg}",
                    portal=page.portal,
                )
            elif has_content(res):
                candidates.append(res)
            else:
                manager.emit(
                    report_id,
                    "warning",
                    f"{page.url} was read but had no usable listing details.",
                    portal=page.portal,
                )
        state["candidates"] = candidates

        manager.emit(report_id, "step", f"Comparing with {len(candidates)} listing(s) from other portals...")
        report.matching = await find_matches(listing, candidates, checks)

    await run_module(report, "matching", task_matching)

    # ---- 4. Real cost (Hero 2)
    async def task_cost():
        if not listing_ok:
            raise RuntimeError("Listing could not be read, so no cost ladder can be built.")
        report.cost = build_cost_ladder(listing)

    await run_module(report, "cost", task_cost)

    # ---- 5. Fair price
    async def task_fair_price():
        if not listing_ok:
            raise RuntimeError("Listing could not be read.")
        report.fair_price = compute_fair_price(listing, state["candidates"])

    await run_module(report, "fair_price", task_fair_price)

    # ---- 6. Findings + questions
    async def task_questions():
        if listing_ok:
            report.findings = build_findings(listing, report.matching, report.cost, report.fair_price)
            report.questions = build_questions(listing, report.findings, report.cost)
        else:
            placeholder = ListingFields(
                listing_id="unread",
                source=SourceRef(url=url, portal=portal_id, captured_at=captured.captured_at),
                portal=portal_id or "magicbricks",
            )
            report.questions = build_questions(placeholder, [], None)

    await run_module(report, "questions", task_questions)

    await enforce_time_budget(report)
    all_ok = all(m.status == "success" for m in report.modules)
    report.status = "completed" if all_ok else "partial"
    repository.save_report(report)
    sync_cached_report(report)
    manager.emit(report_id, "completed", "Investigation finished. Report ready.")


def start_investigation_job(url: str, force_refresh: bool = False) -> InvestigateResponse:
    target_url = validate_listing_url(url)

    if not force_refresh:
        cached = get_cached_report_by_url(target_url)
        if cached:
            return InvestigateResponse(report_id=cached.report_id, cached=True, is_replay=False)

    report_id = f"rep_{uuid4().hex[:12]}"

    report = Report(
        report_id=report_id,
        status="queued",
        created_at=datetime.now(timezone.utc),
        input_url=target_url,
        share_path=f"/report/{report_id}",
    )

    _REPORTS_CACHE[report_id] = report
    repository.save_report(report)
    return InvestigateResponse(report_id=report_id, cached=False, is_replay=False)