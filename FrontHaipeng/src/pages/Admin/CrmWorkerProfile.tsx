import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCrmStore } from '../../store/crmStore';
import CrmPageHeader from '../../components/Admin/CrmPageHeader';
import CrmStatCard from '../../components/Admin/CrmStatCard';
import CrmBadge from '../../components/Admin/CrmBadge';
import CrmModal from '../../components/Admin/CrmModal';
import CrmTabs from '../../components/Admin/CrmTabs';
import type { WorkerPaymentType } from '../../types/crm';
import {
    ArrowLeft, DollarSign, Wallet, TrendingUp, BadgeMinus,
    Calendar, Phone, Briefcase, Clock, Plus,
    CircleDollarSign, Award, AlertTriangle, UserCheck, Bike
} from 'lucide-react';

function formatPrice(n: number) {
    return new Intl.NumberFormat('uz-UZ').format(n);
}

const paymentTypeLabels: Record<WorkerPaymentType, string> = {
    advance: 'Avans',
    salary: 'Oylik',
    bonus: 'Bonus',
    penalty: 'Jarima',
};

const paymentTypeColors: Record<WorkerPaymentType, string> = {
    advance: '#FF9800',
    salary: '#00C853',
    bonus: '#2196F3',
    penalty: '#F44336',
};

const historyIcons: Record<string, any> = {
    joined: UserCheck,
    payment: CircleDollarSign,
    task: Bike,
    bonus: Award,
    penalty: AlertTriangle,
    status_change: Clock,
};

const historyColors: Record<string, string> = {
    joined: '#00C853',
    payment: '#FF9800',
    task: '#2196F3',
    bonus: '#9C27B0',
    penalty: '#F44336',
    status_change: '#607D8B',
};

export default function CrmWorkerProfile() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const workers = useCrmStore(s => s.workers);
    const workerTasks = useCrmStore(s => s.workerTasks);
    const workerPayments = useCrmStore(s => s.workerPayments);
    const workerHistory = useCrmStore(s => s.workerHistory);
    const motos = useCrmStore(s => s.motos);
    const getWorkerEarnings = useCrmStore(s => s.getWorkerEarnings);
    const getWorkerTotalPaid = useCrmStore(s => s.getWorkerTotalPaid);
    const getWorkerBalance = useCrmStore(s => s.getWorkerBalance);
    const getWorkerMotoCount = useCrmStore(s => s.getWorkerMotoCount);
    const addWorkerPayment = useCrmStore(s => s.addWorkerPayment);

    const [activeTab, setActiveTab] = useState('payments');
    const [showPayModal, setShowPayModal] = useState(false);
    const [payForm, setPayForm] = useState({ amount: 0, type: 'advance' as WorkerPaymentType, note: '' });

    const worker = workers.find(w => w.id === id);
    if (!worker) {
        return (
            <div className="admin-content">
                <div className="crm-empty-state">
                    <div className="crm-empty-icon"><UserCheck size={48} /></div>
                    <h3 className="crm-empty-title">Ishchi topilmadi</h3>
                    <button className="btn-primary" onClick={() => navigate('/panel/crm/workers')}>
                        <ArrowLeft size={18} /> Orqaga
                    </button>
                </div>
            </div>
        );
    }

    const totalEarned = getWorkerEarnings(worker.id);
    const totalPaid = getWorkerTotalPaid(worker.id);
    const balance = getWorkerBalance(worker.id);
    const motoCount = getWorkerMotoCount(worker.id);

    const myPayments = workerPayments
        .filter(p => p.workerId === worker.id)
        .sort((a, b) => b.date.localeCompare(a.date));

    const myTasks = workerTasks
        .filter(t => t.workerId === worker.id)
        .sort((a, b) => b.date.localeCompare(a.date));

    const myHistory = workerHistory
        .filter(h => h.workerId === worker.id)
        .sort((a, b) => b.date.localeCompare(a.date));

    const getMotoModel = (motoId: string) => motos.find(m => m.id === motoId)?.model || '—';

    const handlePay = () => {
        if (payForm.amount <= 0 || !payForm.note.trim()) return;
        addWorkerPayment({
            workerId: worker.id,
            amount: payForm.amount,
            type: payForm.type,
            note: payForm.note,
        });
        setShowPayModal(false);
        setPayForm({ amount: 0, type: 'advance', note: '' });
    };

    const tabs = [
        { id: 'payments', label: "To'lovlar", count: myPayments.length },
        { id: 'tasks', label: 'Ishlar', count: myTasks.length },
        { id: 'history', label: 'Istoriya', count: myHistory.length },
    ];

    return (
        <div className="admin-content">
            <CrmPageHeader
                title={worker.name}
                subtitle={worker.position}
                actions={
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-secondary" onClick={() => navigate('/panel/crm/workers')}>
                            <ArrowLeft size={18} /> Orqaga
                        </button>
                        <button className="btn-primary" onClick={() => setShowPayModal(true)}>
                            <Plus size={18} /> Pul berish
                        </button>
                    </div>
                }
            />

            {/* Worker Info Card */}
            <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                <div className="worker-profile-info">
                    <div className="worker-profile-avatar">
                        {worker.name.charAt(0)}
                    </div>
                    <div className="worker-profile-details">
                        <div className="worker-profile-name">
                            <h2 style={{ margin: 0, fontFamily: "'Outfit', sans-serif" }}>{worker.name}</h2>
                            <CrmBadge status={worker.status} />
                        </div>
                        <div className="worker-profile-meta">
                            <span><Briefcase size={14} /> {worker.position}</span>
                            <span><Phone size={14} /> {worker.phone}</span>
                            <span><Calendar size={14} /> Ishga kirgan: {worker.joinedAt}</span>
                            <span><DollarSign size={14} /> {worker.payType === 'fixed' ? 'Oylik' : worker.payType === 'per_moto' ? 'Har moto' : 'Har ish'}: {formatPrice(worker.payRate)} so'm</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Salary Summary Stats */}
            <div className="crm-stats-grid crm-stats-grid--4">
                <CrmStatCard
                    icon={<Wallet size={22} />}
                    label="Oylik"
                    value={`${formatPrice(worker.baseSalary)}`}
                    change={worker.payType === 'fixed' ? 'Oylik' : 'Baza oylik'}
                    changeType="neutral"
                    color="#2196F3"
                />
                <CrmStatCard
                    icon={<TrendingUp size={22} />}
                    label="Jami ishlagan"
                    value={`${formatPrice(totalEarned)}`}
                    change={`${motoCount} ta moto`}
                    changeType="up"
                    color="#00C853"
                />
                <CrmStatCard
                    icon={<DollarSign size={22} />}
                    label="Jami to'langan"
                    value={`${formatPrice(totalPaid)}`}
                    change={`${myPayments.length} ta to'lov`}
                    changeType="neutral"
                    color="#FF9800"
                />
                <CrmStatCard
                    icon={<BadgeMinus size={22} />}
                    label="Qoldiq balans"
                    value={`${formatPrice(Math.abs(balance))}`}
                    change={balance >= 0 ? "To'lanmagan" : "Ortiqcha to'langan"}
                    changeType={balance > 0 ? 'down' : balance < 0 ? 'up' : 'neutral'}
                    color={balance > 0 ? '#F44336' : '#00C853'}
                />
            </div>

            {/* Balance Bar */}
            <div className="admin-card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text3)' }}>Oylik to'lov jarayoni</span>
                    <span style={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>
                        {formatPrice(totalPaid)} / {formatPrice(worker.baseSalary)} so'm
                    </span>
                </div>
                <div className="worker-balance-bar">
                    <div
                        className="worker-balance-fill"
                        style={{
                            width: `${Math.min(100, (totalPaid / Math.max(worker.baseSalary, 1)) * 100)}%`,
                            background: totalPaid >= worker.baseSalary ? '#00C853' : '#FF9800',
                        }}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--text3)' }}>
                    <span>0</span>
                    <span>{totalPaid >= worker.baseSalary ? '✅ To\'liq to\'langan' : `${Math.round((totalPaid / Math.max(worker.baseSalary, 1)) * 100)}% to'langan`}</span>
                    <span>{formatPrice(worker.baseSalary)}</span>
                </div>
            </div>

            <CrmTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {/* Payments Tab */}
            {activeTab === 'payments' && (
                <div className="admin-card">
                    <div className="card-header">
                        <h3 className="card-title">💰 To'lovlar tarixi</h3>
                    </div>
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Sana</th>
                                    <th>Tur</th>
                                    <th>Summa</th>
                                    <th>Izoh</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myPayments.map(p => (
                                    <tr key={p.id}>
                                        <td className="font-mono">{p.date}</td>
                                        <td>
                                            <span className="crm-badge" style={{
                                                background: `${paymentTypeColors[p.type]}18`,
                                                color: paymentTypeColors[p.type],
                                            }}>
                                                {paymentTypeLabels[p.type]}
                                            </span>
                                        </td>
                                        <td style={{
                                            fontWeight: 700,
                                            color: p.type === 'penalty' ? '#F44336' : '#00C853',
                                        }}>
                                            {p.type === 'penalty' ? '-' : '+'}{formatPrice(p.amount)} so'm
                                        </td>
                                        <td>{p.note}</td>
                                    </tr>
                                ))}
                                {myPayments.length === 0 && (
                                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>To'lovlar topilmadi</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
                <div className="admin-card">
                    <div className="card-header">
                        <h3 className="card-title">🔧 Ishlar tarixi</h3>
                    </div>
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Sana</th>
                                    <th>Moto</th>
                                    <th>Tavsif</th>
                                    <th>Summa</th>
                                    <th>Holat</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myTasks.map(t => (
                                    <tr key={t.id}>
                                        <td className="font-mono">{t.date}</td>
                                        <td className="font-bold">{getMotoModel(t.motoId)}</td>
                                        <td>{t.description}</td>
                                        <td style={{ fontWeight: 600 }}>{formatPrice(t.amount)} so'm</td>
                                        <td><CrmBadge status={t.paid ? 'paid' : 'unpaid'} size="sm" /></td>
                                    </tr>
                                ))}
                                {myTasks.length === 0 && (
                                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>Ishlar topilmadi</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* History/Timeline Tab */}
            {activeTab === 'history' && (
                <div className="admin-card">
                    <div className="card-header">
                        <h3 className="card-title">📋 Faoliyat tarixi</h3>
                    </div>
                    <div className="worker-timeline">
                        {myHistory.map(h => {
                            const Icon = historyIcons[h.type] || Clock;
                            const color = historyColors[h.type] || 'var(--text3)';
                            return (
                                <div key={h.id} className="worker-timeline-item">
                                    <div className="worker-timeline-dot" style={{ background: `${color}20`, color }}>
                                        <Icon size={16} />
                                    </div>
                                    <div className="worker-timeline-content">
                                        <div className="worker-timeline-header">
                                            <strong>{h.description}</strong>
                                            <span className="font-mono">{h.date}</span>
                                        </div>
                                        {h.amount && (
                                            <span style={{ color, fontWeight: 600, fontSize: '0.88rem' }}>
                                                {h.type === 'penalty' ? '-' : '+'}{formatPrice(h.amount)} so'm
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {myHistory.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>
                                Istoriya topilmadi
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            <CrmModal
                isOpen={showPayModal}
                onClose={() => setShowPayModal(false)}
                title={`${worker.name} ga pul berish`}
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => setShowPayModal(false)}>Bekor</button>
                        <button className="btn-primary" onClick={handlePay}>Tasdiqlash</button>
                    </>
                }
            >
                <div className="form-group">
                    <label>To'lov turi</label>
                    <select value={payForm.type} onChange={e => setPayForm({ ...payForm, type: e.target.value as WorkerPaymentType })}>
                        <option value="advance">Avans (oldindan pul)</option>
                        <option value="salary">Oylik to'lash</option>
                        <option value="bonus">Bonus</option>
                        <option value="penalty">Jarima</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Summa (so'm)</label>
                    <input type="number" value={payForm.amount || ''} onChange={e => setPayForm({ ...payForm, amount: Number(e.target.value) })} placeholder="1 000 000" />
                </div>
                <div className="form-group">
                    <label>Izoh</label>
                    <textarea
                        value={payForm.note}
                        onChange={e => setPayForm({ ...payForm, note: e.target.value })}
                        placeholder="Masalan: Mart oyi avans, yoki bonus sababi..."
                        rows={3}
                    />
                </div>
                {payForm.type !== 'penalty' && (
                    <div className="crm-alert crm-alert--info" style={{ marginTop: '0.5rem' }}>
                        <DollarSign size={16} />
                        <span>Bu summa <strong>Moliya → Chiqimlar</strong> ga avtomatik yoziladi</span>
                    </div>
                )}
                {payForm.type === 'penalty' && (
                    <div className="crm-alert crm-alert--warning" style={{ marginTop: '0.5rem' }}>
                        <AlertTriangle size={16} />
                        <span>Jarima oylikdan ayriladi, lekin moliyaga <strong>chiqim sifatida yozilmaydi</strong></span>
                    </div>
                )}
            </CrmModal>
        </div>
    );
}
