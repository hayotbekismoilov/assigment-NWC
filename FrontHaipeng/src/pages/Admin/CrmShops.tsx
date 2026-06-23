import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCrmStore } from '../../store/crmStore';
import CrmPageHeader from '../../components/Admin/CrmPageHeader';
import CrmBadge from '../../components/Admin/CrmBadge';
import CrmModal from '../../components/Admin/CrmModal';
import {
    Plus, Edit, Trash2, Search, MapPin, Phone,
    User, Store, TrendingUp, CreditCard, ArrowRightLeft,
    AlertCircle, CheckCircle2
} from 'lucide-react';

export default function CrmShops() {
    const shops = useCrmStore(s => s.shops);
    const workers = useCrmStore(s => s.workers);
    const motos = useCrmStore(s => s.motos);
    const addShop = useCrmStore(s => s.addShop);
    const updateShop = useCrmStore(s => s.updateShop);
    const deleteShop = useCrmStore(s => s.deleteShop);
    const payShopDebt = useCrmStore(s => s.payShopDebt);
    const sellMotoToShop = useCrmStore(s => s.sellMotoToShop);
    const getShopStats = useCrmStore(s => s.getShopStats);
    const formatPrice = useCrmStore(s => s.formatPrice);

    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({
        name: '',
        address: '',
        phone: '',
        managerId: '',
        status: 'active' as 'active' | 'inactive',
        locationUrl: ''
    });

    // Debt Payment State
    const [showPayModal, setShowPayModal] = useState(false);
    const [payTarget, setPayTarget] = useState<string | null>(null);
    const [payAmount, setPayAmount] = useState(0);
    const [payMethod, setPayMethod] = useState<'cash' | 'card' | 'transfer'>('cash');

    // Moto Transfer State
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [transferTarget, setTransferTarget] = useState<string | null>(null);
    const [selectedMotoId, setSelectedMotoId] = useState('');
    const [transferPrice, setTransferPrice] = useState(0);
    const [isCredit, setIsCredit] = useState(true);

    const filtered = shops.filter(sh =>
        sh.name.toLowerCase().includes(search.toLowerCase()) ||
        sh.address.toLowerCase().includes(search.toLowerCase())
    );

    // const activeShops = shops.filter(s => s.status === 'active').length;
    const totalStats = shops.reduce((acc, sh) => {
        const stats = getShopStats(sh.id);
        acc.sales += stats.totalSales;
        acc.revenue += stats.totalRevenue;
        acc.debt += sh.debt;
        return acc;
    }, { sales: 0, revenue: 0, debt: 0 });

    const handleSave = () => {
        if (!form.name || !form.address) return;
        if (editId) {
            updateShop(editId, form);
        } else {
            addShop(form);
        }
        setShowModal(false);
        setEditId(null);
        resetForm();
    };

    const resetForm = () => {
        setForm({ name: '', address: '', phone: '', managerId: '', status: 'active', locationUrl: '' });
    };

    const handlePayDebt = () => {
        if (!payTarget || payAmount <= 0) return;
        payShopDebt(payTarget, payAmount, payMethod);
        setShowPayModal(false);
        setPayTarget(null);
        setPayAmount(0);
    };

    const handleTransfer = () => {
        if (!transferTarget || !selectedMotoId || transferPrice <= 0) return;
        sellMotoToShop(selectedMotoId, transferTarget, transferPrice, isCredit);
        setShowTransferModal(false);
        setTransferTarget(null);
        setSelectedMotoId('');
        setTransferPrice(0);
    };

    const openEdit = (sh: any) => {
        setForm({
            name: sh.name,
            address: sh.address,
            phone: sh.phone,
            managerId: sh.managerId || '',
            status: sh.status,
            locationUrl: sh.locationUrl || ''
        });
        setEditId(sh.id);
        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Haqiqatan ham ushbu do'konni o'chirmoqchimisiz?")) deleteShop(id);
    };

    const availableMotos = motos.filter(m => m.status === 'ready');

    return (
        <div className="admin-content">
            <CrmPageHeader
                title="Do'konlar"
                subtitle="Retail savdo nuqtalari va filiallar boshqaruvi"
                actions={
                    <button className="btn-primary" onClick={() => { setEditId(null); resetForm(); setShowModal(true); }}>
                        <Plus size={18} /> Do'kon qo'shish
                    </button>
                }
            />

            <div className="stats-grid">
                <div className="stats-card">
                    <div className="stats-icon" style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', color: '#2196F3' }}>
                        <Store size={24} />
                    </div>
                    <div className="stats-info">
                        <span className="stats-label">Jami do'konlar</span>
                        <span className="stats-value">{shops.length}</span>
                    </div>
                </div>
                <div className="stats-card" title="Hamkorlikdagi do'konlar qarzi">
                    <div className="stats-icon" style={{ backgroundColor: 'rgba(244, 67, 54, 0.1)', color: '#F44336' }}>
                        <CreditCard size={24} />
                    </div>
                    <div className="stats-info">
                        <span className="stats-label">Jami qarzlar</span>
                        <span className="stats-value" style={{ color: '#F44336' }}>{formatPrice(totalStats.debt)}</span>
                    </div>
                </div>
                <div className="stats-card">
                    <div className="stats-icon" style={{ backgroundColor: 'rgba(255, 152, 0, 0.1)', color: '#FF9800' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className="stats-info">
                        <span className="stats-label">Jami sotuvlar</span>
                        <span className="stats-value">{totalStats.sales} ta</span>
                    </div>
                </div>
                <div className="stats-card">
                    <div className="stats-icon" style={{ backgroundColor: 'rgba(156, 39, 176, 0.1)', color: '#9C27B0' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className="stats-info">
                        <span className="stats-label">Umumiy tushum</span>
                        <span className="stats-value">{formatPrice(totalStats.revenue)}</span>
                    </div>
                </div>
            </div>

            <div className="table-controls" style={{ marginTop: '24px' }}>
                <div className="navbar-search" style={{ minWidth: 300 }}>
                    <Search size={18} />
                    <input
                        placeholder="Nomi yoki manzili bo'yicha qidirish..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="crm-shops-grid">
                {filtered.map(sh => {
                    const stats = getShopStats(sh.id);
                    const manager = workers.find(w => w.id === sh.managerId);

                    return (
                        <div key={sh.id} className="admin-card shop-card">
                            <div className="shop-card-header">
                                <div className="shop-icon-wrapper">
                                    <Store size={24} />
                                </div>
                                <div className="shop-title-area">
                                    <Link to={`/panel/crm/shops/${sh.id}`} className="shop-name-link">
                                        <h3>{sh.name}</h3>
                                    </Link>
                                    <CrmBadge status={sh.status} size="sm" />
                                </div>
                                <div className="shop-actions">
                                    <button className="crm-action-btn" onClick={() => openEdit(sh)} title="Tahrirlash">
                                        <Edit size={16} />
                                    </button>
                                    <button className="crm-action-btn crm-action-btn--danger" onClick={() => handleDelete(sh.id)} title="O'chirish">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="shop-card-body">
                                <div className="shop-info-item">
                                    <MapPin size={16} />
                                    <span>{sh.address}</span>
                                </div>
                                <div className="shop-info-item">
                                    <Phone size={16} />
                                    <span className="font-mono">{sh.phone}</span>
                                </div>
                                <div className="shop-info-item">
                                    <User size={16} />
                                    <span>{manager ? manager.name : "Menejer yo'q"}</span>
                                </div>

                                <div className={`shop-debt-info ${sh.debt > 0 ? 'has-debt' : ''}`}>
                                    <div className="debt-label">
                                        <CreditCard size={14} />
                                        <span>Joriy qarz:</span>
                                    </div>
                                    <div className="debt-amount">
                                        {formatPrice(sh.debt)}
                                    </div>
                                </div>
                            </div>

                            <div className="shop-quick-actions">
                                <button
                                    className="btn-outline btn-sm"
                                    onClick={() => { setTransferTarget(sh.id); setShowTransferModal(true); }}
                                >
                                    <ArrowRightLeft size={14} /> Moto berish
                                </button>
                                {sh.debt > 0 && (
                                    <button
                                        className="btn-outline btn-sm debt-pay-btn"
                                        onClick={() => { setPayTarget(sh.id); setPayAmount(sh.debt); setShowPayModal(true); }}
                                    >
                                        <CreditCard size={14} /> Qarz so'ndirish
                                    </button>
                                )}
                            </div>

                            <div className="shop-card-footer">
                                <div className="shop-stat-mini">
                                    <small>Sotuvlar</small>
                                    <strong>{stats.totalSales} ta</strong>
                                </div>
                                <div className="shop-stat-mini">
                                    <small>Tushum</small>
                                    <strong>{formatPrice(stats.totalRevenue)}</strong>
                                </div>
                            </div>

                            {sh.locationUrl && (
                                <a
                                    href={sh.locationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="shop-map-link"
                                >
                                    Xaritada ko'rish
                                </a>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Shop Add/Edit Modal */}
            <CrmModal
                isOpen={showModal}
                onClose={() => { setShowModal(false); setEditId(null); }}
                title={editId ? "Do'konni tahrirlash" : "Yangi do'kon qo'shish"}
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => { setShowModal(false); setEditId(null); }}>Bekor qilish</button>
                        <button className="btn-primary" onClick={handleSave}>Saqlash</button>
                    </>
                }
            >
                <div className="form-group">
                    <label>Do'kon nomi</label>
                    <input
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Masalan: Haipeng Namangan"
                    />
                </div>
                <div className="form-group">
                    <label>Manzil</label>
                    <input
                        value={form.address}
                        onChange={e => setForm({ ...form, address: e.target.value })}
                        placeholder="To'liq manzilni kiriting"
                    />
                </div>
                <div className="form-grid-2">
                    <div className="form-group">
                        <label>Telefon</label>
                        <input
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            placeholder="+998901234567"
                        />
                    </div>
                    <div className="form-group">
                        <label>Menejer</label>
                        <select
                            value={form.managerId}
                            onChange={e => setForm({ ...form, managerId: e.target.value })}
                        >
                            <option value="">Tanlang...</option>
                            {workers.map(w => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label>Xarita havolasi (Google/Yandex Maps)</label>
                    <input
                        value={form.locationUrl}
                        onChange={e => setForm({ ...form, locationUrl: e.target.value })}
                        placeholder="https://maps.google.com/..."
                    />
                </div>
                <div className="form-group">
                    <label>Status</label>
                    <select
                        value={form.status}
                        onChange={e => setForm({ ...form, status: e.target.value as any })}
                    >
                        <option value="active">Faol</option>
                        <option value="inactive">Nofaol</option>
                    </select>
                </div>
            </CrmModal>

            {/* Pay Debt Modal */}
            <CrmModal
                isOpen={showPayModal}
                onClose={() => setShowPayModal(false)}
                title="Qarzni so'ndirish"
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => setShowPayModal(false)}>Bekor qilish</button>
                        <button className="btn-primary" onClick={handlePayDebt}>To'lovni saqlash</button>
                    </>
                }
            >
                <div className="alert alert--info" style={{ marginBottom: '20px' }}>
                    <AlertCircle size={18} />
                    <p>Qabul qilingan summa avtomatik ravishda moliya bo'limida kirim sifatida qayd etiladi.</p>
                </div>
                <div className="form-group">
                    <label>To'lov summasi (so'm)</label>
                    <input
                        type="number"
                        value={payAmount || ''}
                        onChange={e => setPayAmount(Number(e.target.value))}
                        placeholder="0"
                    />
                </div>
                <div className="form-group">
                    <label>To'lov usuli</label>
                    <select value={payMethod} onChange={e => setPayMethod(e.target.value as any)}>
                        <option value="cash">Naqd</option>
                        <option value="card">Plastik karta</option>
                        <option value="transfer">Bank o'tkazmasi</option>
                    </select>
                </div>
            </CrmModal>

            {/* Transfer/Sell Moto Modal */}
            <CrmModal
                isOpen={showTransferModal}
                onClose={() => setShowTransferModal(false)}
                title="Motto o'tkazish / Sotish"
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => setShowTransferModal(false)}>Bekor qilish</button>
                        <button className="btn-primary" onClick={handleTransfer}>O'tkazishni tasdiqlash</button>
                    </>
                }
            >
                <div className="form-group">
                    <label>Mototsikl tanlang</label>
                    <select value={selectedMotoId} onChange={e => setSelectedMotoId(e.target.value)}>
                        <option value="">Tanlang...</option>
                        {availableMotos.map(m => (
                            <option key={m.id} value={m.id}>{m.model} (#{m.serialNumber})</option>
                        ))}
                    </select>
                    {availableMotos.length === 0 && (
                        <p style={{ color: '#F44336', fontSize: '0.8rem', marginTop: '5px' }}>Omborda tayyor mototsikllar mavjud emas.</p>
                    )}
                </div>
                <div className="form-group">
                    <label> Sotish narxi (so'm)</label>
                    <input
                        type="number"
                        value={transferPrice || ''}
                        onChange={e => setTransferPrice(Number(e.target.value))}
                        placeholder="0"
                    />
                </div>
                <div className="form-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={isCredit}
                            onChange={e => setIsCredit(e.target.checked)}
                        />
                        <span>Nasiyaga sotish (do'kon qarziga yozish)</span>
                    </label>
                </div>
                {!isCredit && (
                    <div className="alert alert--success">
                        <CheckCircle2 size={18} />
                        <p>To'lov naqd qabul qilindi deb hisoblanadi va kirim qilinadi.</p>
                    </div>
                )}
            </CrmModal>

            <style>{`
                .crm-shops-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 20px;
                    margin-top: 24px;
                }
                .shop-card {
                    display: flex;
                    flex-direction: column;
                    padding: 0;
                    overflow: hidden;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .shop-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
                .shop-card-header {
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    border-bottom: 1px solid #eee;
                    position: relative;
                }
                .shop-icon-wrapper {
                    width: 48px;
                    height: 48px;
                    background: #f0f7ff;
                    color: #2196f3;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                }
                .shop-title-area {
                    flex: 1;
                }
                .shop-name-link {
                    text-decoration: none;
                    color: inherit;
                }
                .shop-name-link:hover h3 {
                    color: #2196f3;
                }
                .shop-title-area h3 {
                    margin: 0 0 4px 0;
                    font-size: 1.1rem;
                }
                .shop-actions {
                    display: flex;
                    gap: 5px;
                }
                .shop-card-body {
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .shop-info-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 0.9rem;
                    color: #666;
                }
                .shop-debt-info {
                    margin-top: 10px;
                    padding: 10px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .shop-debt-info.has-debt {
                    background: #fff5f5;
                    border: 1px solid #ffe3e3;
                }
                .debt-label {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #666;
                    font-size: 0.85rem;
                }
                .debt-amount {
                    font-weight: 700;
                    color: #333;
                }
                .shop-debt-info.has-debt .debt-amount {
                    color: #F44336;
                }
                .shop-quick-actions {
                    padding: 0 20px 20px;
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }
                .btn-sm {
                    padding: 6px 12px;
                    font-size: 0.8rem;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .debt-pay-btn {
                    color: #F44336;
                    border-color: #F44336;
                }
                .debt-pay-btn:hover {
                    background: #fff5f5;
                }
                .shop-card-footer {
                    padding: 15px 20px;
                    background: #fcfcfc;
                    border-top: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                }
                .shop-stat-mini {
                    display: flex;
                    flex-direction: column;
                }
                .shop-stat-mini small {
                    color: #999;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                }
                .shop-stat-mini strong {
                    font-size: 1rem;
                    color: #333;
                }
                .shop-map-link {
                    display: block;
                    padding: 12px;
                    text-align: center;
                    background: #f8f9fa;
                    color: #2196f3;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 0.9rem;
                    border-top: 1px solid #eee;
                }
                .shop-map-link:hover {
                    background: #f0f7ff;
                }
                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    margin-top: 10px;
                }
                .alert {
                    padding: 12px;
                    border-radius: 8px;
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    font-size: 0.85rem;
                }
                .alert--info {
                    background: #e3f2fd;
                    color: #1976d2;
                }
                .alert--success {
                    background: #e8f5e9;
                    color: #2e7d32;
                }
            `}</style>
        </div>
    );
}
