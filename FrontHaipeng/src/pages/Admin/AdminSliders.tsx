import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, X, Save, Upload, Loader, Eye, EyeOff, GripVertical } from 'lucide-react';
import { api } from '../../api';

export default function AdminSliders() {
    const [slides, setSlides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const emptySlide = {
        title: '', subtitle: '', eyebrow: '', image: '',
        button_text: 'Batafsil', button_link: '/catalog',
        color: '#FF4C00', display_order: slides.length, is_active: true,
    };
    const [form, setForm] = useState({ ...emptySlide });

    const load = () => {
        setLoading(true);
        api.slides.listAll()
            .then(setSlides)
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const openCreate = () => {
        setEditingId(null);
        setForm({ ...emptySlide, display_order: slides.length });
        setShowModal(true);
    };

    const openEdit = (s: any) => {
        setEditingId(s.id);
        setForm({
            title: s.title, subtitle: s.subtitle, eyebrow: s.eyebrow,
            image: s.image, button_text: s.button_text, button_link: s.button_link,
            color: s.color, display_order: s.display_order, is_active: s.is_active,
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
        if (!form.title || !form.image) {
            alert("Sarlavha va rasm majburiy!");
            return;
        }
        setSaving(true);
        try {
            if (editingId) {
                await api.slides.update(editingId, form);
            } else {
                await api.slides.create(form);
            }
            setShowModal(false);
            load();
        } catch (e: any) {
            alert(e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu slaydni o'chirmoqchimisiz?")) return;
        try {
            await api.slides.delete(id);
            load();
        } catch (e: any) {
            alert(e.message);
        }
    };

    const toggleActive = async (s: any) => {
        try {
            await api.slides.update(s.id, { is_active: !s.is_active });
            load();
        } catch (e: any) {
            alert(e.message);
        }
    };

    return (
        <div className="admin-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Hero Slayder</h1>
                    <p className="page-subtitle">{slides.length} ta slayd</p>
                </div>
                <div className="header-actions">
                    <button className="btn-primary" onClick={openCreate}>
                        <Plus size={16} /> Slayd qo'shish
                    </button>
                </div>
            </div>

            {loading ? <p>Yuklanmoqda...</p> : (
                <div className="slides-grid">
                    {slides.map((s, i) => (
                        <div key={s.id} className={`slide-card ${!s.is_active ? 'slide-card--inactive' : ''}`}>
                            <div className="slide-card__image">
                                <img src={s.image} alt={s.title} />
                                <div className="slide-card__overlay">
                                    <span className="slide-card__order">#{i + 1}</span>
                                    {!s.is_active && <span className="slide-card__disabled">O'chirilgan</span>}
                                </div>
                            </div>
                            <div className="slide-card__body">
                                <div className="slide-card__info">
                                    {s.eyebrow && <span className="slide-card__eyebrow">{s.eyebrow}</span>}
                                    <h3 className="slide-card__title">{s.title}</h3>
                                    {s.subtitle && <p className="slide-card__subtitle">{s.subtitle}</p>}
                                </div>
                                <div className="slide-card__actions">
                                    <button
                                        className={`action-btn ${s.is_active ? 'edit' : 'delete'}`}
                                        title={s.is_active ? "O'chirish" : "Yoqish"}
                                        onClick={() => toggleActive(s)}
                                    >
                                        {s.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                                    </button>
                                    <button className="action-btn edit" title="Tahrirlash" onClick={() => openEdit(s)}>
                                        <GripVertical size={14} />
                                    </button>
                                    <button className="action-btn delete" title="O'chirish" onClick={() => handleDelete(s.id)}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {slides.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>
                            <p>Hali slaydlar qo'shilmagan</p>
                            <button className="btn-primary" onClick={openCreate} style={{ marginTop: '1rem' }}>
                                <Plus size={16} /> Birinchi slaydni qo'shing
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ===== MODAL ===== */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingId ? 'Slaydni tahrirlash' : 'Yangi slayd qo\'shish'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            {/* Image Upload */}
                            <div className="form-group">
                                <label><Upload size={14} /> Fon rasmi *</label>
                                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                <div className="upload-zone" onClick={() => fileInputRef.current?.click()} style={{ minHeight: 160 }}>
                                    {uploading ? (
                                        <div className="upload-loading"><Loader size={24} className="spin" /> Yuklanmoqda...</div>
                                    ) : form.image ? (
                                        <div className="upload-preview">
                                            <img src={form.image} alt="Slayd rasmi" style={{ width: '100%', maxWidth: 400, height: 'auto', maxHeight: 200 }} />
                                            <span>Boshqa rasm tanlash uchun bosing</span>
                                        </div>
                                    ) : (
                                        <div className="upload-placeholder">
                                            <Upload size={40} />
                                            <span>Fon rasmi yuklang</span>
                                            <small>Tavsiya: 1600×800 yoki undan katta</small>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Kichik sarlavha (eyebrow)</label>
                                <input value={form.eyebrow} onChange={e => setForm({ ...form, eyebrow: e.target.value })} placeholder="Yangi Avlod" />
                            </div>

                            <div className="form-group">
                                <label>Sarlavha *</label>
                                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Tezlik va Ozodlik" />
                            </div>

                            <div className="form-group">
                                <label>Izoh</label>
                                <textarea rows={2} value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} placeholder="Qisqa tavsif..." />
                            </div>

                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label>Tugma matni</label>
                                    <input value={form.button_text} onChange={e => setForm({ ...form, button_text: e.target.value })} placeholder="Batafsil" />
                                </div>
                                <div className="form-group">
                                    <label>Tugma havolasi</label>
                                    <input value={form.button_link} onChange={e => setForm({ ...form, button_link: e.target.value })} placeholder="/catalog" />
                                </div>
                                <div className="form-group">
                                    <label>Rang</label>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={{ width: 40, height: 36, padding: 0, border: 'none', cursor: 'pointer' }} />
                                        <input value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={{ flex: 1 }} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Tartib raqami</label>
                                    <input type="number" value={form.display_order} onChange={e => setForm({ ...form, display_order: Number(e.target.value) })} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ gap: '0.5rem' }}>
                                    <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} style={{ width: 'auto' }} />
                                    Faol (saytda ko'rinadi)
                                </label>
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
