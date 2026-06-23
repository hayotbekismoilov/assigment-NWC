from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import LoginRequest, TokenResponse
from auth import verify_password, create_access_token, admin_required

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Login yoki parol noto'g'ri")

    token = create_access_token({"sub": user.username, "role": user.role})
    return TokenResponse(
        access_token=token,
        user={
            "id": user.id,
            "username": user.username,
            "role": user.role,
            "full_name": user.full_name,
        },
    )


@router.get("/me")
def get_me(user: User = Depends(admin_required)):
    return {
        "id": user.id,
        "username": user.username,
        "role": user.role,
        "full_name": user.full_name,
    }
