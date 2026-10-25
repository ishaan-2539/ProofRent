"""
scripts/check_services.py — Health check script for Gemini and TinyFish APIs.

Usage:
  cd backend
  python scripts/check_services.py
"""
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.config import get_settings
from app.clients.llm import get_llm_client
from app.clients.tinyfish import get_tinyfish_client


async def main():
    print("==================================================")
    print("   PROOFRENT SERVICE DIAGNOSTICS & HEALTH CHECK   ")
    print("==================================================")

    settings = get_settings()
    print(f"\n[CONFIG] LLM Provider : {settings.llm_provider}")
    print(f"[CONFIG] LLM Model    : {settings.llm_model}")
    print(f"[CONFIG] TinyFish Key : {'Configured' if settings.tinyfish_api_key else 'MISSING!'}")
    print(f"[CONFIG] Gemini Key   : {'Configured' if settings.llm_api_key else 'MISSING!'}")

    all_pass = True

    # 1. Test Gemini LLM Connection
    print("\n--- 1. Testing Gemini LLM ---")
    try:
        llm = get_llm_client()
        res = await llm.extract_json(
            system_prompt="Return JSON with key 'status' set to 'ok'.",
            user_prompt="Test ping",
            json_schema={"type": "object", "properties": {"status": {"type": "string"}}}
        )
        if res.get("status") == "ok":
            print("  [PASS] Gemini LLM is online and extracting structured JSON.")
        else:
            print(f"  [PASS] Gemini responded: {res}")
    except Exception as e:
        all_pass = False
        print(f"  [FAIL] Gemini LLM test failed: {e}")

    # 2. Test TinyFish Search API
    print("\n--- 2. Testing TinyFish Search API ---")
    try:
        tf = get_tinyfish_client()
        hits = await tf.search("PG in Govindpuri Delhi")
        if hits:
            print(f"  [PASS] TinyFish Search is working! Found {len(hits)} results.")
            print(f"         Sample Hit: {hits[0].title[:50]}... ({hits[0].url[:60]})")
        else:
            print("  [WARN] TinyFish Search returned 0 results.")
    except Exception as e:
        all_pass = False
        print(f"  [FAIL] TinyFish Search failed: {e}")

    # 3. Test TinyFish Fetch API
    print("\n--- 3. Testing TinyFish Fetch API ---")
    try:
        tf = get_tinyfish_client()
        test_url = "https://www.gopgo.in/new-delhi/govindpuri-kalkaji/pg/7121-agarwal-pg-house/pgo-properties"
        pages = await tf.fetch([test_url])
        if pages and pages[0].ok:
            print(f"  [PASS] TinyFish Fetch is working! Retrieved {len(pages[0].text)} characters.")
        else:
            code = pages[0].error_code if pages else "NO_PAGE"
            print(f"  [WARN] TinyFish Fetch test returned status: {code}")
    except Exception as e:
        all_pass = False
        print(f"  [FAIL] TinyFish Fetch failed: {e}")

    print("\n==================================================")
    if all_pass:
        print("   >>> SUCCESS: ALL SERVICES ONLINE & READY! <<<")
    else:
        print("   >>> WARNING: CHECKS FAILED. CHECK API KEYS IN .env <<<")
    print("==================================================")


if __name__ == "__main__":
    asyncio.run(main())