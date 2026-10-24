from urllib.parse import urlparse
from typing import Optional
import httpx

from app.core.constants import get_constants, get_portal
from app.core.errors import ProofRentError
from app.schemas import PortalId


def detect_portal(url: str) -> Optional[PortalId]:
    """Identify portal ID from host domain matching shared/constants.json."""
    try:
        domain = urlparse(url).netloc.lower()
        if domain.startswith("www."):
            domain = domain[4:]
        
        constants = get_constants()
        for portal in constants.get("portals", []):
            for allowed_domain in portal.get("domains", []):
                if domain == allowed_domain or domain.endswith("." + allowed_domain):
                    return portal["id"]
    except Exception:
        pass
    return None


def is_allowlisted(url: str) -> bool:
    """Return True if the URL belongs to an allow-listed portal domain."""
    return detect_portal(url) is not None


def validate_listing_url(url: str) -> str:
    """Validate user input URL; raise ProofRentError with appropriate error code if invalid."""
    if not url or not url.startswith("https://"):
        raise ProofRentError("INVALID_URL")
    
    portal_id = detect_portal(url)
    if not portal_id:
        constants = get_constants()
        names = ", ".join(p["display_name"] for p in constants.get("portals", []))
        raise ProofRentError(
            "UNSUPPORTED_PORTAL", 
            custom_message=f"ProofRent supports {names} for now."
        )
    
    # URL heuristic flags
    lower_url = url.lower()
    if any(k in lower_url for k in ["/buy/", "/sale/", "property-for-sale"]):
        raise ProofRentError("SALE_LISTING")
    
    if any(k in lower_url for k in ["/login", "/signin"]):
        raise ProofRentError("LOGIN_REQUIRED")
        
    return url


async def resolve_redirects(url: str) -> str:
    """Follow HTTP redirects to obtain direct target URL."""
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=10.0) as client:
            resp = await client.head(url)
            return str(resp.url)
    except Exception:
        raise ProofRentError("REDIRECT_UNRESOLVED")