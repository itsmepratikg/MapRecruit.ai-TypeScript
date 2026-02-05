
import React, { useState } from 'react';
import { History, Calendar, Filter } from 'lucide-react';
import { useActivities } from '../../../hooks/useActivities';
import { useParams } from 'react-router-dom';
import { Activity } from '../../../types/Activity';
import { ActivityItem } from '../../../components/ActivityItem';


export const ActivityLog = () => {
    const { id: campaignID } = useParams<{ id: string }>();

    // Get Company ID
    const getUserCompanyID = () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                return user.currentCompanyID || user.companyID || user.companyId;
            }
        } catch (e) { console.error(e); }
        return undefined;
    };
    const companyID = getUserCompanyID();

    const { activities, loading, error } = useActivities({
        campaignID, // If campaignID is present, hook attempts to filter by it
        limit: 100
    });

    // Filter State
    const [filterType, setFilterType] = useState<string>('');
    const [dateRange, setDateRange] = useState<{ start: string, end: string }>({ start: '', end: '' });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // 1. Get Unique Activity Types
    const uniqueTypes = Array.from(new Set(activities.map(a => a.activityType))).sort();

    // 2. Strict Client-Side Filter
    const filteredActivities = activities.filter(act => {
        if (companyID && act.companyID !== companyID) return false;

        // Ensure campaign ID match if param exists (handles array or string)
        if (campaignID && act.campaignID) {
            const hasMatch = Array.isArray(act.campaignID)
                ? act.campaignID.some((id: any) => (typeof id === 'object' ? id._id : id) === campaignID)
                : act.campaignID === campaignID;
            if (!hasMatch) return false;
        }

        // Feature Filters
        if (filterType && act.activityType !== filterType) return false;
        if (dateRange.start) {
            const actDate = new Date(act.activityAt || act.createdAt);
            if (actDate < new Date(dateRange.start)) return false;
        }
        if (dateRange.end) {
            const actDate = new Date(act.activityAt || act.createdAt);
            const endDate = new Date(dateRange.end);
            endDate.setHours(23, 59, 59, 999);
            if (actDate > endDate) return false;
        }

        return true;
    });

    // 3. Group by Date
    const groupedActivities: Record<string, Activity[]> = {};
    filteredActivities.forEach(act => {
        const date = new Date(act.activityAt || act.createdAt);
        // Format: "Monday, 30 June 2025"
        const dateKey = date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        if (!groupedActivities[dateKey]) {
            groupedActivities[dateKey] = [];
        }
        groupedActivities[dateKey].push(act);
    });

    if (loading) return <div className="p-8 text-center text-slate-500">Loading activities...</div>;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-full overflow-hidden flex flex-col transition-colors">

            {/* Header & Filters */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/50 dark:bg-slate-900/50 gap-4">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <History size={18} className="text-blue-500" /> Recent Activity
                </h3>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {/* Type Select */}
                    <select
                        className="px-2 py-1.5 text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-600 dark:text-slate-200"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="">All Types</option>
                        {uniqueTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`text-xs flex items-center gap-1 border px-2 py-1.5 rounded-lg transition-colors ${isFilterOpen || dateRange.start ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' : 'bg-white border-slate-200 text-slate-500 hover:text-blue-600 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300'}`}
                    >
                        <Filter size={12} /> Filter
                    </button>
                </div>
            </div>

            {/* Date Details Panel */}
            {(isFilterOpen || dateRange.start || dateRange.end) && (
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-700 flex flex-wrap items-end gap-3 transition-colors animate-in slide-in-from-top-2">
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Start Date</label>
                        <input
                            type="date"
                            className="px-2 py-1.5 text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 dark:text-slate-200 dark:[color-scheme:dark]"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">End Date</label>
                        <input
                            type="date"
                            className="px-2 py-1.5 text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 dark:text-slate-200 dark:[color-scheme:dark]"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        />
                    </div>
                    <button
                        onClick={() => { setDateRange({ start: '', end: '' }); setIsFilterOpen(false); }}
                        className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                        Clear
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {filteredActivities.length === 0 && (
                    <div className="text-center text-slate-500 dark:text-slate-400 text-sm py-4">
                        No recent activity found matching criteria.
                    </div>
                )}

                {Object.entries(groupedActivities).map(([dateLabel, acts], gIdx) => (
                    <div key={dateLabel} className="relative animate-in fade-in duration-500" style={{ animationDelay: `${gIdx * 50}ms` }}>
                        <div className="sticky top-0 z-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur pb-2 mb-4 border-b border-slate-100 dark:border-slate-700">
                            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                {dateLabel}
                            </h4>
                        </div>
                        <div className="space-y-0">
                            {acts.map((act, idx) => (
                                <ActivityItem key={act._id || idx} activity={act} index={idx} viewContext="campaign" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
