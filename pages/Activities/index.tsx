
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Activity, Clock, FileText, CheckCircle, User, Settings, Filter, 
  Calendar, ChevronDown, Search, X, CheckSquare, Square, RefreshCw 
} from '../../components/Icons';

// --- Constants ---

const ACTIVITY_FILTER_OPTIONS = [
  "Table Downloaded",
  "Contact Details Viewed",
  "Duplicate Profiles Check",
  "Accessibility Settings Updated",
  "Campaign Members Updated",
  "Campaign Created",
  "Communication Channel Updated",
  "Started Survey Round",
  "Added New Round",
  "Updated Role",
  "Job Status Updated",
  "Completed Survey Round",
  "Started Screening Round",
  "Profile Linked",
  "Round Edited",
  "Sent Time Slot Selection Mail",
  "Email Opt-Out",
  "Candidate Requested",
  "Question Created",
  "Completed Screening Round",
  "Selected Meeting Time Slot",
  "Job Created"
];

// Helper to get relative time for display, but we filter on real dates
const getTimeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "Just now";
};

// Mock Data with specific types and ISO dates for filtering
const ACTIVITIES_DATA = [
  { id: 1, action: 'Contact Details Viewed', detail: 'Deanthony Quarterman', date: new Date(Date.now() - 1000 * 60 * 10).toISOString(), type: 'view', icon: User },
  { id: 2, action: 'Campaign Created', detail: 'Senior React Developer (CAM-2025-FE)', date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), type: 'create', icon: CheckCircle },
  { id: 3, action: 'Accessibility Settings Updated', detail: 'Changed contrast settings', date: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), type: 'settings', icon: Settings },
  { id: 4, action: 'Table Downloaded', detail: 'Candidate list for "Warehouse Ops"', date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), type: 'export', icon: Activity },
  { id: 5, action: 'Communication Channel Updated', detail: 'Enabled SMS notifications', date: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), type: 'settings', icon: Settings },
  { id: 6, action: 'Started Screening Round', detail: 'Sarah Connors', date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), type: 'view', icon: FileText },
  { id: 7, action: 'Added New Round', detail: 'Added "Tech Interview" to workflow', date: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(), type: 'create', icon: FileText },
  { id: 8, action: 'Profile Linked', detail: 'Linked 3 profiles to Campaign A', date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), type: 'create', icon: FileText },
  { id: 9, action: 'Email Opt-Out', detail: 'Candidate requested unsubscribe', date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), type: 'settings', icon: Settings },
  { id: 10, action: 'Job Created', detail: 'Warehouse Manager', date: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), type: 'create', icon: CheckCircle },
];

export const Activities = () => {
  // --- Filter State ---
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  
  // --- UI State ---
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [typeSearch, setTypeSearch] = useState('');
  
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)) {
        setIsDateDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Handlers ---

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleQuickDate = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    setDateRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    });
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setDateRange({ start: '', end: '' });
    setTypeSearch('');
  };

  // --- Filter Logic ---

  const filteredActivities = useMemo(() => {
    return ACTIVITIES_DATA.filter(item => {
      // 1. Type Filter
      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(item.action);
      
      // 2. Date Filter
      let dateMatch = true;
      if (dateRange.start) {
        const itemDate = new Date(item.date);
        const startDate = new Date(dateRange.start);
        startDate.setHours(0, 0, 0, 0); // Start of day
        if (itemDate < startDate) dateMatch = false;
      }
      if (dateRange.end && dateMatch) {
        const itemDate = new Date(item.date);
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999); // End of day
        if (itemDate > endDate) dateMatch = false;
      }

      return typeMatch && dateMatch;
    });
  }, [selectedTypes, dateRange]);

  const displayedFilterTypes = ACTIVITY_FILTER_OPTIONS.filter(t => t.toLowerCase().includes(typeSearch.toLowerCase()));

  return (
    <div className="p-6 lg:p-12 h-full bg-slate-50 dark:bg-slate-900 overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* Header & Controls */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 border-b border-slate-200 dark:border-slate-700 pb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
              <Activity size={24} className="text-emerald-500" />
              User Activities
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Audit log of system events, updates, and interactions.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            
            {/* 1. Activity Type Filter */}
            <div className="relative" ref={typeDropdownRef}>
              <button 
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-sm font-medium transition-colors ${selectedTypes.length > 0 ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                <Filter size={16} />
                <span>{selectedTypes.length > 0 ? `${selectedTypes.length} Selected` : 'Filter Activity'}</span>
                <ChevronDown size={14} />
              </button>

              {isTypeDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in zoom-in-95 duration-100">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search types..." 
                        value={typeSearch}
                        onChange={(e) => setTypeSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-200"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto custom-scrollbar p-2">
                    {displayedFilterTypes.map(type => (
                      <label key={type} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer group">
                        <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${selectedTypes.includes(type) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-800'}`}>
                          {selectedTypes.includes(type) && <CheckCircle size={12} fill="currentColor" />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={selectedTypes.includes(type)}
                          onChange={() => toggleType(type)}
                        />
                        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{type}</span>
                      </label>
                    ))}
                    {displayedFilterTypes.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-4">No types match your search.</p>
                    )}
                  </div>
                  <div className="p-2 border-t border-slate-100 dark:border-slate-700 flex justify-between bg-slate-50 dark:bg-slate-900/50">
                    <button onClick={() => setSelectedTypes([])} className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-2 py-1">Clear</button>
                    <button onClick={() => setIsTypeDropdownOpen(false)} className="text-xs bg-emerald-600 text-white px-3 py-1 rounded font-bold hover:bg-emerald-700">Done</button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Date Range Picker */}
            <div className="relative" ref={dateDropdownRef}>
              <button 
                onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-sm font-medium transition-colors ${dateRange.start || dateRange.end ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                <Calendar size={16} />
                <span>{dateRange.start ? `${dateRange.start} - ${dateRange.end || 'Today'}` : 'Date Range'}</span>
                <ChevronDown size={14} />
              </button>

              {isDateDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in zoom-in-95 duration-100">
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Start Date</label>
                        <input 
                          type="date" 
                          value={dateRange.start}
                          onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                          className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded focus:ring-1 focus:ring-emerald-500 outline-none dark:text-slate-200 dark:[color-scheme:dark]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">End Date</label>
                        <input 
                          type="date" 
                          value={dateRange.end}
                          onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                          className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded focus:ring-1 focus:ring-emerald-500 outline-none dark:text-slate-200 dark:[color-scheme:dark]"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <button onClick={() => handleQuickDate(7)} className="flex-1 py-1.5 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300 font-medium transition-colors">Last 7 Days</button>
                        <button onClick={() => handleQuickDate(30)} className="flex-1 py-1.5 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300 font-medium transition-colors">Last 30 Days</button>
                    </div>
                  </div>
                  <div className="p-3 border-t border-slate-100 dark:border-slate-700 flex justify-between bg-slate-50 dark:bg-slate-900/50">
                    <button onClick={() => { setDateRange({start:'', end:''}); }} className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium">Reset</button>
                    <button onClick={() => setIsDateDropdownOpen(false)} className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded shadow-sm hover:bg-emerald-700">Apply</button>
                  </div>
                </div>
              )}
            </div>

            {/* Clear All Button */}
            {(selectedTypes.length > 0 || dateRange.start) && (
              <button onClick={clearFilters} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Clear Filters">
                <RefreshCw size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Timeline Content */}
        <div className="space-y-6 relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 pl-8 pb-8">
          {filteredActivities.length > 0 ? filteredActivities.map((activity) => (
            <div key={activity.id} className="relative group animate-in slide-in-from-bottom-2 duration-300">
              {/* Timeline Node */}
              <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 z-10 group-hover:border-emerald-500 group-hover:text-emerald-500 transition-colors">
                <activity.icon size={12} />
              </div>

              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{activity.action}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{activity.detail}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                      {getTimeAgo(activity.date)}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(activity.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Filter size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No activities found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Try adjusting your filters to see results.</p>
              <button onClick={clearFilters} className="mt-4 text-sm font-bold text-emerald-600 hover:underline">Clear all filters</button>
            </div>
          )}
        </div>

        {filteredActivities.length > 0 && (
          <div className="text-center pt-4">
            <button className="text-sm text-emerald-600 dark:text-emerald-400 font-medium hover:underline">Load more activity</button>
          </div>
        )}

      </div>
    </div>
  );
};
