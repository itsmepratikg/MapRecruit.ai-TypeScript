
import { useState, useEffect } from 'react';
import { DEFAULT_USER_ACCOUNT } from '../data';

// Key for LocalStorage
const STORAGE_KEY = 'userAccount';

export const useUserPreferences = () => {
  // Initialize state from local storage or default
  const [userAccount, setUserAccount] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_USER_ACCOUNT;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // --- MIGRATION & SAFETY LOGIC ---
        
        // 1. Handle Legacy Format (Migration)
        if (parsed.preferences?.dashboardConfig?.widgets && !parsed.preferences?.dashboardConfig?.layouts) {
            console.log("Migrating legacy dashboard configuration...");
            const legacyWidgets = parsed.preferences.dashboardConfig.widgets;
            
            return {
                ...DEFAULT_USER_ACCOUNT, 
                ...parsed,
                preferences: {
                    ...parsed.preferences,
                    dashboardConfig: {
                        ...DEFAULT_USER_ACCOUNT.preferences.dashboardConfig,
                        layouts: {
                            ...DEFAULT_USER_ACCOUNT.preferences.dashboardConfig.layouts,
                            desktop: legacyWidgets // Migrate widgets to desktop
                        }
                    }
                }
            };
        }

        // 2. Handle Robust Merging (Ensure all modes exist)
        // If the stored data has layouts, we merge them with defaults to ensure
        // that if 'mobile' or 'tablet' is missing in the saved data, we use the default.
        if (parsed.preferences?.dashboardConfig?.layouts) {
            return { 
                ...DEFAULT_USER_ACCOUNT, 
                ...parsed,
                preferences: {
                    ...DEFAULT_USER_ACCOUNT.preferences,
                    ...parsed.preferences,
                    dashboardConfig: {
                        ...DEFAULT_USER_ACCOUNT.preferences.dashboardConfig,
                        ...parsed.preferences.dashboardConfig,
                        layouts: {
                            desktop: parsed.preferences.dashboardConfig.layouts.desktop || DEFAULT_USER_ACCOUNT.preferences.dashboardConfig.layouts.desktop,
                            tablet: parsed.preferences.dashboardConfig.layouts.tablet || DEFAULT_USER_ACCOUNT.preferences.dashboardConfig.layouts.tablet,
                            mobile: parsed.preferences.dashboardConfig.layouts.mobile || DEFAULT_USER_ACCOUNT.preferences.dashboardConfig.layouts.mobile
                        }
                    }
                }
            }; 
        }
      }
    } catch (e) {
      console.error("Failed to load user preferences", e);
    }
    // Fallback to pure default
    return DEFAULT_USER_ACCOUNT;
  });

  // Save to local storage whenever userAccount changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userAccount));
    } catch (e) {
      console.error("Failed to save user preferences", e);
    }
  }, [userAccount]);

  // Helper to update specific preferences
  const updateTheme = (theme: 'light' | 'dark') => {
    setUserAccount(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme
      }
    }));
  };

  const updateDashboardLayout = (widgets: any[], viewMode: 'desktop' | 'tablet' | 'mobile') => {
    setUserAccount(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        dashboardConfig: {
          ...prev.preferences.dashboardConfig,
          layouts: {
            ...prev.preferences.dashboardConfig.layouts,
            [viewMode]: widgets
          }
        }
      }
    }));
  };

  const resetDashboard = () => {
      setUserAccount(prev => ({
          ...prev,
          preferences: {
              ...prev.preferences,
              dashboardConfig: DEFAULT_USER_ACCOUNT.preferences.dashboardConfig
          }
      }));
  }

  return {
    userAccount,
    theme: userAccount.preferences.theme,
    dashboardLayouts: userAccount.preferences.dashboardConfig.layouts,
    updateTheme,
    updateDashboardLayout,
    resetDashboard
  };
};
