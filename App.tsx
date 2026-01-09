import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  LayoutDashboard, Users, Briefcase, BarChart2, 
  Settings, LogOut, UserPlus, Building2, CheckCircle, 
  User, Phone, UserCog, Lock, Menu, X, ChevronRight,
  Brain, Search, GitBranch, MessageCircle, ThumbsUp, ChevronLeft,
  FileText, Activity, Video, Copy, ClipboardList, FolderOpen,
  Palette, PlusCircle, Shield, CreditCard, Mail, Database, 
  SlidersHorizontal, Tag, Layout, MessageSquare, HelpCircle, LogOut as LogoutIcon, Link as LinkIcon,
  Calendar, Clock, FolderPlus, Share2, Heart, MapPin, ChevronDown, CheckSquare, Target, Bell
} from './components/Icons';
import { useToast } from './components/Toast';
import { Home } from './pages/Home';
import { Profiles } from './pages/Profiles/index'; 
import { Campaigns } from './pages/Campaigns/index'; // Updated Import
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

const ClientMenuContent = ({ activeClient, clients, onSwitchClient, onClose }: { activeClient: string, clients: string[], onSwitchClient: (client: string) => void, onClose: () => void }) => (
  <>
    <div className="flex justify-between items-center px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-t mb-1">
        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Switch Client</div>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors lg:hidden"><X size={14}/></button>
    </div>
    <div className="p-1 space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
        {clients.map(client => (
            <button 
                key={client} 
                onClick={() => onSwitchClient(client)}
                className={`w-full text-left px-3 py-2 text-sm rounded flex items-center justify-between font-medium transition-colors duration-150 ${client === activeClient ? 'text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-700' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
            >
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
        <div className="py-1 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 w-full relative">
            <div className="flex justify-between items-center px-3 py-2">
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Create New</div>
                {closeMenu && <button onClick={(e) => { e.stopPropagation(); closeMenu(); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded lg:hidden"><X size={14}/></button>}
            </div>
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
                onClick={() => { setIsThemeSettingsOpen(true); if(closeMenu) closeMenu(); }}
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
  clients,
  onSwitchClient,
  activePopover,
  onHover,
  onLeave,
  onClosePopover
}: { 
  setIsCreateProfileOpen: (v: boolean) => void,
  setIsCreateFolderOpen: (v: boolean) => void,
  setIsThemeSettingsOpen: (v: boolean) => void,
  onOpenPlaceholder: (title: string, msg: string) => void,
  onNavigate: (view: ViewState) => void,
  onLogout: () => void,
  userProfile: any,
  clients: string[],
  onSwitchClient: (client: string) => void,
  activePopover: string | null,
  onHover: (id: string) => void,
  onLeave: () => void,
  onClosePopover: () => void
}) => {
    const { isDesktop } = useScreenSize();
    const [mobileMenuOpen, setMobileMenuOpen] = useState<'client' | 'account' | 'create' | null>(null);
    
    const userColorObj = COLORS.find(c => c.name === userProfile.color) || COLORS[0];

    const handleMenuClick = (menu: 'client' | 'account' | 'create') => {
        if (!isDesktop) {
            setMobileMenuOpen(menu);
        } else {
            // Desktop: Hover is handled by parent, clicking might trigger immediate open or just be fallback
        }
    };

    const handleClientSelect = (client: string) => {
        onSwitchClient(client);
        setMobileMenuOpen(null); // Close on selection
        onClosePopover();
    };

    // Helper for popup transitions
    const getPopupClass = (id: string) => {
        const isActive = activePopover === id;
        return `absolute left-full bottom-0 ml-2 shadow-xl z-50 origin-bottom-left transition-all duration-200 ease-out transform ${
            isActive 
            ? 'opacity-100 scale-100 translate-x-0 visible pointer-events-auto' 
            : 'opacity-0 scale-95 -translate-x-2 invisible pointer-events-none'
        }`;
    };

    return (
        <div className="p-2 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 mt-auto space-y-1 shrink-0 transition-colors pb-4 lg:pb-2" onClick={(e) => e.stopPropagation()}>
            {/* Create Dropdown */}
            <div className="relative" onMouseEnter={() => onHover('create')} onMouseLeave={onLeave}>
                <button 
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
                            onCreateProfile={() => { setIsCreateProfileOpen(true); onClosePopover(); }}
                            onCreateFolder={() => { setIsCreateFolderOpen(true); onClosePopover(); }}
                            onOpenPlaceholder={onOpenPlaceholder}
                            closeMenu={onClosePopover}
                        />
                    </div>
                )}
            </div>
    
            {/* Switch Client */}
            <div className="relative" onMouseEnter={() => onHover('client')} onMouseLeave={onLeave}>
                <button 
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors ${activePopover === 'client' ? 'bg-slate-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400' : ''}`}
                    onClick={() => handleMenuClick('client')}
                >
                    <Building2 size={18} className={activePopover === 'client' ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"} />
                    <span className="text-sm font-medium truncate" title={userProfile.activeClient}>{userProfile.activeClient}</span>
                </button>
                
                {/* Desktop Client List Popover */}
                {isDesktop && (
                    <div className={`${getPopupClass('client')} w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg`}>
                        <ClientMenuContent activeClient={userProfile.activeClient} clients={clients} onSwitchClient={handleClientSelect} onClose={onClosePopover} />
                    </div>
                )}
            </div>
    
            {/* User Account */}
            <div className="relative pt-2" onMouseEnter={() => onHover('account')} onMouseLeave={onLeave}>
                <button 
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
                            closeMenu={onClosePopover}
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

// Categorized Settings for Accordion Menu
const SETTINGS_CATEGORIES = [
  {
    id: 'ORGANIZATION',
    label: 'Organization',
    items: [
      { id: 'COMPANY_INFO', label: 'Company Info', icon: Building2 },
      { id: 'ROLES', label: 'Roles', icon: Shield },
      { id: 'USERS', label: 'Users', icon: Users },
      { id: 'CLIENTS', label: 'Clients', icon: Briefcase },
      { id: 'TEAMS', label: 'Teams', icon: Users },
    ]
  },
  {
    id: 'AI_AUTOMATION',
    label: 'AI & Automation',
    items: [
      { id: 'SOURCE_AI', label: 'Source AI', icon: Search },
      { id: 'ENGAGE_WORKFLOW', label: 'EngageAI Workflow', icon: GitBranch },
      { id: 'QUESTIONNAIRE', label: 'Questionnaire', icon: ClipboardList },
      { id: 'MRI_PREFERENCE', label: 'MRI Preference', icon: SlidersHorizontal },
    ]
  },
  {
    id: 'SYSTEM_CONFIG',
    label: 'System & Data',
    items: [
      { id: 'CUSTOM_FIELD', label: 'Custom Field', icon: FileText },
      { id: 'TAGS', label: 'Tags', icon: Tag },
      { id: 'PROFILE_SOURCES', label: 'Profile Sources', icon: Database },
      { id: 'COMMUNICATION', label: 'Communication', icon: MessageSquare },
      { id: 'COMM_TEMPLATES', label: 'Comm Templates', icon: Mail },
      { id: 'AUTHENTICATION', label: 'Authentication', icon: Lock },
      { id: 'API_CREDITS', label: 'API Credits', icon: CreditCard },
    ]
  },
  {
    id: 'APPEARANCE',
    label: 'Appearance',
    items: [
      { id: 'THEMES', label: 'Themes', icon: Palette },
      { id: 'REACHOUT_LAYOUTS', label: 'ReachOut Layouts', icon: Layout },
    ]
  }
];

const SETTINGS_SUBMENU = SETTINGS_CATEGORIES.flatMap(cat => cat.items);

const MY_ACCOUNT_MENU = [
    { id: 'BASIC_DETAILS', label: 'Basic Details', icon: User },
    { id: 'COMM_PREFS', label: 'Communication', icon: MessageSquare },
    { id: 'USER_PREFS', label: 'Appearance', icon: SlidersHorizontal },
    { id: 'CALENDAR', label: 'Calendar', icon: Calendar },
    { id: 'ROLES_PERMISSIONS', label: 'Roles & Permissions', icon: Shield },
    { id: 'AUTH_SYNC', label: 'Password & Authentication', icon: Lock },
    { id: 'USER_NOTIFICATIONS', label: 'User Notifications', icon: Bell },
    { id: 'LAST_LOGIN', label: 'Last Login Sessions', icon: Clock },
];

const PROFILES_CATEGORIES = [
  {
    id: 'SOURCE',
    label: 'Search & Source',
    items: [
      { id: 'SEARCH', label: 'Search Profiles', icon: Search },
      { id: 'NEW_LOCAL', label: 'New Local Profiles', icon: MapPin },
      { id: 'LOCAL', label: 'Local Profiles', icon: MapPin },
    ]
  },
  {
    id: 'APPLICATIONS',
    label: 'Applications',
    items: [
      { id: 'NEW_APPLIES', label: 'New Applies', icon: Clock },
      { id: 'OPEN_APPLIES', label: 'Open Applies', icon: FolderOpen },
      { id: 'INTERVIEW_STATUS', label: 'Interview Status', icon: Target },
    ]
  },
  {
    id: 'ORGANIZATION',
    label: 'Organization',
    items: [
      { id: 'FOLDERS', label: 'Folder Metrics', icon: BarChart2 },
      { id: 'TAGS', label: 'Tags', icon: Tag },
      { id: 'DUPLICATES', label: 'Duplicate Profiles', icon: Copy },
    ]
  },
  {
    id: 'COLLAB',
    label: 'Collaboration',
    items: [
      { id: 'SHARED', label: 'Shared Profiles', icon: Share2 },
      { id: 'FAVORITES', label: 'Favorite Profiles', icon: Heart },
    ]
  }
];

// Campaign Menu Components
const CampaignMenuContent = ({ 
    onNavigate, 
    onNavigateToCampaign,
    activeView,
    activeClient,
    onClose
}: { 
    onNavigate: (tab: string) => void,
    onNavigateToCampaign: (campaign: Campaign) => void,
    activeView: ViewState,
    activeClient: string,
    onClose: () => void
}) => {
    const [expandedClient, setExpandedClient] = useState<string>(activeClient);
    const [searchQuery, setSearchQuery] = useState('');

    // Update expanded client when global context changes
    useEffect(() => {
        setExpandedClient(activeClient);
    }, [activeClient]);

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
        onClose();
    };

    return (
        <div className="w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 flex flex-col max-h-[90vh]">
            {/* Search */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-700 shrink-0">
                <div className="flex items-center gap-2 mb-2 justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">Campaigns</span>
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded lg:hidden"><X size={14}/></button>
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
                                                    onClick={(e) => { e.stopPropagation(); onNavigateToCampaign({ ...GLOBAL_CAMPAIGNS[0], id: camp.id, name: camp.name, jobID: camp.jobId }); onClose(); }} // Mapping mock minimal data to full structure for demo
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

// --- Settings Accordion Menu ---
const SettingsMenuContent = ({
    onNavigate,
    activeTab,
    onClose
}: {
    onNavigate: (tabId: string) => void,
    activeTab: string,
    onClose: () => void
}) => {
    // Determine initially expanded category based on active tab or default to first
    const initialCategory = useMemo(() => {
        const found = SETTINGS_CATEGORIES.find(cat => cat.items.some(item => item.id === activeTab));
        return found ? found.id : SETTINGS_CATEGORIES[0].id;
    }, []);

    const [openCategory, setOpenCategory] = useState<string>(initialCategory);

    return (
        <div className="w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 flex flex-col max-h-[80vh] overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 shrink-0 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Administration</span>
                <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors lg:hidden"><X size={14}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                {SETTINGS_CATEGORIES.map(category => {
                    const isOpen = openCategory === category.id;
                    return (
                        <div key={category.id} className="mb-1 last:mb-0">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenCategory(isOpen ? '' : category.id);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-md transition-colors ${isOpen ? 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                {category.label}
                                <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {isOpen && (
                                <div className="mt-1 space-y-0.5 animate-in slide-in-from-top-1 duration-200">
                                    {category.items.map(item => (
                                        <button 
                                            key={item.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onNavigate(item.id);
                                                onClose();
                                            }}
                                            className={`w-full text-left pl-6 pr-3 py-2 text-xs flex items-center gap-2 transition-colors rounded-md ${activeTab === item.id ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                                        >
                                            <item.icon size={14} className={activeTab === item.id ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"} />
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ProfilesMenuContent = ({ onNavigate, onClose, activeView }: { onNavigate: (view: string) => void, onClose: () => void, activeView: string }) => {
    // Determine initially expanded category based on active tab or default to first
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
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors lg:hidden"><X size={14}/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                    {PROFILES_CATEGORIES.map(category => {
                        const isOpen = openCategory === category.id;
                        return (
                            <div key={category.id} className="mb-1 last:mb-0">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenCategory(isOpen ? '' : category.id);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-md transition-colors ${isOpen ? 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'}`}
                                >
                                    {category.label}
                                    <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {isOpen && (
                                    <div className="mt-1 space-y-0.5 animate-in slide-in-from-top-1 duration-200">
                                        {category.items.map(item => (
                                            <button 
                                                key={item.id}
                                                onClick={(e) => { e.stopPropagation(); onNavigate(item.id); onClose(); }}
                                                className={`w-full text-left pl-6 pr-3 py-2 text-xs flex items-center gap-2 transition-colors rounded-md ${activeView === item.id ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                                            >
                                                <item.icon size={14} className={activeView === item.id ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"} />
                                                {item.label}
                                            </button>
                                        ))}
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

export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<ViewState>('DASHBOARD');
  const { addToast } = useToast();
  
  // Use custom hook for screen size detection
  const { width: windowWidth, isDesktop } = useScreenSize();
  
  // Hook for User Preferences (Theme & Dashboard)
  const { theme, updateTheme } = useUserPreferences();
  
  // Hook for User Profile Data (Synchronized)
  const { userProfile, clients, saveProfile } = useUserProfile();
  
  // Navigation State
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState('profile');
  const [activeProfileSubView, setActiveProfileSubView] = useState<'SEARCH' | 'FOLDERS' | 'TAGS' | 'SHARED' | 'FAVORITES' | 'DUPLICATES' | 'LOCAL' | 'NEW_APPLIES' | 'OPEN_APPLIES' | 'NEW_LOCAL' | 'INTERVIEW_STATUS'>('SEARCH');
  
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

  // Popover Logic with Delay and Graceful Closing
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePopoverEnter = (id: string) => {
    // If we are entering a popover (or the trigger), clear any pending close timer
    if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
    }

    if (activePopover === id) return; // Already open

    // Clear any pending open timers for other items
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    
    // Set timer for opening
    hoverTimeoutRef.current = setTimeout(() => {
        setActivePopover(id);
    }, 500); // 500ms delay for opening
  };

  const handlePopoverLeave = () => {
    // Clear pending open timer
    if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
    }
    
    // Set close timer with grace period
    closeTimeoutRef.current = setTimeout(() => {
        setActivePopover(null);
    }, 300); // 300ms gap allowance
  };

  const closePopover = () => setActivePopover(null);

  // Global Esc Handler for Popovers
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closePopover();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

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

  const handleSwitchClient = (newClient: string) => {
      saveProfile({ ...userProfile, activeClient: newClient });
      addToast(`Switched to ${newClient}`, 'success');
  };

  const handleProfileSubmenuClick = (id: string) => {
      setActiveView('PROFILES');
      setActiveProfileSubView(id as any);
      if (!isDesktop) setIsSidebarOpen(false);
  }

  // Logic for mobile collapsed state
  const isCollapsed = !isDesktop && !isSidebarOpen; 

  // Helper for popover transitions - Reusable logic
  const getPopoverClass = (id: string) => {
    const isActive = activePopover === id;
    return `absolute left-full top-0 ml-2 z-50 origin-top-left transition-all duration-300 ease-out transform ${
        isActive 
        ? 'opacity-100 scale-100 translate-x-0 visible pointer-events-auto' 
        : 'opacity-0 scale-95 -translate-x-2 invisible pointer-events-none'
    }`;
  };

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

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
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

               <div className={`flex-1 ${!activeView.startsWith('PROFILES') && !activeView.startsWith('SETTINGS') ? 'overflow-visible' : 'overflow-y-auto custom-scrollbar'} py-4 ${isCollapsed ? 'px-2' : 'px-3'} space-y-1`}>
                  {!selectedCampaign && !selectedCandidateId && activeView !== 'MY_ACCOUNT' && activeView !== 'PROFILES' && activeView !== 'SETTINGS' ? (
                    <>
                      <NavItem view="DASHBOARD" icon={LayoutDashboard} label="Dashboard" />
                      
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
                                onMouseEnter={() => handlePopoverEnter('campaigns')} // Keep open when hovering content
                                onMouseLeave={handlePopoverLeave}
                            >
                                <CampaignMenuContent 
                                    onNavigate={handleNavigateToCampaignList}
                                    onNavigateToCampaign={handleNavigateToCampaign}
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
                                setActiveView('PROFILES');
                                setActiveProfileSubView('SEARCH');
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${activePopover === 'profiles' ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-900 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Users size={20} className={activePopover === 'profiles' ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-400 dark:text-slate-500'} />
                                <span className={isCollapsed ? 'hidden' : 'block'}>Profiles</span>
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
                                        setActiveView('PROFILES');
                                        setActiveProfileSubView(id as any);
                                    }}
                                    onClose={closePopover}
                                    activeView={activeView === 'PROFILES' ? activeProfileSubView : ''}
                                />
                            </div>
                        )}
                      </div>

                      <NavItem view="METRICS" icon={BarChart2} label="Metrics" />
                      
                      {/* Main Sidebar Settings Item with Hover Menu */}
                      <div className="relative" onMouseEnter={() => handlePopoverEnter('settings')} onMouseLeave={handlePopoverLeave}>
                        <button 
                            onClick={() => {
                                setActiveView('SETTINGS');
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
                                        setActiveView('SETTINGS');
                                        setActiveSettingsTab(tabId);
                                    }}
                                    activeTab={activeView === 'SETTINGS' ? activeSettingsTab : ''}
                                    onClose={closePopover}
                                />
                            </div>
                        )}
                      </div>
                    </>
                  ) : activeView === 'PROFILES' && !selectedCandidateId ? (
                    // PROFILE MODULE DRILL-DOWN SIDEBAR
                    <div className="animate-in slide-in-from-left duration-300 ease-out">
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

                      <div className="space-y-1 overflow-y-visible">
                        {PROFILES_CATEGORIES.map((cat, idx) => (
                            <div key={cat.id} className={`${idx !== 0 ? 'mt-4 border-t border-slate-100 dark:border-slate-800 pt-4' : ''} animate-in fade-in slide-in-from-left-2 duration-300`} style={{ animationDelay: `${idx * 100}ms` }}>
                                {!isCollapsed && (
                                    <h4 className="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                                        {cat.label}
                                    </h4>
                                )}
                                {cat.items.map(item => (
                                    <NavItem 
                                        key={item.id}
                                        icon={item.icon} 
                                        label={item.label} 
                                        activeTab={activeProfileSubView === item.id} 
                                        onClick={() => { setActiveProfileSubView(item.id as any); if (!isDesktop) setIsSidebarOpen(false); }}
                                    />
                                ))}
                            </div>
                        ))}
                      </div>
                    </div>
                  ) : activeView === 'SETTINGS' ? (
                    // SETTINGS MODULE DRILL-DOWN SIDEBAR
                    <div className="animate-in slide-in-from-left duration-300 ease-out">
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

                      <div className="space-y-1 overflow-y-visible">
                        {SETTINGS_CATEGORIES.map((cat, idx) => (
                            <div key={cat.id} className={`${idx !== 0 ? 'mt-4 border-t border-slate-100 dark:border-slate-800 pt-4' : ''} animate-in fade-in slide-in-from-left-2 duration-300`} style={{ animationDelay: `${idx * 100}ms` }}>
                                {!isCollapsed && (
                                    <h4 className="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                                        {cat.label}
                                    </h4>
                                )}
                                {cat.items.map(item => (
                                    <NavItem 
                                        key={item.id}
                                        icon={item.icon} 
                                        label={item.label} 
                                        activeTab={activeSettingsTab === item.id} 
                                        onClick={() => { setActiveSettingsTab(item.id); if (!isDesktop) setIsSidebarOpen(false); }}
                                    />
                                ))}
                            </div>
                        ))}
                      </div>
                    </div>
                  ) : activeView === 'MY_ACCOUNT' ? (
                    <div className="animate-in slide-in-from-left duration-300 ease-out">
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
                        {MY_ACCOUNT_MENU.map((item, index) => (
                            <div key={item.id} className="animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                                <NavItem 
                                    icon={item.icon} 
                                    label={item.label} 
                                    activeTab={activeAccountTab === item.id} 
                                    onClick={() => { setActiveAccountTab(item.id); if (!isDesktop) setIsSidebarOpen(false); }}
                                />
                            </div>
                        ))}
                      </div>
                    </div>
                  ) : selectedCandidateId ? (
                    <div className="animate-in slide-in-from-left duration-300 ease-out">
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
                        {PROFILE_TABS.map((tab, index) => (
                            <div key={tab.id} className="animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                                <NavItem 
                                    icon={tab.icon} 
                                    label={tab.label} 
                                    activeTab={activeProfileTab === tab.id} 
                                    onClick={() => { setActiveProfileTab(tab.id); if (!isDesktop) setIsSidebarOpen(false); }}
                                />
                            </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="animate-in slide-in-from-left duration-300 ease-out">
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
                     onSwitchClient={handleSwitchClient}
                     activePopover={activePopover}
                     onHover={handlePopoverEnter}
                     onLeave={handlePopoverLeave}
                     onClosePopover={closePopover}
                   />
               )}
            </div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col h-full overflow-hidden w-full relative bg-slate-50 dark:bg-slate-900 transition-colors ${!isDesktop && !isSidebarOpen ? 'pl-16' : ''}`}>
               {activeView === 'DASHBOARD' && <Home onNavigate={handleNavigateToCampaignList} />}
               
               {activeView === 'PROFILES' && (
                 selectedCandidateId ? (
                    <div className="h-full flex flex-col animate-in fade-in duration-300">
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
                    <div className="h-full flex flex-col animate-in fade-in duration-300">
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
  );
};