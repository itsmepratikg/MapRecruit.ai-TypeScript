
import React, { useState } from 'react';
import { CustomFieldCollectionTab } from '../../CustomFields/CustomFieldCollectionTab';
import { Briefcase, User, ClipboardList, Settings } from '../../../../components/Icons';
import { useTranslation } from 'react-i18next';

interface ClientCustomFieldsProps {
    clientId: string;
    isActive?: boolean;
}

export const ClientCustomFields = ({ clientId, isActive = true }: ClientCustomFieldsProps) => {
    const { t } = useTranslation();
    const [activeTabId, setActiveTabId] = useState('campaign');

    const tabs = [
        { id: 'campaign', label: t('Campaigns'), icon: Briefcase, collection: 'campaigns' },
        { id: 'profile', label: t('Profile'), icon: User, collection: 'resumes' },
        { id: 'interviews', label: t('Interviews'), icon: ClipboardList, collection: 'interviews' }
    ];

    const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

    return (
        <div className="h-full flex flex-col overflow-hidden animate-in fade-in duration-500">
            {/* Header Content */}
            <div className="px-8 lg:px-12 pt-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-20">
                <div className="max-w-7xl mx-auto">
                    {!isActive && (
                        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-3 text-amber-800 dark:text-amber-200">
                            <div className="p-2 bg-amber-100 dark:bg-amber-800/40 rounded-lg">
                                <Settings size={18} className="text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">{t("Client is Deactivated")}</p>
                                <p className="text-xs opacity-80">{t("Custom field management is disabled. Activate the client from settings to enable configurations.")}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 mb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                                <Settings size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">{t("Custom Fields")}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    {t("Client-specific configurations")}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTabId === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTabId(tab.id)}
                                    className={`flex items-center gap-2.5 px-6 py-4 text-sm font-bold transition-all relative whitespace-nowrap
                                        ${isActive
                                            ? 'text-emerald-600 dark:text-emerald-400'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                >
                                    <Icon size={18} className={isActive ? 'animate-bounce' : ''} />
                                    {tab.label}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-full shadow-[0_-4px_12px_rgba(16,185,129,0.3)]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12 bg-slate-50/30 dark:bg-slate-900/10">
                <div className="max-w-7xl mx-auto">
                    <CustomFieldCollectionTab
                        key={`${activeTab.id}-${clientId}`}
                        collection={activeTab.collection as any}
                        clientId={clientId}
                        isActive={isActive}
                    />
                </div>
            </div>
        </div>
    );
};
