import { useState } from 'react';
import { useCrmStore } from '../../store/crmStore';
import CrmPageHeader from '../../components/Admin/CrmPageHeader';
import CrmBadge from '../../components/Admin/CrmBadge';
import CrmModal from '../../components/Admin/CrmModal';
import CrmTabs from '../../components/Admin/CrmTabs';
import { Plus, Edit, Trash2, Search, Package, AlertTriangle, ArrowDownUp } from 'lucide-react';

function formatPrice(n: number) {
    return new Intl.NumberFormat('uz-UZ').format(n);
}

export default function CrmInventory() {
    const parts = useCrmStore(s => s.parts);
    const motos = useCrmStore(s => s.motos);
    const inventoryMovements = useCrmStore(s => s.inventoryMovements);
    const addPart = useCrmStore(s => s.addPart);
    const updatePart = useCrmStore(s => s.updatePart);
    const deletePart = useCrmStore(s => s.deletePart);
    const addInventoryMovement = useCrmStore(s => s.addInventoryMovement);

    const [activeTab, setActiveTab] = useState('parts');
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showMovementModal, setShowMovementModal] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ name: '', quantity: 0, price: 0, minStock: 10, unit: 'dona' });
    const [movementForm, setMovementForm] = useState({ partId: '', type: 'incoming' as any, quantity: 0, reason: '', performedBy: '' });

    const readyMotos = motos.filter(m => m.status === 'ready');
    const lowStockParts = parts.filter(p => p.quantity <= p.minStock);

    const filteredParts = parts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    const handleSave = () => {
        if (!form.name) return;
        if (editId) {
            updatePart(editId, form);
        } else {
            addPart(form);
        }
        setShowModal(false);
        setEditId(null);
        setForm({ name: '', quantity: 0, price: 0, minStock: 10, unit: 'dona' });
    };

    const openEdit = (id: string) => {
        const p = parts.find(x => x.id === id);
        if (!p) return;
        setForm({ name: p.name, quantity: p.quantity, price: p.price, minStock: p.minStock, unit: p.unit });
        setEditId(id);
        setShowModal(true);
    };

    const handleMovement = () => {
        if (!movementForm.partId || movementForm.quantity <= 0) return;
        addInventoryMovement({
            partId: movementForm.partId,
            type: movementForm.type,
            quantity: movementForm.quantity,
            reason: movementForm.reason,
            date: new Date().toISOString().split('T')[0],
            performedBy: movementForm.performedBy || 'Admin',
        });
        setShowMovementModal(false);
        setMovementForm({ partId: '', type: 'incoming', quantity: 0, reason: '', performedBy: '' });
    };

    const tabs = [
        { id: 'parts', label: 'Detallar', count: parts.length },
        { id: 'ready', label: 'Tayyor motolar', count: readyMotos.length },
        { id: 'movements', label: 'Harakatlar', count: inventoryMovements.length },
    ];

    return (
        <div className="admin-content">
            <CrmPageHeader
                title="Sklad (Ombor)"
                subtitle={`${parts.length} turdagi detal, ${readyMotos.length} tayyor moto`}
                actions={
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-secondary" onClick={() => setShowMovementModal(true)}>
                            <ArrowDownUp size={18} /> Harakat
                        </button>
                        <button className="btn-primary" onClick={() => { setEditId(null); setForm({ name: '', quantity: 0, price: 0, minStock: 10, unit: 'dona' }); setShowModal(true); }}>
                            <Plus size={18} /> Detal qo'shish
                        </button>
                    </div>
                }
            />

            {/* Low stock alerts */}
            {lowStockParts.length > 0 && (
                <div className="crm-stock-alert">
                    <AlertTriangle size={18} />
                    <span><strong>{lowStockParts.length}</strong> ta detal kam qolgan: {lowStockParts.map(p => p.name).join(', ')}</span>
                </div>
            )}

            <CrmTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === 'parts' && (
                <>
                    <div className="table-controls">
                        <div className="navbar-search" style={{ minWidth: 260 }}>
                            <Search size={18} />
                            <input placeholder="Detal nomi..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                    </div>
                    <div className="admin-card">
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Detal nomi</th>
                                        <th>Miqdor</th>
                                        <th>Min.stock</th>
                                        <th>Narx</th>
                                        <th>Umumiy qiymat</th>
                                        <th>Birlik</th>
                                        <th>Holat</th>
                                        <th>Amallar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredParts.map(p => (
                                        <tr key={p.id} className={p.quantity <= p.minStock ? 'crm-row-warning' : ''}>
                                            <td className="font-bold">{p.name}</td>
                                            <td style={{ fontWeight: 600, color: p.quantity <= p.minStock ? '#F44336' : 'var(--text)' }}>
                                                {p.quantity}
                                            </td>
                                            <td>{p.minStock}</td>
                                            <td>{formatPrice(p.price)}</td>
                                            <td>{formatPrice(p.price * p.quantity)}</td>
                                            <td>{p.unit}</td>
                                            <td>
                                                {p.quantity <= p.minStock ? (
                                                    <span className="crm-badge crm-badge--unpaid crm-badge--sm">Kam!</span>
                                                ) : (
                                                    <span className="crm-badge crm-badge--ready crm-badge--sm">Yetarli</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="crm-table-actions">
                                                    <button className="crm-action-btn" onClick={() => openEdit(p.id)}><Edit size={16} /></button>
                                                    <button className="crm-action-btn crm-action-btn--danger" onClick={() => { if (confirm("O'chirish?")) deletePart(p.id); }}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'ready' && (
                <div className="admin-card">
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Model</th>
                                    <th>Seriya №</th>
                                    <th>Tannarx</th>
                                    <th>Sotuv narxi</th>
                                    <th>Tayyor bo'lgan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {readyMotos.map(m => (
                                    <tr key={m.id}>
                                        <td className="font-bold">{m.model}</td>
                                        <td className="font-mono">{m.serialNumber}</td>
                                        <td>{formatPrice(m.costPrice)}</td>
                                        <td>{formatPrice(m.sellPrice)}</td>
                                        <td>{m.completedAt || '—'}</td>
                                    </tr>
                                ))}
                                {readyMotos.length === 0 && (
                                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>Hozircha tayyor motolar yo'q</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'movements' && (
                <div className="admin-card">
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Sana</th>
                                    <th>Detal</th>
                                    <th>Turi</th>
                                    <th>Miqdor</th>
                                    <th>Sabab</th>
                                    <th>Kim</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...inventoryMovements].sort((a, b) => b.date.localeCompare(a.date)).map(im => (
                                    <tr key={im.id}>
                                        <td className="font-mono">{im.date}</td>
                                        <td className="font-bold">{parts.find(p => p.id === im.partId)?.name || im.partId}</td>
                                        <td><CrmBadge status={im.type} size="sm" /></td>
                                        <td style={{ fontWeight: 600, color: im.type === 'incoming' ? '#00C853' : '#F44336' }}>
                                            {im.type === 'incoming' ? '+' : '-'}{im.quantity}
                                        </td>
                                        <td>{im.reason}</td>
                                        <td>{im.performedBy}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Part Modal */}
            <CrmModal
                isOpen={showModal}
                onClose={() => { setShowModal(false); setEditId(null); }}
                title={editId ? 'Detalni tahrirlash' : 'Yangi detal'}
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => { setShowModal(false); setEditId(null); }}>Bekor</button>
                        <button className="btn-primary" onClick={handleSave}>Saqlash</button>
                    </>
                }
            >
                <div className="form-group">
                    <label>Detal nomi</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Motor (150cc)" />
                </div>
                <div className="form-grid-2">
                    <div className="form-group">
                        <label>Miqdor</label>
                        <input type="number" value={form.quantity || ''} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} />
                    </div>
                    <div className="form-group">
                        <label>Min.stock</label>
                        <input type="number" value={form.minStock || ''} onChange={e => setForm({ ...form, minStock: Number(e.target.value) })} />
                    </div>
                </div>
                <div className="form-grid-2">
                    <div className="form-group">
                        <label>Narx (so'm)</label>
                        <input type="number" value={form.price || ''} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
                    </div>
                    <div className="form-group">
                        <label>Birlik</label>
                        <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                            <option value="dona">dona</option>
                            <option value="komplekt">komplekt</option>
                            <option value="juft">juft</option>
                            <option value="metr">metr</option>
                            <option value="kg">kg</option>
                        </select>
                    </div>
                </div>
            </CrmModal>

            {/* Movement Modal */}
            <CrmModal
                isOpen={showMovementModal}
                onClose={() => setShowMovementModal(false)}
                title="Sklad harakati"
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => setShowMovementModal(false)}>Bekor</button>
                        <button className="btn-primary" onClick={handleMovement}>Tasdiqlash</button>
                    </>
                }
            >
                <div className="form-group">
                    <label>Detal</label>
                    <select value={movementForm.partId} onChange={e => setMovementForm({ ...movementForm, partId: e.target.value })}>
                        <option value="">Tanlang...</option>
                        {parts.map(p => <option key={p.id} value={p.id}>{p.name} ({p.quantity} {p.unit})</option>)}
                    </select>
                </div>
                <div className="form-grid-2">
                    <div className="form-group">
                        <label>Harakat turi</label>
                        <select value={movementForm.type} onChange={e => setMovementForm({ ...movementForm, type: e.target.value })}>
                            <option value="incoming">Kirim</option>
                            <option value="outgoing">Chiqim</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Miqdor</label>
                        <input type="number" value={movementForm.quantity || ''} onChange={e => setMovementForm({ ...movementForm, quantity: Number(e.target.value) })} />
                    </div>
                </div>
                <div className="form-group">
                    <label>Sabab</label>
                    <input value={movementForm.reason} onChange={e => setMovementForm({ ...movementForm, reason: e.target.value })} placeholder="Xarid / Yig'ish #..." />
                </div>
            </CrmModal>
        </div>
    );
}
