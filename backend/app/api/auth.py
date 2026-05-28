from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from fastapi.security import (
    OAuth2PasswordRequestForm
)

from sqlalchemy.orm import Session

from pydantic import BaseModel

from app.database.connection import SessionLocal
from app.models.user import User

from app.auth.password_handler import (
    hash_password,
    verify_password
)

from app.auth.jwt_handler import (
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# DATABASE SESSION
def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# REGISTER REQUEST MODEL
class RegisterRequest(BaseModel):
    username: str
    password: str


# REGISTER ROUTE
@router.post("/register")
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):

    # CHECK IF USER EXISTS
    existing_user = (
        db.query(User)
        .filter(
            User.username == request.username
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    # HASH PASSWORD
    hashed_pw = hash_password(
        request.password
    )

    # CREATE USER
    new_user = User(
        username=request.username,
        password=hashed_pw
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message":
        "User registered successfully"
    }


# LOGIN ROUTE
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    # FIND USER
    user = (
        db.query(User)
        .filter(
            User.username == form_data.username
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username"
        )

    # VERIFY PASSWORD
    valid_password = verify_password(
        form_data.password,
        user.password
    )

    if not valid_password:
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    # CREATE JWT TOKEN
    token = create_access_token(
        data={
            "sub": user.username
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }