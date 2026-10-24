import math
import re
from typing import Optional
from rapidfuzz import fuzz

from app.core.constants import get_threshold
from app.services.photos import download_photo, perceptual_hash, hash_distance
from app.schemas import (
    ListingFields, 
    MatchCandidate, 
    MatchingResult, 
    FamilyResult, 
    PriceGap, 
    PortalCheck,
    MatchLevel,
    Confidence,
    SignalFamily
)


def normalize_name(name: str) -> str:
    """Normalize PG/operator names for fuzzy matching."""
    s = name.lower()
    s = re.sub(r'\bphase\s*3\b', 'phase iii', s)
    s = re.sub(r'\bphase\s*2\b', 'phase ii', s)
    s = re.sub(r'\bphase\s*1\b', 'phase i', s)
    s = re.sub(r'[^a-z0-9\s]', '', s)
    return ' '.join(s.split())


def score_location(a: ListingFields, b: ListingFields) -> FamilyResult:
    """Compare location signal family (map pin distance, locality, address)."""
    if a.lat is not None and a.lng is not None and b.lat is not None and b.lng is not None:
        # Haversine distance in meters
        R = 6371000
        phi1, phi2 = math.radians(a.lat), math.radians(b.lat)
        dphi = math.radians(b.lat - a.lat)
        dlambda = math.radians(b.lng - a.lng)
        val = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
        dist_m = 2 * R * math.atan2(math.sqrt(val), math.sqrt(1-val))
        
        max_dist = get_threshold("location_match_max_distance_m")
        agreed = dist_m <= max_dist
        return FamilyResult(family="location", agreed=agreed, detail=f"Map pins {int(dist_m)} m apart")

    addr_a = (a.address_text.value or "") + " " + (a.locality.value or "")
    addr_b = (b.address_text.value or "") + " " + (b.locality.value or "")
    if addr_a.strip() and addr_b.strip():
        ratio = fuzz.token_set_ratio(addr_a.lower(), addr_b.lower())
        agreed = ratio >= 80
        return FamilyResult(family="location", agreed=agreed, detail=f"Address similarity {ratio}%")

    return FamilyResult(family="location", agreed=None, detail="Location data unavailable")


def score_identity(a: ListingFields, b: ListingFields) -> FamilyResult:
    """Compare identity signal family (operator name, PG title)."""
    name_a = normalize_name(str(a.operator_name.value or a.title.value or ""))
    name_b = normalize_name(str(b.operator_name.value or b.title.value or ""))
    
    if not name_a or not name_b:
        return FamilyResult(family="identity", agreed=None, detail="Operator name unavailable")

    score = fuzz.token_set_ratio(name_a, name_b)
    min_score = get_threshold("name_similarity_min")
    agreed = score >= min_score
    return FamilyResult(family="identity", agreed=agreed, detail=f"Name similarity {score}%")


def score_content(a: ListingFields, b: ListingFields) -> tuple[FamilyResult, list[str]]:
    """Compare content signal family (shared description sentences & attributes)."""
    desc_a = str(a.description.value or "")
    desc_b = str(b.description.value or "")

    sents_a = [s.strip() for s in re.split(r'[.!?\n]', desc_a) if len(s.split()) >= get_threshold("shared_sentence_min_words")]
    sents_b = [s.strip() for s in re.split(r'[.!?\n]', desc_b) if len(s.split()) >= get_threshold("shared_sentence_min_words")]

    shared = [s for s in sents_a if any(fuzz.ratio(s.lower(), sb.lower()) > 85 for sb in sents_b)]
    agreed = len(shared) > 0 or fuzz.token_set_ratio(desc_a, desc_b) > 80

    return FamilyResult(family="content", agreed=agreed, detail=f"{len(shared)} shared text passages"), shared


async def score_visual(a: ListingFields, b: ListingFields) -> FamilyResult:
    """Compare visual signal family using perceptual image hashes."""
    if not a.photo_urls or not b.photo_urls:
        return FamilyResult(family="visual", agreed=None, detail="Photos not compared")

    data_a = await download_photo(a.photo_urls[0])
    data_b = await download_photo(b.photo_urls[0])

    if not data_a or not data_b:
        return FamilyResult(family="visual", agreed=None, detail="Photo comparison unavailable")

    hash_a = perceptual_hash(data_a)
    hash_b = perceptual_hash(data_b)

    if hash_a and hash_b:
        dist = hash_distance(hash_a, hash_b)
        max_dist = get_threshold("photo_hash_max_distance")
        agreed = dist <= max_dist
        return FamilyResult(family="visual", agreed=agreed, detail=f"Image hash distance {dist}")

    return FamilyResult(family="visual", agreed=None, detail="Photos not compared")


def decide_match(families: list[FamilyResult]) -> Optional[tuple[MatchLevel, Confidence]]:
    """Determine match level and confidence based on agreement across signal families."""
    agreed_map = {f.family: f.agreed for f in families}

    loc = agreed_map.get("location") == True
    ident = agreed_map.get("identity") == True
    content = agreed_map.get("content") == True
    visual = agreed_map.get("visual") == True

    if (loc and ident and content) or (ident and content and visual):
        return ("match", "high")
    if (loc and ident) or (ident and content) or (loc and content):
        return ("match", "medium")
    if ident or loc or (content and visual):
        return ("possible", "low")

    return None


def build_price_gaps(here: ListingFields, there: ListingFields) -> list[PriceGap]:
    """Calculate price gaps for matching sharing options across two listings."""
    gaps = []
    for opt_a in here.rent_options:
        for opt_b in there.rent_options:
            if opt_a.sharing_type == opt_b.sharing_type and opt_a.monthly_rent and opt_b.monthly_rent:
                diff = opt_b.monthly_rent - opt_a.monthly_rent
                gaps.append(
                    PriceGap(
                        sharing_type=opt_a.sharing_type,
                        ac=opt_a.ac,
                        rent_here=opt_a.monthly_rent,
                        rent_there=opt_b.monthly_rent,
                        difference=diff,
                        comparable=True,
                        note="Price gap observed across public portals"
                    )
                )
    return gaps


async def compare_listings(a: ListingFields, b: ListingFields) -> Optional[MatchCandidate]:
    """Compare two listings and construct a MatchCandidate if signals meet decision rules."""
    loc_res = score_location(a, b)
    ident_res = score_identity(a, b)
    content_res, shared_sents = score_content(a, b)
    visual_res = await score_visual(a, b)

    families = [loc_res, ident_res, content_res, visual_res]
    decision = decide_match(families)

    if not decision:
        return None

    match_level, confidence = decision
    gaps = build_price_gaps(a, b)

    return MatchCandidate(
        candidate_id=f"cand_{b.listing_id}",
        listing=b,
        scope="same_place",
        match_level=match_level,
        confidence=confidence,
        method="Location, operator name, and description text matching",
        families=families,
        shared_sentences=shared_sents,
        price_gaps=gaps,
        alternative_explanations=[
            "The same operator legitimately lists on several portals.",
            "Different sharing options, furnishings, or meal plans included.",
            "Stale listing with outdated pricing."
        ]
    )


async def find_matches(
    listing: ListingFields, 
    candidates: list[ListingFields], 
    portals_checked: list[PortalCheck]
) -> MatchingResult:
    """Evaluate candidate listings and rank top matching candidates."""
    matched_candidates: list[MatchCandidate] = []

    for cand_fields in candidates:
        match_cand = await compare_listings(listing, cand_fields)
        if match_cand:
            matched_candidates.append(match_cand)

    max_shown = int(get_threshold("max_candidates_shown"))
    top_candidates = matched_candidates[:max_shown]

    if any(c.match_level == "match" for c in top_candidates):
        status = "match_found"
        msg = f"Found {len(top_candidates)} matching listing(s) on other portals."
    elif any(c.match_level == "possible" for c in top_candidates):
        status = "possible_match"
        msg = "Found possible match candidate(s) requiring verification."
    else:
        status = "no_match"
        msg = f"Checked {len(portals_checked)} portals and found no matching duplicate listing."

    return MatchingResult(
        status=status,
        candidates=top_candidates,
        portals_checked=portals_checked,
        nearby_listings_count=len(candidates),
        message=msg
    )