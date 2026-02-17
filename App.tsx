
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import { Menu, X, ChevronRight, Loader2 } from './components/Icons';
import { useToast } from './components/Toast';
// Lazy Load Pages for Performance Optimization
const Home = React.lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Profiles = React.lazy(() => import('./pages/Profiles/index').then(module => ({ default: module.Profiles })));
const Campaigns = React.lazy(() => import('./pages/Campaigns/index').then(module => ({ default: module.Campaigns })));
const Metrics = React.lazy(() => import('./pages/Metrics').then(module => ({ default: module.Metrics })));
const CandidateProfile = React.lazy(() => import('./pages/CandidateProfile').then(module => ({ default: module.CandidateProfile })));
const CampaignDashboard = React.lazy(() => import('./pages/Campaign/index').then(module => ({ default: module.CampaignDashboard })));
const CampaignExternalRoutes = React.lazy(() => import('./pages/Campaign/CampaignExternalRoutes').then(module => ({ default: module.CampaignExternalRoutes })));
const SettingsPage = React.lazy(() => import('./pages/Settings/index').then(module => ({ default: module.SettingsPage })));
const MyAccount = React.lazy(() => import('./pages/MyAccount/index').then(module => ({ default: module.MyAccount })));
const Login = React.lazy(() => import('./pages/Login/index').then(module => ({ default: module.Login })));
const Activities = React.lazy(() => import('./pages/Activities/index').then(module => ({ default: module.Activities })));
const PreviousHistory = React.lazy(() => import('./pages/PreviousHistory/index').then(module => ({ default: module.PreviousHistory })));
const Notifications = React.lazy(() => import('./pages/Notifications/index').then(module => ({ default: module.Notifications })));
const TalentChat = React.lazy(() => import('./pages/TalentChat/index').then(module => ({ default: module.TalentChat })));
const SupportPage = React.lazy(() => import('./pages/Support/index').then(module => ({ default: module.SupportPage })));
const GoogleCallback = React.lazy(() => import('./pages/MyAccount/GoogleCallback').then(m => ({ default: m.GoogleCallback })));
const MicrosoftCallback = React.lazy(() => import('./pages/MyAccount/MicrosoftCallback').then(m => ({ default: m.MicrosoftCallback })));
import { Campaign } from './types';
import { PlaceholderModal } from './components/PlaceholderModal';
import { useScreenSize } from './hooks/useScreenSize';
import { ThemeSettingsModal } from './components/ThemeSettingsModal';
import { useUserPreferences } from './hooks/useUserPreferences';
import { useUserProfile } from './hooks/useUserProfile';
import { useCompanyTheme } from './hooks/useCompanyTheme';
import { UserProvider } from './context/UserContext';
import { useRecentItems } from './hooks/useRecentItems';
import { WebSocketProvider } from './context/WebSocketContext';

import { useSessionTimeout } from './hooks/useSessionTimeout';
import { campaignService, clientService, authService } from './services/api';
import { useClarity } from './hooks/useClarity';
import { mapCampaignToUI } from './pages/Campaigns';
import { ConfirmClientSwitchModal } from './components/ConfirmClientSwitchModal';

// Import Providers and Security Components
import { QuickTourManager } from './components/QuickTour/QuickTourManager';
import { ImpersonationProvider, useImpersonation } from './context/ImpersonationContext';
import { ImpersonationBanner, SafetyRequestModal } from './components/Security/ImpersonationBanner';
import { AccessGuard } from './components/Security/AccessGuard';
import { SupportRequestModal } from './components/Security/SupportRequestModal';
import { SidebarFooter } from './components/Menu/SidebarFooter';

// Lazy Load Components
const GlobalSearch = React.lazy(() => import('./components/GlobalSearch').then(m => ({ default: m.GlobalSearch })));
const CampaignCreationModal = React.lazy(() => import('./components/Campaign/CampaignCreationModal').then(m => ({ default: m.CampaignCreationModal })));
const CreateProfileModal = React.lazy(() => import('./components/CreateProfileModal').then(m => ({ default: m.CreateProfileModal })));
const CreateFolderModal = React.lazy(() => import('./pages/Profiles/FoldersMetrics/CreateFolderModal').then(m => ({ default: m.CreateFolderModal })));

// Lazy Load Menus
const DashboardMenu = React.lazy(() => import('./components/Menu/DashboardMenu').then(m => ({ default: m.DashboardMenu })));
const CampaignsMenu = React.lazy(() => import('./components/Menu/CampaignsMenu').then(m => ({ default: m.CampaignsMenu })));
const ProfilesMenu = React.lazy(() => import('./components/Menu/ProfilesMenu').then(m => ({ default: m.ProfilesMenu })));
const SettingsMenu = React.lazy(() => import('./components/Menu/SettingsMenu').then(m => ({ default: m.SettingsMenu })));
const MyAccountMenu = React.lazy(() => import('./components/Menu/MyAccountMenu').then(m => ({ default: m.MyAccountMenu })));
const CandidateMenu = React.lazy(() => import('./components/Menu/CandidateMenu').then(m => ({ default: m.CandidateMenu })));
const UserAdminMenu = React.lazy(() => import('./components/Menu/UserAdminMenu').then(m => ({ default: m.UserAdminMenu })));
const TalentChatMenu = React.lazy(() => import('./components/Menu/TalentChatMenu').then(m => ({ default: m.TalentChatMenu })));
const ClientProfileMenu = React.lazy(() => import('./components/Menu/ClientProfileMenu').then(m => ({ default: m.ClientProfileMenu })));

import { PagePreloader } from './components/Common/PagePreloader';

type ViewState = 'DASHBOARD' | 'PROFILES' | 'CAMPAIGNS' | 'METRICS' | 'SETTINGS' | 'MY_ACCOUNT' | 'ACTIVITIES' | 'HISTORY' | 'NOTIFICATIONS' | 'TALENT_CHAT';

// Helper for Profile Redirection
export const LegacyProfileRedirect = () => {
  const { id, tab } = useParams();
  // Swap from /profile/:id/:tab to /profile/:tab/:id
  return <Navigate to={`/profile/${tab || 'profile'}/${id}`} replace />;
};

// Helper for Impersonation Logic
const ImpersonateWrapper = () => {
  const { payload } = useParams();
  const { startImpersonation } = useImpersonation();
  const navigate = useNavigate();

  useEffect(() => {
    if (payload) {
      try {
        // payload is a base64 encoded JSON: { token, user, mode }
        const decoded = JSON.parse(atob(payload));
        const { token, user, mode } = decoded;
        startImpersonation(token, user, mode || 'read-only');
      } catch (err) {
        console.error("Invalid impersonation payload", err);
        navigate('/dashboard', { replace: true });
      }
    }
  }, [payload, startImpersonation, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <Loader2 size={48} className="text-blue-500 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Authenticating Session</h2>
        <p className="text-slate-500 dark:text-slate-400">Please wait while we set up your secure view...</p>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <UserProvider>
      <WebSocketProvider>
        <AppContent />
      </WebSocketProvider>
    </UserProvider>
  );
};

const AppContent = () => {
  const [activeView, setActiveView] = useState<ViewState>('DASHBOARD');
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  // Use custom hook for screen size detection
  const { isDesktop } = useScreenSize();

  // Hook for User Preferences (Theme & Dashboard)
  const { theme, updateTheme } = useUserPreferences();

  // Hook for User Profile Data (Synchronized)
  // Hook for User Profile Data (Synchronized via Context)
  const { userProfile, clients, saveProfile, loading: userLoading } = useUserProfile();

  // Hook for Dynamic Company Theme
  // This will fetch the company color and inject CSS variables
  const { logos, companyName } = useCompanyTheme(userProfile);

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
  const [activeClientProfileTab, setActiveClientProfileTab] = useState('clientinformation');

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false); // Global Search State

  // Placeholder Modal State
  const [placeholderConfig, setPlaceholderConfig] = useState<{ isOpen: boolean, title: string, message: string }>({
    isOpen: false,
    title: '',
    message: ''
  });
  const [isSupportRequestOpen, setIsSupportRequestOpen] = useState(false);
  const [capturedScreenshot, setCapturedScreenshot] = useState<string | null>(null);
  const [isCapturingSupport, setIsCapturingSupport] = useState(false);

  // Check Authentication State (Directly from storage to avoid sync issues)
  const isAuthenticated = !!localStorage.getItem('authToken');



  // History Tracking
  const { addRecentItem } = useRecentItems();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Delay to allow page title to update
    const timer = setTimeout(() => {
      let type: 'CAMPAIGN' | 'PROFILE' | 'ACCOUNT' | 'PAGE' = 'PAGE';
      if (location.pathname.includes('/showcampaign/')) type = 'CAMPAIGN';
      else if (location.pathname.includes('/profile/')) type = 'PROFILE';
      else if (location.pathname.includes('/myaccount')) type = 'ACCOUNT';

      // Clean title
      let title = document.title.replace(' - MapRecruit', '').replace('MapRecruit', '').trim();
      if (!title) {
        // Fallback to path
        const parts = location.pathname.split('/').filter(Boolean);
        title = parts[parts.length - 1] || 'Dashboard';
        title = title.charAt(0).toUpperCase() + title.slice(1);
      }

      // Extract Entity ID for Smart Features
      let entityId = '';
      if (type === 'CAMPAIGN') {
        const match = location.pathname.match(/\/showcampaign\/[^/]+\/([^/]+)/);
        if (match) entityId = match[1];
      } else if (type === 'PROFILE') {
        const match = location.pathname.match(/\/profile\/profile\/([^/]+)/);
        if (match) entityId = match[1];
        else {
          // Try legacy /profile/:id
          const parts = location.pathname.split('/');
          if (parts.length === 3 && parts[1] === 'profile') entityId = parts[2];
        }
      }

      addRecentItem({
        id: location.pathname,
        url: location.pathname + location.search,
        title: title || 'Page',
        type,
        metadata: { entityId }
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.pathname, isAuthenticated, addRecentItem]);

  // Detect and handle company_id URL parameter for permanent switching
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlCompanyId = params.get('company_id');

    if (isAuthenticated && urlCompanyId && userProfile) {
      const currentId = (userProfile.currentCompanyID || userProfile.companyID)?.toString();
      console.log('[DEBUG] URL Switch Check:', { urlCompanyId, currentId });

      if (urlCompanyId !== currentId) {
        console.log('[DEBUG] Triggering Context Switch to:', urlCompanyId);
        const performSwitch = async () => {
          try {
            const { authService } = await import('./services/api');
            await authService.switchCompany(urlCompanyId);
            addToast('Switched company context via URL', 'success');

            // Remove param from URL and redirect to apply changes
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('company_id');
            window.location.href = newUrl.pathname + newUrl.search; // Redirect to clean URL
          } catch (error) {
            console.error('Failed to switch company via URL parameter', error);
          }
        };
        performSwitch();
      }
    }
  }, [location.search, isAuthenticated, userProfile, addToast]);

  // Session Timeout (30 minutes of inactivity)
  useSessionTimeout(() => {
    if (isAuthenticated) {
      addToast('Session expired due to inactivity.', 'info');
      handleLogout();
    }
  });

  // Initialize Analytics (Microsoft Clarity)
  useClarity(isAuthenticated, userProfile);

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

  // Workspace Connection Reminder (Persistent Toast on Login)
  useEffect(() => {
    if (isAuthenticated && userProfile) {
      const googleConnected = userProfile.integrations?.google?.connected;
      const microsoftConnected = userProfile.integrations?.microsoft?.connected;

      if (!googleConnected && !microsoftConnected) {
        // Only show if both are disconnected to avoid nagging if they use only one
        addToast(
          "Cloud Workspace not connected. Link your Google Drive or OneDrive in Settings to enable direct resume imports.",
          "info",
          { duration: Infinity, id: 'workspace-status-reminder' }
        );
      }
    }
  }, [isAuthenticated, !!userProfile, addToast]);

  const handleLogin = () => {
    // Check if there is a redirect path state (Clean URL Logic)
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
    window.location.reload(); // Refresh to ensure providers catch the new token
  };

  const handleLogout = () => {
    // If context logout is available, use it, otherwise fallback to local reset
    // This is primarily for Login.tsx's convenience, but context
    // Clear auth on exit
    localStorage.removeItem('authToken');
    // Clear user local storage if it exists (as per conversation 9c5324bf)
    localStorage.removeItem('user');
    localStorage.removeItem('user_profile_cache');
    localStorage.removeItem('session_expiry');

    // Force UI refresh or navigation
    navigate('/', { replace: true });
    window.location.reload(); // Hard reload is safest for full state reset
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

  const handleNavigateToCampaignList = React.useCallback((tab: string) => {
    setTargetCampaignTab(tab);
    // Map tab names to actual routes if they differ, or use a consistent pattern
    const routeMap: Record<string, string> = {
      'Active': '/campaigns',
      'Closed': '/closedcampaigns',
      'Archived': '/archivedcampaigns'
    };
    navigate(routeMap[tab] || '/campaigns');
    if (!isDesktop) setIsSidebarOpen(false);
  }, [isDesktop, navigate]);

  const handleCampaignClick = React.useCallback((c: any) => {
    navigate(`/showcampaign/intelligence/${c.id || c._id?.$oid || c._id}`);
  }, [navigate]);

  const handleSwitchClient = async (newClientId: string) => {
    try {
      const { authService } = await import('./services/api');
      const currentCompanyId = (userProfile.currentCompanyID || userProfile.companyID)?.toString();
      await authService.switchCompany(currentCompanyId, newClientId);

      // Clear cache to avoid stale data on reload
      localStorage.removeItem('user_profile_cache');

      window.location.reload();
    } catch (error: any) {
      console.error('Failed to switch client context', error);
      if (!error.isSafetyBlock) {
        addToast('Failed to switch client', 'error');
      }
    }
  };

  // --- User Admin Handlers ---
  const handleUserSelect = (user: any) => {
    setSelectedAdminUser(user);
    setActiveAdminUserTab('BASIC_DETAILS');
    navigate(`/settings/users/userprofile/basicdetails/${user._id || user.id}`);
    if (!isDesktop) setIsSidebarOpen(false);
  };

  const handleBackToUsers = () => {
    setSelectedAdminUser(null);
    // We are already in SETTINGS view, Users tab will be shown
  };

  // Logic for mobile collapsed state
  const isCollapsed = !isDesktop && !isSidebarOpen;

  // Global Search Navigation Handler
  const handleGlobalNavigate = async (type: string, data?: any) => {
    setIsGlobalSearchOpen(false);

    // Reset specific states before navigation to ensure clean slate
    setSelectedCandidateId(null);
    setSelectedCampaign(null);
    setSelectedAdminUser(null);

    if (type === 'NAV') {
      const routeMap: Record<string, string> = {
        'DASHBOARD': '/dashboard',
        'PROFILES': '/profiles/searchprofiles',
        'CAMPAIGNS': '/campaigns',
        'METRICS': '/metrics',
        'SETTINGS': '/settings/companyinfo',
        'MY_ACCOUNT': '/myaccount/basicdetails',
        'ACTIVITIES': '/activities',
        'HISTORY': '/history',
        'NOTIFICATIONS': '/notifications',
        'TALENT_CHAT': '/talent-chat'
      };

      let target = routeMap[data.view] || '/dashboard';

      // Handle Deep Links
      if (data.view === 'PROFILES' && data.subView) {
        const { getProfileViewPath } = await import('./components/Menu/constants');
        const subPath = getProfileViewPath(data.subView);
        setActiveProfileSubView(data.subView);
        target = `/profiles/searchprofiles/${subPath}`;
      }
      if (data.view === 'SETTINGS' && data.settingsTab) {
        setActiveSettingsTab(data.settingsTab);
        target = `/settings/${data.settingsTab}`;
      }
      if (data.view === 'MY_ACCOUNT' && data.accountTab) {
        setActiveAccountTab(data.accountTab);
        target = `/myaccount/${data.accountTab.toLowerCase()}`;
      }

      navigate(target);
    } else if (type === 'CAMPAIGN') {
      handleNavigateToCampaign(data);
    } else if (type === 'CANDIDATE') {
      setActiveView('PROFILES');
      // Default to /profile/profile/:id
      const candId = data.id || '1';
      navigate(`/profile/profile/${candId}`);
    }

    if (!isDesktop) setIsSidebarOpen(false);
  };



  // Redirect to login or support if not authenticated
  if (!isAuthenticated && !userLoading) {
    if (location.pathname === '/support') {
      return (
        <React.Suspense fallback={<PagePreloader message="Loading Support..." />}>
          <SupportPage />
        </React.Suspense>
      );
    }
    // Force URL cleaning: Redirect to / (Login) if trying to access deep link while unauthenticated
    if (location.pathname !== '/') {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
    return <Login onLogin={handleLogin} />;
  }

  // Show loader while checking session/context
  if (userLoading) {
    return <PagePreloader message="Loading session..." />;
  }



  return (
    <QuickTourManager>
      <ImpersonationProvider>
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors overflow-hidden">
          <ImpersonationBanner />
          <SafetyRequestModal />
          <div className="flex flex-1 overflow-hidden">
            <AccessGuard user={userProfile} clients={clients}>

              {/* Global Search Modal */}
              <React.Suspense fallback={null}>
                <GlobalSearch
                  isOpen={isGlobalSearchOpen}
                  onClose={() => setIsGlobalSearchOpen(false)}
                  onNavigate={handleGlobalNavigate}
                />
              </React.Suspense>

              {/* ... (Sidebar logic remains same, wrapped in parent div) ... */}

              {/* Mobile Sidebar Overlay - Only when fully open */}
              {isSidebarOpen && !isDesktop && (
                <div
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}

              {/* Sidebar */}
              <div
                data-tour="sidebar-container"
                className={`z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transform transition-all duration-300 ease-in-out flex flex-col shadow-xl 
                  ${isDesktop
                    ? 'w-64 relative translate-x-0' // Desktop: Always expanded
                    : `fixed inset-y-0 left-0 ${isSidebarOpen
                      ? 'w-64 translate-x-0 shadow-2xl' // Mobile Open: Expanded Overlay
                      : 'w-16 translate-x-0' // Mobile Closed: Mini Sidebar
                    }`
                  }
              `}>
                {/* ... Sidebar Header ... */}
                <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} border-b border-slate-200 dark:border-slate-700 shrink-0 bg-white dark:bg-slate-900 transition-all duration-300`}>
                  {isCollapsed ? (
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-500 hover:text-emerald-600 transition-colors">
                      {logos.minifiedLogo ? (
                        <img src={logos.minifiedLogo} alt="Logo" className="w-8 h-8 object-contain" />
                      ) : (
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm shrink-0">
                          {companyName?.charAt(0) || 'M'}
                        </div>
                      )}
                    </button>
                  ) : (
                    <>
                      {logos.logo ? (
                        <img src={logos.logo} alt="Logo" className="h-8 max-w-[140px] object-contain" />
                      ) : (
                        <>
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm shrink-0">
                            {companyName?.charAt(0) || 'M'}
                          </div>
                          <span className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight ml-3">
                            {companyName || 'MapRecruit'}
                          </span>
                        </>
                      )}
                      {!isDesktop && (
                        <button onClick={() => setIsSidebarOpen(false)} className="ml-auto text-slate-400 hover:text-slate-600">
                          <X size={20} />
                        </button>
                      )}
                    </>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar py-4 px-3 space-y-1">
                  <React.Suspense fallback={<div className="p-4 flex justify-center"><div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
                    <Routes>
                      <Route path="/campaigns/:id/*" element={
                        <CampaignsMenu
                          selectedCampaign={selectedCampaign} // Needs refactor to context or fetch
                          onBack={() => navigate('/campaigns')}
                          isCollapsed={isCollapsed}
                          setIsSidebarOpen={setIsSidebarOpen}
                        />
                      } />
                      <Route path="/showcampaign/*" element={
                        <CampaignsMenu
                          selectedCampaign={selectedCampaign} // Needs refactor to context or fetch
                          onBack={() => navigate('/campaigns')}
                          isCollapsed={isCollapsed}
                          setIsSidebarOpen={setIsSidebarOpen}
                        />
                      } />
                      {/* Profiles Menu for List Views */}
                      <Route path="/profiles/searchprofiles/*" element={
                        <ProfilesMenu
                          onBack={() => navigate('/dashboard')}
                          isCollapsed={isCollapsed}
                          setIsSidebarOpen={setIsSidebarOpen}
                          activeProfileSubView={activeProfileSubView}
                          setActiveProfileSubView={setActiveProfileSubView}
                        />
                      } />
                      {/* Candidate Profile Menu - Ensure route matches main content structure /profile/:tab/:id */}
                      <Route path="/profile/:tab/:id" element={
                        <CandidateMenu
                          selectedCandidateId={selectedCandidateId}
                          activeProfileTab={activeProfileTab}
                          setActiveProfileTab={setActiveProfileTab}
                          onBack={() => navigate('/profiles/searchprofiles/Search')}
                          isCollapsed={isCollapsed}
                          setIsSidebarOpen={setIsSidebarOpen}
                        />
                      } />
                      {/* Handle legacy /profile/:id and /profile/:id/:tab */}
                      <Route path="/profile/:id" element={<LegacyProfileRedirect />} />
                      <Route path="/profile/:id/:tab" element={<LegacyProfileRedirect />} />

                      {/* Redirect legacy /profiles to searchprofiles */}
                      <Route path="/profiles" element={<Navigate to="/profiles/searchprofiles/Search" replace />} />

                      <Route path="/settings/users/userprofile/*" element={
                        <UserAdminMenu
                          onBack={() => navigate('/settings/users')}
                          activeAdminUserTab={''}
                          setActiveAdminUserTab={setActiveAdminUserTab}
                          selectedAdminUser={selectedAdminUser}
                          isCollapsed={isCollapsed}
                          setIsSidebarOpen={setIsSidebarOpen}
                        />
                      } />
                      <Route path="/settings/clientprofile/*" element={
                        <ClientProfileMenu
                          onBack={() => navigate('/settings/clients')}
                          activeTab={activeClientProfileTab}
                          setActiveTab={setActiveClientProfileTab}
                          onNavigate={(tab) => {
                            // We need the clientId from the URL path. 
                            // Sidebar doesn't inherently know it unless passed, but we are inside Routes relative to /settings/clientprofile/* 
                            // ACTUALLY, the route matches /settings/clientprofile/:tab/:clientId
                            // So we can assume the URL structure.
                            const parts = location.pathname.split('/');
                            const clientId = parts[parts.length - 1]; // Last part should be ID
                            navigate(`/settings/clientprofile/${tab}/${clientId}`);
                          }}
                          clientId={location.pathname.split('/').pop()} // Approximate ID extraction
                          isCollapsed={isCollapsed}
                          setIsSidebarOpen={setIsSidebarOpen}
                        />
                      } />
                      <Route path="/settings/*" element={
                        <SettingsMenu
                          onBack={() => navigate('/dashboard')}
                          activeSettingsTab={activeSettingsTab}
                          setActiveSettingsTab={setActiveSettingsTab}
                          isCollapsed={isCollapsed}
                          setIsSidebarOpen={setIsSidebarOpen}
                        />
                      } />
                      <Route path="/myaccount/*" element={
                        <MyAccountMenu
                          onBack={() => navigate('/dashboard')}
                          activeAccountTab={activeAccountTab}
                          setActiveAccountTab={setActiveAccountTab}
                          isCollapsed={isCollapsed}
                          setIsSidebarOpen={setIsSidebarOpen}
                        />
                      } />
                      <Route path="/talent-chat/*" element={
                        <TalentChatMenu
                          onBack={() => navigate('/dashboard')}
                          isCollapsed={isCollapsed}
                          setIsSidebarOpen={setIsSidebarOpen}
                          activeTab={activeTalentChatTab}
                          setActiveTab={setActiveTalentChatTab}
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
                              'PROFILES': '/profiles/searchprofiles',
                              'CAMPAIGNS': '/campaigns',
                              'METRICS': '/metrics',
                              'SETTINGS': '/settings/companyinfo',
                              'MY_ACCOUNT': '/myaccount',
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
                          onNavigateToCampaign={handleCampaignClick}
                          handleNavigateToCampaignList={handleNavigateToCampaignList}
                        />
                      } />
                    </Routes>
                  </React.Suspense>
                </div>

                {!isCollapsed && (
                  <SidebarFooter
                    setIsCreateProfileOpen={setIsCreateProfileOpen}
                    setIsCreateCampaignOpen={setIsCreateCampaignOpen}
                    setIsCreateFolderOpen={setIsCreateFolderOpen}
                    setIsGlobalSearchOpen={setIsGlobalSearchOpen}
                    onOpenPlaceholder={openPlaceholder}
                    onOpenSupport={async () => {
                      setIsCapturingSupport(true);
                      try {
                        const { default: html2canvas } = await import('html2canvas');
                        const canvas = await html2canvas(document.body, {
                          useCORS: true,
                          allowTaint: true,
                          scale: 0.8,
                          logging: false
                        });
                        setCapturedScreenshot(canvas.toDataURL('image/png'));
                        setIsSupportRequestOpen(true);
                      } catch (err) {
                        console.error('Failed to capture screen for support:', err);
                        setIsSupportRequestOpen(true); // Open anyway if capture fails
                      } finally {
                        setIsCapturingSupport(false);
                      }
                    }}
                    onNavigate={(view) => {
                      const routeMap: Record<string, string> = {
                        'SETTINGS': '/settings/companyinfo',
                        'MY_ACCOUNT': '/myaccount/basicdetails',
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
                    isCapturingSupport={isCapturingSupport}
                  />
                )}
              </div>

              {/* Main Content */}
              <div className={`flex-1 flex flex-col h-full overflow-hidden w-full relative bg-slate-50 dark:bg-slate-900 transition-colors ${!isDesktop && !isSidebarOpen ? 'pl-16' : ''}`}>
                <React.Suspense fallback={<PagePreloader fullScreen={false} message="Loading Page Content..." />}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Home onNavigate={(tab) => navigate(`/campaigns?tab=${tab}`)} />} />

                    <Route path="/profiles/searchprofiles/*" element={
                      <Profiles onNavigateToProfile={(id) => navigate(`/profile/${id}`)} />
                    } />
                    <Route path="/profile/:tab/:id" element={
                      <div className="h-full flex flex-col animate-in fade-in duration-300">
                        <CandidateProfile />
                      </div>
                    } />
                    <Route path="/profile/:id" element={
                      <div className="h-full flex flex-col animate-in fade-in duration-300">
                        <CandidateProfile />
                      </div>
                    } />
                    {/* Handle legacy /profile/:id/:tab (Swaps to new tab/id format) */}
                    <Route path="/profile/:id/:tab" element={<LegacyProfileRedirect />} />

                    <Route path="/campaigns" element={
                      <Campaigns onNavigateToCampaign={(c: any) => {
                        const id = c.id || c._id?.$oid || c._id;
                        navigate(`/showcampaign/intelligence/${id}`);
                      }} initialTab={'Active'} />
                    } />
                    <Route path="/closedcampaigns" element={
                      <Campaigns onNavigateToCampaign={(c: any) => {
                        const id = c.id || c._id?.$oid || c._id;
                        navigate(`/showcampaign/intelligence/${id}`);
                      }} initialTab={'Closed'} />
                    } />
                    <Route path="/archivedcampaigns" element={
                      <Campaigns onNavigateToCampaign={(c: any) => {
                        const id = c.id || c._id?.$oid || c._id;
                        navigate(`/showcampaign/intelligence/${id}`);
                      }} initialTab={'Archived'} />
                    } />

                    <Route path="/campaigns/:id/*" element={
                      // We need to pass the campaign object. ideally fetch by ID. For now using selectedCampaign state which needs to be set.
                      // In a real app, CampaignDashboard would fetch by ID.
                      // We will check if selectedCampaign is set, if not try to find it from GLOBAL_CAMPAIGNS or redirect.
                      <CampaignDashboardWrapper />
                    } />

                    <Route path="/showcampaign/*" element={<CampaignExternalRoutes />} />

                    <Route path="/metrics" element={<Metrics />} />

                    <Route path="/settings/*" element={
                      <SettingsPage onSelectUser={handleUserSelect} />
                    } />

                    <Route path="/myaccount/*" element={<MyAccount activeTab={activeAccountTab} />} />

                    <Route path="/activities" element={<Activities />} />
                    <Route path="/history" element={<PreviousHistory onNavigate={(view, config) => handleGlobalNavigate('NAV', { view, ...config })} />} />
                    <Route path="/notifications" element={<Notifications onNavigate={(view, config) => handleGlobalNavigate('NAV', { view, ...config })} />} />
                    <Route path="/talent-chat/*" element={<TalentChat />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/auth/google/callback" element={<GoogleCallback />} />
                    <Route path="/auth/microsoft/callback" element={<MicrosoftCallback />} />
                    <Route path="/impersonate/:payload/*" element={<ImpersonateWrapper />} />
                  </Routes>
                </React.Suspense>
              </div>

              {/* Modals wrapped in Suspense */}
              <React.Suspense fallback={null}>
                {/* Create Profile Modal */}
                <CreateProfileModal isOpen={isCreateProfileOpen} onClose={() => setIsCreateProfileOpen(false)} />
                {/* Create Campaign Modal */}
                <CampaignCreationModal isOpen={isCreateCampaignOpen} onClose={() => setIsCreateCampaignOpen(false)} />
                {/* Create Folder Modal */}
                <CreateFolderModal isOpen={isCreateFolderOpen} onClose={() => setIsCreateFolderOpen(false)} />
              </React.Suspense>
              {/* Placeholder Modal */}
              <PlaceholderModal
                isOpen={placeholderConfig.isOpen}
                onClose={() => setPlaceholderConfig({ isOpen: false, title: '', message: '' })}
                title={placeholderConfig.title}
                message={placeholderConfig.message}
              />
            </AccessGuard>
          </div>
        </div>
        <SupportRequestModal
          isOpen={isSupportRequestOpen}
          onClose={() => {
            setIsSupportRequestOpen(false);
            setCapturedScreenshot(null);
          }}
          userId={userProfile?._id || userProfile?.id || 'Unknown'}
          currentUrl={window.location.href}
          activeClientID={userProfile?.activeClientID || 'Unknown'}
          activeCompanyID={userProfile?.companyID || 'Unknown'}
          preCapturedScreenshot={capturedScreenshot}
        />
      </ImpersonationProvider>
    </QuickTourManager >
  );
};

// Helper wrapper to handle campaign ID param
const CampaignDashboardWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile, refetchProfile } = useUserProfile();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [targetClientName, setTargetClientName] = useState('');

  const activeClientID = userProfile?.activeClientID || userProfile?.activeClient;

  useEffect(() => {
    const loadCampaign = async () => {
      if (!id || !userProfile) return;
      setLoading(true);
      try {
        const campaigns = await campaignService.getAll();
        const found = campaigns.find((c: any) => (c._id?.$oid || c._id)?.toString() === id);

        if (found) {
          const campaignClient = found.clientID || found.clientId;

          if (campaignClient && campaignClient !== activeClientID) {
            // Client Mismatch! Check if user has access to this client
            const accessibleClients = userProfile.clientID || [];

            if (accessibleClients.some((cid: any) => cid.toString() === campaignClient.toString())) {
              // User has access! Fetch client name and show modal
              const clientData = await clientService.getById(campaignClient);
              setTargetClientName(clientData.clientName || clientData.name || 'Another Client');
              setCampaign(found); // Store raw for now
              setShowSwitchModal(true);
            } else {
              // No access to this client's campaign
              navigate('/dashboard');
            }
          } else {
            setCampaign(mapCampaignToUI(found));
          }
        } else {
          // Not found in this company/list
          navigate('/dashboard');
        }
      } catch (err) {
        console.error("Failed to fetch campaign details", err);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();
  }, [id, activeClientID, !!userProfile]);

  const handleConfirmSwitch = async () => {
    if (!campaign || !userProfile) return;
    const campaignClient = campaign.clientID;
    const companyId = userProfile.companyID;

    try {
      setLoading(true);
      await authService.switchCompany(companyId, campaignClient);
      await refetchProfile(); // Sync profile state
      setShowSwitchModal(false);
      setCampaign(mapCampaignToUI(campaign));
    } catch (err) {
      console.error("Switch failed", err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading Campaign Details...</div>;
  if (!campaign && !showSwitchModal) return <div className="p-12 text-center text-slate-500">Campaign not found</div>;

  return (
    <>
      {campaign && !showSwitchModal && (
        <CampaignDashboard campaign={campaign} onBack={() => navigate('/campaigns')} />
      )}

      <ConfirmClientSwitchModal
        isOpen={showSwitchModal}
        campaignName={campaign?.campaignName || 'Campaign'}
        targetClientName={targetClientName}
        onConfirm={handleConfirmSwitch}
        onCancel={() => navigate('/dashboard')}
      />
    </>
  );
};

