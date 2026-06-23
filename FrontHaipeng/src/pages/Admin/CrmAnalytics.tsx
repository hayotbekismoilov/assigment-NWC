import { useCrmStore } from '../../store/crmStore';
import CrmPageHeader from '../../components/Admin/CrmPageHeader';
import CrmStatCard from '../../components/Admin/CrmStatCard';
import { BarChart3, TrendingUp, Users, Factory, Award, Bike } from 'lucide-react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { productionChartData, financeChartData, modelSalesData } from '../../data/mockData';

function formatPrice(n: number) {
    return new Intl.NumberFormat('uz-UZ').format(n);
}

const COLORS = ['#FF4C00', '#00C853', '#2196F3', '#9C27B0', '#FF9800', '#F44336'];

export default function CrmAnalytics() {
    const transactions = useCrmStore(s => s.transactions);
    const workers = useCrmStore(s => s.workers);
    const motos = useCrmStore(s => s.motos);
    const getWorkerMotoCount = useCrmStore(s => s.getWorkerMotoCount);
    const getWorkerEarnings = useCrmStore(s => s.getWorkerEarnings);

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const totalProfit = totalIncome - totalExpense;
    const assemblingMotos = motos.filter(m => m.status === 'assembling').length;
    const soldMotos = motos.filter(m => m.status === 'sold').length;

    // Worker performance data
    const workerPerformance = workers
        .filter(w => w.status === 'active')
        .map(w => ({
            name: w.name.split(' ')[0],
            moto: getWorkerMotoCount(w.id),
            daromad: getWorkerEarnings(w.id),
        }))
        .sort((a, b) => b.moto - a.moto)
        .slice(0, 8);

    // Model distribution pie chart
    const modelDistribution = motos.reduce<Record<string, number>>((acc, m) => {
        acc[m.model] = (acc[m.model] || 0) + 1;
        return acc;
    }, {});
    const pieData = Object.entries(modelDistribution).map(([name, value]) => ({ name, value }));

    return (
        <div className="admin-content">
            <CrmPageHeader
                title="Analitika"
                subtitle="Ishlab chiqarish, sotuv va ishchilar statistikasi"
            />

            {/* Top Stats */}
            <div className="crm-stats-grid crm-stats-grid--4">
                <CrmStatCard icon={<Factory size={22} />} label="Jami ishlab chiqarilgan" value={motos.filter(m => m.status !== 'pending').length} change={`${assemblingMotos} jarayonda`} changeType="neutral" color="#FF4C00" />
                <CrmStatCard icon={<Bike size={22} />} label="Sotilgan motolar" value={soldMotos} change="+28%" changeType="up" color="#00C853" />
                <CrmStatCard icon={<TrendingUp size={22} />} label="O'rtacha foyda" value={`${formatPrice(Math.round(totalProfit / Math.max(soldMotos, 1)))}`} color="#2196F3" />
                <CrmStatCard icon={<Users size={22} />} label="Eng samarali" value={workerPerformance[0]?.name || '—'} change={`${workerPerformance[0]?.moto || 0} moto`} changeType="up" color="#9C27B0" />
            </div>

            {/* Charts Grid */}
            <div className="crm-charts-row">
                {/* Production Trend */}
                <div className="admin-card crm-chart-card">
                    <div className="card-header"><h3 className="card-title">📈 Ishlab chiqarish trendi</h3></div>
                    <div className="crm-chart-body">
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={productionChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="name" stroke="var(--text3)" fontSize={12} />
                                <YAxis stroke="var(--text3)" fontSize={12} />
                                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)' }} />
                                <Legend />
                                <Line type="monotone" dataKey="ishlab_chiqarish" name="Ishlab chiqarish" stroke="#FF4C00" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                                <Line type="monotone" dataKey="sotuv" name="Sotuv" stroke="#00C853" strokeWidth={3} dot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Model Distribution */}
                <div className="admin-card crm-chart-card">
                    <div className="card-header"><h3 className="card-title">🏍️ Model taqsimoti</h3></div>
                    <div className="crm-chart-body">
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="crm-charts-row">
                {/* Top Models by Sales */}
                <div className="admin-card crm-chart-card">
                    <div className="card-header"><h3 className="card-title">💰 Eng ko'p sotilgan modellar</h3></div>
                    <div className="crm-chart-body">
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={modelSalesData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis type="number" stroke="var(--text3)" fontSize={12} />
                                <YAxis type="category" dataKey="name" stroke="var(--text3)" fontSize={12} width={100} />
                                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)' }} />
                                <Bar dataKey="sotilgan" name="Sotilgan" fill="#FF4C00" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Worker Performance */}
                <div className="admin-card crm-chart-card">
                    <div className="card-header"><h3 className="card-title">👷 Ishchilar samaradorligi</h3></div>
                    <div className="crm-chart-body">
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={workerPerformance}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="name" stroke="var(--text3)" fontSize={12} />
                                <YAxis stroke="var(--text3)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)' }}
                                    formatter={(value: any, name: string) => [name === 'daromad' ? formatPrice(Number(value)) + " so'm" : value, name === 'daromad' ? 'Daromad' : 'Moto soni']}
                                />
                                <Legend />
                                <Bar dataKey="moto" name="Moto soni" fill="#2196F3" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Monthly Finance */}
            <div className="admin-card crm-chart-card">
                <div className="card-header"><h3 className="card-title">📊 Oylik moliyaviy ko'rsatkichlar</h3></div>
                <div className="crm-chart-body">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={financeChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="name" stroke="var(--text3)" />
                            <YAxis stroke="var(--text3)" tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                            <Tooltip
                                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)' }}
                                formatter={(value: any) => formatPrice(Number(value)) + " so'm"}
                            />
                            <Legend />
                            <Bar dataKey="kirim" name="Kirim" fill="#00C853" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="chiqim" name="Chiqim" fill="#F44336" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
