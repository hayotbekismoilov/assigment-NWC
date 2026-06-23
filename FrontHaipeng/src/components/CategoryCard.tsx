import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Category } from '../types';

interface Props {
    category: Category;
    index: number;
    isActive?: boolean;
}

export default function CategoryCard({ category, isActive }: Omit<Props, 'index'>) {
    return (
        <motion.div
            className={`cat-card ${isActive ? 'cat-card--active' : ''}`}
            animate={{
                scale: isActive ? 1.05 : 0.95,
                opacity: isActive ? 1 : 0.6,
                filter: isActive ? 'blur(0px)' : 'blur(1px)',
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            <Link to={`/catalog?cat=${category.id}`} className="cat-card__link">
                <div className="cat-card__img-wrap">
                    <motion.img
                        src={category.image}
                        alt={category.nameUz}
                        className="cat-card__img"
                        animate={{ scale: isActive ? 1.1 : 1 }}
                        transition={{ duration: 0.8 }}
                    />
                    <div className="cat-card__overlay" />

                    {/* Premium Light Spike Effect */}
                    <div className="cat-card__light" />
                </div>
                <div className="cat-card__content">
                    <span className="cat-card__count">
                        {category.count} TA MODEL
                    </span>
                    <h3 className="cat-card__name">{category.nameUz}</h3>

                    <div className="cat-card__footer">
                        <span className="cat-card__cta">
                            Batafsil <ArrowUpRight size={14} />
                        </span>
                        <motion.p
                            className="cat-card__desc"
                            animate={{
                                height: isActive ? 'auto' : 0,
                                opacity: isActive ? 1 : 0,
                                marginTop: isActive ? '0.75rem' : 0
                            }}
                        >
                            {category.description}
                        </motion.p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
