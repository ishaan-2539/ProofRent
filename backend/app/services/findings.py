import logging
from typing import List, Optional

from app.core.constants import get_constants
from app.schemas import (
    CostLadder,
    FairPriceResult,
    Finding,
    ListingFields,
    MatchingResult,
    SourceRef,
)

logger = logging.getLogger(__name__)


def find_banned_words(text: str) -> List[str]:
    if not text:
        return []
    banned = get_constants().get("banned_words", ["scam", "fraud", "fake", "cheat"])
    text_lower = text.lower()
    return [word for word in banned if word in text_lower]


def assert_neutral(text: str) -> str:
    found = find_banned_words(text)
    if found:
        raise ValueError(
            f"Banned subjective/accusatory words found in copy: {found}. "
            "Use neutral observation language instead."
        )
    return text


def build_findings(
    listing: ListingFields,
    matching: Optional[MatchingResult] = None,
    cost: Optional[CostLadder] = None,
    fair_price: Optional[FairPriceResult] = None,
) -> List[Finding]:
    findings: List[Finding] = []

    # 1. Same Place Finding (Hero 1)
    if matching and matching.candidates:
        top_match = matching.candidates[0]
        sources = [listing.source, top_match.listing.source]
        
        what_we_saw = (
            f"This property is also listed on {top_match.listing.portal.capitalize()} "
            f"with a price gap."
        )
        if top_match.price_gaps:
            gap = top_match.price_gaps[0]
            diff = abs(gap.difference)
            direction = "lower" if gap.difference < 0 else "higher"
            what_we_saw = (
                f"Listed on {top_match.listing.portal.capitalize()} for "
                f"₹{gap.rent_there:,}/month (₹{diff:,} {direction} than here)."
            )

        finding = Finding(
            finding_id="find_same_place",
            kind="same_place",
            what_we_saw=assert_neutral(what_we_saw),
            sources=sources,
            how_we_matched=top_match.method,
            confidence=top_match.confidence,
            other_explanations=top_match.alternative_explanations or [
                "Listing updated at different times across portals.",
                "Different room furnishing or meal options included."
            ],
            label="verified" if top_match.confidence == "high" else "uncertain",
            question="Can you match the lower rate listed on the other portal?",
        )
        findings.append(finding)

    # 2. Cost Finding (Hero 2)
    if cost and cost.lines:
        listed_extra = [
            line for line in cost.lines 
            if line.label == "listed" and line.key not in ("rent", "deposit")
        ]
        if listed_extra:
            extra_titles = ", ".join(line.title for line in listed_extra)
            what_we_saw = (
                f"Base rent is ₹{listing.rent_options[0].monthly_rent:,}, but "
                f"additional mandatory fees ({extra_titles}) bring base monthly cost higher."
            )
            finding = Finding(
                finding_id="find_cost_structure",
                kind="cost",
                what_we_saw=assert_neutral(what_we_saw),
                sources=[listing.source],
                how_we_matched=None,
                confidence=None,
                other_explanations=[],
                label="verified",
                question="Are there any additional monthly or one-time fees not stated in the listing?",
            )
            findings.append(finding)

    # 3. Fair Price Finding
    if fair_price and fair_price.status == "ok" and fair_price.message:
        finding = Finding(
            finding_id="find_fair_price",
            kind="fair_price",
            what_we_saw=assert_neutral(fair_price.message),
            sources=[listing.source],
            how_we_matched=f"Compared against {fair_price.comparable_count} local listings",
            confidence="medium",
            other_explanations=[],
            label="inferred",
            question=None,
        )
        findings.append(finding)

    return findings