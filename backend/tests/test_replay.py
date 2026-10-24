import sys
from pathlib import Path
import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.replay import list_examples, load_replay_report, replay_events


def test_list_examples():
    examples = list_examples()
    assert len(examples) == 4
    ids = [e.example_id for e in examples]
    assert "match" in ids
    assert "hidden_fees" in ids


def test_load_replay_report():
    report = load_replay_report("match")
    assert report.is_replay is True
    assert report.report_id == "report_match"


@pytest.mark.asyncio
async def test_replay_events():
    events = []
    async for event in replay_events("match", "test_report_123", delay_seconds=0.01):
        events.append(event)

    assert len(events) > 0
    assert events[0].report_id == "test_report_123"