from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import HeroSlide, User
from auth import admin_required
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/slides", tags=["Slides"])


class SlideCreate(BaseModel):
    title: str
    subtitle: str = ""
    eyebrow: str = ""
    image: str
    button_text: str = "Batafsil"
    button_link: str = "/catalog"
    color: str = "#FF4C00"
    display_order: int = 0
    is_active: bool = True


class SlideUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    eyebrow: Optional[str] = None
    image: Optional[str] = None
    button_text: Optional[str] = None
    button_link: Optional[str] = None
    color: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


def slide_to_dict(s: HeroSlide):
    return {
        "id": s.id,
        "title": s.title,
        "subtitle": s.subtitle,
        "eyebrow": s.eyebrow,
        "image": s.image,
        "button_text": s.button_text,
        "button_link": s.button_link,
        "color": s.color,
        "display_order": s.display_order,
        "is_active": s.is_active,
        "created_at": s.created_at.isoformat() if s.created_at else None,
    }


# Public: get active slides
@router.get("")
def list_slides(db: Session = Depends(get_db)):
    slides = db.query(HeroSlide).filter(HeroSlide.is_active == True).order_by(HeroSlide.display_order).all()
    return [slide_to_dict(s) for s in slides]


# Admin: get all slides (including inactive)
@router.get("/all")
def list_all_slides(db: Session = Depends(get_db), _: User = Depends(admin_required)):
    slides = db.query(HeroSlide).order_by(HeroSlide.display_order).all()
    return [slide_to_dict(s) for s in slides]


@router.post("")
def create_slide(data: SlideCreate, db: Session = Depends(get_db), _: User = Depends(admin_required)):
    slide = HeroSlide(**data.model_dump())
    db.add(slide)
    db.commit()
    db.refresh(slide)
    return slide_to_dict(slide)


@router.put("/{slide_id}")
def update_slide(slide_id: int, data: SlideUpdate, db: Session = Depends(get_db), _: User = Depends(admin_required)):
    slide = db.query(HeroSlide).filter(HeroSlide.id == slide_id).first()
    if not slide:
        raise HTTPException(status_code=404, detail="Slayd topilmadi")
    for key, val in data.model_dump(exclude_none=True).items():
        setattr(slide, key, val)
    db.commit()
    db.refresh(slide)
    return slide_to_dict(slide)


@router.delete("/{slide_id}")
def delete_slide(slide_id: int, db: Session = Depends(get_db), _: User = Depends(admin_required)):
    slide = db.query(HeroSlide).filter(HeroSlide.id == slide_id).first()
    if not slide:
        raise HTTPException(status_code=404, detail="Slayd topilmadi")
    db.delete(slide)
    db.commit()
    return {"message": "Slayd o'chirildi"}
