
import React, { useState, useRef, useEffect } from 'react';
import {
    Calendar, Clock, Globe, Save, Edit2, Plus, Trash2,
    Copy, CheckCircle, AlertCircle, X, ChevronDown, Link, RefreshCw, LogOut, Check
} from '../../components/Icons';
import { CalendarView } from './CalendarView';
import { useToast } from '../../components/Toast';
import { useUserProfile } from '../../hooks/useUserProfile';
import { userService } from '../../services/api';
import { integrationService } from '../../services/integrationService';
import { Link as RouterLink } from 'react-router-dom';


// --- Types ---

interface TimeSlot {
    id: string;
    start: string;
    end: string;
}

interface DaySchedule {
    day: string;
    isWorking: boolean;
    slots: TimeSlot[];
}

interface Holiday {
    id: string;
    name: string;
    date: string;
    type: 'Holiday' | 'Medical' | 'Personal' | 'Other';
}

interface ConnectedCalendar {
    id: string;
    provider: 'Google' | 'Outlook';
    email: string;
    status: 'Connected' | 'Syncing' | 'Error';
    lastSynced: string;
}

interface CalendarConfig {
    timeFormat: '12h' | '24h';
    dateFormat: string;
    timeZone: string;
    weekends: string[];
    excludeWeekends: boolean;
    excludeHolidays: boolean;
    weeklySchedule: DaySchedule[];
    breaks: TimeSlot[]; // Global daily breaks
    holidays: Holiday[];
}

// --- Constants ---

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_ZONES = [
    '(GMT-08:00) Pacific Time (US & Canada)',
    '(GMT-05:00) Eastern Time (US & Canada)',
    '(GMT+00:00) London, Edinburgh',
    '(GMT+01:00) Berlin, Paris',
    '(GMT+05:30) Mumbai, New Delhi',
    '(GMT+08:00) Singapore',
    '(GMT+09:00) Tokyo',
    '(GMT+10:00) Sydney'
];
const DATE_FORMATS = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];

const INITIAL_SCHEDULE: DaySchedule[] = DAYS_OF_WEEK.map(day => ({
    day,
    isWorking: day !== 'Sunday' && day !== 'Saturday',
    slots: day !== 'Sunday' && day !== 'Saturday'
        ? [{ id: '1', start: '09:00', end: '17:00' }]
        : []
}));

// --- Helper Components & Functions ---

// Format Time Display based on preference
const formatTimeDisplay = (val: string, format: '12h' | '24h') => {
    if (!val) return '';
    if (format === '24h') return val;
    const [h, m] = val.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
};

// Format Date Display based on preference
const formatDateDisplay = (isoDate: string, format: string) => {
    if (!isoDate) return '';
    const [y, m, d] = isoDate.split('-');

    if (format === 'MM/DD/YYYY') return `${m}/${d}/${y}`;
    if (format === 'DD/MM/YYYY') return `${d}/${m}/${y}`;
    return isoDate; // Default YYYY-MM-DD
};

const generateTimeOptions = (format: '12h' | '24h', interval = 30) => {
    const options = [];
    for (let min = 0; min < 24 * 60; min += interval) {
        const h = Math.floor(min / 60);
        const m = min % 60;
        const hStr = h.toString().padStart(2, '0');
        const mStr = m.toString().padStart(2, '0');
        const value = `${hStr}:${mStr}`; // Always 24h for storage
        const label = formatTimeDisplay(value, format);
        options.push({ value, label });
    }
    return options;
};

// Helper to convert display string back to 24h format for storage logic
const parseTimeString = (input: string, format: '12h' | '24h'): string | null => {
    if (!input) return null;

    if (format === '24h') {
        const match = input.match(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/);
        if (match) return `${match[1].padStart(2, '0')}:${match[2]}`;
        return null;
    } else {
        const match = input.match(/^([0-1]?[0-9]):([0-5][0-9])\s?(AM|PM|am|pm)$/i);
        if (match) {
            let h = parseInt(match[1]);
            const m = match[2];
            const period = match[3].toUpperCase();
            if (h === 12) h = 0;
            if (period === 'PM') h += 12;
            return `${h.toString().padStart(2, '0')}:${m}`;
        }
        return null;
    }
};

const TimePicker = ({
    value,
    onChange,
    format,
    disabled
}: {
    value: string,
    onChange: (val: string) => void,
    format: '12h' | '24h',
    disabled?: boolean
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInputValue(formatTimeDisplay(value, format));
    }, [value, format]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                // Validate on close
                const display = formatTimeDisplay(value, format);
                if (inputValue !== display) {
                    const parsed = parseTimeString(inputValue, format);
                    if (parsed) onChange(parsed);
                    else setInputValue(display);
                }
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [inputValue, value, format]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputBlur = () => {
        const parsed = parseTimeString(inputValue, format);
        if (parsed) {
            onChange(parsed);
            setInputValue(formatTimeDisplay(parsed, format));
        } else {
            setInputValue(formatTimeDisplay(value, format));
        }
    };

    const options = generateTimeOptions(format, 30);

    return (
        <div className="relative w-32" ref={containerRef}>
            <div className={`relative border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500'}`}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onFocus={() => !disabled && setIsOpen(true)}
                    disabled={disabled}
                    className="w-full p-2 text-sm bg-transparent outline-none text-slate-700 dark:text-slate-200"
                    placeholder={format === '12h' ? "09:00 AM" : "09:00"}
                />
                <button
                    className="pr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    type="button"
                >
                    <ChevronDown size={14} />
                </button>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-1 max-h-48 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 custom-scrollbar">
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            className={`px-3 py-2 text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer text-slate-700 dark:text-slate-200 ${opt.value === value ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold' : ''}`}
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const CopyScheduleModal = ({ sourceDay, days, onCopy, onClose }: any) => {
    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    const toggleDay = (day: string) => {
        setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    };

    const handleSelectAll = () => {
        const otherDays = days.filter((d: any) => d !== sourceDay);
        if (selectedDays.length === otherDays.length) setSelectedDays([]);
        else setSelectedDays(otherDays);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">Copy Schedule</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <div className="p-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        Copying <strong>{sourceDay}</strong>'s hours to:
                    </p>
                    <div className="space-y-2 mb-6">
                        <button onClick={handleSelectAll} className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline mb-2 block">
                            {selectedDays.length === days.length - 1 ? 'Deselect All' : 'Select All'}
                        </button>
                        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto custom-scrollbar p-1">
                            {days.filter((d: any) => d !== sourceDay).map((day: string) => (
                                <label key={day} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedDays.includes(day) ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800'}`}>
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedDays.includes(day) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                                        {selectedDays.includes(day) && <CheckCircle size={14} fill="currentColor" />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={selectedDays.includes(day)} onChange={() => toggleDay(day)} />
                                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{day}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={() => onCopy(selectedDays)}
                        disabled={selectedDays.length === 0}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Copy Hours
                    </button>
                </div>
            </div>
        </div>
    );
};

// Added mode prop to support Modal usage
export const CalendarSettings = ({ userOverride, mode = 'page', onClose }: { userOverride?: any, mode?: 'page' | 'modal', onClose?: () => void }) => {
    const { addToast } = useToast();
    const { userProfile } = useUserProfile();

    // Determine the active user context: either the override (admin edit) or current logged in user
    const activeUser = userOverride || userProfile;

    const [activeTab, setActiveTab] = useState<'settings' | 'events'>('settings');
    const [isEditing, setIsEditing] = useState(false);
    const [copyModalData, setCopyModalData] = useState<{ sourceDayIndex: number, sourceDayName: string } | null>(null);

    // State
    const [config, setConfig] = useState<CalendarConfig>({
        timeFormat: '12h',
        dateFormat: 'MM/DD/YYYY',
        timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
        weekends: ['Saturday', 'Sunday'],
        excludeWeekends: true,
        excludeHolidays: true,
        weeklySchedule: INITIAL_SCHEDULE,
        breaks: [{ id: 'b1', start: '12:00', end: '13:00' }],
        holidays: [
            { id: 'h1', name: 'New Year', date: '2025-01-01', type: 'Holiday' }
        ]
    });

    const [connectedCalendars, setConnectedCalendars] = useState<ConnectedCalendar[]>([]);

    // Temp state for new entries
    const [newHoliday, setNewHoliday] = useState({ name: '', date: '', type: 'Holiday' });
    const [newBreak, setNewBreak] = useState({ start: '12:00', end: '13:00' });

    // --- Handlers ---

    const handleSave = async () => {
        try {
            // Construct Payload matching User Request
            const calendarSettings = {
                timeZone: config.timeZone.match(/\(GMT([+-]\d{2}:\d{2})\)/)?.[1] || '+00:00', // Extract offset
                timeZoneName: config.timeZone.split(') ')[1] || config.timeZone,
                timeZoneFullName: config.timeZone, // Storing full string for UI restoration
                weeklyHours: config.weeklySchedule.map(day => ({
                    day: day.day,
                    timings: day.isWorking ? day.slots.map(s => ({
                        startTime: s.start,
                        endTime: s.end
                    })) : [] // Empty array if not working, though user req had structure for all
                })),
                businessHours: {
                    startTime: "", // As per request, empty string defaults? Or should we infer? Leaving empty as per JSON
                    endTime: "",
                    format: config.timeFormat === '12h' ? "12 hours" : "24 hours",
                    durationInHours: "",
                    includeWeekends: !config.excludeWeekends,
                    includeHolidays: !config.excludeHolidays,
                    includeAllDayEvents: true
                },
                breakHours: config.breaks.map(b => ({
                    startTime: b.start,
                    endTime: b.end
                })),
                holidays: config.holidays,
                weekends: config.weekends
            };

            // Call API
            // Use activeUser._id which handles both self-edit and admin-edit
            if (activeUser && (activeUser as any)._id) {
                await userService.update((activeUser as any)._id, { calendarSettings });
                addToast("Calendar preferences updated successfully", "success");
                setIsEditing(false);
            } else {
                // Fallback for demo
                console.log("Saving Mock Calendar settings:", calendarSettings);
                addToast("Calendar preferences updated (Mock)", "success");
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Failed to save calendar settings", error);
            addToast("Failed to save changes", "error");
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        addToast("Changes discarded", "info");
        if (onClose) onClose();
    };

    const toggleWeekendDay = (day: string) => {
        setConfig(prev => {
            const isWeekend = prev.weekends.includes(day);
            const newWeekends = isWeekend
                ? prev.weekends.filter(d => d !== day)
                : [...prev.weekends, day];
            return { ...prev, weekends: newWeekends };
        });
    };

    // Schedule Logic
    const addTimeSlot = (dayIndex: number) => {
        const newSchedule = [...config.weeklySchedule];
        newSchedule[dayIndex].slots.push({
            id: Date.now().toString(),
            start: '09:00',
            end: '10:00'
        });
        setConfig({ ...config, weeklySchedule: newSchedule });
    };

    const removeTimeSlot = (dayIndex: number, slotId: string) => {
        const newSchedule = [...config.weeklySchedule];
        newSchedule[dayIndex].slots = newSchedule[dayIndex].slots.filter(s => s.id !== slotId);
        setConfig({ ...config, weeklySchedule: newSchedule });
    };

    const updateTimeSlot = (dayIndex: number, slotId: string, field: 'start' | 'end', value: string) => {
        const newSchedule = [...config.weeklySchedule];
        const slot = newSchedule[dayIndex].slots.find(s => s.id === slotId);
        if (slot) {
            slot[field] = value;
            setConfig({ ...config, weeklySchedule: newSchedule });
        }
    };

    const toggleDayWorking = (dayIndex: number) => {
        const newSchedule = [...config.weeklySchedule];
        newSchedule[dayIndex].isWorking = !newSchedule[dayIndex].isWorking;
        // If turning on and no slots, add default
        if (newSchedule[dayIndex].isWorking && newSchedule[dayIndex].slots.length === 0) {
            newSchedule[dayIndex].slots.push({ id: Date.now().toString(), start: '09:00', end: '17:00' });
        }
        setConfig({ ...config, weeklySchedule: newSchedule });
    };

    const handleCopySchedule = (targetDays: string[]) => {
        if (!copyModalData) return;
        const { sourceDayIndex } = copyModalData;
        const sourceSlots = config.weeklySchedule[sourceDayIndex].slots;

        const newSchedule = config.weeklySchedule.map(day => {
            if (targetDays.includes(day.day)) {
                return {
                    ...day,
                    isWorking: true,
                    slots: sourceSlots.map(s => ({ ...s, id: Math.random().toString() })) // Deep copy
                };
            }
            return day;
        });

        setConfig({ ...config, weeklySchedule: newSchedule });
        addToast(`Schedule copied to ${targetDays.length} days`, "success");
        setCopyModalData(null);
    };

    // Breaks Logic
    const addBreak = () => {
        setConfig(prev => ({
            ...prev,
            breaks: [...prev.breaks, { id: Date.now().toString(), start: newBreak.start, end: newBreak.end }]
        }));
        setNewBreak({ start: '12:00', end: '13:00' });
    };

    const removeBreak = (id: string) => {
        setConfig(prev => ({
            ...prev,
            breaks: prev.breaks.filter(b => b.id !== id)
        }));
    };

    // Holiday Logic
    const addHoliday = () => {
        if (!newHoliday.name || !newHoliday.date) return;
        setConfig(prev => ({
            ...prev,
            holidays: [...prev.holidays, { ...newHoliday, id: Date.now().toString() } as Holiday]
        }));
        setNewHoliday({ name: '', date: '', type: 'Holiday' });
    };

    const removeHoliday = (id: string) => {
        setConfig(prev => ({ ...prev, holidays: prev.holidays.filter(h => h.id !== id) }));
    };

    // Calendar Sync Handlers
    const handleConnectCalendar = (provider: 'Google' | 'Outlook') => {
        if (!isEditing) return;

        if (provider === 'Google') {
            integrationService.connectGoogle();
        } else {
            addToast("Outlook integration coming soon", "info");
        }
    };

    const handleDisconnectCalendar = async (id: string, provider: 'Google' | 'Outlook') => {
        if (!isEditing) return;
        try {
            await integrationService.disconnect(provider.toLowerCase() as any);
            setConnectedCalendars(prev => prev.filter(c => c.id !== id));
            addToast("Calendar disconnected", "success");
        } catch (error) {
            addToast("Failed to disconnect", "error");
        }
    };

    const handleSyncCalendar = async (id: string) => {
        setConnectedCalendars(prev => prev.map(c => c.id === id ? { ...c, status: 'Syncing' } : c));
        try {
            const result = await integrationService.syncCalendar();
            setConnectedCalendars(prev => prev.map(c => c.id === id ? { ...c, status: 'Connected', lastSynced: 'Just now' } : c));
            addToast(`Synced ${result.count} events successfully`, "success");
        } catch (error) {
            setConnectedCalendars(prev => prev.map(c => c.id === id ? { ...c, status: 'Error' } : c));
            addToast("Failed to sync calendar", "error");
        }
    };

    // Load status on mount
    useEffect(() => {
        const loadStatus = async () => {
            const status = await integrationService.getStatus();
            const cals: ConnectedCalendar[] = [];
            if (status.google.connected) {
                cals.push({
                    id: 'google-1',
                    provider: 'Google',
                    email: status.google.email || 'Connected Account',
                    status: 'Connected',
                    lastSynced: status.google.lastSynced || 'Unknown'
                });
            }
            if (status.microsoft.connected) {
                cals.push({
                    id: 'ms-1',
                    provider: 'Outlook',
                    email: status.microsoft.email || 'Connected Account',
                    status: 'Connected',
                    lastSynced: 'Unknown'
                });
            }
            setConnectedCalendars(cals);
        };
        loadStatus();
    }, []);

    return (
        <div className="animate-in fade-in duration-300 pb-12">
            {/* Copy Modal */}
            {copyModalData && (
                <CopyScheduleModal
                    sourceDay={copyModalData.sourceDayName}
                    days={DAYS_OF_WEEK}
                    onCopy={handleCopySchedule}
                    onClose={() => setCopyModalData(null)}
                />
            )}

            {/* Full Width Sticky Header */}
            <div className="sticky top-0 z-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 lg:px-12 py-6 transition-all shadow-sm">
                <div className="max-w-5xl mx-auto flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <Calendar size={20} className="text-emerald-500" /> Calendar Settings
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure availability, time zones, and calendar integrations.</p>
                        </div>
                        <div className="flex gap-3">
                            {activeTab === 'settings' && (
                                isEditing ? (
                                    <>
                                        <button onClick={handleCancel} className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                                        <button onClick={handleSave} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2">
                                            <Save size={16} /> Save Changes
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2">
                                        <Edit2 size={16} /> Edit
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    {/* Tabs - Only show when NOT in modal mode */}
                    {mode !== 'modal' && (
                        <div className="flex border-b border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'settings' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                Configuration
                            </button>
                            <button
                                onClick={() => setActiveTab('events')}
                                className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'events' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                View Calendar
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Padded Content Body */}
            <div className={`px-4 lg:px-8 pt-6 ${activeTab === 'events' ? 'w-full' : 'max-w-5xl mx-auto'}`}>
                {activeTab === 'events' ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-[calc(100vh-140px)]">
                        <CalendarView />
                    </div>
                ) : (
                    <div className="max-w-5xl mx-auto">
                        {/* Always showing settings content now */}
                        <div className="space-y-8">

                            {/* 0. Calendar Synchronization */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <Link size={16} className="text-slate-400" /> Calendar Integration
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <button
                                        onClick={() => handleConnectCalendar('Google')}
                                        disabled={!isEditing || connectedCalendars.some(c => c.provider === 'Google')}
                                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${connectedCalendars.some(c => c.provider === 'Google') ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60 cursor-default' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-sm'}`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xl font-bold text-blue-600 shadow-sm">G</div>
                                        <div className="text-left">
                                            <span className="block font-bold text-slate-700 dark:text-slate-200 text-sm">Google Calendar</span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">{connectedCalendars.some(c => c.provider === 'Google') ? 'Connected' : 'Connect Account'}</span>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => handleConnectCalendar('Outlook')}
                                        disabled={!isEditing || connectedCalendars.some(c => c.provider === 'Outlook')}
                                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${connectedCalendars.some(c => c.provider === 'Outlook') ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60 cursor-default' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-sm'}`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                            <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                                                <div className="bg-orange-500 w-1.5 h-1.5"></div>
                                                <div className="bg-green-500 w-1.5 h-1.5"></div>
                                                <div className="bg-blue-500 w-1.5 h-1.5"></div>
                                                <div className="bg-yellow-500 w-1.5 h-1.5"></div>
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <span className="block font-bold text-slate-700 dark:text-slate-200 text-sm">Outlook Calendar</span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">{connectedCalendars.some(c => c.provider === 'Outlook') ? 'Connected' : 'Connect Account'}</span>
                                        </div>
                                    </button>
                                </div>

                                {connectedCalendars.length > 0 && (
                                    <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                                        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Connected Accounts</h4>
                                        <div className="space-y-2">
                                            {connectedCalendars.map(cal => (
                                                <div key={cal.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2 h-2 rounded-full ${cal.status === 'Connected' ? 'bg-emerald-500' : cal.status === 'Syncing' ? 'bg-blue-500 animate-pulse' : 'bg-red-500'}`}></div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{cal.provider} ({cal.email})</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                                {cal.status === 'Syncing' ? 'Syncing...' : `Last synced: ${cal.lastSynced}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleSyncCalendar(cal.id)}
                                                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                            title="Sync Now"
                                                        >
                                                            <RefreshCw size={14} className={cal.status === 'Syncing' ? 'animate-spin' : ''} />
                                                        </button>
                                                        {isEditing && (
                                                            <button
                                                                onClick={() => handleDisconnectCalendar(cal.id, cal.provider)}
                                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                                title="Disconnect"
                                                            >
                                                                <LogOut size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 1. General Preferences */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <Globe size={16} className="text-slate-400" /> General Preferences
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Date Format</label>
                                        <select
                                            className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                                            value={config.dateFormat}
                                            onChange={(e) => setConfig({ ...config, dateFormat: e.target.value })}
                                            disabled={!isEditing}
                                        >
                                            {DATE_FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Time Format</label>
                                        <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                                            {['12h', '24h'].map(fmt => (
                                                <button
                                                    key={fmt}
                                                    onClick={() => isEditing && setConfig({ ...config, timeFormat: fmt as any })}
                                                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${config.timeFormat === fmt ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}
                                                    disabled={!isEditing}
                                                >
                                                    {fmt.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Time Zone</label>
                                        <select
                                            className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                                            value={config.timeZone}
                                            onChange={(e) => setConfig({ ...config, timeZone: e.target.value })}
                                            disabled={!isEditing}
                                        >
                                            {TIME_ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Scheduling Rules & Weekends */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <CheckCircle size={16} className="text-slate-400" /> Scheduling Rules
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Define Weekends</label>
                                        <div className="flex flex-wrap gap-2">
                                            {DAYS_OF_WEEK.map(day => {
                                                const isWeekend = config.weekends.includes(day);
                                                return (
                                                    <button
                                                        key={day}
                                                        onClick={() => isEditing && toggleWeekendDay(day)}
                                                        disabled={!isEditing}
                                                        className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${isWeekend ? 'bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-800 dark:border-slate-100' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                                    >
                                                        {day}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                                        <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all flex-1 ${config.excludeWeekends ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'}`}>
                                            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${config.excludeWeekends ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                                                {config.excludeWeekends && <CheckCircle size={14} fill="currentColor" />}
                                            </div>
                                            <input type="checkbox" className="hidden" checked={config.excludeWeekends} onChange={(e) => isEditing && setConfig({ ...config, excludeWeekends: e.target.checked })} disabled={!isEditing} />
                                            <div>
                                                <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">Exclude Weekends</span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">Do not schedule meetings on defined weekends.</span>
                                            </div>
                                        </label>

                                        <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all flex-1 ${config.excludeHolidays ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'}`}>
                                            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${config.excludeHolidays ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                                                {config.excludeHolidays && <CheckCircle size={14} fill="currentColor" />}
                                            </div>
                                            <input type="checkbox" className="hidden" checked={config.excludeHolidays} onChange={(e) => isEditing && setConfig({ ...config, excludeHolidays: e.target.checked })} disabled={!isEditing} />
                                            <div>
                                                <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">Exclude Holidays</span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">Block calendar on holidays and personal leaves.</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Weekly Hours */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <Clock size={16} className="text-slate-400" /> Weekly Hours
                                </h3>

                                <div className="space-y-4">
                                    {config.weeklySchedule.map((day, dayIndex) => (
                                        <div key={day.day} className={`flex flex-col md:flex-row md:items-start gap-4 p-4 rounded-lg border transition-colors ${day.isWorking ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700' : 'bg-slate-50 dark:bg-slate-900/50 border-transparent'}`}>

                                            {/* Day Toggle */}
                                            <div className="w-32 pt-2 flex items-center gap-3">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" checked={day.isWorking} onChange={() => isEditing && toggleDayWorking(dayIndex)} disabled={!isEditing} />
                                                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                                                </label>
                                                <span className={`text-sm font-bold ${day.isWorking ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>{day.day}</span>
                                            </div>

                                            {/* Slots */}
                                            <div className="flex-1 space-y-2">
                                                {day.isWorking ? (
                                                    <>
                                                        {day.slots.map((slot) => (
                                                            <div key={slot.id} className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                                                                <TimePicker
                                                                    value={slot.start}
                                                                    onChange={(val) => updateTimeSlot(dayIndex, slot.id, 'start', val)}
                                                                    format={config.timeFormat}
                                                                    disabled={!isEditing}
                                                                />
                                                                <span className="text-slate-400">-</span>
                                                                <TimePicker
                                                                    value={slot.end}
                                                                    onChange={(val) => updateTimeSlot(dayIndex, slot.id, 'end', val)}
                                                                    format={config.timeFormat}
                                                                    disabled={!isEditing}
                                                                />
                                                                {isEditing && (
                                                                    <button onClick={() => removeTimeSlot(dayIndex, slot.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors ml-2">
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {isEditing && (
                                                            <div className="flex gap-4 mt-2">
                                                                <button onClick={() => addTimeSlot(dayIndex)} className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                                                                    <Plus size={12} /> Add Hours
                                                                </button>
                                                                {day.slots.length > 0 && (
                                                                    <button
                                                                        onClick={() => setCopyModalData({ sourceDayIndex: dayIndex, sourceDayName: day.day })}
                                                                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                                                    >
                                                                        <Copy size={12} /> Copy to...
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-sm text-slate-400 italic pt-2 block">Unavailable</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 4. Holidays & Breaks */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Global Breaks */}
                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                        <Clock size={16} className="text-slate-400" /> Daily Breaks
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Recurring breaks applied to all working days (e.g. Lunch).</p>

                                    <div className="space-y-3">
                                        {config.breaks.map((brk, idx) => (
                                            <div key={brk.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-100 dark:border-slate-700">
                                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300 w-16">Break {idx + 1}</span>
                                                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">
                                                    <span className="text-xs text-slate-700 dark:text-slate-200">{formatTimeDisplay(brk.start, config.timeFormat)}</span>
                                                    <span className="text-slate-300">-</span>
                                                    <span className="text-xs text-slate-700 dark:text-slate-200">{formatTimeDisplay(brk.end, config.timeFormat)}</span>
                                                </div>
                                                {isEditing && (
                                                    <button
                                                        onClick={() => removeBreak(brk.id)}
                                                        className="ml-auto text-slate-400 hover:text-red-500"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {isEditing && (
                                            <div className="flex gap-2 items-center p-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                                                <TimePicker
                                                    value={newBreak.start}
                                                    onChange={(v) => setNewBreak({ ...newBreak, start: v })}
                                                    format={config.timeFormat}
                                                    disabled={false}
                                                />
                                                <span className="text-slate-400">-</span>
                                                <TimePicker
                                                    value={newBreak.end}
                                                    onChange={(v) => setNewBreak({ ...newBreak, end: v })}
                                                    format={config.timeFormat}
                                                    disabled={false}
                                                />
                                                <button onClick={addBreak} className="ml-auto text-xs font-bold text-emerald-600 dark:text-emerald-400">Add</button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Holidays */}
                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                        <AlertCircle size={16} className="text-slate-400" /> Holidays & Leaves
                                    </h3>

                                    <div className="space-y-2 mb-4 max-h-48 overflow-y-auto custom-scrollbar">
                                        {config.holidays.map(h => (
                                            <div key={h.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg hover:shadow-sm transition-shadow">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{h.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                        {formatDateDisplay(h.date, config.dateFormat)}
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${h.type === 'Holiday' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>{h.type}</span>
                                                    </p>
                                                </div>
                                                {isEditing && (
                                                    <button onClick={() => removeHoliday(h.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {isEditing && (
                                        <div className="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <input
                                                type="text"
                                                placeholder="Holiday Name (e.g. Out of Office)"
                                                className="w-full text-sm p-2 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500"
                                                value={newHoliday.name}
                                                onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                                            />
                                            <div className="flex gap-2">
                                                <div className="flex-1 relative">
                                                    <input
                                                        type="date"
                                                        className="w-full text-sm p-2 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500"
                                                        value={newHoliday.date}
                                                        onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                                                    />
                                                    {/* Helper hint for format, although HTML date input uses system locale for display */}
                                                    <div className="text-[10px] text-slate-400 mt-1 absolute right-0 -bottom-4">
                                                        Format: {config.dateFormat}
                                                    </div>
                                                </div>
                                                <select
                                                    className="flex-1 text-sm p-2 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500"
                                                    value={newHoliday.type}
                                                    onChange={(e) => setNewHoliday({ ...newHoliday, type: e.target.value as any })}
                                                >
                                                    <option value="Holiday">Holiday</option>
                                                    <option value="Medical">Medical</option>
                                                    <option value="Personal">Personal</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <button
                                                onClick={addHoliday}
                                                disabled={!newHoliday.name || !newHoliday.date}
                                                className="w-full py-2 bg-slate-800 dark:bg-slate-700 text-white rounded text-xs font-bold hover:bg-slate-900 dark:hover:bg-slate-600 disabled:opacity-50 mt-2"
                                            >
                                                Add Date
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
