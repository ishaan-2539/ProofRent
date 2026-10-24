import asyncio
import logging

from app.clients.tinyfish import get_tinyfish_client
from app.core.constants import get_constants
from app.schemas import ListingFields, PortalCheck, PortalId
from app.services.matching import name_variants
from app.services.portals import detect_portal

logger = logging.getLogger(__name__)

# Only keep URLs that are a SINGLE listing's detail page (search also returns
# city/locality index pages that list dozens of PGs and would pollute matching).
DETAIL_HINTS: dict[str, tuple[str, ...]] = {
    "magicbricks": ("propertydetail",),
    "gopgo": ("/pg/",),
    "hexahome": ("-id-",),
    "housing": ("/paying-guests/", "/pg/"),
    "nobroker": ("/property/", "/pg/"),
    "pgdekho": ("/pg/", "-pg-", "/hostel"),
}

MAX_URLS = 6            # the orchestrator reads at most 6 candidate pages
MAX_PER_PORTAL = 2      # several entries from one portal must not crowd out the others
MAX_TARGETED_PORTALS = 4


def is_detail_page(url: str, portal: str) -> bool:
    hints = DETAIL_HINTS.get(portal)
    if not hints:
        return True
    low = url.lower()
    return any(h in low for h in hints)


def _listing_name(listing: ListingFields) -> str:
    return str(listing.operator_name.value or listing.title.value or "").strip()


def _listing_place(listing: ListingFields) -> str:
    return str(listing.locality.value or listing.address_text.value or "Delhi").strip()


def build_search_queries(listing: ListingFields) -> list[str]:
    """General queries, including alternate spellings (Aggarwal / Agarwal / Agrawal)."""
    name = " ".join(_listing_name(listing).split()[:8])
    place = _listing_place(listing)
    if not name:
        return [f"PG in {place} Delhi"]

    queries = [f"{name} {place} PG Delhi", f"{name} paying guest {place}"]
    for alt in name_variants(listing)[:2]:
        queries.append(f"{alt} PG {place} Delhi")

    seen: set[str] = set()
    unique: list[str] = []
    for q in queries:
        key = q.lower()
        if key not in seen:
            seen.add(key)
            unique.append(q)
    return unique


def _canon_url(url: str) -> str:
    return url.split("#", 1)[0].rstrip("/")


def _select_urls(by_portal: dict[str, list[str]]) -> list[str]:
    """Round-robin across portals so every portal gets a chance before any gets a second slot."""
    out: list[str] = []
    for round_idx in range(MAX_PER_PORTAL):
        for urls in by_portal.values():
            if round_idx < len(urls) and len(out) < MAX_URLS:
                out.append(urls[round_idx])
    return out


async def discover_candidate_urls(listing: ListingFields) -> tuple[list[str], list[PortalCheck]]:
    """Search TinyFish for the same place on OTHER portals."""
    client = get_tinyfish_client()
    constants = get_constants()

    display: dict[str, str] = {}
    checks: dict[PortalId, PortalCheck] = {}
    for portal in constants.get("portals", []):
        pid: PortalId = portal["id"]
        if pid != listing.portal:
            display[pid] = portal.get("display_name", pid)
            checks[pid] = PortalCheck(portal=pid, status="checked", listings_seen=0)

    by_portal: dict[str, list[str]] = {}
    seen_urls: set[str] = set()
    stats = {"ok": 0, "failed": 0}

    def absorb(results: list) -> None:
        for res in results:
            if isinstance(res, Exception):
                stats["failed"] += 1
                logger.warning("Search failed: %s", res)
                continue
            stats["ok"] += 1
            for hit in res:
                pid = detect_portal(hit.url)
                if not pid or pid == listing.portal or not is_detail_page(hit.url, pid):
                    continue
                key = _canon_url(hit.url)
                if key in seen_urls:
                    continue
                seen_urls.add(key)
                bucket = by_portal.setdefault(pid, [])
                if len(bucket) >= MAX_PER_PORTAL:
                    continue
                bucket.append(hit.url)
                if pid in checks:
                    checks[pid].listings_seen += 1
                    checks[pid].url = checks[pid].url or hit.url

    # Pass 1: general queries (original name + alternate spellings), run in parallel.
    queries = build_search_queries(listing)
    absorb(await asyncio.gather(*[client.search(q) for q in queries[:4]], return_exceptions=True))

    # Pass 2: portals that returned nothing get one targeted query naming the portal.
    name = " ".join(_listing_name(listing).split()[:8])
    place = _listing_place(listing)
    if name:
        missing = [pid for pid, c in checks.items() if c.listings_seen == 0][:MAX_TARGETED_PORTALS]
        if missing:
            targeted = [f"{name} {place} {display[pid]} PG" for pid in missing]
            absorb(await asyncio.gather(*[client.search(q) for q in targeted], return_exceptions=True))

    if stats["ok"] == 0 and stats["failed"] > 0:
        for c in checks.values():
            c.status = "failed"
            c.note = "Search could not be completed"
    else:
        for c in checks.values():
            if c.listings_seen == 0:
                c.note = "No matching listing page found in search results"

    return _select_urls(by_portal), list(checks.values())