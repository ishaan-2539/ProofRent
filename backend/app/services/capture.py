import asyncio
import logging
import re
from datetime import datetime, timezone

from app.clients.tinyfish import get_tinyfish_client
from app.core.config import get_settings
from app.core.constants import get_portal
from app.schemas import CapturedPage
from app.services.portals import detect_portal

logger = logging.getLogger(__name__)

MIN_USABLE_CHARS = 100

# Phrases that mean "we got a bot wall, not the listing".
BLOCK_MARKERS = (
    "access denied",
    "verify you are a human",
    "captcha",
    "are you a robot",
    "request blocked",
    "unusual traffic",
)


def strip_html_tags(html_content: str) -> str:
    if not html_content:
        return ""
    text = re.sub(
        r"<(script|style|head|nav|footer)[^>]*>.*?</\1>",
        "",
        html_content,
        flags=re.DOTALL | re.IGNORECASE,
    )
    text = re.sub(r"<[^>]+>", " ", text)
    return " ".join(text.split())


def _looks_blocked(text: str) -> bool:
    head = text[:1500].lower()
    return len(text) < 800 and any(m in head for m in BLOCK_MARKERS)


def _failed_page(url: str, portal_id, code: str) -> CapturedPage:
    return CapturedPage(
        url=url,
        final_url=url,
        portal=portal_id,
        text="",
        captured_at=datetime.now(timezone.utc),
        ok=False,
        fetched_via="fetch",
        error_code=code,
    )


async def capture_page(url: str, *, force_agent: bool = False) -> CapturedPage:
    """Read one page: TinyFish Fetch first, Agent (stealth + India proxy) as fallback.

    IMPORTANT: the URL is used EXACTLY as given. Magicbricks links look like
    ...-in-new-delhi&pgid=4d42... (an '&' with no '?'). That is the real, working
    form. Rewriting '&' to '?' returns 404. Never "fix" it.
    """
    client = get_tinyfish_client()
    settings = get_settings()

    target_url = url.strip()
    portal_id = detect_portal(target_url)
    portal_info = get_portal(portal_id) if portal_id else None
    fetch_strategy = portal_info.get("fetch_strategy", "fetch") if portal_info else "fetch"

    if not settings.tinyfish_api_key:
        logger.error("TINYFISH_API_KEY is not set.")
        return _failed_page(target_url, portal_id, "NO_API_KEY")

    last_error = "CAPTURE_FAILED"

    # 1. Fetch (free, fast)
    if fetch_strategy == "fetch" and not force_agent:
        try:
            pages = await client.fetch([target_url])
            page = pages[0] if pages else None
            if page and page.ok and len(page.text.strip()) > MIN_USABLE_CHARS and not _looks_blocked(page.text):
                page.portal = portal_id
                return page
            last_error = (page.error_code if page else None) or "FETCH_EMPTY_OR_BLOCKED"
            logger.warning("Fetch gave no usable content for %s (%s). Trying Agent.", target_url, last_error)
        except Exception as e:
            last_error = f"FETCH_ERROR: {e}"
            logger.warning("Fetch failed for %s: %s. Trying Agent.", target_url, e)

    # 2. Agent fallback. It returns TEXT of the whole page (not a guessed schema),
    #    so our own LLM step + passage check can still do the extraction.
    try:
        agent_schema = {
            "type": "object",
            "properties": {
                "page_text": {"type": "string", "nullable": True},
            },
        }
        agent_res = await client.run_agent(
            goal=(
                "Open this rental / PG listing page. Copy ALL visible text about the property "
                "into page_text exactly as shown: name, address, every rent option and sharing "
                "type, deposit, maintenance, electricity, food, notice period, description, "
                "amenities. Do not summarise. Use null if the page is blocked or empty."
            ),
            url=target_url,
            output_schema=agent_schema,
            stealth=True,
        )
        text = ""
        if agent_res.success and agent_res.output:
            text = str(agent_res.output.get("page_text") or "")
        if len(text.strip()) > MIN_USABLE_CHARS:
            return CapturedPage(
                url=target_url,
                final_url=target_url,
                portal=portal_id,
                text=text,
                captured_at=datetime.now(timezone.utc),
                ok=True,
                fetched_via="agent",
            )
        last_error = agent_res.error_code or f"AGENT_{agent_res.status}"
        logger.warning("Agent returned nothing usable for %s (%s).", target_url, last_error)
    except Exception as e:
        last_error = f"AGENT_ERROR: {e}"
        logger.warning("Agent failed for %s: %s", target_url, e)

    return _failed_page(target_url, portal_id, last_error)


async def capture_pages(urls: list[str]) -> list[CapturedPage]:
    return list(await asyncio.gather(*[capture_page(u) for u in urls]))
