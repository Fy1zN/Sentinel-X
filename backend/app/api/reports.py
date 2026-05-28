
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.auth.dependencies import get_current_user

from app.models.user import User
from app.models import Report

from fastapi.responses import FileResponse 
from app.services.pdf_service import ( generate_pdf_report )

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


# =====================================================
# DATABASE DEPENDENCY
# =====================================================
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# =====================================================
# GENERATE REPORT
# =====================================================
@router.post("/generate")
def generate_report(
    payload: dict,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:

        return {
            "success": False,
            "message": "User not found"
        }

    report = Report(

        user_id=user.id,

        report_name=payload.get(
            "report_name",
            "Untitled Report"
        ),

        ioc=payload.get(
            "ioc",
            "Unknown"
        ),

        ioc_type=payload.get(
            "ioc_type",
            "unknown"
        ),

        severity=payload.get(
            "severity",
            "medium"
        ),

        threat_score=payload.get(
            "threat_score",
            0
        ),

        summary=payload.get(
            "summary",
            ""
        ),

        mitre_attack=payload.get(
            "mitre_attack",
            ""
        ),

        source_intelligence=payload.get(
            "source_intelligence",
            ""
        ),

        analyst_notes=payload.get(
            "analyst_notes",
            ""
        ),

        pdf_path=None

    )

    db.add(report)

    db.commit()

    db.refresh(report)

    return {

        "success": True,

        "message": "Report generated successfully",

        "report": {

            "id": report.id,

            "report_name": report.report_name,

            "ioc": report.ioc,

            "severity": report.severity,

            "created_at": report.created_at

        }

    }


# =====================================================
# GET REPORT HISTORY
# =====================================================
@router.get("/history")
def get_report_history(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:
        return []

    reports = db.query(Report).filter(
        Report.user_id == user.id
    ).order_by(
        Report.created_at.desc()
    ).all()

    return reports


# =====================================================
# GET SINGLE REPORT
# =====================================================
@router.get("/{report_id}")
def get_single_report(
    report_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:

        return {
            "success": False
        }

    report = db.query(Report).filter(

        Report.id == report_id,

        Report.user_id == user.id

    ).first()

    if not report:

        return {
            "success": False,
            "message": "Report not found"
        }

    return report


# =====================================================
# DELETE REPORT
# =====================================================
@router.delete("/{report_id}")
def delete_report(
    report_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:

        return {
            "success": False
        }

    report = db.query(Report).filter(

        Report.id == report_id,

        Report.user_id == user.id

    ).first()

    if not report:

        return {
            "success": False,
            "message": "Report not found"
        }

    db.delete(report)

    db.commit()

    return {

        "success": True,

        "message": "Report deleted successfully"

    }


# =====================================================
# DOWNLOAD PDF REPORT
# =====================================================
@router.get("/download/{report_id}")
def download_report(
    report_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:

        return {
            "success": False
        }

    report = db.query(Report).filter(

        Report.id == report_id,

        Report.user_id == user.id

    ).first()

    if not report:

        return {
            "success": False,
            "message": "Report not found"
        }

    # =====================================================
    # GENERATE PDF
    # =====================================================

    pdf_path = generate_pdf_report(
        report
    )

    report.pdf_path = pdf_path

    db.commit()

    # =====================================================
    # RETURN FILE
    # =====================================================

    return FileResponse(

        path=pdf_path,

        filename=f"{report.report_name}.pdf",

        media_type="application/pdf"

    )

