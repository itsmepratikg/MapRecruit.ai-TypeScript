
import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Briefcase, BarChart2, 
  Settings, LogOut, UserPlus, Building2, CheckCircle, 
  User, Phone, UserCog, Lock, Menu, X, ChevronRight
} from 'lucide-react';
import { ToastProvider } from './components/Toast';
import { Home } from './pages/Home';
import { Profiles } from './pages/Profiles';
import { Campaigns } from './pages/Campaigns';
import { Metrics } from './pages/Metrics';
import { CandidateProfile } from './pages/CandidateProfile';
import { CampaignDashboard } from './pages/CampaignDashboard';
import { Campaign } from './types';
import { CreateProfileModal } from './components/CreateProfileModal';

// Sidebar Footer Component
const SidebarFooter = ({ setIsCreateProfileOpen }: { setIsCreateProfileOpen: (v: boolean) => void }) => (
    <div className="p-2 border-t border-slate-200 bg-white mt-auto space-y-1 shrink-0">
        {/* Create Profile */}
        <button 
          onClick={() => setIsCreateProfileOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-md transition-colors group"
        >
            <UserPlus size={18} className="text-slate-400 group-hover:text-emerald-600" />
            <span className="text-sm font-medium">Create</span>
        </button>
  
        {/* Switch Client */}
        <div className="relative group/client">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-md transition-colors group">
              <Building2 size={18} className="text-slate-400 group-hover:text-emerald-600" />
              <span className="text-sm font-medium truncate">TRC Talent Solutions</span>
          </button>
          
          {/* Client List Popover */}
          <div className="absolute left-full bottom-0 ml-2 w-64 bg-white border border-slate-200 rounded-lg shadow-xl hidden group-hover/client:block p-1 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 rounded-t mb-1">Switch Client</div>
              <button className="w-full text-left px-3 py-2 text-sm text-slate-800 bg-slate-50 rounded flex items-center justify-between font-medium">
                 TRC Talent Solutions <CheckCircle size={14} className="text-emerald-600"/>
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded hover:text-emerald-600 transition-colors">
                 Amazon Warehouse Operations
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded hover:text-emerald-600 transition-colors">
                 Google Staffing Services
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded hover:text-emerald-600 transition-colors">
                 Microsoft HR Tech
              </button>
          </div>
        </div>
  
        {/* User Account */}
        <div className="relative group/account pt-2">
           <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md transition-colors">
               <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300 shrink-0">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" className="w-full h-full object-cover" />
               </div>
               <div className="text-left flex-1 min-w-0">
                   <p className="text-sm font-medium text-slate-700 truncate">Pratik</p>
                   <p className="text-xs text-slate-400 truncate">My Account</p>
               </div>
           </button>
  
           {/* Account Popover */}
           <div className="absolute left-full bottom-0 ml-4 w-72 bg-white border border-slate-200 rounded-lg shadow-xl hidden group-hover/account:block z-50 animate-in fade-in zoom-in-95 duration-200">
               {/* Triangle */}
               <div className="absolute bottom-6 -left-2 w-4 h-4 bg-white transform rotate-45 border-l border-b border-slate-200"></div>
               
               <div className="p-5 border-b border-slate-100 flex flex-col items-center text-center bg-white rounded-t-lg relative">
                   <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden border-4 border-white shadow-md mb-3">
                      <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" className="w-full h-full object-cover" />
                   </div>
                   <h4 className="font-bold text-slate-800 text-lg">Pratik</h4>
                   <p className="text-xs text-slate-500 mb-4">pratik.gaurav@trcdemo.com</p>
                   
                   <div className="w-full border-t border-slate-100 pt-3 space-y-2">
                      <div className="flex items-center gap-3 text-sm text-slate-600 px-2">
                          <User size={16} className="text-slate-400"/> 
                          <span className="font-medium">Product Admin</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600 px-2">
                          <Phone size={16} className="text-slate-400"/> 
                          <span className="font-mono text-xs">+917004029399</span>
                      </div>
                   </div>
               </div>
               
               <div className="py-2 bg-white rounded-b-lg">
                   <div className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 cursor-pointer group/item">
                      <div className="flex items-center gap-3 text-sm text-slate-600 group-hover/item:text-emerald-600 transition-colors">
                        <User size={16} /> 
                        <span className="font-medium">My Account</span>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold hover:bg-slate-200 transition-colors cursor-help">?</div>
                   </div>

                   <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors font-medium">
                      <Settings size={16} /> Admin Settings
                   </button>
                   <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors font-medium">
                      <UserCog size={16} /> Product Admin Settings
                   </button>
                   <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors font-medium">
                      <Lock size={16} /> Change Password
                   </button>
                   <div className="border-t border-slate-100 my-1"></div>
                   <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium">
                      <LogOut size={16} /> Logout
                   </button>
               </div>
           </div>
        </div>
    </div>
);

type ViewState = 'DASHBOARD' | 'PROFILES' | 'CAMPAIGNS' | 'METRICS';

const PROFILE_TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'resume', label: 'Resume' },
  { id: 'activity', label: 'Activity' },
  { id: 'chat', label: 'Chat' },
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'interviews', label: 'Interviews' },
  { id: 'recommended', label: 'Recommended' },
  { id: 'similar', label: 'Similar' },
];

const App = () => {
  const [activeView, setActiveView] = useState<ViewState>('DASHBOARD');
  
  // Navigation State
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState('profile');
  
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [activeCampaignTab, setActiveCampaignTab] = useState<string>('Intelligence');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);

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

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button 
      onClick={() => { setActiveView(view); setSelectedCandidateId(null); setSelectedCampaign(null); }}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${activeView === view ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
    >
      <Icon size={20} className={activeView === view ? 'text-emerald-600' : 'text-slate-400'} />
      <span className={!isSidebarOpen ? 'hidden' : 'block'}>{label}</span>
    </button>
  );

  return (
    <ToastProvider>
      <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
        {/* Mobile Sidebar Overlay */}
        {!isSidebarOpen && (
          <button onClick={() => setIsSidebarOpen(true)} className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md lg:hidden">
            <Menu size={20} />
          </button>
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-0 lg:hidden'} flex flex-col`}>
           <div className="h-16 flex items-center px-6 border-b border-slate-200 shrink-0">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">M</div>
              <span className="font-bold text-lg text-slate-800 tracking-tight">MapRecruit</span>
              <button onClick={() => setIsSidebarOpen(false)} className="ml-auto lg:hidden text-slate-400"><X size={20}/></button>
           </div>

           <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              <NavItem view="DASHBOARD" icon={LayoutDashboard} label="Dashboard" />
              <NavItem view="PROFILES" icon={Users} label="Profiles" />
              <NavItem view="CAMPAIGNS" icon={Briefcase} label="Campaigns" />
              <NavItem view="METRICS" icon={BarChart2} label="Metrics" />
           </div>

           <SidebarFooter setIsCreateProfileOpen={setIsCreateProfileOpen} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
           {activeView === 'DASHBOARD' && <Home />}
           
           {activeView === 'PROFILES' && (
             selectedCandidateId ? (
                <div className="h-full flex flex-col">
                   <div className="px-4 py-2 border-b border-slate-200 bg-white flex items-center gap-2 shrink-0">
                      <button onClick={handleBackToProfiles} className="text-sm text-slate-500 hover:text-emerald-600 flex items-center gap-1">
                         <ChevronRight size={14} className="rotate-180"/> Back to Search
                      </button>
                      <span className="text-slate-300">|</span>
                      <span className="text-sm font-medium text-slate-800">Candidate Profile</span>
                   </div>
                   
                   {/* Profile Tabs */}
                   <div className="px-6 border-b border-slate-200 bg-white shrink-0">
                      <div className="flex gap-6 overflow-x-auto no-scrollbar">
                        {PROFILE_TABS.map(tab => (
                          <button 
                            key={tab.id}
                            onClick={() => setActiveProfileTab(tab.id)}
                            className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeProfileTab === tab.id ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
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
                   <div className="px-4 py-2 border-b border-slate-200 bg-white flex items-center gap-2 shrink-0">
                      <button onClick={handleBackToCampaigns} className="text-sm text-slate-500 hover:text-emerald-600 flex items-center gap-1">
                         <ChevronRight size={14} className="rotate-180"/> Back to Campaigns
                      </button>
                      <span className="text-slate-300">|</span>
                      <span className="text-sm font-medium text-slate-800">{selectedCampaign.name}</span>
                   </div>
                   <CampaignDashboard campaign={selectedCampaign} activeTab={activeCampaignTab} />
                </div>
             ) : (
                <Campaigns onNavigateToCampaign={handleNavigateToCampaign} />
             )
           )}

           {activeView === 'METRICS' && <Metrics />}
        </div>

        {/* Create Profile Modal */}
        <CreateProfileModal isOpen={isCreateProfileOpen} onClose={() => setIsCreateProfileOpen(false)} />
      </div>
    </ToastProvider>
  );
};

export default App;
