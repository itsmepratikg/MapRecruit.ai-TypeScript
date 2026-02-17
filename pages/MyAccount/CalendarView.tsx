import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { integrationService } from '../../services/integrationService';
import { RemindersPanel } from './RemindersPanel';
import { EventDetailsModal } from './EventDetailsModal';
import { CreateEventModal } from './CreateEventModal';
import { Settings, ChevronDown, MoreVertical, Search, Plus, Calendar, Clock, Filter, Check } from '../../components/Icons';
import { useToast } from '../../components/Toast';
import { useUserProfile } from '../../hooks/useUserProfile';
import { ConfirmationModal } from '../../components/ConfirmationModal';

const GoogleMeetLogo = ({ className }: { className?: string }) => (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 13.5V8.5C22 7.12 20.88 6 19.5 6H16L12 2L8 6H4.5C3.12 6 2 7.12 2 8.5V18.5C2 19.88 3.12 21 4.5 21H19.5C20.88 21 22 19.88 22 18.5V13.5Z" fill="#00832d" fillOpacity="0" />
        <rect x="2" y="6" width="20" height="15" rx="2" fill="#00ac47" />
        <path d="M17 11.5L22 8V19L17 15.5V11.5Z" fill="#00832d" />
        <path d="M12 11C13.6569 11 15 12.3431 15 14C15 15.6569 13.6569 17 12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11Z" fill="white" />
    </svg>
);

const MicrosoftTeamsLogo = ({ className }: { className?: string }) => (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="20" height="16" rx="2" fill="#5059c9" />
        <path d="M8.5 10H15.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 10V17" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx="17.5" cy="7.5" r="2.5" fill="#5059c9" stroke="white" strokeWidth="2" />
    </svg>
);

interface CalendarViewProps {
    timeZone?: string;
    onOpenSettings?: () => void;
}

export const CalendarView = ({ timeZone = 'local', onOpenSettings }: CalendarViewProps) => {
    const calendarRef = useRef<any>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [calendarTitle, setCalendarTitle] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editEvent, setEditEvent] = useState<any>(null);
    const { addToast } = useToast();
    const { userProfile } = useUserProfile();
    const currentUserEmail = userProfile?.email;

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        isDelete?: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { }
    });

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await integrationService.getCalendarEvents();
            if (res.success && res.events) {
                const now = new Date();
                const fcEvents = res.events.map((e: any) => {
                    const startTime = new Date(e.data.start.dateTime || e.data.start.date);
                    const endTime = new Date(e.data.end.dateTime || e.data.end.date);
                    const hasPassed = endTime < now;

                    const organizerEmail = e.data.organizer?.email || e.data.creator?.email;
                    const attendees = e.data.attendees || [];
                    const isOrganizer = organizerEmail === currentUserEmail;
                    const isGuest = !isOrganizer && attendees.some((a: any) => a.email === currentUserEmail);
                    const isSelfOnly = attendees.length <= 1;

                    let colorTheme = { bg: '#EBF5FF', text: '#2563EB', border: '#3B82F6' };

                    if (isSelfOnly) {
                        colorTheme = { bg: '#F0FDF4', text: '#16A34A', border: '#22C55E' };
                    } else if (isOrganizer) {
                        colorTheme = { bg: '#FFF7ED', text: '#C2410C', border: '#F97316' };
                    } else if (isGuest) {
                        colorTheme = { bg: '#EFF6FF', text: '#1D4ED8', border: '#3B82F6' };
                    }

                    if (hasPassed) {
                        colorTheme.bg = colorTheme.bg.includes('#') ? colorTheme.bg + '80' : colorTheme.bg;
                    }

                    return {
                        id: e._id,
                        title: e.data.summary || 'Untitled',
                        start: e.data.start.dateTime || e.data.start.date,
                        end: e.data.end.dateTime || e.data.end.date,
                        allDay: !e.data.start.dateTime,
                        extendedProps: {
                            description: e.data.description,
                            location: e.data.location,
                            link: e.data.link,
                            participants: e.data.participants,
                            attendees: e.data.attendees,
                            attachments: e.data.attachments,
                            ...e
                        },
                        backgroundColor: colorTheme.bg,
                        textColor: colorTheme.text,
                        borderColor: 'transparent',
                        classNames: [
                            'custom-calendar-event',
                            'rounded-lg',
                            'px-2',
                            'py-1',
                            'shadow-sm',
                            'border-l-4',
                            hasPassed ? 'opacity-60' : 'opacity-100'
                        ],
                        style: { borderLeftColor: colorTheme.border }
                    };
                });
                setEvents(fcEvents);
            }
        } catch (error) {
            console.error("Fetch calendar error", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = events.filter(e =>
        e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.extendedProps?.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const businessHours = userProfile?.calendarSettings?.weeklyHours?.map((wh: any) => ({
        daysOfWeek: wh.day === 'Monday' ? [1] : wh.day === 'Tuesday' ? [2] : wh.day === 'Wednesday' ? [3] : wh.day === 'Thursday' ? [4] : wh.day === 'Friday' ? [5] : wh.day === 'Saturday' ? [6] : [0],
        startTime: wh.timings?.[0]?.startTime || '09:00',
        endTime: wh.timings?.[0]?.endTime || '17:00'
    })) || { daysOfWeek: [1, 2, 3, 4, 5], startTime: '09:00', endTime: '18:00' };

    const holidayEvents = [
        ...(userProfile?.calendarSettings?.holidays?.map((h: any) => ({
            title: h.name,
            start: h.date,
            allDay: true,
            display: 'background',
            backgroundColor: '#f1f5f9',
            classNames: ['holiday-bg']
        })) || []),
        // Add Weekends as grey background
        {
            daysOfWeek: [0, 6], // Sunday and Saturday
            display: 'background',
            backgroundColor: '#f8fafc',
            classNames: ['holiday-bg', 'weekend-bg']
        }
    ];

    useEffect(() => {
        fetchEvents();
    }, [refreshTrigger]);

    useEffect(() => {
        const notifiedEvents = new Set<string>();
        const checkUpcoming = () => {
            const now = new Date();
            events.forEach(event => {
                const start = new Date(event.start);
                const diffMin = (start.getTime() - now.getTime()) / (1000 * 60);

                if (diffMin > 0 && diffMin <= 5 && !notifiedEvents.has(event.id)) {
                    notifiedEvents.add(event.id);
                    const meetLink = event.extendedProps?.hangoutLink || event.extendedProps?.data?.hangoutLink;
                    addToast(
                        `Meeting starts in ${Math.round(diffMin)} mins: ${event.title}`,
                        'info'
                    );
                    if (meetLink) {
                        setTimeout(() => {
                            window.open(meetLink, '_blank');
                        }, 2000);
                    }
                }
            });
        };

        const interval = setInterval(checkUpcoming, 30000);
        return () => clearInterval(interval);
    }, [events, addToast]);

    useEffect(() => {
        const updateTime = () => {
            const indicator = document.querySelector('.fc-timegrid-now-indicator-line');
            if (indicator) {
                const now = new Date();
                const timeStr = now.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: timeZone === 'local' ? undefined : timeZone
                });
                indicator.setAttribute('data-time', timeStr);
            }
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, [events, timeZone]);

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

    const handleDateSelect = (selectInfo: any) => {
        setIsCreateModalOpen(true);
    };

    const handleDatesSet = (dateInfo: any) => {
        setCalendarTitle(dateInfo.view.title);
    };

    const handleDatePrev = () => { calendarRef.current?.getApi().prev(); };
    const handleDateNext = () => { calendarRef.current?.getApi().next(); };
    const handleDateToday = () => { calendarRef.current?.getApi().today(); };
    const changeView = (view: string) => { calendarRef.current?.getApi().changeView(view); };

    const renderEventContent = (eventInfo: any) => {
        const { event, timeText } = eventInfo;
        const isGoogleMeet = event.extendedProps?.hangoutLink || event.extendedProps?.data?.hangoutLink || (event.extendedProps?.location && event.extendedProps.location.includes('google.com'));
        const isTeams = (event.extendedProps?.location && event.extendedProps.location.includes('teams.microsoft.com')) || event.extendedProps?.data?.conferences?.some((c: any) => c.solutionType === 'microsoftTeams');

        return (
            <div className="flex flex-col h-full overflow-hidden leading-tight p-0.5">
                <div className="flex items-center gap-1">
                    {timeText && <span className="text-[10px] font-bold opacity-90 whitespace-nowrap">{timeText}</span>}
                    {isGoogleMeet && <GoogleMeetLogo className="flex-shrink-0" />}
                    {isTeams && <MicrosoftTeamsLogo className="flex-shrink-0" />}
                </div>
                <div className="truncate font-semibold text-xs mt-0.5">{event.title}</div>
            </div>
        );
    };

    return (
        <div className="flex h-full bg-[#f8fafc] dark:bg-slate-950 overflow-hidden font-sans">
            <div className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full flex-shrink-0 animate-in slide-in-from-left duration-300">
                <div className="p-6 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-slate-700 dark:text-slate-200 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Navigation</h4>
                            <div className="flex gap-1">
                                <button onClick={handleDatePrev} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-all border border-transparent hover:border-slate-200">
                                    <ChevronDown size={14} className="rotate-90" />
                                </button>
                                <button onClick={handleDateNext} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-all border border-transparent hover:border-slate-200">
                                    <ChevronDown size={14} className="-rotate-90" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={handleDateToday}
                                className="w-full py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg transition-all"
                            >
                                Go to Today
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'dayGridMonth', label: 'Month' },
                                { id: 'timeGridWeek', label: 'Week' },
                                { id: 'timeGridDay', label: 'Day' }
                            ].map((view) => (
                                <button
                                    key={view.id}
                                    onClick={() => changeView(view.id)}
                                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${calendarRef.current?.getApi().view.type === view.id
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                        }`}
                                >
                                    {view.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/20">
                        <div className="flex items-center justify-between mb-3 text-emerald-600 dark:text-emerald-400">
                            <h4 className="font-bold text-sm">Upcoming</h4>
                            <Clock size={16} />
                        </div>
                        <RemindersPanel refreshTrigger={refreshTrigger} compact={true} onEventClick={(e) => setSelectedEvent(e)} filterQuery={searchQuery} />
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900 relative">
                <div className="flex-1">
                    <style>{`
                        .fc { --fc-border-color: #f1f5f9; --fc-today-bg-color: #eff6ff; }
                        .dark .fc { --fc-border-color: #1e293b; --fc-today-bg-color: #064e3b15; }
                        .fc-theme-standard .fc-scrollgrid { border: none !important; }
                        .fc-col-header-cell { border-bottom: 2px solid #f1f5f9 !important; }
                        .dark .fc-col-header-cell { border-bottom: 2px solid #1e293b !important; }
                        .fc-col-header-cell-cushion { padding: 8px !important; font-size: 0.7rem !important; font-weight: 800 !important; color: #64748b !important; text-transform: uppercase; letter-spacing: 0.1em; }
                        .dark .fc-col-header-cell-cushion { color: #94a3b8 !important; }
                        .fc-daygrid-day-number { font-size: 0.85rem; font-weight: 700; color: #1e293b; padding: 12px; }
                        .dark .fc-daygrid-day-number { color: #f1f5f9; }
                        .fc-daygrid-day-top { justify-content: flex-start; }
                        .fc-timegrid-slot-label-cushion { font-size: 0.75rem; color: #94a3b8; font-weight: 600; }
                        .fc-timegrid-axis-cushion { font-size: 0.75rem; color: #94a3b8; }
                        .fc-event { border: none !important; cursor: pointer; transition: transform 0.1s; }
                        .fc-event:hover { transform: scale(1.02); z-index: 10; }
                        .fc-v-event { padding: 4px 6px; }
                        .fc-timegrid-event .fc-event-time { font-weight: 800; font-size: 0.7rem; opacity: 0.8; }
                        .fc-timegrid-event .fc-event-title { font-weight: 700; font-size: 0.8rem; }
                        .fc-theme-standard td, .fc-theme-standard th { border-color: #f1f5f9; }
                        .dark .fc-theme-standard td, .dark .fc-theme-standard th { border-color: #1e293b; }
                        .fc-timegrid-slot { height: 4em !important; border-bottom: 1px solid #f1f5f9 !important; }
                        .dark .fc-timegrid-slot { border-bottom: 1px solid #1e293b !important; }
                        .fc-timegrid-now-indicator-line { border-color: #10b981; border-width: 2px; z-index: 100 !important; }
                        .fc-timegrid-now-indicator-line::before {
                            content: "";
                            position: absolute;
                            left: -4px;
                            top: -4px;
                            width: 10px;
                            height: 10px;
                            background: #10b981;
                            border-radius: 50%;
                            box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
                        }
                        .fc-list-event:hover td { background-color: #f8fafc !important; }
                        .dark .fc-list-event:hover td { background-color: #1e293b !important; }
                        .fc-list-day-cushion { background-color: #f8fafc !important; }
                        .dark .fc-list-day-cushion { background-color: #0f172a !important; }
                        .fc-list-event-title, .fc-list-event-time { font-weight: 700 !important; color: #1e293b !important; }
                        .dark .fc-list-event-title, .dark .fc-list-event-time { color: #f1f5f9 !important; }
                        .holiday-bg {
                            background-color: #f8fafc !important;
                            opacity: 0.8;
                            background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, #f1f5f9 10px, #f1f5f9 20px);
                        }
                        .dark .holiday-bg {
                            background-color: #0f172a !important;
                            background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, #1e293b 10px, #1e293b 20px);
                        }
                        .fc-business-hour {
                            background-color: rgba(241, 245, 249, 0.3);
                        }
                        .dark .fc-business-hour {
                            background-color: rgba(30, 41, 59, 0.4);
                        }
                        .fc-timegrid-now-indicator-arrow { border-color: #ef4444; border-width: 0; background: #ef4444; display: none; }
                        .fc-day-today { background-color: #f0fdf4 !important; }
                        .dark .fc-day-today { background-color: #064e3b20 !important; }
                        .fc-day-today .fc-col-header-cell-cushion { color: #10b981 !important; font-weight: 800; }
                        .fc-scrollgrid-sync-table { border-collapse: separate; border-spacing: 0px; }
                        .fc-daygrid-day { border: 1px solid #f1f5f9 !important; }
                        .dark .fc-daygrid-day { border: 1px solid #1e293b !important; }
                        .fc-col-header-cell { border: none !important; padding: 12px 0 !important; }
                        .fc-theme-standard td, .fc-theme-standard th { border-color: #f1f5f9; }
                        .dark .fc-theme-standard td, .dark .fc-theme-standard th { border-color: #1e293b; }
                        .fc-timegrid-slot { height: 1.8em !important; border-bottom: 1px solid #f1f5f9 !important; }
                        .dark .fc-timegrid-slot { border-bottom: 1px solid #1e293b !important; }
                        .fc-view-harness { background: white; }
                        .dark .fc-view-harness { background: #0f172a; }
                    `}</style>
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                        initialView="timeGridWeek"
                        headerToolbar={false}
                        events={[...filteredEvents, ...holidayEvents]}
                        eventContent={renderEventContent}
                        eventClick={handleEventClick}
                        datesSet={handleDatesSet}
                        height="auto"
                        dayMaxEvents={true}
                        allDaySlot={true}
                        slotMinTime="07:00:00"
                        slotMaxTime="22:00:00"
                        expandRows={true}
                        stickyHeaderDates={true}
                        scrollTime={new Date().toLocaleTimeString('en-US', {
                            hour12: false,
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: timeZone === 'local' ? undefined : timeZone
                        })}
                        nowIndicator={true}
                        timeZone={timeZone}
                        selectable={true}
                        select={handleDateSelect}
                        businessHours={businessHours}
                    />
                </div>
            </div>

            <EventDetailsModal
                isOpen={!!selectedEvent}
                onClose={() => setSelectedEvent(null)}
                event={selectedEvent}
                onUpdate={(e) => {
                    setEditEvent(e);
                    setIsEditModalOpen(true);
                    setSelectedEvent(null);
                }}
                onDelete={async (id) => {
                    setConfirmModal({
                        isOpen: true,
                        title: "Delete Event",
                        message: "Are you sure you want to delete this event? This action cannot be undone.",
                        isDelete: true,
                        onConfirm: async () => {
                            try {
                                const res = await integrationService.deleteCalendarEvent(id);
                                if (res.success) {
                                    addToast("Event deleted", "success");
                                    fetchEvents();
                                }
                            } catch (err) {
                                addToast("Failed to delete", "error");
                            }
                            setSelectedEvent(null);
                        }
                    });
                }}
            />

            <CreateEventModal
                isOpen={isCreateModalOpen || isEditModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                    setEditEvent(null);
                }}
                onSuccess={fetchEvents}
                timeZone={timeZone}
                event={editEvent}
            />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                isDelete={confirmModal.isDelete}
            />
        </div>
    );
};
