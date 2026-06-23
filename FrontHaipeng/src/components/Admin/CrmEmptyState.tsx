import { type ReactNode } from 'react';

interface CrmEmptyStateProps {
    icon: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
}

export default function CrmEmptyState({ icon, title, description, action }: CrmEmptyStateProps) {
    return (
        <div className="crm-empty-state">
            <div className="crm-empty-icon">{icon}</div>
            <h3 className="crm-empty-title">{title}</h3>
            {description && <p className="crm-empty-desc">{description}</p>}
            {action && <div className="crm-empty-action">{action}</div>}
        </div>
    );
}
