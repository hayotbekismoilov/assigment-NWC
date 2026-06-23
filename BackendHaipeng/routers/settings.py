from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import SiteSetting, User
from auth import admin_required
from pydantic import BaseModel
from typing import Optional
import httpx

router = APIRouter(prefix="/api/settings", tags=["Settings"])


class TelegramSettings(BaseModel):
    bot_token: str = ""
    channel_id: str = ""


@router.get("/telegram")
def get_telegram_settings(db: Session = Depends(get_db), _: User = Depends(admin_required)):
    bot_token = db.query(SiteSetting).filter(SiteSetting.key == "bot_token").first()
    channel_id = db.query(SiteSetting).filter(SiteSetting.key == "channel_id").first()
    return {
        "bot_token": bot_token.value if bot_token else "",
        "channel_id": channel_id.value if channel_id else "",
    }


@router.put("/telegram")
def save_telegram_settings(data: TelegramSettings, db: Session = Depends(get_db), _: User = Depends(admin_required)):
    for key, value in [("bot_token", data.bot_token), ("channel_id", data.channel_id)]:
        existing = db.query(SiteSetting).filter(SiteSetting.key == key).first()
        if existing:
            existing.value = value
        else:
            db.add(SiteSetting(key=key, value=value))
    db.commit()
    return {"message": "Sozlamalar saqlandi ✅"}


@router.post("/telegram/test")
async def test_telegram(db: Session = Depends(get_db), _: User = Depends(admin_required)):
    bot_token = db.query(SiteSetting).filter(SiteSetting.key == "bot_token").first()
    channel_id = db.query(SiteSetting).filter(SiteSetting.key == "channel_id").first()

    if not bot_token or not bot_token.value or not channel_id or not channel_id.value:
        raise HTTPException(status_code=400, detail="Bot token yoki kanal ID kiritilmagan")

    url = f"https://api.telegram.org/bot{bot_token.value}/sendMessage"

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(url, json={
                "chat_id": channel_id.value,
                "text": "✅ <b>Haipeng.uz</b> — Telegram ulanishi muvaffaqiyatli!\n\nBuyurtmalar endi shu kanalga yuboriladi.",
                "parse_mode": "HTML",
            })
            result = resp.json()
            if not result.get("ok"):
                raise HTTPException(status_code=400, detail=f"Telegram xatolik: {result.get('description', 'Noma`lum xatolik')}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Tarmoq xatolik: {str(e)}")

    return {"message": "Test xabar yuborildi ✅"}
