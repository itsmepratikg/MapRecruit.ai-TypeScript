import React, { useState } from 'react';
import { 
  Layout, Monitor, Sidebar, Moon, Sun, Bell, Shield, User, CreditCard, 
  CheckCircle, Smartphone, Globe, AlertCircle, Building2, Briefcase, 
  Palette, FileText, Tag, MessageSquare, Lock, Search, Mail, 
  GitBranch, ClipboardList, Database, SlidersHorizontal, Settings
} from 'lucide-react';

// Configuration map for placeholders to avoid massive switch statements
const SETTINGS_CONTENT: Record<string, { title: string, desc: string, icon: any }> = {
  COMPANY_INFO: { title: "Company Information", desc: "Manage your company profile, logos, address details, and regional settings.", icon: Building2 },
  ROLES: { title: "Roles & Permissions", desc: "Configure access levels, define user roles, and manage permissions for your team members.", icon: Shield },
  USERS: { title: "User Management", desc: "Add, remove, or update user accounts and assign roles to your team members.", icon: User },
  CLIENTS: { title: "Client Management", desc: "Manage client profiles, billing details, and specific configurations for different accounts.", icon: Briefcase },
  THEMES: { title: "Theme Customization", desc: "Customize the look and feel of the application to match your brand identity.", icon: Palette },
  CUSTOM_FIELD: { title: "Custom Fields", desc: "Define custom data fields for candidates, jobs, and applications to track specific metrics.", icon: FileText },
  TAGS: { title: "Tags Management", desc: "Create and manage tags to organize and filter candidates and jobs effectively.", icon: Tag },
  TEAMS: { title: "Team Structure", desc: "Organize users into teams and departments for better collaboration and reporting.", icon: User },
  COMMUNICATION: { title: "Communication Settings", desc: "Configure email servers, SMS gateways, and default communication preferences.", icon: MessageSquare },
  AUTHENTICATION: { title: "Authentication & Security", desc: "Manage SSO, 2FA, password policies, and other security settings.", icon: Lock },
  SOURCE_AI: { title: "Source AI Configuration", desc: "Tune your sourcing algorithms, manage job board integrations, and search parameters.", icon: Search },
  API_CREDITS: { title: "API Usage & Credits", desc: "Monitor your API consumption, purchase credits, and view usage history.", icon: CreditCard },
  COMM_TEMPLATES: { title: "Communication Templates", desc: "Create and edit email and SMS templates for automated and manual outreach.", icon: Mail },
  ENGAGE_WORKFLOW: { title: "EngageAI Workflows", desc: "Design and manage automated engagement workflows and candidate journeys.", icon: GitBranch },
  QUESTIONNAIRE: { title: "Questionnaire Builder", desc: "Create screening questionnaires and assessment forms for candidates.", icon: ClipboardList },
  PROFILE_SOURCES: { title: "Profile Sources", desc: "Manage external profile sources and configure data import settings.", icon: Database },
  MRI_PREFERENCE: { title: "MRI Preferences", desc: "Configure MapRecruit Intelligence preferences and scoring weights.", icon: SlidersHorizontal },
  // REACHOUT_LAYOUTS is handled separately
};

export const SettingsPage = ({ activeTab }: { activeTab: string }) => {
  const [selectedLayout, setSelectedLayout] = useState('standard');

  const Placeholder = ({ title, description, icon: Icon }: any) => (
    <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mb-6 text-slate-400 dark:text-slate-500 shadow-sm border border-slate-100 dark:border-slate-600">
            <Icon size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">{description}</p>
        <div className="mt-8 flex gap-3">
            <button className="px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm">
                Learn More
            </button>
            <button className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm">
                Configure
            </button>
        </div>
    </div>
  );

  // Handle explicit layouts tab
  if (activeTab === 'REACHOUT_LAYOUTS') {
    return (
        <div className="flex h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
          <div className="flex-1 overflow-y-auto p-8 lg:p-12">
             <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-8">
                   <div>
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">ReachOut Layouts</h3>
                      <p className="text-slate-500 dark:text-slate-400">Customize how your workspace looks and behaves.</p>
                   </div>
                   
                   {/* Dashboard Layouts Section */}
                   <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                         <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <Monitor size={18} className="text-emerald-600 dark:text-emerald-400" /> 
                            Dashboard Layouts
                         </h4>
                      </div>
                      
                      <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             {/* Standard Layout */}
                             <div 
                                onClick={() => setSelectedLayout('standard')}
                                className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${selectedLayout === 'standard' ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-900/10 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'}`}
                             >
                                <div className="flex justify-between items-center mb-4">
                                   <span className={`text-sm font-bold ${selectedLayout === 'standard' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>Standard</span>
                                   {selectedLayout === 'standard' && <CheckCircle size={18} className="text-emerald-500" />}
                                </div>
                                {/* Visual Preview */}
                                <div className="space-y-2 opacity-60">
                                   <div className="h-16 bg-slate-200 dark:bg-slate-600 rounded-md w-full"></div>
                                   <div className="flex gap-2">
                                      <div className="h-24 w-1/2 bg-slate-200 dark:bg-slate-600 rounded-md"></div>
                                      <div className="h-24 w-1/2 bg-slate-200 dark:bg-slate-600 rounded-md"></div>
                                   </div>
                                   <div className="h-12 bg-slate-200 dark:bg-slate-600 rounded-md w-full"></div>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">Balanced view with metrics and charts.</p>
                             </div>

                             {/* Analytics Layout */}
                             <div 
                                onClick={() => setSelectedLayout('analytics')}
                                className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${selectedLayout === 'analytics' ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-900/10 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'}`}
                             >
                                <div className="flex justify-between items-center mb-4">
                                   <span className={`text-sm font-bold ${selectedLayout === 'analytics' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>Data Focused</span>
                                   {selectedLayout === 'analytics' && <CheckCircle size={18} className="text-emerald-500" />}
                                </div>
                                {/* Visual Preview */}
                                <div className="space-y-2 opacity-60">
                                   <div className="grid grid-cols-4 gap-1">
                                      <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded-md"></div>
                                      <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded-md"></div>
                                      <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded-md"></div>
                                      <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded-md"></div>
                                   </div>
                                   <div className="h-32 bg-slate-200 dark:bg-slate-600 rounded-md w-full"></div>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">Heavy emphasis on graphs and data tables.</p>
                             </div>

                             {/* Compact Layout */}
                             <div 
                                onClick={() => setSelectedLayout('compact')}
                                className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${selectedLayout === 'compact' ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-900/10 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'}`}
                             >
                                <div className="flex justify-between items-center mb-4">
                                   <span className={`text-sm font-bold ${selectedLayout === 'compact' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>Compact</span>
                                   {selectedLayout === 'compact' && <CheckCircle size={18} className="text-emerald-500" />}
                                </div>
                                {/* Visual Preview */}
                                <div className="space-y-1 opacity-60">
                                   <div className="h-12 bg-slate-200 dark:bg-slate-600 rounded-md w-full"></div>
                                   <div className="h-12 bg-slate-200 dark:bg-slate-600 rounded-md w-full"></div>
                                   <div className="h-12 bg-slate-200 dark:bg-slate-600 rounded-md w-full"></div>
                                   <div className="h-12 bg-slate-200 dark:bg-slate-600 rounded-md w-full"></div>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">Maximized density for lists and tasks.</p>
                             </div>
                          </div>
                      </div>
                   </div>

                   {/* Other Visual Settings */}
                   <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                         <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <Sidebar size={18} className="text-indigo-500" /> 
                            Interface Density
                         </h4>
                      </div>
                      <div className="p-6">
                         <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-100 dark:bg-slate-600 p-2 rounded text-slate-500 dark:text-slate-300"><Monitor size={20} /></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Comfortable</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Standard spacing for better readability</p>
                                    </div>
                                </div>
                                <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-100 dark:bg-slate-600 p-2 rounded text-slate-500 dark:text-slate-300"><Smartphone size={20} /></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Compact</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Reduced padding to fit more data</p>
                                    </div>
                                </div>
                                <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
    );
  }

  // Handle all other tabs dynamically
  const content = SETTINGS_CONTENT[activeTab];

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="flex-1 overflow-y-auto p-8 lg:p-12">
         <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {content ? (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{content.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400">{content.desc}</p>
                    </div>
                    <Placeholder 
                        title={`${content.title} Configuration`}
                        description={`Manage your ${content.title.toLowerCase()} settings here. This module is currently under active development.`}
                        icon={content.icon}
                    />
                </div>
            ) : (
                <div className="space-y-6">
                    <Placeholder 
                        title="Settings" 
                        description="Select a category from the sidebar to configure your workspace."
                        icon={Settings}
                    />
                </div>
            )}
         </div>
      </div>
    </div>
  );
};