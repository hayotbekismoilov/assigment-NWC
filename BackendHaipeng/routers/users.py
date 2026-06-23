from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import User
from auth import admin_required

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("")
def get_users(
    search: str = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = 0,
    db: Session = Depends(get_db),
    _: User = Depends(admin_required),
):
    q = db.query(User)
    if search:
        q = q.filter(
            (User.full_name.ilike(f"%{search}%")) |
            (User.email.ilike(f"%{search}%")) |
            (User.phone.ilike(f"%{search}%"))
        )

    q = q.order_by(User.created_at.desc())
    total = q.count()
    users = q.offset(offset).limit(limit).all()

    return {
        "total": total,
        "items": [_user_to_dict(u) for u in users],
    }


@router.get("/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db), _: User = Depends(admin_required)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Foydalanuvchi topilmadi")
    return _user_to_dict(user)


@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), _: User = Depends(admin_required)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Foydalanuvchi topilmadi")
    if user.role == "admin":
        raise HTTPException(status_code=400, detail="Admin foydalanuvchini o'chirib bo'lmaydi")

    db.delete(user)
    db.commit()
    return {"success": True, "message": "Foydalanuvchi o'chirildi"}


def _user_to_dict(u: User) -> dict:
    return {
        "id": u.id,
        "username": u.username,
        "role": u.role,
        "full_name": u.full_name,
        "email": u.email,
        "phone": u.phone,
        "total_spent": u.total_spent or 0,
        "orders_count": u.orders_count or 0,
        "last_active": u.last_active.isoformat() if u.last_active else None,
        "created_at": u.created_at.isoformat() if u.created_at else None,
    }
