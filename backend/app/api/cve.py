from fastapi import (
    APIRouter,
    HTTPException,
    Query
)

from app.services.cve_service import (
    search_cve,
    get_recent_cves
)

router = APIRouter(
    prefix="/cve",
    tags=["CVE Intelligence"]
)


# SEARCH CVE
@router.get("/search")
def search_cve_route(

    cve_id: str = Query(...)

):

    print("\n========== SEARCHING CVE ==========")
    print(cve_id)
    print("===================================\n")

    result = search_cve(cve_id)

    if not result:

        raise HTTPException(

            status_code=404,

            detail="CVE not found"

        )

    return result


# RECENT CVES
@router.get("/recent")
def recent_cves_route():

    print(
        "\n========== FETCHING RECENT CVES ==========\n"
    )

    results = get_recent_cves()

    return {

        "count": len(results),

        "results": results

    }