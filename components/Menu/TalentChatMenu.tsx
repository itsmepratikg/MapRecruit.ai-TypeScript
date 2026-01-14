import React from 'react';
import { ChevronLeft } from '../Icons';
import { NavItem } from './NavItem';
import { TALENT_CHAT_MENU } from './constants';
import { useScreenSize } from '../../hooks/useScreenSize';
import { useLocation } from 'react-router-dom';

interface TalentChatMenuProps {
    onBack: () => void;
    activeTab: string;
    setActiveTab: (v: string) => void;
    isCollapsed: boolean;
    setIsSidebarOpen: (v: boolean) => void;
}

export const TalentChatMenu = ({
    onBack,
    setActiveTab,
    isCollapsed,
    setIsSidebarOpen
}: TalentChatMenuProps) => {
    const { isDesktop } = useScreenSize();
    const location = useLocation();

    const getPath = (id: string) => {
        const map: Record<string, string> = {
            'CONVERSATIONS': 'Conversations',
            'KEYWORDS': 'Keywords',
            'SCHEDULES': 'Schedules',
            'ANALYTICS': 'Analytics',
        };
        return map[id] || id;
    };

    const currentPath = location.pathname.split('/talent-chat/')[1] || 'Conversations';

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
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">Talent Chat</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Unified Messaging & Tools</p>
            </div>

            <div className="space-y-1">
                {TALENT_CHAT_MENU.map((item, index) => {
                    const path = getPath(item.id);
                    return (
                        <div key={item.id} className="animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                            <NavItem
                                icon={item.icon}
                                label={item.label}
                                activeTab={currentPath === path}
                                to={`/talent-chat/${path}`}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    if (!isDesktop) setIsSidebarOpen(false);
                                }}
                                isCollapsed={isCollapsed}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
