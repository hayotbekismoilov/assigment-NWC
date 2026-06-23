from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from database import get_db
from models import Product, User
from schemas import ProductCreate, ProductUpdate, ProductResponse
from auth import admin_required

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.get("")
def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort: str = "newest",
    in_stock: Optional[bool] = None,
    min_price: float = 0,
    max_price: float = 999999999,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    featured: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Product)

    if category and category != "all":
        q = q.filter(Product.category_id == category)
    if search:
        q = q.filter(
            (Product.name.ilike(f"%{search}%")) | (Product.brand.ilike(f"%{search}%"))
        )
    if in_stock is not None:
        q = q.filter(Product.in_stock == in_stock)
    q = q.filter(Product.price >= min_price, Product.price <= max_price)

    if featured:
        featured_ids = ["hp-001", "hp-002", "hp-003", "hp-004", "hp-005", "hp-008"]
        q = q.filter(Product.id.in_(featured_ids))

    if sort == "price-asc":
        q = q.order_by(Product.price.asc())
    elif sort == "price-desc":
        q = q.order_by(Product.price.desc())
    elif sort == "rating":
        q = q.order_by(Product.rating.desc())
    else:
        q = q.order_by(Product.created_at.desc())

    total = q.count()
    products = q.offset(offset).limit(limit).all()

    return {
        "total": total,
        "items": [_product_to_dict(p) for p in products],
    }


@router.get("/{product_id}")
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")

    # Related products (same category, exclude current)
    related = (
        db.query(Product)
        .filter(Product.category_id == product.category_id, Product.id != product.id)
        .limit(4)
        .all()
    )

    return {
        "product": _product_to_dict(product),
        "related": [_product_to_dict(p) for p in related],
    }


@router.post("")
def create_product(data: ProductCreate, db: Session = Depends(get_db), _: User = Depends(admin_required)):
    existing = db.query(Product).filter(Product.id == data.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bu ID allaqachon mavjud")

    product = Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return _product_to_dict(product)


@router.put("/{product_id}")
def update_product(product_id: str, data: ProductUpdate, db: Session = Depends(get_db), _: User = Depends(admin_required)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return _product_to_dict(product)


@router.delete("/{product_id}")
def delete_product(product_id: str, db: Session = Depends(get_db), _: User = Depends(admin_required)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")

    db.delete(product)
    db.commit()
    return {"success": True, "message": "Mahsulot o'chirildi"}


def _product_to_dict(p: Product) -> dict:
    return {
        "id": p.id,
        "name": p.name,
        "brand": p.brand,
        "category": p.category_id,
        "price": p.price,
        "oldPrice": p.old_price,
        "image": p.image,
        "images": p.images or [],
        "badge": p.badge,
        "description": p.description,
        "specs": p.specs or {},
        "inStock": p.in_stock,
        "rating": p.rating,
        "reviewCount": p.review_count,
        "colors": p.colors or [],
    }
