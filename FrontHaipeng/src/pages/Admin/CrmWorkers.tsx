import { useState } from 'react';
import { useCrmStore } from '../../store/crmStore';
import { useNavigate } from 'react-router-dom';
import CrmPageHeader from '../../components/Admin/CrmPageHeader';
import CrmBadge from '../../components/Admin/CrmBadge';
import CrmModal from '../../components/Admin/CrmModal';
import CrmTabs from '../../components/Admin/CrmTabs';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';

function formatPrice(n: number) {
    return new Intl.NumberFormat('uz-UZ').format(n);
}

export default function CrmWorkers() {
    const workers = useCrmStore(s => s.workers);
    const getWorkerEarnings = useCrmStore(s => s.getWorkerEarnings);
    const getWorkerBalance = useCrmStore(s => s.getWorkerBalance);
    const getWorkerMotoCount = useCrmStore(s => s.getWorkerMotoCount);
    const addWorker = useCrmStore(s => s.addWorker);
    const updateWorker = useCrmStore(s => s.updateWorker);
    const deleteWorker = useCrmStore(s => s.deleteWorker);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('list');
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ name: '', position: '', phone: '', payType: 'per_moto' as any, payRate: 0, baseSalary: 0, status: 'active' as any });

    const filtered = workers.filter(w =>
        w.name.toLowerCase().includes(search.toLowerCase()) || w.position.toLowerCase().includes(search.toLowerCase())
    );

    // Leaderboard — eng ko'p moto yig'gan ishchilar
    const leaderboard = workers
        .filter(w => w.status === 'active')
        .map(w => ({
            ...w,
            motoCount: getWorkerMotoCount(w.id),
            totalEarnings: getWorkerEarnings(w.id),
            balance: getWorkerBalance(w.id),
        }))
        .sort((a, b) => b.motoCount - a.motoCount);

    const handleSave = () => {
        if (!form.name) return;
        if (editId) {
            updateWorker(editId, form);
        } else {
            addWorker(form);
        }
        setShowModal(false);
        setEditId(null);
        setForm({ name: '', position: '', phone: '', payType: 'per_moto', payRate: 0, baseSalary: 0, status: 'active' });
    };

    const openEdit = (id: string) => {
        const w = workers.find(x => x.id === id);
        if (!w) return;
        setForm({ name: w.name, position: w.position, phone: w.phone, payType: w.payType, payRate: w.payRate, baseSalary: w.baseSalary, status: w.status });
        setEditId(id);
        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Haqiqatan ham o'chirmoqchimisiz?")) deleteWorker(id);
    };

    const tabs = [
        { id: 'list', label: "Ishchilar ro'yxati", count: workers.length },
        { id: 'leaderboard', label: 'Leaderboard', count: leaderboard.filter(l => l.motoCount > 0).length },
    ];

    return (
        <div className="admin-content">
            <CrmPageHeader
                title="Ishchilar"
                subtitle={`Jami: ${workers.length} ishchi (${workers.filter(w => w.status === 'active').length} faol)`}
                actions={
                    <button className="btn-primary" onClick={() => { setEditId(null); setForm({ name: '', position: '', phone: '', payType: 'per_moto', payRate: 0, baseSalary: 0, status: 'active' }); setShowModal(true); }}>
                        <Plus size={18} /> Ishchi qo'shish
                    </button>
                }
            />

            <CrmTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === 'list' && (
                <>
                    <div className="table-controls">
                        <div className="navbar-search" style={{ minWidth: 260 }}>
                            <Search size={18} />
                            <input placeholder="Ism yoki lavozim..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                    </div>

                    <div className="admin-card">
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Ishchi</th>
                                        <th>Lavozim</th>
                                        <th>Telefon</th>
                                        <th>Oylik</th>
                                        <th>Balans</th>
                                        <th>Status</th>
                                        <th>Amallar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(w => {
                                        const balance = getWorkerBalance(w.id);
                                        return (
                                            <tr key={w.id}>
                                                <td>
                                                    <div className="user-table-info">
                                                        <div className="user-avatar-small">{w.name.charAt(0)}</div>
                                                        <strong>{w.name}</strong>
                                                    </div>
                                                </td>
                                                <td>{w.position}</td>
                                                <td className="font-mono">{w.phone}</td>
                                                <td>{formatPrice(w.baseSalary)}</td>
                                                <td style={{ color: balance > 0 ? '#F44336' : '#00C853', fontWeight: 600 }}>
                                                    {balance > 0 ? formatPrice(balance) : balance === 0 ? '—' : `+${formatPrice(Math.abs(balance))}`}
                                                </td>
                                                <td><CrmBadge status={w.status} size="sm" /></td>
                                                <td>
                                                    <div className="crm-table-actions">
                                                        <button className="crm-action-btn crm-action-btn--primary" title="Profil" onClick={() => navigate(`/panel/crm/workers/${w.id}`)}>
                                                            <Eye size={16} />
                                                        </button>
                                                        <button className="crm-action-btn" title="Tahrirlash" onClick={() => openEdit(w.id)}>
                                                            <Edit size={16} />
                                                        </button>
                                                        <button className="crm-action-btn crm-action-btn--danger" title="O'chirish" onClick={() => handleDelete(w.id)}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'leaderboard' && (
                <div className="crm-leaderboard">
                    {leaderboard.map((w, i) => (
                        <div key={w.id} className={`crm-leader-card ${i < 3 ? 'crm-leader-card--top' : ''}`} onClick={() => navigate(`/panel/crm/workers/${w.id}`)} style={{ cursor: 'pointer' }}>
                            <div className="crm-leader-rank">
                                {i < 3 ? (
                                    <span className={`crm-leader-medal crm-leader-medal--${i + 1}`}>
                                        {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                                    </span>
                                ) : (
                                    <span className="crm-leader-num">#{i + 1}</span>
                                )}
                            </div>
                            <div className="crm-leader-info">
                                <div className="user-avatar-small">{w.name.charAt(0)}</div>
                                <div>
                                    <strong>{w.name}</strong>
                                    <small>{w.position}</small>
                                </div>
                            </div>
                            <div className="crm-leader-stats">
                                <div className="crm-leader-stat">
                                    <span>{w.motoCount}</span>
                                    <small>Moto</small>
                                </div>
                                <div className="crm-leader-stat">
                                    <span>{formatPrice(w.totalEarnings)}</span>
                                    <small>Jami daromad</small>
                                </div>
                                <div className="crm-leader-stat">
                                    <span style={{ color: w.balance > 0 ? '#F44336' : '#00C853' }}>
                                        {w.balance > 0 ? formatPrice(w.balance) : '✓'}
                                    </span>
                                    <small>{w.balance > 0 ? "Qoldiq" : "To'langan"}</small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <CrmModal
                isOpen={showModal}
                onClose={() => { setShowModal(false); setEditId(null); }}
                title={editId ? 'Ishchini tahrirlash' : 'Yangi ishchi'}
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => { setShowModal(false); setEditId(null); }}>Bekor</button>
                        <button className="btn-primary" onClick={handleSave}>Saqlash</button>
                    </>
                }
            >
                <div className="form-group">
                    <label>Ism</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="To'liq ism" />
                </div>
                <div className="form-grid-2">
                    <div className="form-group">
                        <label>Lavozim</label>
                        <input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} placeholder="Yig'uvchi" />
                    </div>
                    <div className="form-group">
                        <label>Telefon</label>
                        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+998901234567" />
                    </div>
                </div>
                <div className="form-grid-2">
                    <div className="form-group">
                        <label>To'lov turi</label>
                        <select value={form.payType} onChange={e => setForm({ ...form, payType: e.target.value })}>
                            <option value="per_moto">Har moto uchun</option>
                            <option value="per_task">Har ish uchun</option>
                            <option value="fixed">Oylik</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Stavka (so'm)</label>
                        <input type="number" value={form.payRate || ''} onChange={e => setForm({ ...form, payRate: Number(e.target.value) })} />
                    </div>
                </div>
                <div className="form-group">
                    <label>Asosiy oylik (so'm)</label>
                    <input type="number" value={form.baseSalary || ''} onChange={e => setForm({ ...form, baseSalary: Number(e.target.value) })} placeholder="3 000 000" />
                </div>
                {editId && (
                    <div className="form-group">
                        <label>Status</label>
                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                            <option value="active">Faol</option>
                            <option value="inactive">Nofaol</option>
                        </select>
                    </div>
                )}
            </CrmModal>
        </div>
    );
}
