import asyncio
import json
from pathlib import Path
from typing import AsyncIterator, List

from app.schemas import ExampleId, ExampleListing, JobEvent, Report

FIXTURES_DIR = Path(__file__).parent.parent.parent.parent / "shared" / "fixtures"

EXAMPLES: List[ExampleListing] = [
    ExampleListing(
        example_id="match",
        title="Aggarwal PG (Price Gap Match)",
        description="Aggarwal PG in Govindpuri listed on GoPGo at ₹8,000 and Magicbricks at ₹7,500.",
        url="https://gopgo.in/listing/aggarwal-pg-govindpuri",
        portal="gopgo",
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
        description="Stated rent ₹9,000, but mandatory food (₹2,500) and maintenance (₹1,000) added.",
        url="https://housing.com/in/buy/resale/page/102938",
        portal="housing",
    ),
    ExampleListing(
        example_id="blocked",
        title="99acres Listing (Blocked Portal)",
        description="Demonstrates non-happy state when portal requires CAPTCHA/bot verification.",
        url="https://99acres.com/pg-in-delhi-ncr-ffid",
        portal="ninetynineacres",
    ),
]


def list_examples() -> List[ExampleListing]:
    return EXAMPLES


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