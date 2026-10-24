import sys
from pathlib import Path
import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.replay import load_replay_report
from app.services.report_pdf import render_report_pdf


def test_render_report_pdf():
    report = load_replay_report("match")
    pdf_bytes = render_report_pdf(report)
    
    assert pdf_bytes is not None
    assert len(pdf_bytes) > 0
    # PDF files start with %PDF magic bytes
    assert pdf_bytes.startswith(b"%PDF")