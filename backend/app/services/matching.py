import asyncio
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
    MatchScope,
    Confidence,
)

# =====================================================================================
# WHY THIS FILE CHANGED
# -------------------------------------------------------------------------------------
# The old matcher compared raw names with token_set_ratio, so "Aggarwal Paying Guest",
# "Agarwal PG House" and "aggrawal pg" scored low and were never linked. It also needed
# an exact sharing-type string match to build a price gap, so "Rent/Bed onwards" (type
# "other") never lined up with "twin" / "double" rows, and candidates were never ranked.
#
# Fixes:
#   1. Names: generic words (PG, paying guest, hostel, girls, locality...) are removed and
#      spelling variants (Aggarwal / Agarwal / Agrawal / Aggrawal) are treated as equal.
#   2. Location: tiered (map pin > house/plot number > same neighbourhood). A shared
#      neighbourhood alone is honest "same operator branch", not "same building".
#   3. Decision: operator name + same neighbourhood now yields a "possible" match
#      (scope = same_operator_branch) instead of nothing.
#   4. Price gaps: pairs sharing types and AC flags sensibly, with a clearly-labelled
#      "starting price" fallback when sharing types are labelled differently.
#   5. Candidates are scored in parallel, ranked best-first, one per portal.
# Rent is NEVER used as evidence of identity (the product's finding is that rents differ).
# =====================================================================================


# ------------------------------------------------------------------ text helpers
_MINIMAL_GENERIC = {
    "pg", "pgs", "paying", "guest", "guests", "hostel", "hostels",
    "delhi", "ncr", "new", "the", "in", "at", "of", "and", "for", "near", "a",
}

_GENERIC_NAME_WORDS = _MINIMAL_GENERIC | {
    "accommodation", "accomodation", "house", "home", "homes", "residency", "residence",
    "room", "rooms", "stay", "stays", "boys", "girls", "boy", "girl", "men", "women",
    "gents", "ladies", "male", "female", "only", "sharing", "furnished", "semi", "fully",
    "co", "living", "coliving", "apartment", "flat", "property", "with", "food", "ac",
    "non", "available", "rent", "rental", "luxury", "premium", "best", "budget",
    "affordable", "bed", "beds", "single", "double", "triple", "twin", "since", "years",
    "year", "established", "located", "total", "by", "from", "on", "to", "is", "are",
    "executive", "independent", "boarding", "lodging", "dormitory", "unit", "units",
}

_GENERIC_AREA_WORDS = {
    "delhi", "new", "ncr", "india", "near", "opposite", "opp", "behind", "road", "marg",
    "street", "main", "market", "metro", "station", "block", "sector", "phase", "pocket",
    "ext", "extension", "colony", "nagar", "vihar", "enclave", "area", "south", "north",
    "east", "west", "central", "lane", "gali", "floor", "ground", "first", "second",
    "third", "puri", "pur", "pg", "paying", "guest", "hostel", "the", "in", "at", "of",
    "and", "no", "number", "house", "plot", "flat", "and", "for", "with", "side",
}

# Locality names that portals use interchangeably for the same neighbourhood.
_AREA_CLUSTERS: list[frozenset[str]] = [
    frozenset({"govindpuri", "kalkaji"}),
]


def normalize_name(name: str) -> str:
    """Lower-case a PG/operator name, unify 'phase N', and turn punctuation into spaces."""
    s = (name or "").lower().replace("&", " and ")
    s = re.sub(r"\bphase\s*3\b", "phase iii", s)
    s = re.sub(r"\bphase\s*2\b", "phase ii", s)
    s = re.sub(r"\bphase\s*1\b", "phase i", s)
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    return " ".join(s.split())


def _words(text: str) -> list[str]:
    """Normalised words; also splits glued forms such as 'AggarwalPG'."""
    s = normalize_name(text)
    s = re.sub(r"\b([a-z]{3,})(pg|hostel)\b", r"\1 \2", s)
    return s.split()


def _collapse(tok: str) -> str:
    """'aggarwal' -> 'agarwal' (collapse repeated letters)."""
    return re.sub(r"(.)\1+", r"\1", tok)


def _skeleton(tok: str) -> str:
    """Consonant skeleton keeping the first letter: agarwal / agrawal / aggarwal -> 'agrvl'."""
    t = _collapse(tok).replace("w", "v")
    if not t:
        return t
    return t[0] + re.sub(r"[aeiouy]", "", t[1:])


def _tokens_match(x: str, y: str) -> bool:
    """Same word allowing the usual Indian-name spelling variation."""
    if x == y:
        return True
    cx, cy = _collapse(x), _collapse(y)
    if cx == cy:
        return True
    if x.isdigit() or y.isdigit():
        return False
    if min(len(cx), len(cy)) >= 4:
        if fuzz.ratio(cx, cy) >= 86:
            return True
        sx, sy = _skeleton(x), _skeleton(y)
        if sx == sy and len(sx) >= 3:
            return True
    return False


def _dice(ta: list[str], tb: list[str]) -> int:
    """Share of tokens that line up between two token lists (0-100)."""
    if not ta or not tb:
        return 0
    used: set[int] = set()
    matched = 0
    for x in ta:
        for j, y in enumerate(tb):
            if j not in used and _tokens_match(x, y):
                used.add(j)
                matched += 1
                break
    return round(100 * 2 * matched / (len(ta) + len(tb)))


def _val(ev) -> str:
    v = getattr(ev, "value", None)
    return str(v).strip() if v not in (None, "") else ""


def _area_words(listing: ListingFields) -> set[str]:
    """Distinctive neighbourhood words from locality + address (plus joined pairs)."""
    text = " ".join(x for x in (_val(listing.locality), _val(listing.address_text)) if x)
    words = [w for w in _words(text) if not w.isdigit() and len(w) > 2]
    out = {w for w in words if w not in _GENERIC_AREA_WORDS}
    # 'govind puri' -> also 'govindpuri'
    for w1, w2 in zip(words, words[1:]):
        if w1 not in {"new", "near", "opp", "the"}:
            out.add(w1 + w2)
    return out


def _distinctive_tokens(name: str, drop: set[str]) -> list[str]:
    """Words that identify the operator once generic words and locality words are removed."""
    words = [w for w in _words(name) if not (w.isdigit() and len(w) >= 3)]
    for banned in (_GENERIC_NAME_WORDS | drop, _GENERIC_NAME_WORDS, _MINIMAL_GENERIC):
        kept = [w for w in words if w not in banned]
        if kept:
            return kept
    return []


def _name_candidates(listing: ListingFields) -> list[str]:
    names = [_val(listing.operator_name), _val(listing.title)]
    return [n for n in names if n]


def _spelling_alternates(tok: str) -> list[str]:
    """Common alternate spellings of one name token (used for search and display)."""
    c = _collapse(tok)
    alts: list[str] = []
    if c != tok:
        alts.append(c)
    for marker in ("arwal", "rawal"):  # Agarwal / Agrawal / Aggarwal / Aggrawal
        idx = c.find(marker)
        if idx > 0:
            p = c[:idx]
            forms = {p + "arwal", p + "rawal"}
            if p.endswith("g"):  # ag+arwal -> agg+arwal
                forms |= {p + "g" + "arwal", p + "g" + "rawal"}
            alts.extend(sorted(forms))
            break
    seen, out = set(), []
    for a in alts:
        if a != tok and a not in seen:
            seen.add(a)
            out.append(a)
    return out


def name_variants(listing: ListingFields) -> list[str]:
    """Alternative spellings of this listing's operator name, for cross-portal search."""
    raw = _val(listing.operator_name) or _val(listing.title)
    toks = _distinctive_tokens(raw, _area_words(listing))
    if not toks:
        return []
    out: list[str] = []
    for i, tok in enumerate(toks):
        for alt in _spelling_alternates(tok):
            phrase = " ".join(toks[:i] + [alt] + toks[i + 1:])
            if phrase not in out:
                out.append(phrase.title())
        if out:
            break
    return out


# ------------------------------------------------------------------ signal families
_HOUSE_PATTERNS = [
    re.compile(r"\b(\d{1,5}\s*/\s*\d{1,4}[a-z]?)\b"),            # 1046/9
    re.compile(r"\b([a-z]{1,2}\s*-\s*\d{1,5}[a-z]?)\b"),          # C-12, WZ-45
    re.compile(r"\b(?:house|plot|flat|h)\.?\s*(?:no|number)?\.?\s*#?\s*(\d{1,5}[a-z]?)\b"),
]


def _house_numbers(listing: ListingFields) -> set[str]:
    text = f"{_val(listing.address_text)} {_val(listing.title)}".lower()
    found: set[str] = set()
    for pat in _HOUSE_PATTERNS:
        for m in pat.finditer(text):
            found.add(re.sub(r"\s+", "", m.group(1)))
    return found


def _area_overlap(wa: set[str], wb: set[str]) -> Optional[str]:
    """Return the shared area label if two sets of area words describe the same neighbourhood."""
    for x in sorted(wa):
        for y in sorted(wb):
            if len(x) >= 5 and len(y) >= 5 and _tokens_match(x, y):
                return x.title()
    cx = {_collapse(w) for w in wa}
    cy = {_collapse(w) for w in wb}
    for cluster in _AREA_CLUSTERS:
        cl = {_collapse(c) for c in cluster}
        if cx & cl and cy & cl:
            return " / ".join(sorted(w.title() for w in cluster))
    return None


def _location_signal(
    a: ListingFields, b: ListingFields
) -> tuple[Optional[str], FamilyResult, Optional[float]]:
    """Returns (strength, family result, distance_m).

    strength: 'pin' | 'address' | 'area' | 'conflict' | None
    """
    if a.lat is not None and a.lng is not None and b.lat is not None and b.lng is not None:
        r = 6371000
        phi1, phi2 = math.radians(a.lat), math.radians(b.lat)
        dphi = math.radians(b.lat - a.lat)
        dlambda = math.radians(b.lng - a.lng)
        val = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
        dist_m = 2 * r * math.atan2(math.sqrt(val), math.sqrt(1 - val))

        max_dist = get_threshold("location_match_max_distance_m") or 100
        if dist_m <= max_dist:
            return "pin", FamilyResult(family="location", agreed=True, detail=f"Map pins {int(dist_m)} m apart"), dist_m
        if dist_m <= max(max_dist * 4, 400):
            return (
                "area",
                FamilyResult(family="location", agreed=True, detail=f"Map pins {int(dist_m)} m apart (same street area, not the same pin)"),
                dist_m,
            )
        return (
            "conflict",
            FamilyResult(family="location", agreed=False, detail=f"Map pins {int(dist_m)} m apart"),
            dist_m,
        )

    wa, wb = _area_words(a), _area_words(b)
    shared_house = _house_numbers(a) & _house_numbers(b)
    overlap = _area_overlap(wa, wb) if wa and wb else None

    if shared_house and (overlap or not wa or not wb):
        return (
            "address",
            FamilyResult(family="location", agreed=True, detail=f"Same house/plot reference in the address ({', '.join(sorted(shared_house))})"),
            None,
        )
    if overlap:
        return (
            "area",
            FamilyResult(
                family="location",
                agreed=True,
                detail=f"Same neighbourhood on both portals ({overlap}); no map pin or house number to confirm the exact building",
            ),
            None,
        )
    if wa and wb:
        return (
            "conflict",
            FamilyResult(family="location", agreed=False, detail="Different neighbourhood names on the two portals"),
            None,
        )
    return None, FamilyResult(family="location", agreed=None, detail="Location data unavailable"), None


def score_location(a: ListingFields, b: ListingFields) -> FamilyResult:
    """Kept for compatibility: the location signal family only."""
    return _location_signal(a, b)[1]


def score_identity(a: ListingFields, b: ListingFields) -> FamilyResult:
    """Operator / PG name similarity, ignoring generic words, locality words and spelling variants."""
    names_a, names_b = _name_candidates(a), _name_candidates(b)
    if not names_a or not names_b:
        return FamilyResult(family="identity", agreed=None, detail="Operator name unavailable")

    drop = _area_words(a) | _area_words(b)
    best = -1
    best_pair: Optional[tuple[str, str]] = None
    for na in names_a:
        ta = _distinctive_tokens(na, drop)
        if not ta:
            continue
        for nb in names_b:
            tb = _distinctive_tokens(nb, drop)
            if not tb:
                continue
            s = _dice(ta, tb)
            if s > best:
                best, best_pair = s, (" ".join(ta), " ".join(tb))

    if best_pair is None:
        return FamilyResult(family="identity", agreed=None, detail="Operator name unavailable")

    min_score = get_threshold("name_similarity_min") or 85
    agreed = best >= min_score
    return FamilyResult(
        family="identity",
        agreed=agreed,
        detail=f"Name similarity {best}% ('{best_pair[0]}' vs '{best_pair[1]}'; generic words and spelling variants ignored)",
    )


def score_content(a: ListingFields, b: ListingFields) -> tuple[FamilyResult, list[str]]:
    """Compare shared description sentences."""
    desc_a = str(a.description.value or "")
    desc_b = str(b.description.value or "")

    min_words = int(get_threshold("shared_sentence_min_words") or 8)
    sents_a = [s.strip() for s in re.split(r"[.!?\n]", desc_a) if len(s.split()) >= min_words]
    sents_b = [s.strip() for s in re.split(r"[.!?\n]", desc_b) if len(s.split()) >= min_words]

    shared = [s for s in sents_a if any(fuzz.ratio(s.lower(), sb.lower()) > 85 for sb in sents_b)]
    long_enough = len(desc_a) >= 60 and len(desc_b) >= 60
    agreed = len(shared) > 0 or (long_enough and fuzz.token_sort_ratio(desc_a.lower(), desc_b.lower()) > 80)

    return FamilyResult(family="content", agreed=agreed, detail=f"{len(shared)} shared text passages"), shared


async def score_visual(a: ListingFields, b: ListingFields) -> FamilyResult:
    """Compare perceptual hashes of the first couple of photos on each side."""
    if not a.photo_urls or not b.photo_urls:
        return FamilyResult(family="visual", agreed=None, detail="Photos not compared")

    urls_a, urls_b = a.photo_urls[:2], b.photo_urls[:2]
    data_a, data_b = await asyncio.gather(
        asyncio.gather(*[download_photo(u) for u in urls_a], return_exceptions=True),
        asyncio.gather(*[download_photo(u) for u in urls_b], return_exceptions=True),
    )

    def hashes(blobs):
        out = []
        for blob in blobs:
            if isinstance(blob, Exception) or not blob:
                continue
            h = perceptual_hash(blob)
            if h:
                out.append(h)
        return out

    ha, hb = hashes(data_a), hashes(data_b)
    if not ha or not hb:
        return FamilyResult(family="visual", agreed=None, detail="Photo comparison unavailable")

    best = min(hash_distance(x, y) for x in ha for y in hb)
    max_dist = get_threshold("photo_hash_max_distance") or 8
    return FamilyResult(family="visual", agreed=best <= max_dist, detail=f"Image hash distance {best}")


# ------------------------------------------------------------------ decision
def decide_match_v2(
    families: list[FamilyResult], loc_strength: Optional[str]
) -> Optional[tuple[MatchLevel, Confidence]]:
    """Level + confidence from which independent signal families agree."""
    agreed = {f.family: f.agreed for f in families}
    ident = agreed.get("identity") is True
    content = agreed.get("content") is True
    visual = agreed.get("visual") is True

    strong = loc_strength in ("pin", "address")
    area = loc_strength == "area"

    # Location pointing somewhere else: a name match alone is a different branch, so drop it.
    # Only shared description text can keep it alive, and never above "possible".
    if loc_strength == "conflict":
        if ident and content:
            return ("possible", "low")
        return None

    if (strong and ident and (content or visual)) or (ident and content and visual):
        return ("match", "high")
    if (strong and ident) or (ident and content) or (strong and content) or (ident and area and visual):
        return ("match", "medium")
    if ident and area:
        return ("possible", "medium")
    if strong or (content and area) or (content and visual) or ident:
        return ("possible", "low")
    return None


def decide_match(families: list[FamilyResult]) -> Optional[tuple[MatchLevel, Confidence]]:
    """Kept for compatibility: treats an agreed location family as strong."""
    loc = {f.family: f.agreed for f in families}.get("location")
    return decide_match_v2(families, "pin" if loc is True else ("conflict" if loc is False else None))


# ------------------------------------------------------------------ price gaps
def _ac_rank(ac_a: Optional[bool], ac_b: Optional[bool]) -> Optional[int]:
    """0 = AC flags agree, 1 = one side unknown, None = they conflict."""
    if ac_a is None or ac_b is None:
        return 1
    return 0 if ac_a == ac_b else None


def build_price_gaps(here: ListingFields, there: ListingFields) -> list[PriceGap]:
    """Price gaps between two listings.

    1. Like-for-like: same sharing type and compatible AC flag (one gap per option here).
    2. Fallback: when sharing types are labelled differently (e.g. 'Rent/Bed onwards' vs
       'twin'), compare each side's lowest listed bed price and say so, flagged not comparable.
    """
    gaps: list[PriceGap] = []

    for opt_a in here.rent_options:
        if not opt_a.monthly_rent:
            continue
        best = None
        for opt_b in there.rent_options:
            if not opt_b.monthly_rent or opt_a.sharing_type != opt_b.sharing_type:
                continue
            rank = _ac_rank(opt_a.ac, opt_b.ac)
            if rank is None:
                continue
            if best is None or rank < best[0]:
                best = (rank, opt_b)
        if best:
            opt_b = best[1]
            gaps.append(
                PriceGap(
                    sharing_type=opt_a.sharing_type,
                    ac=opt_a.ac if opt_a.ac is not None else opt_b.ac,
                    rent_here=opt_a.monthly_rent,
                    rent_there=opt_b.monthly_rent,
                    difference=opt_b.monthly_rent - opt_a.monthly_rent,
                    comparable=True,
                    note="Price gap observed across public portals",
                )
            )

    if gaps:
        return gaps

    rents_a = [o.monthly_rent for o in here.rent_options if o.monthly_rent]
    rents_b = [o.monthly_rent for o in there.rent_options if o.monthly_rent]
    if rents_a and rents_b:
        low_a, low_b = min(rents_a), min(rents_b)
        diff = low_b - low_a
        direction = "same as" if diff == 0 else (f"Rs {abs(diff):,} higher than" if diff > 0 else f"Rs {abs(diff):,} lower than")
        gaps.append(
            PriceGap(
                sharing_type="other",
                ac=None,
                rent_here=low_a,
                rent_there=low_b,
                difference=diff,
                comparable=False,
                note=f"Lowest listed bed price there is {direction} here. Sharing types are labelled differently, so this is not a like-for-like gap.",
            )
        )
    return gaps


# ------------------------------------------------------------------ comparison
_CONF_RANK = {"high": 0, "medium": 1, "low": 2}


async def compare_listings(a: ListingFields, b: ListingFields) -> Optional[MatchCandidate]:
    """Compare two listings and build a MatchCandidate if the signals meet the decision rules."""
    if a.source.url and a.source.url == b.source.url:
        return None

    loc_strength, loc_res, dist_m = _location_signal(a, b)
    ident_res = score_identity(a, b)
    content_res, shared_sents = score_content(a, b)
    visual_res = await score_visual(a, b)

    families = [loc_res, ident_res, content_res, visual_res]
    decision = decide_match_v2(families, loc_strength)
    if not decision:
        return None

    match_level, confidence = decision
    strong_place = loc_strength in ("pin", "address")
    scope: MatchScope = "same_place" if (match_level == "match" or strong_place) else "same_operator_branch"

    parts = []
    if loc_res.agreed:
        parts.append({"pin": "map pin", "address": "house/plot reference", "area": "same neighbourhood"}.get(loc_strength or "", "location"))
    if ident_res.agreed:
        parts.append("operator name (spelling variants allowed)")
    if content_res.agreed:
        parts.append("description text")
    if visual_res.agreed:
        parts.append("photo fingerprint")
    method = "Matched on: " + ", ".join(parts) if parts else "Partial signal agreement"

    alternatives = [
        "The same operator legitimately lists on several portals.",
        "Different sharing options, furnishings, or meal plans included.",
        "Stale listing with outdated pricing.",
    ]
    if scope == "same_operator_branch":
        alternatives.insert(
            0,
            "The operator may run more than one branch in this area; no map pin or house number was available to confirm it is the same building.",
        )

    return MatchCandidate(
        candidate_id=f"cand_{b.listing_id}",
        listing=b,
        scope=scope,
        match_level=match_level,
        confidence=confidence,
        method=method,
        families=families,
        shared_sentences=shared_sents,
        distance_m=dist_m,
        price_gaps=build_price_gaps(a, b),
        alternative_explanations=alternatives,
    )


def _rank_key(c: MatchCandidate) -> tuple:
    agreed_count = sum(1 for f in c.families if f.agreed)
    return (0 if c.match_level == "match" else 1, _CONF_RANK.get(c.confidence, 3), -agreed_count)


async def find_matches(
    listing: ListingFields,
    candidates: list[ListingFields],
    portals_checked: list[PortalCheck],
) -> MatchingResult:
    """Evaluate candidate listings, rank them best-first and keep the best one per portal."""
    results = await asyncio.gather(
        *[compare_listings(listing, c) for c in candidates], return_exceptions=True
    )
    matched: list[MatchCandidate] = [r for r in results if isinstance(r, MatchCandidate)]
    matched.sort(key=_rank_key)

    best_per_portal: list[MatchCandidate] = []
    seen_portals: set[str] = set()
    for cand in matched:
        if cand.listing.portal in seen_portals:
            continue
        seen_portals.add(cand.listing.portal)
        best_per_portal.append(cand)

    max_shown = int(get_threshold("max_candidates_shown") or 3)
    top_candidates = best_per_portal[:max_shown]

    if any(c.match_level == "match" for c in top_candidates):
        status = "match_found"
        msg = f"Found {len(top_candidates)} matching listing(s) on other portals."
    elif top_candidates:
        status = "possible_match"
        if any(c.scope == "same_operator_branch" for c in top_candidates):
            msg = (
                f"Found {len(top_candidates)} listing(s) that look like the same operator's branch on other portals. "
                "No map pin confirms the exact building."
            )
        else:
            msg = "Found possible match candidate(s) requiring verification."
    else:
        status = "no_match"
        msg = f"Checked {len(portals_checked)} portals and found no matching duplicate listing."

    return MatchingResult(
        status=status,
        candidates=top_candidates,
        portals_checked=portals_checked,
        nearby_listings_count=len(candidates),
        message=msg,
    )