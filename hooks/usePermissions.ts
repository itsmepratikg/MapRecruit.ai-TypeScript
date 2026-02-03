
import { useMemo } from 'react';
import { useUserProfile } from './useUserProfile';

/**
 * Hook to check granular permissions for the current user.
 * Example Usage:
 * const { can } = usePermissions();
 * if (can('System & Administration', 'settings', 'users', 'createUser')) { ... }
 */
export const usePermissions = () => {
    const { userProfile: user } = useUserProfile();

    const permissions = useMemo(() => {
        return user?.roleID?.accessibilitySettings || {};
    }, [user]);

    const can = (...path: string[]): boolean => {
        if (!user) return false;

        // Super/Product Admin Bypass (Optional: decide if admins have absolute true)
        if (user.role === 'Product Admin') return true;

        let current: any = permissions;

        for (const segment of path) {
            if (current === undefined || current === null) return false;

            // If it's an object, check if it's enabled/visible
            if (typeof current === 'object') {
                // If we are looking for a specific boolean key like 'createUser'
                if (current[segment] !== undefined) {
                    current = current[segment];
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        // Final value check
        if (typeof current === 'boolean') return current;
        if (typeof current === 'object') {
            return current.enabled !== false && current.visible !== false;
        }

        return false;
    };

    const canEdit = (...path: string[]): boolean => {
        if (!user) return false;
        if (user.role === 'Product Admin') return true;

        let current: any = permissions;

        for (const segment of path) {
            if (current === undefined || current === null) return false;

            if (typeof current === 'object') {
                if (current[segment] !== undefined) {
                    current = current[segment];
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        if (typeof current === 'object') {
            // Check specific 'editable' flag if present, otherwise default to enabled check or true
            return current.editable === true;
        }

        return false;
    };

    return { can, canEdit, permissions, roleName: user?.roleID?.roleName || user?.role };
};
