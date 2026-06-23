import { type ReactNode } from 'react';

interface CrmStatCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    change?: string;
    changeType?: 'up' | 'down' | 'neutral';
    color?: string;
    bgColor?: string;
}

export default function CrmStatCard({ icon, label, value, change, changeType = 'up', color = 'var(--accent)', bgColor }: CrmStatCardProps) {
    return (
        <div className="crm-stat-card">
            <div className="crm-stat-header">
                <div className="crm-stat-icon" style={{ background: bgColor || `${color}15`, color }}>
                    {icon}
                </div>
                {change && (
                    <div className={`crm-stat-change ${changeType}`}>
                        {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : '•'} {change}
                    </div>
                )}
            </div>
            <div className="crm-stat-body">
                <span className="crm-stat-label">{label}</span>
                <h3 className="crm-stat-value">{value}</h3>
            </div>
        </div>
    );
}
