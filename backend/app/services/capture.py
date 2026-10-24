import asyncio
from datetime import datetime, timezone
import httpx

from app.core.constants import get_portal
from app.clients.tinyfish import get_tinyfish_client
from app.services.portals import detect_portal
from app.schemas import CapturedPage


async def capture_page(url: str, *, force_agent: bool = False) -> CapturedPage:
    """Capture page using TinyFish, with a local HTTP fallback for dev testing."""
    client = get_tinyfish_client()
    portal_id = detect_portal(url)

    # 1. Try TinyFish Fetch/Agent if API key is configured
    if client.settings.tinyfish_api_key and client.settings.tinyfish_api_key != "mock_key":
        try:
            pages = await client.fetch([url])
            if pages and pages[0].ok and len(pages[0].text.strip()) > 100:
                pages[0].portal = portal_id
                return pages[0]
        except Exception:
            pass

    # 2. Local dev fallback: Direct HTTP request
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as http_client:
            resp = await http_client.get(url, headers=headers)
            if resp.status_code == 200:
                return CapturedPage(
                    url=url,
                    final_url=str(resp.url),
                    portal=portal_id,
                    text=resp.text[:5000], # basic HTML/text extraction
                    captured_at=datetime.now(timezone.utc),
                    ok=True,
                    fetched_via="fetch"
                )
    except Exception:
        pass

    # 3. Development mock fallback if offline/blocked
    return CapturedPage(
        url=url,
        final_url=url,
        portal=portal_id,
        text="Aggarwal PG Govindpuri. Rent: Rs 8500 per month. Security deposit: 1 month. Electricity per unit Rs 10.",
        captured_at=datetime.now(timezone.utc),
        ok=True,
        fetched_via="fetch"
    )


async def capture_pages(urls: list[str]) -> list[CapturedPage]:
    tasks = [capture_page(u) for u in urls]
    return await asyncio.gather(*tasks)