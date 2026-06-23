import { useCrmStore } from '../../store/crmStore';
import CrmStatCard from '../../components/Admin/CrmStatCard';
import CrmPageHeader from '../../components/Admin/CrmPageHeader';
import CrmBadge from '../../components/Admin/CrmBadge';
import {
    Factory, Bike, DollarSign, TrendingUp, Users, Package,
    AlertTriangle, Activity
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { productionChartData, financeChartData } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

function formatPrice(n: number) {
    return new Intl.NumberFormat('uz-UZ').format(n);
}

export default function CrmDashboard() {
    const motos = useCrmStore(s => s.motos);
    const workers = useCrmStore(s => s.workers);
    const workerTasks = useCrmStore(s => s.workerTasks);
    const parts = useCrmStore(s => s.parts);
    const transactions = useCrmStore(s => s.transactions);
    const orders = useCrmStore(s => s.orders);
    const navigate = useNavigate();

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const totalProfit = totalIncome - totalExpense;
    const unpaidSalary = workerTasks.filter(t => !t.paid).reduce((s, t) => s + t.amount, 0);
    const assemblingMotos = motos.filter(m => m.status === 'assembling').length;
    const readyMotos = motos.filter(m => m.status === 'ready').length;
    const soldMotos = motos.filter(m => m.status === 'sold').length;
    const activeWorkers = workers.filter(w => w.status === 'active').length;
    const lowStockParts = parts.filter(p => p.quantity <= p.minStock);
    const recentTransactions = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
    const pendingOrders = orders.filter(o => o.paymentStatus !== 'paid');

    return (
        <div className="admin-content">
            <CrmPageHeader
                title="CRM Boshqaruv Paneli"
                subtitle="Bugungi ko'rsatkichlar va umumiy holat"
            />

            {/* KPI Cards */}
            <div className="crm-stats-grid">
                <CrmStatCard
                    icon={<Factory size={22} />}
                    label="Yig'ilmoqda"
                    value={assemblingMotos}
                    change={`${readyMotos} tayyor`}
                    changeType="neutral"
                    color="#FF4C00"
                />
                <CrmStatCard
                    icon={<Bike size={22} />}
                    label="Jami motolar"
                    value={motos.length}
                    change={`${soldMotos} sotilgan`}
                    changeType="up"
                    color="#00C853"
                />
                <CrmStatCard
                    icon={<DollarSign size={22} />}
                    label="Umumiy sotuv"
                    value={`${formatPrice(totalIncome)} so'm`}
                    change="+18.5%"
                    changeType="up"
                    color="#2196F3"
                />
                <CrmStatCard
                    icon={<TrendingUp size={22} />}
                    label="Sof foyda"
                    value={`${formatPrice(totalProfit)} so'm`}
                    change="+12.3%"
                    changeType="up"
                    color="#9C27B0"
                />
                <CrmStatCard
                    icon={<Users size={22} />}
                    label="Faol ishchilar"
                    value={activeWorkers}
                    change={`${workers.length} jami`}
                    changeType="neutral"
                    color="#FF9800"
                />
                <CrmStatCard
                    icon={<Package size={22} />}
                    label="Sklad holati"
                    value={`${parts.reduce((s, p) => s + p.quantity, 0)} detal`}
                    change={lowStockParts.length > 0 ? `${lowStockParts.length} kam!` : "Yetarli"}
                    changeType={lowStockParts.length > 0 ? 'down' : 'up'}
                    color={lowStockParts.length > 0 ? '#F44336' : '#4CAF50'}
                />
            </div>

            {/* Charts */}
            <div className="crm-charts-row">
                <div className="admin-card crm-chart-card">
                    <div className="card-header">
                        <h3 className="card-title">Ishlab chiqarish va Sotuv</h3>
                    </div>
                    <div className="crm-chart-body">
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={productionChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="name" stroke="var(--text3)" fontSize={12} />
                                <YAxis stroke="var(--text3)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)' }}
                                />
                                <Legend />
                                <Bar dataKey="ishlab_chiqarish" name="Ishlab chiqarish" fill="#FF4C00" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="sotuv" name="Sotuv" fill="#00C853" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="admin-card crm-chart-card">
                    <div className="card-header">
                        <h3 className="card-title">Moliyaviy oqim</h3>
                    </div>
                    <div className="crm-chart-body">
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={financeChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="name" stroke="var(--text3)" fontSize={12} />
                                <YAxis stroke="var(--text3)" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)' }}
                                    formatter={(value: any) => formatPrice(Number(value)) + " so'm"}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="kirim" name="Kirim" stroke="#00C853" fill="#00C85320" strokeWidth={2} />
                                <Area type="monotone" dataKey="chiqim" name="Chiqim" stroke="#F44336" fill="#F4433620" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Alerts + Quick Actions */}
            <div className="crm-alerts-row">
                {/* Alerts */}
                <div className="admin-card">
                    <div className="card-header">
                        <h3 className="card-title">⚠️ Ogohlantirishlar</h3>
                    </div>
                    <div className="crm-alerts-list">
                        {lowStockParts.map(p => (
                            <div key={p.id} className="crm-alert crm-alert--warning">
                                <AlertTriangle size={16} />
                                <span><strong>{p.name}</strong> — faqat {p.quantity} {p.unit} qoldi (min: {p.minStock})</span>
                            </div>
                        ))}
                        {unpaidSalary > 0 && (
                            <div className="crm-alert crm-alert--danger">
                                <DollarSign size={16} />
                                <span><strong>{formatPrice(unpaidSalary)} so'm</strong> ish haqi to'lanmagan</span>
                            </div>
                        )}
                        {pendingOrders.length > 0 && (
                            <div className="crm-alert crm-alert--info">
                                <Activity size={16} />
                                <span><strong>{pendingOrders.length}</strong> ta buyurtma to'liq to'lanmagan</span>
                            </div>
                        )}
                        {lowStockParts.length === 0 && unpaidSalary === 0 && pendingOrders.length === 0 && (
                            <div className="crm-alert crm-alert--success">
                                <span>✅ Hozircha muammolar yo'q</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="admin-card">
                    <div className="card-header">
                        <h3 className="card-title">⚡ Tezkor amallar</h3>
                    </div>
                    <div className="crm-quick-actions">
                        <button className="crm-quick-btn" onClick={() => navigate('/panel/crm/production')}>
                            <Factory size={18} />
                            <span>Yangi yig'ish</span>
                        </button>
                        <button className="crm-quick-btn" onClick={() => navigate('/panel/crm/motos')}>
                            <Bike size={18} />
                            <span>Moto qo'shish</span>
                        </button>
                        <button className="crm-quick-btn" onClick={() => navigate('/panel/crm/workers')}>
                            <Users size={18} />
                            <span>Ishchi qo'shish</span>
                        </button>
                        <button className="crm-quick-btn" onClick={() => navigate('/panel/crm/sales')}>
                            <DollarSign size={18} />
                            <span>Buyurtma yaratish</span>
                        </button>
                        <button className="crm-quick-btn" onClick={() => navigate('/panel/crm/inventory')}>
                            <Package size={18} />
                            <span>Detal kirim</span>
                        </button>
                        <button className="crm-quick-btn" onClick={() => navigate('/panel/crm/finance')}>
                            <TrendingUp size={18} />
                            <span>Xarajat kiritish</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="admin-card">
                <div className="card-header">
                    <h3 className="card-title">Oxirgi moliyaviy harakatlar</h3>
                </div>
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Sana</th>
                                <th>Tavsif</th>
                                <th>Kategoriya</th>
                                <th>Turi</th>
                                <th>Summa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map(tx => (
                                <tr key={tx.id}>
                                    <td className="font-mono">{tx.date}</td>
                                    <td className="font-bold">{tx.description}</td>
                                    <td><CrmBadge status={tx.category} size="sm" /></td>
                                    <td><CrmBadge status={tx.type} size="sm" /></td>
                                    <td style={{ color: tx.type === 'income' ? '#00C853' : '#F44336', fontWeight: 600 }}>
                                        {tx.type === 'income' ? '+' : '-'}{formatPrice(tx.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
