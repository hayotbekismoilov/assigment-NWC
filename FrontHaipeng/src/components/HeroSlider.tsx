import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api';

interface Slide {
    id: number;
    title: string;
    subtitle: string;
    eyebrow: string;
    image: string;
    button_text: string;
    button_link: string;
    color: string;
}

const fallbackSlides: Slide[] = [
    {
        id: 1, eyebrow: "Yangi Avlod", title: "Tezlik va Ozodlik",
        subtitle: "Haipeng Cruiser 300 bilan yo'llarni zabt eting.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
        button_text: "Hoziroq ko'rish", button_link: "/catalog", color: "#FF4C00"
    }
];

export default function HeroSlider() {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        api.slides.list()
            .then((data: Slide[]) => setSlides(data.length ? data : fallbackSlides))
            .catch(() => setSlides(fallbackSlides));
    }, []);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setDirection(1);
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrent((prev) => (prev + newDirection + slides.length) % slides.length);
    };

    if (slides.length === 0) return null;

    const slide = slides[current];

    return (
        <section className="hero-slider">
            <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                    key={`${slide.id}-${current}`}
                    custom={direction}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                    className="hero-slider__slide"
                >
                    <motion.div
                        className="hero-slider__bg"
                        style={{ backgroundImage: `url(${slide.image})` }}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 10, ease: "linear" }}
                    />
                    <div className="hero-slider__overlay" />

                    <div className="container">
                        <div className="hero-slider__content">
                            {slide.eyebrow && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.8 }}
                                    className="hero-slider__eyebrow"
                                >
                                    <Zap size={14} style={{ color: slide.color }} />
                                    <span>{slide.eyebrow}</span>
                                </motion.div>
                            )}

                            <motion.h1
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="hero-slider__title"
                            >
                                {slide.title.split(" ").map((word, i) => (
                                    <span key={i} className="hero-slider__word-wrap">
                                        <motion.span
                                            initial={{ y: "100%" }}
                                            animate={{ y: 0 }}
                                            transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                            className="hero-slider__word"
                                        >
                                            {word}
                                        </motion.span>
                                    </span>
                                ))}
                            </motion.h1>

                            {slide.subtitle && (
                                <motion.p
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.8 }}
                                    className="hero-slider__subtitle"
                                >
                                    {slide.subtitle}
                                </motion.p>
                            )}

                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1, duration: 0.8 }}
                                className="hero-slider__actions"
                            >
                                <Link to={slide.button_link} className="btn btn--primary btn--lg">
                                    {slide.button_text} <ArrowRight size={18} />
                                </Link>
                                <Link to="/catalog" className="btn btn--ghost btn--lg">
                                    Katalogni ko'rish
                                </Link>
                            </motion.div>
                        </div>
                    </div>

                    {/* Background Number indicator */}
                    <motion.div
                        className="hero-slider__number"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 0.05 }}
                        transition={{ delay: 0.5, duration: 1.5 }}
                    >
                        0{current + 1}
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            {slides.length > 1 && (
                <div className="hero-slider__footer">
                    <div className="container hero-slider__footer-inner">
                        <div className="hero-slider__dots">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    className={`hero-slider__dot ${current === i ? 'hero-slider__dot--active' : ''}`}
                                    onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                                >
                                    <span className="hero-slider__dot-label">0{i + 1}</span>
                                    <div className="hero-slider__dot-progress">
                                        {current === i && (
                                            <motion.div
                                                className="hero-slider__dot-fill"
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 8, ease: "linear" }}
                                            />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="hero-slider__nav">
                            <button onClick={() => paginate(-1)} className="hero-slider__nav-btn">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={() => paginate(1)} className="hero-slider__nav-btn">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
