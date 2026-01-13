
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, Clock, X, Check, Filter, Search, ChevronDown, CheckSquare, Square, RefreshCw } from '../../components/Icons';

// Constants
const NOTIFICATION_TYPES = [
    "In-person interview Reminder",
    "JobBoards Search Executed",
    "User added to Campaign",
    "Profiles Uploaded",
    "Campaign Slots expiring soon",
    "Campaign Slots Exhausted",
    "Campaign Closed",
    "Campaign Created",
    "Folder Shared",
    "Interview Completed",
    "Slot Booked",
    "Slot Cancelled",
    "Slot Rescheduled",
    "Rescheduled to New Host",
    "Link Campaign",
    "Link Campaign Folder",
    "Link Folder",
    "Video Interview Reminder",
    "Phone Interview Reminder",
    "Resumes Parsed",
    "Profile Shared",
    "Unlinked from Campaign",
    "Unlinked from Campaign Folder",
    "Slot Booked without Campaign"
];

// Updated Data with matching types
const NOTIFICATIONS_DATA = [
  { id: 1, title: 'Slot Booked', message: 'Deanthony Quarterman accepted the interview invite for tomorrow at 2:00 PM.', time: '10 mins ago', type: 'success', read: false },
  { id: 2, title: 'Campaign Slots expiring soon', message: 'The "Senior Frontend Dev" campaign is running low on interview slots.', time: '1 hour ago', type: 'warning', read: false },
  { id: 3, title: 'JobBoards Search Executed', message: 'AI found a 98% match for your "Product Manager" role from LinkedIn.', time: '3 hours ago', type: 'info', read: true },
  { id: 4, title: 'Campaign Created', message: 'New campaign "Q3 Sales Drive" was successfully created.', time: 'Yesterday', type: 'success', read: true },
  { id: 5, title: 'Slot Cancelled', message: 'Candidate John Doe cancelled their interview slot.', time: 'Yesterday', type: 'error', read: true },
  { id: 6, title: 'Interview Completed', message: 'Review feedback for candidate Sarah Jenkins.', time: '2 days ago', type: 'info', read: true },
  { id: 7, title: 'Profiles Uploaded', message: 'Import of 50 profiles from Excel completed.', time: '2 days ago', type: 'success', read: true },
];

interface NotificationsProps {
    onNavigate?: (view: string, config?: any) => void;
}

export const Notifications = ({ onNavigate }: NotificationsProps) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
              setIsFilterOpen(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleType = (type: string) => {
      setSelectedTypes(prev => 
          prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
      );
  };

  const clearFilters = () => {
      setSelectedTypes([]);
      setFilterSearch('');
  };

  const filteredNotifications = useMemo(() => {
      if (selectedTypes.length === 0) return NOTIFICATIONS_DATA;
      return NOTIFICATIONS_DATA.filter(n => selectedTypes.includes(n.title));
  }, [selectedTypes]);

  const displayedFilterOptions = NOTIFICATION_TYPES.filter(t => t.toLowerCase().includes(filterSearch.toLowerCase()));

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle size={20} className="text-emerald-500" />;
      case 'warning': return <AlertTriangle size={20} className="text-amber-500" />;
      case 'error': return <AlertTriangle size={20} className="text-red-500" />;
      default: return <Info size={20} className="text-blue-500" />;
    }
  };

  const getBgColor = (type: string, read: boolean) => {
    if (read) return 'bg-white dark:bg-slate-800';
    switch(type) {
      case 'success': return 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800';
      case 'warning': return 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800';
      case 'error': return 'bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-800';
      default: return 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800';
    }
  };

  return (
    <div className="p-6 lg:p-12 h-full bg-slate-50 dark:bg-slate-900 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-200 dark:border-slate-700 pb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
              <Bell size={24} className="text-emerald-500" />
              Notifications
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your alerts and system messages.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
              {/* Filter Dropdown */}
              <div className="relative" ref={filterDropdownRef}>
                  <button 
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className={`flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-sm font-medium transition-colors ${selectedTypes.length > 0 ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                  >
                      <Filter size={16} />
                      <span>{selectedTypes.length > 0 ? `${selectedTypes.length} Filters` : 'Filter Notifications'}</span>
                      <ChevronDown size={14} />
                  </button>

                  {isFilterOpen && (
                      <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in zoom-in-95 duration-100">
                          <div className="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                              <div className="relative">
                                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                                  <input 
                                      type="text" 
                                      placeholder="Search types..." 
                                      value={filterSearch}
                                      onChange={(e) => setFilterSearch(e.target.value)}
                                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-200"
                                      autoFocus
                                  />
                              </div>
                          </div>
                          <div className="max-h-60 overflow-y-auto custom-scrollbar p-2">
                              {displayedFilterOptions.map(type => (
                                  <label key={type} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer group">
                                      <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors shrink-0 ${selectedTypes.includes(type) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-800'}`}>
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
                              {displayedFilterOptions.length === 0 && (
                                  <p className="text-xs text-slate-400 text-center py-4">No types found.</p>
                              )}
                          </div>
                          <div className="p-2 border-t border-slate-100 dark:border-slate-700 flex justify-between bg-slate-50 dark:bg-slate-900/50">
                              <button onClick={() => setSelectedTypes([])} className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-2 py-1">Clear</button>
                              <button onClick={() => setIsFilterOpen(false)} className="text-xs bg-emerald-600 text-white px-3 py-1 rounded font-bold hover:bg-emerald-700">Done</button>
                          </div>
                      </div>
                  )}
              </div>

              {selectedTypes.length > 0 && (
                  <button onClick={clearFilters} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Clear All Filters">
                      <RefreshCw size={16} />
                  </button>
              )}

              <button className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 ml-auto">
                  <Check size={16} /> Mark all as read
              </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredNotifications.length > 0 ? filteredNotifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-4 rounded-xl border transition-all hover:shadow-md ${getBgColor(notif.type, notif.read)} ${notif.read ? 'border-slate-200 dark:border-slate-700' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full shrink-0 ${notif.read ? 'bg-slate-100 dark:bg-slate-700' : 'bg-white dark:bg-slate-800 shadow-sm'}`}>
                  {getTypeIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className={`text-sm font-bold ${notif.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-slate-100'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-xs text-slate-400 flex items-center gap-1 whitespace-nowrap">
                      <Clock size={12} /> {notif.time}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${notif.read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {notif.message}
                  </p>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                  <X size={16} />
                </button>
              </div>
            </div>
          )) : (
              <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <Bell size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No notifications found</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Try adjusting your filters.</p>
                  <button onClick={clearFilters} className="mt-4 text-sm font-bold text-emerald-600 hover:underline">Clear Filters</button>
              </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center text-xs text-slate-500 dark:text-slate-400">
          Notification settings can be configured in <button onClick={() => onNavigate && onNavigate('MY_ACCOUNT', { accountTab: 'USER_NOTIFICATIONS' })} className="text-emerald-600 hover:underline font-bold">My Account &gt; User Notifications</button>
        </div>

      </div>
    </div>
  );
};
