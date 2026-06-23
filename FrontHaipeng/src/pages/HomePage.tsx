import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Quote } from 'lucide-react';
import HeroSlider from '../components/HeroSlider';
import CategorySlider from '../components/CategorySlider';
import ProductCard from '../components/ProductCard';
import { api } from '../api';
import type { Product } from '../types';

const whyUs = [
    "Haipeng brendining O'zbekistondagi rasmiy vakili",
    "Barcha modellar zavoddan bevosita",
    "O'zbekiston bo'ylab yetkazib berish",
    "1-2 yil rasmiy kafolat",
    "Malakali texnik xizmat markazi",
    "Qulay to'lov va bo'lib to'lash imkoniyatlari",
];

const testimonials = [
    {
        id: 1,
        name: "Akmal Saidov",
        role: "Motosikl ishqibozi",
        text: "Haipeng Cruiser 300 sotib oldim. Sifat va narx uyg'unligi hayratlanarli. Toshkent ko'chalari uchun eng yaxshi tanlov!",
        rating: 5
    },
    {
        id: 2,
        name: "Lola Karimova",
        role: "Dizayner",
        text: "E-City Pro skuteri juda chiroyli va qulay. Quvvati menga 3 kunga yetadi. Ekologik toza va shovqinsiz!",
        rating: 5
    },
    {
        id: 3,
        name: "Dilshod Akramov",
        role: "Tadbirkor",
        text: "Xizmat ko'rsatish darajasi juda yuqori. Kafolat va servis xizmatlari borligi ko'ngilni xotirjam qiladi.",
        rating: 4
    }
];

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        api.products.list().then(data => setProducts(data.items as Product[])).catch(() => { });
    }, []);
    return (
        <main>
            <HeroSlider />

            {/* Categories Slider */}
            <CategorySlider />

            {/* All Products Grid */}
            <section className="section section--dark">
                <div className="container">
                    <motion.div
                        className="section__head"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="section__eyebrow">Modellar</span>
                        <h2 className="section__title">Barcha Modellar</h2>
                        <Link to="/catalog" className="section__link">
                            Barcha mahsulotlarni ko'rish <ArrowRight size={16} />
                        </Link>
                    </motion.div>
                    <div className="products-grid">
                        {products.map((product, i) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (i % 4) * 0.1 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why us */}
            <section className="section">
                <div className="container">
                    <div className="why-us">
                        <motion.div
                            className="why-us__text"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="section__eyebrow">Nima uchun biz?</span>
                            <h2 className="section__title">Haipeng.uz — Ishonchli Tanlov</h2>
                            <ul className="why-us__list">
                                {whyUs.map((item) => (
                                    <li key={item}>
                                        <CheckCircle size={18} className="why-us__check" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/catalog" className="btn btn--primary" style={{ alignSelf: 'flex-start', marginTop: '1.5rem' }}>
                                Xarid Qilish <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                        <motion.div
                            className="why-us__img-wrap"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                                alt="Haipeng motorcycle showroom"
                                className="why-us__img"
                            />
                            <div className="why-us__img-badge">
                                <span className="why-us__img-badge-num">10K+</span>
                                <span>Mamnun mijozlar</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Trending Section */}
            <section className="section">
                <div className="container">
                    <motion.div
                        className="section__head"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="section__eyebrow">Trending</span>
                        <h2 className="section__title">Hafta Xitlari</h2>
                    </motion.div>
                    <div className="products-grid">
                        {products.filter(p => p.badge === 'Popular' || p.badge === 'New').slice(0, 4).map((product, i) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section section--dark">
                <div className="container">
                    <motion.div
                        className="section__head"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="section__eyebrow">Mijozlarimizdan</span>
                        <h2 className="section__title">Fikr-mulohazalar</h2>
                    </motion.div>
                    <div className="testimonials-grid">
                        {testimonials.map((item, i) => (
                            <motion.div
                                key={item.id}
                                className="testimonial-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="testimonial-card__quote">
                                    <Quote size={32} />
                                </div>
                                <div className="testimonial-card__rating">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < item.rating ? '#FF4C00' : 'transparent'} color="#FF4C00" />
                                    ))}
                                </div>
                                <p className="testimonial-card__text">"{item.text}"</p>
                                <div className="testimonial-card__user">
                                    <div className="testimonial-card__avatar">{item.name[0]}</div>
                                    <div>
                                        <h4>{item.name}</h4>
                                        <span>{item.role}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="cta-banner">
                <div className="container">
                    <motion.div
                        className="cta-banner__inner"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2>O'zingizga mos modelni toping</h2>
                        <p>50+ model, qulay narxlar va rasmiy kafolat bilan</p>
                        <Link to="/catalog" className="btn btn--primary btn--lg">
                            Katalogni Ko'rish <ArrowRight size={20} />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
