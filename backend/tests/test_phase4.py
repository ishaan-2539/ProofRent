import sys
from pathlib import Path
from datetime import datetime, timezone
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.main import app
from app.schemas import (
    Report, 
    MatchingResult, 
    MatchCandidate, 
    ListingFields, 
    SourceRef
)
from app.services.orchestrator import sync_cached_report
from app.db.database import init_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    init_db()


def create_dummy_report(report_id: str = "rep_test_decision") -> Report:
    source = SourceRef(url="https://gopgo.in/listing/123", captured_at=datetime.now(timezone.utc))
    listing_a = ListingFields(listing_id="list_a", source=source, portal="gopgo")
    listing_b = ListingFields(listing_id="list_b", source=source, portal="magicbricks")

    candidate = MatchCandidate(
        candidate_id="cand_list_b",
        listing=listing_b,
        match_level="match",
        confidence="high",
        method="Location and name matching",
        families=[]
    )

    report = Report(
        report_id=report_id,
        status="completed",
        created_at=datetime.now(timezone.utc),
        input_url=source.url,
        matching=MatchingResult(
            status="match_found",
            candidates=[candidate],
            message="1 candidate found"
        )
    )

    sync_cached_report(report)
    return report


def test_decision_endpoint_success():
    report_id = "rep_test_decision_success"
    create_dummy_report(report_id)

    payload = {
        "candidate_id": "cand_list_b",
        "decision": "confirmed"
    }

    response = client.post(f"/api/reports/{report_id}/decision", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert data["report_id"] == report_id
    assert data["matching"]["candidates"][0]["user_decision"] == "confirmed"


def test_decision_endpoint_not_found():
    payload = {
        "candidate_id": "non_existent_cand",
        "decision": "rejected"
    }

    response = client.post("/api/reports/non_existent_report/decision", json=payload)
    assert response.status_code == 404

    err_data = response.json()
    assert "error" in err_data
    assert err_data["error"]["code"] == "INTERNAL"
    assert "not found" in err_data["error"]["message"].lower()


def test_error_middleware_contract_format():
    response = client.post("/api/investigations", json={"url": "invalid_url_without_https"})
    assert response.status_code == 400

    err_data = response.json()
    assert "error" in err_data
    assert "code" in err_data["error"]
    assert "message" in err_data["error"]
    assert err_data["error"]["code"] == "INVALID_URL"


def test_422_validation_error_format():
    response = client.post("/api/reports/123/decision", json={})
    assert response.status_code == 422

    err_data = response.json()
    assert "error" in err_data
    assert err_data["error"]["code"] == "INVALID_INPUT"
    assert "Validation error" in err_data["error"]["message"]