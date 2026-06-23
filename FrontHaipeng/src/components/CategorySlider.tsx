import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { api } from '../api';
import type { Category } from '../types';
import CategoryCard from './CategoryCard';

export default function CategorySlider() {
    const controls1 = useAnimation();
    const controls2 = useAnimation();

    const x1 = useMotionValue(0);
    const x2 = useMotionValue(0);

    const containerRef1 = useRef<HTMLDivElement>(null);
    const containerRef2 = useRef<HTMLDivElement>(null);

    const timer1 = useRef<number | null>(null);
    const timer2 = useRef<number | null>(null);

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        api.categories.list().then((data: Category[]) => setCategories(data)).catch(() => { });
    }, []);

    // Split categories into two rows
    const row1 = useMemo(() => categories.slice(0, Math.ceil(categories.length / 2)), [categories]);
    const row2 = useMemo(() => categories.slice(Math.ceil(categories.length / 2)), [categories]);

    // Double the items for seamless loop
    const infiniteRow1 = [...row1, ...row1];
    const infiniteRow2 = [...row2, ...row2];

    const startAnimation = useCallback(async (row: 1 | 2, fromPosition?: number) => {
        const controls = row === 1 ? controls1 : controls2;
        const x = row === 1 ? x1 : x2;
        const container = row === 1 ? containerRef1.current : containerRef2.current;

        if (!container) return;

        const fullWidth = container.scrollWidth;
        const halfWidth = fullWidth / 2;

        if (halfWidth <= 0) return;

        const baseDuration = row === 1 ? 25 : 30;

        // Current X could be from a drag or previous animation stop
        let currentX = fromPosition !== undefined ? fromPosition : x.get();

        // Wrap X within [ -halfWidth, 0 ] range for seamlessness
        while (currentX > 0) currentX -= halfWidth;
        while (currentX < -halfWidth) currentX += halfWidth;

        x.set(currentX);

        if (row === 1) {
            // Row 1: Right to Left (Target is -halfWidth)
            const remainingDistance = Math.abs(-halfWidth - currentX);
            const duration = (remainingDistance / halfWidth) * baseDuration;

            await controls.start({
                x: -halfWidth,
                transition: { duration, ease: "linear" }
            });

            // Loop infinitely from 0 to -50%
            x.set(0);
            controls.start({
                x: -halfWidth,
                transition: {
                    duration: baseDuration,
                    repeat: Infinity,
                    ease: "linear"
                }
            });
        } else {
            // Row 2: Left to Right (Target is 0)
            const remainingDistance = Math.abs(0 - currentX);
            const duration = (remainingDistance / halfWidth) * baseDuration;

            await controls.start({
                x: 0,
                transition: { duration, ease: "linear" }
            });

            // Loop infinitely from -50% to 0
            x.set(-halfWidth);
            controls.start({
                x: 0,
                transition: {
                    duration: baseDuration,
                    repeat: Infinity,
                    ease: "linear"
                }
            });
        }
    }, [controls1, controls2, x1, x2, categories.length]);

    useEffect(() => {
        if (categories.length === 0) return;
        // Small delay to let DOM render the category cards
        const t = setTimeout(() => {
            startAnimation(1);
            startAnimation(2);
        }, 100);
        return () => clearTimeout(t);
    }, [startAnimation, categories.length]);

    const handleInteractionStart = (row: 1 | 2) => {
        const controls = row === 1 ? controls1 : controls2;
        const timer = row === 1 ? timer1 : timer2;

        controls.stop();
        if (timer.current) clearTimeout(timer.current);
    };

    const handleInteractionEnd = (row: 1 | 2) => {
        const timer = row === 1 ? timer1 : timer2;
        timer.current = window.setTimeout(() => {
            startAnimation(row);
        }, 3000);
    };

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            if (timer1.current) clearTimeout(timer1.current);
            if (timer2.current) clearTimeout(timer2.current);
        };
    }, []);

    return (
        <section className="section category-marquee-section">
            <div className="container" style={{ maxWidth: '100%', padding: '0' }}>
                <div className="section__head" style={{ padding: '0 2rem' }}>
                    <span className="section__eyebrow">Tanlov Imkoniyati</span>
                    <h2 className="section__title">Transportingizni Tanlang</h2>
                </div>

                <div className="category-marquee-container">
                    {/* Row 1: Right to Left */}
                    <div
                        className="category-marquee"
                        onTouchStart={() => handleInteractionStart(1)}
                        onTouchEnd={() => handleInteractionEnd(1)}
                    >
                        <motion.div
                            ref={containerRef1}
                            className="category-marquee__inner"
                            animate={controls1}
                            style={{ x: x1 }}
                            drag="x"
                            dragConstraints={{ left: -5000, right: 0 }}
                            whileTap={{ cursor: "grabbing" }}
                            onDragStart={() => handleInteractionStart(1)}
                            onDragEnd={(_, info) => {
                                // Update motion value so startAnimation knows where we dropped
                                x1.set(x1.get() + info.offset.x);
                                handleInteractionEnd(1);
                            }}
                        >
                            {infiniteRow1.map((cat, i) => (
                                <div key={`r1-${cat.id}-${i}`} className="category-marquee__item">
                                    <CategoryCard category={cat} isActive={true} />
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Row 2: Left to Right */}
                    <div
                        className="category-marquee"
                        onTouchStart={() => handleInteractionStart(2)}
                        onTouchEnd={() => handleInteractionEnd(2)}
                    >
                        <motion.div
                            ref={containerRef2}
                            className="category-marquee__inner"
                            animate={controls2}
                            style={{ x: x2 }}
                            drag="x"
                            dragConstraints={{ left: -5000, right: 0 }}
                            whileTap={{ cursor: "grabbing" }}
                            onDragStart={() => handleInteractionStart(2)}
                            onDragEnd={(_, info) => {
                                x2.set(x2.get() + info.offset.x);
                                handleInteractionEnd(2);
                            }}
                        >
                            {infiniteRow2.map((cat, i) => (
                                <div key={`r2-${cat.id}-${i}`} className="category-marquee__item">
                                    <CategoryCard category={cat} isActive={true} />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
