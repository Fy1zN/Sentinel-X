import os
import requests

from dotenv import load_dotenv

load_dotenv()


# =====================================================
# CONFIG
# =====================================================
URLHAUS_HOST_API = (
    "https://urlhaus-api.abuse.ch/v1/host/"
)

URLHAUS_API_KEY = os.getenv(
    "URLHAUS_API_KEY"
)


# =====================================================
# URL LOOKUP
# =====================================================
def lookup_url(url: str):

    try:

        # =========================================
        # EXTRACT HOST
        # =========================================
        host = (
            url
            .replace("https://", "")
            .replace("http://", "")
            .split("/")[0]
        )

        print("\n========== URLHAUS LOOKUP ==========")
        print("URL:", url)
        print("HOST:", host)
        print("====================================\n")

        # =========================================
        # REQUEST
        # =========================================
        response = requests.post(

            URLHAUS_HOST_API,

            data={
                "host": host
            },

            headers={

                "Auth-Key": URLHAUS_API_KEY

            },

            timeout=20

        )

        print("\n========== URLHAUS RESPONSE ==========")
        print("STATUS:", response.status_code)
        print(response.text[:3000])
        print("======================================\n")

        # =========================================
        # NON-200
        # =========================================
        if response.status_code != 200:

            print("NON-200 STATUS")

            return None

        # =========================================
        # JSON PARSE
        # =========================================
        try:

            data = response.json()

        except Exception as json_error:

            print("JSON PARSE ERROR:")
            print(str(json_error))

            return None

        # =========================================
        # QUERY STATUS
        # =========================================
        if data.get("query_status") != "ok":

            print("URL NOT FOUND IN URLHAUS")

            return None

        # =========================================
        # URL RESULTS
        # =========================================
        urls = data.get(
            "urls",
            []
        )

        if not urls:

            print("NO URL RESULTS FOUND")

            return None

        latest = urls[0]

        print("\n========== URLHAUS HIT ==========")
        print(latest)
        print("=================================\n")

        # =========================================
        # NORMALIZED RESPONSE
        # =========================================
        return {

            "source": "URLHaus",

            "host": host,

            "query_status": data.get(
                "query_status"
            ),

            "url_status": latest.get(
                "url_status"
            ),

            "threat": latest.get(
                "threat"
            ),

            "tags": latest.get(
                "tags",
                []
            ),

            "urlhaus_reference": latest.get(
                "urlhaus_reference"
            ),

            "reporter": latest.get(
                "reporter"
            ),

            "date_added": latest.get(
                "date_added"
            ),

            "larted": latest.get(
                "larted"
            ),

            "payloads": latest.get(
                "payloads",
                []
            ),

            "blacklists": latest.get(
                "blacklists",
                {}
            ),

            "host_info": {

                "host": latest.get(
                    "host"
                ),

                "port": latest.get(
                    "port"
                ),

                "scheme": latest.get(
                    "scheme"
                )

            }

        }

    except Exception as e:

        print(
            "\n========== URLHAUS ERROR =========="
        )

        print(str(e))

        print(
            "===================================\n"
        )

        return None