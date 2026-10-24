import logging
from typing import Optional, Tuple

from app.clients.llm import get_llm_client
from app.schemas import (
    CapturedPage,
    ExtractedValue,
    ListingFields,
    RentOption,
    SourceRef,
)

logger = logging.getLogger(__name__)

EXTRACTION_SCHEMA = {
    "type": "object",
    "properties": {
        "title": {"type": "string", "nullable": True},
        "title_passage": {"type": "string", "nullable": True},
        "operator_name": {"type": "string", "nullable": True},
        "operator_name_passage": {"type": "string", "nullable": True},
        "address_text": {"type": "string", "nullable": True},
        "address_text_passage": {"type": "string", "nullable": True},
        "locality": {"type": "string", "nullable": True},
        "locality_passage": {"type": "string", "nullable": True},
        "description": {"type": "string", "nullable": True},
        "description_passage": {"type": "string", "nullable": True},
        "gender_policy": {"type": "string", "nullable": True},
        "gender_policy_passage": {"type": "string", "nullable": True},
        "food_plan": {"type": "string", "nullable": True},
        "food_plan_passage": {"type": "string", "nullable": True},
        "furnishing": {"type": "string", "nullable": True},
        "furnishing_passage": {"type": "string", "nullable": True},
        "floor": {"type": "string", "nullable": True},
        "floor_passage": {"type": "string", "nullable": True},
        "deposit_amount": {"type": "integer", "nullable": True},
        "deposit_amount_passage": {"type": "string", "nullable": True},
        "deposit_months": {"type": "integer", "nullable": True},
        "deposit_months_passage": {"type": "string", "nullable": True},
        "maintenance_monthly": {"type": "integer", "nullable": True},
        "maintenance_monthly_passage": {"type": "string", "nullable": True},
        "electricity_terms": {"type": "string", "nullable": True},
        "electricity_terms_passage": {"type": "string", "nullable": True},
        "electricity_monthly": {"type": "integer", "nullable": True},
        "electricity_monthly_passage": {"type": "string", "nullable": True},
        "ac_charge_monthly": {"type": "integer", "nullable": True},
        "ac_charge_monthly_passage": {"type": "string", "nullable": True},
        "food_charge_monthly": {"type": "integer", "nullable": True},
        "food_charge_monthly_passage": {"type": "string", "nullable": True},
        "brokerage_amount": {"type": "integer", "nullable": True},
        "brokerage_amount_passage": {"type": "string", "nullable": True},
        "brokerage_months": {"type": "integer", "nullable": True},
        "brokerage_months_passage": {"type": "string", "nullable": True},
        "notice_period_days": {"type": "integer", "nullable": True},
        "notice_period_days_passage": {"type": "string", "nullable": True},
        "lock_in_months": {"type": "integer", "nullable": True},
        "lock_in_months_passage": {"type": "string", "nullable": True},
        "amenities": {"type": "array", "items": {"type": "string"}},
        "rent_options": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "sharing_type": {"type": "string"},
                    "ac": {"type": "boolean", "nullable": True},
                    "monthly_rent": {"type": "integer", "nullable": True},
                    "per_bed_stated": {"type": "boolean", "nullable": True},
                    "passage": {"type": "string", "nullable": True},
                },
            },
        },
    },
}


def build_extraction_prompt(page_text: str) -> Tuple[str, str]:
    system_prompt = (
        "You are an expert real estate data extractor for PG and rental listings in Delhi NCR.\n"
        "Extract structured information from the provided listing page text.\n"
        "CRITICAL RULE: For every extracted value, you MUST record the exact verbatim quote/passage from the text.\n"
        "If a value is not explicitly stated in the text, return null for both value and passage.\n"
        "Treat Indian listing terminology properly: '2 sharing' -> sharing_type: 'double', '3 sharing' -> 'triple', etc.\n"
        "Never invent numbers or assume missing fees."
    )
    user_prompt = f"Listing Page Text:\n---\n{page_text}\n---"
    return system_prompt, user_prompt


def verify_passage(passage: Optional[str], page_text: str) -> bool:
    if not passage or not page_text:
        return False
    # Flexible passage check: normalized case & whitespace
    norm_passage = " ".join(passage.lower().split())
    norm_text = " ".join(page_text.lower().split())
    return norm_passage in norm_text


def drop_unverified(listing: ListingFields, page_text: str) -> ListingFields:
    """Drops any extracted scalar field whose quoted passage is not found verbatim in page_text."""
    for field_name in [
        "title",
        "operator_name",
        "address_text",
        "locality",
        "description",
        "gender_policy",
        "food_plan",
        "furnishing",
        "floor",
        "deposit_amount",
        "deposit_months",
        "maintenance_monthly",
        "electricity_terms",
        "electricity_monthly",
        "ac_charge_monthly",
        "food_charge_monthly",
        "brokerage_amount",
        "brokerage_months",
        "notice_period_days",
        "lock_in_months",
    ]:
        ev: ExtractedValue = getattr(listing, field_name)
        if ev.value is not None and not verify_passage(ev.passage, page_text):
            logger.info(f"Dropping unverified field {field_name}: passage '{ev.passage}' not in text")
            setattr(listing, field_name, ExtractedValue(value=None, passage=None))

    # Clean rent options
    valid_rents = []
    for option in listing.rent_options:
        if option.passage and not verify_passage(option.passage, page_text):
            continue
        valid_rents.append(option)
    listing.rent_options = valid_rents

    return listing


def merge_listing_fields(base: ListingFields, extra: ListingFields) -> ListingFields:
    """Merges secondary listing fields into base fields (base wins if both present)."""
    for field_name in [
        "title",
        "operator_name",
        "address_text",
        "locality",
        "description",
        "gender_policy",
        "food_plan",
        "furnishing",
        "floor",
        "deposit_amount",
        "deposit_months",
        "maintenance_monthly",
        "electricity_terms",
        "electricity_monthly",
        "ac_charge_monthly",
        "food_charge_monthly",
        "brokerage_amount",
        "brokerage_months",
        "notice_period_days",
        "lock_in_months",
    ]:
        base_val: ExtractedValue = getattr(base, field_name)
        extra_val: ExtractedValue = getattr(extra, field_name)
        if base_val.value is None and extra_val.value is not None:
            setattr(base, field_name, extra_val)

    if not base.rent_options and extra.rent_options:
        base.rent_options = extra.rent_options

    if not base.amenities and extra.amenities:
        base.amenities = extra.amenities

    return base


async def extract_listing_fields(page: CapturedPage) -> ListingFields:
    source = SourceRef(
        url=page.url,
        portal=page.portal,
        captured_at=page.captured_at,
        snapshot_id=page.snapshot_id,
    )

    base_listing = ListingFields(
        listing_id=f"list_{hash(page.url) % 1000000}",
        source=source,
        portal=page.portal or "gopgo",
        status="live" if page.ok else "unknown",
    )

    if not page.text or not page.ok:
        return base_listing

    llm = get_llm_client()
    sys_prompt, user_prompt = build_extraction_prompt(page.text)

    try:
        data = await llm.extract_json(sys_prompt, user_prompt, EXTRACTION_SCHEMA)
    except Exception as e:
        logger.error(f"Extraction failed for {page.url}: {e}")
        return base_listing

    def make_ev(key: str) -> ExtractedValue:
        val = data.get(key)
        passage = data.get(f"{key}_passage")
        return ExtractedValue(value=val, passage=passage)

    rent_opts = []
    for ro in data.get("rent_options", []):
        rent_opts.append(
            RentOption(
                sharing_type=ro.get("sharing_type", "other"),
                ac=ro.get("ac"),
                monthly_rent=ro.get("monthly_rent"),
                per_bed_stated=ro.get("per_bed_stated"),
                passage=ro.get("passage"),
            )
        )

    listing = ListingFields(
        listing_id=base_listing.listing_id,
        source=source,
        portal=base_listing.portal,
        status="live",
        title=make_ev("title"),
        operator_name=make_ev("operator_name"),
        address_text=make_ev("address_text"),
        locality=make_ev("locality"),
        description=make_ev("description"),
        gender_policy=make_ev("gender_policy"),
        food_plan=make_ev("food_plan"),
        furnishing=make_ev("furnishing"),
        floor=make_ev("floor"),
        deposit_amount=make_ev("deposit_amount"),
        deposit_months=make_ev("deposit_months"),
        maintenance_monthly=make_ev("maintenance_monthly"),
        electricity_terms=make_ev("electricity_terms"),
        electricity_monthly=make_ev("electricity_monthly"),
        ac_charge_monthly=make_ev("ac_charge_monthly"),
        food_charge_monthly=make_ev("food_charge_monthly"),
        brokerage_amount=make_ev("brokerage_amount"),
        brokerage_months=make_ev("brokerage_months"),
        notice_period_days=make_ev("notice_period_days"),
        lock_in_months=make_ev("lock_in_months"),
        rent_options=rent_opts,
        amenities=data.get("amenities", []),
    )

    return drop_unverified(listing, page.text)