
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ChevronLeft, Briefcase, Users, FileText, CheckCircle, Settings,
    X, ChevronRight, Menu
} from '../Icons';

interface ClientProfileMenuProps {
    onBack: () => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    clientId?: string;
    onNavigate: (tab: string) => void;
    isCollapsed?: boolean;
    setIsSidebarOpen?: (isOpen: boolean) => void;
}

export const ClientProfileMenu = ({
    onBack,
    activeTab,
    setActiveTab,
    clientId,
    onNavigate,
    isCollapsed = false,
    setIsSidebarOpen
}: ClientProfileMenuProps) => {
    const { t } = useTranslation();

    const menuItems = [
        { id: 'clientinformation', label: 'Client Information', icon: Briefcase },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'customfields', label: 'Custom Fields', icon: FileText },
        { id: 'screeningrounds', label: 'Screening Rounds', icon: CheckCircle },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const handleItemClick = (id: string) => {
        setActiveTab(id);
        onNavigate(id);
        if (setIsSidebarOpen) setIsSidebarOpen(false); // Close sidebar on mobile
    }

    if (isCollapsed) {
        return (
            <div className="flex flex-col items-center py-4 space-y-4">
                <button onClick={onBack} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" title={t("Back")}>
                    <ChevronLeft size={20} />
                </button>
                <div className="w-8 h-1 bg-slate-200 dark:bg-slate-700 rounded-full my-2"></div>
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`p-2 rounded-lg transition-colors ${activeTab === item.id ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        title={t(item.label)}
                    >
                        <item.icon size={20} />
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900">
            {/* Header */}
            <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 shrink-0">
                <button
                    onClick={onBack}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-500 dark:text-slate-400 transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="overflow-hidden">
                    <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{t("Edit Client")}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">ID: {clientId ? clientId.slice(0, 8) + '...' : 'New'}</p>
                </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto custom-scrollbar py-2 space-y-0.5 px-2">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === item.id
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}`}
                    >
                        <item.icon size={18} className={activeTab === item.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'} />
                        <span>{t(item.label)}</span>
                        {activeTab === item.id && <ChevronRight size={14} className="ml-auto opacity-50" />}
                    </button>
                ))}
            </div>
        </div>
    );
};
