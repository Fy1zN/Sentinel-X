import os
import requests

from dotenv import load_dotenv

from datetime import datetime, timedelta

load_dotenv()


NVD_API_URL = (
    "https://services.nvd.nist.gov/rest/json/cves/2.0"
)


HEADERS = {

    "apiKey": os.getenv(
        "NVD_API_KEY"
    )

}


# SEARCH SINGLE CVE
def search_cve(cve_id: str):

    try:

        response = requests.get(

            NVD_API_URL,

            headers=HEADERS,

            params={

                "cveId": cve_id

            },

            timeout=20

        )

        print("\n========== NVD SEARCH ==========")
        print("STATUS:", response.status_code)
        print("================================\n")

        if response.status_code != 200:

            print("FAILED RESPONSE:")
            print(response.text)

            return None

        data = response.json()

        vulnerabilities = data.get(
            "vulnerabilities",
            []
        )

        if not vulnerabilities:

            print("NO CVE FOUND")

            return None

        cve_data = vulnerabilities[0].get(
            "cve",
            {}
        )

        # DESCRIPTION
        description = ""

        descriptions = cve_data.get(
            "descriptions",
            []
        )

        for item in descriptions:

            if item.get("lang") == "en":

                description = item.get(
                    "value",
                    ""
                )

                break

        # CVSS EXTRACTION
        cvss_score = 0
        severity = "LOW"

        metrics = cve_data.get(
            "metrics",
            {}
        )

        if "cvssMetricV31" in metrics:

            cvss = metrics[
                "cvssMetricV31"
            ][0]

            cvss_data = cvss.get(
                "cvssData",
                {}
            )

            cvss_score = cvss_data.get(
                "baseScore",
                0
            )

            severity = cvss_data.get(
                "baseSeverity",
                "LOW"
            )

        elif "cvssMetricV30" in metrics:

            cvss = metrics[
                "cvssMetricV30"
            ][0]

            cvss_data = cvss.get(
                "cvssData",
                {}
            )

            cvss_score = cvss_data.get(
                "baseScore",
                0
            )

            severity = cvss_data.get(
                "baseSeverity",
                "LOW"
            )

        elif "cvssMetricV2" in metrics:

            cvss = metrics[
                "cvssMetricV2"
            ][0]

            cvss_data = cvss.get(
                "cvssData",
                {}
            )

            cvss_score = cvss_data.get(
                "baseScore",
                0
            )

            severity = cvss.get(
                "baseSeverity",
                "LOW"
            )

        # CWE EXTRACTION
        cwe_list = []

        weaknesses = cve_data.get(
            "weaknesses",
            []
        )

        for weakness in weaknesses:

            descriptions = weakness.get(
                "description",
                []
            )

            for desc in descriptions:

                value = desc.get(
                    "value"
                )

                if value:

                    cwe_list.append(value)

        # REFERENCES
        references = []

        refs = cve_data.get(
            "references",
            []
        )

        for ref in refs:

            url = ref.get("url")

            if url:

                references.append(url)

        # AFFECTED PRODUCTS
        affected_products = []

        configurations = cve_data.get(
            "configurations",
            []
        )

        for config in configurations:

            nodes = config.get(
                "nodes",
                []
            )

            for node in nodes:

                cpe_matches = node.get(
                    "cpeMatch",
                    []
                )

                for cpe in cpe_matches:

                    criteria = cpe.get(
                        "criteria"
                    )

                    if criteria:

                        affected_products.append(
                            criteria
                        )

        result = {

            "cve_id": cve_id,

            "description": description,

            "cvss_score": cvss_score,

            "severity": severity,

            "published": cve_data.get(
                "published"
            ),

            "last_modified": cve_data.get(
                "lastModified"
            ),

            "cwe": cwe_list,

            "references": references,

            "affected_products": affected_products,

        }

        print("\n========== CVE RESULT ==========")
        print(result)
        print("================================\n")

        return result

    except Exception as e:

        print(
            "\n========== CVE ERROR =========="
        )

        print(str(e))

        print(
            "================================\n"
        )

        return None


# GET RECENT CVES
def get_recent_cves():

    try:

        end_date = datetime.utcnow()

        start_date = end_date - timedelta(days=30)

        response = requests.get(

            NVD_API_URL,

            headers=HEADERS,

            params={

                "resultsPerPage": 10,

                "startIndex": 0,

                "pubStartDate":
                    start_date.strftime(
                        "%Y-%m-%dT%H:%M:%S.000"
                    ) + "Z",

                "pubEndDate":
                    end_date.strftime(
                        "%Y-%m-%dT%H:%M:%S.000"
                    ) + "Z",

            },

            timeout=20

        )

        print("\n========== RECENT CVES ==========")
        print("STATUS:", response.status_code)
        print("=================================\n")

        if response.status_code != 200:

            print("FAILED RESPONSE:")
            print(response.text)

            return []

        data = response.json()

        vulnerabilities = data.get(
            "vulnerabilities",
            []
        )

        print(
            f"TOTAL VULNS: {len(vulnerabilities)}"
        )

        results = []

        for item in vulnerabilities:

            cve = item.get(
                "cve",
                {}
            )

            cve_id = cve.get(
                "id",
                "UNKNOWN"
            )

            metrics = cve.get(
                "metrics",
                {}
            )

            score = 0
            severity = "LOW"

            if "cvssMetricV31" in metrics:

                cvss_data = metrics[
                    "cvssMetricV31"
                ][0].get(
                    "cvssData",
                    {}
                )

                score = cvss_data.get(
                    "baseScore",
                    0
                )

                severity = cvss_data.get(
                    "baseSeverity",
                    "LOW"
                )

            elif "cvssMetricV30" in metrics:

                cvss_data = metrics[
                    "cvssMetricV30"
                ][0].get(
                    "cvssData",
                    {}
                )

                score = cvss_data.get(
                    "baseScore",
                    0
                )

                severity = cvss_data.get(
                    "baseSeverity",
                    "LOW"
                )

            elif "cvssMetricV2" in metrics:

                cvss_data = metrics[
                    "cvssMetricV2"
                ][0].get(
                    "cvssData",
                    {}
                )

                score = cvss_data.get(
                    "baseScore",
                    0
                )

                severity = metrics[
                    "cvssMetricV2"
                ][0].get(
                    "baseSeverity",
                    "LOW"
                )

            # DESCRIPTION
            description = ""

            descriptions = cve.get(
                "descriptions",
                []
            )

            for desc in descriptions:

                if desc.get("lang") == "en":

                    description = desc.get(
                        "value",
                        ""
                    )

                    break

            # CWE
            cwe_list = []

            weaknesses = cve.get(
                "weaknesses",
                []
            )

            for weakness in weaknesses:

                weakness_descriptions = weakness.get(
                    "description",
                    []
                )

                for desc in weakness_descriptions:

                    value = desc.get(
                        "value"
                    )

                    if value:

                        cwe_list.append(value)

            # REFERENCES
            references = []

            refs = cve.get(
                "references",
                []
            )

            for ref in refs:

                url = ref.get("url")

                if url:

                    references.append(url)

            # PRODUCTS
            affected_products = []

            configurations = cve.get(
                "configurations",
                []
            )

            for config in configurations:

                nodes = config.get(
                    "nodes",
                    []
                )

                for node in nodes:

                    cpe_matches = node.get(
                        "cpeMatch",
                        []
                    )

                    for cpe in cpe_matches:

                        criteria = cpe.get(
                            "criteria"
                        )

                        if criteria:

                            affected_products.append(
                                criteria
                            )

            results.append({

                "cve_id": cve_id,

                "description": description,

                "cvss_score": score,

                "severity": severity,

                "published": cve.get(
                    "published"
                ),

                "last_modified": cve.get(
                    "lastModified"
                ),

                "cwe": cwe_list,

                "references": references,

                "affected_products": affected_products

            })

        print(
            f"\nFINAL RESULTS: {len(results)}"
        )

        return results

    except Exception as e:

        print(
            "\n========== RECENT CVE ERROR =========="
        )

        print(str(e))

        print(
            "=======================================\n"
        )

        return []