import React, { useState, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, BarChart2, Settings, ChevronRight, MessageSquare } from '../Icons';
import { NavItem } from './NavItem';
import { CampaignMenuContent, ProfilesMenuContent, SettingsMenuContent, TalentChatMenuContent } from './Flyouts';
import { useScreenSize } from '../../hooks/useScreenSize';

interface DashboardMenuProps {
    activeView?: string; // Optional now
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
    const location = useLocation();
    const navigate = useNavigate();
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
        return `absolute left-full top-0 ml-2 z-50 origin-top-left transition-all duration-300 ease-out transform ${isActive
            ? 'opacity-100 scale-100 translate-x-0 visible pointer-events-auto'
            : 'opacity-0 scale-95 -translate-x-2 invisible pointer-events-none'
            }`;
    };

    const isActiveCampaign = location.pathname.startsWith('/campaigns');
    const isActiveProfile = location.pathname.startsWith('/profiles');
    const isActiveSettings = location.pathname.startsWith('/settings');
    const isActiveTalentChat = location.pathname.startsWith('/talent-chat');

    return (
        <>
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" isCollapsed={isCollapsed} />

            {/* Campaign Fly-out Menu Item */}
            <div className="relative" onMouseEnter={() => handlePopoverEnter('campaigns')} onMouseLeave={handlePopoverLeave}>
                <NavLink
                    to="/campaigns"
                    className={({ isActive }) => `w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${isActive || activePopover === 'campaigns' ? 'bg-emerald-100 text-emerald-900 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                    <div className="flex items-center gap-3">
                        <Briefcase size={20} className={(isActiveCampaign || activePopover === 'campaigns') ? 'text-emerald-700' : 'text-slate-400 dark:text-slate-500'} />
                        <span className={isCollapsed ? 'hidden' : 'block'}>Campaigns</span>
                    </div>
                    {!isCollapsed && <ChevronRight size={16} className={`transition-transform duration-200 ${activePopover === 'campaigns' ? 'rotate-90 text-emerald-600' : ''}`} />}
                </NavLink>

                {/* Desktop Flyout Content */}
                {isDesktop && (
                    <div
                        className={getPopoverClass('campaigns')}
                        onMouseEnter={() => handlePopoverEnter('campaigns')}
                        onMouseLeave={handlePopoverLeave}
                    >
                        <CampaignMenuContent
                            onNavigate={(tab) => { handleNavigateToCampaignList(tab); }} // This might need update if onNavigate uses state
                            onNavigateToCampaign={onNavigateToCampaign}
                            activeView={isActiveCampaign ? 'CAMPAIGNS' : ''}
                            activeClient={userProfile.activeClient}
                            onClose={closePopover}
                        />
                    </div>
                )}
            </div>

            {/* Main Sidebar Profile Item with Hover Menu */}
            <div className="relative" onMouseEnter={() => handlePopoverEnter('profiles')} onMouseLeave={handlePopoverLeave}>
                <NavLink
                    to="/profiles"
                    className={({ isActive }) => `w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${isActive || activePopover === 'profiles' ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-900 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                    <div className="flex items-center gap-3">
                        <Users size={20} className={isActiveProfile || activePopover === 'profiles' ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-400 dark:text-slate-500'} />
                        <span className={isCollapsed ? 'hidden' : 'block'}>Profiles</span>
                    </div>
                    {!isCollapsed && <ChevronRight size={16} className={`transition-transform duration-200 ${activePopover === 'profiles' ? 'rotate-90 text-emerald-600' : ''}`} />}
                </NavLink>

                {/* Desktop Hover Flyout */}
                {isDesktop && (
                    <div
                        className={getPopoverClass('profiles')}
                        onMouseEnter={() => handlePopoverEnter('profiles')}
                        onMouseLeave={handlePopoverLeave}
                    >
                        <ProfilesMenuContent
                            onNavigate={(id) => {
                                // onNavigate('PROFILES'); // No longer needed if linking
                                setActiveProfileSubView(id); // Still needed for sub-view state if not fully routed (profiles sub-view might be query param or sub-route)
                                // Ideally we navigate to /profiles?view=SEARCH
                            }}
                            onClose={closePopover}
                            activeView={isActiveProfile ? activeProfileSubView : ''}
                        />
                    </div>
                )}
            </div>

            <NavItem to="/metrics" icon={BarChart2} label="Metrics" isCollapsed={isCollapsed} />

            {/* Main Sidebar Settings Item with Hover Menu */}
            <div className="relative" onMouseEnter={() => handlePopoverEnter('settings')} onMouseLeave={handlePopoverLeave}>
                <NavLink
                    to="/settings/CompanyInfo"
                    className={({ isActive }) => `w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${isActive || activePopover === 'settings' ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-900 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                    <div className="flex items-center gap-3">
                        <Settings size={20} className={isActiveSettings || activePopover === 'settings' ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-400 dark:text-slate-500'} />
                        <span className={isCollapsed ? 'hidden' : 'block'}>Settings</span>
                    </div>
                    {!isCollapsed && <ChevronRight size={16} className={`transition-transform duration-200 ${activePopover === 'settings' ? 'rotate-90 text-emerald-600' : ''}`} />}
                </NavLink>

                {/* Desktop Hover Flyout */}
                {isDesktop && (
                    <div
                        className={getPopoverClass('settings')}
                        onMouseEnter={() => handlePopoverEnter('settings')}
                        onMouseLeave={handlePopoverLeave}
                    >
                        <SettingsMenuContent
                            onNavigate={(path) => {
                                // path will now be the full sub-path e.g., 'CompanyInfo' or 'Users'
                                navigate(`/settings/${path}`);
                                setActiveSettingsTab(path);
                            }}
                            activeTab={isActiveSettings ? location.pathname.split('/settings/')[1] || 'CompanyInfo' : ''}
                            onClose={closePopover}
                        />
                    </div>
                )}
            </div>

            {/* Talent Chat Item with Hover Menu */}
            <div className="relative" onMouseEnter={() => handlePopoverEnter('talentchat')} onMouseLeave={handlePopoverLeave}>
                <NavLink
                    to="/talent-chat"
                    className={({ isActive }) => `w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${isActive || activePopover === 'talentchat' ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-900 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                    <div className="flex items-center gap-3">
                        <MessageSquare size={20} className={isActiveTalentChat || activePopover === 'talentchat' ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-400 dark:text-slate-500'} />
                        <span className={isCollapsed ? 'hidden' : 'block'}>Talent Chat</span>
                    </div>
                    {!isCollapsed && <ChevronRight size={16} className={`transition-transform duration-200 ${activePopover === 'talentchat' ? 'rotate-90 text-emerald-600' : ''}`} />}
                </NavLink>

                {/* Desktop Hover Flyout */}
                {isDesktop && (
                    <div
                        className={getPopoverClass('talentchat')}
                        onMouseEnter={() => handlePopoverEnter('talentchat')}
                        onMouseLeave={handlePopoverLeave}
                    >
                        <TalentChatMenuContent
                            onNavigate={(tabId) => {
                                setActiveTalentChatTab(tabId);
                            }}
                            onClose={closePopover}
                            activeTab={isActiveTalentChat ? activeTalentChatTab : ''}
                        />
                    </div>
                )}
            </div>
        </>
    );
};
