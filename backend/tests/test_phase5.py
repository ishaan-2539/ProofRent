import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.main import app
from app.core.config import get_settings

client = TestClient(app)


def test_wallet_endpoint():
    response = client.get("/api/wallet")
    assert response.status_code == 200
    data = response.json()
    assert "ok" in data


def test_mock_mode_override():
    settings = get_settings()
    original_mode = settings.mock_mode
    try:
        settings.mock_mode = True
        response = client.post(
            "/api/investigations", 
            json={"url": "https://www.magicbricks.com/propertyDetail/aggarwal-pg"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["is_replay"] is True
        assert data["report_id"] == "replay_match"
    finally:
        settings.mock_mode = original_mode


def test_replay_report_fetch():
    response = client.get("/api/reports/replay_match")
    assert response.status_code == 200
    data = response.json()
    assert data["is_replay"] is True
    assert data["report_id"] == "report_match"