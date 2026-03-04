
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createWidgetRegistry } from '../components/DashboardWidgets';
import { GridStack } from 'gridstack';
import { Layout } from '../components/Icons';
import { useUserPreferences } from '../hooks/useUserPreferences';
import { useScreenSize } from '../hooks/useScreenSize';
import { useTranslation } from 'react-i18next';
import { campaignService } from '../services/api';
import api from '../services/api';
import { integrationService } from '../services/integrationService';
import { useWebSocket } from '../context/WebSocketContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { CoPresenceAvatars } from '../components/engage/CoPresenceAvatars';
import { RefreshCw } from '../components/Icons';

interface HomeProps {
    onNavigate: (tab: string) => void;
}

export const Home = ({ onNavigate }: HomeProps) => {
    const { t } = useTranslation();
    const gridRef = useRef<GridStack | null>(null);
    const { dashboardLayouts } = useUserPreferences();
    const { isMobile, isTablet } = useScreenSize();
    const [counts, setCounts] = useState({ active: 0, closed: 0, archived: 0, profiles: 0, shortlisted: 0 });
    const { joinRoom, leaveRoom } = useWebSocket();
    const { userProfile } = useUserProfile();

    // Join Dashboard Presence
    useEffect(() => {
        if (userProfile) {
            const userId = userProfile?._id || userProfile?.id;
            if (userId && userId !== 'visitor') {
                joinRoom('dashboard', {
                    id: userId,
                    firstName: userProfile.firstName || 'User',
                    lastName: userProfile.lastName || '',
                    email: userProfile.email || '',
                    avatar: userProfile.avatar,
                    color: userProfile.color || 'bg-blue-500'
                }, 'Dashboard');

                return () => leaveRoom('dashboard', userId);
            }
        }
    }, [userProfile, joinRoom, leaveRoom]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch Campaign Stats
                const campStats = await campaignService.getStats();

                // Fetch Profile Stats
                let profileCount = 0;
                try {
                    const profileStats = await api.get('/profiles/stats');
                    profileCount = profileStats.data.totalProfiles || 0;
                } catch (e) {
                    console.warn("Failed to fetch profiles for stats", e);
                }

                setCounts({
                    ...campStats,
                    profiles: profileCount,
                    shortlisted: 0 // Placeholder
                });
            } catch (err) {
                console.error("Failed to fetch dashboard stats:", err);
            }
        };

        const triggerBackgroundSync = async () => {
            try {
                // Silent background sync to keep tokens alive and data fresh
                await integrationService.syncAll();
            } catch (err) {
                console.warn("Background integration sync failed:", err);
            }
        };

        fetchStats();
        triggerBackgroundSync();
    }, []);

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

    // Create widget registry with navigation handler
    const widgetRegistry = useMemo(() => createWidgetRegistry(onNavigate, t, counts), [onNavigate, t, counts]);

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
        <div className="p-4 lg:p-8 bg-slate-50/50 dark:bg-slate-900 min-h-full overflow-y-auto custom-scrollbar transition-colors duration-300">
            <div className="max-w-[1600px] mx-auto space-y-4">
                {/* GridStack Container */}
                <div className="grid-stack" data-tour="dashboard-widgets">
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
                                {widgetRegistry[widget.id] || <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">Widget {widget.id} {t("not found")}</div>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
