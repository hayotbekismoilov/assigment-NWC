import { useState } from 'react';
import { useCrmStore } from '../../store/crmStore';
import CrmPageHeader from '../../components/Admin/CrmPageHeader';
import CrmBadge from '../../components/Admin/CrmBadge';
import CrmModal from '../../components/Admin/CrmModal';
import { Plus, Edit, Trash2, Eye, Search, Bike } from 'lucide-react';
import type { MotoStatus } from '../../types/crm';

function formatPrice(n: number) {
    return new Intl.NumberFormat('uz-UZ').format(n);
}

export default function CrmMotos() {
    const motos = useCrmStore(s => s.motos);
    const workers = useCrmStore(s => s.workers);
    const addMoto = useCrmStore(s => s.addMoto);
    const updateMoto = useCrmStore(s => s.updateMoto);
    const deleteMoto = useCrmStore(s => s.deleteMoto);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<MotoStatus | 'all'>('all');
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [showDetail, setShowDetail] = useState<string | null>(null);
    const [form, setForm] = useState({ model: '', serialNumber: '', costPrice: 0, sellPrice: 0, status: 'pending' as MotoStatus });

    const filtered = motos
        .filter(m => statusFilter === 'all' || m.status === statusFilter)
        .filter(m => m.model.toLowerCase().includes(search.toLowerCase()) || m.serialNumber.toLowerCase().includes(search.toLowerCase()));

    const handleSave = () => {
        if (!form.model || !form.serialNumber) return;
        if (editId) {
            updateMoto(editId, { model: form.model, serialNumber: form.serialNumber, costPrice: form.costPrice, sellPrice: form.sellPrice, status: form.status });
        } else {
            addMoto({ model: form.model, serialNumber: form.serialNumber, costPrice: form.costPrice, sellPrice: form.sellPrice, status: form.status, partsUsed: [], workersAssigned: [] });
        }
        setShowModal(false);
        setEditId(null);
        setForm({ model: '', serialNumber: '', costPrice: 0, sellPrice: 0, status: 'pending' });
    };

    const openEdit = (id: string) => {
        const m = motos.find(x => x.id === id);
        if (!m) return;
        setForm({ model: m.model, serialNumber: m.serialNumber, costPrice: m.costPrice, sellPrice: m.sellPrice, status: m.status });
        setEditId(id);
        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Haqiqatan ham o'chirmoqchimisiz?")) deleteMoto(id);
    };

    const detailMoto = motos.find(m => m.id === showDetail);
    const getWorkerName = (wid: string) => workers.find(w => w.id === wid)?.name || '';

    return (
        <div className="admin-content">
            <CrmPageHeader
                title="Motolar"
                subtitle={`Jami: ${motos.length} ta moto`}
                actions={
                    <button className="btn-primary" onClick={() => { setEditId(null); setForm({ model: '', serialNumber: '', costPrice: 0, sellPrice: 0, status: 'pending' }); setShowModal(true); }}>
                        <Plus size={18} /> Yangi moto
                    </button>
                }
            />

            {/* Filters */}
            <div className="table-controls">
                <div className="navbar-search" style={{ minWidth: 260 }}>
                    <Search size={18} />
                    <input placeholder="Model yoki seriya raqami..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="crm-filter-group">
                    {(['all', 'pending', 'assembling', 'ready', 'sold'] as const).map(s => (
                        <button key={s} className={`crm-filter-btn ${statusFilter === s ? 'crm-filter-btn--active' : ''}`} onClick={() => setStatusFilter(s)}>
                            {s === 'all' ? 'Barchasi' : <CrmBadge status={s} size="sm" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="admin-card">
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Seriya №</th>
                                <th>Model</th>
                                <th>Status</th>
                                <th>Tannarx</th>
                                <th>Sotuv narxi</th>
                                <th>Foyda</th>
                                <th>Sana</th>
                                <th>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(m => (
                                <tr key={m.id}>
                                    <td className="font-mono">{m.serialNumber}</td>
                                    <td className="font-bold">{m.model}</td>
                                    <td><CrmBadge status={m.status} /></td>
                                    <td>{formatPrice(m.costPrice)}</td>
                                    <td>{formatPrice(m.sellPrice)}</td>
                                    <td style={{ color: '#00C853', fontWeight: 600 }}>
                                        {formatPrice(m.sellPrice - m.costPrice)}
                                    </td>
                                    <td className="font-mono">{m.createdAt}</td>
                                    <td>
                                        <div className="crm-table-actions">
                                            <button className="crm-action-btn" title="Ko'rish" onClick={() => setShowDetail(m.id)}>
                                                <Eye size={16} />
                                            </button>
                                            <button className="crm-action-btn" title="Tahrirlash" onClick={() => openEdit(m.id)}>
                                                <Edit size={16} />
                                            </button>
                                            <button className="crm-action-btn crm-action-btn--danger" title="O'chirish" onClick={() => handleDelete(m.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>
                                        <Bike size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                                        <p>Motolar topilmadi</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <CrmModal
                isOpen={showModal}
                onClose={() => { setShowModal(false); setEditId(null); }}
                title={editId ? 'Motoni tahrirlash' : 'Yangi moto'}
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => { setShowModal(false); setEditId(null); }}>Bekor</button>
                        <button className="btn-primary" onClick={handleSave}>Saqlash</button>
                    </>
                }
            >
                <div className="form-group">
                    <label>Model</label>
                    <input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} placeholder="Haipeng HP-150" />
                </div>
                <div className="form-group">
                    <label>Seriya raqami</label>
                    <input value={form.serialNumber} onChange={e => setForm({ ...form, serialNumber: e.target.value })} placeholder="HP150-006" />
                </div>
                <div className="form-grid-2">
                    <div className="form-group">
                        <label>Tannarx</label>
                        <input type="number" value={form.costPrice || ''} onChange={e => setForm({ ...form, costPrice: Number(e.target.value) })} />
                    </div>
                    <div className="form-group">
                        <label>Sotuv narxi</label>
                        <input type="number" value={form.sellPrice || ''} onChange={e => setForm({ ...form, sellPrice: Number(e.target.value) })} />
                    </div>
                </div>
                {editId && (
                    <div className="form-group">
                        <label>Status</label>
                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as MotoStatus })}>
                            <option value="pending">Kutilmoqda</option>
                            <option value="assembling">Jarayonda</option>
                            <option value="ready">Tayyor</option>
                            <option value="sold">Sotilgan</option>
                        </select>
                    </div>
                )}
            </CrmModal>

            {/* Detail Modal */}
            <CrmModal
                isOpen={!!showDetail}
                onClose={() => setShowDetail(null)}
                title={detailMoto ? `${detailMoto.model}` : ''}
                size="lg"
            >
                {detailMoto && (
                    <>
                        <div className="crm-detail-grid">
                            <div className="crm-detail-item"><small>Seriya</small><strong>#{detailMoto.serialNumber}</strong></div>
                            <div className="crm-detail-item"><small>Status</small><CrmBadge status={detailMoto.status} /></div>
                            <div className="crm-detail-item"><small>Tannarx</small><strong>{formatPrice(detailMoto.costPrice)} so'm</strong></div>
                            <div className="crm-detail-item"><small>Sotuv narxi</small><strong>{formatPrice(detailMoto.sellPrice)} so'm</strong></div>
                            <div className="crm-detail-item"><small>Foyda</small><strong style={{ color: '#00C853' }}>{formatPrice(detailMoto.sellPrice - detailMoto.costPrice)} so'm</strong></div>
                            <div className="crm-detail-item"><small>Yaratilgan</small><strong>{detailMoto.createdAt}</strong></div>
                            {detailMoto.completedAt && <div className="crm-detail-item"><small>Tugallangan</small><strong>{detailMoto.completedAt}</strong></div>}
                            {detailMoto.soldAt && <div className="crm-detail-item"><small>Sotilgan sana</small><strong>{detailMoto.soldAt}</strong></div>}
                        </div>
                        {detailMoto.workersAssigned.length > 0 && (
                            <>
                                <h4 style={{ margin: '1.5rem 0 0.75rem', fontFamily: "'Outfit', sans-serif" }}>Biriktirilgan ishchilar</h4>
                                <div className="crm-worker-chips">
                                    {detailMoto.workersAssigned.map(wid => (
                                        <span key={wid} className="crm-worker-chip">{getWorkerName(wid)}</span>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </CrmModal>
        </div>
    );
}
