import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Zap } from 'lucide-react';
import type { Product } from '../types';
import { useCartStore } from '../store/cartStore';

function formatPrice(price: number) {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
}

const badgeColors: Record<string, string> = {
    New: '#00C853',
    Popular: '#FF4C00',
    Sale: '#FF1744',
    Electric: '#00B0FF',
};

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const [added, setAdded] = useState(false);
    const addItem = useCartStore((s) => s.addItem);

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    return (
        <motion.div
            className="product-card"
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <Link to={`/product/${product.id}`} className="product-card__link">
                {/* Badge */}
                {product.badge && (
                    <span
                        className="product-card__badge"
                        style={{ background: badgeColors[product.badge] }}
                    >
                        {product.badge === 'Electric' && <Zap size={11} />}
                        {product.badge}
                    </span>
                )}

                {/* Image */}
                <div className="product-card__img-wrap">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-card__img"
                        loading="lazy"
                    />
                    {!product.inStock && (
                        <div className="product-card__out-badge">Tugagan</div>
                    )}
                </div>

                {/* Info */}
                <div className="product-card__body">
                    <p className="product-card__brand">{product.brand}</p>
                    <h3 className="product-card__name">{product.name}</h3>

                    <div className="product-card__rating">
                        <Star size={11} fill="#FF4C00" color="#FF4C00" />
                        <span>{product.rating}</span>
                        <span className="product-card__reviews">({product.reviewCount})</span>
                    </div>

                    <div className="product-card__pricing">
                        {product.oldPrice && (
                            <span className="product-card__old-price">{formatPrice(product.oldPrice)}</span>
                        )}
                        <span className="product-card__price">{formatPrice(product.price)}</span>
                    </div>

                    <motion.button
                        className={`product-card__btn ${added ? 'product-card__btn--added' : ''}`}
                        onClick={handleAdd}
                        disabled={!product.inStock}
                        whileTap={{ scale: 0.97 }}
                    >
                        <ShoppingCart size={14} />
                        <span>{added ? "✓" : product.inStock ? "Savatga" : "Mavjud emas"}</span>
                    </motion.button>
                </div>
            </Link>
        </motion.div>
    );
}
