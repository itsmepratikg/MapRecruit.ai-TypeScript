import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface ImpersonationState {
    isImpersonating: boolean;
    impersonatorId?: string;
    targetUser?: any;
    mode: 'read-only' | 'full';
}

interface ImpersonationContextType extends ImpersonationState {
    startImpersonation: (token: string, targetUser: any, mode: 'read-only' | 'full') => void;
    stopImpersonation: () => void;
}

const ImpersonationContext = createContext<ImpersonationContextType | undefined>(undefined);

export const ImpersonationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<ImpersonationState>({
        isImpersonating: false,
        mode: 'read-only'
    });

    useEffect(() => {
        // Sync with storage on mount
        const adminToken = localStorage.getItem('admin_restore_token');
        const mode = localStorage.getItem('impersonation_mode') as 'read-only' | 'full';
        const cachedTarget = localStorage.getItem('impersonation_target');

        if (adminToken) {
            setState({
                isImpersonating: true,
                mode: mode || 'read-only',
                targetUser: cachedTarget ? JSON.parse(cachedTarget) : null
            });
        }
    }, []);

    const startImpersonation = (token: string, targetUser: any, mode: 'read-only' | 'full') => {
        const currentAdminToken = localStorage.getItem('authToken');

        if (currentAdminToken) {
            localStorage.setItem('admin_restore_token', currentAdminToken);
        }

        // Set Impersonation Context
        localStorage.setItem('impersonation_mode', mode);
        localStorage.setItem('impersonation_target', JSON.stringify(targetUser));

        // Swap to Target Token
        localStorage.setItem('authToken', token);

        // Clear user profile cache to force fresh load of target user
        localStorage.removeItem('user_profile_cache');

        setState({
            isImpersonating: true,
            targetUser,
            mode
        });

        // Hard Reload to reset all app states/sockets/etc with new token
        window.location.reload();
    };

    const stopImpersonation = () => {
        const adminToken = localStorage.getItem('admin_restore_token');

        if (adminToken) {
            // Restore Admin Token
            localStorage.setItem('authToken', adminToken);

            // Clear Backup & Context
            localStorage.removeItem('admin_restore_token');
            localStorage.removeItem('impersonation_mode');
            localStorage.removeItem('impersonation_target');
            localStorage.removeItem('user_profile_cache'); // Clear target's cache

            setState({ isImpersonating: false, mode: 'read-only', targetUser: null });

            window.location.reload();
        }
    };

    return (
        <ImpersonationContext.Provider value={{ ...state, startImpersonation, stopImpersonation }}>
            {children}
        </ImpersonationContext.Provider>
    );
};

export const useImpersonation = () => {
    const context = useContext(ImpersonationContext);
    if (!context) {
        throw new Error('useImpersonation must be used within an ImpersonationProvider');
    }
    return context;
};
