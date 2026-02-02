import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, BarChart2, Settings, ChevronRight, MessageSquare, User } from '../Icons';
import { NavItem } from './NavItem';
import { CampaignMenuContent, ProfilesMenuContent, SettingsMenuContent, TalentChatMenuContent } from './Flyouts';
import { getProfileViewPath } from './constants';
import { useScreenSize } from '../../hooks/useScreenSize';
import { Portal } from './Portal';

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
    const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
    const { t } = useTranslation();

    // Hover timeout refs
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handlePopoverEnter = (id: string, e: React.MouseEvent) => {
        if (!isDesktop) return;

        // ONLY set position when entering from the trigger (the relative container in the sidebar)
        // This prevents the flyout from jumping when hovered because it's in a Portal
        if (e.currentTarget.classList.contains('relative')) {
            const rect = e.currentTarget.getBoundingClientRect();
            setPopoverPos({ top: rect.top, left: rect.right });
        }

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

    const closePopover = React.useCallback(() => setActivePopover(null), []);

    const getPopoverStyle = (id: string) => {
        const isActive = activePopover === id;
        return {
            top: `${popoverPos.top}px`,
            left: `${popoverPos.left}px`, // No gap here, we use padding inside for the bridge
            paddingLeft: '8px', // Bridge space
            marginLeft: '-4px', // Slight overlap for stability
            position: 'fixed' as const,
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'scale(1) translateX(4px)' : 'scale(0.95) translateX(0)',
            visibility: isActive ? 'visible' as const : 'hidden' as const,
            pointerEvents: isActive ? 'auto' as const : 'none' as const,
        };
    };

    const isActiveCampaign = location.pathname.startsWith('/campaigns');
    const isActiveProfile = location.pathname.startsWith('/profiles');
    const isActiveSettings = location.pathname.startsWith('/settings');
    const isActiveTalentChat = location.pathname.startsWith('/talent-chat');

    return (
        <>
            <NavItem to="/dashboard" icon={LayoutDashboard} label={t("Dashboard")} isCollapsed={isCollapsed} />

            {/* Campaign Fly-out Menu Item */}
            <div className="relative" onMouseEnter={(e) => handlePopoverEnter('campaigns', e)} onMouseLeave={handlePopoverLeave}>
                <NavLink
                    to="/campaigns"
                    data-tour="nav-campaigns"
                    className={({ isActive }) => `w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${isActive || activePopover === 'campaigns' ? 'bg-emerald-100 text-emerald-900 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                    <div className="flex items-center gap-3">
                        <Briefcase size={20} className={(isActiveCampaign || activePopover === 'campaigns') ? 'text-emerald-700' : 'text-slate-400 dark:text-slate-500'} />
                        <span className={isCollapsed ? 'hidden' : 'block'}>{t("Campaigns")}</span>
                    </div>
                    {!isCollapsed && <ChevronRight size={16} className={`transition-transform duration-200 ${activePopover === 'campaigns' ? 'rotate-90 text-emerald-600' : ''}`} />}
                </NavLink>

                {/* Desktop Flyout Content */}
                {isDesktop && (
                    <Portal>
                        <div
                            style={getPopoverStyle('campaigns')}
                            className="z-[9999] transition-all duration-300 ease-out"
                            onMouseEnter={(e) => handlePopoverEnter('campaigns', e)}
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
                    </Portal>
                )}
            </div>

            {/* Main Sidebar Profile Item with Hover Menu */}
            <div className="relative" onMouseEnter={(e) => handlePopoverEnter('profiles', e)} onMouseLeave={handlePopoverLeave}>
                <NavLink
                    to="/profiles/searchprofiles"
                    className={({ isActive }) => `w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${isActive || activePopover === 'profiles' ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-900 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                    <div className="flex items-center gap-3">
                        <Users size={20} className={isActiveProfile || activePopover === 'profiles' ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-400 dark:text-slate-500'} />
                        <span className={isCollapsed ? 'hidden' : 'block'}>{t("Profiles")}</span>
                    </div>
                    {!isCollapsed && <ChevronRight size={16} className={`transition-transform duration-200 ${activePopover === 'profiles' ? 'rotate-90 text-emerald-600' : ''}`} />}
                </NavLink>

                {/* Desktop Hover Flyout */}
                {isDesktop && (
                    <Portal>
                        <div
                            style={getPopoverStyle('profiles')}
                            className="z-[9999] transition-all duration-300 ease-out"
                            onMouseEnter={(e) => handlePopoverEnter('profiles', e)}
                            onMouseLeave={handlePopoverLeave}
                        >
                            <ProfilesMenuContent
                                onNavigate={(id) => {
                                    // id is like "SEARCH" or "NEW_LOCAL"
                                    const path = getProfileViewPath(id);
                                    navigate(`/profiles/searchprofiles/${path}`);
                                    setActiveProfileSubView(id);
                                }}
                                onClose={closePopover}
                                activeView={isActiveProfile ? activeProfileSubView : ''}
                            />
                        </div>
                    </Portal>
                )}
            </div>

            <NavItem to="/metrics" icon={BarChart2} label={t("Metrics")} isCollapsed={isCollapsed} data-tour="nav-metrics" />

            {/* Main Sidebar Settings Item with Hover Menu */}
            <div className="relative" onMouseEnter={(e) => handlePopoverEnter('settings', e)} onMouseLeave={handlePopoverLeave}>
                <NavLink
                    to="/settings/CompanyInfo"
                    data-tour="nav-settings"
                    className={({ isActive }) => `w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${isActive || activePopover === 'settings' ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-900 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                    <div className="flex items-center gap-3">
                        <Settings size={20} className={isActiveSettings || activePopover === 'settings' ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-400 dark:text-slate-500'} />
                        <span className={isCollapsed ? 'hidden' : 'block'}>{t("Settings")}</span>
                    </div>
                    {!isCollapsed && <ChevronRight size={16} className={`transition-transform duration-200 ${activePopover === 'settings' ? 'rotate-90 text-emerald-600' : ''}`} />}
                </NavLink>

                {/* Desktop Hover Flyout */}
                {isDesktop && (
                    <Portal>
                        <div
                            style={getPopoverStyle('settings')}
                            className="z-[9999] transition-all duration-300 ease-out"
                            onMouseEnter={(e) => handlePopoverEnter('settings', e)}
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
                    </Portal>
                )}
            </div>

            {/* Talent Chat Item with Hover Menu */}
            <div className="relative" onMouseEnter={(e) => handlePopoverEnter('talentchat', e)} onMouseLeave={handlePopoverLeave}>
                <NavLink
                    to="/talent-chat"
                    data-tour="nav-talent-chat"
                    className={({ isActive }) => `w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${isActive || activePopover === 'talentchat' ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-900 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                    <div className="flex items-center gap-3">
                        <MessageSquare size={20} className={isActiveTalentChat || activePopover === 'talentchat' ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-400 dark:text-slate-500'} />
                        <span className={isCollapsed ? 'hidden' : 'block'}>{t("Talent Chat")}</span>
                    </div>
                    {!isCollapsed && <ChevronRight size={16} className={`transition-transform duration-200 ${activePopover === 'talentchat' ? 'rotate-90 text-emerald-600' : ''}`} />}
                </NavLink>

                {/* Desktop Hover Flyout */}
                {isDesktop && (
                    <Portal>
                        <div
                            style={getPopoverStyle('talentchat')}
                            className="z-[9999] transition-all duration-300 ease-out"
                            onMouseEnter={(e) => handlePopoverEnter('talentchat', e)}
                            onMouseLeave={handlePopoverLeave}
                        >
                            <TalentChatMenuContent
                                onNavigate={(id) => {
                                    // id is like "CONVERSATIONS"
                                    const map: Record<string, string> = {
                                        'CONVERSATIONS': 'Conversations',
                                        'KEYWORDS': 'Keywords',
                                        'SCHEDULES': 'Schedules',
                                        'ANALYTICS': 'Analytics',
                                    };
                                    const path = map[id] || id;
                                    navigate(`/talent-chat/${path}`);
                                    setActiveTalentChatTab(id);
                                }}
                                onClose={closePopover}
                                activeTab={isActiveTalentChat ? activeTalentChatTab : ''}
                            />
                        </div>
                    </Portal>
                )}
            </div>
            <NavItem to="/myaccount/basicdetails" icon={User} label={t("My Account")} isCollapsed={isCollapsed} />
        </>
    );
};
