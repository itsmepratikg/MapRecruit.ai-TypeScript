
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Settings } from '../../components/Icons';
import { SETTINGS_CONTENT } from './constants';
import { PlaceholderView } from './components/PlaceholderView';
import { ReachOutLayouts } from './ReachOutLayouts';
import { CompanyInfo } from './CompanyInfo';
import { RolesPermissions } from './Roles/RolesPermissions';
import { UsersSettings } from './Users/Users';
import { UserProfileContainer } from './Users/UserProfileContainer';
import { ClientsSettings } from './Clients';
import { ClientProfileContainer } from './ClientProfile/ClientProfileContainer';
import { ClientProfileContainer } from './ClientProfile/ClientProfileContainer';
import { FranchiseSettings } from './Franchise';
import { RoleHierarchy } from './Roles/RoleHierarchy';

import { Routes, Route, Navigate } from 'react-router-dom';

interface SettingsPageProps {
    activeTab?: string; // Optional for backward compatibility if needed, but we will ignore it
    onSelectUser?: (user: any) => void;
}

export const SettingsPage = ({ onSelectUser }: SettingsPageProps) => {
    const { t } = useTranslation();
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
            'COMPANY_INFO': 'companyinfo',
            'ROLES': 'roles',
            'USERS': 'users',
            'CLIENTS': 'clients',
            'FRANCHISE': 'franchise',
            'REACHOUT_LAYOUTS': 'reachoutlayouts',
            'ROLE_HIERARCHY': 'rolehierarchy',
            // Add others as needed, or fallback to TitleCase
        };
        if (map[id]) return map[id];

        // Fallback helper to convert SCREAMING_SNAKE to PascalCaseish
        return id.toLowerCase().replace(/_/g, '');
    }

    // Helper to find ID from current Path for legacy props if needed, or title lookup
    // We can just iterate SETTINGS_CONTENT to find the matching view.

    const SettingsContentWrapper = ({ id }: { id: string }) => {
        const content = SETTINGS_CONTENT[id];
        return (
            <div className="h-full overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12">
                    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t(content.title)}</h3>
                            <p className="text-slate-500 dark:text-slate-400">{t(content.desc)}</p>
                        </div>
                        <PlaceholderView
                            title={`${t(content.title)} ${t("Configuration")}`}
                            description={t("Manage your {0} settings here. This module is currently under active development.", { title: t(content.title).toLowerCase() })}
                            icon={content.icon}
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Routes>
            <Route path="/" element={<Navigate to={`/settings/${getPath('COMPANY_INFO')}`} replace />} />
            <Route path={getPath('COMPANY_INFO')} element={<CompanyInfo />} />
            <Route path={getPath('ROLES')} element={<RolesPermissions />} />
            <Route path={`${getPath('ROLES')}/:id`} element={<RolesPermissions />} />
            <Route path={getPath('USERS')} element={<UsersSettings onSelectUser={onSelectUser} />} />
            <Route path={getPath('CLIENTS')} element={<ClientsSettings />} /> {/* Add Route */}
            <Route path={getPath('ROLE_HIERARCHY')} element={<RoleHierarchy />} />
            <Route path={getPath('FRANCHISE')} element={<FranchiseSettings />} />
            <Route path={getPath('REACHOUT_LAYOUTS')} element={<ReachOutLayouts />} />
            <Route path="users/userprofile/:section/:id" element={<UserProfileContainer />} />
            <Route path="users/userprofile/:section" element={<UserProfileContainer />} />
            <Route path="clientprofile/:tab/:clientId" element={<ClientProfileContainer />} />
            {/* Add routes for other settings items */}
            {Object.keys(SETTINGS_CONTENT).map(id => {
                // Only render placeholder for items not explicitly routed above
                if (!['COMPANY_INFO', 'ROLES', 'USERS', 'REACHOUT_LAYOUTS', 'CLIENTS', 'FRANCHISE', 'ROLE_HIERARCHY'].includes(id)) {
                    return <Route key={id} path={getPath(id)} element={<SettingsContentWrapper id={id} />} />;
                }
                return null;
            })}
            <Route path="*" element={<Navigate to={`/settings/${getPath('COMPANY_INFO')}`} replace />} />
        </Routes>
    );
};
