
import { useState, useEffect, useRef } from 'react';
import { INITIAL_PROFILE_DATA, PROFILE_CLIENTS, UserProfileData } from '../data/profile';

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
                    role: authUser.role || profile.role,
                    activeClient: authUser.activeClient || profile.activeClient, // Ensure this exists in auth response
                    clientID: authUser.clientID || profile.clientID,
                    lastLoginAt: authUser.lastLoginAt,
                    loginCount: authUser.loginCount,
                    lastActiveAt: authUser.lastActiveAt,
                    timeZone: authUser.timeZone || profile.timeZone
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
                    role: authUser.role || profile.role,
                    activeClient: authUser.activeClient || profile.activeClient,
                    clientID: authUser.clientID || profile.clientID,
                    lastLoginAt: authUser.lastLoginAt,
                    loginCount: authUser.loginCount,
                    lastActiveAt: authUser.lastActiveAt,
                    timeZone: authUser.timeZone || profile.timeZone
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
                    const response = await api.get('/auth/me', {
                        headers: etagRef.current ? { 'If-None-Match': etagRef.current } : {},
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
                    console.error("Live poll failed", error);
                }
            };

            // Initial fetch
            fetchUser();

            // Poll every 10 seconds (aggressive for user requirements)
            const interval = setInterval(fetchUser, 10000);
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

    useEffect(() => {
        // Fetch clients on mount
        import('../services/clientService').then(({ clientService }) => {
            clientService.getAll().then(data => {
                setAvailableClients(data);
            }).catch(err => {
                console.error("Failed to fetch clients for profile", err);
                // Fallback to hardcoded list if API fails, but map them to object structure
                setAvailableClients(PROFILE_CLIENTS.map(name => ({ clientName: name, clientType: 'Client' })));
            });
        });
    }, []);

    return {
        userProfile,
        refetchProfile,
        clients: availableClients,
        saveProfile,
        updateAvatar
    };
};
