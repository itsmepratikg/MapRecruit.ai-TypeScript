import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CustomFieldCollectionTab } from './CustomFieldCollectionTab';
import { Briefcase, User, ClipboardList } from '../../../components/Icons';

export const CustomFieldsPage: React.FC = () => {
    const { type } = useParams<{ type: string }>();
    const navigate = useNavigate();

    const tabs = [
        { id: 'campaign', label: 'Campaigns', icon: Briefcase, collection: 'campaigns' },
        { id: 'profile', label: 'Profile', icon: User, collection: 'resumes' },
        { id: 'interviews', label: 'Interviews', icon: ClipboardList, collection: 'interviews' }
    ];

    const activeTab = tabs.find(t => t.id.toLowerCase() === type?.toLowerCase()) || tabs[0];

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Tab Navigation */}
            <div className="px-8 lg:px-12 pt-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 whitespace-nowrap">Custom Fields Management</h3>
                        <p className="text-slate-500 dark:text-slate-400 whitespace-nowrap">Configure custom sections and fields for different entity types.</p>
                    </div>

                    <div className="flex gap-1">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab.id === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => navigate(`/settings/customfield/${tab.id}`)}
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
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CustomFieldCollectionTab
                        key={activeTab.id}
                        collection={activeTab.collection as any}
                    />
                </div>
            </div>
        </div>
    );
};
