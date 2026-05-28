
from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.database.connection import SessionLocal
from app.auth.dependencies import get_current_user

from app.models.user import User
from app.models.ioc_history import IOCHistory

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
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
# MAIN DASHBOARD STATS
# =====================================================
@router.get("/stats")
def dashboard_stats(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:
        return {}

    total_searches = db.query(IOCHistory).filter(
        IOCHistory.user_id == user.id
    ).count()

    active_iocs = db.query(IOCHistory).filter(
        IOCHistory.user_id == user.id
    ).count()

    malicious_count = db.query(IOCHistory).filter(
        IOCHistory.user_id == user.id,
        IOCHistory.risk_score >= 70
    ).count()

    clean_count = db.query(IOCHistory).filter(
        IOCHistory.user_id == user.id,
        IOCHistory.risk_score < 40
    ).count()

    avg_risk = db.query(
        func.avg(IOCHistory.risk_score)
    ).filter(
        IOCHistory.user_id == user.id
    ).scalar()

    critical_count = db.query(IOCHistory).filter(
        IOCHistory.user_id == user.id,
        IOCHistory.risk_score >= 90
    ).count()

    unique_countries = db.query(
        IOCHistory.country
    ).filter(
        IOCHistory.user_id == user.id
    ).distinct().count()

    medium_count = db.query(IOCHistory).filter(
        IOCHistory.user_id == user.id,
        IOCHistory.risk_score >= 40,
        IOCHistory.risk_score < 70
    ).count()

    high_count = db.query(IOCHistory).filter(
        IOCHistory.user_id == user.id,
        IOCHistory.risk_score >= 70,
        IOCHistory.risk_score < 90
    ).count()

    low_count = db.query(IOCHistory).filter(
        IOCHistory.user_id == user.id,
        IOCHistory.risk_score < 40
    ).count()

    return {

        "total_searches": total_searches,

        "active_iocs": active_iocs,

        "malicious_iocs": malicious_count,

        "clean_iocs": clean_count,

        "critical_iocs": critical_count,

        "medium_iocs": medium_count,

        "high_iocs": high_count,

        "low_iocs": low_count,

        "unique_countries": unique_countries,

        "average_risk_score": round(avg_risk or 0, 2)

    }


# =====================================================
# COUNTRY ANALYTICS
# =====================================================
@router.get("/countries")
def country_analytics(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:
        return []

    countries = db.query(
        IOCHistory.country,
        func.count(IOCHistory.country).label("count")
    ).filter(
        IOCHistory.user_id == user.id
    ).group_by(
        IOCHistory.country
    ).order_by(
        desc("count")
    ).limit(10).all()

    cleaned = []

    for country, count in countries:

        cleaned.append({

            "country": (
                country
                if country and country != "Unknown"
                else "Unresolved"
            ),

            "count": count

        })

    return cleaned


# =====================================================
# STATUS DISTRIBUTION
# =====================================================
@router.get("/status-distribution")
def status_distribution(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:
        return []

    statuses = db.query(
        IOCHistory.status,
        func.count(IOCHistory.status).label("count")
    ).filter(
        IOCHistory.user_id == user.id
    ).group_by(
        IOCHistory.status
    ).all()

    return [

        {
            "status": (
                status
                if status
                else "unknown"
            ),
            "count": count
        }

        for status, count in statuses

    ]


# =====================================================
# TOP SEARCHED IOCS
# =====================================================
@router.get("/top-iocs")
def top_iocs(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:
        return []

    iocs = db.query(
        IOCHistory.ioc,
        func.count(IOCHistory.ioc).label("count")
    ).filter(
        IOCHistory.user_id == user.id
    ).group_by(
        IOCHistory.ioc
    ).order_by(
        desc("count")
    ).limit(10).all()

    return [

        {
            "ioc": ioc,
            "count": count
        }

        for ioc, count in iocs

    ]


# =====================================================
# RECENT SEARCHES
# =====================================================
@router.get("/recent-searches")
def recent_searches(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:
        return []

    recent = db.query(IOCHistory).filter(
        IOCHistory.user_id == user.id
    ).order_by(
        IOCHistory.created_at.desc()
    ).limit(10).all()

    return [

        {

            "ioc": item.ioc,

            "ioc_type": item.ioc_type,

            "risk_score": item.risk_score or 0,

            "status": item.status,

            "country": item.country,

            "created_at": item.created_at

        }

        for item in recent

    ]


# =====================================================
# ATTACK CATEGORY ANALYTICS
# =====================================================
@router.get("/attack-categories")
def attack_categories(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:
        return []

    records = db.query(IOCHistory).filter(
        IOCHistory.user_id == user.id
    ).all()

    categories = {

        "Ransomware": 0,
        "Phishing": 0,
        "C2 Activity": 0,
        "Data Exfil": 0,
        "Recon": 0,

    }

    for record in records:

        text = f"""
        {record.ioc}
        {record.status}
        {record.country}
        """.lower()

        if (
            "ransom" in text or
            "lockbit" in text or
            "wannacry" in text
        ):

            categories["Ransomware"] += 1

        elif (
            "phish" in text or
            "spoof" in text or
            "credential" in text
        ):

            categories["Phishing"] += 1

        elif (
            "c2" in text or
            "botnet" in text or
            "command" in text or
            "beacon" in text
        ):

            categories["C2 Activity"] += 1

        elif (
            "exfil" in text or
            "stealer" in text or
            "infostealer" in text
        ):

            categories["Data Exfil"] += 1

        else:

            categories["Recon"] += 1

    return [

        {
            "name": key,
            "value": value
        }

        for key, value in categories.items()

    ]


# =====================================================
# 24 HOUR ACTIVITY
# =====================================================
@router.get("/activity-24h")
def activity_24h(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:
        return []

    records = db.query(IOCHistory).filter(
        IOCHistory.user_id == user.id
    ).all()

    hourly_data = {}

    for record in records:

        if not record.created_at:
            continue

        hour = record.created_at.strftime("%H:00")

        if hour not in hourly_data:

            hourly_data[hour] = {

                "time": hour,

                "threats": 0,

                "alerts": 0

            }

        hourly_data[hour]["threats"] += 1

        if (record.risk_score or 0) >= 70:

            hourly_data[hour]["alerts"] += 1

    sorted_hours = sorted(
        hourly_data.values(),
        key=lambda x: x["time"]
    )

    return sorted_hours


# =====================================================
# SOC LIVE LOGS
# =====================================================
@router.get("/soc-logs")
def soc_logs(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:
        return []

    logs = db.query(IOCHistory).filter(
        IOCHistory.user_id == user.id
    ).order_by(
        IOCHistory.created_at.desc()
    ).limit(10).all()

    response = []

    for log in logs:

        score = log.risk_score or 0

        severity = "low"

        color = "text-green-400"

        if score >= 90:

            severity = "critical"
            color = "text-red-400"

        elif score >= 70:

            severity = "high"
            color = "text-orange-400"

        elif score >= 40:

            severity = "medium"
            color = "text-yellow-400"

        response.append({

            "title": f"{severity.upper()} Threat Detected",

            "description":
                f"IOC {log.ioc} analyzed with risk score {score}",

            "user": current_user,

            "time": (
                log.created_at.strftime("%I:%M %p")
                if log.created_at
                else "Unknown"
            ),

            "color": color

        })

    return response

