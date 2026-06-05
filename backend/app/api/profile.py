from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


# DATABASE SESSION
def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# GET PROFILE
@router.get("/")
def get_profile(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.username == current_user)
        .first()
    )

    if not user:
        return {
            "error": "User not found"
        }

    return {
        "username": user.username
    }