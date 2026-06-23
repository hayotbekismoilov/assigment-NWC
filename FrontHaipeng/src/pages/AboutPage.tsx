import { motion } from 'framer-motion';
import { Award, Users, MapPin, Globe } from 'lucide-react';

const milestones = [
    { year: '2018', text: "Haipeng bilan hamkorlik shartnomasi imzolandi" },
    { year: '2019', text: "Toshkentda birinchi showroom ochildi" },
    { year: '2021', text: "O'zbekiston bo'ylab yetkazib berish tarmog'i kengaytirildi" },
    { year: '2023', text: "10 000 ta mamnun mijoz chegarasi oshib ketdi" },
    { year: '2024', text: "Elektr modellar katalogga qo'shildi" },
];

const team = [
    { name: 'Jasur Karimov', role: 'Bosh director', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
    { name: 'Nilufar Yusupova', role: 'Savdo menejeri', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80' },
    { name: 'Bobur Toshmatov', role: 'Texnik mutaxassis', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80' },
];

export default function AboutPage() {
    return (
        <main className="about-page">
            {/* Hero */}
            <div className="about-hero">
                <div className="about-hero__overlay" />
                <img
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80"
                    alt="Haipeng motorcycles"
                    className="about-hero__img"
                />
                <div className="container about-hero__content">
                    <motion.span className="section__eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        Biz haqimizda
                    </motion.span>
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        Haipeng.uz — Erkinlikning Rasmiy Manzili
                    </motion.h1>
                </div>
            </div>

            <div className="container">
                {/* Mission */}
                <section className="section">
                    <div className="about-grid">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="section__eyebrow">Bizning missiyamiz</span>
                            <h2 className="section__title">O'zbekistonga sifatli moto transport</h2>
                            <p className="about-text">
                                Haipeng.uz — Xitoyning yetakchi moto brendi Haipengning O'zbekistondagi rasmiy va yagona vakili.
                                Biz 2018 yildan beri O'zbekiston fuqarolariga eng yaxshi moto va skuterlarni qulay narxlarda taqdim etib kelmoqdamiz.
                            </p>
                            <p className="about-text">
                                Bizning maqsadimiz — har bir mijozga erkin harakat, ishonchli texnika va a'lo darajadagi xizmat ko'rsatish.
                            </p>
                        </motion.div>

                        <div className="about-stats">
                            {[
                                { icon: Users, val: '10,000+', label: 'Mamnun mijozlar' },
                                { icon: Globe, val: '12', label: 'Shaharlar' },
                                { icon: Award, val: '50+', label: 'Modellar' },
                                { icon: MapPin, val: '3', label: 'Showroomlar' },
                            ].map((s, i) => (
                                <motion.div
                                    key={s.label}
                                    className="about-stat"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <s.icon size={28} className="about-stat__icon" />
                                    <span className="about-stat__val">{s.val}</span>
                                    <span className="about-stat__label">{s.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Timeline */}
                <section className="section section--dark" style={{ borderRadius: '1.5rem', padding: '3rem 2rem', marginBottom: '4rem' }}>
                    <div className="section__head">
                        <span className="section__eyebrow">Tarix</span>
                        <h2 className="section__title">Bizning yo'limiz</h2>
                    </div>
                    <div className="timeline">
                        {milestones.map((m, i) => (
                            <motion.div
                                key={m.year}
                                className="timeline-item"
                                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <span className="timeline-year">{m.year}</span>
                                <div className="timeline-dot" />
                                <p className="timeline-text">{m.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Team */}
                <section className="section">
                    <div className="section__head">
                        <span className="section__eyebrow">Jamoa</span>
                        <h2 className="section__title">Bizning mutaxassislarimiz</h2>
                    </div>
                    <div className="team-grid">
                        {team.map((member, i) => (
                            <motion.div
                                key={member.name}
                                className="team-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -6 }}
                            >
                                <img src={member.img} alt={member.name} className="team-card__img" />
                                <h4>{member.name}</h4>
                                <p>{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
