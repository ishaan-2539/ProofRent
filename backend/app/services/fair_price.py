import logging
import statistics
from typing import List, Optional

from app.core.constants import get_constants
from app.schemas import FairPriceResult, ListingFields

logger = logging.getLogger(__name__)


def compute_fair_price(
    listing: ListingFields, comparables: List[ListingFields]
) -> FairPriceResult:
    thresholds = get_constants().get("thresholds", {})
    min_required = int(thresholds.get("min_comparable_listings", 5))
    near_band_pct = float(thresholds.get("fair_price_near_band_pct", 10))

    if not listing.rent_options or listing.rent_options[0].monthly_rent is None:
        return FairPriceResult(
            status="not_enough_data",
            comparable_count=len(comparables),
            sharing_type=None,
            median_rent=None,
            listing_rent=None,
            position=None,
            message="Listing rent is not available for price comparison.",
        )

    target_rent = listing.rent_options[0].monthly_rent
    target_sharing = listing.rent_options[0].sharing_type

    # Filter comparables with the same sharing type and valid rent
    valid_comparable_rents: List[int] = []
    for comp in comparables:
        for opt in comp.rent_options:
            if opt.sharing_type == target_sharing and opt.monthly_rent is not None:
                valid_comparable_rents.append(opt.monthly_rent)
                break

    comp_count = len(valid_comparable_rents)

    if comp_count < min_required:
        return FairPriceResult(
            status="not_enough_data",
            comparable_count=comp_count,
            sharing_type=target_sharing,
            median_rent=None,
            listing_rent=target_rent,
            position=None,
            message=f"Found only {comp_count} comparable listings, not enough to compare (minimum {min_required} required).",
        )

    median_rent = int(statistics.median(valid_comparable_rents))
    diff_pct = ((target_rent - median_rent) / median_rent) * 100.0

    if diff_pct < -near_band_pct:
        position = "below"
        pos_str = "below"
    elif diff_pct > near_band_pct:
        position = "above"
        pos_str = "above"
    else:
        position = "near"
        pos_str = "near"

    message = f"Rent of ₹{target_rent:,} is {pos_str} the median of ₹{median_rent:,} among {comp_count} comparable listings found."

    return FairPriceResult(
        status="ok",
        comparable_count=comp_count,
        sharing_type=target_sharing,
        median_rent=median_rent,
        listing_rent=target_rent,
        position=position,
        message=message,
    )