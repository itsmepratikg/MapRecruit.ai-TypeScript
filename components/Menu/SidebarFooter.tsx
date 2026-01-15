
import React, { useState, useEffect } from 'react';
import { PlusCircle, Building2, Search, Command } from '../Icons';
import { useScreenSize } from '../../hooks/useScreenSize';
import { COLORS } from '../../data/profile';
import { CreateMenuContent, ClientMenuContent, AccountMenuContent } from './Flyouts';

interface SidebarFooterProps {
    setIsCreateProfileOpen: (v: boolean) => void;
    setIsCreateFolderOpen: (v: boolean) => void;
    setIsThemeSettingsOpen: (v: boolean) => void;
    setIsGlobalSearchOpen: (v: boolean) => void; // New Prop
    onOpenPlaceholder: (title: string, msg: string) => void;
    onNavigate: (view: any) => void;
    onLogout: () => void;
    userProfile: any;
    clients: string[];
    onSwitchClient: (client: string) => void;
    setActiveAccountTab: (tab: string) => void;
}

export const SidebarFooter = ({
    setIsCreateProfileOpen,
    setIsCreateFolderOpen,
    setIsThemeSettingsOpen,
    setIsGlobalSearchOpen,
    onOpenPlaceholder,
    onNavigate,
    onLogout,
    userProfile,
    clients,
    onSwitchClient,
    setActiveAccountTab
}: SidebarFooterProps) => {
    const { isDesktop } = useScreenSize();
    const [activePopover, setActivePopover] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<'client' | 'account' | 'create' | null>(null);
    const [metaKey, setMetaKey] = useState('Ctrl'); // Default

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

    const handleMenuClick = (menu: 'client' | 'account' | 'create') => {
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
    const handlePopoverEnter = (id: string) => {
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
    const getPopupClass = (id: string) => {
        const isActive = activePopover === id;
        return `absolute left-full bottom-0 ml-2 shadow-xl z-50 origin-bottom-left transition-all duration-200 ease-out transform ${isActive
            ? 'opacity-100 scale-100 translate-x-0 visible pointer-events-auto'
            : 'opacity-0 scale-95 -translate-x-2 invisible pointer-events-none'
            }`;
    };

    return (
        <div className="p-2 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 mt-auto space-y-1 shrink-0 transition-colors pb-4 lg:pb-2" onClick={(e) => e.stopPropagation()}>

            {/* Global Search Trigger */}
            <div className="relative mb-2">
                <button
                    data-tour="global-search-trigger"
                    onClick={() => setIsGlobalSearchOpen(true)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <Search size={18} />
                        <span className="text-sm font-medium">Search</span>
                    </div>
                    {isDesktop && (
                        <div className="hidden lg:flex items-center gap-1 text-[10px] text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                            {metaKey === 'Cmd' ? '⌘' : 'Ctrl'} K
                        </div>
                    )}
                </button>
            </div>

            {/* Create Dropdown */}
            <div className="relative" onMouseEnter={() => isDesktop && handlePopoverEnter('create')} onMouseLeave={() => isDesktop && handlePopoverLeave()}>
                <button
                    data-tour="nav-create-trigger"
                    onClick={() => handleMenuClick('create')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors ${activePopover === 'create' ? 'bg-slate-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400' : ''}`}
                >
                    <PlusCircle size={18} className={activePopover === 'create' ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"} />
                    <span className="text-sm font-medium">Create</span>
                </button>

                {/* Desktop Create Menu */}
                {isDesktop && (
                    <div className={`${getPopupClass('create')} w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg`}>
                        <CreateMenuContent
                            onCreateProfile={() => { setIsCreateProfileOpen(true); setActivePopover(null); }}
                            onCreateFolder={() => { setIsCreateFolderOpen(true); setActivePopover(null); }}
                            onOpenPlaceholder={(t, m) => { onOpenPlaceholder(t, m); setActivePopover(null); }}
                            closeMenu={() => setActivePopover(null)}
                        />
                    </div>
                )}
            </div>

            {/* Switch Client */}
            <div className="relative" onMouseEnter={() => isDesktop && handlePopoverEnter('client')} onMouseLeave={() => isDesktop && handlePopoverLeave()}>
                <button
                    data-tour="nav-client-switcher"
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors ${activePopover === 'client' ? 'bg-slate-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400' : ''}`}
                    onClick={() => handleMenuClick('client')}
                >
                    <Building2 size={18} className={activePopover === 'client' ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"} />
                    <span className="text-sm font-medium truncate" title={userProfile.activeClient}>{userProfile.activeClient}</span>
                </button>

                {/* Desktop Client List Popover */}
                {isDesktop && (
                    <div className={`${getPopupClass('client')} w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg`}>
                        <ClientMenuContent activeClient={userProfile.activeClient} clients={clients} onSwitchClient={handleClientSelect} onClose={() => setActivePopover(null)} />
                    </div>
                )}
            </div>

            {/* User Account */}
            <div className="relative pt-2" onMouseEnter={() => isDesktop && handlePopoverEnter('account')} onMouseLeave={() => isDesktop && handlePopoverLeave()}>
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
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">My Account</p>
                    </div>
                </button>

                {/* Desktop Account Popover */}
                {isDesktop && (
                    <div className={`${getPopupClass('account')} bottom-2 ml-4 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg`}>
                        <div className="absolute bottom-6 -left-2 w-4 h-4 bg-white dark:bg-slate-800 transform rotate-45 border-l border-b border-slate-200 dark:border-slate-700"></div>
                        <AccountMenuContent
                            setIsThemeSettingsOpen={setIsThemeSettingsOpen}
                            onNavigate={onNavigate}
                            onLogout={onLogout}
                            userProfile={userProfile}
                            closeMenu={() => setActivePopover(null)}
                            setActiveAccountTab={setActiveAccountTab}
                        />
                    </div>
                )}
            </div>

            {/* Mobile Modal Overlay */}
            {!isDesktop && mobileMenuOpen && (
                <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setMobileMenuOpen(null)}>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                        {mobileMenuOpen === 'create' && (
                            <CreateMenuContent
                                onCreateProfile={() => { setIsCreateProfileOpen(true); setMobileMenuOpen(null); }}
                                onCreateFolder={() => { setIsCreateFolderOpen(true); setMobileMenuOpen(null); }}
                                onOpenPlaceholder={(t, m) => { onOpenPlaceholder(t, m); setMobileMenuOpen(null); }}
                                closeMenu={() => setMobileMenuOpen(null)}
                            />
                        )}
                        {mobileMenuOpen === 'client' && <ClientMenuContent activeClient={userProfile.activeClient} clients={clients} onSwitchClient={handleClientSelect} onClose={() => setMobileMenuOpen(null)} />}
                        {mobileMenuOpen === 'account' && (
                            <AccountMenuContent
                                setIsThemeSettingsOpen={setIsThemeSettingsOpen}
                                closeMenu={() => setMobileMenuOpen(null)}
                                onNavigate={onNavigate}
                                onLogout={onLogout}
                                userProfile={userProfile}
                                setActiveAccountTab={setActiveAccountTab}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
