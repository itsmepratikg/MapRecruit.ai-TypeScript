
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
import { FranchiseSettings } from './Franchise';
import { RoleHierarchy } from './Roles/RoleHierarchy';
import { ThemeSettings } from './ThemeSettings';
import { WorkspaceConfigurations } from './WorkspaceConfigurations';

import { Routes, Route, Navigate } from 'react-router-dom';

import { CustomFieldsPage } from './CustomFields/CustomFields';
import { CommunicationSettings } from './Communication/CommunicationSettings';
import { CommunicationForm } from './Communication/CommunicationForm';

interface SettingsPageProps {
    activeTab?: string; // Optional for backward compatibility if needed, but we will ignore it
    onSelectUser?: (user: any) => void;
    onSelectClient?: (client: any) => void;
}

export const SettingsPage = ({ onSelectUser, onSelectClient }: SettingsPageProps) => {
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
        const item = SETTINGS_CONTENT[id];
        if (item && item.customPath) return item.customPath;

        // Specific overrides
        if (id === 'COMPANY_INFO') return 'companyinfo';
        if (id === 'ROLES') return 'roles';
        if (id === 'USERS') return 'users';
        if (id === 'REACHOUT_LAYOUTS') return 'reachoutlayouts';
        if (id === 'CLIENTS') return 'clients';
        if (id === 'FRANCHISE') return 'franchise';
        if (id === 'ROLE_HIERARCHY') return 'rolehierarchy';
        if (id === 'THEMES') return 'themes';
        if (id === 'WORKSPACE_CONFIG') return 'workspaceconfig';
        if (id === 'AUTHENTICATION') return 'authentication';
        if (id === 'CUSTOM_FIELD') return 'customfields';
        if (id === 'COMMUNICATION') return 'communication';

        // Fallback helper to convert SCREAMING_SNAKE to PascalCaseish
        return id.toLowerCase().replace(/_/g, '');
    }

    // Helper to find ID from current Path for legacy props if needed, or title lookup
    // We can just iterate SETTINGS_CONTENT to find the matching view.

    const SettingsContentWrapper = ({ id }: { id: string }) => {
        const content = SETTINGS_CONTENT[id];
        return (
            <div className="h-full overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12 transition-all">
                    <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
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
            <Route path="companyinfo" element={<CompanyInfo />} />
            <Route path="roles" element={<RolesPermissions />} />
            <Route path="users/*" element={<UsersSettings onSelectUser={onSelectUser} />} />
            <Route path="reachoutlayouts/*" element={<ReachOutLayouts />} />
            <Route path="clients" element={<ClientsSettings onSelectClient={onSelectClient} />} />
            <Route path="franchise" element={<FranchiseSettings />} />
            <Route path="rolehierarchy" element={<RoleHierarchy />} />
            <Route path="themes" element={<ThemeSettings />} />
            <Route path="workspaceconfig" element={<WorkspaceConfigurations />} />
            <Route path="authentication" element={<WorkspaceConfigurations />} />
            <Route path="customfields" element={<CustomFieldsPage />} />
            <Route path="communication" element={<CommunicationSettings />} />
            <Route path="communication/:id" element={<CommunicationForm />} />

            <Route path="customfield/:type" element={<CustomFieldsPage />} />
            <Route path="customfield" element={<Navigate to="campaign" replace />} />
            <Route path="users/userprofile/:section/:id" element={<UserProfileContainer />} />
            <Route path="users/userprofile/:section" element={<UserProfileContainer />} />
            <Route path="clientprofile/:tab/:clientId" element={<ClientProfileContainer />} />
            {/* Add routes for other settings items */}
            {Object.keys(SETTINGS_CONTENT).map(id => {
                // Only render placeholder for items not explicitly routed above
                if (!['COMPANY_INFO', 'ROLES', 'USERS', 'REACHOUT_LAYOUTS', 'CLIENTS', 'FRANCHISE', 'ROLE_HIERARCHY', 'THEMES', 'WORKSPACE_CONFIG', 'AUTHENTICATION', 'CUSTOM_FIELD', 'COMMUNICATION'].includes(id)) {
                    return <Route key={id} path={getPath(id)} element={<SettingsContentWrapper id={id} />} />;
                }
                return null;
            })}
            <Route path="*" element={<Navigate to={`/settings/${getPath('COMPANY_INFO')}`} replace />} />
        </Routes>
    );
};
