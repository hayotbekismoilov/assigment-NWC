import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCrmStore } from '../../store/crmStore';
import CrmPageHeader from '../../components/Admin/CrmPageHeader';
import CrmStatCard from '../../components/Admin/CrmStatCard';
import CrmBadge from '../../components/Admin/CrmBadge';
import CrmTabs from '../../components/Admin/CrmTabs';
import CrmModal from '../../components/Admin/CrmModal';
import {
    ArrowLeft, Store, MapPin, Phone, User,
    CreditCard, TrendingUp, ShoppingBag, Box,
    DollarSign
} from 'lucide-react';

export default function CrmShopProfile() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const shops = useCrmStore(s => s.shops);
    const workers = useCrmStore(s => s.workers);
    const orders = useCrmStore(s => s.orders);
    const motos = useCrmStore(s => s.motos);
    const transactions = useCrmStore(s => s.transactions);
    const getShopStats = useCrmStore(s => s.getShopStats);
    const formatPrice = useCrmStore(s => s.formatPrice);
    const payShopDebt = useCrmStore(s => s.payShopDebt);

    const [activeTab, setActiveTab] = useState('sales');
    const [showPayModal, setShowPayModal] = useState(false);
    const [payAmount, setPayAmount] = useState(0);
    const [payMethod, setPayMethod] = useState<'cash' | 'card' | 'transfer'>('cash');

    const shop = shops.find(sh => sh.id === id);
    if (!shop) {
        return (
            <div className="admin-content">
                <div className="crm-empty-state">
                    <div className="crm-empty-icon"><Store size={48} /></div>
                    <h3 className="crm-empty-title">Do'kon topilmadi</h3>
                    <button className="btn-primary" onClick={() => navigate('/panel/crm/shops')}>
                        <ArrowLeft size={18} /> Orqaga
                    </button>
                </div>
            </div>
        );
    }

    const stats = getShopStats(shop.id);
    const manager = workers.find(w => w.id === shop.managerId);

    const shopOrders = orders.filter(o => o.shopId === shop.id || o.customerId === `shop_${shop.id}`);
    const shopInventory = motos.filter(m => m.shopId === shop.id && m.status !== 'sold');
    const shopTransactions = transactions.filter(t =>
        t.description.includes(shop.name) ||
        t.note?.includes(shop.name)
    );

    const handlePayDebt = () => {
        if (payAmount <= 0) return;
        payShopDebt(shop.id, payAmount, payMethod);
        setShowPayModal(false);
        setPayAmount(0);
    };

    const tabs = [
        { id: 'sales', label: 'Sotuvlar', count: shopOrders.length },
        { id: 'inventory', label: 'Invertar', count: shopInventory.length },
        { id: 'transactions', label: 'Tranzaksiyalar', count: shopTransactions.length },
    ];

    return (
        <div className="admin-content">
            <CrmPageHeader
                title={shop.name}
                subtitle="Filial tafsilotlari va tahlili"
                actions={
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn-secondary" onClick={() => navigate('/panel/crm/shops')}>
                            <ArrowLeft size={18} /> Orqaga
                        </button>
                        <button className="btn-primary" onClick={() => { setPayAmount(shop.debt); setShowPayModal(true); }}>
                            <DollarSign size={18} /> Qarz so'ndirish
                        </button>
                    </div>
                }
            />

            <div className="admin-card shop-profile-header" style={{ marginBottom: '24px' }}>
                <div className="shop-profile-info">
                    <div className="shop-profile-icon">
                        <Store size={40} />
                    </div>
                    <div className="shop-profile-text">
                        <div className="shop-profile-title">
                            <h2>{shop.name}</h2>
                            <CrmBadge status={shop.status} />
                        </div>
                        <div className="shop-profile-meta">
                            <span><MapPin size={14} /> {shop.address}</span>
                            <span><Phone size={14} /> {shop.phone}</span>
                            <span><User size={14} /> Menejer: {manager ? manager.name : 'Tayinlanmagan'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="crm-stats-grid">
                <CrmStatCard
                    icon={<CreditCard size={22} />}
                    label="Joriy qarz"
                    value={formatPrice(shop.debt)}
                    change="Balans"
                    changeType={shop.debt > 0 ? 'down' : 'neutral'}
                    color={shop.debt > 0 ? '#F44336' : '#00C853'}
                />
                <CrmStatCard
                    icon={<ShoppingBag size={22} />}
                    label="Sotuvlar soni"
                    value={`${stats.totalSales} ta`}
                    change="Jami"
                    changeType="neutral"
                    color="#2196F3"
                />
                <CrmStatCard
                    icon={<TrendingUp size={22} />}
                    label="Jami tushum"
                    value={formatPrice(stats.totalRevenue)}
                    change="Kirim"
                    changeType="up"
                    color="#00C853"
                />
                <CrmStatCard
                    icon={<Box size={22} />}
                    label="Do'kondagi mahsulot"
                    value={`${shopInventory.length} ta`}
                    change="Motto"
                    changeType="neutral"
                    color="#FF9800"
                />
            </div>

            <CrmTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            <div className="tab-content" style={{ marginTop: '24px' }}>
                {activeTab === 'sales' && (
                    <div className="admin-card">
                        <div className="card-header">
                            <h3 className="card-title">Oxirgi sotuvlar</h3>
                        </div>
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Sana</th>
                                        <th>Mijoz / Filial</th>
                                        <th>Narx</th>
                                        <th>To'langan</th>
                                        <th>Holat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shopOrders.map(o => (
                                        <tr key={o.id}>
                                            <td className="font-mono">{o.date}</td>
                                            <td>{o.customerId.startsWith('shop_') ? "B2B (Filial)" : o.customerId}</td>
                                            <td className="font-bold">{formatPrice(o.price)}</td>
                                            <td style={{ color: '#00C853' }}>{formatPrice(o.paidAmount)}</td>
                                            <td>
                                                <CrmBadge
                                                    status={o.paymentStatus === 'paid' ? 'active' : 'inactive'}
                                                    text={o.paymentStatus === 'paid' ? "To'langan" : "Qarz"}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    {shopOrders.length === 0 && (
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                                Sotuvlar mavjud emas
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'inventory' && (
                    <div className="crm-shops-grid" style={{ marginTop: 0 }}>
                        {shopInventory.map(m => (
                            <div key={m.id} className="admin-card moto-mini-card">
                                <div className="moto-mini-header">
                                    <strong>{m.model}</strong>
                                    <span className="font-mono text-sm">#{m.serialNumber}</span>
                                </div>
                                <div className="moto-mini-body">
                                    <div className="moto-mini-price">
                                        <small>Tan narxi</small>
                                        <span>{formatPrice(m.costPrice)}</span>
                                    </div>
                                    <CrmBadge status="active" text="Tayyor" size="sm" />
                                </div>
                            </div>
                        ))}
                        {shopInventory.length === 0 && (
                            <div className="admin-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#999' }}>
                                Do'konda sotilmagan mahsulotlar yo'q
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'transactions' && (
                    <div className="admin-card">
                        <div className="card-header">
                            <h3 className="card-title">Moliyaviy tarix</h3>
                        </div>
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Sana</th>
                                        <th>Tavsif</th>
                                        <th>Summa</th>
                                        <th>Tur</th>
                                        <th>Usul</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shopTransactions.map(t => (
                                        <tr key={t.id}>
                                            <td className="font-mono">{t.date}</td>
                                            <td>{t.description}</td>
                                            <td className="font-bold" style={{ color: t.type === 'income' ? '#00C853' : '#F44336' }}>
                                                {t.type === 'income' ? '+' : '-'}{formatPrice(t.amount)}
                                            </td>
                                            <td>{t.category === 'sale' ? 'Sotuv' : 'Boshqa'}</td>
                                            <td>{t.method === 'cash' ? 'Naqd' : t.method === 'card' ? 'Karta' : 'O\'tkazma'}</td>
                                        </tr>
                                    ))}
                                    {shopTransactions.length === 0 && (
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                                Tranzaksiyalar mavjud emas
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <CrmModal
                isOpen={showPayModal}
                onClose={() => setShowPayModal(false)}
                title="Qarzni so'ndirish"
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => setShowPayModal(false)}>Bekor qilish</button>
                        <button className="btn-primary" onClick={handlePayDebt}>Tasdiqlash</button>
                    </>
                }
            >
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

            <style>{`
                .shop-profile-header {
                    padding: 24px;
                }
                .shop-profile-info {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                }
                .shop-profile-icon {
                    width: 80px;
                    height: 80px;
                    background: #f0f7ff;
                    color: #2196f3;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 20px;
                }
                .shop-profile-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 8px;
                }
                .shop-profile-title h2 {
                    margin: 0;
                    font-size: 1.8rem;
                }
                .shop-profile-meta {
                    display: flex;
                    gap: 20px;
                    color: #666;
                    font-size: 0.95rem;
                }
                .shop-profile-meta span {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .moto-mini-card {
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .moto-mini-header {
                    display: flex;
                    flex-direction: column;
                }
                .moto-mini-body {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }
                .moto-mini-price {
                    display: flex;
                    flex-direction: column;
                }
                .moto-mini-price small {
                    color: #999;
                    font-size: 0.75rem;
                }
                .moto-mini-price span {
                    font-weight: 700;
                    color: #333;
                }
            `}</style>
        </div>
    );
}
