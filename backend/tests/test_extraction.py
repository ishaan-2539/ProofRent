import sys
from pathlib import Path
from datetime import datetime, timezone
import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.schemas import CapturedPage, ExtractedValue, ListingFields, RentOption, SourceRef
from app.services.extraction import verify_passage, drop_unverified, merge_listing_fields


def test_verify_passage():
    page_text = "Aggarwal PG in Govindpuri Delhi near IIIT. Rent is Rs 8000 per month."
    assert verify_passage("Rent is Rs 8000 per month", page_text) is True
    assert verify_passage("rent is rs 8000 PER month.", page_text) is True
    assert verify_passage("Rent is Rs 15000", page_text) is False


def test_drop_unverified():
    page_text = "Aggarwal PG in Govindpuri Delhi near IIIT."
    source = SourceRef(url="https://gopgo.in/pg", captured_at=datetime.now(timezone.utc))

    listing = ListingFields(
        listing_id="l1",
        source=source,
        portal="gopgo",
        title=ExtractedValue(value="Aggarwal PG", passage="Aggarwal PG"),
        deposit_amount=ExtractedValue(value=10000, passage="Deposit Rs 10000"),  # Fake passage
    )

    cleaned = drop_unverified(listing, page_text)
    assert cleaned.title.value == "Aggarwal PG"
    assert cleaned.deposit_amount.value is None
    assert cleaned.deposit_amount.passage is None


def test_merge_listing_fields():
    source = SourceRef(url="https://example.com", captured_at=datetime.now(timezone.utc))
    base = ListingFields(
        listing_id="b1",
        source=source,
        portal="gopgo",
        title=ExtractedValue(value="Base Title", passage="Base Title"),
    )
    extra = ListingFields(
        listing_id="e1",
        source=source,
        portal="gopgo",
        title=ExtractedValue(value="Extra Title", passage="Extra Title"),
        locality=ExtractedValue(value="Govindpuri", passage="Govindpuri"),
    )

    merged = merge_listing_fields(base, extra)
    assert merged.title.value == "Base Title"
    assert merged.locality.value == "Govindpuri"