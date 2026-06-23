import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, ArrowLeft, Check, ChevronRight, Zap } from 'lucide-react';
import { api } from '../api';
import { useCartStore } from '../store/cartStore';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';

function formatPrice(price: number) {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
}

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const addItem = useCartStore((s) => s.addItem);
    const [selectedImg, setSelectedImg] = useState(0);
    const [selectedColor, setSelectedColor] = useState(0);
    const [added, setAdded] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);
    const [related, setRelated] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        api.products.get(id).then(data => {
            setProduct(data.product as Product);
            setRelated(data.related as Product[]);
            setSelectedImg(0);
            setSelectedColor(0);
        }).catch(() => navigate('/')).finally(() => setLoading(false));
    }, [id, navigate]);

    const handleAdd = () => {
        if (!product) return;
        addItem(product, product.colors?.[selectedColor]);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading || !product) {
        return <main className="empty-page"><div className="container"><p>Yuklanmoqda...</p></div></main>;
    }

    const specLabels: Record<string, string> = {
        engine: 'Dvigatel', power: 'Quvvat', maxSpeed: 'Max tezlik',
        fuelCapacity: 'Yoqilg\'i sig\'imi', weight: 'Vazni',
        seatHeight: 'O\'rindiq balandligi', range: 'Masofa', brakes: 'Tormozlar',
    };

    return (
        <main className="detail-page">
            <div className="container">
                <nav className="breadcrumb">
                    <Link to="/">Bosh sahifa</Link> <ChevronRight size={14} />
                    <Link to="/catalog">Katalog</Link> <ChevronRight size={14} />
                    <span>{product.name}</span>
                </nav>

                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} /> Orqaga
                </button>

                <div className="product-detail">
                    {/* Gallery */}
                    <div className="product-gallery">
                        <motion.img
                            key={selectedImg}
                            src={product.images?.[selectedImg] || product.image}
                            alt={product.name}
                            className="product-gallery__main"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        />
                        {product.images && product.images.length > 1 && (
                            <div className="product-gallery__thumbs">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        className={`gallery-thumb ${i === selectedImg ? 'gallery-thumb--active' : ''}`}
                                        onClick={() => setSelectedImg(i)}
                                    >
                                        <img src={img} alt="" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="product-info">
                        {product.badge && (
                            <span className={`product-badge product-badge--${product.badge.toLowerCase()}`}>
                                {product.badge === 'Electric' && <Zap size={14} />}
                                {product.badge}
                            </span>
                        )}
                        <h1 className="product-info__name">{product.name}</h1>

                        <div className="product-info__rating">
                            <div className="stars">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <Star key={n} size={16} fill={n <= Math.round(product.rating) ? '#FFD600' : 'none'} color="#FFD600" />
                                ))}
                            </div>
                            <span>{product.rating}</span>
                            <span className="review-count">({product.reviewCount} sharh)</span>
                        </div>

                        <div className="product-info__price">
                            <span className="current">{formatPrice(product.price)}</span>
                            {product.oldPrice && <span className="old">{formatPrice(product.oldPrice)}</span>}
                        </div>

                        <p className="product-info__desc">{product.description}</p>

                        {product.colors && product.colors.length > 0 && (
                            <div className="product-info__colors">
                                <h4>Rang:</h4>
                                <div className="color-options">
                                    {product.colors.map((color, i) => (
                                        <button
                                            key={color}
                                            className={`color-option ${i === selectedColor ? 'color-option--active' : ''}`}
                                            style={{ background: color }}
                                            onClick={() => setSelectedColor(i)}
                                        >
                                            {i === selectedColor && <Check size={14} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="product-info__stock">
                            {product.inStock ? (
                                <span className="in-stock"><Check size={16} /> Mavjud</span>
                            ) : (
                                <span className="out-stock">Hozircha mavjud emas</span>
                            )}
                        </div>

                        <motion.button
                            className={`btn btn--primary btn--lg btn--full ${added ? 'btn--added' : ''}`}
                            onClick={handleAdd}
                            whileTap={{ scale: 0.97 }}
                            disabled={!product.inStock}
                        >
                            {added ? (
                                <><Check size={20} /> Savatga qo'shildi!</>
                            ) : (
                                <><ShoppingCart size={20} /> Savatga qo'shish</>
                            )}
                        </motion.button>

                        {/* Specs */}
                        <div className="product-specs">
                            <h3>Texnik xususiyatlar</h3>
                            <div className="specs-grid">
                                {Object.entries(product.specs || {}).map(([key, val]) => (
                                    <div key={key} className="spec-row">
                                        <span className="spec-label">{specLabels[key] || key}</span>
                                        <span className="spec-value">{val as string}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related */}
                {related.length > 0 && (
                    <section className="section">
                        <div className="section__head">
                            <h2 className="section__title">O'xshash modellar</h2>
                        </div>
                        <div className="products-grid">
                            {related.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
