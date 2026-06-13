from app.services.abuseipdb_service import (
    lookup_ip as abuseipdb_lookup_ip
)

from app.services.otx_service import (
    lookup_ip as otx_lookup_ip,
    lookup_domain as otx_lookup_domain,
    lookup_hash as otx_lookup_hash,
)

from app.services.virustotal_service import (
    lookup_ip as vt_lookup_ip,
    lookup_domain as vt_lookup_domain,
    lookup_hash as vt_lookup_hash,
)

from app.services.malwarebazaar_service import (
    lookup_hash as malwarebazaar_lookup_hash,
)

from app.services.urlhaus_service import (
    lookup_url as urlhaus_lookup_url,
)

from app.services.ioc_classifier import (
    detect_ioc_type
)


def aggregate_ioc(ioc: str):

    ioc_type = detect_ioc_type(ioc)

    results = []

    print("\n========== IOC AGGREGATOR ==========")
    print("IOC:", ioc)
    print("TYPE:", ioc_type)
    print("====================================\n")

    # =====================================================
    # IP LOOKUPS
    # =====================================================
    if ioc_type == "ip":

        abuse_data = abuseipdb_lookup_ip(ioc)

        if abuse_data:
            results.append(abuse_data)

        otx_data = otx_lookup_ip(ioc)

        if otx_data:
            results.append(otx_data)

        vt_data = vt_lookup_ip(ioc)

        if vt_data:
            results.append(vt_data)

    # =====================================================
    # DOMAIN LOOKUPS
    # =====================================================
    elif ioc_type == "domain":

        otx_data = otx_lookup_domain(ioc)

        if otx_data:
            results.append(otx_data)

        vt_data = vt_lookup_domain(ioc)

        if vt_data:
            results.append(vt_data)

    # =====================================================
    # URL LOOKUPS
    # =====================================================
    elif ioc_type == "url":

        urlhaus_data = urlhaus_lookup_url(ioc)

        if urlhaus_data:
            results.append(urlhaus_data)

    # =====================================================
    # HASH LOOKUPS
    # =====================================================
    elif ioc_type in [

        "md5",
        "sha1",
        "sha256"

    ]:

        otx_data = otx_lookup_hash(ioc)

        if otx_data:
            results.append(otx_data)

        vt_data = vt_lookup_hash(ioc)

        if vt_data:
            results.append(vt_data)

        malwarebazaar_data = malwarebazaar_lookup_hash(ioc)

        if malwarebazaar_data:
            results.append(malwarebazaar_data)

    print("\n========== AGGREGATION COMPLETE ==========")
    print("TOTAL SOURCES:", len(results))
    print(results)
    print("==========================================\n")

    return {

        "ioc": ioc,

        "ioc_type": ioc_type,

        "sources": results

    }