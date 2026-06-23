interface CrmBadgeProps {
    status: string;
    text?: string;
    size?: 'sm' | 'md';
}

const statusMap: Record<string, { label: string; className: string }> = {
    pending: { label: 'Kutilmoqda', className: 'crm-badge--pending' },
    assembling: { label: 'Jarayonda', className: 'crm-badge--assembling' },
    ready: { label: 'Tayyor', className: 'crm-badge--ready' },
    sold: { label: 'Sotilgan', className: 'crm-badge--sold' },
    paid: { label: "To'langan", className: 'crm-badge--paid' },
    partial: { label: 'Qisman', className: 'crm-badge--partial' },
    unpaid: { label: 'Qarz', className: 'crm-badge--unpaid' },
    active: { label: 'Faol', className: 'crm-badge--active' },
    inactive: { label: 'Nofaol', className: 'crm-badge--inactive' },
    incoming: { label: 'Kirim', className: 'crm-badge--incoming' },
    outgoing: { label: 'Chiqim', className: 'crm-badge--outgoing' },
    income: { label: 'Kirim', className: 'crm-badge--incoming' },
    expense: { label: 'Chiqim', className: 'crm-badge--outgoing' },
    per_moto: { label: 'Har moto', className: 'crm-badge--assembling' },
    per_task: { label: 'Har ish', className: 'crm-badge--pending' },
    fixed: { label: 'Oylik', className: 'crm-badge--ready' },
    salary: { label: 'Ish haqi', className: 'crm-badge--partial' },
    parts: { label: 'Detallar', className: 'crm-badge--assembling' },
    sale: { label: 'Sotuv', className: 'crm-badge--ready' },
    other: { label: 'Boshqa', className: 'crm-badge--pending' },
};

export default function CrmBadge({ status, text, size = 'md' }: CrmBadgeProps) {
    const config = statusMap[status] || { label: status, className: 'crm-badge--pending' };
    return (
        <span className={`crm-badge ${config.className} ${size === 'sm' ? 'crm-badge--sm' : ''}`}>
            {text || config.label}
        </span>
    );
}
