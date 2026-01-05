
import React, { useEffect, useRef, useState } from 'react';
import { 
  WelcomeHeader, TrendGraph, 
  SourceDistributionChart, EmailDeliveryReport, PreScreeningProgress, EmptyWidget,
  MetricsOverviewWidget
} from '../components/DashboardWidgets';
import { GridStack } from 'gridstack';
import { Layout, Save, RotateCcw } from '../components/Icons';

export const Home = () => {
  const gridRef = useRef<GridStack | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Initialize GridStack
    if (!gridRef.current) {
        gridRef.current = GridStack.init({
            column: 12,
            cellHeight: 100,
            margin: 10,
            staticGrid: true, // Default to locked
            animate: true,
            disableOneColumnMode: true, // Force multi-column layout on larger screens
            float: true // Allow widgets to float up
        });
    }

    // Cleanup on unmount
    return () => {
        // GridStack instance is often global or attached to DOM, careful with cleanup if needed
        // gridRef.current?.destroy(false); 
    };
  }, []);

  const toggleEditMode = () => {
      const grid = gridRef.current;
      if (grid) {
          const newMode = !isEditing;
          setIsEditing(newMode);
          grid.setStatic(!newMode); // Enable/Disable moving/resizing
          if (newMode) {
              // Add visual cues for editing
              document.querySelector('.grid-stack')?.classList.add('editing-mode');
          } else {
              document.querySelector('.grid-stack')?.classList.remove('editing-mode');
          }
      }
  };

  const saveLayout = () => {
      // Mock save functionality
      if (gridRef.current) {
          const serializedData = gridRef.current.save();
          console.log('Layout saved:', serializedData);
          toggleEditMode(); // Exit edit mode
      }
  };

  return (
    <div className="p-4 lg:p-6 bg-slate-50/50 dark:bg-slate-900 min-h-full overflow-y-auto transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto space-y-4">
        
        {/* Dashboard Actions */}
        <div className="flex justify-end items-center gap-3 mb-2">
            {isEditing ? (
                <>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium animate-pulse">Editing Layout...</span>
                    <button 
                        onClick={saveLayout}
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
                    >
                        <Save size={14} /> Save Layout
                    </button>
                </>
            ) : (
                <button 
                    onClick={toggleEditMode}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                    <Layout size={14} /> Edit Dashboard
                </button>
            )}
        </div>

        {/* GridStack Container */}
        <div className="grid-stack">
            
            {/* Widget 1: Welcome Header */}
            <div className="grid-stack-item" gs-x="0" gs-y="0" gs-w="4" gs-h="4">
                <div className="grid-stack-item-content h-full">
                    <WelcomeHeader />
                </div>
            </div>

            {/* Widget 2: Metrics Overview (Grouped) */}
            <div className="grid-stack-item" gs-x="4" gs-y="0" gs-w="8" gs-h="4">
                <div className="grid-stack-item-content h-full">
                    <MetricsOverviewWidget />
                </div>
            </div>

            {/* Widget 3: Trend Graph */}
            <div className="grid-stack-item" gs-x="0" gs-y="4" gs-w="6" gs-h="4">
                <div className="grid-stack-item-content h-full">
                    <TrendGraph />
                </div>
            </div>

            {/* Widget 4: Source Distribution */}
            <div className="grid-stack-item" gs-x="6" gs-y="4" gs-w="6" gs-h="4">
                <div className="grid-stack-item-content h-full">
                    <SourceDistributionChart />
                </div>
            </div>

            {/* Widget 5: Upcoming Interviews */}
            <div className="grid-stack-item" gs-x="0" gs-y="8" gs-w="4" gs-h="3">
                <div className="grid-stack-item-content h-full">
                    <EmptyWidget 
                        title="Upcoming Interviews" 
                        sub={
                        <div className="flex gap-2">
                            <select className="text-[10px] border rounded px-1 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"><option>Interviews</option></select>
                            <div className="flex bg-gray-100 dark:bg-slate-700 rounded"><button className="px-2 text-[10px] dark:text-slate-300">Previous</button><button className="px-2 text-[10px] bg-white dark:bg-slate-600 shadow-sm dark:text-white">Upcoming</button></div>
                        </div>
                        } 
                    />
                </div>
            </div>

            {/* Widget 6: Email Delivery */}
            <div className="grid-stack-item" gs-x="4" gs-y="8" gs-w="4" gs-h="3">
                <div className="grid-stack-item-content h-full">
                    <EmailDeliveryReport />
                </div>
            </div>

            {/* Widget 7: Portal Reports */}
            <div className="grid-stack-item" gs-x="8" gs-y="8" gs-w="4" gs-h="3">
                <div className="grid-stack-item-content h-full">
                    <EmptyWidget 
                        title="Portal Sourcing Reports" 
                        sub={<select className="text-[10px] border rounded px-1 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"><option>Last 7 days</option></select>} 
                    />
                </div>
            </div>

            {/* Widget 8: Pre-Screening */}
            <div className="grid-stack-item" gs-x="0" gs-y="11" gs-w="12" gs-h="3">
                <div className="grid-stack-item-content h-full">
                    <PreScreeningProgress />
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
