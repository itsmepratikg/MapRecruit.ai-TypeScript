
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import {
    Monitor, Moon, Sun, Smartphone, Tablet, Layout, Save, RotateCcw,
    CheckCircle, Plus, X, GripHorizontal, Trash2, Palette, Edit2, Lock, Globe
} from '../../components/Icons';
import { GridStack } from 'gridstack';
import { WIDGET_DEFINITIONS } from '../../components/DashboardWidgets'; // Import Definitions
import { useToast } from '../../components/Toast';

// --- Constants ---
const LANGUAGES = ['English (US)', 'English (UK)', 'Spanish', 'French', 'German'];

// --- Components ---

const ThemePreviewCard = ({
    mode,
    active,
    onClick,
    label,
    disabled
}: {
    mode: 'light' | 'dark' | 'system',
    active: boolean,
    onClick: () => void,
    label: string,
    disabled: boolean
}) => {
    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all w-full text-left group ${active
                ? 'border-emerald-500 bg-emerald-50/10 ring-1 ring-emerald-500'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                } ${!disabled ? 'hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer' : 'opacity-80 cursor-default'}`}
        >
            {active && <div className="absolute top-3 right-3 text-emerald-500"><CheckCircle size={20} /></div>}

            {/* Visual Representation */}
            <div className={`w-full aspect-video rounded-lg shadow-sm overflow-hidden border ${mode === 'dark' ? 'bg-slate-900 border-slate-700' : (mode === 'system' ? 'bg-gradient-to-br from-white to-slate-900 border-slate-300' : 'bg-white border-slate-200')}`}>
                <div className="h-full w-full p-3 flex gap-2">
                    {/* Sidebar Mock */}
                    <div className={`w-1/4 h-full rounded-md opacity-50 ${mode === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                    <div className="flex-1 flex flex-col gap-2">
                        {/* Header Mock */}
                        <div className={`w-full h-4 rounded-md opacity-50 ${mode === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                        {/* Content Mock */}
                        <div className="flex-1 flex gap-2">
                            <div className={`flex-1 h-full rounded-md opacity-40 ${mode === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}></div>
                            <div className={`flex-1 h-full rounded-md opacity-40 ${mode === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-between items-center">
                <span className={`font-bold text-sm ${active ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>{label}</span>
                {disabled && !active && <Lock size={14} className="text-slate-300" />}
            </div>
        </button>
    );
};

const WidgetPlaceholder = ({ id, onRemove, readOnly }: { id: string, onRemove?: () => void, readOnly?: boolean }) => {
    const def = WIDGET_DEFINITIONS.find(w => w.id === id);
    const title = def ? def.title : id.replace(/_/g, ' ');

    return (
        <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm relative group overflow-hidden">
            {/* Header / Drag Handle */}
            <div className={`h-8 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between px-2 ${!readOnly ? 'cursor-move grid-stack-item-content-drag-handle' : ''}`}>
                <GripHorizontal size={14} className={!readOnly ? "text-slate-400" : "text-slate-300 opacity-50"} />
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide truncate ml-2 flex-1">{title}</span>
                {onRemove && !readOnly && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Remove Widget"
                    >
                        <Trash2 size={12} />
                    </button>
                )}
            </div>

            {/* Body Placeholder */}
            <div className="flex-1 flex items-center justify-center bg-slate-50/30 dark:bg-slate-900/30">
                <div className="w-8 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            </div>
        </div>
    );
};

// Helper to generate HTML string for dynamically added widgets (GridStack requires HTML string for new widgets)
const getWidgetHTML = (widgetId: string, title: string) => {
    // Note: We use FontAwesome classes matching components/Icons.tsx
    return `
    <div class="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm relative group overflow-hidden">
        <div class="h-8 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between px-2 cursor-move grid-stack-item-content-drag-handle">
            <i class="fa-solid fa-grip-lines text-slate-400" style="font-size: 14px;"></i>
            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide truncate ml-2 flex-1">${title}</span>
            <button class="delete-widget-btn text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer" title="Remove Widget" data-id="${widgetId}">
                <i class="fa-solid fa-trash" style="font-size: 12px; pointer-events: none;"></i>
            </button>
        </div>
        <div class="flex-1 flex items-center justify-center bg-slate-50/30 dark:bg-slate-900/30">
            <div class="w-8 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        </div>
    </div>
    `;
};

// --- Main Component ---

export const Appearance = () => {
    const { theme, updateTheme, language, updateLanguage, dashboardLayouts, updateDashboardLayout, resetDashboard } = useUserPreferences();
    const { addToast } = useToast();
    const gridRef = useRef<GridStack | null>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [activeSection, setActiveSection] = useState<'THEME' | 'LAYOUT'>('THEME');
    const [activeViewMode, setActiveViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [availableWidgets, setAvailableWidgets] = useState<string[]>([]);
    const [layoutState, setLayoutState] = useState<any[]>([]);

    // Initialize Available Widgets (those not in current layout)
    useEffect(() => {
        if (activeSection !== 'LAYOUT') return;

        const currentLayout = dashboardLayouts[activeViewMode] || [];
        const currentIds = currentLayout.map((w: any) => w.id);
        const available = WIDGET_DEFINITIONS.filter(def => !currentIds.includes(def.id)).map(d => d.id);
        setAvailableWidgets(available);
        setLayoutState(currentLayout);
    }, [activeViewMode, dashboardLayouts, activeSection]);

    // Init GridStack
    useEffect(() => {
        if (activeSection !== 'LAYOUT') {
            if (gridRef.current) {
                gridRef.current.destroy(false);
                gridRef.current = null;
            }
            return;
        }

        if (gridRef.current) {
            gridRef.current.destroy(false);
        }

        const options = {
            column: activeViewMode === 'mobile' ? 1 : (activeViewMode === 'tablet' ? 6 : 12),
            cellHeight: 60,
            margin: 10,
            animate: true,
            float: true,
            disableResize: !isEditing || activeViewMode === 'mobile',
            disableDrag: !isEditing,
            acceptWidgets: isEditing,
            removable: '.trash-zone',
        };

        setTimeout(() => {
            const gridEl = document.getElementById('grid-stack-editor');
            if (gridEl) {
                gridRef.current = GridStack.init(options, gridEl);

                // Handle dynamic delete button clicks
                gridEl.addEventListener('click', (e) => {
                    const target = e.target as HTMLElement;
                    const btn = target.closest('.delete-widget-btn');
                    if (btn) {
                        const widgetId = btn.getAttribute('data-id');
                        const widgetEl = btn.closest('.grid-stack-item');
                        if (widgetEl && gridRef.current) {
                            gridRef.current.removeWidget(widgetEl as HTMLElement);
                            if (widgetId) {
                                setAvailableWidgets(prev => [...prev, widgetId]);
                            }
                        }
                    }
                });
            }
        }, 100);

        return () => {
            if (gridRef.current) {
                gridRef.current.destroy(false);
            }
        };
    }, [activeViewMode, activeSection, layoutState]); // Added layoutState to force re-init on reset

    // Update grid interactivity when edit mode changes
    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.enableMove(isEditing);
            gridRef.current.enableResize(isEditing && activeViewMode !== 'mobile');
        }
    }, [isEditing, activeViewMode]);

    const handleSaveLayout = () => {
        if (!gridRef.current) return;
        const layout = gridRef.current.save(false) as any[]; // false = content not saved
        // Map back to our structure (id, x, y, w, h)
        const cleanLayout = layout.map(item => ({
            id: item.id,
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
            visible: true
        }));

        updateDashboardLayout(cleanLayout, activeViewMode);
        // Toast handled in hook
        setIsEditing(false);
    };

    const handleReset = () => {
        resetDashboard();
        // Toast handled in hook
    };

    const addWidgetToGrid = (widgetId: string) => {
        if (!gridRef.current) return;
        const def = WIDGET_DEFINITIONS.find(w => w.id === widgetId);
        if (!def) return;

        gridRef.current.addWidget({
            id: widgetId,
            w: def.defaultW,
            h: def.defaultH,
            minW: def.minW,
            minH: def.minH,
            content: getWidgetHTML(widgetId, def.title)
        });

        setAvailableWidgets(prev => prev.filter(id => id !== widgetId));
    };

    const removeWidget = (widgetId: string) => {
        if (!gridRef.current) return;
        const el = document.querySelector(`.grid-stack-item[gs-id="${widgetId}"]`);
        if (el) {
            gridRef.current.removeWidget(el as HTMLElement);
            setAvailableWidgets(prev => [...prev, widgetId]);
        }
    };

    return (
        <div className="p-8 lg:p-12">
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 dark:border-slate-700 pb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            {activeSection === 'THEME' ? <Palette size={24} className="text-emerald-500" /> : <Layout size={24} className="text-emerald-500" />}
                            Appearance
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Customize the look and feel of your workspace.</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <button
                            onClick={() => {
                                if (isEditing) {
                                    if (activeSection === 'LAYOUT') handleSaveLayout();
                                    else setIsEditing(false);
                                } else {
                                    setIsEditing(true);
                                }
                            }}
                            className={`px-6 py-2 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2 ${isEditing ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                        >
                            {isEditing ? <><Save size={16} /> Save Changes</> : <><Edit2 size={16} /> Edit Settings</>}
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
                    <button
                        onClick={() => setActiveSection('THEME')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeSection === 'THEME' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Interface Theme
                    </button>
                    <button
                        onClick={() => setActiveSection('LAYOUT')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeSection === 'LAYOUT' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Dashboard Layout
                    </button>
                </div>

                {/* 1. Appearance / Theme */}
                {activeSection === 'THEME' && (
                    <section className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8">
                        {/* Language Settings */}
                        <div>
                            <div className="mb-4 flex justify-between items-end">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2"><Globe size={18} className="text-slate-400" /> Regional Settings</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Set your preferred display language.</p>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 max-w-md">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">System Language</label>
                                <select
                                    className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                                    value={language}
                                    onChange={(e) => updateLanguage(e.target.value)}
                                    disabled={!isEditing}
                                >
                                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                                {!isEditing && <p className="text-xs text-slate-400 mt-2 italic flex items-center gap-1"><Lock size={10} /> Edit to change language</p>}
                            </div>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-700"></div>

                        {/* Theme Settings */}
                        <div>
                            <div className="mb-6 flex justify-between items-end">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Theme Selection</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Select a color scheme that suits your preference.</p>
                                </div>
                                {!isEditing && <div className="text-xs text-slate-400 italic flex items-center gap-1"><Lock size={12} /> Edit to change theme</div>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <ThemePreviewCard
                                    mode="light"
                                    label="Light Mode"
                                    active={theme === 'light'}
                                    onClick={() => updateTheme('light')}
                                    disabled={!isEditing}
                                />
                                <ThemePreviewCard
                                    mode="dark"
                                    label="Dark Mode"
                                    active={theme === 'dark'}
                                    onClick={() => updateTheme('dark')}
                                    disabled={!isEditing}
                                />
                                <ThemePreviewCard
                                    mode="system"
                                    label="System Default"
                                    active={theme === 'system'}
                                    onClick={() => updateTheme('system')}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* 2. Dashboard Layout Editor */}
                {activeSection === 'LAYOUT' && (
                    <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Layout Configuration</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Rearrange or resize widgets for your dashboard.</p>
                            </div>
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start md:self-auto">
                                <button
                                    onClick={() => setActiveViewMode('desktop')}
                                    className={`p-2 rounded-md transition-all ${activeViewMode === 'desktop' ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                    title="Desktop Layout"
                                >
                                    <Monitor size={18} />
                                </button>
                                <button
                                    onClick={() => setActiveViewMode('tablet')}
                                    className={`p-2 rounded-md transition-all ${activeViewMode === 'tablet' ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                    title="Tablet Layout"
                                >
                                    <Tablet size={18} />
                                </button>
                                <button
                                    onClick={() => setActiveViewMode('mobile')}
                                    className={`p-2 rounded-md transition-all ${activeViewMode === 'mobile' ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                    title="Mobile Layout"
                                >
                                    <Smartphone size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8 items-start">

                            {/* Sidebar: Available Widgets */}
                            <div className={`w-full lg:w-64 shrink-0 space-y-4 transition-opacity ${!isEditing ? 'opacity-60 pointer-events-none' : ''}`}>
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3 flex items-center justify-between">
                                        Available Widgets
                                        <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] px-1.5 py-0.5 rounded-full">{availableWidgets.length}</span>
                                    </h4>
                                    <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                                        {availableWidgets.map(id => {
                                            const def = WIDGET_DEFINITIONS.find(d => d.id === id);
                                            return (
                                                <div key={id} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm">
                                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{def?.title}</span>
                                                    <button
                                                        onClick={() => addWidgetToGrid(id)}
                                                        className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 p-1 rounded transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                        {availableWidgets.length === 0 && (
                                            <p className="text-xs text-slate-400 italic text-center py-4">All widgets added.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Actions</h4>
                                    <div className="space-y-2">
                                        <button
                                            onClick={handleSaveLayout}
                                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Save size={16} /> Save Layout
                                        </button>
                                        <button
                                            onClick={handleReset}
                                            className="w-full py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <RotateCcw size={16} /> Reset to Default
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Editor Canvas */}
                            <div className={`flex-1 w-full bg-slate-100 dark:bg-slate-900/50 rounded-xl border-2 border-slate-300 dark:border-slate-700 min-h-[500px] p-4 relative ${isEditing ? 'border-dashed' : ''}`}>
                                <div id="grid-stack-editor" className="grid-stack">
                                    {layoutState.map(w => (
                                        <div
                                            key={w.id}
                                            className="grid-stack-item"
                                            gs-id={w.id}
                                            gs-x={w.x}
                                            gs-y={w.y}
                                            gs-w={w.w}
                                            gs-h={w.h}
                                        >
                                            <div className="grid-stack-item-content">
                                                <WidgetPlaceholder id={w.id} onRemove={() => removeWidget(w.id)} readOnly={!isEditing} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Empty State */}
                                {layoutState.length === 0 && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pointer-events-none">
                                        <Layout size={48} className="mb-2 opacity-50" />
                                        <p className="text-sm">Canvas is empty</p>
                                        <p className="text-xs">Add widgets from the sidebar</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

            </div>
        </div>
    );
};
