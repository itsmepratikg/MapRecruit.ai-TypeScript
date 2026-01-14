
import React from 'react';
import { Settings } from '../../components/Icons';
import { SETTINGS_CONTENT } from './constants';
import { PlaceholderView } from './components/PlaceholderView';
import { ReachOutLayouts } from './ReachOutLayouts';
import { CompanyInfo } from './CompanyInfo';
import { RolesPermissions } from './Roles/RolesPermissions';
import { UsersSettings } from './Users/Users';

import { Routes, Route, Navigate } from 'react-router-dom';

interface SettingsPageProps {
    activeTab?: string; // Optional for backward compatibility if needed, but we will ignore it
    onSelectUser?: (user: any) => void;
}

export const SettingsPage = ({ onSelectUser }: SettingsPageProps) => {
    // The activeTab is no longer directly used for rendering, but might be for initial state or other logic if needed.
    // const activeTab = searchParams.get('tab') || 'COMPANY_INFO';

    /* 
   * Mapping IDs to PascalCase Path Names
   * COMPANY_INFO -> CompanyInfo
   * ROLES -> Roles
   * USERS -> Users
   * ... others map via PascalCase convention or explicit map if needed.
   */
    const getPath = (id: string) => {
        // Simple transform: COMPANY_INFO -> CompanyInfo ... wait, "Company Information" -> CompanyInfo? 
        // The requirement asks for CompanyInfo. Let's make a manual map for now to be safe and explicit.
        const map: Record<string, string> = {
            'COMPANY_INFO': 'CompanyInfo',
            'ROLES': 'Roles',
            'USERS': 'Users',
            'REACHOUT_LAYOUTS': 'ReachOutLayouts',
            // Add others as needed, or fallback to TitleCase
        };
        if (map[id]) return map[id];

        // Fallback helper to convert SCREAMING_SNAKE to PascalCaseish
        return id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    }

    // Helper to find ID from current Path for legacy props if needed, or title lookup
    // We can just iterate SETTINGS_CONTENT to find the matching view.

    const SettingsContentWrapper = ({ id }: { id: string }) => {
        const content = SETTINGS_CONTENT[id];
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
    };

    return (
        <Routes>
            <Route path="/" element={<Navigate to={getPath('COMPANY_INFO')} replace />} />
            <Route path={getPath('COMPANY_INFO')} element={<CompanyInfo />} />
            <Route path={getPath('ROLES')} element={<RolesPermissions />} />
            <Route path={getPath('USERS')} element={<UsersSettings onSelectUser={onSelectUser} />} />
            <Route path={getPath('REACHOUT_LAYOUTS')} element={<ReachOutLayouts />} />
            {/* Add routes for other settings items */}
            {Object.keys(SETTINGS_CONTENT).map(id => {
                // Only render placeholder for items not explicitly routed above
                if (!['COMPANY_INFO', 'ROLES', 'USERS', 'REACHOUT_LAYOUTS'].includes(id)) {
                    return <Route key={id} path={getPath(id)} element={<SettingsContentWrapper id={id} />} />;
                }
                return null;
            })}
            <Route path="*" element={<Navigate to={getPath('COMPANY_INFO')} replace />} />
        </Routes>
    );
};
