import os
import requests

from dotenv import load_dotenv

load_dotenv()

VT_API_KEY = os.getenv(
    "VIRUSTOTAL_API_KEY"
)

BASE_URL = (
    "https://www.virustotal.com/api/v3"
)


HEADERS = {

    "x-apikey": VT_API_KEY

}


# =========================================
# HASH LOOKUP
# =========================================
def lookup_hash(hash_value: str):

    try:

        response = requests.get(

            f"{BASE_URL}/files/{hash_value}",

            headers=HEADERS,

            timeout=20

        )

        print("\n===== VT HASH STATUS =====")
        print(response.status_code)
        print("==========================\n")

        if response.status_code != 200:

            print(response.text)

            return None

        data = response.json()

        attributes = data.get(
            "data",
            {}
        ).get(
            "attributes",
            {}
        )

        stats = attributes.get(
            "last_analysis_stats",
            {}
        )

        return {

            "source": "VirusTotal",

            "ioc_type": "hash",

            "malicious": stats.get(
                "malicious",
                0
            ),

            "suspicious": stats.get(
                "suspicious",
                0
            ),

            "undetected": stats.get(
                "undetected",
                0
            ),

            "harmless": stats.get(
                "harmless",
                0
            ),

            "file_type": attributes.get(
                "type_description"
            ),

            "times_submitted": attributes.get(
                "times_submitted"
            ),

            "reputation": attributes.get(
                "reputation"
            ),

            "tags": attributes.get(
                "tags",
                []
            ),

        }

    except Exception as e:

        print(
            "VT HASH ERROR:",
            e
        )

        return None


# =========================================
# IP LOOKUP
# =========================================
def lookup_ip(ip: str):

    try:

        response = requests.get(

            f"{BASE_URL}/ip_addresses/{ip}",

            headers=HEADERS,

            timeout=20

        )

        print("\n===== VT IP STATUS =====")
        print(response.status_code)
        print("========================\n")

        if response.status_code != 200:

            print(response.text)

            return None

        data = response.json()

        attributes = data.get(
            "data",
            {}
        ).get(
            "attributes",
            {}
        )

        stats = attributes.get(
            "last_analysis_stats",
            {}
        )

        return {

            "source": "VirusTotal",

            "ioc_type": "ip",

            "malicious": stats.get(
                "malicious",
                0
            ),

            "suspicious": stats.get(
                "suspicious",
                0
            ),

            "harmless": stats.get(
                "harmless",
                0
            ),

            "country": attributes.get(
                "country",
                "Unknown"
            ),

            "asn": attributes.get(
                "asn",
                "Unknown"
            ),

            "as_owner": attributes.get(
                "as_owner",
                "Unknown"
            ),

            "reputation": attributes.get(
                "reputation",
                0
            ),

            "tags": attributes.get(
                "tags",
                []
            ),

        }

    except Exception as e:

        print(
            "VT IP ERROR:",
            e
        )

        return None


# =========================================
# DOMAIN LOOKUP
# =========================================
def lookup_domain(domain: str):

    try:

        response = requests.get(

            f"{BASE_URL}/domains/{domain}",

            headers=HEADERS,

            timeout=20

        )

        if response.status_code != 200:

            print(response.text)

            return None

        data = response.json()

        attributes = data.get(
            "data",
            {}
        ).get(
            "attributes",
            {}
        )

        stats = attributes.get(
            "last_analysis_stats",
            {}
        )

        return {

            "source": "VirusTotal",

            "ioc_type": "domain",

            "malicious": stats.get(
                "malicious",
                0
            ),

            "suspicious": stats.get(
                "suspicious",
                0
            ),

            "harmless": stats.get(
                "harmless",
                0
            ),

            "reputation": attributes.get(
                "reputation",
                0
            ),

            "categories": attributes.get(
                "categories",
                {}
            ),

            "tags": attributes.get(
                "tags",
                []
            ),

        }

    except Exception as e:

        print(
            "VT DOMAIN ERROR:",
            e
        )

        return None


# =========================================
# URL LOOKUP
# =========================================
def lookup_url(url: str):

    try:

        # VT requires URL ID encoding
        import base64

        url_id = base64.urlsafe_b64encode(

            url.encode()

        ).decode().strip("=")

        response = requests.get(

            f"{BASE_URL}/urls/{url_id}",

            headers=HEADERS,

            timeout=20

        )

        if response.status_code != 200:

            print(response.text)

            return None

        data = response.json()

        attributes = data.get(
            "data",
            {}
        ).get(
            "attributes",
            {}
        )

        stats = attributes.get(
            "last_analysis_stats",
            {}
        )

        return {

            "source": "VirusTotal",

            "ioc_type": "url",

            "malicious": stats.get(
                "malicious",
                0
            ),

            "suspicious": stats.get(
                "suspicious",
                0
            ),

            "harmless": stats.get(
                "harmless",
                0
            ),

            "reputation": attributes.get(
                "reputation",
                0
            ),

            "categories": attributes.get(
                "categories",
                {}
            ),

            "tags": attributes.get(
                "tags",
                []
            ),

        }

    except Exception as e:

        print(
            "VT URL ERROR:",
            e
        )

        return None