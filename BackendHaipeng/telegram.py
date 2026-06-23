import httpx
from sqlalchemy.orm import Session
from models import SiteSetting


def get_setting(db: Session, key: str) -> str:
    s = db.query(SiteSetting).filter(SiteSetting.key == key).first()
    return s.value if s else ""


def get_telegram_config(db: Session) -> tuple[str, str]:
    bot_token = get_setting(db, "bot_token")
    channel_id = get_setting(db, "channel_id")
    return bot_token, channel_id


def format_price(price: float) -> str:
    return f"{price:,.0f}".replace(",", " ") + " so'm"


async def send_order_to_telegram(db: Session, order_data: dict):
    """Buyurtma ma'lumotlarini Telegram kanalga yuborish"""
    bot_token, channel_id = get_telegram_config(db)

    if not bot_token or not channel_id:
        return  # Telegram sozlanmagan

    # Build message
    items_text = ""
    for item in order_data.get("items", []):
        items_text += f"  • {item['name']} × {item['quantity']} = {format_price(item['price'] * item['quantity'])}\n"

    delivery = "🚗 Yetkazib berish" if order_data.get("delivery_type") == "delivery" else "🏪 Olib ketish"

    message = (
        f"🛒 <b>YANGI BUYURTMA!</b>\n"
        f"━━━━━━━━━━━━━━━━━━\n"
        f"📋 <b>Buyurtma:</b> {order_data.get('order_number', '—')}\n"
        f"👤 <b>Mijoz:</b> {order_data.get('customer_name', '—')}\n"
        f"📱 <b>Telefon:</b> {order_data.get('customer_phone', '—')}\n"
        f"📦 <b>Yetkazish:</b> {delivery}\n"
    )

    if order_data.get("address"):
        message += f"📍 <b>Manzil:</b> {order_data['address']}\n"

    if order_data.get("comment"):
        message += f"💬 <b>Izoh:</b> {order_data['comment']}\n"

    message += (
        f"━━━━━━━━━━━━━━━━━━\n"
        f"🏍 <b>Mahsulotlar:</b>\n"
        f"{items_text}"
        f"━━━━━━━━━━━━━━━━━━\n"
        f"💰 <b>Jami:</b> {format_price(order_data.get('total', 0))}\n"
        f"━━━━━━━━━━━━━━━━━━\n"
        f"⏰ <i>Vaqt: {order_data.get('created_at', '—')}</i>"
    )

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            await client.post(url, json={
                "chat_id": channel_id,
                "text": message,
                "parse_mode": "HTML",
            })
    except Exception as e:
        print(f"Telegram xatolik: {e}")
