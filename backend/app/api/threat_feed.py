from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.ioc_history import IOCHistory
from app.models.user import User
from app.auth.dependencies import get_current_user

import os
import requests

from dotenv import load_dotenv

load_dotenv()

router = APIRouter(
    prefix="/threats",
    tags=["Threat Feed"]
)


# DATABASE DEPENDENCY
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# COUNTRY NORMALIZATION
COUNTRY_MAP = {

    "US": "United States",
    "NL": "Netherlands",
    "DE": "Germany",
    "RU": "Russia",
    "CN": "China",
    "AU": "Australia",
    "SE": "Sweden",
    "BG": "Bulgaria",
    "IN": "India",
    "RO": "Romania",
    "FR": "France",
    "GB": "United Kingdom",
    "JP": "Japan",
    "KR": "South Korea",
    "CA": "Canada",

}


# INTERNAL THREAT FEED
@router.get("/feed")
def threat_feed(

    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)

):

    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:
        return []

    latest_threats = db.query(
        IOCHistory
    ).filter(
        IOCHistory.user_id == user.id
    ).order_by(
        IOCHistory.created_at.desc()
    ).limit(10).all()

    results = []

    for item in latest_threats:

        results.append({

            "ioc": item.ioc,

            "ioc_type": item.ioc_type or "unknown",

            "risk_score": item.risk_score or 0,

            "status": item.status or "clean",

            "country": item.country or "Unknown",

            "created_at": item.created_at.isoformat()
            if item.created_at
            else None

        })

    return results


# LIVE GLOBAL THREAT FEED
@router.get("/live-feed")
def live_threat_feed(

    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)

):

    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:
        return []

    print("\n========== LIVE FEED STARTED ==========\n")

    # DATABASE IOCS
    db_iocs = db.query(
        IOCHistory
    ).filter(
        IOCHistory.user_id == user.id
    ).order_by(
        IOCHistory.created_at.desc()
    ).limit(25).all()

    threats = []

    for item in db_iocs:

        severity = "clean"

        if (item.risk_score or 0) >= 90:

            severity = "critical"

        elif (item.risk_score or 0) >= 70:

            severity = "malicious"

        elif (item.risk_score or 0) >= 40:

            severity = "suspicious"

        threats.append({

            "ioc": item.ioc,

            "ioc_type": item.ioc_type or "unknown",

            "country": item.country or "Unknown",

            "status": severity,

            "risk_score": item.risk_score or 0,

            "total_reports": item.risk_score or 0,

            "created_at": item.created_at.isoformat()
            if item.created_at
            else None

        })

    print(
        f"\nDATABASE IOCS RETURNED: {len(threats)}\n"
    )

    # ABUSEIPDB LIVE IPS
    API_KEY = os.getenv(
        "ABUSEIPDB_API_KEY"
    )

    if API_KEY:

        headers = {

            "Key": API_KEY,
            "Accept": "application/json"

        }

        suspicious_ips = [

            "185.220.101.45",
            "45.33.32.156",
            "198.98.51.189",
            "103.27.202.85",
            "91.219.236.222",
            "167.94.138.52",
            "172.105.128.11",
            "45.9.148.114",
            "80.94.92.177",
            "178.105.173.224",

        ]

        for ip in suspicious_ips:

            try:

                response = requests.get(

                    "https://api.abuseipdb.com/api/v2/check",

                    headers=headers,

                    params={

                        "ipAddress": ip,
                        "maxAgeInDays": 90

                    },

                    timeout=10

                )

                print(f"\nCHECKING IP: {ip}")
                print("STATUS:", response.status_code)

                if response.status_code != 200:

                    print("FAILED:", response.text)
                    continue

                json_data = response.json()

                if "data" not in json_data:

                    continue

                data = json_data["data"]

                country_code = data.get(
                    "countryCode",
                    "Unknown"
                )

                country = COUNTRY_MAP.get(
                    country_code,
                    country_code
                )

                risk_score = data.get(
                    "abuseConfidenceScore",
                    0
                )

                # STATUS LOGIC
                if risk_score >= 90:

                    status = "critical"

                elif risk_score >= 70:

                    status = "malicious"

                elif risk_score >= 40:

                    status = "suspicious"

                else:

                    status = "clean"

                threats.append({

                    "ioc": ip,

                    "ioc_type": "ip",

                    "country": country,

                    "risk_score": risk_score,

                    "total_reports": data.get(
                        "totalReports",
                        0
                    ),

                    "created_at": data.get(
                        "lastReportedAt",
                        None
                    ),

                    "status": status,

                    "usage_type": data.get(
                        "usageType",
                        "Unknown"
                    ),

                    "isp": data.get(
                        "isp",
                        "Unknown"
                    ),

                })

            except Exception as e:

                print(
                    f"ERROR FETCHING {ip}:",
                    e
                )

    print(
        f"\nFINAL LIVE THREATS RETURNED: {len(threats)}\n"
    )

    return threats