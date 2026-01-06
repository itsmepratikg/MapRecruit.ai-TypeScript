
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { 
  Monitor, Moon, Sun, Smartphone, Tablet, Layout, Save, RotateCcw, 
  CheckCircle, Plus, X, GripHorizontal, Trash2
} from '../../components/Icons';
import { GridStack } from 'gridstack';
import { WIDGET_DEFINITIONS } from '../../components/DashboardWidgets'; // Import Definitions
import { useToast } from '../../components/Toast';

// --- Components ---

const ThemePreviewCard = ({ 
    mode, 
    active, 
    onClick, 
    label 
}: { 
    mode: 'light' | 'dark' | 'system', 
    active: boolean, 
    onClick: () => void, 
    label: string 
}) => {
    return (
        <button 
            onClick={onClick}
            className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all w-full text-left group ${active ? 'border-emerald-500 bg-emerald-50/10 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'}`}
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

            <div className="w-full">
                <span className={`font-bold text-sm ${active ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>{label}</span>
            </div>
        </button>
    );
};

const WidgetPlaceholder = ({ id, onRemove }: { id: string, onRemove?: () => void }) => {
    const def = WIDGET_DEFINITIONS.find(w => w.id === id);
    const title = def ? def.title : id.replace(/_/g, ' ');

    return (
        <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm relative group overflow-hidden">
            {/* Header / Drag Handle */}
            <div className="h-8 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between px-2 cursor-move grid-stack-item-content-drag-handle">
                <GripHorizontal size={14} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide truncate ml-2 flex-1">{title}</span>
                {onRemove && (
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
            <div className="flex-1 flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/30 p-4">
               <div className="text-center opacity-50">
                   <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-full mx-auto mb-2"></div>
                   <div className="h-2 w-16 bg-slate-200 dark:bg-slate-600 rounded mx-auto"></div>
               </div>
            </div>
        </div>
    );
};

// --- Main Component ---

export const Appearance = () => {
  const [activeTab, setActiveTab] = useState<'THEME' | 'DASHBOARD'>('THEME');
  const { theme, updateTheme, dashboardLayouts, updateDashboardLayout, resetDashboard } = useUserPreferences();
  const { addToast } = useToast();

  // Dashboard Editor State
  const gridRef = useRef<GridStack | null>(null);
  const [editMode, setEditMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [currentWidgets, setCurrentWidgets] = useState<any[]>([]);

  // Sync state with global preferences on load/mode change
  useEffect(() => {
      const layouts = dashboardLayouts[editMode] || [];
      setCurrentWidgets(layouts);
  }, [dashboardLayouts, editMode]);

  // Derived list of available widgets (not in current layout)
  const availableWidgets = useMemo(() => {
      const currentIds = currentWidgets.map(w => w.id);
      return WIDGET_DEFINITIONS.filter(def => !currentIds.includes(def.id));
  }, [currentWidgets]);

  // Initialize GridStack for Editor
  useEffect(() => {
      if (activeTab !== 'DASHBOARD') return;

      if (gridRef.current) {
          gridRef.current.destroy(false);
      }

      const timer = setTimeout(() => {
          const grid = GridStack.init({
              column: 12,
              cellHeight: 30,
              margin: 10,
              float: true,
              animate: true,
              disableOneColumnMode: true,
              acceptWidgets: true,
              dragIn: '.new-widget', // Enable dragging from sidebar
              dragInOptions: { appendTo: 'body', helper: 'clone' },
              removable: '#trash', // Optional drop-to-remove zone
          });
          
          gridRef.current = grid;

          // Event Listener for External Adds
          grid.on('added', (event: any, items: any[]) => {
             // When an item is dropped from the sidebar, GridStack adds it.
             // We need to sync our React state `currentWidgets` to reflect this new item 
             // so the sidebar updates (removes it) and we track it for saving.
             const newItems = items.map(item => ({
                 id: item.id,
                 x: item.x,
                 y: item.y,
                 w: item.w,
                 h: item.h,
                 visible: true
             }));
             
             setCurrentWidgets(prev => {
                 // Prevent duplicates if multiple events fire
                 const existingIds = prev.map(p => p.id);
                 const uniqueNew = newItems.filter(n => !existingIds.includes(n.id));
                 return [...prev, ...uniqueNew];
             });
          });

          // Event Listener for Changes (Moves/Resizes)
          grid.on('change', (event: any, items: any[]) => {
             // We don't necessarily need to update React state on every drag pixel, 
             // but we do need the final state on Save.
             // However, keeping `currentWidgets` somewhat fresh helps if we render based on it.
             // For performance, we might skip heavy updates here and rely on grid.save() at the end.
          });

      }, 100);

      return () => {
          clearTimeout(timer);
          if (gridRef.current) {
              gridRef.current.destroy(false);
          }
      };
  }, [activeTab, editMode]);

  // Remove Widget Handler
  const handleRemoveWidget = (id: string) => {
      if (gridRef.current) {
          // Find the element
          const el = document.querySelector(`.grid-stack-item[gs-id="${id}"]`);
          if (el) {
              gridRef.current.removeWidget(el as HTMLElement);
              setCurrentWidgets(prev => prev.filter(w => w.id !== id));
          }
      }
  };

  // Add Widget Handler (Click)
  const handleAddWidgetClick = (def: any) => {
      if (gridRef.current) {
          // Add to grid
          const newNode = {
              id: def.id,
              x: 0, 
              y: 0, // Auto placement
              w: def.defaultW,
              h: def.defaultH,
              autoPosition: true
          };
          
          gridRef.current.addWidget(
              `<div class="grid-stack-item">
                  <div class="grid-stack-item-content"></div>
               </div>`, 
              newNode
          );
          // Sync State triggers via 'added' event usually, but manual add might need manual state sync if event doesn't fire same way.
          // GridStack 'added' event fires on addWidget too.
      }
  };

  const handleSaveLayout = () => {
      if (gridRef.current) {
          const serializedData = gridRef.current.save(false) as any[];
          const newLayout = serializedData.map((node: any) => ({
              id: node.id,
              x: node.x,
              y: node.y,
              w: node.w,
              h: node.h,
              visible: true
          }));
          
          updateDashboardLayout(newLayout, editMode);
          addToast(`Layout saved for ${editMode} view`, 'success');
      }
  };

  const handleResetLayout = () => {
      if(confirm(`Reset ${editMode} layout to defaults?`)) {
          resetDashboard();
          window.location.reload(); 
      }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Appearance</h3>
            <p className="text-slate-500 dark:text-slate-400">Customize the look and feel of your workspace.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
            <button 
                onClick={() => setActiveTab('THEME')}
                className={`pb-3 px-6 text-sm font-bold transition-all border-b-2 ${activeTab === 'THEME' ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
                Theme Preferences
            </button>
            <button 
                onClick={() => setActiveTab('DASHBOARD')}
                className={`pb-3 px-6 text-sm font-bold transition-all border-b-2 ${activeTab === 'DASHBOARD' ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
                Dashboard Layout
            </button>
        </div>

        {/* Theme Content */}
        {activeTab === 'THEME' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-200">
                <ThemePreviewCard 
                    mode="light" 
                    label="Light Mode" 
                    active={theme === 'light'} 
                    onClick={() => updateTheme('light')} 
                />
                <ThemePreviewCard 
                    mode="dark" 
                    label="Dark Mode" 
                    active={theme === 'dark'} 
                    onClick={() => updateTheme('dark')} 
                />
                <ThemePreviewCard 
                    mode="system" 
                    label="System Default" 
                    active={theme === 'system'} 
                    onClick={() => updateTheme('system')} 
                />
            </div>
        )}

        {/* Dashboard Editor Content */}
        {activeTab === 'DASHBOARD' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                {/* Editor Toolbar */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                        <button 
                            onClick={() => setEditMode('desktop')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${editMode === 'desktop' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                        >
                            <Monitor size={16} /> Desktop
                        </button>
                        <button 
                            onClick={() => setEditMode('tablet')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${editMode === 'tablet' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                        >
                            <Tablet size={16} /> Tablet
                        </button>
                        <button 
                            onClick={() => setEditMode('mobile')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${editMode === 'mobile' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                        >
                            <Smartphone size={16} /> Mobile
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={handleResetLayout}
                            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <RotateCcw size={16} /> Reset Default
                        </button>
                        <button 
                            onClick={handleSaveLayout}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-sm transition-colors"
                        >
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Editor Area */}
                    <div className="flex-1 flex justify-center bg-slate-100/50 dark:bg-black/20 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 min-h-[600px]">
                        <div 
                            className={`transition-all duration-300 shadow-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden ${
                                editMode === 'desktop' ? 'w-full max-w-full' : 
                                editMode === 'tablet' ? 'w-[768px]' : 
                                'w-[375px]'
                            }`}
                        >
                            {/* Fake Header for context */}
                            <div className="h-12 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4">
                                <div className="w-20 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            </div>

                            {/* GridStack Area */}
                            <div className="p-4 bg-slate-50/50 dark:bg-slate-900 h-full min-h-[500px]">
                                <div className="grid-stack editing-mode">
                                    {currentWidgets.map((widget: any) => (
                                        <div 
                                            key={widget.id}
                                            className="grid-stack-item"
                                            gs-id={widget.id}
                                            gs-x={widget.x} 
                                            gs-y={widget.y} 
                                            gs-w={widget.w} 
                                            gs-h={widget.h}
                                        >
                                            <div className="grid-stack-item-content">
                                                <WidgetPlaceholder id={widget.id} onRemove={() => handleRemoveWidget(widget.id)} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Widget Library Sidebar */}
                    <div className="w-full lg:w-72 shrink-0 space-y-4">
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Available Widgets</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Drag and drop widgets to add them to your dashboard.</p>
                            
                            <div className="space-y-3">
                                {availableWidgets.length === 0 && (
                                    <div className="text-center py-8 text-slate-400 text-xs italic bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                        All available widgets added.
                                    </div>
                                )}
                                {availableWidgets.map(widget => (
                                    <div 
                                        key={widget.id}
                                        className="new-widget bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-3 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all flex items-center justify-between group"
                                        gs-id={widget.id}
                                        gs-w={widget.defaultW}
                                        gs-h={widget.defaultH}
                                        onClick={() => handleAddWidgetClick(widget)}
                                    >
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{widget.title}</span>
                                        <Plus size={16} className="text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 p-4">
                            <h5 className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase mb-2">Pro Tip</h5>
                            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                You can resize widgets by dragging their bottom-right corner. Use the "Reset Default" button to restore the original layout.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
