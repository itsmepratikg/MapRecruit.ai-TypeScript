
import React, { useState } from 'react';
import { History, ChevronRight, Clock, Monitor, Layout, Search, Briefcase, Shield, Users, Settings } from '../../components/Icons';

// Navigation Data with Targets
const HISTORY_ITEMS_BASE = [
  { title: 'Dashboard', path: 'Home', action: 'NAV', payload: { view: 'DASHBOARD' }, icon: Layout },
  { title: 'Campaign: Senior Frontend Dev', path: 'Campaigns / Active / Details', action: 'NAV', payload: { view: 'CAMPAIGNS' }, icon: Briefcase }, 
  { title: 'Profile: Sarah Jenkins', path: 'Profiles / Search / Details', action: 'CANDIDATE', payload: { id: 1 }, icon: Users },
  { title: 'Settings: Roles & Permissions', path: 'Settings / Roles', action: 'NAV', payload: { view: 'SETTINGS', settingsTab: 'ROLES' }, icon: Shield },
  { title: 'Search: "Java Developer"', path: 'Profiles / Search', action: 'NAV', payload: { view: 'PROFILES', subView: 'SEARCH' }, icon: Search },
  { title: 'User Management', path: 'Settings / Users', action: 'NAV', payload: { view: 'SETTINGS', settingsTab: 'USERS' }, icon: Settings }
];

const FULL_HISTORY_DATA = Array.from({ length: 50 }).map((_, i) => {
    const base = HISTORY_ITEMS_BASE[i % 6];
    return {
        id: i + 1,
        ...base,
        time: `${Math.floor(i / 2) + 1} ${i % 2 === 0 ? 'mins' : 'hours'} ago`
    };
});

interface PreviousHistoryProps {
    onNavigate?: (type: string, payload?: any) => void;
}

export const PreviousHistory = ({ onNavigate }: PreviousHistoryProps) => {
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  const displayItems = FULL_HISTORY_DATA.slice(0, itemsPerPage);

  const handleClick = (item: typeof FULL_HISTORY_DATA[0]) => {
      if (onNavigate) {
          onNavigate(item.action, item.payload);
      }
  };

  return (
    <div className="p-6 lg:p-12 h-full bg-slate-50 dark:bg-slate-900 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-200 dark:border-slate-700 pb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
              <History size={24} className="text-emerald-500" />
              Browsing History
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Quickly navigate back to your recently visited pages.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2">Show:</span>
            {[5, 10, 25, 50].map(count => (
              <button
                key={count}
                onClick={() => setItemsPerPage(count)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${itemsPerPage === count ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          {displayItems.map((item, index) => (
            <div 
              key={item.id} 
              onClick={() => handleClick(item)}
              className={`flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer ${index !== displayItems.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <item.icon size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    {item.path}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Clock size={12} /> {item.time}
                </span>
                <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Showing {displayItems.length} most recent pages
        </p>

      </div>
    </div>
  );
};
