
import React from 'react';
import { ChevronLeft } from '../Icons';
import { NavItem } from './NavItem';
import { TALENT_CHAT_MENU } from './constants';
import { useScreenSize } from '../../hooks/useScreenSize';

interface TalentChatMenuProps {
    onBack: () => void;
    activeTab: string;
    setActiveTab: (v: string) => void;
    isCollapsed: boolean;
    setIsSidebarOpen: (v: boolean) => void;
}

export const TalentChatMenu = ({
    onBack,
    activeTab,
    setActiveTab,
    isCollapsed,
    setIsSidebarOpen
}: TalentChatMenuProps) => {
    const { isDesktop } = useScreenSize();

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
                {TALENT_CHAT_MENU.map((item, index) => (
                    <div key={item.id} className="animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                        <NavItem 
                            icon={item.icon} 
                            label={item.label} 
                            activeTab={activeTab === item.id} 
                            onClick={() => { setActiveTab(item.id); if (!isDesktop) setIsSidebarOpen(false); }}
                            isCollapsed={isCollapsed}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
