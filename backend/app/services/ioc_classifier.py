import re
import ipaddress


# =========================================
# REGEX PATTERNS
# =========================================

URL_REGEX = re.compile(

    r"^(https?:\/\/)"

    r"(([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,})"

    r"([\/\w\-\.\?\=\#\&\%\+]*)?$",

    re.IGNORECASE

)

DOMAIN_REGEX = re.compile(

    r"^(?!\-)([A-Za-z0-9\-]{1,63}\.)+[A-Za-z]{2,}$"

)

EMAIL_REGEX = re.compile(

    r"^[\w\.-]+@[\w\.-]+\.\w+$"

)

MD5_REGEX = re.compile(

    r"^[a-fA-F0-9]{32}$"

)

SHA1_REGEX = re.compile(

    r"^[a-fA-F0-9]{40}$"

)

SHA256_REGEX = re.compile(

    r"^[a-fA-F0-9]{64}$"

)


# =========================================
# IP VALIDATION
# =========================================
def is_valid_ip(ioc: str):

    try:

        ipaddress.ip_address(ioc)

        return True

    except ValueError:

        return False


# =========================================
# IOC DETECTOR
# =========================================
def detect_ioc_type(ioc: str):

    if not ioc:

        return "unknown"

    ioc = ioc.strip()

    # =========================================
    # URL
    # MUST COME BEFORE DOMAIN
    # =========================================
    if URL_REGEX.match(ioc):

        return "url"

    # =========================================
    # EMAIL
    # MUST COME BEFORE DOMAIN
    # =========================================
    if EMAIL_REGEX.match(ioc):

        return "email"

    # =========================================
    # IP (IPv4 + IPv6)
    # =========================================
    if is_valid_ip(ioc):

        return "ip"

    # =========================================
    # SHA256
    # CHECK LONGEST FIRST
    # =========================================
    if SHA256_REGEX.match(ioc):

        return "sha256"

    # =========================================
    # SHA1
    # =========================================
    if SHA1_REGEX.match(ioc):

        return "sha1"

    # =========================================
    # MD5
    # =========================================
    if MD5_REGEX.match(ioc):

        return "md5"

    # =========================================
    # DOMAIN
    # =========================================
    if DOMAIN_REGEX.match(ioc):

        return "domain"

    # =========================================
    # UNKNOWN
    # =========================================
    return "unknown"