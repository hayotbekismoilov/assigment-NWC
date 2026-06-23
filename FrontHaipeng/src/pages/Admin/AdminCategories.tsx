import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, X, Save, Upload, Loader } from 'lucide-react';
import { api } from '../../api';

const emptyCategory = {
    id: '', name: '', name_uz: '', description: '', image: '',
};

export default function AdminCategories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ ...emptyCategory });
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const load = () => {
        setLoading(true);
        api.categories.list()
            .then(setCategories)
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const openCreate = () => {
        setEditingId(null);
        setForm({ ...emptyCategory });
        setShowModal(true);
    };

    const openEdit = (cat: any) => {
        setEditingId(cat.id);
        setForm({
            id: cat.id,
            name: cat.name,
            name_uz: cat.nameUz,
            description: cat.description || '',
            image: cat.image || '',
        });
        setShowModal(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const result = await api.upload.image(file);
            setForm(f => ({ ...f, image: result.url }));
        } catch (err: any) {
            alert(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!form.name || !form.name_uz) {
            alert("Iltimos barcha majburiy maydonlarni to'ldiring");
            return;
        }
        if (!editingId && !form.id) {
            alert("ID (slug) kiritilishi kerak");
            return;
        }
        setSaving(true);
        try {
            if (editingId) {
                await api.categories.update(editingId, {
                    name: form.name,
                    name_uz: form.name_uz,
                    description: form.description,
                    image: form.image,
                });
            } else {
                await api.categories.create(form);
            }
            setShowModal(false);
            load();
        } catch (e: any) {
            alert(e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`"${name}" kategoriyasini o'chirmoqchimisiz?`)) return;
        try {
            await api.categories.delete(id);
            load();
        } catch (e: any) {
            alert(e.message);
        }
    };

    return (
        <div className="admin-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Kategoriyalar</h1>
                    <p className="page-subtitle">{categories.length} ta kategoriya</p>
                </div>
                <div className="header-actions">
                    <button className="btn-primary" onClick={openCreate}>
                        <Plus size={16} /> Kategoriya qo'shish
                    </button>
                </div>
            </div>

            {loading ? <p>Yuklanmoqda...</p> : (
                <div className="admin-card">
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Kategoriya</th>
                                    <th>Nomi (UZ)</th>
                                    <th>Tavsif</th>
                                    <th>Mahsulotlar</th>
                                    <th>Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(cat => (
                                    <tr key={cat.id}>
                                        <td>
                                            <div className="product-table-item">
                                                <img src={cat.image} alt={cat.name} />
                                                <div className="item-info">
                                                    <span className="item-name">{cat.name}</span>
                                                    <span className="item-brand">{cat.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="font-bold">{cat.nameUz}</td>
                                        <td>{cat.description}</td>
                                        <td><span className="count-pill">{cat.count} ta</span></td>
                                        <td>
                                            <div className="table-actions">
                                                <button className="action-btn edit" title="Tahrirlash" onClick={() => openEdit(cat)}><Edit size={14} /></button>
                                                <button className="action-btn delete" title="O'chirish" onClick={() => handleDelete(cat.id, cat.nameUz)}><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>Kategoriyalar topilmadi</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ===== MODAL ===== */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingId ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya qo\'shish'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            {!editingId && (
                                <div className="form-group">
                                    <label>ID (slug) *</label>
                                    <input value={form.id} onChange={e => setForm({ ...form, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="motorcycle" />
                                    <small style={{ color: 'var(--text3)', fontSize: '0.75rem' }}>Faqat kichik harf va tire. Masalan: electric-scooter</small>
                                </div>
                            )}
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label>Nomi (EN) *</label>
                                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Motorcycles" />
                                </div>
                                <div className="form-group">
                                    <label>Nomi (UZ) *</label>
                                    <input value={form.name_uz} onChange={e => setForm({ ...form, name_uz: e.target.value })} placeholder="Motosikllar" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Tavsif</label>
                                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Sport va kruizer" />
                            </div>

                            {/* Image Upload */}
                            <div className="form-group">
                                <label><Upload size={14} /> Rasm</label>
                                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                                    {uploading ? (
                                        <div className="upload-loading"><Loader size={24} className="spin" /> Yuklanmoqda...</div>
                                    ) : form.image ? (
                                        <div className="upload-preview">
                                            <img src={form.image} alt="Rasm" />
                                            <span>Boshqa rasm tanlash uchun bosing</span>
                                        </div>
                                    ) : (
                                        <div className="upload-placeholder">
                                            <Upload size={32} />
                                            <span>Rasm yuklash uchun bosing</span>
                                            <small>JPG, PNG, WebP — max 10 MB</small>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowModal(false)}>Bekor qilish</button>
                            <button className="btn-primary" onClick={handleSave} disabled={saving}>
                                <Save size={16} /> {saving ? 'Saqlanmoqda...' : editingId ? 'Saqlash' : 'Qo\'shish'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
