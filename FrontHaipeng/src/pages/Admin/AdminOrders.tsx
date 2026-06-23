import { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';
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

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const load = () => {
        setLoading(true);
        const params: Record<string, string> = {};
        if (filterStatus) params.status = filterStatus;
        api.orders.list(params)
            .then(data => setOrders(data.items))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [filterStatus]);

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            await api.orders.updateStatus(id, newStatus);
            load();
            if (selectedOrder?.id === id) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (e: any) {
            alert(e.message);
        }
    };

    return (
        <div className="admin-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Buyurtmalar</h1>
                    <p className="page-subtitle">{orders.length} ta buyurtma</p>
                </div>
            </div>

            <div className="table-controls">
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['', 'pending', 'paid', 'delivered', 'cancelled'].map(s => (
                        <button
                            key={s}
                            className={filterStatus === s ? 'btn-primary' : 'btn-secondary'}
                            onClick={() => setFilterStatus(s)}
                        >
                            {s ? statusLabels[s] : 'Barchasi'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? <p>Yuklanmoqda...</p> : (
                <div className="admin-card">
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Mijoz</th>
                                    <th>Mahsulotlar</th>
                                    <th>Summa</th>
                                    <th>Yetkazish</th>
                                    <th>Status</th>
                                    <th>Sana</th>
                                    <th>Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o.id}>
                                        <td className="font-mono">{o.order_number}</td>
                                        <td>
                                            <div className="item-info">
                                                <span className="item-name">{o.customer_name}</span>
                                                <span className="item-brand">{o.customer_phone}</span>
                                            </div>
                                        </td>
                                        <td>{o.items_count} ta</td>
                                        <td className="font-bold">{formatPrice(o.total)} so'm</td>
                                        <td><span className="category-tag">{o.delivery_type === 'delivery' ? 'Yetkazish' : 'Olib ketish'}</span></td>
                                        <td>
                                            <select
                                                value={o.status}
                                                onChange={e => handleStatusChange(o.id, e.target.value)}
                                                style={{ cursor: 'pointer', border: '1px solid var(--border)', padding: '0.3rem 0.6rem', borderRadius: '8px', background: 'var(--bg3)', color: 'var(--text)', fontSize: '0.82rem' }}
                                            >
                                                {Object.entries(statusLabels).map(([val, label]) => (
                                                    <option key={val} value={val}>{label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>
                                            {o.created_at ? new Date(o.created_at).toLocaleDateString('uz-UZ') : '—'}
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button className="action-btn edit" title="Ko'rish" onClick={() => setSelectedOrder(o)}>
                                                    <Eye size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text3)', padding: '2rem' }}>Buyurtmalar topilmadi</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ===== ORDER DETAIL MODAL ===== */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Buyurtma {selectedOrder.order_number}</h2>
                            <button className="modal-close" onClick={() => setSelectedOrder(null)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label>Mijoz</label>
                                    <input value={selectedOrder.customer_name} readOnly />
                                </div>
                                <div className="form-group">
                                    <label>Telefon</label>
                                    <input value={selectedOrder.customer_phone} readOnly />
                                </div>
                                <div className="form-group">
                                    <label>Manzil</label>
                                    <input value={selectedOrder.address || 'Ko\'rsatilmagan'} readOnly />
                                </div>
                                <div className="form-group">
                                    <label>Yetkazish turi</label>
                                    <input value={selectedOrder.delivery_type === 'delivery' ? 'Yetkazib berish' : 'Olib ketish'} readOnly />
                                </div>
                                <div className="form-group">
                                    <label>To'lov usuli</label>
                                    <input value={selectedOrder.payment_method === 'cash' ? 'Naqd' : 'Karta'} readOnly />
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        value={selectedOrder.status}
                                        onChange={e => handleStatusChange(selectedOrder.id, e.target.value)}
                                    >
                                        {Object.entries(statusLabels).map(([val, label]) => (
                                            <option key={val} value={val}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {selectedOrder.comment && (
                                <div className="form-group">
                                    <label>Izoh</label>
                                    <textarea value={selectedOrder.comment} readOnly rows={2} />
                                </div>
                            )}

                            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', margin: '1.5rem 0 1rem', color: 'var(--text)' }}>
                                Mahsulotlar ({(selectedOrder.items || []).length} ta)
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {(selectedOrder.items || []).map((item: any, i: number) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)' }}>
                                        {item.image && <img src={item.image} alt="" style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                                            <div style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>
                                                {formatPrice(item.price)} × {item.quantity}
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 700, color: 'var(--accent)' }}>
                                            {formatPrice(item.price * item.quantity)} so'm
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                <div style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                                    Jami: <span style={{ color: 'var(--accent)' }}>{formatPrice(selectedOrder.total)} so'm</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setSelectedOrder(null)}>Yopish</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
