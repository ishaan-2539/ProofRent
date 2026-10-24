import sys
from pathlib import Path
from datetime import datetime, timezone
import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.schemas import ExtractedValue, ListingFields, RentOption, SourceRef
from app.services.costing import build_cost_ladder
from app.services.findings import assert_neutral, build_findings, find_banned_words
from app.services.questions import build_questions


def test_banned_words_detection():
    assert "scam" in find_banned_words("This listing looks like a scam.")
    assert "fraud" in find_banned_words("Potential fraud detected.")
    assert len(find_banned_words("Observed price discrepancy between portals.")) == 0


def test_assert_neutral_raises():
    with pytest.raises(ValueError):
        assert_neutral("Warning: fake listing!")


def test_build_questions_fallback():
    source = SourceRef(url="https://example.com", captured_at=datetime.now(timezone.utc))
    listing = ListingFields(listing_id="l1", source=source, portal="gopgo")
    
    questions = build_questions(listing, findings=[])
    assert len(questions) >= 3
    assert questions[0].is_default is True