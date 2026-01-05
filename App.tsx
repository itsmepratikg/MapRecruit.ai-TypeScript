import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  LayoutDashboard, Users, Briefcase, BarChart2, 
  Settings, LogOut, UserPlus, Building2, CheckCircle, 
  User, Phone, UserCog, Lock, Menu, X, ChevronRight, Moon, Sun,
  Brain, Search, GitBranch, MessageCircle, ThumbsUp, ChevronLeft,
  FileText, Activity, Video, Copy, ClipboardList, FolderOpen,
  Palette, PlusCircle, Shield, CreditCard, Mail, Database, 
  SlidersHorizontal, Tag, Layout, MessageSquare, HelpCircle, LogOut as LogoutIcon
} from './components/Icons';
import { ToastProvider, useToast } from './components/Toast';
import { Home } from './pages/Home';
import { Profiles } from './pages/Profiles';
import { Campaigns } from './pages/Campaigns';
import { Metrics } from './pages/Metrics';
import { CandidateProfile } from './pages/CandidateProfile';
import { CampaignDashboard } from './pages/CampaignDashboard';
import { SettingsPage } from './pages/Settings';
import { Campaign } from './types';
import { CreateProfileModal } from './components/CreateProfileModal';
import { useScreenSize } from './hooks/useScreenSize';
import { ThemeSettingsModal } from './components/ThemeSettingsModal';

// --- Reusable Menu Contents ---

const ClientMenuContent = () => (
  <>
    <div className="px-3 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900 rounded-t mb-1">Switch Client</div>
    <div className="p-1 space-y-1">
        <button className="w-full text-left px-3 py-2 text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 rounded flex items-center justify-between font-medium">
            TRC Talent Solutions <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400"/>
        </button>
        <button className="w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Amazon Warehouse Operations
        </button>
        <button className="w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Google Staffing Services
        </button>
        <button className="w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Microsoft HR Tech
        </button>
    </div>
  </>
);

const AccountMenuContent = ({ 
    darkMode, 
    setDarkMode, 
    setIsThemeSettingsOpen,
    closeMenu
}: { 
    darkMode: boolean, 
    setDarkMode: (v: boolean) => void, 
    setIsThemeSettingsOpen: (v: boolean) => void,
    closeMenu?: () => void
}) => (
  <>
    <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex flex-col items-center text-center bg-white dark:bg-slate-800 rounded-t-lg relative">
        {closeMenu && (
            <button onClick={closeMenu} className="absolute top-2 right-2 p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full lg:hidden">
                <X size={20} />
            </button>
        )}
        <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-4 border-white dark:border-slate-600 shadow-md mb-3">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" className="w-full h-full object-cover" />
        </div>
        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Pratik</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">pratik.gaurav@trcdemo.com</p>
        
        <div className="w-full border-t border-slate-100 dark:border-slate-700 pt-3 space-y-2">
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 px-2">
                <User size={16} className="text-slate-400 dark:text-slate-500"/> 
                <span className="font-medium">Product Admin</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 px-2">
                <Phone size={16} className="text-slate-400 dark:text-slate-500"/> 
                <span className="font-mono text-xs">+917004029399</span>
            </div>
        </div>
    </div>
    
    <div className="py-2 bg-white dark:bg-slate-800 rounded-b-lg">
        <div className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer group/item">
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors">
                <User size={16} /> 
                <span className="font-medium">My Account</span>
            </div>
            <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 flex items-center justify-center text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-help">?</div>
        </div>

        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
            <Settings size={16} /> Admin Settings
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
            <UserCog size={16} /> Product Admin Settings
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
            <Lock size={16} /> Change Password
        </button>

        {/* Dark Mode Toggle */}
        <div 
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer group/item"
        >
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors">
                    {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                    <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${darkMode ? 'bg-emerald-600' : 'bg-slate-300'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white dark:bg-slate-800 rounded-full transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
        </div>

        <button 
            onClick={() => setIsThemeSettingsOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
        >
            <Palette size={16} /> Themes
        </button>
        <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">
            <LogoutIcon size={16} /> Logout
        </button>
    </div>
  </>
);

// Sidebar Footer Component
const SidebarFooter = ({ 
  setIsCreateProfileOpen, 
  darkMode, 
  setDarkMode, 
  setIsThemeSettingsOpen,
  onNavigate
}: { 
  setIsCreateProfileOpen: (v: boolean) => void, 
  darkMode: boolean, 
  setDarkMode: (v: boolean) => void, 
  setIsThemeSettingsOpen: (v: boolean) => void,
  onNavigate: (view: ViewState) => void
}) => {
    const { isDesktop } = useScreenSize();
    const [mobileMenuOpen, setMobileMenuOpen] = useState<'client' | 'account' | null>(null);

    const handleMenuClick = (menu: 'client' | 'account') => {
        if (!isDesktop) {
            setMobileMenuOpen(menu);
        }
    };

    return (
        <div className="p-2 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 mt-auto space-y-1 shrink-0 transition-colors pb-4 lg:pb-2" onClick={(e) => e.stopPropagation()}>
            {/* Create Profile */}
            <button 
                onClick={() => setIsCreateProfileOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors group"
            >
                <UserPlus size={18} className="text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                <span className="text-sm font-medium">Create</span>
            </button>
    
            {/* Switch Client */}
            <div className="relative group/client">
                <button 
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors group"
                    onClick={() => handleMenuClick('client')}
                >
                    <Building2 size={18} className="text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                    <span className="text-sm font-medium truncate">TRC Talent Solutions</span>
                </button>
                
                {/* Desktop Client List Popover - Hover */}
                {isDesktop && (
                    <div className="hidden group-hover/client:block absolute left-full bottom-0 ml-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                        <ClientMenuContent />
                    </div>
                )}
            </div>
    
            {/* User Account */}
            <div className="relative group/account pt-2">
                <button 
                    className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                    onClick={() => handleMenuClick('account')}
                >
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-slate-600 shrink-0">
                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">Pratik</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">My Account</p>
                    </div>
                </button>
    
                {/* Desktop Account Popover - Hover */}
                {isDesktop && (
                    <div className="hidden group-hover/account:block absolute left-full bottom-0 ml-4 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="absolute bottom-6 -left-2 w-4 h-4 bg-white dark:bg-slate-800 transform rotate-45 border-l border-b border-slate-200 dark:border-slate-700"></div>
                        <AccountMenuContent darkMode={darkMode} setDarkMode={setDarkMode} setIsThemeSettingsOpen={setIsThemeSettingsOpen} />
                    </div>
                )}
            </div>

            {/* Mobile Modal Overlay */}
            {!isDesktop && mobileMenuOpen && (
                <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setMobileMenuOpen(null)}>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                        {mobileMenuOpen === 'client' && <ClientMenuContent />}
                        {mobileMenuOpen === 'account' && (
                            <AccountMenuContent 
                                darkMode={darkMode} 
                                setDarkMode={setDarkMode} 
                                setIsThemeSettingsOpen={setIsThemeSettingsOpen} 
                                closeMenu={() => setMobileMenuOpen(null)}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

type ViewState = 'DASHBOARD' | 'PROFILES' | 'CAMPAIGNS' | 'METRICS' | 'SETTINGS';

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

const App = () => {
  const [activeView, setActiveView] = useState<ViewState>('DASHBOARD');
  
  // Use custom hook for screen size detection
  const { width: windowWidth, isDesktop } = useScreenSize();
  
  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  
  // Navigation State
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState('profile');
  
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [activeCampaignTab, setActiveCampaignTab] = useState<string>('Intelligence');
  const [activeSettingsTab, setActiveSettingsTab] = useState('COMPANY_INFO'); // Settings Tab State

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
  const [isThemeSettingsOpen, setIsThemeSettingsOpen] = useState(false);

  // Sub-navigation handlers
  const handleNavigateToProfile = () => {
    setSelectedCandidateId('1');
    setActiveProfileTab('profile');
  };
  const handleBackToProfiles = () => setSelectedCandidateId(null);
  
  const handleNavigateToCampaign = (campaign: Campaign, tab: string = 'Intelligence') => {
    setSelectedCampaign(campaign);
    setActiveCampaignTab(tab);
  };
  const handleBackToCampaigns = () => setSelectedCampaign(null);

  // Logic for mobile collapsed state
  // On Desktop: Always Expanded (per previous instruction)
  // On Mobile: Collapsed if not explicitly Open
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
      <div className={`flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors ${darkMode ? 'dark' : ''}`}>
        
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

           <div className={`flex-1 overflow-y-auto py-4 ${isCollapsed ? 'px-2' : 'px-3'} space-y-1`}>
              {!selectedCampaign && !selectedCandidateId ? (
                <>
                  <NavItem view="DASHBOARD" icon={LayoutDashboard} label="Dashboard" />
                  <NavItem view="CAMPAIGNS" icon={Briefcase} label="Campaigns" />
                  <NavItem view="PROFILES" icon={Users} label="Profiles" />
                  <NavItem view="METRICS" icon={BarChart2} label="Metrics" />
                  
                  {/* Settings Item with Sub-Menu */}
                  <div>
                    <NavItem view="SETTINGS" icon={Settings} label="Settings" />
                    {activeView === 'SETTINGS' && !isCollapsed && (
                        <div className="ml-8 mt-1 space-y-1 border-l border-slate-200 dark:border-slate-700 pl-3 animate-in slide-in-from-left-2 duration-200">
                            {SETTINGS_SUBMENU.map(item => (
                                <button 
                                    key={item.id}
                                    onClick={() => { setActiveSettingsTab(item.id); if (!isDesktop) setIsSidebarOpen(false); }}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-2 ${activeSettingsTab === item.id ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}
                  </div>
                </>
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
                                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 mt-2 px-2">Sourcing Tools</div>
                                <button onClick={() => { setActiveCampaignTab('Source AI:ATTACH'); if (!isDesktop) setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between group ${activeCampaignTab === 'Source AI:ATTACH' || activeCampaignTab === 'Source AI' ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                    <span>Attach People</span>
                                    <PlusCircle size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600" />
                                </button>
                                <button onClick={() => { setActiveCampaignTab('Source AI:PROFILES'); if (!isDesktop) setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between ${activeCampaignTab === 'Source AI:PROFILES' ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                    <span>Attached Profiles</span>
                                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] px-1.5 py-0.5 rounded-full">4</span>
                                </button>
                                <button onClick={() => { setActiveCampaignTab('Source AI:INTEGRATIONS'); if (!isDesktop) setIsSidebarOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeCampaignTab === 'Source AI:INTEGRATIONS' ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                    Integrations
                                </button>
                                
                                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 mt-4 px-2">Job Details</div>
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
                  </div>
                </div>
              )}
           </div>

           {!isCollapsed && (
               <SidebarFooter 
                 setIsCreateProfileOpen={setIsCreateProfileOpen} 
                 darkMode={darkMode} 
                 setDarkMode={setDarkMode} 
                 setIsThemeSettingsOpen={setIsThemeSettingsOpen}
                 onNavigate={(view) => { setActiveView(view); setSelectedCandidateId(null); setSelectedCampaign(null); if (!isDesktop) setIsSidebarOpen(false); }}
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
                <Profiles onNavigateToProfile={handleNavigateToProfile} view="SEARCH" />
             )
           )}

           {activeView === 'CAMPAIGNS' && (
             selectedCampaign ? (
                <div className="h-full flex flex-col">
                   <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center gap-2 shrink-0">
                      <button onClick={handleBackToCampaigns} className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors">
                         <ChevronRight size={14} className="rotate-180"/> Back to Campaigns
                      </button>
                      <span className="text-slate-300 dark:text-slate-600">|</span>
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{selectedCampaign.name}</span>
                   </div>
                   <CampaignDashboard campaign={selectedCampaign} activeTab={activeCampaignTab} />
                </div>
             ) : (
                <Campaigns onNavigateToCampaign={handleNavigateToCampaign} />
             )
           )}

           {activeView === 'METRICS' && <Metrics />}
           
           {activeView === 'SETTINGS' && <SettingsPage activeTab={activeSettingsTab} />}
        </div>

        {/* Create Profile Modal */}
        <CreateProfileModal isOpen={isCreateProfileOpen} onClose={() => setIsCreateProfileOpen(false)} />
        {/* Theme Settings Modal */}
        <ThemeSettingsModal isOpen={isThemeSettingsOpen} onClose={() => setIsThemeSettingsOpen(false)} />
      </div>
    </ToastProvider>
  );
};

export default App;