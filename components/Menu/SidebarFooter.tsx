
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle, Building2, Search, Command, Globe } from '../Icons';
import { useScreenSize } from '../../hooks/useScreenSize';
import { COLORS } from '../../data/profile';
import { CreateMenuContent, ClientMenuContent, AccountMenuContent, CompanySwitcherContent } from './Flyouts';
import { Portal } from './Portal';

interface SidebarFooterProps {
    setIsCreateProfileOpen: (v: boolean) => void;
    setIsCreateCampaignOpen: (v: boolean) => void;
    setIsCreateFolderOpen: (v: boolean) => void;
    setIsGlobalSearchOpen: (v: boolean) => void; // New Prop
    onOpenPlaceholder: (title: string, msg: string) => void;
    onNavigate: (view: any) => void;
    onLogout: () => void;
    userProfile: any;
    clients: any[];
    onSwitchClient: (client: string) => void;
    setActiveAccountTab: (tab: string) => void;
    onOpenSupport: () => void;
    isCapturingSupport?: boolean;
}

export const SidebarFooter = ({
    setIsCreateProfileOpen,
    setIsCreateCampaignOpen,
    setIsCreateFolderOpen,
    setIsGlobalSearchOpen,
    onOpenPlaceholder,
    onNavigate,
    onLogout,
    userProfile,
    clients,
    onSwitchClient,
    setActiveAccountTab,
    onOpenSupport,
    isCapturingSupport
}: SidebarFooterProps) => {
    const { t } = useTranslation();
    const { isDesktop } = useScreenSize();
    const [activePopover, setActivePopover] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<'client' | 'account' | 'create' | 'company' | null>(null);
    const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0, bottom: 0 });
    const [metaKey, setMetaKey] = useState('Ctrl'); // Default

    // Helper to safely check permissions even if roleID is not fully populated yet
    const hasPermission = (setting: string) => {
        // Fallback: Check root-level accessibilitySettings if available (hybrid data model)
        if (userProfile?.accessibilitySettings?.[setting] === true || userProfile?.accessibilitySettings?.settings?.[setting] === true) {
            return true;
        }

        if (!userProfile?.roleID || typeof userProfile.roleID !== 'object') return false;
        // Check root-level flags (new format) or nested settings (old format)
        return (
            userProfile.roleID.accessibilitySettings?.[setting] === true ||
            userProfile.roleID.accessibilitySettings?.settings?.[setting] === true
        );
    };


    // Detect OS for shortcut hint
    useEffect(() => {
        if (typeof navigator !== 'undefined') {
            if (navigator.platform.toUpperCase().indexOf('MAC') >= 0) {
                setMetaKey('Cmd');
            } else {
                setMetaKey('Ctrl');
            }
        }
    }, []);

    // Hover timeout refs for desktop
    const hoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const userColorObj = COLORS.find(c => c.name === userProfile.color) || COLORS[0];

    const handleMenuClick = (menu: 'client' | 'account' | 'create' | 'company') => {
        if (!isDesktop) {
            setMobileMenuOpen(menu);
        }
    };

    const handleClientSelect = (client: string) => {
        onSwitchClient(client);
        setMobileMenuOpen(null);
        setActivePopover(null);
    };

    // Desktop Hover Logic
    const handlePopoverEnter = (id: string, e: React.MouseEvent) => {
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();

        // ONLY set position if we're entering from a trigger element (which has a relative class or specific data-tour)
        // This stops the flyout from re-calculating its own position when hovered in the Portal
        const isTrigger = target.classList.contains('relative') || target.tagName === 'BUTTON';

        if (isTrigger) {
            setPopoverPos({
                top: rect.top,
                left: rect.right,
                bottom: window.innerHeight - rect.bottom
            });
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
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        closeTimeoutRef.current = setTimeout(() => {
            setActivePopover(null);
        }, 300);
    };

    // Helper for popup transitions
    const getPopupStyle = (id: string) => {
        const isActive = activePopover === id;
        const isAccount = id === 'account';

        return {
            top: 'auto', // Force bottom-up growth for footer items
            bottom: isAccount ? '16px' : `${popoverPos.bottom}px`,
            left: `${popoverPos.left}px`,
            paddingLeft: '24px', // Much wider bridge for reliable mouse transition
            marginLeft: '-20px', // Pull bridge even closer to trigger for overlap
            position: 'fixed' as const,
            opacity: isActive ? 1 : 0,
            transition: 'opacity 0.2s ease-out, visibility 0.2s',
            visibility: isActive ? 'visible' as const : 'hidden' as const,
            pointerEvents: isActive ? 'auto' as const : 'none' as const,
        };
    };

    return (
        <div className="p-2 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 mt-auto space-y-1 shrink-0 transition-colors pb-4 lg:pb-2" onClick={(e) => e.stopPropagation()}>
            {/* DEBUG: Temporary Diagnostic UI - Commented out to avoid confusing user
            {(!userProfile?.roleID || typeof userProfile.roleID === 'string') && (
                <div className="text-[10px] text-red-500 p-1 bg-red-50 mb-1 border border-red-200 rounded max-w-xs overflow-hidden">
                    ❌ Role Data Missing.<br />
                    Keys: {Object.keys(userProfile).join(', ')}<br />
                    RoleVal: {JSON.stringify(userProfile.role)}
                </div>
            )}
            */}
            {userProfile?.roleID && typeof userProfile.roleID === 'object' && !hasPermission('clientSwitcher') && (
                <div className="text-[10px] text-orange-500 p-1 bg-orange-50 mb-1 border border-orange-200 rounded">
                    ⚠ Perms Loaded but 'clientSwitcher' is false.
                </div>
            )}

            {/* Global Search Trigger */}
            <div className="relative mb-2">
                <button
                    data-tour="global-search-trigger"
                    onClick={() => setIsGlobalSearchOpen(true)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <Search size={18} />
                        <span className="text-sm font-medium">{t("Search")}</span>
                    </div>
                    {isDesktop && (
                        <div className="hidden lg:flex items-center gap-1 text-[10px] text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                            {metaKey === 'Cmd' ? '⌘' : 'Ctrl'} K
                        </div>
                    )}
                </button>
            </div>

            {/* Create Dropdown */}
            <div className="relative" onMouseEnter={(e) => isDesktop && handlePopoverEnter('create', e)} onMouseLeave={() => isDesktop && handlePopoverLeave()}>
                <button
                    data-tour="nav-create-trigger"
                    onClick={() => handleMenuClick('create')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors ${activePopover === 'create' ? 'bg-slate-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400' : ''}`}
                >
                    <PlusCircle size={18} className={activePopover === 'create' ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"} />
                    <span className="text-sm font-medium">{t("Create")}</span>
                </button>

                {/* Desktop Create Menu */}
                {isDesktop && (
                    <Portal>
                        <div
                            style={getPopupStyle('create')}
                            className="z-[9999] transition-all duration-200 ease-out"
                            onMouseEnter={(e) => handlePopoverEnter('create', e)}
                            onMouseLeave={handlePopoverLeave}
                        >
                            <CreateMenuContent
                                onCreateProfile={() => { setIsCreateProfileOpen(true); setActivePopover(null); }}
                                onCreateCampaign={() => { setIsCreateCampaignOpen(true); setActivePopover(null); }}
                                onCreateFolder={() => { setIsCreateFolderOpen(true); setActivePopover(null); }}
                                onOpenPlaceholder={(t, m) => { onOpenPlaceholder(t, m); setActivePopover(null); }}
                                closeMenu={() => setActivePopover(null)}
                            />
                        </div>
                    </Portal>
                )}
            </div>

            {/* Switch Client */}
            {hasPermission('clientSwitcher') && (
                <div className="relative" onMouseEnter={(e) => isDesktop && handlePopoverEnter('client', e)} onMouseLeave={() => isDesktop && handlePopoverLeave()}>
                    <button
                        data-tour="nav-client-switcher"
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors ${activePopover === 'client' ? 'bg-slate-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400' : ''}`}
                        onClick={() => handleMenuClick('client')}
                    >
                        <Building2 size={18} className={activePopover === 'client' ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"} />
                        <span className="text-sm font-medium truncate" title={clients.find(c => (c._id || c.id) === userProfile.activeClientID)?.clientName || (typeof userProfile.activeClient === 'object' ? userProfile.activeClient.clientName : userProfile.activeClient)}>
                            {clients.find(c => (c._id || c.id) === userProfile.activeClientID)?.clientName || (typeof userProfile.activeClient === 'object' ? userProfile.activeClient.clientName : userProfile.activeClient)}
                        </span>
                    </button>

                    {/* Desktop Client List Popover */}
                    {isDesktop && (
                        <Portal>
                            <div
                                style={getPopupStyle('client')}
                                className="z-[9999] transition-all duration-200 ease-out"
                                onMouseEnter={(e) => handlePopoverEnter('client', e)}
                                onMouseLeave={handlePopoverLeave}
                            >
                                <ClientMenuContent activeClient={userProfile.activeClient} activeClientId={userProfile.activeClientID} clients={clients} onSwitchClient={handleClientSelect} onClose={() => setActivePopover(null)} />
                            </div>
                        </Portal>
                    )}
                </div>
            )}

            {/* Switch Company (Permission Based) */}
            {hasPermission('companySwitcher') && (
                <div className="relative" onMouseEnter={(e) => isDesktop && handlePopoverEnter('company', e)} onMouseLeave={() => isDesktop && handlePopoverLeave()}>
                    <button
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors ${activePopover === 'company' ? 'bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400' : ''}`}
                        onClick={() => handleMenuClick('company')}
                    >
                        <Globe size={18} className={activePopover === 'company' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"} />
                        <span className="text-sm font-medium">{t("Admin Switcher")}</span>
                    </button>

                    {/* Desktop Company Switcher Popover */}
                    {isDesktop && (
                        <Portal>
                            <div
                                style={getPopupStyle('company')}
                                className="z-[9999] transition-all duration-200 ease-out"
                                onMouseEnter={(e) => handlePopoverEnter('company', e)}
                                onMouseLeave={handlePopoverLeave}
                            >
                                <CompanySwitcherContent
                                    isVisible={activePopover === 'company'}
                                    onClose={() => setActivePopover(null)}
                                    activeCompanyID={(userProfile.currentCompanyID || userProfile.companyID || userProfile.companyId)?.toString()}
                                />
                            </div>
                        </Portal>
                    )}
                </div>
            )}

            {/* User Account */}
            <div className="relative pt-2" onMouseEnter={(e) => isDesktop && handlePopoverEnter('account', e)} onMouseLeave={() => isDesktop && handlePopoverLeave()}>
                <button
                    data-tour="nav-my-account"
                    className={`w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors ${activePopover === 'account' ? 'bg-slate-50 dark:bg-slate-800' : ''}`}
                    onClick={() => handleMenuClick('account')}
                >
                    <div className={`w-8 h-8 rounded-full overflow-hidden border border-slate-300 dark:border-slate-600 shrink-0 flex items-center justify-center text-xs font-bold ${!userProfile.avatar ? userColorObj.class : 'bg-slate-200'}`}>
                        {userProfile.avatar ? (
                            <img src={userProfile.avatar} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            userProfile.firstName.charAt(0) + userProfile.lastName.charAt(0)
                        )}
                    </div>
                    <div className="text-left flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{userProfile.firstName}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{t("My Account")}</p>
                    </div>
                </button>

                {/* Desktop Account Popover */}
                {isDesktop && (
                    <Portal>
                        <div
                            style={getPopupStyle('account')}
                            className="z-[9999] transition-all duration-200 ease-out"
                            onMouseEnter={(e) => handlePopoverEnter('account', e)}
                            onMouseLeave={handlePopoverLeave}
                        >
                            <div className="w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl relative">
                                <div className="absolute bottom-6 -left-2 w-4 h-4 bg-white dark:bg-slate-800 transform rotate-45 border-l border-b border-slate-200 dark:border-slate-700"></div>
                                <AccountMenuContent
                                    onNavigate={onNavigate}
                                    onLogout={onLogout}
                                    userProfile={userProfile}
                                    closeMenu={() => setActivePopover(null)}
                                    setActiveAccountTab={setActiveAccountTab}
                                    onOpenSupport={onOpenSupport}
                                    isCapturingSupport={isCapturingSupport}
                                />
                            </div>
                        </div>
                    </Portal>
                )}
            </div>

            {/* Mobile Modal Overlay */}
            {!isDesktop && mobileMenuOpen && (
                <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setMobileMenuOpen(null)}>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                        {mobileMenuOpen === 'create' && (
                            <CreateMenuContent
                                onCreateProfile={() => { setIsCreateProfileOpen(true); setMobileMenuOpen(null); }}
                                onCreateCampaign={() => { setIsCreateCampaignOpen(true); setMobileMenuOpen(null); }}
                                onCreateFolder={() => { setIsCreateFolderOpen(true); setMobileMenuOpen(null); }}
                                onOpenPlaceholder={(t, m) => { onOpenPlaceholder(t, m); setMobileMenuOpen(null); }}
                                closeMenu={() => setMobileMenuOpen(null)}
                            />
                        )}
                        {mobileMenuOpen === 'client' && <ClientMenuContent activeClient={userProfile.activeClient} activeClientId={userProfile.activeClientID} clients={clients} onSwitchClient={handleClientSelect} onClose={() => setMobileMenuOpen(null)} />}
                        {mobileMenuOpen === 'account' && (
                            <AccountMenuContent
                                closeMenu={() => setMobileMenuOpen(null)}
                                onNavigate={onNavigate}
                                onLogout={onLogout}
                                userProfile={userProfile}
                                setActiveAccountTab={setActiveAccountTab}
                                onOpenSupport={onOpenSupport}
                                isCapturingSupport={isCapturingSupport}
                            />
                        )}
                        {mobileMenuOpen === 'company' && <CompanySwitcherContent onClose={() => setMobileMenuOpen(null)} />}
                    </div>
                </div>
            )}
        </div>
    );
};
