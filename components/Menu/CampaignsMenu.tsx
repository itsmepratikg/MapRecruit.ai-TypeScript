import React, { useState } from 'react';
import { ChevronLeft, Brain, Search, GitBranch, MessageCircle, ThumbsUp, Settings } from '../Icons';
import { NavItem } from './NavItem';
import { useScreenSize } from '../../hooks/useScreenSize';
import { useLocation, useNavigate } from 'react-router-dom';

interface CampaignsMenuProps {
    selectedCampaign: any;
    onBack: () => void;
    isCollapsed: boolean;
    setIsSidebarOpen: (v: boolean) => void;
}

export const CampaignsMenu = ({
    selectedCampaign,
    onBack,
    isCollapsed,
    setIsSidebarOpen
}: CampaignsMenuProps) => {
    const { isDesktop } = useScreenSize();
    const location = useLocation();
    const navigate = useNavigate();
    const [campaign, setCampaign] = React.useState<any>(selectedCampaign);
    const [loading, setLoading] = React.useState(false);

    // Parse current active section from URL
    const pathParts = location.pathname.split('/');
    const isNewRoute = pathParts[1] === 'showcampaign';

    let campaignId = selectedCampaign?.id || selectedCampaign?._id;
    if (typeof campaignId === 'object' && campaignId?.$oid) campaignId = campaignId.$oid;

    // Fallback ID from URL
    if (!campaignId) {
        if (isNewRoute) {
            const idPart = pathParts.find(p => /^[a-f0-9]{24}$/.test(p));
            if (idPart) campaignId = idPart;
        } else {
            campaignId = pathParts[2]; // /campaigns/id
        }
    }

    React.useEffect(() => {
        if (selectedCampaign) {
            setCampaign(selectedCampaign);
            return;
        }

        const fetchCampaign = async () => {
            if (!campaignId || campaignId === '1') return;
            setLoading(true);
            try {
                // We use the same service as App.tsx
                const { campaignService } = await import('../../services/api');
                const { mapCampaignToUI } = await import('../../pages/Campaigns');
                const campaigns = await campaignService.getAll();
                const found = campaigns.find((c: any) => (c._id?.$oid || c._id)?.toString() === campaignId);
                if (found) {
                    setCampaign(mapCampaignToUI(found));
                }
            } catch (err) {
                console.error("Sidebar: Failed to fetch campaign", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaign();
    }, [campaignId, selectedCampaign]);

    const currentModule = isNewRoute ? pathParts[2]?.toLowerCase() : (pathParts[3] || 'Intelligence');
    const currentSub = isNewRoute ? pathParts[3]?.toLowerCase() : pathParts[4];

    const getLink = (module: string, sub?: string) => {
        const cid = campaignId || '1';
        if (module === 'Intelligence') return `/showcampaign/intelligence/${cid}`;
        if (module === 'SourceAI') {
            if (sub === 'Attach') return `/showcampaign/sourceai/attachpeople/${cid}`;
            if (sub === 'Profiles') return `/showcampaign/sourceai/profiles/${cid}`;
            if (sub === 'Integrations') return `/showcampaign/sourceai/integrations/${cid}`;
            if (sub === 'JD') return `/showcampaign/sourceai/jobdescription/${cid}`;
        }
        if (module === 'MatchAI') return `/showcampaign/matchai/${cid}`;
        if (module === 'EngageAI') {
            if (sub === 'Builder') return `/showcampaign/engageai/${cid}`;
            if (sub === 'Room') return `/showcampaign/engageai/${cid}/1/room`; // Default Round 1
            if (sub === 'Tracking') return `/showcampaign/engageai/${cid}/1/dashboard`; // Default Round 1
        }
        if (module === 'Recommendations') return `/showcampaign/recommendedprofiles/${cid}`;
        if (module === 'Settings') return `/campaigns/${cid}/Settings`; // Keep legacy for now or update? User said "work on building later".

        return `/showcampaign/intelligence/${cid}`;
    };

    const isActive = (module: string, sub?: string) => {
        const mod = module.toLowerCase();
        if (sub) {
            // Mapping for active check is tricky because URL structure varies
            if (mod === 'sourceai') {
                if (sub === 'Attach') return location.pathname.includes('attachpeople');
                if (sub === 'Profiles') return location.pathname.includes('/profiles');
                if (sub === 'Integrations') return location.pathname.includes('integrations');
                if (sub === 'JD') return location.pathname.includes('jobdescription');
            }
            if (mod === 'engageai') {
                if (sub === 'Builder') return location.pathname.endsWith(`/engageai/${campaignId}`) || location.pathname.includes('/automation') || location.pathname.includes('/questionnaire');
                if (sub === 'Room') return location.pathname.includes('/room');
                if (sub === 'Tracking') return location.pathname.includes('/dashboard');
            }
            return false;
        }
        // Module level active check
        if (mod === 'intelligence') return location.pathname.includes('/intelligence');
        if (mod === 'sourceai') return location.pathname.includes('/sourceai');
        if (mod === 'matchai') return location.pathname.includes('/matchai');
        if (mod === 'engageai') return location.pathname.includes('/engageai');
        if (mod === 'recommendations') return location.pathname.includes('/recommendedprofiles');

        return false;
    };

    const handleNav = (module: string, sub?: string) => {
        navigate(getLink(module, sub));
        if (!isDesktop) setIsSidebarOpen(false);
    };

    return (
        <div className="animate-in slide-in-from-left duration-300 ease-out">
            <button
                onClick={onBack}
                className={`w-full flex items-center gap-2 px-3 py-2 mb-4 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                title="Back to Campaigns"
            >
                <ChevronLeft size={14} /> <span className={isCollapsed ? 'hidden' : 'inline'}>Back to Campaigns</span>
            </button>

            <div className={`px-3 mb-6 ${isCollapsed ? 'hidden' : 'block'}`}>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">{loading ? 'Loading...' : (campaign?.name || 'Campaign')}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">Job ID: {campaign?.jobID || campaignId?.substring(0, 8)}</p>
            </div>

            <div className="space-y-1">
                <NavItem
                    icon={Brain}
                    label="Intelligence"
                    activeTab={isActive('Intelligence')}
                    to={getLink('Intelligence')}
                    onClick={() => { if (!isDesktop) setIsSidebarOpen(false); }}
                    isCollapsed={isCollapsed}
                />

                {/* Source AI Group */}
                <div>
                    <NavItem
                        icon={Search}
                        label="Source AI"
                        activeTab={isActive('SourceAI')}
                        to={getLink('SourceAI', 'Attach')}
                        onClick={() => { if (!isDesktop) setIsSidebarOpen(false); }}
                        isCollapsed={isCollapsed}
                    />
                    {isActive('SourceAI') && !isCollapsed && (
                        <div className="ml-8 mt-1 space-y-1 border-l border-slate-200 dark:border-slate-700 pl-3 animate-in slide-in-from-left-2 duration-200">
                            <button onClick={() => handleNav('SourceAI', 'Attach')} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${isActive('SourceAI', 'Attach') ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                Attach People
                            </button>
                            <button onClick={() => handleNav('SourceAI', 'Profiles')} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${isActive('SourceAI', 'Profiles') ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                Attached Profiles
                            </button>
                            <button onClick={() => handleNav('SourceAI', 'Integrations')} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${isActive('SourceAI', 'Integrations') ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                Integrations
                            </button>
                            <button onClick={() => handleNav('SourceAI', 'JD')} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${isActive('SourceAI', 'JD') ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                Job Description
                            </button>
                        </div>
                    )}
                </div>

                <NavItem
                    icon={GitBranch}
                    label="Match AI"
                    activeTab={isActive('MatchAI')}
                    to={getLink('MatchAI')}
                    onClick={() => { if (!isDesktop) setIsSidebarOpen(false); }}
                    isCollapsed={isCollapsed}
                />

                {/* Engage AI Group */}
                <div>
                    <NavItem
                        icon={MessageCircle}
                        label="Engage AI"
                        activeTab={isActive('EngageAI')}
                        to={getLink('EngageAI', 'Builder')}
                        onClick={() => { if (!isDesktop) setIsSidebarOpen(false); }}
                        isCollapsed={isCollapsed}
                    />
                    {isActive('EngageAI') && !isCollapsed && (
                        <div className="ml-8 mt-1 space-y-1 border-l border-slate-200 dark:border-slate-700 pl-3 animate-in slide-in-from-left-2 duration-200">
                            <button onClick={() => handleNav('EngageAI', 'Builder')} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${isActive('EngageAI', 'Builder') ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                Workflow Builder
                            </button>
                            <button onClick={() => handleNav('EngageAI', 'Room')} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${isActive('EngageAI', 'Room') ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                Interview Panel
                            </button>
                            <button onClick={() => handleNav('EngageAI', 'Tracking')} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${isActive('EngageAI', 'Tracking') ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                Candidate List
                            </button>
                        </div>
                    )}
                </div>

                <NavItem
                    icon={ThumbsUp}
                    label="Recommended"
                    activeTab={isActive('Recommendations')}
                    to={getLink('Recommendations')}
                    onClick={() => { if (!isDesktop) setIsSidebarOpen(false); }}
                    isCollapsed={isCollapsed}
                />

                <NavItem
                    icon={Settings}
                    label="Settings"
                    activeTab={isActive('Settings')}
                    to={getLink('Settings')}
                    onClick={() => { if (!isDesktop) setIsSidebarOpen(false); }}
                    isCollapsed={isCollapsed}
                />
            </div>
        </div>
    );
};
