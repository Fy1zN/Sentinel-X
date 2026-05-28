import os
import requests

from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv(
    "ABUSEIPDB_API_KEY"
)

HEADERS = {

    "Key": API_KEY,
    "Accept": "application/json"

}


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


def lookup_ip(ip: str):

    try:

        print("\n========== ABUSEIPDB LOOKUP ==========")
        print("IP:", ip)
        print("API KEY FOUND:", bool(API_KEY))
        print("======================================\n")

        response = requests.get(

            "https://api.abuseipdb.com/api/v2/check",

            headers=HEADERS,

            params={

                "ipAddress": ip,

                # IMPORTANT FIX
                "maxAgeInDays": 365

            },

            timeout=15

        )

        print("\n========== ABUSEIPDB RESPONSE ==========")
        print("STATUS:", response.status_code)
        print(response.text[:3000])
        print("========================================\n")

        if response.status_code != 200:

            return None

        json_data = response.json()

        if "data" not in json_data:

            print("NO DATA FIELD FOUND")
            return None

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

        result = {

            "source": "AbuseIPDB",

            "ioc": ip,

            "ioc_type": "ip",

            "risk_score": risk_score,

            "status": status,

            "country": country,

            "reports": data.get(
                "totalReports",
                0
            ),

            "usage_type": data.get(
                "usageType",
                "Unknown"
            ),

            "isp": data.get(
                "isp",
                "Unknown"
            ),

            "domain": data.get(
                "domain",
                "Unknown"
            ),

            "last_reported": data.get(
                "lastReportedAt"
            ),

        }

        print("\n========== FINAL RESULT ==========")
        print(result)
        print("==================================\n")

        return result

    except Exception as e:

        print(
            "\n========== ABUSEIPDB ERROR =========="
        )

        print(str(e))

        print(
            "=====================================\n"
        )

        return None