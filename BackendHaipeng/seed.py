from sqlalchemy.orm import Session
from models import User, Category, Product, HeroSlide
from auth import hash_password
from datetime import datetime


def seed_database(db: Session):
    """Boshlang'ich ma'lumotlarni bazaga kiritish"""

    # Check if already seeded
    if db.query(User).first():
        return

    # ===== ADMIN USER =====
    admin = User(
        username="asdasdasdas",
        password_hash=hash_password("sakdjasdadas"),
        role="admin",
        full_name="Administrator",
        email="admin@haipeng.uz",
        phone="+998 90 123 45 67",
    )
    db.add(admin)

    # ===== MOCK USERS =====
    mock_users = [
        User(username="azamat", password_hash=hash_password("user123"), role="user",
             full_name="Azamat Karimov", email="azamat@mail.uz", phone="+998 90 123 45 67",
             total_spent=45000000, orders_count=12),
        User(username="sevara", password_hash=hash_password("user123"), role="user",
             full_name="Sevara Nosirova", email="sevara@mail.uz", phone="+998 91 222 33 44",
             total_spent=12500000, orders_count=5),
        User(username="murod", password_hash=hash_password("user123"), role="user",
             full_name="Murod Ergashev", email="murod@mail.uz", phone="+998 93 456 78 90",
             total_spent=28000000, orders_count=8),
        User(username="gulnoza", password_hash=hash_password("user123"), role="user",
             full_name="Gulnoza Orifova", email="gulnoza@mail.uz", phone="+998 90 987 65 43",
             total_spent=1200000, orders_count=2),
    ]
    db.add_all(mock_users)

    # ===== CATEGORIES =====
    categories = [
        Category(id="motorcycle", name="Motorcycles", name_uz="Motosikllar",
                 description="Sport va kruizer",
                 image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"),
        Category(id="scooter", name="Scooters", name_uz="Skuterlar",
                 description="Shahar va yo'l",
                 image="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80"),
        Category(id="electric", name="Electric", name_uz="Elektr",
                 description="Kelajak transporti",
                 image="https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=800&q=80"),
        Category(id="cross", name="Cross", name_uz="Kross",
                 description="Yo'lsiz joylar uchun",
                 image="https://images.unsplash.com/photo-1544627836-822bfe450209?w=800&q=80"),
        Category(id="atv", name="ATVs", name_uz="Kvadrosikllar",
                 description="To'rt g'ildirakli",
                 image="https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800&q=80"),
        Category(id="tricycle", name="Tricycles", name_uz="Uch g'ildirakli",
                 description="Yuk tashish uchun",
                 image="https://images.unsplash.com/photo-1591410257327-994fd301b0d7?w=800&q=80"),
        Category(id="parts", name="Parts", name_uz="Ehtiyot qismlar",
                 description="Original ehtiyot qismlar",
                 image="https://images.unsplash.com/photo-1486006920555-c77dcf18193b?w=800&q=80"),
        Category(id="accessories", name="Accessories", name_uz="Aksessuarlar",
                 description="Ekipirovka va boshqalar",
                 image="https://images.unsplash.com/photo-1542060775-16c10b986b60?w=800&q=80"),
        Category(id="helmets", name="Helmets", name_uz="Shlemlar",
                 description="Sizning xavfsizligingiz",
                 image="https://images.unsplash.com/photo-1510339847625-df33f309990b?w=800&q=80"),
        Category(id="tires", name="Tires", name_uz="Shinalar",
                 description="Har qanday mavsumga",
                 image="https://images.unsplash.com/photo-1578844541313-d3450f38fbf4?w=800&q=80"),
    ]
    db.add_all(categories)
    db.flush()

    # ===== PRODUCTS =====
    products = [
        Product(
            id="hp-001", name="Haipeng Raider 250", brand="Haipeng", category_id="motorcycle",
            price=22500000,
            image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
            images=["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
                    "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80"],
            badge="Popular",
            description="Haipeng Raider 250 — sportga oid dizayni va kuchli dvigateli bilan siz uchun eng yaxshi tanlov.",
            specs={"engine": "250cc, 4-taktli", "power": "21 l.s.", "maxSpeed": "140 km/h",
                   "fuelCapacity": "15 L", "weight": "158 kg", "seatHeight": "790 mm",
                   "brakes": "Disk (old/orqa)"},
            in_stock=True, rating=4.8, review_count=124, colors=["#1a1a1a", "#FF4C00", "#1565C0"]
        ),
        Product(
            id="hp-002", name="Haipeng City 125", brand="Haipeng", category_id="scooter",
            price=14900000,
            image="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80",
            images=["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80"],
            badge="New",
            description="Shahar uchun ideal skuter. Iqtisodiy dvigatel, qulay o'tirish pozitsiyasi.",
            specs={"engine": "125cc, EFI", "power": "9.5 l.s.", "maxSpeed": "100 km/h",
                   "fuelCapacity": "6 L", "weight": "108 kg", "seatHeight": "760 mm",
                   "brakes": "Disk (old), Barabanli (orqa)"},
            in_stock=True, rating=4.6, review_count=89, colors=["#FFFFFF", "#1a1a1a", "#E91E63"]
        ),
        Product(
            id="hp-003", name="Haipeng Storm 400", brand="Haipeng", category_id="motorcycle",
            price=38000000, old_price=42000000,
            image="https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80",
            images=["https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80"],
            badge="Sale",
            description="Kuchli va ishonchli — professional haydovchilar uchun yaratilgan.",
            specs={"engine": "400cc, Twin", "power": "38 l.s.", "maxSpeed": "175 km/h",
                   "fuelCapacity": "17 L", "weight": "195 kg", "seatHeight": "810 mm",
                   "brakes": "Dual Disk (old), Disk (orqa)"},
            in_stock=True, rating=4.9, review_count=56, colors=["#1a1a1a", "#37474F"]
        ),
        Product(
            id="hp-004", name="Haipeng E-Sprint", brand="Haipeng", category_id="electric",
            price=19800000,
            image="https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=800&q=80",
            images=["https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=800&q=80"],
            badge="Electric",
            description="Kelajak bugun. To'liq elektr skuter — arzon xarajat, nol emissiya.",
            specs={"power": "3000W elektr motor", "maxSpeed": "90 km/h",
                   "range": "120 km (to'liq zaryadda)", "weight": "115 kg",
                   "seatHeight": "755 mm", "brakes": "Regenerativ + Disk"},
            in_stock=True, rating=4.7, review_count=73, colors=["#FFFFFF", "#00BCD4", "#1a1a1a"]
        ),
        Product(
            id="hp-005", name="Haipeng Cruiser 300", brand="Haipeng", category_id="motorcycle",
            price=29500000,
            image="https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80",
            images=["https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80"],
            badge="Popular",
            description="Klassik kruizer uslubi va zamonaviy texnologiyalar.",
            specs={"engine": "300cc, V-twin", "power": "25 l.s.", "maxSpeed": "150 km/h",
                   "fuelCapacity": "16 L", "weight": "185 kg", "seatHeight": "700 mm",
                   "brakes": "Disk (old/orqa)"},
            in_stock=True, rating=4.5, review_count=98, colors=["#8B0000", "#1a1a1a", "#C8860A"]
        ),
        Product(
            id="hp-006", name="Haipeng Breeze 150", brand="Haipeng", category_id="scooter",
            price=17200000,
            image="https://images.unsplash.com/photo-1558981285-6f0c68243bc7?w=800&q=80",
            images=["https://images.unsplash.com/photo-1558981285-6f0c68243bc7?w=800&q=80"],
            badge="New",
            description="Katta dvigatel va premium bezaklar bilan qulay shahar skuteri.",
            specs={"engine": "150cc, EFI", "power": "12 l.s.", "maxSpeed": "115 km/h",
                   "fuelCapacity": "8 L", "weight": "130 kg", "seatHeight": "775 mm",
                   "brakes": "Dual Disk"},
            in_stock=False, rating=4.4, review_count=41, colors=["#F5F5F5", "#FF8F00", "#1a1a1a"]
        ),
        Product(
            id="hp-007", name="Haipeng Trail 200", brand="Haipeng", category_id="motorcycle",
            price=25900000,
            image="https://images.unsplash.com/photo-1619771914272-e3c1f61ff62d?w=800&q=80",
            images=["https://images.unsplash.com/photo-1619771914272-e3c1f61ff62d?w=800&q=80"],
            description="Off-road va shahar — ikkalasiga ham. Har qanday yo'lda ishonchli hamroh.",
            specs={"engine": "200cc, Mono", "power": "17 l.s.", "maxSpeed": "130 km/h",
                   "fuelCapacity": "12 L", "weight": "140 kg", "seatHeight": "850 mm",
                   "brakes": "Disk (old/orqa)"},
            in_stock=True, rating=4.3, review_count=67, colors=["#FF4C00", "#4CAF50", "#1a1a1a"]
        ),
        Product(
            id="hp-008", name="Haipeng E-City Pro", brand="Haipeng", category_id="electric",
            price=24500000,
            image="https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?w=800&q=80",
            images=["https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?w=800&q=80"],
            badge="Electric",
            description="Premium elektr skuter. Smart ekran, telefon ulanishi, 150 km masofa.",
            specs={"power": "5000W elektr motor", "maxSpeed": "110 km/h",
                   "range": "150 km (to'liq zaryadda)", "weight": "130 kg",
                   "seatHeight": "770 mm", "brakes": "Regenerativ + Dual Disk"},
            in_stock=True, rating=4.8, review_count=34, colors=["#1a1a1a", "#ECEFF1"]
        ),
        Product(
            id="hp-009", name="Haipeng Sport 180", brand="Haipeng", category_id="motorcycle",
            price=27000000,
            image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
            images=["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"],
            badge="Popular",
            description="Sport ko'rinish, qulay narx. Yosh haydovchilar uchun eng mashhur tanlov.",
            specs={"engine": "180cc, 4-taktli", "power": "16 l.s.", "maxSpeed": "135 km/h",
                   "fuelCapacity": "13 L", "weight": "150 kg", "seatHeight": "800 mm",
                   "brakes": "Disk (old), Disk (orqa)"},
            in_stock=True, rating=4.6, review_count=112, colors=["#FF4C00", "#1a1a1a", "#1565C0"]
        ),
        Product(
            id="hp-010", name="Haipeng Mini 50", brand="Haipeng", category_id="scooter",
            price=8900000,
            image="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80",
            images=["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80"],
            description="Eng tejamkor va qulay shahar skuteri.",
            specs={"engine": "50cc, 4-taktli", "power": "3.5 l.s.", "maxSpeed": "60 km/h",
                   "fuelCapacity": "4 L", "weight": "85 kg", "seatHeight": "740 mm",
                   "brakes": "Barabanli (old/orqa)"},
            in_stock=True, rating=4.2, review_count=203, colors=["#FF4C00", "#FFFFFF", "#FFD600"]
        ),
        Product(
            id="hp-011", name="Haipeng Adventure 500", brand="Haipeng", category_id="motorcycle",
            price=52000000, old_price=58000000,
            image="https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80",
            images=["https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80"],
            badge="Sale",
            description="Eng kuchli model. ABS, traction control, smart ekran.",
            specs={"engine": "500cc, Parallel Twin", "power": "47 l.s.", "maxSpeed": "190 km/h",
                   "fuelCapacity": "20 L", "weight": "210 kg", "seatHeight": "830 mm",
                   "brakes": "Dual Disk ABS (old), Disk ABS (orqa)"},
            in_stock=True, rating=5.0, review_count=28, colors=["#1a1a1a", "#FF4C00"]
        ),
        Product(
            id="hp-012", name="Haipeng E-Max", brand="Haipeng", category_id="electric",
            price=32000000,
            image="https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=800&q=80",
            images=["https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=800&q=80"],
            badge="Electric",
            description="Flagman elektr motosikl. 0-dan 100 km/h gacha 4.5 sekund.",
            specs={"power": "10000W elektr motor", "maxSpeed": "150 km/h",
                   "range": "200 km (to'liq zaryadda)", "weight": "165 kg",
                   "seatHeight": "795 mm", "brakes": "Regenerativ + Brembo Disk"},
            in_stock=False, rating=4.9, review_count=19, colors=["#1a1a1a", "#FF4C00"]
        ),
    ]
    db.add_all(products)

    # ===== HERO SLIDES =====
    hero_slides = [
        HeroSlide(
            title="Tezlik va Ozodlik", eyebrow="Yangi Avlod",
            subtitle="Haipeng Cruiser 300 bilan yo'llarni zabt eting. Mukammal quvvat va boshqaruv.",
            image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
            button_text="Hoziroq ko'rish", button_link="/product/hp-cruiser-300",
            color="#FF4C00", display_order=0
        ),
        HeroSlide(
            title="Elektr Kelajagi", eyebrow="Ekologik Toza",
            subtitle="Yangi Haipeng E-City Pro. 100km masofa, 0% emissiya, 100% zavq.",
            image="https://images.unsplash.com/photo-1591637333184-19aa04b5e01f?w=1600&q=80",
            button_text="Katalogga o'tish", button_link="/catalog?cat=electric",
            color="#00C853", display_order=1
        ),
        HeroSlide(
            title="Shahar Bo'ylab", eyebrow="Shahar Komforti",
            subtitle="Haipeng Breeze 150 - eng qulay skuter. Har qanday tirbandlikdan oson o'ting.",
            image="https://images.unsplash.com/photo-1520699049698-acd2fccb8cc8?w=1600&q=80",
            button_text="Batafsil ma'lumot", button_link="/product/hp-breeze-150",
            color="#FFD600", display_order=2
        ),
    ]
    db.add_all(hero_slides)

    db.commit()
    print("✅ Database seeded successfully!")
