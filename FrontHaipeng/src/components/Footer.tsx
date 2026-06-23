import { Link } from 'react-router-dom';
import { Zap, Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__inner">
                <div className="footer__brand">
                    <Link to="/" className="footer__logo">
                        <Zap size={20} />
                        <span>HAIPENG<span className="footer__logo-uz">.UZ</span></span>
                    </Link>
                    <p className="footer__tagline">Haipeng brendining Uzbekistondagi rasmiy hamkori. Moto va skuter savdosi.</p>
                    <div className="footer__socials">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer__social-btn" aria-label="Instagram">
                            <Instagram size={18} />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer__social-btn" aria-label="Facebook">
                            <Facebook size={18} />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer__social-btn" aria-label="YouTube">
                            <Youtube size={18} />
                        </a>
                    </div>
                </div>

                <div className="footer__links-group">
                    <h4>Navigatsiya</h4>
                    <ul>
                        <li><Link to="/">Bosh sahifa</Link></li>
                        <li><Link to="/catalog">Katalog</Link></li>
                        <li><Link to="/catalog?cat=motorcycle">Motosikllar</Link></li>
                        <li><Link to="/catalog?cat=scooter">Skuterlar</Link></li>
                        <li><Link to="/catalog?cat=electric">Elektr</Link></li>
                    </ul>
                </div>

                <div className="footer__links-group">
                    <h4>Kompaniya</h4>
                    <ul>
                        <li><Link to="/about">Biz haqimizda</Link></li>
                        <li><Link to="/contact">Aloqa</Link></li>
                        <li><a href="#">Kafolat</a></li>
                        <li><a href="#">Texnik xizmat</a></li>
                    </ul>
                </div>

                <div className="footer__contacts">
                    <h4>Aloqa</h4>
                    <a href="tel:+998901234567" className="footer__contact-item">
                        <Phone size={15} />
                        +998 90 123 45 67
                    </a>
                    <a href="mailto:info@haipeng.uz" className="footer__contact-item">
                        <Mail size={15} />
                        info@haipeng.uz
                    </a>
                    <p className="footer__contact-item">
                        <MapPin size={15} />
                        Toshkent sh., Chilonzor tumani, Bunyodkor ko'chasi 12
                    </p>
                </div>
            </div>

            <div className="footer__bottom">
                <p>&copy; {new Date().getFullYear()} Haipeng.uz — Barcha huquqlar himoyalangan</p>
                <p>Haipeng brendining rasmiy vakili</p>
            </div>
        </footer>
    );
}
