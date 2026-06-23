

interface Tab {
    id: string;
    label: string;
    count?: number;
}

interface CrmTabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (tabId: string) => void;
}

export default function CrmTabs({ tabs, activeTab, onChange }: CrmTabsProps) {
    return (
        <div className="crm-tabs">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`crm-tab ${activeTab === tab.id ? 'crm-tab--active' : ''}`}
                    onClick={() => onChange(tab.id)}
                >
                    {tab.label}
                    {tab.count !== undefined && (
                        <span className="crm-tab-count">{tab.count}</span>
                    )}
                </button>
            ))}
        </div>
    );
}
