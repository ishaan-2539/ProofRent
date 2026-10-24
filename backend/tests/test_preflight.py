import sys
from pathlib import Path
import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.preflight import run_preflight


@pytest.mark.asyncio
async def test_run_preflight():
    result = await run_preflight()
    assert result is not None
    assert isinstance(result.all_ok, bool)
    assert len(result.checks) >= 3