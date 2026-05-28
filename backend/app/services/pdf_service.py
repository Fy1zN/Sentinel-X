
import os

from reportlab.platypus import (  # type: ignore
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import (  # type: ignore
    getSampleStyleSheet
)

from reportlab.lib import pagesizes  # type: ignore


REPORT_FOLDER = "generated_reports"

os.makedirs(
    REPORT_FOLDER,
    exist_ok=True
)


def generate_pdf_report(report):

    filename = f"report_{report.id}.pdf"

    filepath = os.path.join(
        REPORT_FOLDER,
        filename
    )

    document = SimpleDocTemplate(
        filepath,
        pagesize=pagesizes.letter
    )

    styles = getSampleStyleSheet()

    elements = []

    # =====================================================
    # TITLE
    # =====================================================

    title = Paragraph(

        "SentinelX Threat Intelligence Report",

        styles["Title"]

    )

    elements.append(title)

    elements.append(
        Spacer(1, 20)
    )

    # =====================================================
    # REPORT CONTENT
    # =====================================================

    fields = [

        f"<b>Report Name:</b> {report.report_name}",

        f"<b>IOC:</b> {report.ioc}",

        f"<b>IOC Type:</b> {report.ioc_type}",

        f"<b>Severity:</b> {report.severity}",

        f"<b>Threat Score:</b> {report.threat_score}",

        f"<b>Summary:</b> {report.summary}",

        f"<b>MITRE ATT&CK:</b> {report.mitre_attack}",

        f"<b>Sources:</b> {report.source_intelligence}",

        f"<b>Analyst Notes:</b> {report.analyst_notes}",

        f"<b>Created At:</b> {report.created_at}"

    ]

    for field in fields:

        paragraph = Paragraph(
            field,
            styles["BodyText"]
        )

        elements.append(paragraph)

        elements.append(
            Spacer(1, 12)
        )

    # =====================================================
    # BUILD PDF
    # =====================================================

    document.build(elements)

    return filepath

