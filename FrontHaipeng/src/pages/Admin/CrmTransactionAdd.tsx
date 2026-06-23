import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrmStore } from '../../store/crmStore';
import CrmPageHeader from '../../components/Admin/CrmPageHeader';
import CrmBadge from '../../components/Admin/CrmBadge';
import type { PaymentMethod, TransactionCategory, TransactionType } from '../../types/crm';
import {
    ArrowLeft, Save, Banknote, CreditCard, ArrowRightLeft,
    Image, AlertTriangle, CheckCircle, User, Truck,
    TrendingUp, TrendingDown
} from 'lucide-react';

function formatPrice(n: number) {
    return new Intl.NumberFormat('uz-UZ').format(n);
}

const methodIcons: Record<PaymentMethod, any> = { cash: Banknote, card: CreditCard, transfer: ArrowRightLeft };
const methodLabels: Record<PaymentMethod, string> = { cash: 'Naqd pul', card: 'Plastik karta', transfer: "Bank o'tkazmasi" };
const catLabels: Record<TransactionCategory, string> = { salary: 'Ish haqi', parts: 'Detallar xaridi', sale: 'Sotuv', other: 'Boshqa' };

export default function CrmTransactionAdd() {
    const navigate = useNavigate();
    const workers = useCrmStore(s => s.workers);
    const suppliers = useCrmStore(s => s.suppliers);
    const addTransaction = useCrmStore(s => s.addTransaction);

    const [form, setForm] = useState({
        type: 'expense' as TransactionType,
        category: 'other' as TransactionCategory,
        amount: 0,
        description: '',
        method: 'cash' as PaymentMethod,
        note: '',
        receipt: '',
        relatedWorkerId: '',
        relatedSupplierId: '',
    });
    const [receiptPreview, setReceiptPreview] = useState('');
    const [saved, setSaved] = useState(false);

    const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            setForm(f => ({ ...f, receipt: result }));
            setReceiptPreview(result);
        };
        reader.readAsDataURL(file);
    };

    const removeReceipt = () => {
        setForm(f => ({ ...f, receipt: '' }));
        setReceiptPreview('');
    };

    const isValid = form.description.trim().length > 0 && form.amount > 0;

    const handleSave = () => {
        if (!isValid) return;
        addTransaction({
            type: form.type,
            category: form.category,
            amount: form.amount,
            description: form.description,
            method: form.method,
            date: new Date().toISOString().split('T')[0],
            status: 'completed',
            createdBy: 'Admin',
            note: form.note || undefined,
            receipt: form.receipt || undefined,
            relatedWorkerId: form.relatedWorkerId || undefined,
            relatedSupplierId: form.relatedSupplierId || undefined,
        });
        setSaved(true);
        setTimeout(() => navigate('/panel/crm/finance'), 1200);
    };

    if (saved) {
        return (
            <div className="admin-content">
                <div className="crm-empty-state">
                    <div className="crm-empty-icon" style={{ background: '#00C85315', color: '#00C853' }}><CheckCircle size={48} /></div>
                    <h3 className="crm-empty-title">Tranzaksiya muvaffaqiyatli saqlandi!</h3>
                    <p style={{ color: 'var(--text3)' }}>Moliya sahifasiga yo'naltirilmoqda...</p>
                </div>
            </div>
        );
    }

    const MethodIcon = methodIcons[form.method];

    return (
        <div className="admin-content">
            <CrmPageHeader
                title="Yangi tranzaksiya"
                subtitle="Kirim yoki chiqim qo'shish"
                actions={
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-secondary" onClick={() => navigate('/panel/crm/finance')}>
                            <ArrowLeft size={18} /> Bekor
                        </button>
                        <button className="btn-primary" onClick={handleSave} disabled={!isValid} style={{ opacity: isValid ? 1 : 0.5 }}>
                            <Save size={18} /> Saqlash
                        </button>
                    </div>
                }
            />

            <div className="txd-grid">
                {/* Left: Form */}
                <div>
                    {/* Type selector */}
                    <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                        <div className="card-header"><h3 className="card-title">💰 Tranzaksiya turi</h3></div>
                        <div className="txa-type-selector">
                            <button
                                className={`txa-type-btn ${form.type === 'expense' ? 'txa-type-btn--active txa-type-btn--expense' : ''}`}
                                onClick={() => setForm({ ...form, type: 'expense' })}
                            >
                                <TrendingDown size={22} />
                                <span>Chiqim</span>
                                <small>Xarajat kiritish</small>
                            </button>
                            <button
                                className={`txa-type-btn ${form.type === 'income' ? 'txa-type-btn--active txa-type-btn--income' : ''}`}
                                onClick={() => setForm({ ...form, type: 'income' })}
                            >
                                <TrendingUp size={22} />
                                <span>Kirim</span>
                                <small>Daromad kiritish</small>
                            </button>
                        </div>
                    </div>

                    {/* Main details */}
                    <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                        <div className="card-header"><h3 className="card-title">📋 Asosiy ma'lumotlar</h3></div>
                        <div style={{ padding: '0.5rem 0' }}>
                            <div className="form-group">
                                <label>Kategoriya *</label>
                                <div className="txa-cat-grid">
                                    {(['salary', 'parts', 'sale', 'other'] as TransactionCategory[]).map(c => (
                                        <button
                                            key={c}
                                            className={`txa-cat-btn ${form.category === c ? 'txa-cat-btn--active' : ''}`}
                                            onClick={() => setForm({ ...form, category: c, relatedWorkerId: '', relatedSupplierId: '' })}
                                        >
                                            {c === 'salary' && '👷'}{c === 'parts' && '🔧'}{c === 'sale' && '🛒'}{c === 'other' && '📦'}
                                            <span>{catLabels[c]}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Summa (so'm) *</label>
                                <input
                                    type="number"
                                    value={form.amount || ''}
                                    onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
                                    placeholder="1 000 000"
                                    style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}
                                />
                                {form.amount > 0 && (
                                    <div style={{ marginTop: '0.5rem', color: form.type === 'income' ? '#00C853' : '#F44336', fontWeight: 600, fontSize: '0.9rem' }}>
                                        {form.type === 'income' ? '+' : '-'}{formatPrice(form.amount)} so'm
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Tavsif *</label>
                                <input
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder="Masalan: Motor (150cc) - 2 dona xarid qilindi"
                                />
                            </div>
                            <div className="form-group">
                                <label>To'lov usuli</label>
                                <div className="txa-method-grid">
                                    {(['cash', 'card', 'transfer'] as PaymentMethod[]).map(m => {
                                        const Icon = methodIcons[m];
                                        return (
                                            <button
                                                key={m}
                                                className={`txa-method-btn ${form.method === m ? 'txa-method-btn--active' : ''}`}
                                                onClick={() => setForm({ ...form, method: m })}
                                            >
                                                <Icon size={18} />
                                                <span>{methodLabels[m]}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Linked entities */}
                    <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                        <div className="card-header"><h3 className="card-title">🔗 Bog'langan shaxs</h3></div>
                        <div style={{ padding: '0.5rem 0' }}>
                            {form.category === 'salary' && (
                                <div className="form-group">
                                    <label><User size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Ishchi</label>
                                    <select value={form.relatedWorkerId} onChange={e => setForm({ ...form, relatedWorkerId: e.target.value })}>
                                        <option value="">— Tanlanmagan —</option>
                                        {workers.filter(w => w.status === 'active').map(w => (
                                            <option key={w.id} value={w.id}>{w.name} — {w.position}</option>
                                        ))}
                                    </select>
                                    {form.relatedWorkerId && (
                                        <div className="txa-linked-preview">
                                            <User size={16} />
                                            <span>{workers.find(w => w.id === form.relatedWorkerId)?.name}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                            {form.category === 'parts' && (
                                <div className="form-group">
                                    <label><Truck size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Yetkazuvchi</label>
                                    <select value={form.relatedSupplierId} onChange={e => setForm({ ...form, relatedSupplierId: e.target.value })}>
                                        <option value="">— Tanlanmagan —</option>
                                        {suppliers.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                    {form.relatedSupplierId && (
                                        <div className="txa-linked-preview">
                                            <Truck size={16} />
                                            <span>{suppliers.find(s => s.id === form.relatedSupplierId)?.name}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                            {form.category !== 'salary' && form.category !== 'parts' && (
                                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text3)', fontSize: '0.88rem' }}>
                                    <AlertTriangle size={20} style={{ opacity: 0.4, marginBottom: '0.5rem' }} /><br />
                                    "{catLabels[form.category]}" kategoriyasi uchun shaxs tanlash shart emas
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Note + Receipt */}
                    <div className="admin-card">
                        <div className="card-header"><h3 className="card-title">📝 Qo'shimcha</h3></div>
                        <div style={{ padding: '0.5rem 0' }}>
                            <div className="form-group">
                                <label>Izoh (ixtiyoriy)</label>
                                <textarea
                                    value={form.note}
                                    onChange={e => setForm({ ...form, note: e.target.value })}
                                    placeholder="Qo'shimcha ma'lumot, chek raqami, shartnoma raqami..."
                                    rows={3}
                                />
                            </div>
                            <div className="form-group">
                                <label><Image size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Chek / Kvitansiya (ixtiyoriy)</label>
                                <div className="txd-receipt-upload">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleReceiptUpload}
                                    />
                                    {receiptPreview && (
                                        <div className="txd-receipt-preview">
                                            <img src={receiptPreview} alt="Chek" />
                                            <button className="txd-receipt-remove" onClick={removeReceipt}>✕</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Live Preview */}
                <div>
                    <div className="admin-card txa-preview-card" style={{ position: 'sticky', top: '1rem' }}>
                        <div className="card-header"><h3 className="card-title">👁 Oldindan ko'rish</h3></div>
                        <div className="txa-preview">
                            <div className="txa-preview-amount" style={{ color: form.type === 'income' ? '#00C853' : '#F44336' }}>
                                {form.type === 'income' ? '+' : '-'}{form.amount > 0 ? formatPrice(form.amount) : '0'} so'm
                            </div>
                            <div className="txa-preview-desc">{form.description || 'Tavsif ko\'rsatilmagan'}</div>

                            <div className="txa-preview-badges">
                                <CrmBadge status={form.type} size="sm" />
                                <CrmBadge status={form.category} size="sm" />
                                <span className="finance-status finance-status--done"><CheckCircle size={13} /> Yakunlangan</span>
                            </div>

                            <div className="txa-preview-details">
                                <div className="txa-preview-row">
                                    <span>📅 Sana</span>
                                    <span className="font-mono">{new Date().toISOString().split('T')[0]}</span>
                                </div>
                                <div className="txa-preview-row">
                                    <span><MethodIcon size={14} /> To'lov</span>
                                    <span>{methodLabels[form.method]}</span>
                                </div>
                                <div className="txa-preview-row">
                                    <span><User size={14} /> Kim</span>
                                    <span>Admin</span>
                                </div>
                                {form.relatedWorkerId && (
                                    <div className="txa-preview-row">
                                        <span>👷 Ishchi</span>
                                        <span style={{ color: '#2196F3' }}>{workers.find(w => w.id === form.relatedWorkerId)?.name}</span>
                                    </div>
                                )}
                                {form.relatedSupplierId && (
                                    <div className="txa-preview-row">
                                        <span>🚛 Yetkazuvchi</span>
                                        <span style={{ color: '#9C27B0' }}>{suppliers.find(s => s.id === form.relatedSupplierId)?.name}</span>
                                    </div>
                                )}
                                {form.note && (
                                    <div className="txa-preview-row">
                                        <span>📝 Izoh</span>
                                        <span>{form.note}</span>
                                    </div>
                                )}
                                {receiptPreview && (
                                    <div className="txa-preview-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                                        <span>🧾 Chek</span>
                                        <img src={receiptPreview} alt="Chek" style={{ maxHeight: 80, borderRadius: 6, border: '1px solid var(--border)' }} />
                                    </div>
                                )}
                            </div>

                            {!isValid && (
                                <div className="crm-alert crm-alert--warning" style={{ marginTop: '1rem' }}>
                                    <AlertTriangle size={16} />
                                    <span>Tavsif va summa to'ldirilishi shart</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
