import { useEffect } from 'react';
import clarity from '@microsoft/clarity';

const CLARITY_PROJECT_ID = "v0ogrd44yt";

/**
 * Hook to manage Microsoft Clarity initialization and user identification.
 * This isolates analytics logic from the main components and handles
 * cases where the script might be blocked by the client.
 */
export const useClarity = (isAuthenticated: boolean, userProfile: any) => {
    useEffect(() => {
        // 1. Initialize Clarity once on mount
        if (clarity && clarity.init) {
            try {
                clarity.init(CLARITY_PROJECT_ID);
            } catch (err) {
                // Ignore initialization errors (usually script blocked)
                console.debug("Clarity initialization blocked or failed");
            }
        }
    }, []);

    useEffect(() => {
        // 2. Identify user and set tags when profile is available
        if (isAuthenticated && userProfile?.email && clarity && clarity.identify) {
            try {
                // Identify user in Clarity
                clarity.identify(
                    userProfile.email,
                    undefined, // Custom ID (Session-based) optional
                    `${userProfile.firstName} ${userProfile.lastName}`
                );

                // Set additional tags for filtering
                if (clarity.setTag) {
                    clarity.setTag('user_role', userProfile.role || 'Unknown');
                    clarity.setTag('active_client', userProfile.activeClient || 'Unknown');

                    // Add company ID if available
                    const companyId = userProfile.currentCompanyID || userProfile.companyID;
                    if (companyId) {
                        clarity.setTag('company_id', companyId.toString());
                    }
                }
            } catch (err) {
                // Silent fail for analytics
            }
        }
    }, [isAuthenticated, userProfile]);
};
