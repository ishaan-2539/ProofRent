from typing import Optional
from app.clients.tinyfish import get_tinyfish_client
from app.core.constants import get_constants
from app.services.portals import detect_portal
from app.schemas import ListingFields, PortalCheck, PortalId


def build_search_queries(listing: ListingFields) -> list[str]:
    """Generate search queries to find matching candidate listings on other portals."""
    name = listing.operator_name.value or listing.title.value or ""
    locality = listing.locality.value or listing.address_text.value or "Delhi"
    
    queries = []
    if name and locality:
        queries.append(f"{name} {locality} PG Delhi rental listing")
        queries.append(f"{name} {locality} PG paying guest")
    elif name:
        queries.append(f"{name} PG Delhi")
    else:
        queries.append(f"PG in {locality} Delhi")
        
    return queries


async def discover_candidate_urls(listing: ListingFields) -> tuple[list[str], list[PortalCheck]]:
    """Search public portals for potential duplicate listings of the given place."""
    client = get_tinyfish_client()
    queries = build_search_queries(listing)
    constants = get_constants()
    
    candidate_urls: list[str] = []
    portal_checks: dict[PortalId, PortalCheck] = {}

    for portal in constants.get("portals", []):
        p_id: PortalId = portal["id"]
        if p_id == listing.portal:
            continue
        portal_checks[p_id] = PortalCheck(portal=p_id, status="checked", listings_seen=0)

    for query in queries[:2]:
        try:
            hits = await client.search(query)
            for hit in hits:
                p_id = detect_portal(hit.url)
                if p_id and p_id != listing.portal:
                    if hit.url not in candidate_urls:
                        candidate_urls.append(hit.url)
                        if p_id in portal_checks:
                            portal_checks[p_id].listings_seen += 1
                            portal_checks[p_id].url = hit.url
        except Exception:
            pass

    return candidate_urls[:6], list(portal_checks.values())