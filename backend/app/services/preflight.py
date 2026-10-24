import logging
from datetime import datetime, timezone
from typing import List

from app.clients.llm import get_llm_client
from app.db.database import get_connection, init_db
from app.schemas import PreflightCheck, PreflightResult
from app.services.replay import list_examples

logger = logging.getLogger(__name__)


async def run_preflight() -> PreflightResult:
    checks: List[PreflightCheck] = []

    # 1. Database Check
    try:
        init_db()
        conn = get_connection()
        conn.close()
        checks.append(PreflightCheck(name="database_connection", ok=True, detail="SQLite database is initialized and writable."))
    except Exception as e:
        checks.append(PreflightCheck(name="database_connection", ok=False, detail=f"Database check failed: {e}"))

    # 2. Replay Fixtures Check
    try:
        examples = list_examples()
        if len(examples) == 4:
            checks.append(PreflightCheck(name="replay_fixtures", ok=True, detail="All 4 replay fixture examples loaded successfully."))
        else:
            checks.append(PreflightCheck(name="replay_fixtures", ok=False, detail=f"Expected 4 replay examples, found {len(examples)}."))
    except Exception as e:
        checks.append(PreflightCheck(name="replay_fixtures", ok=False, detail=f"Fixture check failed: {e}"))

    # 3. LLM Client Check
    try:
        client = get_llm_client()
        checks.append(PreflightCheck(name="llm_client_config", ok=True, detail=f"LLM client configured for provider '{client.provider}'."))
    except Exception as e:
        checks.append(PreflightCheck(name="llm_client_config", ok=False, detail=f"LLM client check failed: {e}"))

    all_ok = all(check.ok for check in checks)

    return PreflightResult(
        all_ok=all_ok,
        checked_at=datetime.now(timezone.utc),
        checks=checks,
    )