import React from 'react';
import { ChevronLeft } from '../Icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavItem } from './NavItem';
import { SETTINGS_CATEGORIES } from './constants';
import { useScreenSize } from '../../hooks/useScreenSize';
import { companyService } from '../../services/api';
import { useUserContext } from '../../context/UserContext';

interface SettingsMenuProps {
    onBack: () => void;
    activeSettingsTab: string; // Keeping for interface compatibility but will ignore
    setActiveSettingsTab: (v: string) => void;
    isCollapsed: boolean;
    setIsSidebarOpen: (v: boolean) => void;
}

export const SettingsMenu = ({
    onBack,
    setActiveSettingsTab,
    isCollapsed,
    setIsSidebarOpen
}: SettingsMenuProps) => {
    const { isDesktop } = useScreenSize();
    const navigate = useNavigate();
    const location = useLocation();
    const [isFranchise, setIsFranchise] = React.useState(false);
    const { userProfile } = useUserContext();

    React.useEffect(() => {
        const checkFranchiseStatus = async () => {
            try {
                const companyData = await companyService.get();
                if (!companyData) return;

                const activeCompanyId = userProfile?.currentCompanyID || userProfile?.companyID || userProfile?.companyId;

                let targetCompany = null;
                if (Array.isArray(companyData)) {
                    targetCompany = activeCompanyId 
                        ? companyData.find(c => String(c._id) === String(activeCompanyId)) 
                        : companyData[0];
                } else {
                    targetCompany = companyData;
                }

                if (targetCompany) {
                    const hasFranchiseFlag = targetCompany.franchise === true || targetCompany.productSettings?.franchise === true;
                    // Strict verification of active company ID
                    if (!activeCompanyId || String(targetCompany._id) === String(activeCompanyId)) {
                        setIsFranchise(hasFranchiseFlag);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch company status for franchise check", error);
            }
        };
        checkFranchiseStatus();
    }, [userProfile]);

    // Helper to map IDs to PascalCase paths
    const getPath = (id: string) => {
        const map: Record<string, string> = {
            'COMPANY_INFO': 'companyinfo',
            'ROLES': 'roles',
            'USERS': 'users',
            'CLIENTS': 'clients',
            'REACHOUT_LAYOUTS': 'reachoutlayouts',
            'THEMES': 'themes',
        };
        if (map[id]) return map[id];
        return id.toLowerCase().replace(/_/g, '');
    }

    // Derive active tab from URL: /settings/CompanyInfo -> CompanyInfo
    const currentPath = location.pathname.split('/settings/')[1] || 'companyinfo';

    return (
        <div className="animate-in slide-in-from-left duration-300 ease-out">
            <button
                onClick={onBack}
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
                {SETTINGS_CATEGORIES.map((cat, idx) => {
                    // Clone the items to avoid mutating the constant
                    let itemsToRender = [...cat.items];

                    if (cat.id === 'ORGANIZATION') {
                        // Filter out Franchise by default from the constant if it exists
                        itemsToRender = itemsToRender.filter(item => item.id !== 'FRANCHISE');

                        // Inject it if this company is a franchise
                        if (isFranchise) {
                            const companyInfoIndex = itemsToRender.findIndex(item => item.id === 'COMPANY_INFO');
                            const insertIndex = companyInfoIndex !== -1 ? companyInfoIndex + 1 : 0;

                            // We need to find the franchise config from constants or define it here
                            // Using the label and icon from constants (which we will add)
                            const franchiseItem = { id: 'FRANCHISE', label: 'Franchise', icon: itemsToRender[0].icon /* Will be overridden by the actual icon in constants if needed, but we don't have direct access here so we will rely on it being in the cat items if we didn't filter it. Let's adjust this: */ };

                            // A safer way is to just find the actual object in SETTINGS_CONTENT but it's not exported as an array item.
                            // Let's rely on the constants exporting it in the group and filtering it out if NOT franchise.
                        }
                    }

                    // Re-implementing the cleaner logic:
                    let displayItems = cat.items;
                    if (cat.id === 'ORGANIZATION' && !isFranchise) {
                        displayItems = cat.items.filter(item => item.id !== 'FRANCHISE');
                    }

                    return (
                        <div key={cat.id} className={`${idx !== 0 ? 'mt-4 border-t border-slate-100 dark:border-slate-800 pt-4' : ''} animate-in fade-in slide-in-from-left-2 duration-300`} style={{ animationDelay: `${idx * 100}ms` }}>
                            {!isCollapsed && (
                                <h4 className="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                                    {cat.label}
                                </h4>
                            )}
                            {displayItems.map(item => {
                                const path = getPath(item.id);
                                return (
                                    <NavItem
                                        key={item.id}
                                        icon={item.icon}
                                        label={item.label}
                                        to={`/settings/${path}`}
                                        onClick={() => {
                                            setActiveSettingsTab(path);
                                            if (!isDesktop) setIsSidebarOpen(false);
                                        }}
                                        isCollapsed={isCollapsed}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
