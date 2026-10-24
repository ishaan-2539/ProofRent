from fastapi import APIRouter

from app.clients.tinyfish import get_tinyfish_client
from app.core.constants import get_constants
from app.core.errors import ProofRentError
from app.schemas import ExampleListing, PreflightCheck, PreflightResult, WalletInfo
from app.services.preflight import run_preflight
from app.services.replay import list_examples

router = APIRouter(prefix="/api", tags=["system"])

# A real page from your 20 Oct trial. Used only to prove Fetch works end to end.
FETCH_PROBE_URL = (
    "https://www.gopgo.in/new-delhi/govindpuri-kalkaji/pg/7121-agarwal-pg-house/pgo-properties"
)


@router.get("/health")
async def health_check():
    constants = get_constants()
    return {"ok": True, "contract_version": constants.get("contract_version", "1.0")}


@router.get("/wallet", response_model=WalletInfo)
async def check_wallet():
    """Confirms the TinyFish key works (see TinyFishClient.get_wallet)."""
    return await get_tinyfish_client().get_wallet()


@router.get("/examples", response_model=list[ExampleListing])
async def get_examples():
    """One source of truth: services/replay.py."""
    return list_examples()


@router.get("/preflight", response_model=PreflightResult)
async def preflight():
    """Base checks (db, fixtures, llm) plus live TinyFish Search and Fetch checks."""
    base = await run_preflight()
    checks = list(base.checks)
    tf = get_tinyfish_client()

    try:
        hits = await tf.search("aggarwal pg govindpuri delhi")
        checks.append(
            PreflightCheck(
                name="tinyfish_search",
                ok=len(hits) > 0,
                detail=f"Search returned {len(hits)} results.",
            )
        )
    except ProofRentError as e:
        checks.append(PreflightCheck(name="tinyfish_search", ok=False, detail=e.message))
    except Exception as e:  # never let preflight crash
        checks.append(PreflightCheck(name="tinyfish_search", ok=False, detail=str(e)))

    try:
        pages = await tf.fetch([FETCH_PROBE_URL])
        page = pages[0] if pages else None
        ok = bool(page and page.ok)
        detail = (
            f"Fetched {len(page.text)} characters from GoPGo."
            if ok
            else f"Fetch returned no content ({page.error_code if page else 'no result'})."
        )
        checks.append(PreflightCheck(name="tinyfish_fetch", ok=ok, detail=detail))
    except ProofRentError as e:
        checks.append(PreflightCheck(name="tinyfish_fetch", ok=False, detail=e.message))
    except Exception as e:
        checks.append(PreflightCheck(name="tinyfish_fetch", ok=False, detail=str(e)))

    return PreflightResult(
        all_ok=all(c.ok for c in checks),
        checked_at=base.checked_at,
        checks=checks,
    )