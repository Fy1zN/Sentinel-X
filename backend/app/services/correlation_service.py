from app.services.virustotal_service import (

    lookup_hash as vt_lookup_hash,

    lookup_ip as vt_lookup_ip,

    lookup_domain as vt_lookup_domain,

    lookup_url as vt_lookup_url

)

from app.services.abuseipdb_service import (
    lookup_ip as abuse_lookup_ip
)

from app.services.otx_service import (

    lookup_ip as otx_lookup_ip,

    lookup_domain as otx_lookup_domain,

    lookup_hash as otx_lookup_hash

)

from app.services.malwarebazaar_service import (
    lookup_hash as mb_lookup_hash
)

from app.services.urlhaus_service import (
    lookup_url
)


# =====================================================
# NORMALIZED FIELD RESOLUTION
# =====================================================
def resolve_field(*values):

    for value in values:

        if value not in [

            None,
            "",
            "Unknown",
            "unknown"

        ]:

            return value

    return "Unknown"


# =====================================================
# THREAT SCORE
# =====================================================
def calculate_threat_score(

    vt_data,
    abuse_data,
    otx_data,
    malware_data,
    urlhaus_data

):

    score = 0

    # =========================================
    # VIRUSTOTAL
    # =========================================
    if vt_data:

        malicious = vt_data.get(
            "malicious",
            0
        )

        suspicious = vt_data.get(
            "suspicious",
            0
        )

        reputation = vt_data.get(
            "reputation",
            0
        )

        score += malicious * 2
        score += suspicious

        if reputation < 0:

            score += abs(reputation)

    # =========================================
    # ABUSEIPDB
    # =========================================
    if abuse_data:

        score += int(

            abuse_data.get(
                "risk_score",
                0
            ) * 0.3

        )

    # =========================================
    # OTX
    # =========================================
    if otx_data:

        pulse_count = otx_data.get(
            "pulse_count",
            0
        )

        score += min(
            pulse_count,
            25
        )

    # =========================================
    # MALWAREBAZAAR
    # =========================================
    if malware_data:

        score += 20

    # =========================================
    # URLHAUS
    # =========================================
    if urlhaus_data:

        score += 15

    return min(score, 100)


# =====================================================
# MITRE MAPPING
# =====================================================
def map_mitre_techniques(text):

    text = str(text).lower()

    techniques = []

    if "powershell" in text:

        techniques.append({

            "id": "T1059",

            "name":
            "Command and Scripting Interpreter"

        })

    if "ransomware" in text:

        techniques.append({

            "id": "T1486",

            "name":
            "Data Encrypted for Impact"

        })

    if "phishing" in text:

        techniques.append({

            "id": "T1566",

            "name":
            "Phishing"

        })

    if "credential" in text:

        techniques.append({

            "id": "T1003",

            "name":
            "Credential Dumping"

        })

    if "c2" in text:

        techniques.append({

            "id": "T1071",

            "name":
            "Application Layer Protocol"

        })

    return techniques


# =====================================================
# MAIN CORRELATION ENGINE
# =====================================================
def correlate_ioc(

    ioc,
    ioc_type

):

    vt_result = None

    abuse_result = None

    otx_result = None

    malware_result = None

    urlhaus_result = None

    # =========================================
    # HASH IOC
    # =========================================
    if ioc_type in [

        "md5",
        "sha1",
        "sha256"

    ]:

        vt_result = vt_lookup_hash(
            ioc
        )

        otx_result = otx_lookup_hash(
            ioc
        )

        malware_result = mb_lookup_hash(
            ioc
        )

    # =========================================
    # IP IOC
    # =========================================
    elif ioc_type == "ip":

        vt_result = vt_lookup_ip(
            ioc
        )

        abuse_result = abuse_lookup_ip(
            ioc
        )

        otx_result = otx_lookup_ip(
            ioc
        )

    # =========================================
    # DOMAIN IOC
    # =========================================
    elif ioc_type == "domain":

        vt_result = vt_lookup_domain(
            ioc
        )

        otx_result = otx_lookup_domain(
            ioc
        )

    # =========================================
    # URL IOC
    # =========================================
    elif ioc_type == "url":

        vt_result = vt_lookup_url(
            ioc
        )

        urlhaus_result = lookup_url(
            ioc
        )

    # =========================================
    # NORMALIZED DATA
    # =========================================
    normalized_country = resolve_field(

        vt_result.get("country")
        if vt_result else None,

        abuse_result.get("country")
        if abuse_result else None,

        otx_result.get("country")
        if otx_result else None

    )

    normalized_domain = resolve_field(

        vt_result.get("domain")
        if vt_result else None,

        abuse_result.get("domain")
        if abuse_result else None

    )

    normalized_isp = resolve_field(

        abuse_result.get("isp")
        if abuse_result else None,

        vt_result.get("as_owner")
        if vt_result else None

    )

    normalized_asn = resolve_field(

        otx_result.get("asn")
        if otx_result else None,

        vt_result.get("asn")
        if vt_result else None

    )

    normalized_usage_type = resolve_field(

        abuse_result.get("usage_type")
        if abuse_result else None

    )

    # =========================================
    # COMBINED TEXT
    # =========================================
    combined_text = f"""

    {vt_result}

    {abuse_result}

    {otx_result}

    {malware_result}

    {urlhaus_result}

    """

    mitre = map_mitre_techniques(
        combined_text
    )

    # =========================================
    # THREAT SCORE
    # =========================================
    final_score = calculate_threat_score(

        vt_result,
        abuse_result,
        otx_result,
        malware_result,
        urlhaus_result

    )

    # =========================================
    # SEVERITY
    # =========================================
    if final_score >= 85:

        severity = "critical"

    elif final_score >= 65:

        severity = "high"

    elif final_score >= 40:

        severity = "medium"

    else:

        severity = "low"

    # =========================================
    # FINAL RESPONSE
    # =========================================
    return {

        "ioc": ioc,

        "ioc_type": ioc_type,

        "severity": severity,

        "threat_score": final_score,

        "country": normalized_country,

        "domain": normalized_domain,

        "isp": normalized_isp,

        "asn": normalized_asn,

        "usage_type": normalized_usage_type,

        "virustotal": vt_result,

        "abuseipdb": abuse_result,

        "otx": otx_result,

        "malwarebazaar": malware_result,

        "urlhaus": urlhaus_result,

        "mitre_attack": mitre

    }