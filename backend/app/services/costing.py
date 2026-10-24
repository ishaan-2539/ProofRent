import logging
from typing import List, Optional, Tuple

from app.core.constants import get_constants
from app.schemas import (
    CostKey,
    CostLadder,
    CostLine,
    ListingFields,
    RentOption,
    SourceRef,
)

logger = logging.getLogger(__name__)


def select_rent_option(
    listing: ListingFields, index: int = 0
) -> Optional[RentOption]:
    if not listing.rent_options or index >= len(listing.rent_options):
        return None
    return listing.rent_options[index]


def sum_ranges(
    lines: List[CostLine],
) -> Tuple[Optional[int], Optional[int], Optional[int], Optional[int]]:
    """Calculates monthly and move-in min/max totals.
    If ANY counted line has an unknown upper bound, the max total becomes None.
    """
    monthly_min = 0
    monthly_max: Optional[int] = 0
    move_in_min = 0
    move_in_max: Optional[int] = 0

    has_monthly = False
    has_move_in = False

    for line in lines:
        if line.recurrence == "terms":
            continue  # Terms lines (e.g. notice period) are never summed

        # Monthly recurrence lines
        if line.recurrence == "monthly":
            has_monthly = True
            if line.amount_min is not None:
                monthly_min += line.amount_min
            if monthly_max is not None:
                if line.amount_max is not None:
                    monthly_max += line.amount_max
                elif line.label == "unknown":
                    monthly_max = None

        # One-time or monthly lines contribute to move-in cost
        has_move_in = True
        if line.amount_min is not None:
            move_in_min += line.amount_min
        if move_in_max is not None:
            if line.amount_max is not None:
                move_in_max += line.amount_max
            elif line.label == "unknown":
                move_in_max = None

    final_m_min = monthly_min if has_monthly else None
    final_m_max = monthly_max if has_monthly else None
    final_mi_min = move_in_min if has_move_in else None
    final_mi_max = move_in_max if has_move_in else None

    return final_m_min, final_m_max, final_mi_min, final_mi_max


def build_headline(monthly_min: Optional[int], unknown_count: int) -> str:
    if monthly_min is None:
        return "Rent not available"
    if unknown_count == 0:
        return f"Estimated ₹{monthly_min:,}/month"
    return f"At least ₹{monthly_min:,}, with {unknown_count} unknown"


def build_cost_ladder(
    listing: ListingFields, rent_option_index: int = 0
) -> CostLadder:
    rent_opt = select_rent_option(listing, rent_option_index)

    if not rent_opt or rent_opt.monthly_rent is None:
        return CostLadder(
            status="rent_missing",
            rent_option_index=rent_option_index,
            sharing_type=rent_opt.sharing_type if rent_opt else None,
            lines=[],
            monthly_min=None,
            monthly_max=None,
            move_in_min=None,
            move_in_max=None,
            unknown_count=0,
            headline="Rent not available",
        )

    lines: List[CostLine] = []

    # 1. Rent Line
    lines.append(
        CostLine(
            key="rent",
            title="Monthly Rent",
            label="listed",
            recurrence="monthly",
            amount_min=rent_opt.monthly_rent,
            amount_max=rent_opt.monthly_rent,
            source=listing.source,
            passage=rent_opt.passage or listing.title.passage,
        )
    )

    # 2. Deposit Line
    if listing.deposit_amount.value is not None:
        lines.append(
            CostLine(
                key="deposit",
                title="Security Deposit",
                label="listed",
                recurrence="one_time",
                amount_min=int(listing.deposit_amount.value),
                amount_max=int(listing.deposit_amount.value),
                source=listing.source,
                passage=listing.deposit_amount.passage,
            )
        )
    else:
        lines.append(
            CostLine(
                key="deposit",
                title="Security Deposit",
                label="unknown",
                recurrence="one_time",
                question="What is the security deposit amount and is it fully refundable?",
            )
        )

    # 3. Food Fee
    if listing.food_charge_monthly.value is not None:
        lines.append(
            CostLine(
                key="food",
                title="Food Charge",
                label="listed",
                recurrence="monthly",
                amount_min=int(listing.food_charge_monthly.value),
                amount_max=int(listing.food_charge_monthly.value),
                source=listing.source,
                passage=listing.food_charge_monthly.passage,
            )
        )

    # 4. Maintenance Fee
    if listing.maintenance_monthly.value is not None:
        lines.append(
            CostLine(
                key="maintenance",
                title="Maintenance Fee",
                label="listed",
                recurrence="monthly",
                amount_min=int(listing.maintenance_monthly.value),
                amount_max=int(listing.maintenance_monthly.value),
                source=listing.source,
                passage=listing.maintenance_monthly.passage,
            )
        )

    # 5. Brokerage Fee
    if listing.brokerage_amount.value is not None:
        lines.append(
            CostLine(
                key="brokerage",
                title="Brokerage Fee",
                label="listed",
                recurrence="one_time",
                amount_min=int(listing.brokerage_amount.value),
                amount_max=int(listing.brokerage_amount.value),
                source=listing.source,
                passage=listing.brokerage_amount.passage,
            )
        )
    else:
        # Assumed range: 0 to 1 month rent
        lines.append(
            CostLine(
                key="brokerage",
                title="Brokerage Fee",
                label="assumed",
                recurrence="one_time",
                amount_min=0,
                amount_max=rent_opt.monthly_rent,
                assumption_text="Brokerage assumed between 0 and 1 month's rent unless the listing says otherwise.",
            )
        )

    # 6. Electricity
    if listing.electricity_monthly.value is not None:
        lines.append(
            CostLine(
                key="electricity",
                title="Electricity",
                label="listed",
                recurrence="monthly",
                amount_min=int(listing.electricity_monthly.value),
                amount_max=int(listing.electricity_monthly.value),
                source=listing.source,
                passage=listing.electricity_monthly.passage,
            )
        )
    else:
        lines.append(
            CostLine(
                key="electricity",
                title="Electricity",
                label="unknown",
                recurrence="monthly",
                question="How is electricity billed (metered, per-unit rate, or fixed)?",
                display_value=str(listing.electricity_terms.value)
                if listing.electricity_terms.value
                else None,
            )
        )

    # 7. Terms Lines (Notice Period)
    if listing.notice_period_days.value is not None:
        lines.append(
            CostLine(
                key="notice_period",
                title="Notice Period",
                label="listed",
                recurrence="terms",
                source=listing.source,
                passage=listing.notice_period_days.passage,
                display_value=f"{listing.notice_period_days.value} days notice",
            )
        )

    unknown_count = sum(1 for line in lines if line.label == "unknown")
    m_min, m_max, mi_min, mi_max = sum_ranges(lines)
    headline = build_headline(m_min, unknown_count)

    return CostLadder(
        status="ok",
        rent_option_index=rent_option_index,
        sharing_type=rent_opt.sharing_type,
        lines=lines,
        monthly_min=m_min,
        monthly_max=m_max,
        move_in_min=mi_min,
        move_in_max=mi_max,
        unknown_count=unknown_count,
        headline=headline,
    )