import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Zap, Moon, Sun } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useThemeStore } from '../store/themeStore';

const navLinks = [
    { to: '/', label: "Bosh sahifa" },
    { to: '/catalog', label: "Katalog" },
    { to: '/about', label: "Biz haqimizda" },
    { to: '/contact', label: "Aloqa" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const totalItems = useCartStore((s) => s.totalItems());
    const openDrawer = useCartStore((s) => s.openDrawer);
    const { theme, toggleTheme } = useThemeStore();

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    useEffect(() => setMobileOpen(false), [location]);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
            >
                <div className="navbar__inner">
                    {/* Logo */}
                    <Link to="/" className="navbar__logo">
                        <Zap size={22} className="navbar__logo-icon" />
                        <span>HAIPENG</span>
                        <span className="navbar__logo-uz">.UZ</span>
                    </Link>

                    {/* Desktop links */}
                    <ul className="navbar__links">
                        {navLinks.map((link) => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className={`navbar__link ${location.pathname === link.to ? 'navbar__link--active' : ''}`}
                                >
                                    {link.label}
                                    {location.pathname === link.to && (
                                        <motion.span className="navbar__link-underline" layoutId="nav-underline" />
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Right actions */}
                    <div className="navbar__actions">
                        <button
                            className="navbar__theme-btn"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button className="navbar__cart-btn" onClick={openDrawer}>
                            <ShoppingCart size={20} />
                            {totalItems > 0 && (
                                <motion.span
                                    key={totalItems}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="navbar__cart-badge"
                                >
                                    {totalItems}
                                </motion.span>
                            )}
                        </button>
                        <button
                            className="navbar__mobile-toggle"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="mobile-menu"
                    >
                        <ul>
                            {navLinks.map((link, i) => (
                                <motion.li
                                    key={link.to}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                >
                                    <Link to={link.to} className="mobile-menu__link">
                                        {link.label}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
