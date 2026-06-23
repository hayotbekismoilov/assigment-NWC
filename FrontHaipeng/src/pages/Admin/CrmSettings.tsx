import { useState } from 'react';
import CrmPageHeader from '../../components/Admin/CrmPageHeader';
import CrmTabs from '../../components/Admin/CrmTabs';
import { Shield, Globe, Palette, Save } from 'lucide-react';

export default function CrmSettings() {
    const [activeTab, setActiveTab] = useState('roles');
    const [currency, setCurrency] = useState("so'm");
    const [language, setLanguage] = useState("uz");
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const tabs = [
        { id: 'roles', label: 'Rollar' },
        { id: 'system', label: 'Tizim' },
        { id: 'notifications', label: 'Bildirishnomalar' },
    ];

    const roles = [
        { name: 'Admin', desc: "Barcha bo'limlarga to'liq ruxsat", color: '#FF4C00', permissions: ['Dashboard', 'Ishlab chiqarish', 'Motolar', 'Ishchilar', 'Sklad', 'Moliya', 'Sotuv', 'Analitika', 'Sozlamalar'] },
        { name: 'Menejer', desc: "Sotuv va ishchilarni boshqarish", color: '#2196F3', permissions: ['Dashboard', 'Motolar', 'Ishchilar', 'Sotuv', 'Analitika'] },
        { name: 'Operator', desc: "Faqat belgilangan bo'limlar", color: '#00C853', permissions: ['Dashboard', 'Ishlab chiqarish', 'Sklad'] },
        { name: 'Hisobchi', desc: "Moliya va ish haqi", color: '#9C27B0', permissions: ['Dashboard', 'Moliya', 'Ishchilar'] },
    ];

    return (
        <div className="admin-content">
            <CrmPageHeader title="Sozlamalar" subtitle="Tizim konfiguratsiyasi va rollar" />

            <CrmTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === 'roles' && (
                <div className="crm-settings-grid">
                    {roles.map(role => (
                        <div key={role.name} className="admin-card crm-role-card">
                            <div className="crm-role-header">
                                <div className="crm-role-icon" style={{ background: `${role.color}15`, color: role.color }}>
                                    <Shield size={22} />
                                </div>
                                <div>
                                    <h3 className="crm-role-name">{role.name}</h3>
                                    <p className="crm-role-desc">{role.desc}</p>
                                </div>
                            </div>
                            <div className="crm-role-permissions">
                                <small style={{ color: 'var(--text3)', marginBottom: '0.5rem', display: 'block' }}>Ruxsatlar:</small>
                                <div className="crm-permission-tags">
                                    {role.permissions.map(p => (
                                        <span key={p} className="crm-permission-tag">{p}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'system' && (
                <div className="admin-card" style={{ maxWidth: 600 }}>
                    <div style={{ padding: '0.5rem 0' }}>
                        <div className="form-group">
                            <label><Globe size={16} /> Valyuta</label>
                            <select value={currency} onChange={e => setCurrency(e.target.value)}>
                                <option value="so'm">UZS (so'm)</option>
                                <option value="$">USD ($)</option>
                                <option value="€">EUR (€)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label><Globe size={16} /> Til</label>
                            <select value={language} onChange={e => setLanguage(e.target.value)}>
                                <option value="uz">O'zbek (Latin)</option>
                                <option value="ru">Русский</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label><Palette size={16} /> Mavzu</label>
                            <select defaultValue="dark">
                                <option value="dark">Qorong'u (Dark)</option>
                                <option value="light">Yorug' (Light)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Kompaniya nomi</label>
                            <input defaultValue="Haipeng Motors" />
                        </div>
                        <div className="form-group">
                            <label>Kompaniya telefoni</label>
                            <input defaultValue="+998 90 123 45 67" />
                        </div>
                        <button className="btn-primary" onClick={handleSave} style={{ marginTop: '1rem' }}>
                            <Save size={18} /> Saqlash
                            {saved && <span style={{ marginLeft: '0.5rem' }}>✓ Saqlandi!</span>}
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'notifications' && (
                <div className="admin-card" style={{ maxWidth: 600 }}>
                    <div style={{ padding: '0.5rem 0' }}>
                        <div className="crm-setting-row">
                            <div>
                                <strong>Kam qolgan detallar</strong>
                                <p style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>Detal minimal stockdan kam bo'lganda ogohlantirish</p>
                            </div>
                            <label className="crm-toggle">
                                <input type="checkbox" defaultChecked />
                                <span className="crm-toggle-slider" />
                            </label>
                        </div>
                        <div className="crm-setting-row">
                            <div>
                                <strong>To'lanmagan ish haqi</strong>
                                <p style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>To'lanmagan ish haqi bo'lganda ogohlantirish</p>
                            </div>
                            <label className="crm-toggle">
                                <input type="checkbox" defaultChecked />
                                <span className="crm-toggle-slider" />
                            </label>
                        </div>
                        <div className="crm-setting-row">
                            <div>
                                <strong>Yangi buyurtma</strong>
                                <p style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>Yangi buyurtma kelganda bildirishnoma</p>
                            </div>
                            <label className="crm-toggle">
                                <input type="checkbox" defaultChecked />
                                <span className="crm-toggle-slider" />
                            </label>
                        </div>
                        <div className="crm-setting-row">
                            <div>
                                <strong>Moto tayyor</strong>
                                <p style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>Moto yig'ish tugaganda bildirishnoma</p>
                            </div>
                            <label className="crm-toggle">
                                <input type="checkbox" defaultChecked />
                                <span className="crm-toggle-slider" />
                            </label>
                        </div>
                        <div className="crm-setting-row">
                            <div>
                                <strong>Telegram bot</strong>
                                <p style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>Muhim hodisalarni Telegram kanalga yuborish</p>
                            </div>
                            <label className="crm-toggle">
                                <input type="checkbox" />
                                <span className="crm-toggle-slider" />
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
