import React from 'react';
import { ChevronLeft } from '../Icons';
import { NavItem } from './NavItem';
import { PROFILE_CATEGORIES } from './constants';
import { useScreenSize } from '../../hooks/useScreenSize';
import { useNavigate, useParams } from 'react-router-dom';

interface CandidateMenuProps {
    onBack: () => void;
    activeProfileTab: string;
    setActiveProfileTab: (v: string) => void;
    selectedCandidateId: string | null;
    isCollapsed: boolean;
    setIsSidebarOpen: (v: boolean) => void;
    onTabChange?: (tab: string) => void;
}

export const CandidateMenu = ({
    onBack,
    activeProfileTab: propsActiveTab,
    setActiveProfileTab,
    selectedCandidateId: propsId,
    isCollapsed,
    setIsSidebarOpen,
    onTabChange
}: CandidateMenuProps) => {
    const { isDesktop } = useScreenSize();
    const navigate = useNavigate();
    const { tab: currentTab, id } = useParams<{ tab: string; id: string }>();

    const activeId = id || propsId;
    const activeTab = currentTab || propsActiveTab || 'profile';

    const handleTabClick = (tabId: string) => {
        if (onTabChange) {
            onTabChange(tabId);
            return;
        }

        if (!activeId) return;
        navigate(`/profile/${tabId}/${activeId}`);
        if (!isDesktop) setIsSidebarOpen(false);
    };

    return (
        <div className="animate-in slide-in-from-left duration-300 ease-out">
            <button
                onClick={onBack}
                className={`w-full flex items-center gap-2 px-3 py-2 mb-4 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                title="Back to Search"
            >
                <ChevronLeft size={14} /> <span className={isCollapsed ? 'hidden' : 'inline'}>Back to Search</span>
            </button>

            <div className={`px-3 mb-6 ${isCollapsed ? 'hidden' : 'block'}`}>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">Candidate Profile</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">ID: {activeId}</p>
            </div>

            <div className="space-y-6 mt-4">
                {PROFILE_CATEGORIES.map((category, catIndex) => (
                    <div key={category.id} className="space-y-1">
                        {!isCollapsed && (
                            <h4 className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 animate-in fade-in duration-300">
                                {category.label}
                            </h4>
                        )}
                        {category.items.map((tab, itemIndex) => (
                            <div key={tab.id} className="animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${(catIndex * 3 + itemIndex) * 50}ms` }}>
                                <NavItem
                                    icon={tab.icon}
                                    label={tab.label}
                                    activeTab={activeTab === tab.id}
                                    onClick={() => handleTabClick(tab.id)}
                                    isCollapsed={isCollapsed}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
