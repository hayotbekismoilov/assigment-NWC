import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

function formatPrice(price: number) {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
}

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();

    if (items.length === 0) {
        return (
            <main className="empty-page">
                <div className="container">
                    <motion.div
                        className="empty-state"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <ShoppingBag size={72} opacity={0.2} />
                        <h2>Savat bo'sh</h2>
                        <p>Hali mahsulot qo'shilmagan</p>
                        <Link to="/catalog" className="btn btn--primary">
                            Xarid qilish boshlash <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </main>
        );
    }

    return (
        <main className="cart-page">
            <div className="container">
                <motion.h1
                    className="page-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Savat
                </motion.h1>

                <div className="cart-layout">
                    <div className="cart-items-list">
                        {items.map((item, i) => (
                            <motion.div
                                key={item.product.id}
                                className="cart-page-item"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                layout
                            >
                                <img src={item.product.image} alt={item.product.name} className="cart-page-item__img" />
                                <div className="cart-page-item__info">
                                    <h3>{item.product.name}</h3>
                                    <p>{item.product.brand}</p>
                                    {item.color && (
                                        <span className="cart-page-item__color" style={{ background: item.color }} />
                                    )}
                                </div>
                                <div className="cart-page-item__qty">
                                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}><Minus size={15} /></button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}><Plus size={15} /></button>
                                </div>
                                <div className="cart-page-item__price">
                                    {formatPrice(item.product.price * item.quantity)}
                                </div>
                                <button className="cart-page-item__remove" onClick={() => removeItem(item.product.id)}>
                                    <Trash2 size={18} />
                                </button>
                            </motion.div>
                        ))}

                        <button className="clear-cart-btn" onClick={clearCart}>
                            <Trash2 size={15} /> Savatni tozalash
                        </button>
                    </div>

                    <div className="cart-summary">
                        <h3>Buyurtma xulosasi</h3>
                        <div className="cart-summary__row">
                            <span>Mahsulotlar ({items.reduce((s, i) => s + i.quantity, 0)} ta)</span>
                            <span>{formatPrice(total())}</span>
                        </div>
                        <div className="cart-summary__row">
                            <span>Yetkazib berish</span>
                            <span className="text-green">Bepul</span>
                        </div>
                        <div className="cart-summary__divider" />
                        <div className="cart-summary__total">
                            <span>Jami</span>
                            <span>{formatPrice(total())}</span>
                        </div>
                        <Link to="/checkout" className="btn btn--primary btn--lg btn--full">
                            Buyurtma berish <ArrowRight size={18} />
                        </Link>
                        <Link to="/catalog" className="btn btn--ghost btn--full" style={{ marginTop: '0.75rem' }}>
                            Xarid davom ettirish
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
