
import React, { useState, useRef, useEffect } from 'react';
import {
  Search, ChevronDown, RefreshCw, MoreVertical, HelpCircle,
  Heart, Share2, Network, ChevronRight, CheckCircle, PlusCircle, Users, Link, FileText, X
} from '../components/Icons';
import { Campaign } from '../types';
import { useToast } from '../components/Toast';

// --- MAIN COMPONENTS ---

// --- MAIN COMPONENTS ---

const FilterDropdown = ({ onChange }: { onChange: (filter: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('All');

  const options = ['All', 'Created by Me', 'Shared with Me', 'Favorites', 'New'];

  const handleSelect = (option: string) => {
    setSelected(option);
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-700 dark:text-slate-200 hover:border-gray-300 dark:hover:border-slate-600 focus:ring-2 focus:ring-green-100 transition-all min-w-[140px] justify-between"
      >
        <span>Filter: {selected}</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-20 py-1">
            <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-700">
              <div className="relative">
                <input type="text" placeholder="Search..." className="w-full pl-7 pr-2 py-1 text-xs bg-gray-50 dark:bg-slate-700 rounded border border-gray-200 dark:border-slate-600 focus:outline-none focus:border-green-500 dark:text-slate-200" />
                <Search size={10} className="absolute left-2 top-1.5 text-gray-400" />
              </div>
            </div>
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-green-50 dark:hover:bg-slate-700 hover:text-green-700 dark:hover:text-green-400 ${selected === opt ? 'text-green-700 dark:text-green-400 font-medium bg-green-50 dark:bg-slate-700' : 'text-gray-600 dark:text-slate-300'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

import { HoverMenu } from '../components/Campaign/HoverMenu';

interface CampaignsProps {
  onNavigateToCampaign: (campaign: Campaign, tab?: string) => void;
  initialTab?: string;
}

import { useCampaigns } from '../hooks/useCampaigns';
import { campaignService } from '../services/api';
import { useLocation } from 'react-router-dom';

export const mapCampaignToUI = (camp: any): Campaign => {
  const mainSchema = camp.schemaConfig?.mainSchema || {};
  const meta = camp.migrationMeta || {};

  const formatDate = (dateValue: any) => {
    if (!dateValue) return '---';
    const date = new Date(dateValue);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return {
    id: camp._id?.$oid || camp._id || 0,
    name: camp.title || camp.name || camp.displayName || mainSchema.title || 'Untitled Campaign',
    role: camp.job?.details?.jobTitle?.text || mainSchema.jobType || 'General Role',
    jobID: camp.passcode || meta.jobID || '---',
    status: mainSchema.status || (camp.status === true || camp.status === 'Active' ? 'Active' : 'Closed'),
    isNew: camp.isNew || false,
    isFavorite: camp.isFavorite || false,
    owner: camp.owner || { initials: "U", color: "bg-slate-500", name: "User" },
    members: camp.members || [],
    updatedDate: formatDate(camp.updatedAt || camp.createdAt),
    date: new Date(camp.createdAt || Date.now()).toLocaleDateString(),
    profilesCount: camp.profilesCount ?? meta.profilesCount ?? 0,
    candidates: camp.profilesCount ?? meta.profilesCount ?? 0,
    daysLeft: (() => {
      if (camp.customData?.closedAt) {
        const closedAt = new Date(camp.customData.closedAt);
        const now = new Date();
        const diffTime = closedAt.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
      return camp.daysLeft || 0;
    })(),
    engageStatus: (camp.engageStatus as 'Green' | 'Yellow' | 'Grey') || 'Grey',
    rounds: [] // Add empty rounds to satisfy Type
  };
};

interface CampaignsProps {
  onNavigateToCampaign: (campaign: Campaign, tab?: string) => void;
  initialTab?: string;
}

export const Campaigns: React.FC<CampaignsProps> = ({ onNavigateToCampaign, initialTab }) => {
  const { addToast } = useToast();
  const location = useLocation();
  const { campaigns: liveCampaigns, stats, loading, error } = useCampaigns();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('Active');

  // Mobile Long Press State
  const [activeMobileMenu, setActiveMobileMenu] = useState<any | null>(null);
  const longPressTimer = useRef<any>(null);

  // local shadow state for interactions like favorites
  const [localCampaigns, setLocalCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    if (liveCampaigns) {
      setLocalCampaigns(liveCampaigns.map(mapCampaignToUI));
    }
  }, [liveCampaigns]);

  // Sync tab if passed from parent (e.g. Sidebar)
  // Sync tab if passed from parent (e.g. Sidebar) or via router state
  useEffect(() => {
    const tabToSet = (location.state as any)?.tab || initialTab;
    if (tabToSet && ['Active', 'Closed', 'Archived'].includes(tabToSet)) {
      setActiveTab(tabToSet);
    }
  }, [initialTab, location.state]);

  const filteredCampaigns = localCampaigns.filter(c => {
    // 1. Filter by Tab (Active/Closed/Archived)
    if (c.status !== activeTab) return false;

    // 2. Filter by Search
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.jobID.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // 3. Filter by Dropdown
    let matchesDropdown = true;
    if (activeFilter === 'Created by Me') matchesDropdown = true; // Placeholder
    if (activeFilter === 'Shared with Me') matchesDropdown = true; // Placeholder
    if (activeFilter === 'Favorites') matchesDropdown = c.isFavorite || false;
    if (activeFilter === 'New') matchesDropdown = c.isNew || false;

    return matchesDropdown;
  });

  const handleMenuAction = (campaignId: any, action: string) => {
    const campaign = localCampaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    // Navigate to specific tabs in the Campaign Dashboard
    if (action === 'INTELLIGENCE') onNavigateToCampaign(campaign, 'Intelligence');
    else if (action === 'ATTACH_PEOPLE') onNavigateToCampaign(campaign, 'Source AI:ATTACH');
    else if (action === 'ATTACHED_PROFILES') onNavigateToCampaign(campaign, 'Source AI:PROFILES');
    else if (action === 'INTEGRATIONS') onNavigateToCampaign(campaign, 'Source AI:INTEGRATIONS');
    else if (action === 'JOB_DESC') onNavigateToCampaign(campaign, 'Source AI:JD');
    else if (action === 'MATCH_AI') onNavigateToCampaign(campaign, 'Match AI');
    else if (action === 'ENGAGE_AI') onNavigateToCampaign(campaign, 'Engage AI');
    else if (action === 'RECOMMENDED') onNavigateToCampaign(campaign, 'Recommended Profiles');

    setActiveMobileMenu(null); // Close menu after action
  };

  const handleCampaignClick = (campaign: Campaign) => {
    if (!activeMobileMenu) {
      onNavigateToCampaign(campaign, 'Intelligence');
    }
  };

  const toggleFavorite = async (id: any) => {
    // Optimistic Update
    setLocalCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const newVal = !c.isFavorite;
        // addToast(newVal ? "Campaign added to favorites" : "Campaign removed from favorites", "success");
        return { ...c, isFavorite: newVal };
      }
      return c;
    }));

    // API Call
    try {
      await campaignService.toggleFavorite(id);
    } catch (error) {
      // Revert on error
      setLocalCampaigns(prev => prev.map(c => {
        if (c.id === id) {
          return { ...c, isFavorite: !c.isFavorite };
        }
        return c;
      }));
      addToast("Failed to update favorite status", "error");
    }
  };

  // --- Long Press Handlers ---
  const handleTouchStart = (id: any) => {
    longPressTimer.current = setTimeout(() => {
      setActiveMobileMenu(id);
    }, 500); // 500ms long press
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  // Close menu on click outside
  useEffect(() => {
    const closeMenu = () => setActiveMobileMenu(null);
    if (activeMobileMenu) window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, [activeMobileMenu]);

  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 dark:bg-slate-900 transition-colors custom-scrollbar">
      <div className="p-4 lg:p-8 max-w-[1600px] mx-auto min-h-screen">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => window.location.reload()} className="px-3 py-1 bg-red-100 dark:bg-red-800 rounded-md font-bold hover:bg-red-200 transition-colors">Retry</button>
          </div>
        )}



        {/* Toolbar */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-t-xl border border-gray-200 dark:border-slate-700 border-b-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-700 dark:text-slate-200 bg-gray-50 dark:bg-slate-700 hover:bg-white dark:hover:bg-slate-600 hover:border-gray-300 transition-colors w-full md:w-auto justify-center">
              Default Campaign Table <ChevronDown size={14} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 md:justify-end w-full">
            <div className="w-full sm:w-auto">
              <FilterDropdown onChange={setActiveFilter} />
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100 dark:bg-slate-700 dark:text-slate-200 transition-all"
              />
              <Search size={16} className="absolute right-3 top-2.5 text-gray-400" />
            </div>

            <div className="flex items-center gap-1 self-end sm:self-auto">
              <button
                onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
                className="text-green-600 dark:text-green-400 text-sm font-medium hover:underline px-2 whitespace-nowrap"
              >
                Clear
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg"><RefreshCw size={16} /></button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg"><MoreVertical size={16} /></button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg"><HelpCircle size={16} /></button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-b-xl shadow-sm overflow-hidden min-h-[500px] flex flex-col">
          <div className="overflow-x-auto flex-1 w-full custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 font-medium border-b border-gray-100 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500 dark:bg-slate-700 dark:border-slate-600" /></th>
                  <th className="px-6 py-4 cursor-pointer hover:text-gray-700 dark:hover:text-slate-200 group flex items-center gap-1">
                    Title <ArrowUpDownIcon className="opacity-0 group-hover:opacity-50" />
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-gray-700 dark:hover:text-slate-200 group"><div className="flex items-center gap-1">Job ID <ArrowUpDownIcon className="opacity-0 group-hover:opacity-50" /></div></th>
                  <th className="px-6 py-4 cursor-pointer hover:text-gray-700 dark:hover:text-slate-200 group"><div className="flex items-center gap-1">Days Left <ArrowUpDownIcon className="opacity-0 group-hover:opacity-50" /></div></th>
                  <th className="px-6 py-4">Owner</th>
                  <th className="px-6 py-4">Members</th>
                  <th className="px-6 py-4 cursor-pointer hover:text-gray-700 dark:hover:text-slate-200 group"><div className="flex items-center gap-1">Updated Date <ArrowUpDownIcon className="opacity-0 group-hover:opacity-50" /></div></th>
                  <th className="px-6 py-4 cursor-pointer hover:text-gray-700 dark:hover:text-slate-200 group"><div className="flex items-center gap-1">Profiles <ArrowUpDownIcon className="opacity-0 group-hover:opacity-50" /></div></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                {filteredCampaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-green-50/10 dark:hover:bg-slate-700/30 transition-colors group relative cursor-pointer" onClick={() => handleCampaignClick(camp)}>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500 dark:bg-slate-700 dark:border-slate-600" /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {camp.isNew && (
                          <div className="relative">
                            <span className="absolute -top-4 -left-2 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-md rounded-tl-md shadow-sm z-10 transform -rotate-12">New</span>
                          </div>
                        )}

                        {/* Title & Hover Menu Container */}
                        <div
                          className="relative group/title inline-block"
                          onTouchStart={() => handleTouchStart(camp.id)}
                          onTouchEnd={handleTouchEnd}
                        >
                          <button className="font-medium text-blue-600 dark:text-blue-400 hover:underline text-left block max-w-[220px] truncate">
                            {camp.name}
                          </button>
                          {/* Hover Menu positioned to right */}
                          <HoverMenu
                            campaign={camp}
                            onAction={(action) => handleMenuAction(camp.id, action)}
                            isOpenMobile={activeMobileMenu === camp.id}
                          />
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(camp.id); }}
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded transition-colors"
                          >
                            <Heart size={14} className={camp.isFavorite ? "fill-red-500 text-red-500" : ""} />
                          </button>

                          {/* Network Icon - Engage AI Status */}
                          <div className="tooltip z-50">
                            <button onClick={(e) => e.stopPropagation()} className={`p-1 rounded transition-colors 
                                ${camp.engageStatus === 'Green' ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' :
                                camp.engageStatus === 'Yellow' ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' :
                                  'text-slate-300 hover:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}
                             `}>
                              <Network size={14} className={camp.engageStatus === 'Green' || camp.engageStatus === 'Yellow' ? 'fill-current' : ''} />
                            </button>
                            {/* Optional Tooltip logic could go here if tooltip component exists */}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-slate-400">{camp.jobID}</td>
                    <td className={`px-6 py-4 font-medium ${camp.daysLeft < 5 && camp.daysLeft > 0 ? 'text-red-500' : 'text-red-400'}`}>
                      {camp.daysLeft}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${camp.owner.color} border-2 border-white dark:border-slate-700 shadow-sm`} title={camp.owner.name}>
                        {camp.owner.initials}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {camp.members.map((m, i) => (
                          <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${m.color} border-2 border-white dark:border-slate-700 shadow-sm ring-1 ring-white dark:ring-slate-700`} title={m.name}>
                            {m.initials}
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded-full bg-slate-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-700 shadow-sm ring-1 ring-white dark:ring-slate-700">
                          +421
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-slate-400 text-xs">{camp.updatedDate}</td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${camp.profilesCount > 0 ? 'text-blue-600 dark:text-blue-400 hover:underline cursor-pointer' : 'text-gray-400'}`}>
                        {camp.profilesCount}
                      </span>
                    </td>
                  </tr>
                ))}
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-20">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading Campaigns...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredCampaigns.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-400">
                      No campaigns found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 dark:text-slate-400 mt-auto bg-white dark:bg-slate-800 gap-4">
            <span>Total Rows: {loading ? '...' : filteredCampaigns.length}</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span>10 / page</span>
                <ChevronDown size={14} />
              </div>
              <div className="flex items-center gap-2">
                <button className="hover:text-gray-900 dark:hover:text-slate-200 disabled:opacity-50">&lt;</button>
                <button className="w-6 h-6 flex items-center justify-center rounded border border-green-500 text-green-600 font-medium">1</button>
                <button className="hover:text-gray-900 dark:hover:text-slate-200">&gt;</button>
              </div>
              <div className="flex items-center gap-2">
                <span>Go to</span>
                <input type="text" className="w-10 border border-gray-200 dark:border-slate-600 rounded px-1 py-0.5 text-center bg-white dark:bg-slate-700 dark:text-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArrowUpDownIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m21 16-4 4-4-4" /><path d="M17 20V4" /><path d="m3 8 4-4 4 4" /><path d="M7 4v16" />
  </svg>
);
