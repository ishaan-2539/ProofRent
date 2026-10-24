"""
scripts/check_services.py — Pre-presentation connectivity diagnostic for Gemini & TinyFish.

Usage:
    cd backend
    python scripts/check_services.py
"""

import asyncio
import sys
import time
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.config import get_settings
from app.clients.llm import get_llm_client
from app.clients.tinyfish import get_tinyfish_client


async def main():
    print("=" * 65)
    print(" 🛠️  PROOFRENT PRE-DEMO SERVICE CONNECTOR DIAGNOSTIC")
    print("=" * 65)

    settings = get_settings()
    print(f"\n[CONFIG] LLM Provider : {settings.llm_provider.upper()} ({settings.llm_model})")
    print(f"[CONFIG] LLM Key Set  : {'YES' if settings.llm_api_key else 'NO (MISSING!)'}")
    print(f"[CONFIG] TinyFish Key : {'YES' if settings.tinyfish_api_key else 'NO (MISSING!)'}")

    results = {}

    # 1. Test Gemini LLM Connection
    print("\n[1/3] Testing Gemini LLM Extraction API...")
    if not settings.llm_api_key:
        print("  ❌ FAIL: LLM_API_KEY is not configured in .env")
        results["gemini"] = False
    else:
        try:
            start_t = time.time()
            llm = get_llm_client()
            sample_prompt = "Rent is Rs 8500 per month for double sharing in Govindpuri."
            sys_p = "Extract rent and locality into JSON. Return JSON only."
            schema = {"type": "object", "properties": {"rent": {"type": "integer"}, "locality": {"type": "string"}}}
            res = await llm.extract_json(sys_p, sample_prompt, schema)
            elapsed = time.time() - start_t
            print(f"  ✅ PASS: Gemini operational in {elapsed:.2f}s | Response: {res}")
            results["gemini"] = True
        except Exception as e:
            print(f"  ❌ FAIL: Gemini API error: {e}")
            results["gemini"] = False

    # 2. Test TinyFish Search API
    print("\n[2/3] Testing TinyFish Search API...")
    if not settings.tinyfish_api_key:
        print("  ❌ FAIL: TINYFISH_API_KEY is not configured in .env")
        results["tinyfish_search"] = False
    else:
        try:
            start_t = time.time()
            tf = get_tinyfish_client()
            hits = await tf.search("aggarwal pg govindpuri delhi")
            elapsed = time.time() - start_t
            print(f"  ✅ PASS: TinyFish Search operational in {elapsed:.2f}s | Found {len(hits)} hits")
            if hits:
                print(f"       Sample Hit: {hits[0].title[:50]}... ({hits[0].url[:50]}...)")
            results["tinyfish_search"] = True
        except Exception as e:
            print(f"  ❌ FAIL: TinyFish Search error: {e}")
            results["tinyfish_search"] = False

    # 3. Test TinyFish Fetch API
    print("\n[3/3] Testing TinyFish Fetch API...")
    probe_url = "https://www.gopgo.in/new-delhi/govindpuri-kalkaji/pg/7121-agarwal-pg-house/pgo-properties"
    if not settings.tinyfish_api_key:
        print("  ❌ FAIL: TINYFISH_API_KEY is not configured in .env")
        results["tinyfish_fetch"] = False
    else:
        try:
            start_t = time.time()
            tf = get_tinyfish_client()
            pages = await tf.fetch([probe_url])
            elapsed = time.time() - start_t
            page = pages[0] if pages else None
            if page and page.ok and len(page.text) > 100:
                print(f"  ✅ PASS: TinyFish Fetch operational in {elapsed:.2f}s | Fetched {len(page.text)} chars")
                results["tinyfish_fetch"] = True
            else:
                err_code = page.error_code if page else "NO_RESULT"
                print(f"  ❌ FAIL: TinyFish Fetch returned empty page or error: {err_code}")
                results["tinyfish_fetch"] = False
        except Exception as e:
            print(f"  ❌ FAIL: TinyFish Fetch error: {e}")
            results["tinyfish_fetch"] = False

    # Summary
    print("\n" + "=" * 65)
    all_ok = all(results.values())
    if all_ok:
        print(" 🎉 ALL SERVICES OPERATIONAL AND READY FOR LIVE PRESENTATION!")
    else:
        print(" ⚠️  WARNING: SOME SERVICES FAILED. YOU CAN USE THE SAFE FALLBACK DEMO MODE.")
    print("=" * 65 + "\n")


if __name__ == "__main__":
    asyncio.run(main())