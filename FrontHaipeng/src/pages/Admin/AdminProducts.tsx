import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit, Trash2, X, Save, Upload, Loader } from 'lucide-react';
import { api } from '../../api';

function formatPrice(price: number) {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
}

const emptyProduct = {
    id: '', name: '', brand: 'Haipeng', category_id: '', price: 0, old_price: null as number | null,
    image: '', images: [] as string[], badge: '' as string, description: '',
    specs: { engine: '', power: '', maxSpeed: '', fuelCapacity: '', weight: '', seatHeight: '', range: '', brakes: '' },
    in_stock: true, rating: 0, review_count: 0, colors: [] as string[],
};

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ ...emptyProduct });
    const [saving, setSaving] = useState(false);
    const [colorInput, setColorInput] = useState('#FF4C00');
    const [uploading, setUploading] = useState(false);
    const [uploadingExtra, setUploadingExtra] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const extraFilesRef = useRef<HTMLInputElement>(null);

    const load = () => {
        setLoading(true);
        const params: Record<string, string> = {};
        if (search) params.search = search;
        api.products.list(params)
            .then(data => setProducts(data.items))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [search]);
    useEffect(() => { api.categories.list().then(setCategories).catch(() => { }); }, []);

    const openCreate = () => {
        setEditingId(null);
        setForm({ ...emptyProduct, id: `hp-${Date.now().toString(36)}` });
        setShowModal(true);
    };

    const openEdit = (p: any) => {
        setEditingId(p.id);
        setForm({
            id: p.id, name: p.name, brand: p.brand, category_id: p.category,
            price: p.price, old_price: p.oldPrice || null,
            image: p.image, images: p.images || [],
            badge: p.badge || '', description: p.description || '',
            specs: { engine: '', power: '', maxSpeed: '', fuelCapacity: '', weight: '', seatHeight: '', range: '', brakes: '', ...p.specs },
            in_stock: p.inStock, rating: p.rating, review_count: p.reviewCount,
            colors: p.colors || [],
        });
        setShowModal(true);
    };

    const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const result = await api.upload.image(file);
            setForm(f => ({ ...f, image: result.url, images: [result.url, ...f.images.filter(i => i !== f.image)] }));
        } catch (err: any) {
            alert(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleExtraImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setUploadingExtra(true);
        try {
            const results = await api.upload.multiple(files);
            setForm(f => ({ ...f, images: [...f.images, ...results.map(r => r.url)] }));
        } catch (err: any) {
            alert(err.message);
        } finally {
            setUploadingExtra(false);
        }
    };

    const removeExtraImage = (url: string) => {
        setForm(f => ({ ...f, images: f.images.filter(i => i !== url) }));
    };

    const handleSave = async () => {
        if (!form.name || !form.category_id || !form.price) {
            alert("Iltimos barcha majburiy maydonlarni to'ldiring");
            return;
        }
        setSaving(true);
        try {
            const data = {
                ...form,
                old_price: form.old_price || undefined,
                badge: form.badge || undefined,
                specs: Object.fromEntries(Object.entries(form.specs).filter(([, v]) => v)),
            };
            if (editingId) {
                await api.products.update(editingId, data);
            } else {
                await api.products.create(data);
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
        if (!confirm(`"${name}" ni o'chirmoqchimisiz?`)) return;
        try {
            await api.products.delete(id);
            load();
        } catch (e: any) {
            alert(e.message);
        }
    };

    const addColor = () => {
        if (colorInput && !form.colors.includes(colorInput)) {
            setForm({ ...form, colors: [...form.colors, colorInput] });
        }
    };

    const removeColor = (c: string) => {
        setForm({ ...form, colors: form.colors.filter(x => x !== c) });
    };

    const updateSpec = (key: string, val: string) => {
        setForm({ ...form, specs: { ...form.specs, [key]: val } });
    };

    return (
        <div className="admin-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Mahsulotlar</h1>
                    <p className="page-subtitle">{products.length} ta mahsulot</p>
                </div>
                <div className="header-actions">
                    <button className="btn-primary" onClick={openCreate}>
                        <Plus size={16} /> Mahsulot qo'shish
                    </button>
                </div>
            </div>

            <div className="table-controls">
                <div className="navbar-search">
                    <Search size={16} />
                    <input placeholder="Qidirish..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            {loading ? <p>Yuklanmoqda...</p> : (
                <div className="admin-card">
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Mahsulot</th>
                                    <th>Kategoriya</th>
                                    <th>Narx</th>
                                    <th>Holat</th>
                                    <th>Reyting</th>
                                    <th>Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id}>
                                        <td>
                                            <div className="product-table-item">
                                                <img src={p.image} alt={p.name} />
                                                <div className="item-info">
                                                    <span className="item-name">{p.name}</span>
                                                    <span className="item-brand">{p.brand}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="category-tag">{p.category}</span></td>
                                        <td className="font-bold">{formatPrice(p.price)}</td>
                                        <td>
                                            <span className={`status-badge ${p.inStock ? 'active' : 'cancelled'}`}>
                                                {p.inStock ? 'Mavjud' : 'Tugagan'}
                                            </span>
                                        </td>
                                        <td><span className="rating-pill">⭐ {p.rating}</span></td>
                                        <td>
                                            <div className="table-actions">
                                                <button className="action-btn edit" title="Tahrirlash" onClick={() => openEdit(p)}><Edit size={14} /></button>
                                                <button className="action-btn delete" title="O'chirish" onClick={() => handleDelete(p.id, p.name)}><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>Mahsulotlar topilmadi</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ===== MODAL ===== */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingId ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label>Nomi *</label>
                                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Haipeng Raider 250" />
                                </div>
                                <div className="form-group">
                                    <label>ID (slug) *</label>
                                    <input value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} placeholder="hp-001" disabled={!!editingId} />
                                </div>
                                <div className="form-group">
                                    <label>Brend</label>
                                    <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="Haipeng" />
                                </div>
                                <div className="form-group">
                                    <label>Kategoriya *</label>
                                    <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
                                        <option value="">Tanlang...</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.nameUz} ({c.name})</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Narx (so'm) *</label>
                                    <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
                                </div>
                                <div className="form-group">
                                    <label>Eski narx (ixtiyoriy)</label>
                                    <input type="number" value={form.old_price || ''} onChange={e => setForm({ ...form, old_price: e.target.value ? Number(e.target.value) : null })} />
                                </div>
                                <div className="form-group">
                                    <label>Badge</label>
                                    <select value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })}>
                                        <option value="">Yo'q</option>
                                        <option value="New">New</option>
                                        <option value="Popular">Popular</option>
                                        <option value="Sale">Sale</option>
                                        <option value="Electric">Electric</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Holat</label>
                                    <select value={form.in_stock ? 'true' : 'false'} onChange={e => setForm({ ...form, in_stock: e.target.value === 'true' })}>
                                        <option value="true">Mavjud</option>
                                        <option value="false">Tugagan</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Reyting</label>
                                    <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} />
                                </div>
                                <div className="form-group">
                                    <label>Sharhlar soni</label>
                                    <input type="number" value={form.review_count} onChange={e => setForm({ ...form, review_count: Number(e.target.value) })} />
                                </div>
                            </div>

                            {/* Main Image Upload */}
                            <div className="form-group">
                                <label><Upload size={14} /> Asosiy rasm *</label>
                                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleMainImageUpload} style={{ display: 'none' }} />
                                <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                                    {uploading ? (
                                        <div className="upload-loading"><Loader size={24} className="spin" /> Yuklanmoqda...</div>
                                    ) : form.image ? (
                                        <div className="upload-preview">
                                            <img src={form.image} alt="Asosiy rasm" />
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

                            {/* Extra Images Upload */}
                            <div className="form-group">
                                <label><Upload size={14} /> Qo'shimcha rasmlar</label>
                                <input type="file" ref={extraFilesRef} accept="image/*" multiple onChange={handleExtraImagesUpload} style={{ display: 'none' }} />
                                <div className="upload-gallery">
                                    {form.images.filter(i => i !== form.image).map((url, i) => (
                                        <div key={i} className="upload-gallery-item">
                                            <img src={url} alt="" />
                                            <button className="upload-gallery-remove" onClick={() => removeExtraImage(url)}><X size={12} /></button>
                                        </div>
                                    ))}
                                    <button className="upload-gallery-add" onClick={() => extraFilesRef.current?.click()} disabled={uploadingExtra}>
                                        {uploadingExtra ? <Loader size={20} className="spin" /> : <Plus size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Tavsif</label>
                                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Mahsulot haqida..." />
                            </div>

                            {/* Colors */}
                            <div className="form-group">
                                <label>Ranglar</label>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                    {form.colors.map(c => (
                                        <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.5rem', background: 'var(--bg3)', borderRadius: 8, fontSize: '0.82rem' }}>
                                            <span style={{ width: 16, height: 16, borderRadius: 4, background: c, border: '1px solid var(--border)' }} />
                                            {c}
                                            <button onClick={() => removeColor(c)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 0 }}><X size={12} /></button>
                                        </span>
                                    ))}
                                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                                        <input type="color" value={colorInput} onChange={e => setColorInput(e.target.value)} style={{ width: 32, height: 32, padding: 0, border: 'none', cursor: 'pointer' }} />
                                        <button onClick={addColor} className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>+</button>
                                    </div>
                                </div>
                            </div>

                            {/* Specs */}
                            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', margin: '1.5rem 0 1rem', color: 'var(--text)' }}>Texnik xususiyatlar</h3>
                            <div className="form-grid-2">
                                {[
                                    ['engine', 'Dvigatel', '250cc, 4-taktli'],
                                    ['power', 'Quvvat', '21 l.s.'],
                                    ['maxSpeed', 'Max tezlik', '140 km/h'],
                                    ['fuelCapacity', 'Yoqilg\'i', '15 L'],
                                    ['weight', 'Vazn', '158 kg'],
                                    ['seatHeight', 'O\'rindiq', '790 mm'],
                                    ['range', 'Masofa (elektr)', '120 km'],
                                    ['brakes', 'Tormozlar', 'Disk (old/orqa)'],
                                ].map(([key, label, ph]) => (
                                    <div className="form-group" key={key}>
                                        <label>{label}</label>
                                        <input value={(form.specs as any)[key] || ''} onChange={e => updateSpec(key, e.target.value)} placeholder={ph} />
                                    </div>
                                ))}
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
