import json
import sys
from pathlib import Path
import pytest

# Add backend directory to sys.path so app module can be found
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.schemas import Report, JobEvent

FIXTURES_DIR = Path(__file__).parent.parent.parent / "shared" / "fixtures"

@pytest.mark.parametrize("example_id", ["match", "no_match", "hidden_fees", "blocked"])
def test_report_fixtures_parse(example_id):
    report_path = FIXTURES_DIR / f"report_{example_id}.json"
    assert report_path.exists(), f"Missing fixture: {report_path}"
    with open(report_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    report = Report.model_validate(data)
    assert report.is_replay is True

@pytest.mark.parametrize("example_id", ["match", "no_match", "hidden_fees", "blocked"])
def test_event_fixtures_parse(example_id):
    events_path = FIXTURES_DIR / f"events_{example_id}.json"
    assert events_path.exists(), f"Missing fixture: {events_path}"
    with open(events_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    events = [JobEvent.model_validate(e) for e in data]
    assert len(events) > 0