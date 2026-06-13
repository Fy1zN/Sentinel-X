import re
import ipaddress
from urllib.parse import urlparse


# =========================================
# DOMAIN REGEX
# =========================================

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
# URL VALIDATION
# =========================================
def is_valid_url(ioc: str):

    try:

        result = urlparse(ioc)

        return (
            result.scheme in ["http", "https"]
            and bool(result.netloc)
        )

    except Exception:

        return False


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
    # =========================================
    if is_valid_url(ioc):

        return "url"

    # =========================================
    # EMAIL
    # =========================================
    if EMAIL_REGEX.match(ioc):

        return "email"

    # =========================================
    # IP
    # =========================================
    if is_valid_ip(ioc):

        return "ip"

    # =========================================
    # SHA256
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