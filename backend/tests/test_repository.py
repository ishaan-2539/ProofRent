import sys
from pathlib import Path
from datetime import datetime, timezone

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.db.database import init_db
from app.db.repository import save_snapshot, get_snapshot, mask_phone_numbers
from app.schemas import CapturedPage


def test_mask_phone_numbers():
    text = "Call me at +91 9876543210 or 9876543210"
    masked = mask_phone_numbers(text)
    assert "9876543210" not in masked
    assert "[MASKED PHONE]" in masked


def test_snapshot_db():
    init_db()
    page = CapturedPage(
        url="https://example.com",
        final_url="https://example.com",
        portal="gopgo",
        text="Call 9876543210 for details",
        captured_at=datetime.now(timezone.utc),
        ok=True,
    )
    snap_id = save_snapshot(page)
    retrieved = get_snapshot(snap_id)

    assert retrieved is not None
    assert "[MASKED PHONE]" in retrieved.text