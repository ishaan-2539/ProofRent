import asyncio
import json
from pathlib import Path
import sys

# Ensure backend root is on Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.db.repository import get_report
from app.services.jobs import get_manager
from app.services.orchestrator import get_report_by_id

FIXTURES_DIR = Path(__file__).parent.parent.parent / "shared" / "fixtures"


def export_report_and_events(report_id: str, example_id: str) -> None:
    """Exports an in-memory or DB report and its SSE event history to shared/fixtures."""
    FIXTURES_DIR.mkdir(parents=True, exist_ok=True)

    report = get_report(report_id) or get_report_by_id(report_id)
    if not report:
        print(f"Error: Report '{report_id}' not found in DB or cache.")
        return

    # Update report fields for replay representation
    report.is_replay = True
    report.replay_label = f"Recorded run, {report.created_at.strftime('%d %b %H:%M')}"

    report_file = FIXTURES_DIR / f"report_{example_id}.json"
    with open(report_file, "w", encoding="utf-8") as f:
        f.write(report.model_dump_json(indent=2))
    print(f"Exported report to {report_file}")

    # Export event stream history
    manager = get_manager()
    events = manager._history.get(report_id, [])

    events_data = [json.loads(evt.model_dump_json()) for evt in events]
    events_file = FIXTURES_DIR / f"events_{example_id}.json"
    with open(events_file, "w", encoding="utf-8") as f:
        json.dump(events_data, f, indent=2)
    print(f"Exported {len(events)} events to {events_file}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python scripts/export_fixtures.py <report_id> <example_id>")
        print("Example: python scripts/export_fixtures.py rep_1234 match")
        sys.exit(1)

    export_report_id = sys.argv[1]
    target_example_id = sys.argv[2]
    export_report_and_events(export_report_id, target_example_id)