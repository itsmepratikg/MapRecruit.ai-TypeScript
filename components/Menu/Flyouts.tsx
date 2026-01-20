
import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    X, CheckCircle, UserPlus, Briefcase, FolderPlus, Tag, User,
    Settings, UserCog, Lock, Palette, LogOut, Search, ChevronRight, ChevronDown,
    Activity, History, Bell
} from '../Icons';
import { SIDEBAR_CAMPAIGN_DATA, GLOBAL_CAMPAIGNS } from '../../data';
import { PROFILES_CATEGORIES, SETTINGS_CATEGORIES, TALENT_CHAT_MENU } from './constants';
import { COLORS } from '../../data/profile';
import { Campaign } from '../../types';
import { campaignService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { HoverMenu } from '../Campaign/HoverMenu';

// --- Client Menu ---
export const ClientMenuContent = ({ activeClient, clients, onSwitchClient, onClose }: { activeClient: string, clients: any[], onSwitchClient: (client: string) => void, onClose: () => void }) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredClients = useMemo(() => {
        if (!searchQuery) return clients;
        const lowerQ = searchQuery.toLowerCase();
        return clients.filter(c => {
            const name = typeof c === 'string' ? c : c.clientName;
            return name.toLowerCase().includes(lowerQ);
        });
    }, [clients, searchQuery]);

    const groupedClients = useMemo(() => {
        const groups: Record<string, any[]> = {};

        filteredClients.forEach(client => {
            // Handle both string[] (legacy) and object[] (fetched)
            const clientName = typeof client === 'string' ? client : client.clientName;
            const clientType = typeof client === 'string' ? 'Client' : (client.clientType || 'Client');

            if (!groups[clientType]) {
                groups[clientType] = [];
            }
            groups[clientType].push({
                name: clientName,
                data: typeof client === 'object' ? client : null
            });
        });

        // Sort clients within groups
        Object.keys(groups).forEach(key => {
            groups[key].sort((a, b) => a.name.localeCompare(b.name));
        });

        return groups;
    }, [filteredClients]);

    // Order of groups: Client, Branch, Vendor, then others alphabetically
    const sortedGroupKeys = useMemo(() => {
        const keys = Object.keys(groupedClients);
        const priority = ['Branch', 'Client', 'Vendor'];
        return keys.sort((a, b) => {
            const idxA = priority.indexOf(a);
            const idxB = priority.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
        });
    }, [groupedClients]);

    return (
        <div className="flex flex-col h-full max-h-[400px]">
            <div className="flex justify-between items-center px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-t mb-0 shrink-0">
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("Switch Client")}</div>
                <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors lg:hidden"><X size={14} /></button>
            </div>

            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 shrink-0">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                        type="text"
                        placeholder={t("Search clients...")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-slate-200"
                        autoFocus
                    />
                </div>
            </div>

            <div className="p-1 space-y-1 overflow-y-auto custom-scrollbar flex-1">
                {sortedGroupKeys.map(group => (
                    <div key={group}>
                        {/* Only show header if there are multiple groups, or providing structure */}
                        {sortedGroupKeys.length > 0 && (
                            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-1">
                                {t(group)}
                            </div>
                        )}
                        {groupedClients[group].map((client: any) => (
                            <button
                                key={client.name}
                                onClick={() => onSwitchClient(client.name)}
                                className={`w-full text-left px-3 py-2 text-sm rounded flex items-center justify-between font-medium transition-colors duration-150 ${client.name === activeClient ? 'text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-700' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                            >
                                {client.name}
                                {client.name === activeClient && <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" />}
                            </button>
                        ))}
                    </div>
                ))}
                {filteredClients.length === 0 && <div className="px-3 py-2 text-sm text-slate-400 italic text-center">No clients found</div>}
            </div>
        </div>
    );
};

// --- Create Menu ---
export const CreateMenuContent = ({
    onCreateProfile,
    onCreateCampaign,
    onCreateFolder,
    onOpenPlaceholder,
    closeMenu
}: {
    onCreateProfile: () => void,
    onCreateCampaign: () => void,
    onCreateFolder: () => void,
    onOpenPlaceholder: (title: string, msg: string) => void,
    closeMenu?: () => void
}) => {
    const handleClick = (action: () => void) => {
        action();
        if (closeMenu) closeMenu();
    };
    const { t } = useTranslation();

    return (
        <div className="py-1 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 w-full relative">
            <div className="flex justify-between items-center px-3 py-2">
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("Create New")}</div>
                {closeMenu && <button onClick={(e) => { e.stopPropagation(); closeMenu(); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded lg:hidden"><X size={14} /></button>}
            </div>
            <button onClick={() => handleClick(onCreateProfile)} data-tour="create-menu-profile" className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors">
                <UserPlus size={16} className="text-emerald-600 dark:text-emerald-400" /> <span>{t("Profile")}</span>
            </button>
            <button onClick={() => handleClick(onCreateCampaign)} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors">
                <Briefcase size={16} className="text-blue-600 dark:text-blue-400" /> <span>{t("Campaign")}</span>
            </button>
            <button onClick={() => handleClick(onCreateFolder)} data-tour="create-menu-folder" className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors">
                <FolderPlus size={16} className="text-orange-600 dark:text-orange-400" /> <span>{t("Folder")}</span>
            </button>
            <button onClick={() => handleClick(() => onOpenPlaceholder('Create Tag', 'Global tag management and AI-suggested tagging features will be available in the next release.'))} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors">
                <Tag size={16} className="text-purple-600 dark:text-purple-400" /> <span>{t("Tag")}</span>
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
    const { t } = useTranslation();
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
                        if (onNavigate) onNavigate('/myaccount/basicdetails');
                        if (closeMenu) closeMenu();
                    }}
                    data-tour="nav-account-details"
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer group/item"
                >
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors">
                        <User size={16} /> <span className="font-medium">{t("My Account")}</span>
                    </div>
                </button>

                {/* New Added Items */}
                <button onClick={() => { if (onNavigate) onNavigate('/activities'); if (closeMenu) closeMenu(); }} data-tour="nav-activities" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                    <Activity size={16} /> {t("Activities")}
                </button>

                <button onClick={() => { if (onNavigate) onNavigate('/history'); if (closeMenu) closeMenu(); }} data-tour="nav-history" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                    <History size={16} /> {t("History")}
                </button>

                <button onClick={() => { if (onNavigate) onNavigate('/notifications'); if (closeMenu) closeMenu(); }} data-tour="nav-notifications" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                    <Bell size={16} /> {t("Notifications")}
                </button>

                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

                <button onClick={() => { if (onNavigate) onNavigate('/settings/CompanyInfo'); if (closeMenu) closeMenu(); }} data-tour="nav-admin-settings" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                    <Settings size={16} /> {t("Admin Settings")}
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                    <UserCog size={16} /> {t("Product Admin Settings")}
                </button>
                <button onClick={() => { if (onNavigate) onNavigate('/myaccount/authsync'); if (closeMenu) closeMenu(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                    <Lock size={16} /> {t("Change Password")}
                </button>

                <button onClick={() => { setIsThemeSettingsOpen(true); if (closeMenu) closeMenu(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                    <Palette size={16} /> {t("Themes")}
                </button>

                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                <button onClick={() => { onLogout(); if (closeMenu) closeMenu(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">
                    <LogOut size={16} /> {t("Logout")}
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
    onNavigateToCampaign: (campaign: any) => void,
    activeView: string,
    activeClient: string,
    onClose: () => void
}) => {
    const { t } = useTranslation();
    const [expandedClient, setExpandedClient] = useState<string>(activeClient);
    const [searchQuery, setSearchQuery] = useState('');
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [clientsMap, setClientsMap] = useState<Record<string, string>>({}); // Map ClientName -> Type
    const [counts, setCounts] = useState({ active: 0, closed: 0, archived: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setExpandedClient(activeClient);
    }, [activeClient]);

    useEffect(() => {
        const fetchSidebarData = async () => {
            try {
                setLoading(true);
                // Dynamically import clientService here to avoid circular dependencies if any
                const { clientService } = await import('../../services/clientService');

                // Fetch Stats
                const statsData = await campaignService.getStats();
                setCounts(statsData);

                // Fetch Clients to map Types
                const clientsData = await clientService.getAll();
                const typeMap: Record<string, string> = {};
                clientsData.forEach(c => {
                    typeMap[c.clientName] = c.clientType || 'Client';
                });
                setClientsMap(typeMap);

                // Fetch All Campaigns for the list
                const data = await campaignService.getAll();
                const activeOnes = data.filter((c: any) => {
                    const status = c.schemaConfig?.mainSchema?.status || (c.status === true || c.status === 'Active' ? 'Active' : 'Closed');
                    return status === 'Active';
                });
                setCampaigns(activeOnes);
            } catch (error) {
                console.error("Error fetching sidebar data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSidebarData();
    }, []);

    const groupedCampaigns = useMemo(() => {
        // 1. Group by CLIENT
        const byClient = campaigns.reduce((acc: any[], camp: any) => {
            const clientName = camp.migrationMeta?.clientName || "General";
            const existing = acc.find(c => c.name === clientName);
            const campData = {
                id: camp._id?.$oid || camp._id || camp.id,
                name: camp.schemaConfig?.mainSchema?.title || camp.title || t('Untitled'),
                jobId: camp.migrationMeta?.jobID || '---'
            };

            if (existing) {
                existing.campaigns.push(campData);
            } else {
                acc.push({
                    name: clientName,
                    type: clientsMap[clientName] || 'Client', // Use fetched type or default
                    campaigns: [campData]
                });
            }
            return acc;
        }, []);

        // 2. Filter by Search Query
        const filteredByClient = byClient.filter((c: any) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.campaigns.some((camp: any) => camp.name.toLowerCase().includes(searchQuery.toLowerCase()) || camp.jobId.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        // 3. Group by TYPE
        const byType: Record<string, any[]> = {};
        filteredByClient.forEach((clientGroup: any) => {
            const type = clientGroup.type;
            if (!byType[type]) byType[type] = [];
            byType[type].push(clientGroup);
        });

        // Sort clients within types
        Object.keys(byType).forEach(key => {
            byType[key].sort((a, b) => a.name.localeCompare(b.name));
        });

        return byType;
    }, [campaigns, clientsMap, searchQuery, t]);

    const sortedTypeKeys = useMemo(() => {
        const keys = Object.keys(groupedCampaigns);
        const priority = ['Branch', 'Client', 'Vendor'];
        return keys.sort((a, b) => {
            const idxA = priority.indexOf(a);
            const idxB = priority.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
        });
    }, [groupedCampaigns]);


    const handleNavigateToList = (e: React.MouseEvent, tab: string) => {
        e.stopPropagation();
        onNavigate(tab);
        onClose();
    };


    return (
        <div className="w-80 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Search Header */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                        type="text"
                        placeholder={t("Search campaigns...")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-slate-200"
                    />
                </div>
            </div>

            <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                <div className="mb-2">
                    <button onClick={(e) => handleNavigateToList(e, 'Active')} data-tour="nav-campaigns-active" className="w-full px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 rounded transition-colors group">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 uppercase tracking-wide">{t("Active Campaigns")}</span>
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full font-mono font-bold">{counts.active}</span>
                    </button>

                    <div className="pl-1 mt-1 space-y-1">
                        {loading ? (
                            <div className="px-3 py-2 text-xs text-slate-400 animate-pulse">{t("Loading...")}</div>
                        ) : sortedTypeKeys.map(type => (
                            <div key={type} className="mb-2">
                                {sortedTypeKeys.length > 0 && (
                                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-1 mb-1">
                                        {t(type)}
                                    </div>
                                )}

                                {groupedCampaigns[type].map((client: any) => {
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
                                                    {client.campaigns.map((camp: any) => (
                                                        <div key={camp.id} className="relative group/item">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onNavigateToCampaign(camp);
                                                                    onClose();
                                                                }}
                                                                className="w-full text-left px-3 py-1.5 text-[11px] text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded flex justify-between items-center transition-colors font-medium"
                                                            >
                                                                <span className="truncate flex-1" title={camp.name}>{camp.name}</span>
                                                                <span className="text-[9px] text-slate-400 group-hover/item:text-slate-500 opacity-0 group-hover/item:opacity-100 transition-opacity ml-2">{camp.jobId}</span>
                                                            </button>

                                                            <HoverMenu
                                                                campaign={{ ...camp, title: camp.name }}
                                                                onAction={(action) => {
                                                                    if (action === 'INTELLIGENCE') onNavigateToCampaign(camp);
                                                                    else {
                                                                        onNavigateToCampaign(camp);
                                                                    }
                                                                    onClose();
                                                                }}
                                                                position="right"
                                                            />
                                                        </div>
                                                    ))}
                                                    {client.campaigns.length === 0 && <div className="px-3 py-1 text-[10px] text-slate-400 italic">No campaigns found</div>}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                <button onClick={(e) => handleNavigateToList(e, 'Closed')} data-tour="nav-campaigns-closed" className="w-full px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 rounded transition-colors group">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 uppercase tracking-wide">Closed Campaigns</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full font-mono">{counts.closed}</span>
                </button>
                <button onClick={(e) => handleNavigateToList(e, 'Archived')} data-tour="nav-campaigns-archived" className="w-full px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 rounded transition-colors group">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 uppercase tracking-wide">Archived Campaigns</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full font-mono">{counts.archived}</span>
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
    const { t } = useTranslation();
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
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("Administration")}</span>
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
                                {t(category.label)}
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
                                                {t(item.label)}
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
    const { t } = useTranslation();
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
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("Profiles Module")}</span>
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
                                    {t(category.label)}
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
                                                    {t(item.label)}
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
    const { t } = useTranslation();
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
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("Talent Chat")}</span>
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
                                {t(item.label)}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
