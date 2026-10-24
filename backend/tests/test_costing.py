import sys
from pathlib import Path
from datetime import datetime, timezone
import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.schemas import ExtractedValue, ListingFields, RentOption, SourceRef
from app.services.costing import build_cost_ladder, sum_ranges


def test_build_cost_ladder_basic():
    source = SourceRef(url="https://gopgo.in/listing/1", captured_at=datetime.now(timezone.utc))
    listing = ListingFields(
        listing_id="l1",
        source=source,
        portal="gopgo",
        rent_options=[
            RentOption(sharing_type="double", ac=True, monthly_rent=8000, passage="8000 rent")
        ],
        deposit_amount=ExtractedValue(value=8000, passage="8000 deposit"),
        maintenance_monthly=ExtractedValue(value=500, passage="500 maintenance"),
    )

    ladder = build_cost_ladder(listing)
    assert ladder.status == "ok"
    assert ladder.monthly_min == 8500
    assert ladder.unknown_count >= 1  # electricity unknown
    assert ladder.monthly_max is None  # max is None because electricity is unknown
    assert "At least ₹8,500" in ladder.headline


def test_cost_ladder_missing_rent():
    source = SourceRef(url="https://example.com", captured_at=datetime.now(timezone.utc))
    listing = ListingFields(listing_id="l2", source=source, portal="gopgo")

    ladder = build_cost_ladder(listing)
    assert ladder.status == "rent_missing"
    assert ladder.headline == "Rent not available"
    