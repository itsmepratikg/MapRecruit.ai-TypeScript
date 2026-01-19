import { useState, useEffect } from 'react';
import { DEFAULT_USER_ACCOUNT } from '../data';
import { userService } from '../services/api';
import { useToast } from '../components/Toast';

export const useUserPreferences = () => {

  // Use custom hook for consistent toast styling
  const { addPromise } = useToast();

  // --- Helper: Get State from Auth User or Fallback ---
  const getInitialState = () => {
    if (typeof window === 'undefined') return DEFAULT_USER_ACCOUNT.preferences;

    // 1. Try Authenticated User (Source of Truth)
    const authUserStr = localStorage.getItem('user');
    if (authUserStr) {
      try {
        const user = JSON.parse(authUserStr);
        if (user.accessibilitySettings && Object.keys(user.accessibilitySettings).length > 0) {
          // Merge with defaults to ensure structure integrity
          return {
            theme: user.accessibilitySettings.theme || DEFAULT_USER_ACCOUNT.preferences.theme,
            language: user.accessibilitySettings.language || DEFAULT_USER_ACCOUNT.preferences.language,
            dashboardConfig: {
              ...DEFAULT_USER_ACCOUNT.preferences.dashboardConfig,
              ...(user.accessibilitySettings.dashboardConfig || {}),
              layouts: {
                ...DEFAULT_USER_ACCOUNT.preferences.dashboardConfig.layouts,
                ...(user.accessibilitySettings.dashboardConfig?.layouts || {})
              }
            }
          };
        }
      } catch (e) { console.error("Error parsing user settings", e); }
    }

    // 2. Fallback: Legacy LocalStorage
    try {
      const stored = localStorage.getItem('userAccount');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.preferences) return parsed.preferences;
      }
    } catch (e) { }

    return DEFAULT_USER_ACCOUNT.preferences;
  };

  const [preferences, setPreferences] = useState(getInitialState);

  // --- Persistence Logic ---
  // Accepts PARTIAL updates (e.g., { theme: 'dark' } or { dashboardConfig: ... })
  const persistPreferences = async (partialPrefs: any) => {

    // 1. Calculate Full New State locally (for immediate UI update)
    const newState = {
      ...preferences,
      ...partialPrefs,
      // Handle nested dashboardConfig merge if present in partial
      dashboardConfig: partialPrefs.dashboardConfig ? {
        ...preferences.dashboardConfig,
        ...partialPrefs.dashboardConfig,
        layouts: {
          ...preferences.dashboardConfig.layouts,
          ...(partialPrefs.dashboardConfig.layouts || {})
        }
      } : preferences.dashboardConfig
    };

    // Update Local State 
    setPreferences(newState);

    // 2. Update LocalStorage 'user' object (Optimistic Update)
    const authUserStr = localStorage.getItem('user');
    if (authUserStr) {
      try {
        const user = JSON.parse(authUserStr);

        // We must save the FULL state to local storage so page reloads work correctly
        user.accessibilitySettings = newState;
        localStorage.setItem('user', JSON.stringify(user));

        // 3. Send ONLY PARTIAL to Backend (Bandwidth Optimization)
        const userId = user._id || user.id;
        if (userId) {
          await addPromise(
            userService.update(userId, { accessibilitySettings: partialPrefs }),
            {
              loading: 'Saving changes...',
              success: 'Settings saved',
              error: 'Could not save settings. Please try again.'
            }
          );
        }
      } catch (error) {
        console.error("Failed to save preferences to server", error);
      }
    } else {
      // Guest/Fallback mode
      localStorage.setItem('userAccount', JSON.stringify({
        ...DEFAULT_USER_ACCOUNT,
        preferences: newState
      }));
    }
  };

  // --- Effect: Apply Theme to Document ---
  useEffect(() => {
    const applyTheme = (t: string) => {
      let isDark = false;
      if (t === 'dark') {
        isDark = true;
      } else if (t === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme(preferences.theme);

    // Listen for system changes if mode is system
    if (preferences.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [preferences.theme]);


  // --- Updaters (Sending Partials) ---

  const updateTheme = (theme: 'light' | 'dark' | 'system') => {
    persistPreferences({ theme });
  };

  const updateLanguage = (lang: string) => {
    persistPreferences({ language: lang });
  };

  const updateDashboardLayout = (widgets: any[], viewMode: 'desktop' | 'tablet' | 'mobile') => {
    // Construct the partial nested structure
    const partial = {
      dashboardConfig: {
        layouts: {
          [viewMode]: widgets
        }
      }
    };
    persistPreferences(partial);
  };

  const resetDashboard = () => {
    persistPreferences({
      dashboardConfig: DEFAULT_USER_ACCOUNT.preferences.dashboardConfig
    });
  }

  return {
    userAccount: { preferences }, // Maintain backward compatibility shape if needed
    theme: preferences.theme,
    language: preferences.language,
    dashboardLayouts: preferences.dashboardConfig.layouts,
    updateTheme,
    updateLanguage,
    updateDashboardLayout,
    resetDashboard
  };
};