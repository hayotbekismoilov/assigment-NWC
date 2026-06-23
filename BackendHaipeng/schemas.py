from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ===== AUTH =====
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


# ===== PRODUCT =====
class ProductSpecSchema(BaseModel):
    engine: Optional[str] = None
    power: Optional[str] = None
    maxSpeed: Optional[str] = None
    fuelCapacity: Optional[str] = None
    weight: Optional[str] = None
    seatHeight: Optional[str] = None
    range: Optional[str] = None
    brakes: Optional[str] = None


class ProductBase(BaseModel):
    name: str
    brand: str = "Haipeng"
    category_id: str
    price: float
    old_price: Optional[float] = None
    image: str = ""
    images: list[str] = []
    badge: Optional[str] = None
    description: str = ""
    specs: dict = {}
    in_stock: bool = True
    rating: float = 0
    review_count: int = 0
    colors: list[str] = []


class ProductCreate(ProductBase):
    id: str


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    category_id: Optional[str] = None
    price: Optional[float] = None
    old_price: Optional[float] = None
    image: Optional[str] = None
    images: Optional[list[str]] = None
    badge: Optional[str] = None
    description: Optional[str] = None
    specs: Optional[dict] = None
    in_stock: Optional[bool] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None
    colors: Optional[list[str]] = None


class ProductResponse(ProductBase):
    id: str
    category: str = ""
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ===== CATEGORY =====
class CategoryBase(BaseModel):
    name: str
    name_uz: str
    description: str = ""
    image: str = ""


class CategoryCreate(CategoryBase):
    id: str


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    name_uz: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None


class CategoryResponse(CategoryBase):
    id: str
    count: int = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ===== ORDER =====
class OrderItemSchema(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int
    image: str = ""


class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    address: str = ""
    delivery_type: str = "delivery"
    payment_method: str = "cash"
    comment: str = ""
    items: list[OrderItemSchema]


class OrderStatusUpdate(BaseModel):
    status: str


class OrderResponse(BaseModel):
    id: int
    order_number: str
    customer_name: str
    customer_phone: str
    address: str
    delivery_type: str
    payment_method: str
    comment: str
    status: str
    total: float
    items: list[dict]
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ===== USER =====
class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    full_name: str
    email: str
    phone: str
    total_spent: float
    orders_count: int
    last_active: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ===== DASHBOARD =====
class DashboardStats(BaseModel):
    total_sales: float
    total_orders: int
    total_users: int
    total_views: int
    recent_orders: list[dict]
