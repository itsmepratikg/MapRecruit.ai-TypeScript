
import React, { useState, useRef } from 'react';
import { LayoutDashboard, Briefcase, Users, BarChart2, Settings, ChevronRight, MessageSquare } from '../Icons';
import { NavItem } from './NavItem';
import { CampaignMenuContent, ProfilesMenuContent, SettingsMenuContent, TalentChatMenuContent } from './Flyouts';
import { useScreenSize } from '../../hooks/useScreenSize';

interface DashboardMenuProps {
    activeView: string;
    onNavigate: (view: any) => void;
    isCollapsed: boolean;
    setIsSidebarOpen: (v: boolean) => void;
    activeProfileSubView: string;
    setActiveProfileSubView: (v: string) => void;
    activeSettingsTab: string;
    setActiveSettingsTab: (v: string) => void;
    activeTalentChatTab: string;
    setActiveTalentChatTab: (v: string) => void;
    userProfile: any;
    onNavigateToCampaign: (campaign: any) => void;
    handleNavigateToCampaignList: (tab: string) => void;
}

export const DashboardMenu = ({
    activeView,
    onNavigate,
    isCollapsed,
    setIsSidebarOpen,
    activeProfileSubView,
    setActiveProfileSubView,
    activeSettingsTab,
    setActiveSettingsTab,
    activeTalentChatTab,
    setActiveTalentChatTab,
    userProfile,
    onNavigateToCampaign,
    handleNavigateToCampaignList
}: DashboardMenuProps) => {
    const { isDesktop } = useScreenSize();
    const [activePopover, setActivePopover] = useState<string | null>(null);
    
    // Hover timeout refs
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handlePopoverEnter = (id: string) => {
        if (!isDesktop) return;
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        if (activePopover === id) return;
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = setTimeout(() => {
            setActivePopover(id);
        }, 500);
    };

    const handlePopoverLeave = () => {
        if (!isDesktop) return;
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        closeTimeoutRef.current = setTimeout(() => {
            setActivePopover(null);
        }, 300);
    };

    const closePopover = () => setActivePopover(null);

    const getPopoverClass = (id: string) => {
        const isActive = activePopover === id;
        return `absolute left-full top-0 ml-2 z-50 origin-top-left transition-all duration-300 ease-out transform ${
            isActive 
            ? 'opacity-100 scale-100 translate-x-0 visible pointer-events-auto' 
            : 'opacity-0 scale-95 -translate-x-2 invisible pointer-events-none'
        }`;
    };

    return (
        <>
            <NavItem view="DASHBOARD" icon={LayoutDashboard} label="Dashboard" onClick={() => onNavigate('DASHBOARD')} activeView={activeView} isCollapsed={isCollapsed} />
            
            {/* Campaign Fly-out Menu Item */}
            <div className="relative" onMouseEnter={() => handlePopoverEnter('campaigns')} onMouseLeave={handlePopoverLeave}>
            <button 
                onClick={() => handleNavigateToCampaignList('Active')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${activeView === 'CAMPAIGNS' || activePopover === 'campaigns' ? 'bg-emerald-100 text-emerald-900 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
                <div className="flex items-center gap-3">
                    <Briefcase size={20} className={(activeView === 'CAMPAIGNS' || activePopover === 'campaigns') ? 'text-emerald-700' : 'text-slate-400 dark:text-slate-500'} />
                    <span className={isCollapsed ? 'hidden' : 'block'}>Campaigns</span>
                </div>
                {!isCollapsed && <ChevronRight size={16} className={`transition-transform duration-200 ${activePopover === 'campaigns' ? 'rotate-90 text-emerald-600' : ''}`} />}
            </button>

            {/* Desktop Flyout Content */}
            {isDesktop && (
                <div 
                    className={getPopoverClass('campaigns')}
                    onMouseEnter={() => handlePopoverEnter('campaigns')}
                    onMouseLeave={handlePopoverLeave}
                >
                    <CampaignMenuContent 
                        onNavigate={handleNavigateToCampaignList}
                        onNavigateToCampaign={onNavigateToCampaign}
                        activeView={activeView}
                        activeClient={userProfile.activeClient}
                        onClose={closePopover}
                    />
                </div>
            )}
            </div>
            
            {/* Main Sidebar Profile Item with Hover Menu */}
            <div className="relative" onMouseEnter={() => handlePopoverEnter('profiles')} onMouseLeave={handlePopoverLeave}>
            <button 
                onClick={() => {
                    onNavigate('PROFILES');
                    setActiveProfileSubView('SEARCH');
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${activePopover === 'profiles' ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-900 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
                <div className="flex items-center gap-3">
                    <Users size={20} className={activePopover === 'profiles' ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-400 dark:text-slate-500'} />
                    <span className="isCollapsed ? 'hidden' : 'block'">Profiles</span>
                </div>
                {!isCollapsed && <ChevronRight size={16} className={`transition-transform duration-200 ${activePopover === 'profiles' ? 'rotate-90 text-emerald-600' : ''}`} />}
            </button>

            {/* Desktop Hover Flyout */}
            {isDesktop && (
                <div 
                    className={getPopoverClass('profiles')}
                    onMouseEnter={() => handlePopoverEnter('profiles')}
                    onMouseLeave={handlePopoverLeave}
                >
                    <ProfilesMenuContent 
                        onNavigate={(id) => {
                            onNavigate('PROFILES');
                            setActiveProfileSubView(id);
                        }}
                        onClose={closePopover}
                        activeView={activeView === 'PROFILES' ? activeProfileSubView : ''}
                    />
                </div>
            )}
            </div>

            <NavItem view="METRICS" icon={BarChart2} label="Metrics" onClick={() => onNavigate('METRICS')} activeView={activeView} isCollapsed={isCollapsed} />
            
            {/* Main Sidebar Settings Item with Hover Menu */}
            <div className="relative" onMouseEnter={() => handlePopoverEnter('settings')} onMouseLeave={handlePopoverLeave}>
            <button 
                onClick={() => {
                    onNavigate('SETTINGS');
                    setActiveSettingsTab('COMPANY_INFO');
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${activePopover === 'settings' ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-900 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
                <div className="flex items-center gap-3">
                    <Settings size={20} className={activePopover === 'settings' ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-400 dark:text-slate-500'} />
                    <span className={isCollapsed ? 'hidden' : 'block'}>Settings</span>
                </div>
                {!isCollapsed && <ChevronRight size={16} className={`transition-transform duration-200 ${activePopover === 'settings' ? 'rotate-90 text-emerald-600' : ''}`} />}
            </button>

            {/* Desktop Hover Flyout */}
            {isDesktop && (
                <div 
                    className={getPopoverClass('settings')}
                    onMouseEnter={() => handlePopoverEnter('settings')}
                    onMouseLeave={handlePopoverLeave}
                >
                    <SettingsMenuContent 
                        onNavigate={(tabId) => {
                            onNavigate('SETTINGS');
                            setActiveSettingsTab(tabId);
                        }}
                        activeTab={activeView === 'SETTINGS' ? activeSettingsTab : ''}
                        onClose={closePopover}
                    />
                </div>
            )}
            </div>

            {/* Talent Chat Item with Hover Menu */}
            <div className="relative" onMouseEnter={() => handlePopoverEnter('talentchat')} onMouseLeave={handlePopoverLeave}>
                <button 
                    onClick={() => {
                        onNavigate('TALENT_CHAT');
                        setActiveTalentChatTab('CONVERSATIONS');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${activePopover === 'talentchat' ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-900 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                    <div className="flex items-center gap-3">
                        <MessageSquare size={20} className={activePopover === 'talentchat' ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-400 dark:text-slate-500'} />
                        <span className={isCollapsed ? 'hidden' : 'block'}>Talent Chat</span>
                    </div>
                    {!isCollapsed && <ChevronRight size={16} className={`transition-transform duration-200 ${activePopover === 'talentchat' ? 'rotate-90 text-emerald-600' : ''}`} />}
                </button>

                {/* Desktop Hover Flyout */}
                {isDesktop && (
                    <div 
                        className={getPopoverClass('talentchat')}
                        onMouseEnter={() => handlePopoverEnter('talentchat')}
                        onMouseLeave={handlePopoverLeave}
                    >
                        <TalentChatMenuContent 
                            onNavigate={(tabId) => {
                                onNavigate('TALENT_CHAT');
                                setActiveTalentChatTab(tabId);
                            }}
                            onClose={closePopover}
                            activeTab={activeView === 'TALENT_CHAT' ? activeTalentChatTab : ''}
                        />
                    </div>
                )}
            </div>
        </>
    );
};
