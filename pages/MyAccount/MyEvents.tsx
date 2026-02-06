import React, { useEffect, useState } from 'react';
import { integrationService } from '../../services/integrationService';
import { Calendar, RefreshCw, Clock, ExternalLink, AlertCircle } from '../../components/Icons';
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

export const MyEvents = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const { addToast } = useToast();

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const res = await integrationService.getCalendarEvents();
            if (res.success) {
                setEvents(res.events || []);
            }
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

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

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">My Synced Events</h3>
                    <p className="text-sm text-slate-500">Upcoming events from your connected calendars.</p>
                </div>
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800"
                >
                    <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
                    {isSyncing ? "Syncing..." : "Sync Now"}
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <RefreshCw size={32} className="animate-spin mb-4 text-emerald-500" />
                    <p>Loading events...</p>
                </div>
            ) : events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <Calendar size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-slate-900 dark:text-white font-medium">No events found</p>
                    <p className="text-slate-500 text-sm mt-1">Connect your Google Calendar or click Sync Now.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {events.map(event => (
                        <div key={event._id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4">
                            <div className="flex-shrink-0 w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex flex-col items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                <span className="text-xs font-bold uppercase">{new Date(event.data.start.dateTime).toLocaleString('default', { month: 'short' })}</span>
                                <span className="text-xl font-bold">{new Date(event.data.start.dateTime).getDate()}</span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <h4 className="text-base font-semibold text-slate-900 dark:text-white truncate pr-4">{event.data.summary}</h4>
                                    {event.provider === 'google' && (
                                        <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                            Google
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} />
                                        <span>
                                            {formatDate(event.data.start.dateTime)} - {new Date(event.data.end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    {event.data.location && (
                                        <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span className="truncate">{event.data.location}</span>
                                        </div>
                                    )}
                                </div>
                                {event.data.link && (
                                    <a href={event.data.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline">
                                        View in {event.provider === 'google' ? 'Calendar' : 'Outlook'} <ExternalLink size={12} />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
