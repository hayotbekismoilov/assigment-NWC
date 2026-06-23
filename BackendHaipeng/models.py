from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import uuid


def generate_id():
    return str(uuid.uuid4())[:8]


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="user")  # admin / user
    full_name = Column(String(100), default="")
    email = Column(String(100), default="")
    phone = Column(String(30), default="")
    total_spent = Column(Float, default=0)
    orders_count = Column(Integer, default=0)
    last_active = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)


class Category(Base):
    __tablename__ = "categories"

    id = Column(String(50), primary_key=True)  # slug: motorcycle, scooter...
    name = Column(String(100), nullable=False)
    name_uz = Column(String(100), nullable=False)
    description = Column(String(255), default="")
    image = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    products = relationship("Product", back_populates="category_rel", lazy="selectin")


class Product(Base):
    __tablename__ = "products"

    id = Column(String(50), primary_key=True)  # slug: hp-001
    name = Column(String(200), nullable=False)
    brand = Column(String(100), default="Haipeng")
    category_id = Column(String(50), ForeignKey("categories.id"), nullable=False)
    price = Column(Float, nullable=False)
    old_price = Column(Float, nullable=True)
    image = Column(Text, default="")
    images = Column(JSON, default=[])
    badge = Column(String(20), nullable=True)  # New, Popular, Sale, Electric
    description = Column(Text, default="")
    specs = Column(JSON, default={})
    in_stock = Column(Boolean, default=True)
    rating = Column(Float, default=0)
    review_count = Column(Integer, default=0)
    colors = Column(JSON, default=[])
    created_at = Column(DateTime, default=datetime.utcnow)

    category_rel = relationship("Category", back_populates="products")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_number = Column(String(20), unique=True, nullable=False, index=True)
    customer_name = Column(String(100), nullable=False)
    customer_phone = Column(String(30), nullable=False)
    address = Column(String(255), default="")
    delivery_type = Column(String(20), default="delivery")  # delivery / pickup
    payment_method = Column(String(20), default="cash")  # cash / card
    comment = Column(Text, default="")
    status = Column(String(20), default="pending")  # pending, paid, delivered, cancelled
    total = Column(Float, default=0)
    items = Column(JSON, default=[])  # [{product_id, name, price, quantity, image}]
    created_at = Column(DateTime, default=datetime.utcnow)


class HeroSlide(Base):
    __tablename__ = "hero_slides"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    subtitle = Column(String(500), default="")
    eyebrow = Column(String(100), default="")
    image = Column(Text, nullable=False)
    button_text = Column(String(100), default="Batafsil")
    button_link = Column(String(200), default="/catalog")
    color = Column(String(20), default="#FF4C00")
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class SiteSetting(Base):
    __tablename__ = "site_settings"

    key = Column(String(50), primary_key=True)
    value = Column(Text, default="")
