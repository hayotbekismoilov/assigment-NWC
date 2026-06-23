import { useState } from 'react';
import { useCrmStore } from '../../store/crmStore';
import CrmPageHeader from '../../components/Admin/CrmPageHeader';
import CrmBadge from '../../components/Admin/CrmBadge';
import CrmModal from '../../components/Admin/CrmModal';
import { Clock, Wrench, CheckCircle, Plus, Users, DollarSign, Bike } from 'lucide-react';
import type { MotoStatus } from '../../types/crm';

function formatPrice(n: number) {
    return new Intl.NumberFormat('uz-UZ').format(n);
}

const columns: { id: MotoStatus; label: string; icon: any; color: string }[] = [
    { id: 'pending', label: 'Kutilmoqda', icon: Clock, color: '#FF9800' },
    { id: 'assembling', label: 'Jarayonda', icon: Wrench, color: '#2196F3' },
    { id: 'ready', label: 'Tayyor', icon: CheckCircle, color: '#00C853' },
];

export default function CrmProduction() {
    const motos = useCrmStore(s => s.motos);
    const workers = useCrmStore(s => s.workers);
    const workerTasks = useCrmStore(s => s.workerTasks);
    const addMoto = useCrmStore(s => s.addMoto);
    const updateMoto = useCrmStore(s => s.updateMoto);
    const completeMoto = useCrmStore(s => s.completeMoto);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState<string | null>(null);
    const [newMoto, setNewMoto] = useState({ model: '', serialNumber: '', costPrice: 0, sellPrice: 0 });

    // const activeWorkers = workers.filter(w => w.status === 'active');
    const detailMoto = motos.find(m => m.id === showDetailModal);

    const handleAddMoto = () => {
        if (!newMoto.model || !newMoto.serialNumber) return;
        addMoto({
            model: newMoto.model,
            serialNumber: newMoto.serialNumber,
            status: 'pending',
            costPrice: newMoto.costPrice,
            sellPrice: newMoto.sellPrice,
            partsUsed: [],
            workersAssigned: [],
        });
        setNewMoto({ model: '', serialNumber: '', costPrice: 0, sellPrice: 0 });
        setShowAddModal(false);
    };

    const handleStartAssembly = (id: string) => {
        updateMoto(id, { status: 'assembling' });
    };

    const handleComplete = (id: string) => {
        completeMoto(id);
    };

    const getTasksForMoto = (motoId: string) => workerTasks.filter(t => t.motoId === motoId);
    const getWorkerName = (workerId: string) => workers.find(w => w.id === workerId)?.name || 'Noma\'lum';

    return (
        <div className="admin-content">
            <CrmPageHeader
                title="Ishlab Chiqarish"
                subtitle="Moto yig'ish jarayoni va boshqaruvi"
                actions={
                    <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        <Plus size={18} /> Yangi moto
                    </button>
                }
            />

            {/* Stats Row */}
            <div className="crm-production-stats">
                <div className="crm-prod-stat">
                    <Clock size={18} style={{ color: '#FF9800' }} />
                    <span>{motos.filter(m => m.status === 'pending').length}</span>
                    <small>Kutilmoqda</small>
                </div>
                <div className="crm-prod-stat">
                    <Wrench size={18} style={{ color: '#2196F3' }} />
                    <span>{motos.filter(m => m.status === 'assembling').length}</span>
                    <small>Jarayonda</small>
                </div>
                <div className="crm-prod-stat">
                    <CheckCircle size={18} style={{ color: '#00C853' }} />
                    <span>{motos.filter(m => m.status === 'ready').length}</span>
                    <small>Tayyor</small>
                </div>
                <div className="crm-prod-stat">
                    <Bike size={18} style={{ color: '#9C27B0' }} />
                    <span>{motos.filter(m => m.status === 'sold').length}</span>
                    <small>Sotilgan</small>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="crm-kanban">
                {columns.map(col => {
                    const Icon = col.icon;
                    const colMotos = motos.filter(m => m.status === col.id);
                    return (
                        <div key={col.id} className="crm-kanban-column">
                            <div className="crm-kanban-header" style={{ borderColor: col.color }}>
                                <Icon size={18} style={{ color: col.color }} />
                                <span>{col.label}</span>
                                <span className="crm-kanban-count">{colMotos.length}</span>
                            </div>
                            <div className="crm-kanban-cards">
                                {colMotos.map(moto => {
                                    // const tasks = getTasksForMoto(moto.id);
                                    // const laborCost = tasks.reduce((s, t) => s + t.amount, 0);
                                    return (
                                        <div key={moto.id} className="crm-kanban-card" onClick={() => setShowDetailModal(moto.id)}>
                                            <div className="crm-kanban-card-header">
                                                <strong>{moto.model}</strong>
                                                <CrmBadge status={moto.status} size="sm" />
                                            </div>
                                            <p className="crm-kanban-serial">#{moto.serialNumber}</p>
                                            <div className="crm-kanban-card-info">
                                                <div className="crm-kanban-info-item">
                                                    <Users size={14} />
                                                    <span>{moto.workersAssigned.length} ishchi</span>
                                                </div>
                                                <div className="crm-kanban-info-item">
                                                    <DollarSign size={14} />
                                                    <span>{formatPrice(moto.costPrice)}</span>
                                                </div>
                                            </div>
                                            {col.id === 'pending' && (
                                                <button
                                                    className="crm-kanban-action"
                                                    onClick={(e) => { e.stopPropagation(); handleStartAssembly(moto.id); }}
                                                >
                                                    <Wrench size={14} /> Yig'ishni boshlash
                                                </button>
                                            )}
                                            {col.id === 'assembling' && (
                                                <button
                                                    className="crm-kanban-action crm-kanban-action--success"
                                                    onClick={(e) => { e.stopPropagation(); handleComplete(moto.id); }}
                                                >
                                                    <CheckCircle size={14} /> Tayyor deb belgilash
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                                {colMotos.length === 0 && (
                                    <div className="crm-kanban-empty">Bo'sh</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add Modal */}
            <CrmModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Yangi moto qo'shish"
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => setShowAddModal(false)}>Bekor qilish</button>
                        <button className="btn-primary" onClick={handleAddMoto}>Qo'shish</button>
                    </>
                }
            >
                <div className="form-group">
                    <label>Model nomi</label>
                    <input value={newMoto.model} onChange={e => setNewMoto({ ...newMoto, model: e.target.value })} placeholder="Masalan: Haipeng HP-150" />
                </div>
                <div className="form-group">
                    <label>Seriya raqami</label>
                    <input value={newMoto.serialNumber} onChange={e => setNewMoto({ ...newMoto, serialNumber: e.target.value })} placeholder="Masalan: HP150-006" />
                </div>
                <div className="form-grid-2">
                    <div className="form-group">
                        <label>Tannarx (so'm)</label>
                        <input type="number" value={newMoto.costPrice || ''} onChange={e => setNewMoto({ ...newMoto, costPrice: Number(e.target.value) })} placeholder="8200000" />
                    </div>
                    <div className="form-group">
                        <label>Sotuv narxi (so'm)</label>
                        <input type="number" value={newMoto.sellPrice || ''} onChange={e => setNewMoto({ ...newMoto, sellPrice: Number(e.target.value) })} placeholder="12500000" />
                    </div>
                </div>
            </CrmModal>

            {/* Detail Modal */}
            <CrmModal
                isOpen={!!showDetailModal}
                onClose={() => setShowDetailModal(null)}
                title={detailMoto ? `${detailMoto.model} — #${detailMoto.serialNumber}` : ''}
                size="lg"
            >
                {detailMoto && (
                    <div className="crm-moto-detail">
                        <div className="crm-detail-grid">
                            <div className="crm-detail-item">
                                <small>Model</small>
                                <strong>{detailMoto.model}</strong>
                            </div>
                            <div className="crm-detail-item">
                                <small>Status</small>
                                <CrmBadge status={detailMoto.status} />
                            </div>
                            <div className="crm-detail-item">
                                <small>Tannarx</small>
                                <strong>{formatPrice(detailMoto.costPrice)} so'm</strong>
                            </div>
                            <div className="crm-detail-item">
                                <small>Sotuv narxi</small>
                                <strong>{formatPrice(detailMoto.sellPrice)} so'm</strong>
                            </div>
                            <div className="crm-detail-item">
                                <small>Foyda</small>
                                <strong style={{ color: '#00C853' }}>{formatPrice(detailMoto.sellPrice - detailMoto.costPrice)} so'm</strong>
                            </div>
                            <div className="crm-detail-item">
                                <small>Yaratilgan</small>
                                <strong>{detailMoto.createdAt}</strong>
                            </div>
                        </div>

                        <h4 style={{ margin: '1.5rem 0 0.75rem', fontFamily: "'Outfit', sans-serif" }}>Ishchilar va vazifalar</h4>
                        {getTasksForMoto(detailMoto.id).length > 0 ? (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Ishchi</th>
                                        <th>Vazifa</th>
                                        <th>Summa</th>
                                        <th>To'lov</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getTasksForMoto(detailMoto.id).map(t => (
                                        <tr key={t.id}>
                                            <td className="font-bold">{getWorkerName(t.workerId)}</td>
                                            <td>{t.description}</td>
                                            <td>{formatPrice(t.amount)} so'm</td>
                                            <td><CrmBadge status={t.paid ? 'paid' : 'unpaid'} size="sm" /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{ color: 'var(--text3)' }}>Hali vazifalar biriktirilmagan</p>
                        )}
                    </div>
                )}
            </CrmModal>
        </div>
    );
}
