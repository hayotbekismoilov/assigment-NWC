import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, Users, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { api } from '../../api';

function formatPrice(price: number) {
    return new Intl.NumberFormat('uz-UZ').format(price);
}

const statusLabels: Record<string, string> = {
    pending: 'Kutilmoqda',
    paid: "To'landi",
    delivered: 'Yetkazildi',
    cancelled: 'Bekor qilindi',
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.dashboard.stats()
            .then(setStats)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="admin-content"><p>Yuklanmoqda...</p></div>;

    return (
        <div className="admin-content">
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                Xush kelibsiz, Admin
            </h1>
            <p style={{ color: 'var(--text3)', marginBottom: '2rem' }}>Bugungi ko'rsatkichlar va yangiliklar</p>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(255, 76, 0, 0.1)', color: 'var(--accent)' }}>
                            <TrendingUp size={22} />
                        </div>
                        <div className="stat-change up"><ArrowUpRight size={14} /> +12.5%</div>
                    </div>
                    <div className="stat-body">
                        <span className="stat-label">Jami Savdo</span>
                        <h3 className="stat-value">{formatPrice(stats?.total_sales || 0)} <small>so'm</small></h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(0, 200, 83, 0.1)', color: '#00C853' }}>
                            <ShoppingCart size={22} />
                        </div>
                        <div className="stat-change up"><ArrowUpRight size={14} /> +8.2%</div>
                    </div>
                    <div className="stat-body">
                        <span className="stat-label">Buyurtmalar</span>
                        <h3 className="stat-value">{stats?.total_orders || 0}</h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(0, 176, 255, 0.1)', color: '#00B0FF' }}>
                            <Users size={22} />
                        </div>
                        <div className="stat-change up"><ArrowUpRight size={14} /> +15.3%</div>
                    </div>
                    <div className="stat-body">
                        <span className="stat-label">Mijozlar</span>
                        <h3 className="stat-value">{stats?.total_users || 0}</h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'rgba(156, 39, 176, 0.1)', color: '#9C27B0' }}>
                            <Package size={22} />
                        </div>
                        <div className="stat-change down"><ArrowDownRight size={14} /> -2.4%</div>
                    </div>
                    <div className="stat-body">
                        <span className="stat-label">Mahsulotlar</span>
                        <h3 className="stat-value">{stats?.total_products || 0}</h3>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="admin-card">
                <div className="card-header">
                    <h3 className="card-title">Oxirgi Buyurtmalar</h3>
                </div>
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Mijoz</th>
                                <th>Mahsulot</th>
                                <th>Summa</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(stats?.recent_orders || []).map((order: any) => (
                                <tr key={order.id}>
                                    <td className="font-mono">{order.id}</td>
                                    <td className="font-bold">{order.customer}</td>
                                    <td>{order.product}</td>
                                    <td>{order.amount} so'm</td>
                                    <td><span className={`status-badge ${order.status}`}>{statusLabels[order.status] || order.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
