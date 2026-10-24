import sys
from pathlib import Path
from datetime import datetime, timezone
import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.schemas import ListingFields, RentOption, SourceRef
from app.services.fair_price import compute_fair_price


def test_fair_price_not_enough_data():
    source = SourceRef(url="https://example.com/1", captured_at=datetime.now(timezone.utc))
    target = ListingFields(
        listing_id="t1",
        source=source,
        portal="gopgo",
        rent_options=[RentOption(sharing_type="double", monthly_rent=8000)],
    )

    result = compute_fair_price(target, comparables=[])
    assert result.status == "not_enough_data"
    assert "Found only 0 comparable listings" in result.message


def test_fair_price_success():
    source = SourceRef(url="https://example.com/1", captured_at=datetime.now(timezone.utc))
    target = ListingFields(
        listing_id="t1",
        source=source,
        portal="gopgo",
        rent_options=[RentOption(sharing_type="double", monthly_rent=8000)],
    )

    comparables = []
    for rent in [7500, 8000, 8000, 8500, 9000]:
        comparables.append(
            ListingFields(
                listing_id=f"c_{rent}",
                source=source,
                portal="magicbricks",
                rent_options=[RentOption(sharing_type="double", monthly_rent=rent)],
            )
        )

    result = compute_fair_price(target, comparables)
    assert result.status == "ok"
    assert result.median_rent == 8000
    assert result.position == "near"
    assert "among 5 comparable listings" in result.message