import json
import re
from typing import Optional

from app.db.database import get_connection
from app.schemas import CapturedPage, Report, UserDecision


def mask_phone_numbers(text: str) -> str:
    if not text:
        return text
    # Mask Indian 10-digit phone numbers and common phone formats
    return re.sub(r"(\+?91[\-\s]?)?[6-9]\d{9}", "[MASKED PHONE]", text)


def save_snapshot(page: CapturedPage) -> str:
    snapshot_id = page.snapshot_id or f"snap_{page.captured_at.timestamp()}"
    sanitized_text = mask_phone_numbers(page.text)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT OR REPLACE INTO snapshots 
        (snapshot_id, url, final_url, portal, text, html, captured_at, fetched_via, ok)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            snapshot_id,
            page.url,
            page.final_url,
            page.portal,
            sanitized_text,
            page.html,
            page.captured_at.isoformat(),
            page.fetched_via,
            1 if page.ok else 0,
        ),
    )
    conn.commit()
    conn.close()
    return snapshot_id


def get_snapshot(snapshot_id: str) -> Optional[CapturedPage]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM snapshots WHERE snapshot_id = ?", (snapshot_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return None

    return CapturedPage(
        url=row["url"],
        final_url=row["final_url"],
        portal=row["portal"],
        text=row["text"],
        html=row["html"],
        captured_at=row["captured_at"],
        snapshot_id=row["snapshot_id"],
        ok=bool(row["ok"]),
        fetched_via=row["fetched_via"],
    )


def save_report(report: Report) -> None:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT OR REPLACE INTO reports (report_id, input_url, data, created_at)
        VALUES (?, ?, ?, ?)
        """,
        (
            report.report_id,
            report.input_url,
            report.model_dump_json(),
            report.created_at.isoformat(),
        ),
    )
    conn.commit()
    conn.close()


def get_report(report_id: str) -> Optional[Report]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT data FROM reports WHERE report_id = ?", (report_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return None

    return Report.model_validate_json(row["data"])


def find_report_by_url(url: str) -> Optional[Report]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT data FROM reports WHERE input_url = ? ORDER BY created_at DESC LIMIT 1",
        (url,),
    )
    row = cursor.fetchone()
    conn.close()

    if not row:
        return None

    return Report.model_validate_json(row["data"])


def save_decision(report_id: str, candidate_id: str, decision: UserDecision) -> Report:
    report = get_report(report_id)
    if not report or not report.matching:
        raise ValueError(f"Report {report_id} not found or has no matching data")

    for candidate in report.matching.candidates:
        if candidate.candidate_id == candidate_id:
            candidate.user_decision = decision
            break

    save_report(report)
    return report