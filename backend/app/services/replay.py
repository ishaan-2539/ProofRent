import asyncio
import json
from pathlib import Path
from typing import AsyncIterator, List, Optional

from app.schemas import ExampleId, ExampleListing, JobEvent, Report

FIXTURES_DIR = Path(__file__).parent.parent.parent.parent / "shared" / "fixtures"

# NOTE: single source of truth for the example list (routes_system.py uses this).
# Only "match" points at a real listing (the Aggarwal PG Magicbricks page from the
# 20 Oct trial). The other three still use the original fixture URLs: replace them
# with real listing links after you export real runs (see scripts/export_fixtures.py).
EXAMPLES: List[ExampleListing] = [
    ExampleListing(
        example_id="match",
        title="Aggarwal Paying Guest, Govindpuri",
        description="Same operator appears on Magicbricks, PGdekho, GoPGo and HexaHome at different rents.",
        url="https://www.magicbricks.com/propertyDetail/aggarwal-paying-guest-pg-govindpuri-in-new-delhi&pgid=4d42333331303339677261646532",
        portal="magicbricks",
    ),
    ExampleListing(
        example_id="no_match",
        title="Single PG Room (No Match)",
        description="Independent single room in Kalkaji on NoBroker with no duplicates found.",
        url="https://nobroker.in/property/pg-in-kalkaji",
        portal="nobroker",
    ),
    ExampleListing(
        example_id="hidden_fees",
        title="Mathur PG (Hidden Fee Ladder)",
        description="Stated rent plus mandatory food and maintenance added on top.",
        url="https://housing.com/in/buy/resale/page/102938",
        portal="housing",
    ),
    ExampleListing(
        example_id="blocked",
        title="99acres Listing (Blocked Portal)",
        description="Shows the non-happy state when a portal blocks automated access.",
        url="https://99acres.com/pg-in-delhi-ncr-ffid",
        portal="ninetynineacres",
    ),
]


def _norm(url: str) -> str:
    return url.strip().lower().rstrip("/")


def list_examples() -> List[ExampleListing]:
    return EXAMPLES


def example_id_for_url(url: Optional[str]) -> Optional[ExampleId]:
    """Return the example whose URL equals `url`, else None."""
    if not url:
        return None
    for ex in EXAMPLES:
        if _norm(ex.url) == _norm(url):
            return ex.example_id
    return None


def load_replay_report(example_id: ExampleId) -> Report:
    report_file = FIXTURES_DIR / f"report_{example_id}.json"
    if not report_file.exists():
        raise FileNotFoundError(f"Replay fixture missing: {report_file}")

    with open(report_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    return Report.model_validate(data)


async def replay_events(
    example_id: ExampleId, report_id: str, delay_seconds: float = 0.5
) -> AsyncIterator[JobEvent]:
    events_file = FIXTURES_DIR / f"events_{example_id}.json"
    if not events_file.exists():
        raise FileNotFoundError(f"Events fixture missing: {events_file}")

    with open(events_file, "r", encoding="utf-8") as f:
        raw_events = json.load(f)

    for raw in raw_events:
        event = JobEvent.model_validate(raw)
        event.report_id = report_id
        yield event
        await asyncio.sleep(delay_seconds)