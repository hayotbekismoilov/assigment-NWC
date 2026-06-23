import { useState } from 'react';
import { useCrmStore } from '../../store/crmStore';
import CrmPageHeader from '../../components/Admin/CrmPageHeader';
import CrmBadge from '../../components/Admin/CrmBadge';
import CrmModal from '../../components/Admin/CrmModal';
import CrmTabs from '../../components/Admin/CrmTabs';
import { Plus, Search, Users as UsersIcon, DollarSign } from 'lucide-react';

function formatPrice(n: number) {
    return new Intl.NumberFormat('uz-UZ').format(n);
}

export default function CrmSales() {
    const orders = useCrmStore(s => s.orders);
    const customers = useCrmStore(s => s.customers);
    const motos = useCrmStore(s => s.motos);
    const addCustomer = useCrmStore(s => s.addCustomer);
    const updateOrderPayment = useCrmStore(s => s.updateOrderPayment);
    const sellMoto = useCrmStore(s => s.sellMoto);

    const [activeTab, setActiveTab] = useState('orders');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showPayModal, setShowPayModal] = useState<string | null>(null);
    const [payAmount, setPayAmount] = useState(0);
    const [customerForm, setCustomerForm] = useState({ name: '', phone: '', address: '' });
    const [orderForm, setOrderForm] = useState({ customerId: '', motoId: '', price: 0, paidAmount: 0 });

    const readyMotos = motos.filter(m => m.status === 'ready');
    const getCustomer = (id: string) => customers.find(c => c.id === id);
    const getMoto = (id: string) => motos.find(m => m.id === id);

    const filteredOrders = orders
        .filter(o => statusFilter === 'all' || o.paymentStatus === statusFilter)
        .filter(o => {
            if (!search) return true;
            const customer = getCustomer(o.customerId);
            const moto = getMoto(o.motoId);
            return customer?.name.toLowerCase().includes(search.toLowerCase()) ||
                moto?.model.toLowerCase().includes(search.toLowerCase());
        })
        .sort((a, b) => b.date.localeCompare(a.date));

    const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    const handleAddCustomer = () => {
        if (!customerForm.name || !customerForm.phone) return;
        addCustomer(customerForm);
        setCustomerForm({ name: '', phone: '', address: '' });
        setShowCustomerModal(false);
    };

    const handleCreateOrder = () => {
        if (!orderForm.customerId || !orderForm.motoId || orderForm.price <= 0) return;
        sellMoto(orderForm.motoId, orderForm.customerId, orderForm.price);
        setOrderForm({ customerId: '', motoId: '', price: 0, paidAmount: 0 });
        setShowOrderModal(false);
    };

    const handlePay = () => {
        if (!showPayModal || payAmount <= 0) return;
        updateOrderPayment(showPayModal, payAmount);
        setShowPayModal(null);
        setPayAmount(0);
    };

    const tabs = [
        { id: 'orders', label: 'Buyurtmalar', count: orders.length },
        { id: 'customers', label: 'Mijozlar', count: customers.length },
    ];

    return (
        <div className="admin-content">
            <CrmPageHeader
                title="Sotuv"
                subtitle={`${orders.length} buyurtma, ${customers.length} mijoz`}
                actions={
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-secondary" onClick={() => setShowCustomerModal(true)}>
                            <UsersIcon size={18} /> Mijoz
                        </button>
                        <button className="btn-primary" onClick={() => setShowOrderModal(true)} disabled={readyMotos.length === 0}>
                            <Plus size={18} /> Sotish
                        </button>
                    </div>
                }
            />

            <CrmTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === 'orders' && (
                <>
                    <div className="table-controls">
                        <div className="navbar-search" style={{ minWidth: 260 }}>
                            <Search size={18} />
                            <input placeholder="Mijoz yoki model..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div className="crm-filter-group">
                            {(['all', 'paid', 'partial', 'unpaid'] as const).map(s => (
                                <button key={s} className={`crm-filter-btn ${statusFilter === s ? 'crm-filter-btn--active' : ''}`} onClick={() => setStatusFilter(s)}>
                                    {s === 'all' ? 'Barchasi' : <CrmBadge status={s} size="sm" />}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="admin-card">
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Sana</th>
                                        <th>Mijoz</th>
                                        <th>Moto</th>
                                        <th>Narx</th>
                                        <th>To'langan</th>
                                        <th>Qoldiq</th>
                                        <th>Holat</th>
                                        <th>Amal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map(o => {
                                        const customer = getCustomer(o.customerId);
                                        const moto = getMoto(o.motoId);
                                        const remaining = o.price - o.paidAmount;
                                        return (
                                            <tr key={o.id}>
                                                <td className="font-mono">{o.date}</td>
                                                <td className="font-bold">{customer?.name || '—'}</td>
                                                <td>{moto?.model || '—'}</td>
                                                <td>{formatPrice(o.price)}</td>
                                                <td style={{ color: '#00C853', fontWeight: 600 }}>{formatPrice(o.paidAmount)}</td>
                                                <td style={{ color: remaining > 0 ? '#F44336' : '#00C853', fontWeight: 600 }}>
                                                    {remaining > 0 ? formatPrice(remaining) : '—'}
                                                </td>
                                                <td><CrmBadge status={o.paymentStatus} /></td>
                                                <td>
                                                    {o.paymentStatus !== 'paid' && (
                                                        <button className="crm-action-btn crm-action-btn--success" onClick={() => { setShowPayModal(o.id); setPayAmount(remaining); }}>
                                                            <DollarSign size={16} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredOrders.length === 0 && (
                                        <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>Buyurtmalar topilmadi</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'customers' && (
                <>
                    <div className="table-controls">
                        <div className="navbar-search" style={{ minWidth: 260 }}>
                            <Search size={18} />
                            <input placeholder="Mijoz nomi..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                    </div>
                    <div className="admin-card">
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Mijoz</th>
                                        <th>Telefon</th>
                                        <th>Manzil</th>
                                        <th>Buyurtmalar</th>
                                        <th>Jami summa</th>
                                        <th>Qo'shilgan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCustomers.map(c => {
                                        const custOrders = orders.filter(o => o.customerId === c.id);
                                        const totalSpent = custOrders.reduce((s, o) => s + o.price, 0);
                                        return (
                                            <tr key={c.id}>
                                                <td>
                                                    <div className="user-table-info">
                                                        <div className="user-avatar-small">{c.name.charAt(0)}</div>
                                                        <strong>{c.name}</strong>
                                                    </div>
                                                </td>
                                                <td className="font-mono">{c.phone}</td>
                                                <td>{c.address || '—'}</td>
                                                <td><span className="count-pill">{custOrders.length}</span></td>
                                                <td style={{ fontWeight: 600 }}>{formatPrice(totalSpent)}</td>
                                                <td className="font-mono">{c.createdAt}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Add Customer Modal */}
            <CrmModal isOpen={showCustomerModal} onClose={() => setShowCustomerModal(false)} title="Yangi mijoz"
                footer={<><button className="btn-secondary" onClick={() => setShowCustomerModal(false)}>Bekor</button><button className="btn-primary" onClick={handleAddCustomer}>Qo'shish</button></>}
            >
                <div className="form-group"><label>Ism</label><input value={customerForm.name} onChange={e => setCustomerForm({ ...customerForm, name: e.target.value })} placeholder="To'liq ism" /></div>
                <div className="form-group"><label>Telefon</label><input value={customerForm.phone} onChange={e => setCustomerForm({ ...customerForm, phone: e.target.value })} placeholder="+998..." /></div>
                <div className="form-group"><label>Manzil</label><input value={customerForm.address} onChange={e => setCustomerForm({ ...customerForm, address: e.target.value })} placeholder="Shahri, tumani..." /></div>
            </CrmModal>

            {/* Create Order (Sell) Modal */}
            <CrmModal isOpen={showOrderModal} onClose={() => setShowOrderModal(false)} title="Moto sotish"
                footer={<><button className="btn-secondary" onClick={() => setShowOrderModal(false)}>Bekor</button><button className="btn-primary" onClick={handleCreateOrder}>Sotish</button></>}
            >
                <div className="form-group">
                    <label>Mijoz</label>
                    <select value={orderForm.customerId} onChange={e => setOrderForm({ ...orderForm, customerId: e.target.value })}>
                        <option value="">Tanlang...</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Moto (tayyor)</label>
                    <select value={orderForm.motoId} onChange={e => {
                        const m = readyMotos.find(x => x.id === e.target.value);
                        setOrderForm({ ...orderForm, motoId: e.target.value, price: m?.sellPrice || 0 });
                    }}>
                        <option value="">Tanlang...</option>
                        {readyMotos.map(m => <option key={m.id} value={m.id}>{m.model} — #{m.serialNumber} ({formatPrice(m.sellPrice)} so'm)</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Sotuv narxi (so'm)</label>
                    <input type="number" value={orderForm.price || ''} onChange={e => setOrderForm({ ...orderForm, price: Number(e.target.value) })} />
                </div>
            </CrmModal>

            {/* Pay Modal */}
            <CrmModal isOpen={!!showPayModal} onClose={() => setShowPayModal(null)} title="To'lov qilish"
                footer={<><button className="btn-secondary" onClick={() => setShowPayModal(null)}>Bekor</button><button className="btn-primary" onClick={handlePay}>To'lash</button></>}
            >
                <div className="form-group">
                    <label>To'lov summasi (so'm)</label>
                    <input type="number" value={payAmount || ''} onChange={e => setPayAmount(Number(e.target.value))} />
                </div>
            </CrmModal>
        </div>
    );
}
