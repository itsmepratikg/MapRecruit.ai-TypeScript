
import React, { useState, useMemo, useEffect } from 'react';
import {
    X, CheckCircle, UserPlus, Briefcase, FolderPlus, Tag, User,
    Settings, UserCog, Lock, Palette, LogOut, Search, ChevronRight, ChevronDown,
    Activity, History, Bell
} from '../Icons';
import { SIDEBAR_CAMPAIGN_DATA, GLOBAL_CAMPAIGNS } from '../../data';
import { PROFILES_CATEGORIES, SETTINGS_CATEGORIES, TALENT_CHAT_MENU } from './constants';
import { COLORS } from '../../data/profile';
import { Campaign } from '../../types';

// --- Client Menu ---
export const ClientMenuContent = ({ activeClient, clients, onSwitchClient, onClose }: { activeClient: string, clients: string[], onSwitchClient: (client: string) => void, onClose: () => void }) => (
    <>
        <div className="flex justify-between items-center px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-t mb-1">
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Switch Client</div>
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors lg:hidden"><X size={14} /></button>
        </div>
        <div className="p-1 space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
            {clients.map(client => (
                <button
                    key={client}
                    onClick={() => onSwitchClient(client)}
                    className={`w-full text-left px-3 py-2 text-sm rounded flex items-center justify-between font-medium transition-colors duration-150 ${client === activeClient ? 'text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-700' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                >
                    {client}
                    {client === activeClient && <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" />}
                </button>
            ))}
        </div>
    </>
);

// --- Create Menu ---
export const CreateMenuContent = ({
    onCreateProfile,
    onCreateFolder,
    onOpenPlaceholder,
    closeMenu
}: {
    onCreateProfile: () => void,
    onCreateFolder: () => void,
    onOpenPlaceholder: (title: string, msg: string) => void,
    closeMenu?: () => void
}) => {
    const handleClick = (action: () => void) => {
        action();
        if (closeMenu) closeMenu();
    };

    return (
        <div className="py-1 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 w-full relative">
            <div className="flex justify-between items-center px-3 py-2">
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Create New</div>
                {closeMenu && <button onClick={(e) => { e.stopPropagation(); closeMenu(); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded lg:hidden"><X size={14} /></button>}
            </div>
            <button onClick={() => handleClick(onCreateProfile)} data-tour="create-menu-profile" className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors">
                <UserPlus size={16} className="text-emerald-600 dark:text-emerald-400" /> <span>Profile</span>
            </button>
            <button onClick={() => handleClick(() => onOpenPlaceholder('Create Campaign', 'The Campaign creation wizard involves multiple steps including Job Description AI generation. We are working on this module.'))} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors">
                <Briefcase size={16} className="text-blue-600 dark:text-blue-400" /> <span>Campaign</span>
            </button>
            <button onClick={() => handleClick(onCreateFolder)} data-tour="create-menu-folder" className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors">
                <FolderPlus size={16} className="text-orange-600 dark:text-orange-400" /> <span>Folder</span>
            </button>
            <button onClick={() => handleClick(() => onOpenPlaceholder('Create Tag', 'Global tag management and AI-suggested tagging features will be available in the next release.'))} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors">
                <Tag size={16} className="text-purple-600 dark:text-purple-400" /> <span>Tag</span>
            </button>
        </div>
    );
};

// --- Account Menu ---
export const AccountMenuContent = ({
    setIsThemeSettingsOpen,
    closeMenu,
    onNavigate,
    onLogout,
    userProfile,
    setActiveAccountTab
}: {
    setIsThemeSettingsOpen: (v: boolean) => void,
    closeMenu?: () => void,
    onNavigate?: (view: any) => void,
    onLogout: () => void,
    userProfile: any,
    setActiveAccountTab?: (tab: string) => void
}) => {
    const userColorObj = COLORS.find(c => c.name === userProfile.color) || COLORS[0];

    return (
        <>
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex flex-col items-center text-center bg-white dark:bg-slate-800 rounded-t-lg relative">
                {closeMenu && (
                    <button onClick={(e) => { e.stopPropagation(); closeMenu(); }} className="absolute top-2 right-2 p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 rounded-full lg:hidden">
                        <X size={20} />
                    </button>
                )}
                <div className={`w-16 h-16 rounded-full overflow-hidden border-4 border-white dark:border-slate-600 shadow-md mb-3 flex items-center justify-center text-2xl font-bold ${!userProfile.avatar ? userColorObj.class : 'bg-slate-200'}`}>
                    {userProfile.avatar ? (
                        <img src={userProfile.avatar} alt="User" className="w-full h-full object-cover" />
                    ) : (
                        userProfile.firstName.charAt(0) + userProfile.lastName.charAt(0)
                    )}
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{userProfile.firstName}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{userProfile.email}</p>

                <div className="w-full border-t border-slate-100 dark:border-slate-700 pt-3 space-y-2">
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 px-2">
                        <User size={16} className="text-slate-400 dark:text-slate-500" />
                        <span className="font-medium">{userProfile.role}</span>
                    </div>
                </div>
            </div>

            <div className="py-2 bg-white dark:bg-slate-800 rounded-b-lg overflow-y-auto max-h-[600px] custom-scrollbar">
                <button
                    onClick={() => {
                        if (onNavigate) onNavigate('/account/BasicDetails');
                        if (closeMenu) closeMenu();
                    }}
                    data-tour="nav-account-details"
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer group/item"
                >
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors">
                        <User size={16} /> <span className="font-medium">My Account</span>
                    </div>
                </button>

                {/* New Added Items */}
                <button onClick={() => { if (onNavigate) onNavigate('/activities'); if (closeMenu) closeMenu(); }} data-tour="nav-activities" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                    <Activity size={16} /> Activities
                </button>

                <button onClick={() => { if (onNavigate) onNavigate('/history'); if (closeMenu) closeMenu(); }} data-tour="nav-history" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                    <History size={16} /> History
                </button>

                <button onClick={() => { if (onNavigate) onNavigate('/notifications'); if (closeMenu) closeMenu(); }} data-tour="nav-notifications" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                    <Bell size={16} /> Notifications
                </button>

                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

                <button onClick={() => { if (onNavigate) onNavigate('/settings/CompanyInfo'); if (closeMenu) closeMenu(); }} data-tour="nav-admin-settings" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                    <Settings size={16} /> Admin Settings
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                    <UserCog size={16} /> Product Admin Settings
                </button>
                <button onClick={() => { if (onNavigate) onNavigate('/account/AuthSync'); if (closeMenu) closeMenu(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                    <Lock size={16} /> Change Password
                </button>

                <button onClick={() => { setIsThemeSettingsOpen(true); if (closeMenu) closeMenu(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                    <Palette size={16} /> Themes
                </button>

                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                <button onClick={() => { onLogout(); if (closeMenu) closeMenu(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </>
    );
};

// --- Campaign Hover Menu ---
export const CampaignMenuContent = ({
    onNavigate,
    onNavigateToCampaign,
    activeView,
    activeClient,
    onClose
}: {
    onNavigate: (tab: string) => void,
    onNavigateToCampaign: (campaign: Campaign) => void,
    activeView: string,
    activeClient: string,
    onClose: () => void
}) => {
    const [expandedClient, setExpandedClient] = useState<string>(activeClient);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setExpandedClient(activeClient);
    }, [activeClient]);

    const filterClients = (clients: typeof SIDEBAR_CAMPAIGN_DATA.clients) => {
        if (!searchQuery) return clients;
        return clients.map(client => {
            const clientMatch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchedCampaigns = client.campaigns.filter(c =>
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.jobId.includes(searchQuery)
            );

            if (clientMatch || matchedCampaigns.length > 0) {
                return { ...client, campaigns: matchedCampaigns.length > 0 ? matchedCampaigns : client.campaigns };
            }
            return null;
        }).filter(Boolean) as typeof SIDEBAR_CAMPAIGN_DATA.clients;
    };

    const displayClients = filterClients(SIDEBAR_CAMPAIGN_DATA.clients);

    const handleNavigateToList = (e: React.MouseEvent, tab: string) => {
        e.stopPropagation();
        onNavigate(tab);
        onClose();
    };

    return (
        <div className="w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 flex flex-col max-h-[90vh]">
            <div className="p-3 border-b border-slate-100 dark:border-slate-700 shrink-0">
                <div className="flex items-center gap-2 mb-2 justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">Campaigns</span>
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded lg:hidden"><X size={14} /></button>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search active campaigns..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-slate-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                    <Search size={12} className="absolute left-2.5 top-2 text-slate-400" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-1 space-y-1">
                <div>
                    <button onClick={(e) => handleNavigateToList(e, 'Active')} data-tour="nav-campaigns-active" className="w-full px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 rounded transition-colors group">
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Active Campaigns</span>
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full font-mono font-bold">{SIDEBAR_CAMPAIGN_DATA.activeCount}</span>
                    </button>

                    <div className="pl-2 mt-1 space-y-1">
                        {displayClients.map(client => {
                            const isExpanded = expandedClient === client.name || searchQuery.length > 0;
                            return (
                                <div key={client.name} className="rounded overflow-hidden">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setExpandedClient(isExpanded ? '' : client.name); }}
                                        className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${isExpanded ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}
                                    >
                                        <ChevronRight size={12} className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                                        {client.name}
                                    </button>

                                    {isExpanded && (
                                        <div className="pl-6 space-y-0.5 mt-0.5 border-l border-slate-100 dark:border-slate-700 ml-4 mb-1">
                                            {client.campaigns.map(camp => (
                                                <button
                                                    key={camp.id}
                                                    onClick={(e) => { e.stopPropagation(); onNavigateToCampaign({ ...GLOBAL_CAMPAIGNS[0], id: camp.id, name: camp.name, jobID: camp.jobId }); onClose(); }}
                                                    className="w-full text-left px-3 py-1.5 text-[11px] text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded flex justify-between items-center group/item transition-colors"
                                                >
                                                    <span className="truncate flex-1" title={camp.name}>{camp.name}</span>
                                                    <span className="text-[9px] text-slate-400 group-hover/item:text-slate-500 opacity-0 group-hover/item:opacity-100 transition-opacity ml-2">{camp.jobId}</span>
                                                </button>
                                            ))}
                                            {client.campaigns.length === 0 && <div className="px-3 py-1 text-[10px] text-slate-400 italic">No campaigns found</div>}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                <button onClick={(e) => handleNavigateToList(e, 'Closed')} data-tour="nav-campaigns-closed" className="w-full px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 rounded transition-colors group">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 uppercase tracking-wide">Closed Campaigns</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full font-mono">{SIDEBAR_CAMPAIGN_DATA.closedCount}</span>
                </button>
                <button onClick={(e) => handleNavigateToList(e, 'Archived')} data-tour="nav-campaigns-archived" className="w-full px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 rounded transition-colors group">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 uppercase tracking-wide">Archived Campaigns</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full font-mono">{SIDEBAR_CAMPAIGN_DATA.archivedCount}</span>
                </button>
            </div>
        </div>
    );
};

// --- Settings Menu ---
export const SettingsMenuContent = ({
    onNavigate,
    activeTab,
    onClose
}: {
    onNavigate: (tabId: string) => void,
    activeTab: string,
    onClose: () => void
}) => {
    // Helper to map IDs to PascalCase paths (same as in Settings page)
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

    const initialCategory = useMemo(() => {
        // Need to reverse map activeTab path back to ID to open category?
        // Or just check if items' mapped path equals activeTab.
        const found = SETTINGS_CATEGORIES.find(cat => cat.items.some(item => getPath(item.id) === activeTab));
        return found ? found.id : SETTINGS_CATEGORIES[0].id;
    }, [activeTab]);

    const [openCategory, setOpenCategory] = useState<string>(initialCategory);

    return (
        <div className="w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 flex flex-col max-h-[80vh] overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 shrink-0 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Administration</span>
                <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors lg:hidden"><X size={14} /></button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                {SETTINGS_CATEGORIES.map(category => {
                    const isOpen = openCategory === category.id;
                    return (
                        <div key={category.id} className="mb-1 last:mb-0">
                            <button
                                onClick={(e) => { e.stopPropagation(); setOpenCategory(isOpen ? '' : category.id); }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-md transition-colors ${isOpen ? 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                {category.label}
                                <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isOpen && (
                                <div className="mt-1 space-y-0.5 animate-in slide-in-from-top-1 duration-200">
                                    {category.items.map(item => {
                                        const path = getPath(item.id);
                                        const tourId =
                                            item.id === 'CLIENTS' ? 'nav-settings-clients' :
                                                item.id === 'USERS' ? 'nav-settings-users' :
                                                    item.id === 'COMPANY_INFO' ? 'nav-settings-company' : undefined;

                                        return (
                                            <button
                                                key={item.id}
                                                onClick={(e) => { e.stopPropagation(); onNavigate(path); onClose(); }}
                                                data-tour={tourId}
                                                className={`w-full text-left pl-6 pr-3 py-2 text-xs flex items-center gap-2 transition-colors rounded-md ${activeTab === path ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                                            >
                                                <item.icon size={14} className={activeTab === path ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"} />
                                                {item.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Profiles Menu ---
export const ProfilesMenuContent = ({ onNavigate, onClose, activeView }: { onNavigate: (view: string) => void, onClose: () => void, activeView: string }) => {
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

    const initialCategory = useMemo(() => {
        const found = PROFILES_CATEGORIES.find(cat => cat.items.some(item => item.id === activeView));
        return found ? found.id : PROFILES_CATEGORIES[0].id;
    }, [activeView]);

    const [openCategory, setOpenCategory] = useState<string>(initialCategory);

    return (
        <div className="w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 flex flex-col max-h-[80vh] overflow-hidden">
            <div className="py-1">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-1 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Profiles Module</span>
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors lg:hidden"><X size={14} /></button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                    {PROFILES_CATEGORIES.map(category => {
                        const isOpen = openCategory === category.id;
                        return (
                            <div key={category.id} className="mb-1 last:mb-0">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setOpenCategory(isOpen ? '' : category.id); }}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-md transition-colors ${isOpen ? 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'}`}
                                >
                                    {category.label}
                                    <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isOpen && (
                                    <div className="mt-1 space-y-0.5 animate-in slide-in-from-top-1 duration-200">
                                        {category.items.map(item => {
                                            const path = getPath(item.id);
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={(e) => { e.stopPropagation(); onNavigate(`/profiles/view/${path}`); onClose(); }}
                                                    className={`w-full text-left pl-6 pr-3 py-2 text-xs flex items-center gap-2 transition-colors rounded-md ${activeView === item.id ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                                                >
                                                    <item.icon size={14} className={activeView === item.id ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"} />
                                                    {item.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// --- Talent Chat Menu ---
export const TalentChatMenuContent = ({
    onNavigate,
    onClose,
    activeTab
}: {
    onNavigate: (tab: string) => void,
    onClose: () => void,
    activeTab: string
}) => {
    const getPath = (id: string) => {
        const map: Record<string, string> = {
            'CONVERSATIONS': 'Conversations',
            'KEYWORDS': 'Keywords',
            'SCHEDULES': 'Schedules',
            'ANALYTICS': 'Analytics',
        };
        return map[id] || id;
    };

    return (
        <div className="w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 flex flex-col max-h-[80vh] overflow-hidden">
            <div className="py-1">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-1 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Talent Chat</span>
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors lg:hidden"><X size={14} /></button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                    {TALENT_CHAT_MENU.map(item => {
                        const path = getPath(item.id);
                        return (
                            <button
                                key={item.id}
                                onClick={(e) => { e.stopPropagation(); onNavigate(`/talent-chat/${path}`); onClose(); }}
                                className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 transition-colors rounded-md ${activeTab === item.id ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                            >
                                <item.icon size={14} className={activeTab === item.id ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"} />
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
