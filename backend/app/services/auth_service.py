from sqlalchemy.orm import Session

from app.models.user import User

from app.auth.password_handler import (
    hash_password,
    verify_password
)

from app.auth.jwt_handler import (
    create_access_token
)


def register_user(
    db: Session,
    username: str,
    email: str,
    password: str
):

    existing_user = db.query(User).filter(
        User.username == username
    ).first()

    if existing_user:
        return {
            "error": "Username already exists"
        }

    hashed_password = hash_password(password)

    new_user = User(
        username=username,
        email=email,
        password=hashed_password
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }


def login_user(
    db: Session,
    username: str,
    password: str
):

    user = db.query(User).filter(
        User.username == username
    ).first()

    if not user:
        return {
            "error": "User not found"
        }

    if not verify_password(
        password,
        user.password
    ):
        return {
            "error": "Invalid credentials"
        }

    token = create_access_token(
        {"sub": user.username}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }