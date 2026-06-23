import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';

export default function ContactPage() {
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <main className="contact-page">
            <div className="contact-hero">
                <div className="container">
                    <motion.span className="section__eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        Aloqa
                    </motion.span>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        Biz bilan bog'laning
                    </motion.h1>
                </div>
            </div>

            <div className="container">
                <div className="contact-layout">
                    {/* Form */}
                    <motion.div
                        className="contact-form-wrap"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h2>Xabar yuboring</h2>
                        {sent ? (
                            <div className="success-state" style={{ padding: '3rem 0' }}>
                                <CheckCircle size={56} />
                                <h3>Xabar yuborildi!</h3>
                                <p>Tez orada siz bilan bog'lanamiz.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label>Ismingiz *</label>
                                    <input required type="text" placeholder="Ismingiz" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Telefon *</label>
                                    <input required type="tel" placeholder="+998 90 ..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Xabar *</label>
                                    <textarea required rows={5} placeholder="Savolingiz yoki xabaringiz..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                                </div>
                                <motion.button type="submit" className="btn btn--primary btn--lg btn--full" whileTap={{ scale: 0.98 }}>
                                    Yuborish
                                </motion.button>
                            </form>
                        )}
                    </motion.div>

                    {/* Info */}
                    <motion.div
                        className="contact-info"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="contact-info__card">
                            <div className="contact-info__item">
                                <div className="contact-info__icon"><Phone size={20} /></div>
                                <div>
                                    <h4>Telefon</h4>
                                    <a href="tel:+998901234567">+998 90 123 45 67</a>
                                    <a href="tel:+998712345678">+998 71 234 56 78</a>
                                </div>
                            </div>
                            <div className="contact-info__item">
                                <div className="contact-info__icon"><Mail size={20} /></div>
                                <div>
                                    <h4>Email</h4>
                                    <a href="mailto:info@haipeng.uz">info@haipeng.uz</a>
                                    <a href="mailto:sales@haipeng.uz">sales@haipeng.uz</a>
                                </div>
                            </div>
                            <div className="contact-info__item">
                                <div className="contact-info__icon"><MapPin size={20} /></div>
                                <div>
                                    <h4>Manzil</h4>
                                    <p>Toshkent sh., Chilonzor tumani,<br />Bunyodkor ko'chasi 12</p>
                                </div>
                            </div>
                            <div className="contact-info__item">
                                <div className="contact-info__icon"><Clock size={20} /></div>
                                <div>
                                    <h4>Ish vaqti</h4>
                                    <p>Dushanba – Shanba: 9:00 – 19:00</p>
                                    <p>Yakshanba: 10:00 – 17:00</p>
                                </div>
                            </div>
                        </div>

                        {/* Map placeholder */}
                        <div className="contact-map">
                            <iframe
                                title="Haipeng.uz location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d191886.29994254297!2d69.13008845!3d41.2994958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sTashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1700000000000"
                                width="100%"
                                height="250"
                                style={{ border: 0, borderRadius: '1rem' }}
                                allowFullScreen
                                loading="lazy"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
