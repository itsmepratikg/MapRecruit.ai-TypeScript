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

    // Parse current active section from URL
    // URL pattern: /campaigns/:id/:tab/:subtab
    const pathParts = location.pathname.split('/');
    const currentTab = pathParts[3] || 'Intelligence'; // Default to Intelligence
    const currentSubTab = pathParts[4];

    const baseUrl = `/campaigns/${selectedCampaign?.id || '1'}`; // Fallback ID if undefined

    const isActive = (tab: string, subTab?: string) => {
        if (subTab) {
            return currentTab === tab && currentSubTab === subTab;
        }
        return currentTab === tab;
    };

    const handleNav = (tab: string, subTab?: string) => {
        const path = subTab ? `${baseUrl}/${tab}/${subTab}` : `${baseUrl}/${tab}`;
        navigate(path);
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
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">{selectedCampaign?.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">ID: {selectedCampaign?.jobID}</p>
            </div>

            <div className="space-y-1">
                <NavItem
                    icon={Brain}
                    label="Intelligence"
                    activeTab={isActive('Intelligence')}
                    to={`${baseUrl}/Intelligence`}
                    onClick={() => { if (!isDesktop) setIsSidebarOpen(false); }}
                    isCollapsed={isCollapsed}
                />

                {/* Source AI Group */}
                <div>
                    <NavItem
                        icon={Search}
                        label="Source AI"
                        activeTab={currentTab === 'SourceAI'}
                        to={`${baseUrl}/SourceAI/Attach`}
                        onClick={() => { if (!isDesktop) setIsSidebarOpen(false); }}
                        isCollapsed={isCollapsed}
                    />
                    {currentTab === 'SourceAI' && !isCollapsed && (
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
                    to={`${baseUrl}/MatchAI`}
                    onClick={() => { if (!isDesktop) setIsSidebarOpen(false); }}
                    isCollapsed={isCollapsed}
                />

                {/* Engage AI Group */}
                <div>
                    <NavItem
                        icon={MessageCircle}
                        label="Engage AI"
                        activeTab={currentTab === 'EngageAI'}
                        to={`${baseUrl}/EngageAI/Builder`}
                        onClick={() => { if (!isDesktop) setIsSidebarOpen(false); }}
                        isCollapsed={isCollapsed}
                    />
                    {currentTab === 'EngageAI' && !isCollapsed && (
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
                    to={`${baseUrl}/Recommendations`}
                    onClick={() => { if (!isDesktop) setIsSidebarOpen(false); }}
                    isCollapsed={isCollapsed}
                />

                <NavItem
                    icon={Settings}
                    label="Settings"
                    activeTab={isActive('Settings')}
                    to={`${baseUrl}/Settings`}
                    onClick={() => { if (!isDesktop) setIsSidebarOpen(false); }}
                    isCollapsed={isCollapsed}
                />
            </div>
        </div>
    );
};
