import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Bike, MapPin } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';
import { api } from '../api';

function formatPrice(price: number) {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
}

export default function CheckoutPage() {
    const { items, total, clearCart } = useCartStore();
    const [submitted, setSubmitted] = useState(false);
    const [delivery, setDelivery] = useState<'delivery' | 'pickup'>('delivery');
    const [form, setForm] = useState({ name: '', phone: '', address: '', comment: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.orders.create({
                customer_name: form.name,
                customer_phone: form.phone,
                address: form.address,
                delivery_type: delivery,
                comment: form.comment,
                items: items.map(item => ({
                    product_id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    image: item.product.image,
                })),
            });
            setSubmitted(true);
            clearCart();
        } catch {
            alert("Xatolik yuz berdi. Qayta urinib ko'ring.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <main className="empty-page">
                <div className="container">
                    <motion.div
                        className="success-state"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="success-icon">
                            <CheckCircle size={72} />
                        </div>
                        <h2>Buyurtma qabul qilindi!</h2>
                        <p>Tez orada menejerimiz siz bilan bog'lanadi. Rahmat! 🎉</p>
                        <Link to="/" className="btn btn--primary">Bosh sahifaga qaytish</Link>
                    </motion.div>
                </div>
            </main>
        );
    }

    return (
        <main className="checkout-page">
            <div className="container">
                <motion.h1
                    className="page-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Buyurtma berish
                </motion.h1>

                <div className="checkout-layout">
                    <form className="checkout-form" onSubmit={handleSubmit}>
                        {/* Contact */}
                        <div className="checkout-section">
                            <h3>Aloqa ma'lumotlari</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Ismingiz *</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Abdullayev Jasur"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Telefon *</label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="+998 90 123 45 67"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Delivery */}
                        <div className="checkout-section">
                            <h3>Qanday olasiz?</h3>
                            <div className="method-cards">
                                <button
                                    type="button"
                                    className={`method-card ${delivery === 'delivery' ? 'method-card--active' : ''}`}
                                    onClick={() => setDelivery('delivery')}
                                >
                                    <Bike size={24} />
                                    <div>
                                        <p>Yetkazib berish</p>
                                        <span>O'zbekiston bo'ylab bepul</span>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    className={`method-card ${delivery === 'pickup' ? 'method-card--active' : ''}`}
                                    onClick={() => setDelivery('pickup')}
                                >
                                    <MapPin size={24} />
                                    <div>
                                        <p>O'zi olib ketish</p>
                                        <span>Toshkent showroom</span>
                                    </div>
                                </button>
                            </div>
                            {delivery === 'delivery' && (
                                <div className="form-group" style={{ marginTop: '1rem' }}>
                                    <label>Manzil</label>
                                    <input
                                        type="text"
                                        placeholder="Shahar, tuman, ko'cha, uy"
                                        value={form.address}
                                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Izoh (ixtiyoriy)</label>
                            <textarea
                                rows={2}
                                placeholder="Qo'shimcha xabar..."
                                value={form.comment}
                                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                            />
                        </div>

                        <motion.button
                            type="submit"
                            className="btn btn--primary btn--lg btn--full"
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                        >
                            {loading ? 'Yuborilmoqda...' : 'Buyurtmani tasdiqlash ✓'}
                        </motion.button>
                    </form>

                    {/* Order summary */}
                    <div className="checkout-summary">
                        <h3>Sizning buyurtmangiz</h3>
                        <div className="checkout-items">
                            {items.map((item) => (
                                <div key={item.product.id} className="checkout-item">
                                    <img src={item.product.image} alt={item.product.name} />
                                    <div>
                                        <p>{item.product.name}</p>
                                        <span>x{item.quantity}</span>
                                    </div>
                                    <span>{formatPrice(item.product.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="checkout-total">
                            <span>Jami</span>
                            <strong>{formatPrice(total())}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
