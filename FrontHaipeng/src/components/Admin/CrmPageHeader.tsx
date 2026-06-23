import { type ReactNode } from 'react';

interface CrmPageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
}

export default function CrmPageHeader({ title, subtitle, actions }: CrmPageHeaderProps) {
    return (
        <div className="page-header">
            <div>
                <h1 className="page-title">{title}</h1>
                {subtitle && <p className="page-subtitle">{subtitle}</p>}
            </div>
            {actions && <div className="header-actions">{actions}</div>}
        </div>
    );
}
