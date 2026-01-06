import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  WelcomeHeader, TrendGraph, 
  SourceDistributionChart, EmailDeliveryReport, PreScreeningProgress, EmptyWidget,
  MetricCard, AlertsWidget
} from '../components/DashboardWidgets';
import { GridStack } from 'gridstack';
import { Layout, Save, Briefcase, Users, UserCheck, RotateCcw, X } from '../components/Icons';
import { useUserPreferences } from '../hooks/useUserPreferences';
import { useToast } from '../components/Toast';
import { useScreenSize } from '../hooks/useScreenSize';

// Mapping IDs to Components
const WIDGET_REGISTRY: Record<string, React.ReactNode> = {
  'welcome': <WelcomeHeader />,
  'active_campaigns': (
    <MetricCard title="Active Campaigns" value="4" icon={Briefcase} colorClass="text-green-600" iconBg="bg-green-50" />
  ),
  'closed_campaigns': (
    <MetricCard title="Closed Campaigns" value="71" icon={Briefcase} colorClass="text-red-500" iconBg="bg-red-50" />
  ),
  'active_profiles': (
    <MetricCard title="Active Profiles" value="11k" icon={Users} colorClass="text-blue-600" iconBg="bg-blue-50" />
  ),
  'shortlisted': (
    <MetricCard title="Shortlisted" value="9" icon={UserCheck} colorClass="text-emerald-600" iconBg="bg-emerald-50" />
  ),
  'alerts': <AlertsWidget />,
  'trend_graph': <TrendGraph />,
  'source_distribution': <SourceDistributionChart />,
  'upcoming_interviews': (
    <EmptyWidget 
      title="Upcoming Interviews" 
      sub={
      <div className="flex gap-2">
          <select className="text-[10px] border rounded px-1 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"><option>Interviews</option></select>
          <div className="flex bg-gray-100 dark:bg-slate-700 rounded"><button className="px-2 text-[10px] dark:text-slate-300">Previous</button><button className="px-2 text-[10px] bg-white dark:bg-slate-600 shadow-sm dark:text-white">Upcoming</button></div>
      </div>
      } 
    />
  ),
  'email_delivery': <EmailDeliveryReport />,
  'portal_reports': (
    <EmptyWidget 
      title="Portal Sourcing Reports" 
      sub={<select className="text-[10px] border rounded px-1 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"><option>Last 7 days</option></select>} 
    />
  ),
  'pre_screening': <PreScreeningProgress />
};

export const Home = () => {
  const gridRef = useRef<GridStack | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { dashboardLayouts, updateDashboardLayout, resetDashboard } = useUserPreferences();
  const { addToast } = useToast();
  const { isMobile, isTablet } = useScreenSize();

  // Determine current layout mode
  const currentMode = useMemo(() => {
      if (isMobile) return 'mobile';
      if (isTablet) return 'tablet';
      return 'desktop';
  }, [isMobile, isTablet]);

  // Get current widgets based on mode
  const activeWidgets = useMemo(() => {
      // Safety check: ensure the mode exists in layouts, otherwise fallback to desktop, then default array
      const modeLayout = dashboardLayouts[currentMode];
      if (modeLayout && Array.isArray(modeLayout) && modeLayout.length > 0) {
          return modeLayout;
      }
      return dashboardLayouts['desktop'] || [];
  }, [dashboardLayouts, currentMode]);

  useEffect(() => {
    // Destroy previous instance if re-initializing to prevent artifacts
    if (gridRef.current) {
        gridRef.current.destroy(false); // false = don't remove DOM elements
    }

    // Initialize GridStack
    // We only init if we have widgets to show
    if (activeWidgets.length > 0) {
        gridRef.current = GridStack.init({
            column: 12,
            cellHeight: 30, 
            margin: 15,
            staticGrid: true, // Start locked
            animate: true,
            float: true
        });
    }
    
    // Force static mode based on state (in case of re-init during edit)
    if (gridRef.current && isEditing) {
        gridRef.current.setStatic(false);
    }

    return () => {
       // Cleanup not strictly necessary as React handles DOM, but good practice
    };
  }, [currentMode, activeWidgets]); // Re-init when mode OR data changes

  const toggleEditMode = () => {
      const grid = gridRef.current;
      if (grid) {
          const newMode = !isEditing;
          setIsEditing(newMode);
          grid.setStatic(!newMode); 
          if (newMode) {
              document.querySelector('.grid-stack')?.classList.add('editing-mode');
          } else {
              document.querySelector('.grid-stack')?.classList.remove('editing-mode');
          }
      }
  };

  const saveLayout = () => {
      if (gridRef.current) {
          const serializedData = gridRef.current.save(false) as any[]; 
          
          // Map GridStack format back to our simple format, preserving visibility
          const newLayout = serializedData.map((node: any) => ({
              id: node.id,
              x: node.x,
              y: node.y,
              w: node.w,
              h: node.h,
              visible: true 
          }));
          
          // Merge with existing to keep hidden ones if any
          // IMPORTANT: We use the ID to match. If a widget isn't in 'newLayout', it means it was hidden or removed from grid.
          const mergedLayout = activeWidgets.map((w: any) => {
              const updated = newLayout.find((n: any) => n.id === w.id);
              if (updated) {
                  return { ...w, ...updated, visible: true };
              }
              // If not found in the grid save, it effectively remains in its previous state or hidden
              // However, since we only render visible widgets, if it's missing from save, it stays as is (likely was hidden before)
              return w;
          });

          updateDashboardLayout(mergedLayout, currentMode);
          addToast(`Dashboard layout saved for ${currentMode} view!`, "success");
          toggleEditMode();
      }
  };

  const removeWidget = (id: string) => {
      const grid = gridRef.current;
      if (grid) {
          const el = document.querySelector(`.grid-stack-item[gs-id="${id}"]`) as HTMLElement;
          if (el) {
              grid.removeWidget(el);
          }
      }
  };

  const handleReset = () => {
      if (confirm(`Reset ${currentMode} dashboard to default layout?`)) {
          resetDashboard();
          window.location.reload(); 
      }
  };

  // Filter visible widgets
  const visibleWidgets = activeWidgets.filter((w: any) => w.visible);

  return (
    <div className="p-4 lg:p-8 bg-slate-50/50 dark:bg-slate-900 min-h-full overflow-y-auto transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto space-y-4">
        
        {/* Dashboard Actions */}
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-bold text-slate-50 dark:text-slate-400 uppercase tracking-wider hidden sm:block">
                {currentMode} Layout
            </h2>
            <div className="flex gap-2 ml-auto">
                {isEditing ? (
                    <>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium animate-pulse flex items-center">Editing...</span>
                        <button 
                            onClick={saveLayout}
                            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
                        >
                            <Save size={14} /> Save Layout
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            onClick={handleReset}
                            className="flex items-center gap-2 px-3 py-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-medium transition-colors"
                            title="Reset to Default"
                        >
                            <RotateCcw size={14} /> Reset
                        </button>
                        <button 
                            onClick={toggleEditMode}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <Layout size={14} /> Edit Dashboard
                        </button>
                    </>
                )}
            </div>
        </div>

        {/* GridStack Container */}
        <div className="grid-stack">
            {visibleWidgets.map((widget: any) => (
                <div 
                    key={`${currentMode}-${widget.id}`} // Force re-render on mode change
                    className="grid-stack-item" 
                    gs-id={widget.id}
                    gs-x={widget.x} 
                    gs-y={widget.y} 
                    gs-w={widget.w} 
                    gs-h={widget.h}
                >
                    <div className="grid-stack-item-content h-full relative group/widget">
                        {WIDGET_REGISTRY[widget.id] || <div className="p-4 bg-white dark:bg-slate-800">Widget {widget.id} not found</div>}
                        
                        {/* Remove Button (Only in Edit Mode) */}
                        {isEditing && (
                            <button 
                                onClick={() => removeWidget(widget.id)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover/widget:opacity-100 transition-opacity shadow-sm z-50 hover:bg-red-600"
                                title="Remove Widget"
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};