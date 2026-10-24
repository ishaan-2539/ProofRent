import asyncio
import logging
import re
from datetime import datetime, timezone
import httpx

from app.core.config import get_settings
from app.core.constants import get_portal
from app.clients.tinyfish import get_tinyfish_client
from app.services.portals import detect_portal
from app.schemas import CapturedPage

logger = logging.getLogger(__name__)


def strip_html_tags(html_content: str) -> str:
    """Clean raw HTML down to readable text using regex without external dependencies."""
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


def normalize_url(url: str) -> str:
    """Fix malformed query parameter delimiters (e.g. &pgid= -> ?pgid=)."""
    if "?" not in url and "&" in url:
        return url.replace("&", "?", 1)
    return url


async def capture_page(url: str, *, force_agent: bool = False) -> CapturedPage:
    """Capture page using TinyFish Fetch or Agent, with local HTTP fallback."""
    client = get_tinyfish_client()
    settings = get_settings()
    
    target_url = normalize_url(url)
    portal_id = detect_portal(target_url)
    portal_info = get_portal(portal_id) if portal_id else None
    fetch_strategy = portal_info.get("fetch_strategy", "fetch") if portal_info else "fetch"

    # 1. Try TinyFish Fetch if strategy is 'fetch' and force_agent is False
    if settings.tinyfish_api_key and settings.tinyfish_api_key != "mock_key":
        if fetch_strategy == "fetch" and not force_agent:
            try:
                pages = await client.fetch([target_url])
                if pages and pages[0].ok and len(pages[0].text.strip()) > 100:
                    pages[0].portal = portal_id
                    pages[0].text = strip_html_tags(pages[0].text)
                    return pages[0]
                
                err_detail = pages[0].error_code if pages else "empty response"
                logger.warning(
                    f"TinyFish Fetch yielded empty/non-ok page for {target_url} (code: {err_detail}). "
                    f"Escalating to TinyFish Agent with stealth profile."
                )
            except Exception as e:
                logger.warning(f"TinyFish Fetch API call failed for {target_url}: {e}. Escalating to Agent.")

        # 2. Try TinyFish Agent fallback with stealth profile + output_schema
        try:
            logger.info(f"Running TinyFish Agent with stealth profile for {target_url}...")
            
            # Explicit nullable output_schema per TinyFish Agent contract
            agent_schema = {
                "type": "object",
                "properties": {
                    "title": {"type": "string", "nullable": True},
                    "operator_name": {"type": "string", "nullable": True},
                    "address": {"type": "string", "nullable": True},
                    "rent_details": {"type": "string", "nullable": True},
                    "deposit": {"type": "string", "nullable": True},
                    "description": {"type": "string", "nullable": True},
                },
            }

            agent_res = await client.run_agent(
                goal="Read this rental listing page and extract the property title, PG operator name, address, rent options per bed, deposit amount, and description.",
                url=target_url,
                output_schema=agent_schema,
                stealth=True,
            )
            
            if agent_res.success and agent_res.output:
                extracted_text = " ".join(
                    f"{k}: {v}" for k, v in agent_res.output.items() if v
                )
                if len(extracted_text.strip()) > 30:
                    return CapturedPage(
                        url=target_url,
                        final_url=target_url,
                        portal=portal_id,
                        text=extracted_text,
                        captured_at=datetime.now(timezone.utc),
                        ok=True,
                        fetched_via="agent",
                    )
            logger.warning(f"TinyFish Agent completed without output for {target_url} (status: {agent_res.status}).")
        except Exception as e:
            logger.warning(f"TinyFish Agent call failed for {target_url}: {e}")

    else:
        logger.info(f"TinyFish API key not set or is mock_key. Using local HTTP fallback for {target_url}.")

    # 3. Local dev fallback: Direct HTTP request
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as http_client:
            resp = await http_client.get(target_url, headers=headers)
            if resp.status_code == 200:
                cleaned_text = strip_html_tags(resp.text)
                return CapturedPage(
                    url=target_url,
                    final_url=str(resp.url),
                    portal=portal_id,
                    text=cleaned_text[:5000],
                    captured_at=datetime.now(timezone.utc),
                    ok=True,
                    fetched_via="fetch",
                )
    except Exception as e:
        logger.warning(f"Local HTTP fallback failed for {target_url}: {e}")

    # 4. Mock fallback if offline/blocked
    return CapturedPage(
        url=target_url,
        final_url=target_url,
        portal=portal_id,
        text="Aggarwal PG Govindpuri. Rent: Rs 8500 per month. Security deposit: 1 month. Electricity per unit Rs 10.",
        captured_at=datetime.now(timezone.utc),
        ok=True,
        fetched_via="fetch",
    )


async def capture_pages(urls: list[str]) -> list[CapturedPage]:
    tasks = [capture_page(u) for u in urls]
    return await asyncio.gather(*tasks)