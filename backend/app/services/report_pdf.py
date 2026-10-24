import io
from datetime import datetime
from typing import Optional

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

from app.schemas import Report


def render_report_pdf(report: Report) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )

    story = []
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#0F172A"),
        alignment=0,
    )
    subtitle_style = ParagraphStyle(
        "DocSubTitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#64748B"),
    )
    heading_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#1E293B"),
        spaceBefore=12,
        spaceAfter=6,
    )
    body_style = ParagraphStyle(
        "BodyText",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#334155"),
    )
    bold_body = ParagraphStyle(
        "BoldBody",
        parent=body_style,
        fontName="Helvetica-Bold",
    )

    # Header section
    story.append(Paragraph("ProofRent Investigation Report", title_style))
    created_str = report.created_at.strftime("%Y-%m-%d %H:%M UTC") if report.created_at else "N/A"
    replay_info = f" ({report.replay_label})" if report.is_replay and report.replay_label else ""
    story.append(
        Paragraph(
            f"<b>Report ID:</b> {report.report_id} | <b>Generated:</b> {created_str}{replay_info}",
            subtitle_style,
        )
    )
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=12))

    # Listing summary
    story.append(Paragraph("Target Listing", heading_style))
    input_url = report.input_url or "N/A"
    title_val = report.listing.title.value if report.listing and report.listing.title else "Property Listing"
    portal_val = (report.portal or "N/A").capitalize()

    story.append(Paragraph(f"<b>Title:</b> {title_val}", body_style))
    story.append(Paragraph(f"<b>Source URL:</b> {input_url}", body_style))
    story.append(Paragraph(f"<b>Portal:</b> {portal_val}", body_style))
    story.append(Spacer(1, 10))

    # Hero 2: Cost Ladder
    story.append(Paragraph("Real Cost Ladder", heading_style))
    if report.cost:
        story.append(Paragraph(f"<b>Headline Summary:</b> {report.cost.headline}", bold_body))
        story.append(Spacer(1, 6))

        table_data = [["Expense Item", "Category", "Range / Details", "Label"]]
        for line in report.cost.lines:
            if line.amount_min is not None:
                if line.amount_max is not None and line.amount_max != line.amount_min:
                    amount_str = f"₹{line.amount_min:,} - ₹{line.amount_max:,}"
                else:
                    amount_str = f"₹{line.amount_min:,}"
            else:
                amount_str = line.display_value or "Unknown"

            table_data.append([line.title, line.recurrence.title(), amount_str, line.label.title()])

        cost_table = Table(table_data, colWidths=[150, 90, 180, 100])
        cost_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F1F5F9")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#0F172A")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ])
        )
        story.append(cost_table)
    else:
        story.append(Paragraph("Cost ladder analysis not available.", body_style))

    story.append(Spacer(1, 12))

    # Hero 1: Matching Listings
    story.append(Paragraph("Cross-Portal Matching", heading_style))
    if report.matching and report.matching.candidates:
        match_data = [["Portal", "Match Level", "Confidence", "Price Gap Details"]]
        for cand in report.matching.candidates:
            gap_str = "No comparable gap"
            if cand.price_gaps:
                gap = cand.price_gaps[0]
                gap_str = f"Listed at ₹{gap.rent_there:,}/mo ({gap.difference:+,})"

            match_data.append([
                cand.listing.portal.capitalize(),
                cand.match_level.title(),
                cand.confidence.title(),
                gap_str,
            ])

        match_table = Table(match_data, colWidths=[110, 90, 90, 230])
        match_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F1F5F9")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#0F172A")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ])
        )
        story.append(match_table)
    else:
        story.append(Paragraph("No matching listings detected on other portals.", body_style))

    story.append(Spacer(1, 12))

    # Evidence Cards Summary
    story.append(Paragraph("Evidence Findings", heading_style))
    if report.findings:
        for finding in report.findings:
            story.append(Paragraph(f"• <b>[{finding.label.upper()}]</b> {finding.what_we_saw}", body_style))
            if finding.question:
                story.append(Paragraph(f"   <i>Question to ask: {finding.question}</i>", body_style))
            story.append(Spacer(1, 3))
    else:
        story.append(Paragraph("No specific evidence flags recorded.", body_style))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes