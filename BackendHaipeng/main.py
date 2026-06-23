from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from database import engine, Base, SessionLocal
from seed import seed_database
from routers import auth, products, categories, orders, users, dashboard, upload, slides, settings
import sys


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    # Shutdown


app = FastAPI(
    title="Haipeng.uz API",
    description="Haipeng moto do'koni backend API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://haipeng.uz",
        "http://haipeng.uz",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(orders.router)
app.include_router(users.router)
app.include_router(dashboard.router)
app.include_router(upload.router)
app.include_router(slides.router)
app.include_router(settings.router)


@app.get("/")
def root():
    return {"message": "Haipeng.uz API ishlayapti! 🚀", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/admin")
def admin_redirect():
    """Redirect to Swagger API docs"""
    return RedirectResponse(url="/docs")


# ===== CLI Commands =====
def cli():
    if len(sys.argv) < 2:
        print("Foydalanish: python main.py <command>")
        print("Buyruqlar:")
        print("  runserver        — API serverni ishga tushirish")
        print("  createsuperuser  — Yangi admin yaratish")
        print("  resetdb          — Bazani qayta yaratish")
        return

    command = sys.argv[1]
    
    if command == "runserver":
        import uvicorn
        print("🚀 API server ishga tushmoqda...")
        uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
    
    elif command == "createsuperuser":
        from auth import hash_password
        from models import User

        Base.metadata.create_all(bind=engine)
        db = SessionLocal()

        username = input("Username: ").strip()
        if not username:
            print("❌ Username bo'sh bo'lmasligi kerak!")
            return

        existing = db.query(User).filter(User.username == username).first()
        if existing:
            print(f"❌ '{username}' allaqachon mavjud!")
            db.close()
            return

        password = input("Password: ").strip()
        if not password:
            print("❌ Password bo'sh bo'lmasligi kerak!")
            return

        full_name = input("Full name (ixtiyoriy): ").strip() or username

        user = User(
            username=username,
            password_hash=hash_password(password),
            role="admin",
            full_name=full_name,
            email=f"{username}@haipeng.uz",
        )
        db.add(user)
        db.commit()
        db.close()
        print(f"✅ Admin '{username}' muvaffaqiyatli yaratildi!")

    elif command == "resetdb":
        confirm = input("⚠️  Barcha ma'lumotlar o'chiriladi! Davom etilsinmi? (yes/no): ")
        if confirm.lower() != "yes":
            print("Bekor qilindi.")
            return

        import os
        db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "haipeng.db")
        if os.path.exists(db_path):
            os.remove(db_path)
            print("🗑  Eski baza o'chirildi.")

        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        seed_database(db)
        db.close()
        print("✅ Baza qayta yaratildi va seed qilindi!")

    else:
        print(f"❌ Noma'lum buyruq: '{command}'")


if __name__ == "__main__":
    cli()
