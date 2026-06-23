import { useState } from 'react';
import { useCrmStore } from '../../store/crmStore';
import { useNavigate } from 'react-router-dom';
import CrmPageHeader from '../../components/Admin/CrmPageHeader';
import CrmBadge from '../../components/Admin/CrmBadge';
import CrmModal from '../../components/Admin/CrmModal';
import CrmTabs from '../../components/Admin/CrmTabs';
import CrmStatCard from '../../components/Admin/CrmStatCard';
import type { PaymentMethod } from '../../types/crm';
import {
    Plus, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight,
    Banknote, CreditCard, ArrowRightLeft,
    Eye, Image, ChevronRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { financeChartData } from '../../data/mockData';

function formatPrice(n: number) {
    return new Intl.NumberFormat('uz-UZ').format(n);
}

const methodIcons: Record<PaymentMethod, any> = {
    cash: Banknote,
    card: CreditCard,
    transfer: ArrowRightLeft,
};
const methodLabels: Record<PaymentMethod, string> = {
    cash: 'Naqd',
    card: 'Karta',
    transfer: "O'tkazma",
};

// const catLabels: Record<TransactionCategory, string> = { ... };

export default function CrmFinance() {
    const transactions = useCrmStore(s => s.transactions);
    const motos = useCrmStore(s => s.motos);
    const workers = useCrmStore(s => s.workers);
    // const workerTasks = useCrmStore(s => s.workerTasks);
    const workerPayments = useCrmStore(s => s.workerPayments);
    const suppliers = useCrmStore(s => s.suppliers);
    const addTransaction = useCrmStore(s => s.addTransaction);
    const getWorkerBalance = useCrmStore(s => s.getWorkerBalance);
    const getWorkerTotalPaid = useCrmStore(s => s.getWorkerTotalPaid);
    const navigate = useNavigate();

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const totalProfit = totalIncome - totalExpense;

    const [activeTab, setActiveTab] = useState('transactions');
    const [showModal, setShowModal] = useState(false);
    const [receiptPreview, setReceiptPreview] = useState<string>('');
    const [form, setForm] = useState({
        type: 'expense' as any,
        category: 'other' as any,
        amount: 0,
        description: '',
        method: 'cash' as PaymentMethod,
        note: '',
        receipt: '',
        relatedWorkerId: '',
        relatedSupplierId: '',
    });

    const recentTransactions = [...transactions]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 10);

    const soldMotos = motos.filter(m => m.status === 'sold');
    // const unpaidTasks = workerTasks.filter(t => !t.paid);
    const pendingTx = transactions.filter(t => t.status === 'pending');

    // const getLinkedName = (tx: typeof transactions[0]) => { ... };

    const handleAdd = () => {
        if (!form.description || form.amount <= 0) return;
        addTransaction({
            ...form,
            date: new Date().toISOString().split('T')[0],
            status: 'completed',
            createdBy: 'Admin',
            relatedWorkerId: form.relatedWorkerId || undefined,
            relatedSupplierId: form.relatedSupplierId || undefined,
            note: form.note || undefined,
            receipt: form.receipt || undefined,
        });
        setShowModal(false);
        setReceiptPreview('');
        setForm({ type: 'expense', category: 'other', amount: 0, description: '', method: 'cash', note: '', receipt: '', relatedWorkerId: '', relatedSupplierId: '' });
    };

    const tabs = [
        { id: 'transactions', label: 'Tranzaksiyalar', count: transactions.length },
        { id: 'profit', label: 'Foyda', count: soldMotos.length },
        { id: 'salary', label: 'Ish haqi', count: workers.filter(w => w.status === 'active').length },
        { id: 'report', label: 'Hisobot' },
    ];



    return (
        <div className="admin-content">
            <CrmPageHeader
                title="Moliya"
                subtitle="Kirim, chiqim, foyda va ish haqi boshqaruvi"
                actions={
                    <button className="btn-primary" onClick={() => setShowModal(true)}>
                        <Plus size={18} /> Tranzaksiya
                    </button>
                }
            />

            {/* Finance Stats */}
            <div className="crm-stats-grid crm-stats-grid--4">
                <CrmStatCard icon={<ArrowUpRight size={22} />} label="Jami kirim" value={`${formatPrice(totalIncome)}`} change={`${transactions.filter(t => t.type === 'income').length} ta`} changeType="up" color="#00C853" />
                <CrmStatCard icon={<ArrowDownRight size={22} />} label="Jami chiqim" value={`${formatPrice(totalExpense)}`} change={`${transactions.filter(t => t.type === 'expense').length} ta`} changeType="down" color="#F44336" />
                <CrmStatCard icon={<TrendingUp size={22} />} label="Sof foyda" value={`${formatPrice(totalProfit)}`} color="#2196F3" />
                <CrmStatCard icon={<Wallet size={22} />} label="Kutilayotgan" value={`${formatPrice(pendingTx.reduce((s, t) => s + t.amount, 0))}`} change={`${pendingTx.length} ta pending`} changeType={pendingTx.length > 0 ? 'down' : 'neutral'} color={pendingTx.length > 0 ? '#FF9800' : '#00C853'} />
            </div>

            <CrmTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === 'transactions' && (
                <>
                    <div className="admin-card">
                        <div className="card-header" style={{ justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
                            <h3 className="card-title">Oxirgi tranzaksiyalar</h3>
                            <button className="btn-secondary btn-sm" onClick={() => navigate('/panel/crm/transactions')}>
                                Barchasini ko'rish <ChevronRight size={16} />
                            </button>
                        </div>
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Sana</th>
                                        <th>Tavsif</th>
                                        <th>Kategoriya</th>
                                        <th>Usul</th>
                                        <th>Summa</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.map(tx => {
                                        const MethodIcon = methodIcons[tx.method];
                                        return (
                                            <tr key={tx.id}>
                                                <td className="font-mono">{tx.date}</td>
                                                <td>
                                                    <div style={{ fontWeight: 600 }}>{tx.description}</div>
                                                </td>
                                                <td><CrmBadge status={tx.category} size="sm" /></td>
                                                <td>
                                                    <div className="finance-method">
                                                        <MethodIcon size={14} />
                                                        <span>{methodLabels[tx.method]}</span>
                                                    </div>
                                                </td>
                                                <td style={{ color: tx.type === 'income' ? '#00C853' : '#F44336', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                                    {tx.type === 'income' ? '+' : '-'}{formatPrice(tx.amount)}
                                                </td>
                                                <td>
                                                    <button className="crm-action-btn crm-action-btn--primary" title="Batafsil" onClick={() => navigate(`/panel/crm/finance/${tx.id}`)}>
                                                        <Eye size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div style={{ padding: '15px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                            <button className="btn-text" onClick={() => navigate('/panel/crm/transactions')}>
                                Ko'proq ko'rish uchun tranzaksiyalar bo'limiga o'ting
                            </button>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'profit' && (
                <div className="admin-card">
                    <div className="card-header"><h3 className="card-title">Har bir moto foydasi</h3></div>
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Model</th>
                                    <th>Seriya №</th>
                                    <th>Tannarx</th>
                                    <th>Sotuv narxi</th>
                                    <th>Foyda</th>
                                    <th>Foyda %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {soldMotos.map(m => {
                                    const profit = m.sellPrice - m.costPrice;
                                    const pct = ((profit / m.costPrice) * 100).toFixed(1);
                                    return (
                                        <tr key={m.id}>
                                            <td className="font-bold">{m.model}</td>
                                            <td className="font-mono">{m.serialNumber}</td>
                                            <td>{formatPrice(m.costPrice)}</td>
                                            <td>{formatPrice(m.sellPrice)}</td>
                                            <td style={{ color: '#00C853', fontWeight: 700 }}>+{formatPrice(profit)}</td>
                                            <td style={{ color: '#00C853', fontWeight: 600 }}>{pct}%</td>
                                        </tr>
                                    );
                                })}
                                <tr style={{ background: 'var(--bg3)', fontWeight: 700 }}>
                                    <td colSpan={2}>JAMI</td>
                                    <td>{formatPrice(soldMotos.reduce((s, m) => s + m.costPrice, 0))}</td>
                                    <td>{formatPrice(soldMotos.reduce((s, m) => s + m.sellPrice, 0))}</td>
                                    <td style={{ color: '#00C853' }}>+{formatPrice(soldMotos.reduce((s, m) => s + m.sellPrice - m.costPrice, 0))}</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'salary' && (
                <div className="admin-card">
                    <div className="card-header"><h3 className="card-title">Ishchilar moliyaviy holati</h3></div>
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Ishchi</th>
                                    <th>Oylik</th>
                                    <th>Jami to'langan</th>
                                    <th>Qoldiq</th>
                                    <th>Avanslar</th>
                                    <th>Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workers.filter(w => w.status === 'active').map(w => {
                                    const paid = getWorkerTotalPaid(w.id);
                                    const balance = getWorkerBalance(w.id);
                                    const advances = workerPayments.filter(p => p.workerId === w.id && p.type === 'advance');
                                    return (
                                        <tr key={w.id}>
                                            <td>
                                                <div className="user-table-info">
                                                    <div className="user-avatar-small">{w.name.charAt(0)}</div>
                                                    <div>
                                                        <strong>{w.name}</strong>
                                                        <small style={{ color: 'var(--text3)', display: 'block', fontSize: '0.78rem' }}>{w.position}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{formatPrice(w.baseSalary)}</td>
                                            <td style={{ color: '#00C853', fontWeight: 600 }}>{formatPrice(paid)}</td>
                                            <td style={{ color: balance > 0 ? '#F44336' : '#00C853', fontWeight: 600 }}>
                                                {balance > 0 ? formatPrice(balance) : balance === 0 ? '—' : `+${formatPrice(Math.abs(balance))}`}
                                            </td>
                                            <td>
                                                {advances.length > 0 ? (
                                                    <span style={{ color: '#FF9800', fontWeight: 600 }}>{advances.length} ta ({formatPrice(advances.reduce((s, a) => s + a.amount, 0))})</span>
                                                ) : '—'}
                                            </td>
                                            <td>
                                                <button className="crm-action-btn crm-action-btn--primary" title="Profil" onClick={() => navigate(`/panel/crm/workers/${w.id}`)}>
                                                    <Eye size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'report' && (
                <div className="admin-card crm-chart-card">
                    <div className="card-header"><h3 className="card-title">Oylik moliyaviy hisobot</h3></div>
                    <div className="crm-chart-body">
                        <ResponsiveContainer width="100%" height={350}>
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
            )}

            {/* Add Transaction Modal */}
            <CrmModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Yangi tranzaksiya"
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => setShowModal(false)}>Bekor</button>
                        <button className="btn-primary" onClick={handleAdd}>Qo'shish</button>
                    </>
                }
            >
                <div className="form-grid-2">
                    <div className="form-group">
                        <label>Turi</label>
                        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                            <option value="income">Kirim</option>
                            <option value="expense">Chiqim</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Kategoriya</label>
                        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                            <option value="sale">Sotuv</option>
                            <option value="parts">Detallar</option>
                            <option value="salary">Ish haqi</option>
                            <option value="other">Boshqa</option>
                        </select>
                    </div>
                </div>
                <div className="form-grid-2">
                    <div className="form-group">
                        <label>Summa (so'm)</label>
                        <input type="number" value={form.amount || ''} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} placeholder="1 000 000" />
                    </div>
                    <div className="form-group">
                        <label>To'lov usuli</label>
                        <select value={form.method} onChange={e => setForm({ ...form, method: e.target.value as PaymentMethod })}>
                            <option value="cash">💵 Naqd</option>
                            <option value="card">💳 Karta</option>
                            <option value="transfer">🏦 O'tkazma</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label>Tavsif</label>
                    <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Tranzaksiya tavsifi" />
                </div>
                {form.category === 'salary' && (
                    <div className="form-group">
                        <label>Ishchi (ixtiyoriy)</label>
                        <select value={form.relatedWorkerId} onChange={e => setForm({ ...form, relatedWorkerId: e.target.value })}>
                            <option value="">Tanlanmagan</option>
                            {workers.filter(w => w.status === 'active').map(w => (
                                <option key={w.id} value={w.id}>{w.name} — {w.position}</option>
                            ))}
                        </select>
                    </div>
                )}
                {form.category === 'parts' && (
                    <div className="form-group">
                        <label>Yetkazuvchi (ixtiyoriy)</label>
                        <select value={form.relatedSupplierId} onChange={e => setForm({ ...form, relatedSupplierId: e.target.value })}>
                            <option value="">Tanlanmagan</option>
                            {suppliers.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="form-group">
                    <label>Izoh (ixtiyoriy)</label>
                    <textarea value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="Qo'shimcha ma'lumot..." rows={2} />
                </div>
                <div className="form-group">
                    <label><Image size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Chek / Kvitansiya (ixtiyoriy)</label>
                    <div className="txd-receipt-upload">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        const result = reader.result as string;
                                        setForm({ ...form, receipt: result });
                                        setReceiptPreview(result);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                        {receiptPreview && (
                            <div className="txd-receipt-preview">
                                <img src={receiptPreview} alt="Chek" />
                                <button className="txd-receipt-remove" onClick={() => { setForm({ ...form, receipt: '' }); setReceiptPreview(''); }}>✕</button>
                            </div>
                        )}
                    </div>
                </div>
            </CrmModal>
        </div>
    );
}
