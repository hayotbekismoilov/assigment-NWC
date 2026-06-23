from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Order, User, Product
from auth import admin_required

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats")
def get_stats(db: Session = Depends(get_db), _: User = Depends(admin_required)):
    total_sales = db.query(func.sum(Order.total)).filter(Order.status != "cancelled").scalar() or 0
    total_orders = db.query(Order).count()
    total_users = db.query(User).filter(User.role == "user").count()
    total_products = db.query(Product).count()

    # Recent orders
    recent = db.query(Order).order_by(Order.created_at.desc()).limit(5).all()
    recent_orders = []
    for o in recent:
        items_names = ", ".join([item.get("name", "") for item in (o.items or [])[:2]])
        recent_orders.append({
            "id": o.order_number,
            "customer": o.customer_name,
            "product": items_names,
            "amount": f"{o.total:,.0f}",
            "status": o.status,
            "created_at": o.created_at.isoformat() if o.created_at else None,
        })

    # Count by status
    pending_count = db.query(Order).filter(Order.status == "pending").count()
    delivered_count = db.query(Order).filter(Order.status == "delivered").count()

    return {
        "total_sales": total_sales,
        "total_orders": total_orders,
        "total_users": total_users,
        "total_products": total_products,
        "pending_orders": pending_count,
        "delivered_orders": delivered_count,
        "recent_orders": recent_orders,
    }
