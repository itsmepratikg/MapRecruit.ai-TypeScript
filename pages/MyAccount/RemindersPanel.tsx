import React, { useEffect, useState } from 'react';
import { integrationService } from '../../services/integrationService';
import { Calendar, RefreshCw, Clock, ExternalLink, Plus } from '../../components/Icons';
import { useToast } from '../../components/Toast';

interface CalendarEvent {
    _id: string;
    userId: string;
    provider: 'google' | 'microsoft';
    externalId: string;
    data: {
        summary: string;
        description?: string;
        start: { dateTime: string; timeZone?: string };
        end: { dateTime: string; timeZone?: string };
        link?: string;
        location?: string;
        status?: string;
    };
    lastSynced: string;
}

interface RemindersPanelProps {
    refreshTrigger?: number; // Prop to trigger refresh from parent
}

export const RemindersPanel = ({ refreshTrigger }: RemindersPanelProps) => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const { addToast } = useToast();

    // Utility to parse date properly even if format is wonky
    const getSafeDate = (dateStr: string | undefined) => {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? null : d;
    };

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const res = await integrationService.getCalendarEvents();
            if (res.success) {
                // Filter invalid dates out or handle them
                const validEvents = (res.events || []).filter((e: any) => {
                    return getSafeDate(e.data?.start?.dateTime) && getSafeDate(e.data?.end?.dateTime);
                });
                // Sort by date upcoming
                validEvents.sort((a: any, b: any) => {
                    const dateA = new Date(a.data.start.dateTime).getTime();
                    const dateB = new Date(b.data.start.dateTime).getTime();
                    return dateA - dateB;
                });

                setEvents(validEvents);
            }
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [refreshTrigger]);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await integrationService.syncCalendar();
            addToast("Calendar synced successfully!", "success");
            await fetchEvents();
        } catch (error) {
            console.error("Sync failed", error);
            addToast("Failed to sync calendar.", "error");
        } finally {
            setIsSyncing(false);
        }
    };

    // New Screenshot UI Structure
    // Header for Side Panel
    // List of events card style

    return (
        <div className="flex flex-col h-full border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 w-full lg:w-96 flex-shrink-0 transition-colors">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={() => { }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <span className="sr-only">Close</span>
                        {/* Using X Icon or similar if needed, typically in drawer. Here it's a fixed column title */}
                    </button>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Calendar size={18} /> Reminders
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs px-1.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">?</span>
                    </h3>
                </div>

                <div className="flex items-center gap-2">
                    <button className="text-emerald-600 text-sm font-medium hover:underline">Show All Events</button>
                    <button className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors">
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {/* Pagination Controls / Tabs - mimicking screenshot "Previous" "Upcoming" */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <button className="flex-1 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Previous</button>
                    <button className="flex-1 py-1.5 text-sm font-bold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded shadow-sm transition-colors">Upcoming</button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">

                {isLoading && (
                    <div className="flex justify-center py-8"><RefreshCw className="animate-spin text-emerald-500" /></div>
                )}

                {!isLoading && events.length === 0 && (
                    <div className="text-center py-12 text-slate-500 text-sm">No Upcoming Reminders</div>
                )}

                {events.map((event) => {
                    const startRaw = event.data?.start?.dateTime;
                    const endRaw = event.data?.end?.dateTime;
                    const startDate = getSafeDate(startRaw);
                    const endDate = getSafeDate(endRaw);

                    if (!startDate) return null; // Should be filtered already

                    // Format: Month short, Day numeric
                    const month = startDate.toLocaleString('default', { month: 'short' });
                    const day = startDate.getDate();

                    // Time range
                    const timeRange = `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || ''}`;

                    return (
                        <div key={event._id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all p-3 flex gap-3 group items-center">
                            {/* Date Box */}
                            <div className="h-14 w-14 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex flex-col items-center justify-center border border-emerald-100 dark:border-emerald-800 flex-shrink-0">
                                <div className="text-[10px] font-bold uppercase leading-none mb-0.5">{month}</div>
                                <div className="text-lg font-bold leading-none">{day}</div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-emerald-600 transition-colors">
                                    {event.data.summary || 'No Title'}
                                </h4>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    <Clock size={12} className="flex-shrink-0" />
                                    <span className="truncate">{timeRange}</span>
                                    {event.data.description && <span className="opacity-50">• {event.data.description.substring(0, 15)}...</span>}
                                </div>
                                <div className="text-xs text-blue-500 mt-1 flex items-center gap-1 cursor-pointer hover:underline">
                                    View in Calendar <ExternalLink size={10} />
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Example of "Invalid Date" Handling - if we had bad data, we just skip displaying it or show error logic 
                    Previously was showing "NaN". Now filtered out or parsed safely.
                */}
            </div>

            {/* Footer Pagination or similar */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs text-slate-400">
                <span>Total Rows: {events.length}</span>
                <div className="flex items-center gap-2">
                    <span>25 / page</span>
                    {/* Arrows */}
                </div>
            </div>
        </div>
    );
};
