
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { WIDGET_REGISTRY } from '../components/DashboardWidgets';
import { GridStack } from 'gridstack';
import { Layout } from '../components/Icons';
import { useUserPreferences } from '../hooks/useUserPreferences';
import { useScreenSize } from '../hooks/useScreenSize';

export const Home = () => {
  const gridRef = useRef<GridStack | null>(null);
  const { dashboardLayouts } = useUserPreferences();
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

    // Initialize GridStack in READ-ONLY mode
    if (activeWidgets.length > 0) {
        gridRef.current = GridStack.init({
            column: 12,
            cellHeight: 30, 
            margin: 15,
            staticGrid: true, // Always locked in Home view
            disableDrag: true,
            disableResize: true,
            animate: true,
            float: true
        });
    }

    return () => {
       // Cleanup handled by React DOM primarily
    };
  }, [currentMode, activeWidgets]);

  // Filter visible widgets
  const visibleWidgets = activeWidgets.filter((w: any) => w.visible);

  return (
    <div className="p-4 lg:p-8 bg-slate-50/50 dark:bg-slate-900 min-h-full overflow-y-auto transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto space-y-4">
        
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
                    <div className="grid-stack-item-content h-full relative group/widget shadow-sm hover:shadow-md transition-shadow">
                        {WIDGET_REGISTRY[widget.id] || <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">Widget {widget.id} not found</div>}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
