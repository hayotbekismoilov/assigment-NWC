import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const login = useAuthStore((s) => s.login);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await login(username, password);
            if (success) {
                navigate('/panel');
            } else {
                setError('Login yoki parol noto\'g\'ri');
            }
        } catch (err) {
            setError('Tizimga kirishda xatolik yuz berdi');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <motion.div
                className="admin-login-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="admin-login-header">
                    <div className="admin-login-icon">
                        <ShieldCheck size={32} />
                    </div>
                    <h1>Haipeng Admin</h1>
                    <p>Tizimga kirish uchun malumotlarni kiriting</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="admin-input-group">
                        <div className="admin-input-icon">
                            <User size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="admin-input-group">
                        <div className="admin-input-icon">
                            <Lock size={18} />
                        </div>
                        <input
                            type="password"
                            placeholder="Parol"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <motion.div
                            className="admin-login-error"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        className={`admin-login-btn ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Kirilmoqda...' : 'Kirish'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
