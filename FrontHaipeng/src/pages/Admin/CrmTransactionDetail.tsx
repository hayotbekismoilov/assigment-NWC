import { useParams, useNavigate } from 'react-router-dom';
import { useCrmStore } from '../../store/crmStore';
import CrmPageHeader from '../../components/Admin/CrmPageHeader';
import CrmBadge from '../../components/Admin/CrmBadge';
import type { PaymentMethod, TransactionCategory } from '../../types/crm';
import {
    ArrowLeft, FileText, Calendar, User, Truck, ShoppingBag,
    Banknote, CreditCard, ArrowRightLeft, CheckCircle, Clock,
    AlertTriangle, ChevronRight, Eye
} from 'lucide-react';

function formatPrice(n: number) {
    return new Intl.NumberFormat('uz-UZ').format(n);
}

const methodIcons: Record<PaymentMethod, any> = { cash: Banknote, card: CreditCard, transfer: ArrowRightLeft };
const methodLabels: Record<PaymentMethod, string> = { cash: 'Naqd pul', card: 'Plastik karta', transfer: "Bank o'tkazmasi" };
const catLabels: Record<TransactionCategory, string> = { salary: 'Ish haqi', parts: 'Detallar', sale: 'Sotuv', other: 'Boshqa' };
const catColors: Record<TransactionCategory, string> = { salary: '#FF9800', parts: '#9C27B0', sale: '#00C853', other: '#607D8B' };

export default function CrmTransactionDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const transactions = useCrmStore(s => s.transactions);
    const workers = useCrmStore(s => s.workers);
    const suppliers = useCrmStore(s => s.suppliers);
    const motos = useCrmStore(s => s.motos);
    const orders = useCrmStore(s => s.orders);
    const customers = useCrmStore(s => s.customers);

    const tx = transactions.find(t => t.id === id);

    if (!tx) {
        return (
            <div className="admin-content">
                <div className="crm-empty-state">
                    <div className="crm-empty-icon"><FileText size={48} /></div>
                    <h3 className="crm-empty-title">Tranzaksiya topilmadi</h3>
                    <button className="btn-primary" onClick={() => navigate('/panel/crm/finance')}>
                        <ArrowLeft size={18} /> Orqaga
                    </button>
                </div>
            </div>
        );
    }

    const MethodIcon = methodIcons[tx.method];
    const linkedWorker = tx.relatedWorkerId ? workers.find(w => w.id === tx.relatedWorkerId) : null;
    const linkedSupplier = tx.relatedSupplierId ? suppliers.find(s => s.id === tx.relatedSupplierId) : null;
    const linkedMoto = tx.relatedMotoId ? motos.find(m => m.id === tx.relatedMotoId) : null;
    const linkedOrder = tx.relatedOrderId ? orders.find(o => o.id === tx.relatedOrderId) : null;
    const linkedCustomer = linkedOrder ? customers.find(c => c.id === linkedOrder.customerId) : null;

    return (
        <div className="admin-content">
            <CrmPageHeader
                title="Tranzaksiya tafsilotlari"
                subtitle={`#${tx.id} — ${tx.date}`}
                actions={
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-secondary" onClick={() => navigate('/panel/crm/finance')}>
                            <ArrowLeft size={18} /> Orqaga
                        </button>
                    </div>
                }
            />

            {/* Top amount card */}
            <div className="admin-card txd-hero" style={{ marginBottom: '1.5rem' }}>
                <div className="txd-hero-amount" style={{ color: tx.type === 'income' ? '#00C853' : '#F44336' }}>
                    {tx.type === 'income' ? '+' : '-'}{formatPrice(tx.amount)} so'm
                </div>
                <div className="txd-hero-desc">{tx.description}</div>
                <div className="txd-hero-badges">
                    <CrmBadge status={tx.type} size="sm" />
                    <CrmBadge status={tx.category} size="sm" />
                    {tx.status === 'completed' ? (
                        <span className="finance-status finance-status--done"><CheckCircle size={13} /> Yakunlangan</span>
                    ) : (
                        <span className="finance-status finance-status--pending"><Clock size={13} /> Kutilayotgan</span>
                    )}
                </div>
            </div>

            <div className="txd-grid">
                {/* Left: Details */}
                <div className="admin-card details-card">
                    <div className="card-header"><h3 className="card-title">📋 Asosiy ma'lumotlar</h3></div>
                    <div className="txd-details">
                        <div className="txd-row">
                            <span className="txd-label"><Calendar size={15} /> Sana</span>
                            <span className="txd-value font-mono">{tx.date}</span>
                        </div>
                        <div className="txd-row">
                            <span className="txd-label"><FileText size={15} /> Kategoriya</span>
                            <span className="txd-value">
                                <span style={{ color: catColors[tx.category], fontWeight: 600 }}>{catLabels[tx.category]}</span>
                            </span>
                        </div>
                        <div className="txd-row">
                            <span className="txd-label"><MethodIcon size={15} /> To'lov usuli</span>
                            <span className="txd-value">{methodLabels[tx.method]}</span>
                        </div>
                        <div className="txd-row">
                            <span className="txd-label"><User size={15} /> Kim kiritdi</span>
                            <span className="txd-value">{tx.createdBy}</span>
                        </div>
                        {tx.note && (
                            <div className="txd-note-section">
                                <label>📝 Izoh</label>
                                <p>{tx.note}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Linked entities */}
                <div className="admin-card links-card">
                    <div className="card-header"><h3 className="card-title">🔗 Bog'langan ma'lumotlar</h3></div>
                    <div className="txd-links-container">
                        {linkedWorker && (
                            <div className="txd-linked-card" onClick={() => navigate(`/panel/crm/workers/${linkedWorker.id}`)}>
                                <div className="txd-linked-icon worker"><User size={20} /></div>
                                <div className="txd-linked-info">
                                    <div className="txd-tag">Ishchi</div>
                                    <div className="txd-name">{linkedWorker.name}</div>
                                    <div className="txd-sub">{linkedWorker.position}</div>
                                </div>
                                <ChevronRight size={18} className="txd-arrow" />
                            </div>
                        )}
                        {linkedSupplier && (
                            <div className="txd-linked-card">
                                <div className="txd-linked-icon supplier"><Truck size={20} /></div>
                                <div className="txd-linked-info">
                                    <div className="txd-tag">Yetkazuvchi</div>
                                    <div className="txd-name">{linkedSupplier.name}</div>
                                    <div className="txd-sub">{linkedSupplier.phone}</div>
                                </div>
                            </div>
                        )}
                        {linkedMoto && (
                            <div className="txd-linked-card" onClick={() => navigate(`/panel/crm/production`)}>
                                <div className="txd-linked-icon moto"><ShoppingBag size={20} /></div>
                                <div className="txd-linked-info">
                                    <div className="txd-tag">Mahsulot (Moto)</div>
                                    <div className="txd-name">{linkedMoto.model}</div>
                                    <div className="txd-sub">#{linkedMoto.serialNumber}</div>
                                </div>
                                <ChevronRight size={18} className="txd-arrow" />
                            </div>
                        )}
                        {linkedCustomer && (
                            <div className="txd-linked-card">
                                <div className="txd-linked-icon customer"><User size={20} /></div>
                                <div className="txd-linked-info">
                                    <div className="txd-tag">Mijoz</div>
                                    <div className="txd-name">{linkedCustomer.name}</div>
                                    <div className="txd-sub">{linkedCustomer.phone}</div>
                                </div>
                            </div>
                        )}
                        {!linkedWorker && !linkedSupplier && !linkedMoto && !linkedCustomer && (
                            <div className="txd-no-links">
                                <AlertTriangle size={32} />
                                <p>Ushbu tranzaksiya hech qanday subyektga bog'lanmagan</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Receipt */}
            {tx.receipt && (
                <div className="admin-card receipt-card" style={{ marginTop: '24px' }}>
                    <div className="card-header"><h3 className="card-title">🧾 Chek / Kvitansiya</h3></div>
                    <div className="txd-receipt-viewer">
                        <img src={tx.receipt} alt="Chek" />
                        <div className="receipt-overlay">
                            <button className="btn-primary" onClick={() => window.open(tx.receipt, '_blank')}>
                                <Eye size={18} /> To'liq ko'rish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .txd-hero {
                    padding: 40px;
                    text-align: center;
                    background: linear-gradient(135deg, var(--card) 0%, #fafafa 100%);
                }
                .txd-hero-amount {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin-bottom: 8px;
                    font-family: 'Outfit', sans-serif;
                }
                .txd-hero-desc {
                    font-size: 1.2rem;
                    color: var(--text2);
                    margin-bottom: 20px;
                    font-weight: 500;
                }
                .txd-hero-badges {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                }
                .txd-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                }
                .txd-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 12px 0;
                    border-bottom: 1px solid #f0f0f0;
                }
                .txd-row:last-child { border-bottom: none; }
                .txd-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #999;
                    font-weight: 500;
                }
                .txd-value { font-weight: 600; }
                .txd-note-section {
                    margin-top: 20px;
                    padding: 16px;
                    background: #f9f9f9;
                    border-radius: 12px;
                }
                .txd-note-section label {
                    display: block;
                    font-size: 0.8rem;
                    color: #999;
                    margin-bottom: 8px;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                .txd-note-section p { margin: 0; line-height: 1.6; }
                
                .txd-links-container {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    padding: 8px 0;
                }
                .txd-linked-card {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 16px;
                    background: #fff;
                    border: 1px solid #eee;
                    border-radius: 16px;
                    transition: all 0.2s;
                }
                .txd-linked-card[onClick]:hover {
                    border-color: var(--accent);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    cursor: pointer;
                }
                .txd-linked-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .txd-linked-icon.worker { background: #fff4e5; color: #ff9800; }
                .txd-linked-icon.supplier { background: #f3e5f5; color: #9c27b0; }
                .txd-linked-icon.moto { background: #e3f2fd; color: #2196f3; }
                .txd-linked-icon.customer { background: #e8f5e9; color: #4caf50; }
                
                .txd-linked-info { flex: 1; }
                .txd-tag { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: #999; margin-bottom: 2px; }
                .txd-name { font-weight: 700; font-size: 1.05rem; }
                .txd-sub { font-size: 0.85rem; color: #999; }
                .txd-arrow { color: #ddd; }
                
                .txd-no-links { text-align: center; padding: 40px; color: #ccc; }
                .txd-no-links p { margin-top: 12px; font-size: 0.9rem; }
                
                .txd-receipt-viewer {
                    position: relative;
                    border-radius: 16px;
                    overflow: hidden;
                    max-width: 400px;
                    margin: 0 auto;
                }
                .txd-receipt-viewer img { width: 100%; display: block; }
                .receipt-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .txd-receipt-viewer:hover .receipt-overlay { opacity: 1; }
            `}</style>
        </div>
    );
}
