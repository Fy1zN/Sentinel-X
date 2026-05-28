from sqlalchemy.orm import Session

from app.models.ioc_history import IOCHistory
from app.models.user import User


def save_ioc_search(
    db: Session,
    username: str,
    ioc: str,
    ioc_type: str,
    risk_score: int,
    status: str,
    country: str
):
    # Find user
    user = db.query(User).filter(
        User.username == username
    ).first()

    if not user:
        return None

    # Create IOC History Object
    new_search = IOCHistory(
        user_id=user.id,
        ioc=ioc,
        ioc_type=ioc_type,
        risk_score=risk_score,
        status=status,
        country=country
    )

    # Save to DB
    db.add(new_search)
    db.commit()
    db.refresh(new_search)

    return new_search