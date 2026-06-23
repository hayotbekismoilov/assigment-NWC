import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

function formatPrice(price: number) {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
}

export default function CartDrawer() {
    const { items, isDrawerOpen, closeDrawer, removeItem, updateQuantity, total } = useCartStore();

    return (
        <AnimatePresence>
            {isDrawerOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="cart-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeDrawer}
                    />
                    {/* Drawer */}
                    <motion.aside
                        className="cart-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.35 }}
                    >
                        <div className="cart-drawer__header">
                            <h2>Savat</h2>
                            <button className="cart-drawer__close" onClick={closeDrawer}>
                                <X size={20} />
                            </button>
                        </div>

                        {items.length === 0 ? (
                            <div className="cart-drawer__empty">
                                <ShoppingBag size={56} opacity={0.3} />
                                <p>Savat bo'sh</p>
                                <button onClick={closeDrawer} className="cart-drawer__shop-btn">
                                    Xarid qilish
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="cart-drawer__items">
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.product.id}
                                            className="cart-item"
                                            layout
                                            initial={{ opacity: 0, x: 30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 30 }}
                                        >
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="cart-item__img"
                                            />
                                            <div className="cart-item__info">
                                                <p className="cart-item__name">{item.product.name}</p>
                                                <p className="cart-item__price">{formatPrice(item.product.price)}</p>
                                                <div className="cart-item__qty">
                                                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                                                        <Minus size={14} />
                                                    </button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <button
                                                className="cart-item__remove"
                                                onClick={() => removeItem(item.product.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="cart-drawer__footer">
                                    <div className="cart-drawer__total">
                                        <span>Jami</span>
                                        <span className="cart-drawer__total-price">{formatPrice(total())}</span>
                                    </div>
                                    <Link to="/checkout" className="cart-drawer__checkout-btn" onClick={closeDrawer}>
                                        Buyurtma berish
                                    </Link>
                                    <Link to="/cart" className="cart-drawer__view-btn" onClick={closeDrawer}>
                                        Savatni ko'rish
                                    </Link>
                                </div>
                            </>
                        )}
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
