
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.auth.dependencies import get_current_user

from app.models.user import User
from app.models.watchlist import Watchlist

router = APIRouter(
    prefix="/watchlist",
    tags=["Watchlist"]
)


# =====================================================
# DATABASE DEPENDENCY
# =====================================================
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# =====================================================
# GET ALL WATCHLIST ITEMS
# =====================================================
@router.get("/")
def get_watchlist(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:
        return []

    watchlist = db.query(Watchlist).filter(
        Watchlist.user_id == user.id
    ).order_by(
        Watchlist.created_at.desc()
    ).all()

    return watchlist


# =====================================================
# ADD WATCHLIST ITEM
# =====================================================
@router.post("/add")
def add_watchlist_item(
    payload: dict,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:
        return {
            "success": False,
            "message": "User not found"
        }

    existing = db.query(Watchlist).filter(
        Watchlist.user_id == user.id,
        Watchlist.ioc == payload.get("ioc")
    ).first()

    if existing:

        return {
            "success": False,
            "message": "IOC already exists in watchlist"
        }

    item = Watchlist(

        user_id=user.id,

        ioc=payload.get("ioc"),

        ioc_type=payload.get("ioc_type"),

        severity=payload.get(
            "severity",
            "medium"
        ),

        notes=payload.get(
            "notes",
            ""
        ),

        is_active=True

    )

    db.add(item)

    db.commit()

    db.refresh(item)

    return {
        "success": True,
        "message": "IOC added to watchlist",
        "data": item
    }


# =====================================================
# DELETE WATCHLIST ITEM
# =====================================================
@router.delete("/{watchlist_id}")
def delete_watchlist_item(
    watchlist_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:
        return {
            "success": False
        }

    item = db.query(Watchlist).filter(
        Watchlist.id == watchlist_id,
        Watchlist.user_id == user.id
    ).first()

    if not item:

        return {
            "success": False,
            "message": "Watchlist item not found"
        }

    db.delete(item)

    db.commit()

    return {
        "success": True,
        "message": "Watchlist item deleted"
    }


# =====================================================
# TOGGLE WATCHLIST STATUS
# =====================================================
@router.put("/{watchlist_id}")
def toggle_watchlist_item(
    watchlist_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:
        return {
            "success": False
        }

    item = db.query(Watchlist).filter(
        Watchlist.id == watchlist_id,
        Watchlist.user_id == user.id
    ).first()

    if not item:

        return {
            "success": False,
            "message": "Watchlist item not found"
        }

    item.is_active = not item.is_active

    db.commit()

    db.refresh(item)

    return {
        "success": True,
        "message": "Watchlist updated",
        "data": item
    }


# =====================================================
# CHECK IOC AGAINST WATCHLIST
# =====================================================
@router.post("/check")
def check_watchlist_match(
    payload: dict,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    ioc = payload.get("ioc")

    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:
        return {
            "matched": False
        }

    item = db.query(Watchlist).filter(
        Watchlist.user_id == user.id,
        Watchlist.ioc == ioc,
        Watchlist.is_active == True
    ).first()

    if not item:

        return {
            "matched": False
        }

    return {

        "matched": True,

        "watchlist_item": {

            "ioc": item.ioc,

            "ioc_type": item.ioc_type,

            "severity": item.severity,

            "notes": item.notes

        }

    }

