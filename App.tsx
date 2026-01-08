
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  LayoutDashboard, Users, Briefcase, BarChart2, 
  Settings, LogOut, UserPlus, Building2, CheckCircle, 
  User, Phone, UserCog, Lock, Menu, X, ChevronRight,
  Brain, Search, GitBranch, MessageCircle, ThumbsUp, ChevronLeft,
  FileText, Activity, Video, Copy, ClipboardList, FolderOpen,
  Palette, PlusCircle, Shield, CreditCard, Mail, Database, 
  SlidersHorizontal, Tag, Layout, MessageSquare, HelpCircle, LogOut as LogoutIcon, Link as LinkIcon,
  Calendar, Clock, FolderPlus, Share2, Heart, MapPin, ChevronDown
} from './components/Icons';
import { ToastProvider, useToast } from './components/Toast';
import { Home } from './pages/Home';
import { Profiles } from './pages/Profiles/index'; 
import { Campaigns } from './pages/Campaigns';
import { Metrics } from './pages/Metrics';
import { CandidateProfile } from './pages/CandidateProfile';
import { CampaignDashboard } from './pages/Campaign/index'; 
import { SettingsPage } from './pages/Settings/index';
import { MyAccount } from './pages/MyAccount/index'; 
import { Login } from './pages/Login/index';
import { Campaign } from './types';
import { CreateProfileModal } from './components/CreateProfileModal';
import { CreateFolderModal } from './pages/Profiles/FoldersMetrics/CreateFolderModal';
import { PlaceholderModal } from './components/PlaceholderModal';
import { useScreenSize } from './hooks/useScreenSize';
import { ThemeSettingsModal } from './components/ThemeSettingsModal';
import { useUserPreferences } from './hooks/useUserPreferences';
import { useUserProfile } from './hooks/useUserProfile';
import { COLORS } from './data/profile';
import { SIDEBAR_CAMPAIGN_DATA, GLOBAL_CAMPAIGNS } from './data';

// --- Reusable Menu Contents ---

const ClientMenuContent = ({ activeClient, clients }: { activeClient: string, clients: string[] }) => (
  <>
    <div className="px-3 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900 rounded-t mb-1">Switch Client</div>
    <div className="p-1 space-y-1">
        {clients.map(client => (
            <button key={client} className={`w-full text-left px-3 py-2 text-sm rounded flex items-center justify-between font-medium ${client === activeClient ? 'text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-700' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400'}`}>
                {client}
                {client === activeClient && <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400"/>}
            </button>
        ))}
    </div>
  </>
);

const CreateMenuContent = ({ 
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
        <div className="py-1 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 w-full">
            <div className="px-3 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Create New</div>
            <button 
                onClick={() => handleClick(onCreateProfile)}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors"
            >
                <UserPlus size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>Profile</span>
            </button>
            <button 
                onClick={() => handleClick(() => onOpenPlaceholder('Create Campaign', 'The Campaign creation wizard involves multiple steps including Job Description AI generation. We are working on this module.'))}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors"
            >
                <Briefcase size={16} className="text-blue-600 dark:text-blue-400" />
                <span>Campaign</span>
            </button>
            <button 
                onClick={() => handleClick(onCreateFolder)}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors"
            >
                <FolderPlus size={16} className="text-orange-600 dark:text-orange-400" />
                <span>Folder</span>
            </button>
            <button 
                onClick={() => handleClick(() => onOpenPlaceholder('Create Tag', 'Global tag management and AI-suggested tagging features will be available in the next release.'))}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors"
            >
                <Tag size={16} className="text-purple-600 dark:text-purple-400" />
                <span>Tag</span>
            </button>
        </div>
    );
};

const AccountMenuContent = ({ 
    setIsThemeSettingsOpen,
    closeMenu,
    onNavigate,
    onLogout,
    userProfile
}: { 
    setIsThemeSettingsOpen: (v: boolean) => void,
    closeMenu?: () => void,
    onNavigate?: (view: any) => void,
    onLogout: () => void,
    userProfile: any
}) => {
    const userColorObj = COLORS.find(c => c.name === userProfile.color) || COLORS[0];
    
    return (
      <>
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex flex-col items-center text-center bg-white dark:bg-slate-800 rounded-t-lg relative">
            {closeMenu && (
                <button onClick={closeMenu} className="absolute top-2 right-2 p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full lg:hidden">
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
                    <User size={16} className="text-slate-400 dark:text-slate-500"/> 
                    <span className="font-medium">{userProfile.role}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 px-2">
                    <Phone size={16} className="text-slate-400 dark:text-slate-500"/> 
                    <span className="font-mono text-xs">{userProfile.phone}</span>
                </div>
            </div>
        </div>
        
        <div className="py-2 bg-white dark:bg-slate-800 rounded-b-lg">
            <button 
                onClick={() => {
                    if(onNavigate) onNavigate('MY_ACCOUNT');
                    if(closeMenu) closeMenu();
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer group/item"
            >
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors">
                    <User size={16} /> 
                    <span className="font-medium">My Account</span>
                </div>
            </button>

            <button 
                onClick={() => {
                    if(onNavigate) onNavigate('SETTINGS');
                    if(closeMenu) closeMenu();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
            >
                <Settings size={16} /> Admin Settings
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                <UserCog size={16} /> Product Admin Settings
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                <Lock size={16} /> Change Password
            </button>

            <button 
                onClick={() => setIsThemeSettingsOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
            >
                <Palette size={16} /> Themes
            </button>
            <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
            <button 
                onClick={() => { onLogout(); if(closeMenu) closeMenu(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
            >
                <LogoutIcon size={16} /> Logout
            </button>
        </div>
      </>
    );
};

// Sidebar Footer Component
const SidebarFooter = ({ 
  setIsCreateProfileOpen,
  setIsCreateFolderOpen,
  setIsThemeSettingsOpen,
  onOpenPlaceholder,
  onNavigate,
  onLogout,
  userProfile,
  clients
}: { 
  setIsCreateProfileOpen: (v: boolean) => void,
  setIsCreateFolderOpen: (v: boolean) => void,
  setIsThemeSettingsOpen: (v: boolean) => void,
  onOpenPlaceholder: (title: string, msg: string) => void,
  onNavigate: (view: ViewState) => void,
  onLogout: () => void,
  userProfile: any,
  clients: string[]
}) => {
    const { isDesktop } = useScreenSize();
    const [mobileMenuOpen, setMobileMenuOpen] = useState<'client' | 'account' | 'create' | null>(null);
    
    const userColorObj = COLORS.find(c => c.name === userProfile.color) || COLORS[0];

    const handleMenuClick = (menu: 'client' | 'account' | 'create') => {
        if (!isDesktop) {
            setMobileMenuOpen(menu);
        }
    };

    return (
        <div className="p-2 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 mt-auto space-y-1 shrink-0 transition-colors pb-4 lg:pb-2" onClick={(e) => e.stopPropagation()}>
            {/* Create Dropdown */}
            <div className="relative group/create">
                <button 
                    onClick={() => handleMenuClick('create')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors group"
                >
                    <PlusCircle size={18} className="text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                    <span className="text-sm font-medium">Create</span>
                </button>

                {/* Desktop Create Menu - Hover */}
                {isDesktop && (
                    <div className="hidden group-hover/create:block absolute left-full bottom-0 ml-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                        <CreateMenuContent 
                            onCreateProfile={() => setIsCreateProfileOpen(true)}
                            onCreateFolder={() => setIsCreateFolderOpen(true)}
                            onOpenPlaceholder={onOpenPlaceholder}
                        />
                    </div>
                )}
            </div>
    
            {/* Switch Client */}
            <div className="relative group/client">
                <button 
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors group"
                    onClick={() => handleMenuClick('client')}
                >
                    <Building2 size={18} className="text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                    <span className="text-sm font-medium truncate">{userProfile.activeClient}</span>
                </button>
                
                {/* Desktop Client List Popover - Hover */}
                {isDesktop && (
                    <div className="hidden group-hover/client:block absolute left-full bottom-0 ml-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                        <ClientMenuContent activeClient={userProfile.activeClient} clients={clients} />
                    </div>
                )}
            </div>
    
            {/* User Account */}
            <div className="relative group/account pt-2">
                <button 
                    className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
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
    
                {/* Desktop Account Popover - Hover */}
                {isDesktop && (
                    <div className="hidden group-hover/account:block absolute left-full bottom-0 ml-4 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="absolute bottom-6 -left-2 w-4 h-4 bg-white dark:bg-slate-800 transform rotate-45 border-l border-b border-slate-200 dark:border-slate-700"></div>
                        <AccountMenuContent 
                            setIsThemeSettingsOpen={setIsThemeSettingsOpen}
                            onNavigate={onNavigate} 
                            onLogout={onLogout}
                            userProfile={userProfile}
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
                        {mobileMenuOpen === 'client' && <ClientMenuContent activeClient={userProfile.activeClient} clients={clients} />}
                        {mobileMenuOpen === 'account' && (
                            <AccountMenuContent 
                                setIsThemeSettingsOpen={setIsThemeSettingsOpen} 
                                closeMenu={() => setMobileMenuOpen(null)}
                                onNavigate={onNavigate}
                                onLogout={onLogout}
                                userProfile={userProfile}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

type ViewState = 'DASHBOARD' | 'PROFILES' | 'CAMPAIGNS' | 'METRICS' | 'SETTINGS' | 'MY_ACCOUNT';

const PROFILE_TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'campaigns', label: 'Campaigns', icon: Briefcase },
  { id: 'folders', label: 'Folders', icon: FolderOpen },
  { id: 'interviews', label: 'Interviews', icon: Video },
  { id: 'recommended', label: 'Recommended', icon: ThumbsUp },
  { id: 'similar', label: 'Similar', icon: Copy },
];

const SETTINGS_SUBMENU = [
  { id: 'COMPANY_INFO', label: 'Company Info', icon: Building2 },
  { id: 'ROLES', label: 'Roles', icon: Shield },
  { id: 'USERS', label: 'Users', icon: Users },
  { id: 'CLIENTS', label: 'Clients', icon: Briefcase },
  { id: 'THEMES', label: 'Themes', icon: Palette },
  { id: 'CUSTOM_FIELD', label: 'Custom Field', icon: FileText },
  { id: 'TAGS', label: 'Tags', icon: Tag },
  { id: 'TEAMS', label: 'Teams', icon: Users },
  { id: 'COMMUNICATION', label: 'Communication', icon: MessageSquare },
  { id: 'AUTHENTICATION', label: 'Authentication', icon: Lock },
  { id: 'SOURCE_AI', label: 'Source AI', icon: Search },
  { id: 'API_CREDITS', label: 'API Credits', icon: CreditCard },
  { id: 'COMM_TEMPLATES', label: 'Communication Templates', icon: Mail },
  { id: 'ENGAGE_WORKFLOW', label: 'EngageAI Workflow', icon: GitBranch },
  { id: 'QUESTIONNAIRE', label: 'Questionnaire', icon: ClipboardList },
  { id: 'PROFILE_SOURCES', label: 'Profile Sources', icon: Database },
  { id: 'MRI_PREFERENCE', label: 'MRI Preference', icon: SlidersHorizontal },
  { id: 'REACHOUT_LAYOUTS', label: 'ReachOut Layouts', icon: Layout },
];

const MY_ACCOUNT_MENU = [
    { id: 'BASIC_DETAILS', label: 'Basic Details', icon: User },
    { id: 'COMM_PREFS', label: 'Communication', icon: MessageSquare },
    { id: 'USER_PREFS', label: 'Appearance', icon: SlidersHorizontal },
    { id: 'CALENDAR', label: 'Calendar', icon: Calendar },
    { id: 'ROLES_PERMISSIONS', label: 'Roles & Permissions', icon: Shield },
    { id: 'AUTH_SYNC', label: 'Password & Authentication', icon: Lock },
    { id: 'LAST_LOGIN', label: 'Last Login Sessions', icon: Clock },
];

const PROFILE_SUBMENU = [
  { id: 'SEARCH', label: 'Search Profiles', icon: Search },
  { id: 'SHARED', label: 'Shared Profiles', icon: Share2 },
  { id: 'FAVORITES', label: 'Favorite Profiles', icon: Heart },
  { id: 'DUPLICATES', label: 'Duplicate Profiles', icon: Copy },
  { id: 'LOCAL', label: 'New Local Profiles', icon: MapPin },
  { id: 'FOLDERS', label: 'Folder Metrics', icon: FolderOpen },
  { id: 'TAGS', label: 'Tags', icon: Tag },
];

// Campaign Menu Components
const CampaignMenuContent = ({ 
    onNavigate, 
    onNavigateToCampaign,
    activeView
}: { 
    onNavigate: (tab: string) => void,
    onNavigateToCampaign: (campaign: Campaign) => void,
    activeView: ViewState
}) => {
    const [expandedClient, setExpandedClient] = useState<string>('TRC Talent Solutions');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter Logic
    const filterClients = (clients: typeof SIDEBAR_CAMPAIGN_DATA.clients) => {
        if (!searchQuery) return clients;
        
        return clients.map(client => {
            // Check if client name matches OR if any campaign matches
            const clientMatch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchedCampaigns = client.campaigns.filter(c => 
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                c.jobId.includes(searchQuery)
            );
            
            if (clientMatch || matchedCampaigns.length > 0) {
                return {
                    ...client,
                    campaigns: matchedCampaigns.length > 0 ? matchedCampaigns : client.campaigns
                };
            }
            return null;
        }).filter(Boolean) as typeof SIDEBAR_CAMPAIGN_DATA.clients;
    };

    const displayClients = filterClients(SIDEBAR_CAMPAIGN_DATA.clients);

    const handleNavigateToList = (e: React.MouseEvent, tab: string) => {
        e.stopPropagation();
        onNavigate(tab);
    };

    return (
        <div className="absolute left-full top-0 ml-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Search */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-700 shrink-0">
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
                {/* Active Campaigns Section */}
                <div>
                    <button 
                        onClick={(e) => handleNavigateToList(e, 'Active')}
                        className="w-full px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 rounded transition-colors group"
                    >
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Active Campaigns</span>
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full font-mono font-bold">{SIDEBAR_CAMPAIGN_DATA.activeCount}</span>
                    </button>
                    
                    <div className="pl-2 mt-1 space-y-1">
                        {displayClients.map(client => {
                            // Expand if searched or if matches state
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
                                                    onClick={(e) => { e.stopPropagation(); onNavigateToCampaign({ ...GLOBAL_CAMPAIGNS[0], id: camp.id, name: camp.name, jobID: camp.jobId }); }} // Mapping mock minimal data to full structure for demo
                                                    className="w-full text-left px-3 py-1.5 text-[11px] text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded flex justify-between items-center group/item transition-colors"
                                                >
                                                    <span className="truncate flex-1" title={camp.name}>{camp.name}</span>
                                                    <span className="text-[9px] text-slate-400 group-hover/item:text-slate-500 opacity-0 group-hover/item:opacity-100 transition-opacity ml-2">{camp.jobId}</span>
                                                </button>
                                            ))}
                                            {client.campaigns.length === 0 && (
                                                <div className="px-3 py-1 text-[10px] text-slate-400 italic">No campaigns found</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {displayClients.length === 0 && (
                            <div className="px-4 py-2 text-xs text-slate-400">No clients match your search.</div>
                        )}
                    </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

                {/* Closed Campaigns */}
                <button 
                    onClick={(e) => handleNavigateToList(e, 'Closed')}
                    className="w-full px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 rounded transition-colors group"
                >
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 uppercase tracking-wide">Closed Campaigns</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full font-mono">{SIDEBAR_CAMPAIGN_DATA.closedCount}</span>
                </button>

                {/* Archived Campaigns */}
                <button 
                    onClick={(e) => handleNavigateToList(e, 'Archived')}
                    className="w-full px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 rounded transition-colors group"
                >
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 uppercase tracking-wide">Archived Campaigns</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full font-mono">{SIDEBAR_CAMPAIGN_DATA.archivedCount}</span>
                </button>
            </div>
        </div>
    );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<ViewState>('DASHBOARD');
  
  // Use custom hook for screen size detection
  const { width: windowWidth, isDesktop } = useScreenSize();
  
  // Hook for User Preferences (Theme & Dashboard)
  const { theme, updateTheme } = useUserPreferences();
  
  // Hook for User Profile Data (Synchronized)
  const { userProfile, clients } = useUserProfile();
  
  // Navigation State
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState('profile');
  const [activeProfileSubView, setActiveProfileSubView] = useState<'SEARCH' | 'FOLDERS' | 'TAGS' | 'SHARED' | 'FAVORITES' | 'DUPLICATES' | 'LOCAL'>('SEARCH');
  
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [activeCampaignTab, setActiveCampaignTab] = useState<string>('Intelligence');
  const [targetCampaignTab, setTargetCampaignTab] = useState<string>('Active'); // Default to Active list
  
  const [activeSettingsTab, setActiveSettingsTab] = useState('COMPANY_INFO');
  const [activeAccountTab, setActiveAccountTab] = useState('BASIC_DETAILS'); 

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isThemeSettingsOpen, setIsThemeSettingsOpen] = useState(false);
  
  // Placeholder Modal State
  const [placeholderConfig, setPlaceholderConfig] = useState<{isOpen: boolean, title: string, message: string}>({
      isOpen: false,
      title: '',
      message: ''
  });

  // Check Authentication on Mount
  useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (token) {
          setIsAuthenticated(true);
      }
  }, []);

  const handleLogin = () => {
      setIsAuthenticated(true);
  };

  const handleLogout = () => {
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      // Reset view states
      setActiveView('DASHBOARD');
      setSelectedCandidateId(null);
      setSelectedCampaign(null);
  };

  const openPlaceholder = (title: string, message: string) => {
      setPlaceholderConfig({ isOpen: true, title, message });
  };

  // Sub-navigation handlers
  const handleNavigateToProfile = () => {
    setSelectedCandidateId('1');
    setActiveProfileTab('profile');
  };
  const handleBackToProfiles = () => setSelectedCandidateId(null);
  
  const handleNavigateToCampaign = (campaign: Campaign, tab: string = 'Intelligence') => {
    setSelectedCampaign(campaign);
    setActiveCampaignTab(tab);
    // When navigating to a specific campaign, we ensure we are in CAMPAIGNS view
    setActiveView('CAMPAIGNS');
    // Mobile sidebar handling
    if (!isDesktop) setIsSidebarOpen(false);
  };
  const handleBackToCampaigns = () => setSelectedCampaign(null);

  const handleNavigateToCampaignList = (tab: string) => {
      setTargetCampaignTab(tab);
      setActiveView('CAMPAIGNS');
      setSelectedCampaign(null); // Ensure we are on list view
      if (!isDesktop) setIsSidebarOpen(false);
  };

  const handleProfileSubmenuClick = (id: string) => {
      setActiveView('PROFILES');
      setActiveProfileSubView(id as any);
      if (!isDesktop) setIsSidebarOpen(false);
  }

  // Logic for mobile collapsed state
  const isCollapsed = !isDesktop && !isSidebarOpen; 

  // Using 100 shade for selected background instead of 50 for better visibility
  const NavItem: React.FC<{ view?: ViewState, icon: any, label: string, activeTab?: boolean, onClick?: () => void }> = ({ view, icon: Icon, label, activeTab, onClick }) => (
    <button 
      onClick={onClick ? onClick : () => { if(view) setActiveView(view); setSelectedCandidateId(null); setSelectedCampaign(null); if (!isDesktop) setIsSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
        (view && activeView === view && !selectedCampaign && !selectedCandidateId) || activeTab 
          ? 'bg-emerald-100 text-emerald-900 font-bold shadow-sm' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
      } ${isCollapsed ? 'justify-center' : ''}`}
      title={isCollapsed ? label : ''}
    >
      <Icon size={20} className={(view && activeView === view && !selectedCampaign && !selectedCandidateId) || activeTab ? 'text-emerald-700' : 'text-slate-400 dark:text-slate-500'} />
      <span className={isCollapsed ? 'hidden' : 'block'}>{label}</span>
    </button>
  );

  return (
    <ToastProvider>
      {!isAuthenticated ? (
          <Login onLogin={handleLogin} />
      ) : (
          <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors">
            
            {/* Mobile Sidebar Overlay - Only when fully open */}
            {isSidebarOpen && !isDesktop && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transform transition-all duration-300 ease-in-out flex flex-col shadow-xl 
                ${isDesktop 
                    ? 'w-64 relative translate-x-0' // Desktop: Always expanded
                    : (isSidebarOpen 
                        ? 'w-64 translate-x-0 shadow-2xl' // Mobile Open: Expanded Overlay
                        : 'w-16 translate-x-0' // Mobile Closed: Mini Sidebar
                      )
                }
            `}>
               <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} border-b border-slate-200 dark:border-slate-700 shrink-0 bg-white dark:bg-slate-900 transition-all duration-300`}>
                  {isCollapsed ? (
                      // Mobile Mini Header: Just a Menu Button to expand
                      <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-500 hover:text-emerald-600 transition-colors">
                          <Menu size={24} />
                      </button>
                  ) : (
                      // Full Header
                      <>
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm shrink-0">M</div>
                        <span className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight ml-3">MapRecruit</span>
                        
                        {/* Mobile Close Button */}
                        {!isDesktop && (
                            <button onClick={() => setIsSidebarOpen(false)} className="ml-auto text-slate-400 hover:text-slate-600"><X size={20}/></button>
                        )}
                      </>
                  )}
               </div>

               <div className={`flex-1 ${!activeView.startsWith('PROFILES') && !activeView.startsWith('SETTINGS') ? 'overflow-visible' : 'overflow-y-auto'} py-4 ${isCollapsed ? 'px-2' : 'px-3'} space-y-1`}>
                  {!selectedCampaign && !selectedCandidateId && activeView !== 'MY_ACCOUNT' && activeView !== 'PROFILES' && activeView !== 'SETTINGS' ? (
                    <>
                      <NavItem view="DASHBOARD" icon={LayoutDashboard} label="Dashboard" />
                      
                      {/* Campaign Fly-out Menu Item */}
                      <div className="relative group/campaigns">
                        <button 
                            onClick={() => handleNavigateToCampaignList('Active')}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${activeView === 'CAMPAIGNS' ? 'bg-emerald-100 text-emerald-900 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Briefcase size={20} className={activeView === 'CAMPAIGNS' ? 'text-emerald-700' : 'text-slate-400 dark:text-slate-500'} />
                                <span className={isCollapsed ? 'hidden' : 'block'}>Campaigns</span>
                            </div>
                            {!isCollapsed && <ChevronRight size={16} className={`transition-transform`} />}
                        </button>

                        {/* Desktop Flyout Content */}
                        {isDesktop && (
                            <div className="hidden group-hover/campaigns:block">
                                <CampaignMenuContent 
                                    onNavigate={handleNavigateToCampaignList}
                                    onNavigateToCampaign={handleNavigateToCampaign}
                                    activeView={activeView}
                                />
                            </div>
                        )}
                      </div>
                      
                      {/* Main Sidebar Profile Item with Hover Menu */}
                      <div className="relative group/profile">
                        <button 
                            onClick={() => {
                                setActiveView('PROFILES');
                                setActiveProfileSubView('SEARCH');
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200`}
                        >
                            <div className="flex items-center gap-3">
                                <Users size={20} className='text-slate-400 dark:text-slate-500' />
                                <span className={isCollapsed ? 'hidden' : 'block'}>Profiles</span>
                            </div>
                            {!isCollapsed && <ChevronRight size={16} className={`transition-transform`} />}
                        </button>

                        {/* Desktop Hover Flyout */}
                        {isDesktop && (
                            <div className="hidden group-hover/profile:block absolute left-full top-0 ml-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto">
                                <div className="py-1">
                                    <div className="px-3 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 mb-1">
                                        Profiles Module
                                    </div>
                                    {PROFILE_SUBMENU.map(item => (
                                        <button 
                                            key={item.id}
                                            onClick={(e) => { e.stopPropagation(); setActiveView('PROFILES'); setActiveProfileSubView(item.id as any); }}
                                            className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                                        >
                                            <item.icon size={16} className="text-slate-400" />
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                      </div>

                      <NavItem view="METRICS" icon={BarChart2} label="Metrics" />
                      
                      {/* Main Sidebar Settings Item with Hover Menu */}
                      <div className="relative group/settings">
                        <button 
                            onClick={() => {
                                setActiveView('SETTINGS');
                                setActiveSettingsTab('COMPANY_INFO');
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200`}
                        >
                            <div className="flex items-center gap-3">
                                <Settings size={20} className='text-slate-400 dark:text-slate-500' />
                                <span className={isCollapsed ? 'hidden' : 'block'}>Settings</span>
                            </div>
                            {!isCollapsed && <ChevronRight size={16} className={`transition-transform`} />}
                        </button>

                        {/* Desktop Hover Flyout */}
                        {isDesktop && (
                            <div className="hidden group-hover/settings:block absolute left-full top-0 ml-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto custom-scrollbar">
                                <div className="py-1">
                                    <div className="px-3 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 mb-1">
                                        Administration
                                    </div>
                                    {SETTINGS_SUBMENU.map(item => (
                                        <button 
                                            key={item.id}
                                            onClick={(e) => { e.stopPropagation(); setActiveView('SETTINGS'); setActiveSettingsTab(item.id); }}
                                            className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                                        >
                                            <item.icon size={16} className="text-slate-400" />
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                      </div>
                    </>
                  ) : activeView === 'PROFILES' && !selectedCandidateId ? (
                    // PROFILE MODULE DRILL-DOWN SIDEBAR
                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                      <button 
                        onClick={() => setActiveView('DASHBOARD')}
                        className={`w-full flex items-center gap-2 px-3 py-2 mb-4 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                        title="Back to Dashboard"
                      >
                        <ChevronLeft size={14} /> <span className={isCollapsed ? 'hidden' : 'inline'}>Back to Dashboard</span>
                      </button>
                      
                      <div className={`px-3 mb-6 ${isCollapsed ? 'hidden' : 'block'}`}>
                        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">Profiles Module</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage Candidates & Talent Pools</p>
                      </div>

                      <div className="space-y-1">
                        {PROFILE_SUBMENU.map(item => (
                            <NavItem 
                                key={item.id}
                                icon={item.icon} 
                                label={item.label} 
                                activeTab={activeProfileSubView === item.id} 
                                onClick={() => { setActiveProfileSubView(item.id as any); if (!isDesktop) setIsSidebarOpen(false); }}
                            />
                        ))}
                      </div>
                    </div>
                  ) : activeView === 'SETTINGS' ? (
                    // SETTINGS MODULE DRILL-DOWN SIDEBAR
                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                      <button 
                        onClick={() => setActiveView('DASHBOARD')}
                        className={`w-full flex items-center gap-2 px-3 py-2 mb-4 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                        title="Back to Dashboard"
                      >
                        <ChevronLeft size={14} /> <span className={isCollapsed ? 'hidden' : 'inline'}>Back to Dashboard</span>
                      </button>
                      
                      <div className={`px-3 mb-6 ${isCollapsed ? 'hidden' : 'block'}`}>
                        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">System Settings</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure your workspace</p>
                      </div>

                      <div className="space-y-1">
                        {SETTINGS_SUBMENU.map(item => (
                            <NavItem 
                                key={item.id}
                                icon={item.icon} 
                                label={item.label} 
                                activeTab={activeSettingsTab === item.id} 
                                onClick={() => { setActiveSettingsTab(item.id); if (!isDesktop) setIsSidebarOpen(false); }}
                            />
                        ))}
                      </div>
                    </div>
                  ) : activeView === 'MY_ACCOUNT' ? (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                      <button 
                        onClick={() => setActiveView('DASHBOARD')}
                        className={`w-full flex items-center gap-2 px-3 py-2 mb-4 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                        title="Back to Dashboard"
                      >
                        <ChevronLeft size={14} /> <span className={isCollapsed ? 'hidden' : 'inline'}>Back to Dashboard</span>
                      </button>
                      
                      <div className={`px-3 mb-6 ${isCollapsed ? 'hidden' : 'block'}`}>
                        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">My Account Settings</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage your personal preferences</p>
                      </div>

                      <div className="space-y-1">
                        {MY_ACCOUNT_MENU.map(item => (
                            <NavItem 
                                key={item.id}
                                icon={item.icon} 
                                label={item.label} 
                                activeTab={activeAccountTab === item.id} 
                                onClick={() => { setActiveAccountTab(item.id); if (!isDesktop) setIsSidebarOpen(false); }}
                            />
                        ))}
                      </div>
                    </div>
                  ) : selectedCandidateId ? (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                      <button 
                        onClick={handleBackToProfiles}
                        className={`w-full flex items-center gap-2 px-3 py-2 mb-4 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                        title="Back to Search"
                      >
                        <ChevronLeft size={14} /> <span className={isCollapsed ? 'hidden' : 'inline'}>Back to Search</span>
                      </button>
                      
                      <div className={`px-3 mb-6 ${isCollapsed ? 'hidden' : 'block'}`}>
                        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">Candidate Profile</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">ID: {selectedCandidateId}</p>
                      </div>

                      <div className="space-y-1">
                        {PROFILE_TABS.map(tab => (
                            <NavItem 
                                key={tab.id} 
                                icon={tab.icon} 
                                label={tab.label} 
                                activeTab={activeProfileTab === tab.id} 
                                onClick={() => { setActiveProfileTab(tab.id); if (!isDesktop) setIsSidebarOpen(false); }}
                            />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                      <button 
                        onClick={handleBackToCampaigns}
                        className={`w-full flex items-center gap-2 px-3 py-2 mb-4 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                        title="Back to Campaigns"
                      >
                        <ChevronLeft size={14} /> <span className={isCollapsed ? 'hidden' : 'inline'}>Back to Campaigns</span>
                      </button>
                      
                      <div className={`px-3 mb-6 ${isCollapsed ? 'hidden' : 'block'}`}>
                        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">{selectedCampaign?.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">ID: {selectedCampaign?.jobID}</p>
                      </div>

                      <div className="space-y-1">
                        <NavItem 
                          icon={Brain} 
                          label="Intelligence" 
                          activeTab={activeCampaignTab === 'Intelligence'} 
                          onClick={() => { setActiveCampaignTab('Intelligence'); if (!isDesktop) setIsSidebarOpen(false); }}
                        />
                        
                        {/* Source AI Group */}
                        <div>
                            <NavItem 
                            icon={Search} 
                            label="Source AI" 
                            activeTab={activeCampaignTab.startsWith('Source AI')} 
                            onClick={() => { setActiveCampaignTab('Source AI'); if (!isDesktop) setIsSidebarOpen(false); }} 
                            />
                            {activeCampaignTab.startsWith('Source AI') && !isCollapsed && (
                                <div className="ml-8 mt-1 space-y-1 border-l border-slate-200 dark:border-slate-700 pl-3 animate-in slide-in-from-left-2 duration-200">
                                    <button onClick={() => { setActiveCampaignTab('Source AI:ATTACH'); if (!isDesktop) setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeCampaignTab === 'Source AI:ATTACH' || activeCampaignTab === 'Source AI' ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                        Attach People
                                    </button>
                                    <button onClick={() => { setActiveCampaignTab('Source AI:PROFILES'); if (!isDesktop) setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeCampaignTab === 'Source AI:PROFILES' ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                        Attached Profiles
                                    </button>
                                    <button onClick={() => { setActiveCampaignTab('Source AI:INTEGRATIONS'); if (!isDesktop) setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeCampaignTab === 'Source AI:INTEGRATIONS' ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                        Integrations
                                    </button>
                                    <button onClick={() => { setActiveCampaignTab('Source AI:JD'); if (!isDesktop) setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeCampaignTab === 'Source AI:JD' ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                        Job Description
                                    </button>
                                </div>
                            )}
                        </div>

                        <NavItem 
                          icon={GitBranch} 
                          label="Match AI" 
                          activeTab={activeCampaignTab === 'Match AI'} 
                          onClick={() => { setActiveCampaignTab('Match AI'); if (!isDesktop) setIsSidebarOpen(false); }}
                        />
                        
                        {/* Engage AI Group */}
                        <div>
                            <NavItem 
                            icon={MessageCircle} 
                            label="Engage AI" 
                            activeTab={activeCampaignTab.startsWith('Engage AI')} 
                            onClick={() => { setActiveCampaignTab('Engage AI'); if (!isDesktop) setIsSidebarOpen(false); }} 
                            />
                            {activeCampaignTab.startsWith('Engage AI') && !isCollapsed && (
                                <div className="ml-8 mt-1 space-y-1 border-l border-slate-200 dark:border-slate-700 pl-3 animate-in slide-in-from-left-2 duration-200">
                                    <button onClick={() => { setActiveCampaignTab('Engage AI:BUILDER'); if (!isDesktop) setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeCampaignTab === 'Engage AI:BUILDER' || activeCampaignTab === 'Engage AI' ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                        Workflow Builder
                                    </button>
                                    <button onClick={() => { setActiveCampaignTab('Engage AI:ROOM'); if (!isDesktop) setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeCampaignTab === 'Engage AI:ROOM' ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                        Interview Panel
                                    </button>
                                    <button onClick={() => { setActiveCampaignTab('Engage AI:TRACKING'); if (!isDesktop) setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeCampaignTab === 'Engage AI:TRACKING' ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                        Candidate List
                                    </button>
                                </div>
                            )}
                        </div>

                        <NavItem 
                          icon={ThumbsUp} 
                          label="Recommended" 
                          activeTab={activeCampaignTab === 'Recommended Profiles'} 
                          onClick={() => { setActiveCampaignTab('Recommended Profiles'); if (!isDesktop) setIsSidebarOpen(false); }}
                        />

                        <NavItem 
                          icon={Settings} 
                          label="Settings" 
                          activeTab={activeCampaignTab === 'Settings'} 
                          onClick={() => { setActiveCampaignTab('Settings'); if (!isDesktop) setIsSidebarOpen(false); }}
                        />
                      </div>
                    </div>
                  )}
               </div>

               {!isCollapsed && (
                   <SidebarFooter 
                     setIsCreateProfileOpen={setIsCreateProfileOpen} 
                     setIsCreateFolderOpen={setIsCreateFolderOpen}
                     setIsThemeSettingsOpen={setIsThemeSettingsOpen}
                     onOpenPlaceholder={openPlaceholder}
                     onNavigate={(view) => { setActiveView(view); setSelectedCandidateId(null); setSelectedCampaign(null); if (!isDesktop) setIsSidebarOpen(false); }}
                     onLogout={handleLogout}
                     userProfile={userProfile}
                     clients={clients}
                   />
               )}
            </div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col h-full overflow-hidden w-full relative bg-slate-50 dark:bg-slate-950 transition-colors ${!isDesktop && !isSidebarOpen ? 'pl-16' : ''}`}>
               {activeView === 'DASHBOARD' && <Home />}
               
               {activeView === 'PROFILES' && (
                 selectedCandidateId ? (
                    <div className="h-full flex flex-col">
                       <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center gap-2 shrink-0">
                          <button onClick={handleBackToProfiles} className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors">
                             <ChevronRight size={14} className="rotate-180"/> Back to Search
                          </button>
                          <span className="text-slate-300 dark:text-slate-600">|</span>
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Candidate Profile</span>
                       </div>
                       
                       <CandidateProfile activeTab={activeProfileTab} />
                    </div>
                 ) : (
                    <Profiles onNavigateToProfile={handleNavigateToProfile} view={activeProfileSubView} />
                 )
               )}

               {activeView === 'CAMPAIGNS' && (
                 selectedCampaign ? (
                    <div className="h-full flex flex-col">
                       <CampaignDashboard campaign={selectedCampaign} activeTab={activeCampaignTab} onBack={handleBackToCampaigns} />
                    </div>
                 ) : (
                    <Campaigns onNavigateToCampaign={handleNavigateToCampaign} initialTab={targetCampaignTab} />
                 )
               )}

               {activeView === 'METRICS' && <Metrics />}
               
               {activeView === 'SETTINGS' && <SettingsPage activeTab={activeSettingsTab} />}

               {activeView === 'MY_ACCOUNT' && <MyAccount activeTab={activeAccountTab} />}
            </div>

            {/* Create Profile Modal */}
            <CreateProfileModal isOpen={isCreateProfileOpen} onClose={() => setIsCreateProfileOpen(false)} />
            {/* Create Folder Modal */}
            <CreateFolderModal isOpen={isCreateFolderOpen} onClose={() => setIsCreateFolderOpen(false)} />
            {/* Theme Settings Modal */}
            <ThemeSettingsModal isOpen={isThemeSettingsOpen} onClose={() => setIsThemeSettingsOpen(false)} />
            {/* Placeholder Modal */}
            <PlaceholderModal 
                isOpen={placeholderConfig.isOpen} 
                onClose={() => setPlaceholderConfig({ isOpen: false, title: '', message: '' })} 
                title={placeholderConfig.title} 
                message={placeholderConfig.message} 
            />
          </div>
      )}
    </ToastProvider>
  );
};

export default App;
