"""Run each pipeline stage on ONE url and say exactly which stage breaks.

    cd backend
    python scripts/diagnose.py "https://www.magicbricks.com/propertyDetail/aggarwal-paying-guest-pg-govindpuri-in-new-delhi&pgid=4d42333331303339677261646532"
"""
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.config import get_settings  # noqa: E402
from app.clients.llm import get_llm_client  # noqa: E402
from app.clients.tinyfish import get_tinyfish_client  # noqa: E402
from app.services.capture import capture_page  # noqa: E402
from app.services.discovery import build_search_queries, discover_candidate_urls  # noqa: E402
from app.services.extraction import build_extraction_prompt, extract_listing_fields, EXTRACTION_SCHEMA  # noqa: E402


def step(n, title):
    print(f"\n=== {n}. {title} " + "=" * max(3, 60 - len(title)))


async def main(url: str):
    s = get_settings()
    step(0, "Config")
    print("TINYFISH_API_KEY set :", bool(s.tinyfish_api_key))
    print("LLM provider/model   :", s.llm_provider, "/", s.llm_model)
    print("LLM_API_KEY set      :", bool(s.llm_api_key))

    step(1, "TinyFish Fetch + capture")
    page = await capture_page(url)
    print("ok:", page.ok, "| via:", page.fetched_via, "| chars:", len(page.text), "| error:", page.error_code)
    if not page.ok:
        print("-> STOP: the page could not be read. See error above.")
        return
    print(page.text[:400].replace("\n", " "), "...")

    step(2, "LLM raw JSON")
    sys_p, user_p = build_extraction_prompt(page.text)
    try:
        raw = await get_llm_client().extract_json(sys_p, user_p, EXTRACTION_SCHEMA)
        keys = [k for k, v in raw.items() if v not in (None, [], "") and not k.endswith("_passage")]
        print("non-empty keys:", keys)
        print("rent_options  :", raw.get("rent_options"))
    except Exception as e:
        print("-> STOP: LLM failed:", getattr(e, "message", e))
        return

    step(3, "Extraction after passage check")
    listing = await extract_listing_fields(page)
    print("title    :", listing.title.value)
    print("operator :", listing.operator_name.value)
    print("rents    :", [(r.sharing_type, r.ac, r.monthly_rent) for r in listing.rent_options])
    print("deposit  :", listing.deposit_amount.value, "| notice days:", listing.notice_period_days.value)
    dropped = [k for k, v in raw.items() if k.endswith("_passage") and v is None and raw.get(k[:-8])]
    if dropped:
        print("(values given without a passage:", dropped, ")")

    step(4, "Search other portals")
    print("queries:", build_search_queries(listing))
    urls, checks = await discover_candidate_urls(listing)
    for u in urls:
        print("  candidate:", u)
    if not urls:
        print("  -> no candidate pages found")

    step(5, "Fetch candidates")
    pages = await get_tinyfish_client().fetch(urls[:6]) if urls else []
    for p in pages:
        print(f"  {'OK ' if p.ok else 'ERR'} {len(p.text):>6} chars  {p.error_code or ''}  {p.url[:90]}")
    print("\nIf every step above is OK, the live pipeline works.")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    asyncio.run(main(sys.argv[1]))
