import os
import requests

from dotenv import load_dotenv

load_dotenv()

OTX_API_KEY = os.getenv(
    "OTX_API_KEY"
)

HEADERS = {
    "X-OTX-API-KEY": OTX_API_KEY
}


# IP LOOKUP
def lookup_ip(ip: str):

    try:

        url = (
            f"https://otx.alienvault.com/api/v1/indicators/IPv4/{ip}/general"
        )

        response = requests.get(
            url,
            headers=HEADERS,
            timeout=10
        )

        if response.status_code != 200:
            return None

        data = response.json()

        return {

            "source": "AlienVault OTX",

            "ioc": ip,

            "ioc_type": "ip",

            "pulse_count": len(
                data.get(
                    "pulse_info",
                    {}
                ).get(
                    "pulses",
                    []
                )
            ),

            "country": data.get(
                "country_name",
                "Unknown"
            ),

            "reputation": data.get(
                "reputation",
                0
            ),

            "asn": data.get(
                "asn",
                "Unknown"
            ),

        }

    except Exception as e:

        print(
            "OTX IP ERROR:",
            e
        )

        return None


# DOMAIN LOOKUP
def lookup_domain(domain: str):

    try:

        url = (
            f"https://otx.alienvault.com/api/v1/indicators/domain/{domain}/general"
        )

        response = requests.get(
            url,
            headers=HEADERS,
            timeout=10
        )

        if response.status_code != 200:
            return None

        data = response.json()

        return {

            "source": "AlienVault OTX",

            "ioc": domain,

            "ioc_type": "domain",

            "pulse_count": len(
                data.get(
                    "pulse_info",
                    {}
                ).get(
                    "pulses",
                    []
                )
            ),

            "country": data.get(
                "country_name",
                "Unknown"
            ),

            "alexa": data.get(
                "alexa",
                "Unknown"
            ),

        }

    except Exception as e:

        print(
            "OTX DOMAIN ERROR:",
            e
        )

        return None


# HASH LOOKUP
def lookup_hash(file_hash: str):

    try:

        url = (
            f"https://otx.alienvault.com/api/v1/indicators/file/{file_hash}/general"
        )

        response = requests.get(
            url,
            headers=HEADERS,
            timeout=10
        )

        if response.status_code != 200:
            return None

        data = response.json()

        return {

            "source": "AlienVault OTX",

            "ioc": file_hash,

            "ioc_type": "hash",

            "pulse_count": len(
                data.get(
                    "pulse_info",
                    {}
                ).get(
                    "pulses",
                    []
                )
            ),

            "malware_families": data.get(
                "malware_families",
                []
            ),

        }

    except Exception as e:

        print(
            "OTX HASH ERROR:",
            e
        )

        return None