from app.services.abuseipdb_service import (
    lookup_ip as abuseipdb_lookup_ip
)

from app.services.otx_service import (
    lookup_ip as otx_lookup_ip,
    lookup_domain as otx_lookup_domain,
    lookup_hash as otx_lookup_hash,
)

from app.services.ioc_classifier import (
    detect_ioc_type
)


def aggregate_ioc(ioc: str):

    ioc_type = detect_ioc_type(ioc)

    results = []

    # IP LOOKUPS
    if ioc_type == "ip":

        abuse_data = abuseipdb_lookup_ip(ioc)

        if abuse_data:
            results.append(abuse_data)

        otx_data = otx_lookup_ip(ioc)

        if otx_data:
            results.append(otx_data)

    # DOMAIN LOOKUPS
    elif ioc_type == "domain":

        otx_data = otx_lookup_domain(ioc)

        if otx_data:
            results.append(otx_data)

    # HASH LOOKUPS
    elif ioc_type in [

        "md5",
        "sha1",
        "sha256"

    ]:

        otx_data = otx_lookup_hash(ioc)

        if otx_data:
            results.append(otx_data)

    # FINAL RESPONSE
    return {

        "ioc": ioc,

        "ioc_type": ioc_type,

        "sources": results

    }