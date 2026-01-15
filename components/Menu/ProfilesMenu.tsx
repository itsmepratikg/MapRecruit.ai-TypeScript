import React from 'react';
import { ChevronLeft } from '../Icons';
import { NavItem } from './NavItem';
import { PROFILES_CATEGORIES } from './constants';
import { useScreenSize } from '../../hooks/useScreenSize';
import { useLocation } from 'react-router-dom';

interface ProfilesMenuProps {
    onBack: () => void;
    activeProfileSubView: string;
    setActiveProfileSubView: (v: string) => void;
    isCollapsed: boolean;
    setIsSidebarOpen: (v: boolean) => void;
}

export const ProfilesMenu = ({
    onBack,
    setActiveProfileSubView,
    isCollapsed,
    setIsSidebarOpen
}: ProfilesMenuProps) => {
    const { isDesktop } = useScreenSize();
    const location = useLocation();

    const getPath = (id: string) => {
        const map: Record<string, string> = {
            'SEARCH': 'Search',
            'FOLDERS': 'Folders',
            'TAGS': 'Tags',
            'SHARED': 'Shared',
            'FAVORITES': 'Favorites',
            'DUPLICATES': 'Duplicates',
            'LOCAL': 'Local',
            'NEW_APPLIES': 'NewApplies',
            'OPEN_APPLIES': 'OpenApplies',
            'NEW_LOCAL': 'NewLocal',
            'INTERVIEW_STATUS': 'InterviewStatus',
        };
        return map[id] || id;
    };

    const currentPath = location.pathname.split('/profiles/view/')[1] || 'Search';

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
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">Profiles Module</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage Candidates & Talent Pools</p>
            </div>

            <div className="space-y-1 overflow-y-visible" data-tour="profiles-menu">
                {PROFILES_CATEGORIES.map((cat, idx) => (
                    <div key={cat.id} className={`${idx !== 0 ? 'mt-4 border-t border-slate-100 dark:border-slate-800 pt-4' : ''} animate-in fade-in slide-in-from-left-2 duration-300`} style={{ animationDelay: `${idx * 100}ms` }}>
                        {!isCollapsed && (
                            <h4 className="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                                {cat.label}
                            </h4>
                        )}
                        {cat.items.map(item => {
                            const path = getPath(item.id);
                            const tourId =
                                item.id === 'SEARCH' ? 'nav-profile-search' :
                                    item.id === 'NEW_LOCAL' ? 'nav-profile-new' :
                                        item.id === 'NEW_APPLIES' ? 'nav-profile-new-applies' :
                                            item.id === 'OPEN_APPLIES' ? 'nav-profile-open-applies' :
                                                item.id === 'DUPLICATES' ? 'nav-profile-duplicates' :
                                                    item.id === 'FOLDERS' ? 'nav-profile-folders' : undefined;

                            return (
                                <NavItem
                                    key={item.id}
                                    icon={item.icon}
                                    label={item.label}
                                    activeTab={currentPath === path}
                                    to={`/profiles/view/${path}`}
                                    onClick={() => {
                                        setActiveProfileSubView(item.id);
                                        if (!isDesktop) setIsSidebarOpen(false);
                                    }}
                                    isCollapsed={isCollapsed}
                                    data-tour={tourId}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};
