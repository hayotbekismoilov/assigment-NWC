import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Headphones, Truck } from 'lucide-react';

const stats = [
    { value: '50+', label: "Model" },
    { value: '12', label: "Shahar" },
    { value: '5+', label: "Yil tajriba" },
    { value: '10K+', label: "Mijozlar" },
];

const perks = [
    { icon: Shield, title: "Rasmiy Kafolat", desc: "Barcha mahsulotlarga 1-2 yil kafolat" },
    { icon: Truck, title: "Tez Yetkazish", desc: "O'zbekiston bo'ylab bepul yetkazish" },
    { icon: Headphones, title: "24/7 Qo'llab-quvvatlash", desc: "Har doim yongingizdamiz" },
];

export default function HeroSection() {
    return (
        <>
            {/* HERO */}
            <section className="hero">
                <div className="hero__overlay" />
                <div className="hero__bg" />

                <div className="hero__content">
                    <motion.span
                        className="hero__eyebrow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Rasmiy Vakil — O'zbekiston 🇺🇿
                    </motion.span>

                    <motion.h1
                        className="hero__title"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.7 }}
                    >
                        Erkinlikni
                        <br />
                        <span className="hero__title-accent">His Eting</span>
                    </motion.h1>

                    <motion.p
                        className="hero__sub"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        Haipeng — dunyo sifati, O'zbekiston narxi. Moto va skuterlar eng katta katalogdan.
                    </motion.p>

                    <motion.div
                        className="hero__btns"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65 }}
                    >
                        <Link to="/catalog" className="btn btn--primary">
                            Katalogni Ko'rish <ArrowRight size={18} />
                        </Link>
                        <Link to="/about" className="btn btn--ghost">
                            Biz Haqimizda
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        className="hero__stats"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                    >
                        {stats.map((s) => (
                            <div key={s.label} className="hero__stat">
                                <span className="hero__stat-value">{s.value}</span>
                                <span className="hero__stat-label">{s.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    className="hero__scroll"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                >
                    <div className="hero__scroll-line" />
                </motion.div>
            </section>

            {/* Perks bar */}
            <section className="perks">
                <div className="perks__inner">
                    {perks.map((p) => (
                        <motion.div
                            key={p.title}
                            className="perk"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <p.icon size={28} className="perk__icon" />
                            <div>
                                <h4>{p.title}</h4>
                                <p>{p.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </>
    );
}
