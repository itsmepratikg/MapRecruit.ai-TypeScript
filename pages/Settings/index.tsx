
import React from 'react';
import { Settings } from '../../components/Icons';
import { SETTINGS_CONTENT } from './constants';
import { PlaceholderView } from './components/PlaceholderView';
import { ReachOutLayouts } from './ReachOutLayouts';
import { CompanyInfo } from './CompanyInfo';
import { RolesPermissions } from './Roles/RolesPermissions';
import { UsersSettings } from './Users/Users';

export const SettingsPage = ({ activeTab }: { activeTab: string }) => {
  
  // Render Specific Modules based on activeTab
  const renderContent = () => {
    if (activeTab === 'REACHOUT_LAYOUTS') {
        return <ReachOutLayouts />;
    }

    if (activeTab === 'COMPANY_INFO') {
        return <CompanyInfo />;
    }

    if (activeTab === 'ROLES') {
        return <RolesPermissions />;
    }

    if (activeTab === 'USERS') {
        return <UsersSettings />;
    }

    // Default to Placeholder for other sections
    const content = SETTINGS_CONTENT[activeTab];
    if (content) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{content.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400">{content.desc}</p>
                </div>
                <PlaceholderView 
                    title={`${content.title} Configuration`}
                    description={`Manage your ${content.title.toLowerCase()} settings here. This module is currently under active development.`}
                    icon={content.icon}
                />
            </div>
        );
    }

    // Fallback
    return (
        <div className="space-y-6">
            <PlaceholderView 
                title="Settings" 
                description="Select a category from the sidebar to configure your workspace."
                icon={Settings}
            />
        </div>
    );
  };

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
         {/* Roles and Users pages manage their own padding for full-screen feel */}
         {['ROLES', 'USERS'].includes(activeTab) ? (
             renderContent()
         ) : (
             <div className="p-8 lg:p-12 max-w-6xl mx-auto">
                {renderContent()}
             </div>
         )}
      </div>
    </div>
  );
};
