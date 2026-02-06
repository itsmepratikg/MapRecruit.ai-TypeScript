import React, { useState, useEffect } from 'react';
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import {
    createViewDay,
    createViewMonthGrid,
    createViewWeek,
    createViewMonthAgenda,
} from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import { createResizePlugin } from '@schedule-x/resize';
import '@schedule-x/theme-default/dist/index.css';

import { integrationService } from '../../services/integrationService';
import { RemindersPanel } from './RemindersPanel';
import { EventDetailsModal } from './EventDetailsModal';
// import { CalendarSettings } from './CalendarSettings'; // Removed to avoid circular dependency
import { Settings, X, ChevronDown, MoreVertical } from '../../components/Icons'; // Added missing icons
import { useToast } from '../../components/Toast';

export const CalendarView = () => {
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const { addToast } = useToast();

    // 1. Initialize Plugins
    const eventsService = useState(() => createEventsServicePlugin())[0];
    const dragAndDrop = useState(() => createDragAndDropPlugin())[0];
    const resize = useState(() => createResizePlugin())[0];

    // 2. Initialize Calendar App
    const calendar = useCalendarApp({
        views: [
            createViewWeek(),
            createViewDay(),
            createViewMonthGrid(),
            createViewMonthAgenda(),
        ],
        defaultView: createViewWeek().name,
        events: [],
        plugins: [eventsService, dragAndDrop, resize],
        callbacks: {
            onEventClick(calendarEvent) {
                console.log('Event clicked:', calendarEvent);
                setSelectedEvent({
                    id: calendarEvent.id,
                    title: calendarEvent.title,
                    start: calendarEvent.start,
                    end: calendarEvent.end,
                    extendedProps: {
                        description: calendarEvent.description,
                        location: calendarEvent.location,
                        ...calendarEvent
                    }
                });
            },
            onEventUpdate(updatedEvent) {
                console.log("Event updated via drag/resize:", updatedEvent);
            }
        },
        // configuration
        weekOptions: {
            gridHeight: 600,
        }
    });

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await integrationService.getCalendarEvents();
            if (res.success && res.events) {
                const sxEvents = res.events.map((e: any) => ({
                    id: e._id,
                    title: e.data.summary || 'Untitled',
                    start: e.data.start.dateTime.replace('T', ' ').slice(0, 16),
                    end: e.data.end.dateTime.replace('T', ' ').slice(0, 16),
                    description: e.data.description,
                    location: e.data.location,
                }));

                eventsService.set(sxEvents);
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

    return (
        <div className="flex h-full bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
            {/* Main Calendar Area */}
            <div className="flex-1 flex flex-col h-full min-w-0 bg-white dark:bg-slate-900 m-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden z-0">

                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-0">
                    <ScheduleXCalendar calendarApp={calendar} />
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
        </div>
    );
};
