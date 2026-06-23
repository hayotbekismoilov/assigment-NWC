from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from database import get_db
from models import Order, User
from schemas import OrderCreate, OrderStatusUpdate
from auth import admin_required
from telegram import send_order_to_telegram
from datetime import datetime
import random

router = APIRouter(prefix="/api/orders", tags=["Orders"])


def _generate_order_number():
    return f"#ORD-{random.randint(1000, 9999)}"


@router.post("")
async def create_order(data: OrderCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Public endpoint — buyurtma yaratish (checkout)"""
    total = sum(item.price * item.quantity for item in data.items)

    order = Order(
        order_number=_generate_order_number(),
        customer_name=data.customer_name,
        customer_phone=data.customer_phone,
        address=data.address or "",
        delivery_type=data.delivery_type,
        payment_method=data.payment_method or "cash",
        comment=data.comment or "",
        status="pending",
        total=total,
        items=[item.model_dump() for item in data.items],
    )
    db.add(order)

    # Create or update user
    user = db.query(User).filter(User.phone == data.customer_phone).first()
    if not user:
        user = User(
            username=data.customer_phone.replace("+", "").replace(" ", ""),
            password_hash="no-login",
            role="user",
            full_name=data.customer_name,
            phone=data.customer_phone,
            total_spent=total,
            orders_count=1,
        )
        db.add(user)
    else:
        user.total_spent = (user.total_spent or 0) + total
        user.orders_count = (user.orders_count or 0) + 1
        user.last_active = datetime.utcnow()

    db.commit()
    db.refresh(order)

    # Send to Telegram in background
    order_data = _order_to_dict(order)
    background_tasks.add_task(send_order_to_telegram, db, order_data)

    return {
        "success": True,
        "order_number": order.order_number,
        "message": "Buyurtma qabul qilindi!",
    }


@router.get("")
def get_orders(
    status: str = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = 0,
    db: Session = Depends(get_db),
    _: User = Depends(admin_required),
):
    q = db.query(Order)
    if status:
        q = q.filter(Order.status == status)
    q = q.order_by(Order.created_at.desc())

    total = q.count()
    orders = q.offset(offset).limit(limit).all()

    return {
        "total": total,
        "items": [_order_to_dict(o) for o in orders],
    }


@router.get("/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db), _: User = Depends(admin_required)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Buyurtma topilmadi")
    return _order_to_dict(order)


@router.put("/{order_id}/status")
def update_order_status(
    order_id: int,
    data: OrderStatusUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(admin_required),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Buyurtma topilmadi")

    valid_statuses = ["pending", "paid", "delivered", "cancelled"]
    if data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status {valid_statuses} dan biri bo'lishi kerak")

    order.status = data.status
    db.commit()
    return _order_to_dict(order)


def _order_to_dict(o: Order) -> dict:
    return {
        "id": o.id,
        "order_number": o.order_number,
        "customer_name": o.customer_name,
        "customer_phone": o.customer_phone,
        "address": o.address,
        "delivery_type": o.delivery_type,
        "payment_method": o.payment_method,
        "comment": o.comment,
        "status": o.status,
        "total": o.total,
        "items": o.items or [],
        "items_count": len(o.items or []),
        "created_at": o.created_at.isoformat() if o.created_at else None,
    }
