
import { useState, useEffect, useRef } from 'react';
import { INITIAL_PROFILE_DATA, UserProfileData } from '../data/profile';

const STORAGE_KEY = 'user_profile_v1';
const EVENT_KEY = 'profile-updated';

export const useUserProfile = () => {
    const [userProfile, setUserProfile] = useState<UserProfileData>(() => {
        if (typeof window === 'undefined') return INITIAL_PROFILE_DATA;
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const profile = stored ? JSON.parse(stored) : INITIAL_PROFILE_DATA;

            // Merge with Auth Data
            const authUserStr = localStorage.getItem('user');
            if (authUserStr) {
                const authUser = JSON.parse(authUserStr);
                return {
                    ...profile,
                    _id: authUser._id || authUser.id,
                    email: authUser.email || profile.email,
                    firstName: authUser.firstName || profile.firstName,
                    lastName: authUser.lastName || profile.lastName,
                    phone: authUser.phone || authUser.mobile || profile.phone,
                    role: authUser.role || profile.role,
                    roleID: authUser.roleID || profile.roleID,
                    activeClient: authUser.activeClient || profile.activeClient,
                    companyID: authUser.companyID || profile.companyID,
                    activeClientID: authUser.activeClientID || profile.activeClientID,
                    clientID: authUser.clientID || authUser.clients || profile.clientID,
                    clients: authUser.clients || authUser.clientID || profile.clients,
                    teams: Array.isArray(authUser.clients) ? authUser.clients.map((c: any) => typeof c === 'object' ? (c.clientName || c.name) : c) : (profile.teams || []),
                    currentCompanyID: authUser.currentCompanyID || profile.currentCompanyID,
                    lastLoginAt: authUser.lastLoginAt,
                    loginCount: authUser.loginCount,
                    lastActiveAt: authUser.lastActiveAt,
                    timeZone: authUser.timeZone || profile.timeZone,
                    jobTitle: authUser.jobTitle || profile.jobTitle,
                    location: authUser.location || profile.location,
                    color: authUser.color || profile.color,
                    avatar: authUser.avatar || profile.avatar
                };
            }
            return profile;
        } catch (e) {
            return INITIAL_PROFILE_DATA;
        }
    });

    // Listen for updates from other components
    useEffect(() => {
        const handleProfileUpdate = () => {
            const stored = localStorage.getItem(STORAGE_KEY);
            let profile = stored ? JSON.parse(stored) : INITIAL_PROFILE_DATA;

            // Merge with Auth Data
            const authUserStr = localStorage.getItem('user');
            if (authUserStr) {
                const authUser = JSON.parse(authUserStr);
                profile = {
                    ...profile,
                    _id: authUser._id || authUser.id,
                    email: authUser.email || profile.email,
                    firstName: authUser.firstName || profile.firstName,
                    lastName: authUser.lastName || profile.lastName,
                    phone: authUser.phone || authUser.mobile || profile.phone,
                    role: authUser.role || profile.role,
                    roleID: authUser.roleID || profile.roleID,
                    activeClient: authUser.activeClient || profile.activeClient,
                    companyID: authUser.companyID || profile.companyID,
                    activeClientID: authUser.activeClientID || profile.activeClientID,
                    clientID: authUser.clientID || authUser.clients || profile.clientID,
                    clients: authUser.clients || authUser.clientID || profile.clients,
                    teams: Array.isArray(authUser.clients) ? authUser.clients.map((c: any) => typeof c === 'object' ? (c.clientName || c.name) : c) : (profile.teams || []),
                    currentCompanyID: authUser.currentCompanyID || profile.currentCompanyID,
                    lastLoginAt: authUser.lastLoginAt,
                    loginCount: authUser.loginCount,
                    lastActiveAt: authUser.lastActiveAt,
                    timeZone: authUser.timeZone || profile.timeZone,
                    jobTitle: authUser.jobTitle || profile.jobTitle,
                    location: authUser.location || profile.location,
                    color: authUser.color || profile.color,
                    avatar: authUser.avatar || profile.avatar
                };
            }
            setUserProfile(profile);
        };

        window.addEventListener(EVENT_KEY, handleProfileUpdate);
        return () => window.removeEventListener(EVENT_KEY, handleProfileUpdate);
    }, []);

    // POLLING: Live updates from server
    const etagRef = useRef<string | null>(null);
    useEffect(() => {
        // Only run if we have a user logged in
        if (!localStorage.getItem('user')) return;

        import('../services/api').then(({ default: api }) => {
            const fetchUser = async () => {
                try {
                    // Check if we need to force refresh (e.g. if roleID is just a string ID instead of object)
                    const currentStored = localStorage.getItem('user');
                    let forceRefresh = false;
                    if (currentStored) {
                        const parsed = JSON.parse(currentStored);
                        // Force refresh if roleID is missing OR if it's a string (unpopulated)
                        if (!parsed.roleID || typeof parsed.roleID === 'string') {
                            forceRefresh = true;
                        }
                    }

                    const headers: any = {};
                    if (!forceRefresh && etagRef.current) {
                        headers['If-None-Match'] = etagRef.current;
                    }

                    const response = await api.get('/auth/me', {
                        headers,
                        validateStatus: (status) => status < 300 || status === 304
                    });

                    if (response.status === 304) return; // No changes

                    if (response.status === 200 && response.data) {
                        const etag = response.headers['etag'];
                        if (etag) etagRef.current = etag;

                        const currentAuthStr = localStorage.getItem('user');
                        if (currentAuthStr) {
                            const currentAuth = JSON.parse(currentAuthStr);

                            // Merge new data but KEEP the token
                            const updatedAuth = { ...currentAuth, ...response.data };
                            // Ensure token is preserved if not in response (it likely isn't in /me)
                            if (currentAuth.token && !updatedAuth.token) {
                                updatedAuth.token = currentAuth.token;
                            }

                            localStorage.setItem('user', JSON.stringify(updatedAuth));
                            // Trigger update to refresh state
                            window.dispatchEvent(new Event(EVENT_KEY));
                        }
                    }
                } catch (error) {
                    // console.error("Live poll failed", error);
                }
            };

            // Initial fetch
            fetchUser();

            // Poll every 5 minutes
            const interval = setInterval(fetchUser, 300000);
            return () => clearInterval(interval);
        });
    }, []);

    const saveProfile = (data: UserProfileData) => {
        setUserProfile(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        // Dispatch event to notify other components
        window.dispatchEvent(new Event(EVENT_KEY));
    };

    const updateAvatar = async (file: File): Promise<void> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;
                saveProfile({ ...userProfile, avatar: base64 });
                resolve();
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const refetchProfile = async () => {
        // Trigger manual fetch logic similar to polling
        if (!localStorage.getItem('user')) return;

        try {
            const { default: api } = await import('../services/api');
            const response = await api.get('/auth/me');
            if (response.status === 200 && response.data) {
                const currentAuthStr = localStorage.getItem('user');
                if (currentAuthStr) {
                    const currentAuth = JSON.parse(currentAuthStr);
                    const updatedAuth = { ...currentAuth, ...response.data };
                    if (currentAuth.token && !updatedAuth.token) {
                        updatedAuth.token = currentAuth.token;
                    }
                    localStorage.setItem('user', JSON.stringify(updatedAuth));
                    window.dispatchEvent(new Event(EVENT_KEY));
                    // Manually update state as well to be sure
                    setUserProfile(prev => ({
                        ...prev,
                        ...response.data
                    }));
                }
            }
        } catch (error) {
            console.error("Manual refetch failed", error);
            throw error; // Let caller know it failed
        }
    };

    const [availableClients, setAvailableClients] = useState<any[]>([]);

    // Shared promise for fetching clients to avoid "thundering herd" on mount
    // This ensures that if 10 components use this hook simultaneously, only 1 request is made.
    const clientsPromiseRef = useRef<Promise<any[]> | null>(null);

    // Fetch clients on mount
    useEffect(() => {
        let isMounted = true;

        const fetchClients = async () => {
            // Check if there's already a fetch in progress
            if (!(window as any)._clientsPromise) {
                (window as any)._clientsPromise = import('../services/api').then(({ clientService }) =>
                    clientService.getAll()
                ).catch(err => {
                    (window as any)._clientsPromise = null; // Reset on error so we can retry
                    throw err;
                });
            }

            try {
                const data = await (window as any)._clientsPromise;
                if (isMounted) setAvailableClients(data);
            } catch (err) {
                if (isMounted) setAvailableClients([]);
            }
        };

        fetchClients();
        return () => { isMounted = false; };
    }, []);

    return {
        userProfile,
        refetchProfile,
        clients: availableClients,
        saveProfile,
        updateAvatar
    };
};
