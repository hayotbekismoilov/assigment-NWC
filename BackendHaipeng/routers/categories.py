from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Category, Product, User
from schemas import CategoryCreate, CategoryUpdate
from auth import admin_required

router = APIRouter(prefix="/api/categories", tags=["Categories"])


@router.get("")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    result = []
    for cat in categories:
        count = db.query(Product).filter(Product.category_id == cat.id).count()
        result.append({
            "id": cat.id,
            "name": cat.name,
            "nameUz": cat.name_uz,
            "description": cat.description,
            "image": cat.image,
            "count": count,
        })
    return result


@router.get("/{category_id}")
def get_category(category_id: str, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Kategoriya topilmadi")

    count = db.query(Product).filter(Product.category_id == cat.id).count()
    return {
        "id": cat.id,
        "name": cat.name,
        "nameUz": cat.name_uz,
        "description": cat.description,
        "image": cat.image,
        "count": count,
    }


@router.post("")
def create_category(data: CategoryCreate, db: Session = Depends(get_db), _: User = Depends(admin_required)):
    existing = db.query(Category).filter(Category.id == data.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bu ID allaqachon mavjud")

    cat = Category(
        id=data.id, name=data.name, name_uz=data.name_uz,
        description=data.description, image=data.image,
    )
    db.add(cat)
    db.commit()
    return {"id": cat.id, "name": cat.name, "nameUz": cat.name_uz,
            "description": cat.description, "image": cat.image, "count": 0}


@router.put("/{category_id}")
def update_category(category_id: str, data: CategoryUpdate, db: Session = Depends(get_db), _: User = Depends(admin_required)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Kategoriya topilmadi")

    update_data = data.model_dump(exclude_unset=True)
    if "name_uz" in update_data:
        cat.name_uz = update_data.pop("name_uz")
    for key, value in update_data.items():
        setattr(cat, key, value)

    db.commit()
    count = db.query(Product).filter(Product.category_id == cat.id).count()
    return {"id": cat.id, "name": cat.name, "nameUz": cat.name_uz,
            "description": cat.description, "image": cat.image, "count": count}


@router.delete("/{category_id}")
def delete_category(category_id: str, db: Session = Depends(get_db), _: User = Depends(admin_required)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Kategoriya topilmadi")

    products_count = db.query(Product).filter(Product.category_id == category_id).count()
    if products_count > 0:
        raise HTTPException(status_code=400, detail=f"Bu kategoriyada {products_count} ta mahsulot bor. Avval ularni o'chiring.")

    db.delete(cat)
    db.commit()
    return {"success": True, "message": "Kategoriya o'chirildi"}
