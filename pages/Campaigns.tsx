import React, { useState, useRef } from 'react';
import { 
  Briefcase, Lock, Archive, Search, ChevronDown, RefreshCw, MoreVertical, HelpCircle, 
  Heart, Share2, Network, ChevronRight, CheckCircle, PlusCircle, Users, Link, FileText, X
} from '../components/Icons';
import { GLOBAL_CAMPAIGNS } from '../data';
import { Campaign } from '../types';
import { useToast } from '../components/Toast';

// --- MAIN COMPONENTS ---

const CampaignStats = ({ activeTab, onTabChange, counts }: { activeTab: string, onTabChange: (tab: string) => void, counts: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div 
      onClick={() => onTabChange('Active')}
      className={`p-6 rounded-xl shadow-sm border cursor-pointer transition-all ${activeTab === 'Active' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-white dark:bg-slate-800' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800'}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-100">{counts.active}</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Active Campaigns</p>
        </div>
        <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-xl">
          <Briefcase size={32} className="text-gray-400 dark:text-slate-400" />
        </div>
      </div>
    </div>
    <div 
      onClick={() => onTabChange('Closed')}
      className={`p-6 rounded-xl shadow-sm border cursor-pointer transition-all ${activeTab === 'Closed' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-white dark:bg-slate-800' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800'}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-green-500">{counts.closed}</h2>
          <p className="text-sm text-green-600 font-medium">Closed Campaigns</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-xl">
          <Lock size={32} className="text-green-600 dark:text-green-400" />
        </div>
      </div>
    </div>
    <div 
      onClick={() => onTabChange('Archived')}
      className={`p-6 rounded-xl shadow-sm border cursor-pointer transition-all ${activeTab === 'Archived' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-white dark:bg-slate-800' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800'}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-green-700 dark:text-green-500">{counts.archived}</h2>
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">Archived Campaigns</p>
        </div>
        <div className="bg-green-500 p-4 rounded-xl">
          <Archive size={32} className="text-white" />
        </div>
      </div>
    </div>
  </div>
);

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

const HoverMenu = ({ campaign, onAction, isOpenMobile }: { campaign: Campaign, onAction: (action: string) => void, isOpenMobile?: boolean }) => {
  return (
    <div className={`absolute left-full top-0 ml-4 z-50 animate-in fade-in zoom-in-95 duration-200 w-56 ${isOpenMobile ? 'block' : 'hidden group-hover/title:block'}`}>
      {/* Connector triangle */}
      <div className="absolute top-3 -left-2 w-4 h-4 bg-white dark:bg-slate-800 transform rotate-45 border-l border-b border-gray-100 dark:border-slate-700 shadow-sm"></div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden relative">
        <div className="px-4 py-3 border-b border-gray-50 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
           <h4 className="font-bold text-gray-800 dark:text-slate-100 text-sm truncate" title={campaign.name}>{campaign.name}</h4>
        </div>
        <div className="py-1">
           <button 
             onClick={(e) => { e.stopPropagation(); onAction('INTELLIGENCE'); }}
             className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-slate-700 hover:text-green-700 dark:hover:text-green-400 transition-colors"
           >
              Intelligence
           </button>
           
           {/* Source AI Group */}
           <div className="group/submenu relative">
             <button 
                onClick={(e) => e.stopPropagation()} 
                className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-slate-300 group-hover/submenu:bg-sky-50 dark:group-hover/submenu:bg-slate-700 group-hover/submenu:text-green-600 dark:group-hover/submenu:text-green-400 transition-colors flex justify-between items-center"
             >
                <span>Source AI</span>
                <ChevronRight size={14} className="text-gray-400 group-hover/submenu:text-green-600 dark:group-hover/submenu:text-green-400" />
             </button>
             {/* Nested Menu for Source AI */}
             <div className="hidden group-hover/submenu:block absolute left-full top-0 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 ml-1 py-1">
                <button onClick={(e) => { e.stopPropagation(); onAction('ATTACH_PEOPLE'); }} className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-slate-700 hover:text-green-700 dark:hover:text-green-400">Attach People</button>
                <button onClick={(e) => { e.stopPropagation(); onAction('ATTACHED_PROFILES'); }} className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-slate-700 hover:text-green-700 dark:hover:text-green-400">Attached Profiles</button>
                <button onClick={(e) => { e.stopPropagation(); onAction('INTEGRATIONS'); }} className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-slate-700 hover:text-green-700 dark:hover:text-green-400">Integrations</button>
                <button onClick={(e) => { e.stopPropagation(); onAction('JOB_DESC'); }} className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-slate-700 hover:text-green-700 dark:hover:text-green-400">Job Description</button>
             </div>
           </div>

           <button 
             onClick={(e) => { e.stopPropagation(); onAction('MATCH_AI'); }}
             className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-slate-700 hover:text-green-700 dark:hover:text-green-400 transition-colors"
           >
              Match AI
           </button>
           <button 
             onClick={(e) => { e.stopPropagation(); onAction('ENGAGE_AI'); }}
             className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-slate-700 hover:text-green-700 dark:hover:text-green-400 transition-colors"
           >
              Engage AI
           </button>
           <button 
             onClick={(e) => { e.stopPropagation(); onAction('RECOMMENDED'); }}
             className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-slate-700 hover:text-green-700 dark:hover:text-green-400 transition-colors"
           >
              Recommended Profiles
           </button>
        </div>
      </div>
    </div>
  );
};

interface CampaignsProps {
  onNavigateToCampaign: (campaign: Campaign, tab?: string) => void;
}

export const Campaigns: React.FC<CampaignsProps> = ({ onNavigateToCampaign }) => {
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('Active');
  
  // Mobile Long Press State
  const [activeMobileMenu, setActiveMobileMenu] = useState<number | null>(null);
  const longPressTimer = useRef<any>(null);

  const [campaigns, setCampaigns] = useState<Campaign[]>(GLOBAL_CAMPAIGNS);

  const filteredCampaigns = campaigns.filter(c => {
    // 1. Filter by Tab (Active/Closed/Archived)
    if (c.status !== activeTab) return false;

    // 2. Filter by Search
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.jobID.includes(searchQuery);
    if (!matchesSearch) return false;

    // 3. Filter by Dropdown
    let matchesDropdown = true;
    if (activeFilter === 'Created by Me') matchesDropdown = true; // Mock logic
    if (activeFilter === 'Shared with Me') matchesDropdown = false; 
    if (activeFilter === 'Favorites') matchesDropdown = c.isFavorite || false;
    if (activeFilter === 'New') matchesDropdown = c.isNew || false;
    
    return matchesDropdown;
  });

  const handleMenuAction = (campaignId: number, action: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
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

  const toggleFavorite = (id: number) => {
    setCampaigns(prev => prev.map(c => {
        if (c.id === id) {
            const newVal = !c.isFavorite;
            addToast(newVal ? "Campaign added to favorites" : "Campaign removed from favorites", "success");
            return { ...c, isFavorite: newVal };
        }
        return c;
    }));
  };

  const counts = {
      active: campaigns.filter(c => c.status === 'Active').length,
      closed: campaigns.filter(c => c.status === 'Closed').length,
      archived: campaigns.filter(c => c.status === 'Archived').length,
  };

  // --- Long Press Handlers ---
  const handleTouchStart = (id: number) => {
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
  React.useEffect(() => {
      const closeMenu = () => setActiveMobileMenu(null);
      if (activeMobileMenu) window.addEventListener('click', closeMenu);
      return () => window.removeEventListener('click', closeMenu);
  }, [activeMobileMenu]);

  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 dark:bg-slate-900 transition-colors custom-scrollbar">
      <div className="p-4 lg:p-8 max-w-[1600px] mx-auto min-h-screen">
      <CampaignStats activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />

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
        <div className="overflow-x-auto flex-1 w-full">
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
                           <button onClick={(e) => e.stopPropagation()} className="text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 p-1 rounded transition-colors"><Network size={14} /></button>
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
              {filteredCampaigns.length === 0 && (
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
           <span>Total Rows: {filteredCampaigns.length}</span>
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
      <path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/>
   </svg>
);