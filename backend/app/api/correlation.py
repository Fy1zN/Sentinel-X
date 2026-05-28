from fastapi import APIRouter

from app.services.correlation_service import (
    correlate_ioc
)

router = APIRouter(

    prefix="/correlation",

    tags=["Threat Correlation"]

)


@router.post("/analyze")
def analyze_ioc(

    ioc: str,
    ioc_type: str

):

    result = correlate_ioc(

        ioc,
        ioc_type

    )

    return result