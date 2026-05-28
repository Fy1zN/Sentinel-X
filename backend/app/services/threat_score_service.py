def calculate_threat_score(

    ioc_type,
    abuse_score=0,
    pulse_count=0,
    malwarebazaar_hit=False,
    urlhaus_hit=False

):

    score = 0

    # BASE IOC TYPE WEIGHT
    if ioc_type == "ip":
        score += 20

    elif ioc_type == "domain":
        score += 25

    elif ioc_type == "url":
        score += 35

    elif ioc_type in [
        "md5",
        "sha1",
        "sha256"
    ]:
        score += 40

    # ABUSEIPDB
    score += min(abuse_score, 40)

    # OTX PULSES
    score += min(
        pulse_count * 2,
        30
    )

    # MALWAREBAZAAR
    if malwarebazaar_hit:
        score += 25

    # URLHAUS
    if urlhaus_hit:
        score += 25

    # LIMIT
    if score > 100:
        score = 100

    # SEVERITY
    if score >= 90:
        severity = "critical"

    elif score >= 70:
        severity = "high"

    elif score >= 40:
        severity = "medium"

    else:
        severity = "low"

    return {

        "final_score": score,

        "severity": severity

    }