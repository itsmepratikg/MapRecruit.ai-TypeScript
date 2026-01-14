import React from 'react';
import { ChevronLeft } from '../Icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavItem } from './NavItem';
import { SETTINGS_CATEGORIES } from './constants';
import { useScreenSize } from '../../hooks/useScreenSize';

interface SettingsMenuProps {
    onBack: () => void;
    activeSettingsTab: string; // Keeping for interface compatibility but will ignore
    setActiveSettingsTab: (v: string) => void;
    isCollapsed: boolean;
    setIsSidebarOpen: (v: boolean) => void;
}

export const SettingsMenu = ({
    onBack,
    setActiveSettingsTab,
    isCollapsed,
    setIsSidebarOpen
}: SettingsMenuProps) => {
    const { isDesktop } = useScreenSize();
    const navigate = useNavigate();
    const location = useLocation();

    // Helper to map IDs to PascalCase paths
    const getPath = (id: string) => {
        const map: Record<string, string> = {
            'COMPANY_INFO': 'CompanyInfo',
            'ROLES': 'Roles',
            'USERS': 'Users',
            'REACHOUT_LAYOUTS': 'ReachOutLayouts',
        };
        if (map[id]) return map[id];
        return id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    }

    // Derive active tab from URL: /settings/CompanyInfo -> CompanyInfo
    const currentPath = location.pathname.split('/settings/')[1] || 'CompanyInfo';

    return (
        <div className="animate-in slide-in-from-left duration-300 ease-out">
            <button
                onClick={onBack}
                className={`w-full flex items-center gap-2 px-3 py-2 mb-4 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                title="Back to Dashboard"
            >
                <ChevronLeft size={14} /> <span className={isCollapsed ? 'hidden' : 'inline'}>Back to Dashboard</span>
            </button>

            <div className={`px-3 mb-6 ${isCollapsed ? 'hidden' : 'block'}`}>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">System Settings</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure your workspace</p>
            </div>

            <div className="space-y-1 overflow-y-visible">
                {SETTINGS_CATEGORIES.map((cat, idx) => (
                    <div key={cat.id} className={`${idx !== 0 ? 'mt-4 border-t border-slate-100 dark:border-slate-800 pt-4' : ''} animate-in fade-in slide-in-from-left-2 duration-300`} style={{ animationDelay: `${idx * 100}ms` }}>
                        {!isCollapsed && (
                            <h4 className="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                                {cat.label}
                            </h4>
                        )}
                        {cat.items.map(item => {
                            const path = getPath(item.id);
                            return (
                                <NavItem
                                    key={item.id}
                                    icon={item.icon}
                                    label={item.label}
                                    to={`/settings/${path}`}
                                    onClick={() => {
                                        setActiveSettingsTab(path);
                                        if (!isDesktop) setIsSidebarOpen(false);
                                    }}
                                    isCollapsed={isCollapsed}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};
