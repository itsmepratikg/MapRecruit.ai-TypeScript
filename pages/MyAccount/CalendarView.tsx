import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { integrationService } from '../../services/integrationService';
import { RemindersPanel } from './RemindersPanel';
import { EventDetailsModal } from './EventDetailsModal';
import { CalendarSettings } from './CalendarSettings'; // We need this for the modal content, need to refactor or reuse safely
import { Settings, Download, Trash2, ChevronDown, List, MoreVertical } from '../../components/Icons';
import { useToast } from '../../components/Toast';

export const CalendarView = () => {
    const calendarRef = useRef<any>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // To sync list with calendar
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { addToast } = useToast();

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await integrationService.getCalendarEvents();
            if (res.success && res.events) {
                // Transform to FullCalendar Format
                const fcEvents = res.events.map((e: any) => ({
                    id: e._id,
                    title: e.data.summary || 'Untitled',
                    start: e.data.start.dateTime, // ISO String works well
                    end: e.data.end.dateTime,
                    extendedProps: {
                        description: e.data.description,
                        location: e.data.location,
                        link: e.data.link,
                        participants: e.data.participants, // Assuming this data exists in your service
                        timeZoneFullName: 'America/New_York', // Mock since not in minimal interface
                        ...e
                    },
                    backgroundColor: e.provider === 'google' ? '#fff' : '#fff', // White background
                    borderColor: 'transparent',
                    textColor: '#3b82f6', // Blue text per screenshot
                    classNames: ['custom-calendar-event']
                }));
                setEvents(fcEvents);
            }
        } catch (error) {
            console.error("Fetch calendar error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [refreshTrigger]);

    const handleEventClick = (info: any) => {
        const { event } = info;
        setSelectedEvent({
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            extendedProps: event.extendedProps
        });
    };

    // Custom Toolbar Handling
    const handleDatePrev = () => { calendarRef.current?.getApi().prev(); };
    const handleDateNext = () => { calendarRef.current?.getApi().next(); };
    const handleDateToday = () => { calendarRef.current?.getApi().today(); };
    const changeView = (view: string) => { calendarRef.current?.getApi().changeView(view); };

    return (
        <div className="flex h-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
            {/* Main Calendar Area - Flex Grow */}
            <div className="flex-1 flex flex-col h-full min-w-0 bg-white dark:bg-slate-900 m-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

                {/* Custom Toolbar */}
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-900">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-lg">
                            <span className="text-slate-500"><Settings size={20} /></span> My Events
                        </div>

                        <div className="flex bg-emerald-500 rounded-md p-1 gap-1">
                            <button onClick={handleDatePrev} className="text-white hover:bg-emerald-600 rounded px-1"><ChevronDown className="rotate-90" size={16} /></button>
                            <button onClick={handleDateNext} className="text-white hover:bg-emerald-600 rounded px-1"><ChevronDown className="-rotate-90" size={16} /></button>
                        </div>
                        <button onClick={handleDateToday} className="px-3 py-1 bg-slate-500 hover:bg-slate-600 text-white rounded text-sm font-medium transition-colors">today</button>
                    </div>

                    <div className="font-bold text-lg text-slate-700 dark:text-slate-200">
                        {/* We rely on FullCalendar title or just a static buffer, but better to update dynamic title */}
                        {/* Implementing dynamic title requires state sync, omitting for simplicity, defaulting to static month or handling via FC updates */}
                        February 2026
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex bg-emerald-500 rounded-md overflow-hidden text-xs font-bold text-white">
                            <button onClick={() => changeView('dayGridMonth')} className="px-3 py-1.5 hover:bg-emerald-600 border-r border-emerald-400">month</button>
                            <button onClick={() => changeView('timeGridWeek')} className="px-3 py-1.5 hover:bg-emerald-600 border-r border-emerald-400">week</button>
                            <button onClick={() => changeView('timeGridDay')} className="px-3 py-1.5 hover:bg-emerald-600 border-r border-emerald-400">day</button>
                            <button onClick={() => changeView('listWeek')} className="px-3 py-1.5 hover:bg-emerald-600">list</button>
                        </div>

                        <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>

                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-medium"
                        >
                            <Settings size={14} /> Calendar Settings
                        </button>

                        <button className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                            <MoreVertical size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {/* FullCalendar Component */}
                    <style>{`
                        .fc-theme-standard .fc-scrollgrid { border: none; }
                        .fc-col-header-cell-cushion { padding: 8px; font-size: 0.85rem; font-weight: 700; color: #334155; }
                        .fc-daygrid-day-number { font-size: 0.85rem; font-weight: 500; color: #64748b; padding: 4px 8px; }
                        .fc-daygrid-day-top { justify-content: flex-end; }
                        .custom-calendar-event { 
                             font-size: 0.75rem; 
                             border: none !important;
                             padding: 2px 4px;
                             box-shadow: none !important;
                             text-decoration: underline;
                        }
                        .fc-event-main { cursor: pointer; }
                    `}</style>
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={false} // Hiding default toolbar to use custom one
                        events={events}
                        eventClick={handleEventClick}
                        height="100%"
                        dayMaxEvents={true}
                    />
                </div>
            </div>

            {/* Right Side Panel (Reminders) */}
            <RemindersPanel refreshTrigger={refreshTrigger} />

            {/* Event Details Modal */}
            <EventDetailsModal
                isOpen={!!selectedEvent}
                onClose={() => setSelectedEvent(null)}
                event={selectedEvent}
                onUpdate={(e) => {
                    addToast(`Update clicked for ${e.title}`, 'info');
                    setSelectedEvent(null);
                }}
                onDelete={(id) => {
                    addToast(`Delete clicked`, 'error');
                    setSelectedEvent(null);
                }}
            />

            {/* Settings Modal - Using a custom simple modal to wrap existing component or refactor */}
            {/* Settings Modal */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-5xl w-full h-[90vh] overflow-y-auto custom-scrollbar relative">
                        <button onClick={() => setIsSettingsOpen(false)} className="absolute top-4 right-4 z-50 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <span className="sr-only">Close</span>
                            <X size={20} />
                        </button>
                        <CalendarSettings mode="modal" onClose={() => setIsSettingsOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};
