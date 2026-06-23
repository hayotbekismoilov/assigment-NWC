import { useState, useMemo } from 'react';
import { useCrmStore } from '../../store/crmStore';
import { useNavigate } from 'react-router-dom';
import CrmPageHeader from '../../components/Admin/CrmPageHeader';
import CrmBadge from '../../components/Admin/CrmBadge';
import CrmModal from '../../components/Admin/CrmModal';
import type { PaymentMethod, TransactionCategory } from '../../types/crm';
import {
    Plus, Search, Banknote, CreditCard, ArrowRightLeft,
    User, Truck, ShoppingBag, Eye, Calendar, Filter,
    ChevronRight, Receipt, ArrowUpRight, ArrowDownRight,
    Download
} from 'lucide-react';

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

const catLabels: Record<TransactionCategory, string> = {
    salary: 'Ish haqi',
    parts: 'Detallar',
    sale: 'Sotuv',
    other: 'Boshqa',
};

export default function CrmTransactions() {
    const transactions = useCrmStore(s => s.transactions);
    const workers = useCrmStore(s => s.workers);
    const suppliers = useCrmStore(s => s.suppliers);
    const motos = useCrmStore(s => s.motos);
    const addTransaction = useCrmStore(s => s.addTransaction);
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
    const [catFilter, setCatFilter] = useState<string>('all');
    const [methodFilter, setMethodFilter] = useState<string>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState({
        type: 'expense' as any,
        category: 'other' as any,
        amount: 0,
        description: '',
        method: 'cash' as PaymentMethod,
        note: '',
        receipt: '',
    });

    // Filtering logic
    const filtered = useMemo(() => {
        return transactions
            .filter(t => typeFilter === 'all' || t.type === typeFilter)
            .filter(t => catFilter === 'all' || t.category === catFilter)
            .filter(t => methodFilter === 'all' || t.method === methodFilter)
            .filter(t =>
                t.description.toLowerCase().includes(search.toLowerCase()) ||
                (t.note || '').toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => b.date.localeCompare(a.date));
    }, [transactions, typeFilter, catFilter, methodFilter, search]);

    // Grouping logic
    const grouped = useMemo(() => {
        const groups: Record<string, typeof transactions> = {};
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        const yesterdayDate = new Date();
        yesterdayDate.setDate(now.getDate() - 1);
        const yesterday = yesterdayDate.toISOString().split('T')[0];

        filtered.forEach(t => {
            let label = t.date;
            if (t.date === today) label = 'Bugun';
            else if (t.date === yesterday) label = 'Kecha';

            if (!groups[label]) groups[label] = [];
            groups[label].push(t);
        });

        return Object.entries(groups);
    }, [filtered]);

    const handleAdd = () => {
        if (!form.description || form.amount <= 0) return;
        addTransaction({
            ...form,
            date: new Date().toISOString().split('T')[0],
            status: 'completed',
            createdBy: 'Admin',
        });
        setShowAddModal(false);
        setForm({ type: 'expense', category: 'other', amount: 0, description: '', method: 'cash', note: '', receipt: '' });
    };

    const getLinkedName = (tx: typeof transactions[0]) => {
        if (tx.relatedWorkerId) {
            const w = workers.find(x => x.id === tx.relatedWorkerId);
            return w ? { label: w.name, icon: User } : null;
        }
        if (tx.relatedSupplierId) {
            const s = suppliers.find(x => x.id === tx.relatedSupplierId);
            return s ? { label: s.name, icon: Truck } : null;
        }
        if (tx.relatedMotoId) {
            const m = motos.find(x => x.id === tx.relatedMotoId);
            return m ? { label: m.model, icon: ShoppingBag } : null;
        }
        return null;
    };

    return (
        <div className="admin-content">
            <CrmPageHeader
                title="Barcha tranzaksiyalar"
                subtitle="To'liq moliyaviy oqim va tarix"
                actions={
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn-outline" onClick={() => { }}>
                            <Download size={18} /> Excel
                        </button>
                        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                            <Plus size={18} /> Yangi tranzaksiya
                        </button>
                    </div>
                }
            />

            <div className="transactions-layout">
                {/* Filters Sidebar/Header */}
                <div className="admin-card tx-filters">
                    <div className="filter-item">
                        <label><Search size={14} /> Qidiruv</label>
                        <input
                            placeholder="Tavsif yoki izoh..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="filter-item">
                        <label><Filter size={14} /> Turi</label>
                        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)}>
                            <option value="all">Barchasi</option>
                            <option value="income">Kirim</option>
                            <option value="expense">Chiqim</option>
                        </select>
                    </div>
                    <div className="filter-item">
                        <label><Calendar size={14} /> Kategoriya</label>
                        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                            <option value="all">Barchasi</option>
                            {Object.entries(catLabels).map(([val, label]) => (
                                <option key={val} value={val}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-item">
                        <label><CreditCard size={14} /> To'lov usuli</label>
                        <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
                            <option value="all">Barchasi</option>
                            {Object.entries(methodLabels).map(([val, label]) => (
                                <option key={val} value={val}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Main List */}
                <div className="transactions-list">
                    {grouped.map(([date, items]) => (
                        <div key={date} className="tx-group">
                            <div className="tx-group-header">
                                <span>{date}</span>
                                <small>{items.length} ta operatsiya</small>
                            </div>
                            <div className="admin-card tx-cards-container">
                                {items.map(tx => {
                                    const linked = getLinkedName(tx);
                                    const MethodIcon = methodIcons[tx.method];
                                    return (
                                        <div
                                            key={tx.id}
                                            className="tx-list-item"
                                            onClick={() => navigate(`/panel/crm/finance/${tx.id}`)}
                                        >
                                            <div className="tx-item-main">
                                                <div className={`tx-type-icon ${tx.type}`}>
                                                    {tx.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                                </div>
                                                <div className="tx-info">
                                                    <div className="tx-description">
                                                        <strong>{tx.description}</strong>
                                                        {tx.receipt && <Receipt size={14} className="receipt-icon" title="Hujjat mavjud" />}
                                                    </div>
                                                    <div className="tx-meta">
                                                        <span className="tx-cat-chip">{catLabels[tx.category]}</span>
                                                        <span className="tx-method-mini">
                                                            <MethodIcon size={12} /> {methodLabels[tx.method]}
                                                        </span>
                                                        {linked && (
                                                            <span className="tx-link-mini">
                                                                <linked.icon size={12} /> {linked.label}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tx-item-right">
                                                <div className={`tx-amount ${tx.type}`}>
                                                    {tx.type === 'income' ? '+' : '-'}{formatPrice(tx.amount)}
                                                </div>
                                                <ChevronRight size={18} className="tx-arrow" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {grouped.length === 0 && (
                        <div className="admin-card empty-tx">
                            <Search size={40} />
                            <p>Hech narsa topilmadi</p>
                        </div>
                    )}
                </div>
            </div>

            <CrmModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Yangi tranzaksiya"
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => setShowAddModal(false)}>Bekor</button>
                        <button className="btn-primary" onClick={handleAdd}>Saqlash</button>
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
                <div className="form-group">
                    <label>Summa (so'm)</label>
                    <input type="number" value={form.amount || ''} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                    <label>Tavsif</label>
                    <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
            </CrmModal>

            <style>{`
                .transactions-layout {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 24px;
                    align-items: start;
                }
                .tx-filters {
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    position: sticky;
                    top: 24px;
                }
                .filter-item {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .filter-item label {
                    font-size: 0.82rem;
                    color: #999;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                .tx-group {
                    margin-bottom: 24px;
                }
                .tx-group-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 12px;
                    padding: 0 4px;
                }
                .tx-group-header span {
                    font-weight: 700;
                    font-size: 1.1rem;
                }
                .tx-group-header small {
                    color: #999;
                }
                .tx-cards-container {
                    padding: 0;
                    overflow: hidden;
                }
                .tx-list-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    cursor: pointer;
                    transition: background 0.2s;
                    border-bottom: 1px solid #f5f5f5;
                }
                .tx-list-item:last-child {
                    border-bottom: none;
                }
                .tx-list-item:hover {
                    background: #fafafa;
                }
                .tx-item-main {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .tx-type-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .tx-type-icon.income { background: #e8f5e9; color: #2e7d32; }
                .tx-type-icon.expense { background: #ffebee; color: #c62828; }
                .tx-description {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 4px;
                }
                .receipt-icon { color: #2196f3; }
                .tx-meta {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }
                .tx-cat-chip {
                    font-size: 0.75rem;
                    background: #f0f0f0;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-weight: 600;
                    color: #666;
                }
                .tx-method-mini, .tx-link-mini {
                    font-size: 0.75rem;
                    color: #999;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .tx-item-right {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                .tx-amount {
                    font-weight: 700;
                    font-size: 1.1rem;
                }
                .tx-amount.income { color: #2e7d32; }
                .tx-amount.expense { color: #c62828; }
                .tx-arrow { color: #ccc; }
                .empty-tx {
                    padding: 60px;
                    text-align: center;
                    color: #ccc;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                }
                @media (max-width: 992px) {
                    .transactions-layout {
                        grid-template-columns: 1fr;
                    }
                    .tx-filters {
                        flex-direction: row;
                        overflow-x: auto;
                        padding: 15px;
                    }
                    .filter-item {
                        min-width: 150px;
                    }
                }
            `}</style>
        </div>
    );
}
