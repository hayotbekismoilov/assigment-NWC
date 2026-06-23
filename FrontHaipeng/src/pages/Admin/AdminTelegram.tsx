import { useState, useEffect } from 'react';
import { Save, Send, Bot, Hash, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../../api';

export default function AdminTelegram() {
    const [botToken, setBotToken] = useState('');
    const [channelId, setChannelId] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        api.settings.getTelegram()
            .then(data => {
                setBotToken(data.bot_token);
                setChannelId(data.channel_id);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            await api.settings.saveTelegram({ bot_token: botToken, channel_id: channelId });
            setMessage({ type: 'success', text: 'Sozlamalar saqlandi ✅' });
        } catch (e: any) {
            setMessage({ type: 'error', text: e.message });
        } finally {
            setSaving(false);
        }
    };

    const handleTest = async () => {
        setTesting(true);
        setMessage(null);
        try {
            await api.settings.testTelegram();
            setMessage({ type: 'success', text: 'Test xabar yuborildi! Telegramni tekshiring ✅' });
        } catch (e: any) {
            setMessage({ type: 'error', text: e.message });
        } finally {
            setTesting(false);
        }
    };

    if (loading) return <div className="admin-content"><p>Yuklanmoqda...</p></div>;

    return (
        <div className="admin-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Telegram Bot</h1>
                    <p className="page-subtitle">Buyurtmalarni Telegram kanalga yuborish sozlamalari</p>
                </div>
            </div>

            <div className="admin-card" style={{ maxWidth: 600 }}>
                <div style={{ padding: '1.5rem' }}>
                    <div className="telegram-guide">
                        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text)' }}>
                            📋 Qanday sozlash kerak?
                        </h3>
                        <ol style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
                            <li>Telegramda <b>@BotFather</b> ga /newbot buyrug'ini yuboring</li>
                            <li>Bot nomini va username ni kiriting</li>
                            <li>BotFather sizga <b>Bot Token</b> beradi — uni pastga yozing</li>
                            <li>Kanal yarating yoki mavjud kanalni tanlang</li>
                            <li>Botni kanalga <b>admin</b> sifatida qo'shing</li>
                            <li>Kanal ID ni kiriting (masalan: <code>@kanal_nomi</code> yoki <code>-1001234567890</code>)</li>
                        </ol>
                    </div>

                    <div style={{ marginTop: '1.5rem' }}>
                        <div className="form-group">
                            <label><Bot size={14} /> Bot Token *</label>
                            <input
                                value={botToken}
                                onChange={e => setBotToken(e.target.value)}
                                placeholder="123456789:ABCdefGhIjKlMnOpQrStUvWxYz"
                                style={{ fontFamily: 'monospace' }}
                            />
                        </div>

                        <div className="form-group">
                            <label><Hash size={14} /> Kanal ID *</label>
                            <input
                                value={channelId}
                                onChange={e => setChannelId(e.target.value)}
                                placeholder="@kanal_nomi yoki -1001234567890"
                            />
                        </div>
                    </div>

                    {message && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.75rem 1rem', borderRadius: 10, marginBottom: '1rem',
                            background: message.type === 'success' ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                            color: message.type === 'success' ? '#00C853' : '#FF4444',
                            fontSize: '0.88rem', fontWeight: 500,
                        }}>
                            {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                            {message.text}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button className="btn-primary" onClick={handleSave} disabled={saving}>
                            <Save size={16} /> {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                        </button>
                        <button className="btn-secondary" onClick={handleTest} disabled={testing || !botToken || !channelId}>
                            <Send size={16} /> {testing ? 'Yuborilmoqda...' : 'Test xabar yuborish'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
