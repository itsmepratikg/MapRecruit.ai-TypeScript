
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import { Menu, X, ChevronRight } from './components/Icons';
import { useToast } from './components/Toast';
import { Home } from './pages/Home';
import { Profiles } from './pages/Profiles/index';
import { Campaigns } from './pages/Campaigns/index';
import { Metrics } from './pages/Metrics';
import { CandidateProfile } from './pages/CandidateProfile';
import { CampaignDashboard } from './pages/Campaign/index';
import { SettingsPage } from './pages/Settings/index';
import { MyAccount } from './pages/MyAccount/index';
import { Login } from './pages/Login/index';
import { Activities } from './pages/Activities/index';
import { PreviousHistory } from './pages/PreviousHistory/index';
import { Notifications } from './pages/Notifications/index';
import { TalentChat } from './pages/TalentChat/index';
import { Campaign } from './types';
import { CreateProfileModal } from './components/CreateProfileModal';
import { CreateFolderModal } from './pages/Profiles/FoldersMetrics/CreateFolderModal';
import { PlaceholderModal } from './components/PlaceholderModal';
import { useScreenSize } from './hooks/useScreenSize';
import { ThemeSettingsModal } from './components/ThemeSettingsModal';
import { useUserPreferences } from './hooks/useUserPreferences';
import { useUserProfile } from './hooks/useUserProfile';
import { GLOBAL_CAMPAIGNS } from './data';
import { GlobalSearch } from './components/GlobalSearch'; // Import Global Search
import clarity from '@microsoft/clarity';

// Import New Menu Components
import { DashboardMenu } from './components/Menu/DashboardMenu';
import { SidebarFooter } from './components/Menu/SidebarFooter';
import { CampaignsMenu } from './components/Menu/CampaignsMenu';
import { ProfilesMenu } from './components/Menu/ProfilesMenu';
import { SettingsMenu } from './components/Menu/SettingsMenu';
import { MyAccountMenu } from './components/Menu/MyAccountMenu';
import { CandidateMenu } from './components/Menu/CandidateMenu';
import { UserAdminMenu } from './components/Menu/UserAdminMenu';
import { TalentChatMenu } from './components/Menu/TalentChatMenu';

type ViewState = 'DASHBOARD' | 'PROFILES' | 'CAMPAIGNS' | 'METRICS' | 'SETTINGS' | 'MY_ACCOUNT' | 'ACTIVITIES' | 'HISTORY' | 'NOTIFICATIONS' | 'TALENT_CHAT';

export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<ViewState>('DASHBOARD');
  const { addToast } = useToast();

  // Use custom hook for screen size detection
  const { isDesktop } = useScreenSize();

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
  const [activeTalentChatTab, setActiveTalentChatTab] = useState('CONVERSATIONS');

  // Admin User Management State
  const [selectedAdminUser, setSelectedAdminUser] = useState<any>(null);
  const [activeAdminUserTab, setActiveAdminUserTab] = useState('BASIC_DETAILS');

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isThemeSettingsOpen, setIsThemeSettingsOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false); // Global Search State

  // Placeholder Modal State
  const [placeholderConfig, setPlaceholderConfig] = useState<{ isOpen: boolean, title: string, message: string }>({
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

  // Update Clarity User Info on Authentication
  useEffect(() => {
    if (isAuthenticated && userProfile?.email && clarity && clarity.identify) {
      // Identify user in Clarity
      clarity.identify(
        userProfile.email, // Identifier
        undefined, // Custom ID (Session-based)
        `${userProfile.firstName} ${userProfile.lastName}` // Friendly Name
      );

      // Set additional tags for filtering
      if (clarity.set) {
        if (userProfile.role) clarity.set('user_role', userProfile.role);
        if (userProfile.activeClient) clarity.set('active_client', userProfile.activeClient);
      }
    }
  }, [isAuthenticated, userProfile]);

  // Global Keyboard Listener for Search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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
    setSelectedAdminUser(null);
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

  // --- User Admin Handlers ---
  const handleUserSelect = (user: any) => {
    setSelectedAdminUser(user);
    setActiveAdminUserTab('BASIC_DETAILS');
    if (!isDesktop) setIsSidebarOpen(false);
  };

  const handleBackToUsers = () => {
    setSelectedAdminUser(null);
    // We are already in SETTINGS view, Users tab will be shown
  };

  // Logic for mobile collapsed state
  const isCollapsed = !isDesktop && !isSidebarOpen;

  // Global Search Navigation Handler
  const handleGlobalNavigate = (type: string, data?: any) => {
    setIsGlobalSearchOpen(false);

    // Reset specific states before navigation to ensure clean slate
    setSelectedCandidateId(null);
    setSelectedCampaign(null);
    setSelectedAdminUser(null);

    if (type === 'NAV') {
      setActiveView(data.view);

      // Handle Deep Links
      if (data.subView) {
        setActiveProfileSubView(data.subView);
      }
      if (data.settingsTab) {
        setActiveSettingsTab(data.settingsTab);
      }
      if (data.accountTab) {
        setActiveAccountTab(data.accountTab);
      }
      // Handle Talent Chat Deep Link if needed (though global search might not have it yet)
    } else if (type === 'CAMPAIGN') {
      handleNavigateToCampaign(data);
    } else if (type === 'CANDIDATE') {
      setActiveView('PROFILES');
      // For mock purposes, map to our single mock profile view or ID 1
      handleNavigateToProfile();
    }

    if (!isDesktop) setIsSidebarOpen(false);
  };


  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!isAuthenticated && location.pathname !== '/login') {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors">

      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onNavigate={handleGlobalNavigate}
      />

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
                <button onClick={() => setIsSidebarOpen(false)} className="ml-auto text-slate-400 hover:text-slate-600"><X size={20} /></button>
              )}
            </>
          )}
        </div>

        <div className={`flex-1 ${!location.pathname.startsWith('/profiles') && !location.pathname.startsWith('/settings') ? 'overflow-visible' : 'overflow-y-auto custom-scrollbar'} py-4 ${isCollapsed ? 'px-2' : 'px-3'} space-y-1`}>

          {/* Logic to determine which menu to show based on Route */}
          <Routes>
            <Route path="/campaigns/:id/*" element={
              <CampaignsMenu
                selectedCampaign={selectedCampaign} // Needs refactor to context or fetch
                onBack={() => navigate('/campaigns')}
                isCollapsed={isCollapsed}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            } />
            {/* Profiles Menu for List Views */}
            <Route path="/profiles/view/*" element={
              <ProfilesMenu
                onBack={() => navigate('/dashboard')}
                isCollapsed={isCollapsed}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            } />
            {/* Candidate Profile Menu */}
            <Route path="/profiles/:id" element={
              <CandidateMenu
                selectedCandidateId={selectedCandidateId}
                activeProfileTab={activeProfileTab}
                setActiveProfileTab={setActiveProfileTab}
                onBack={() => navigate('/profiles/view/Search')}
                isCollapsed={isCollapsed}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            } />

            {/* Redirect legacy /profiles to view */}
            <Route path="/profiles" element={<Navigate to="/profiles/view/Search" replace />} />

            <Route path="/settings/*" element={
              <SettingsMenu
                onBack={() => navigate('/dashboard')}
                isCollapsed={isCollapsed}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            } />
            <Route path="/account/*" element={
              <MyAccountMenu
                onBack={() => navigate('/dashboard')}
                isCollapsed={isCollapsed}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            } />
            <Route path="/talent-chat/*" element={
              <TalentChatMenu
                onBack={() => navigate('/dashboard')}
                isCollapsed={isCollapsed}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            } />

            {/* Default Menu for other routes */}

            {/* Default Menu for other routes */}
            <Route path="*" element={
              <DashboardMenu
                onNavigate={(view) => {
                  // Map view names to routes
                  const routeMap: Record<string, string> = {
                    'DASHBOARD': '/dashboard',
                    'PROFILES': '/profiles',
                    'CAMPAIGNS': '/campaigns',
                    'METRICS': '/metrics',
                    'SETTINGS': '/settings/CompanyInfo',
                    'MY_ACCOUNT': '/account',
                    'ACTIVITIES': '/activities',
                    'HISTORY': '/history',
                    'NOTIFICATIONS': '/notifications',
                    'TALENT_CHAT': '/talent-chat'
                  };
                  navigate(routeMap[view] || '/dashboard');
                  if (!isDesktop) setIsSidebarOpen(false);
                }}
                isCollapsed={isCollapsed}
                setIsSidebarOpen={setIsSidebarOpen}
                activeProfileSubView={activeProfileSubView}
                setActiveProfileSubView={setActiveProfileSubView}
                activeSettingsTab={activeSettingsTab}
                setActiveSettingsTab={setActiveSettingsTab}
                activeTalentChatTab={activeTalentChatTab}
                setActiveTalentChatTab={setActiveTalentChatTab}
                userProfile={userProfile}
                onNavigateToCampaign={(c) => navigate(`/campaigns/${c.id}`)}
                handleNavigateToCampaignList={(tab) => navigate(`/campaigns?tab=${tab}`)}
              />
            } />
          </Routes>
        </div>

        {!isCollapsed && (
          <SidebarFooter
            setIsCreateProfileOpen={setIsCreateProfileOpen}
            setIsCreateFolderOpen={setIsCreateFolderOpen}
            setIsThemeSettingsOpen={setIsThemeSettingsOpen}
            setIsGlobalSearchOpen={setIsGlobalSearchOpen}
            onOpenPlaceholder={openPlaceholder}
            onNavigate={(view) => {
              const routeMap: Record<string, string> = {
                'SETTINGS': '/settings/CompanyInfo',
                'MY_ACCOUNT': '/account/BasicDetails',
                'LOGIN': '/login'
              };
              const target = view.startsWith('/') ? view : (routeMap[view] || '/dashboard');
              navigate(target);
              if (!isDesktop) setIsSidebarOpen(false);
            }}
            onLogout={handleLogout}
            userProfile={userProfile}
            clients={clients}
            onSwitchClient={handleSwitchClient}
            setActiveAccountTab={setActiveAccountTab}
          />
        )}
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col h-full overflow-hidden w-full relative bg-slate-50 dark:bg-slate-900 transition-colors ${!isDesktop && !isSidebarOpen ? 'pl-16' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Home onNavigate={(tab) => navigate(`/campaigns?tab=${tab}`)} />} />

          <Route path="/profiles/view/*" element={
            <Profiles onNavigateToProfile={(id) => navigate(`/profiles/${id || '1'}`)} />
          } />
          <Route path="/profiles/:id" element={
            <div className="h-full flex flex-col animate-in fade-in duration-300">
              <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center gap-2 shrink-0">
                <button onClick={() => navigate('/profiles')} className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors">
                  <ChevronRight size={14} className="rotate-180" /> Back to Search
                </button>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Candidate Profile</span>
              </div>
              <CandidateProfile activeTab={activeProfileTab} />
            </div>
          } />

          <Route path="/campaigns" element={
            <Campaigns onNavigateToCampaign={(c) => navigate(`/campaigns/${c.id}`)} initialTab={targetCampaignTab} />
          } />

          <Route path="/campaigns/:id/*" element={
            // We need to pass the campaign object. ideally fetch by ID. For now using selectedCampaign state which needs to be set.
            // In a real app, CampaignDashboard would fetch by ID.
            // We will check if selectedCampaign is set, if not try to find it from GLOBAL_CAMPAIGNS or redirect.
            <CampaignDashboardWrapper />
          } />

          <Route path="/metrics" element={<Metrics />} />

          <Route path="/settings/*" element={
            <SettingsPage onSelectUser={handleUserSelect} />
          } />

          <Route path="/account/*" element={<MyAccount activeTab={activeAccountTab} />} />

          <Route path="/activities" element={<Activities />} />
          <Route path="/history" element={<PreviousHistory onNavigate={(view, config) => handleGlobalNavigate('NAV', { view, ...config })} />} />
          <Route path="/notifications" element={<Notifications onNavigate={(view, config) => handleGlobalNavigate('NAV', { view, ...config })} />} />
          <Route path="/talent-chat/*" element={<TalentChat />} />
        </Routes>
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

// Helper wrapper to handle campaign ID param
const CampaignDashboardWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // In a real app, fetch data here. For now, find in global data.
  const campaign = GLOBAL_CAMPAIGNS.find(c => c.id.toString() === id);

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  return <CampaignDashboard campaign={campaign} activeTab={'Intelligence'} onBack={() => navigate('/campaigns')} />;
};

