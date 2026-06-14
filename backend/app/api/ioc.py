from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query
)

from sqlalchemy.orm import Session

from app.database.connection import (
    SessionLocal
)

from app.auth.dependencies import (
    get_current_user
)

from app.services.ioc_history_service import (
    save_ioc_search
)

from app.services.ioc_classifier import (
    detect_ioc_type
)

from app.services.correlation_service import (
    correlate_ioc
)

from app.services.ml_triage import get_triage_service

router = APIRouter(
    prefix="/ioc",
    tags=["IOC"]
)


# =====================================================
# DATABASE
# =====================================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =====================================================
# IOC SEARCH
# =====================================================
@router.get("/search")
def search_ioc(

    ioc: str = Query(...),

    current_user: str = Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    )

):

    ml = None

    try:

        # =====================================================
        # IOC TYPE DETECTION
        # =====================================================
        ioc_type = detect_ioc_type(ioc)

        print("\n========== IOC TYPE ==========")
        print(ioc_type)
        print("================================\n")

        if ioc_type == "unknown":
            raise HTTPException(
                status_code=400,
                detail="Unsupported IOC type"
            )

        # =====================================================
        # CENTRALIZED CORRELATION ENGINE
        # =====================================================
        correlation_result = correlate_ioc(ioc, ioc_type)

        # =====================================================
        # ML TRIAGE
        # =====================================================
        try:
            ml = get_triage_service().score(correlation_result)
            print("\n========== ML RESULT ==========")
            print("model_used :", ml.get("model_used"))
            print("ml_score   :", ml.get("ml_score_pct"))
            print("severity   :", ml.get("severity"))
            print("confidence :", ml.get("confidence"))
            print("reasoning  :", ml.get("reasoning", "")[:100])
            print("================================\n")
        except Exception as ml_err:
            print(f"\n[ML ERROR] {ml_err}\n")
            ml = None

        # =====================================================
        # COUNTRY EXTRACTION
        # =====================================================
        country = "Unknown"

        if correlation_result.get("abuseipdb"):
            country = correlation_result["abuseipdb"].get("country", "Unknown")
        elif correlation_result.get("virustotal"):
            country = correlation_result["virustotal"].get("country", "Unknown")

        # =====================================================
        # NORMALIZED RESPONSE
        # =====================================================
        result = {

            "ioc":      correlation_result.get("ioc"),
            "ioc_type": correlation_result.get("ioc_type"),

            "severity":   ml["severity"]      if ml else correlation_result.get("severity", "unknown"),
            "risk_score": ml["ml_score_pct"]  if ml else correlation_result.get("threat_score", 0),
            "status":     ml["severity"]      if ml else correlation_result.get("severity", "unknown"),

            "country":      country,
            "virustotal":   correlation_result.get("virustotal"),
            "abuseipdb":    correlation_result.get("abuseipdb"),
            "otx":          correlation_result.get("otx"),
            "malwarebazaar": correlation_result.get("malwarebazaar"),
            "urlhaus":      correlation_result.get("urlhaus"),
            "mitre_attack": correlation_result.get("mitre_attack", []),
            "searched_by":  current_user,

            # ML fields — real model or fallback values
            "ml_score":       ml["ml_score_pct"]       if ml else 0,
            "fp_probability": ml["fp_probability_pct"] if ml else 100,
            "confidence":     ml["confidence"]          if ml else "Low",
            "reasoning":      ml["reasoning"]           if ml else "ML scoring unavailable.",
            "top_signals":    ml["top_signals"]         if ml else [],
            "model_used":     ml["model_used"]          if ml else "unavailable",
        }

    except HTTPException:
        raise

    except Exception as e:

        print("\n========== IOC SEARCH ERROR ==========")
        import traceback
        traceback.print_exc()
        print("======================================\n")

        result = {
            "ioc":          ioc,
            "ioc_type":     "unknown",
            "severity":     "unknown",
            "risk_score":   0,
            "status":       "unknown",
            "country":      "Unknown",
            "virustotal":   None,
            "abuseipdb":    None,
            "otx":          None,
            "malwarebazaar": None,
            "urlhaus":      None,
            "mitre_attack": [],
            "searched_by":  current_user,
            "ml_score":       0,
            "fp_probability": 100,
            "confidence":     "Low",
            "reasoning":      f"Error: {str(e)}",
            "top_signals":    [],
            "model_used":     "error",
        }

    # =====================================================
    # SAVE IOC HISTORY
    # =====================================================
    save_ioc_search(
        db=db,
        username=current_user,
        ioc=result.get("ioc"),
        ioc_type=result.get("ioc_type", "unknown"),
        risk_score=result.get("risk_score", 0),
        status=result.get("status", "unknown"),
        country=result.get("country", "Unknown")
    )

    return result