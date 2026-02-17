import api from './api';

export interface IntegrationStatus {
    connected: boolean;
    email?: string;
    workspaceName?: string;
    lastSynced?: string;
    validUpto?: string;
}

export interface WorkspaceIntegrations {
    google: IntegrationStatus;
    microsoft: IntegrationStatus;
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "1001864596436-5uldln2ve14spbphgo2rpjf02jrntm2d.apps.googleusercontent.com";
const MICROSOFT_CLIENT_ID = import.meta.env.VITE_MICROSOFT_CLIENT_ID || "e4338f76-0b52-49e1-893e-4652f1fd9d0e";

const GOOGLE_REDIRECT_URI = `${window.location.origin}/auth/google/callback`;
const MICROSOFT_REDIRECT_URI = `${window.location.origin}/auth/microsoft/callback`;
const RETURN_PATH_KEY = 'maprecruit_auth_return_path';
const MS_VERIFIER_KEY = 'ms_code_verifier';

// PKCE Helpers
const generateCodeVerifier = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

const generateCodeChallenge = async (verifier: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

export const integrationService = {
    /**
     * Gets the current status of workspace integrations for the current user.
     */
    async getStatus(): Promise<WorkspaceIntegrations> {
        try {
            const response = await api.get('/user/integrations');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch integration status:', error);
            // Return default disconnected state on error
            return {
                google: { connected: false },
                microsoft: { connected: false }
            };
        }
    },

    /**
     * Saves the current path to localStorage to redirect back after OAuth.
     */
    saveReturnPath(): void {
        const currentPath = window.location.pathname + window.location.search;
        localStorage.setItem(RETURN_PATH_KEY, currentPath);
    },

    /**
     * Gets and clears the return path from localStorage.
     */
    getReturnPath(): string {
        const path = localStorage.getItem(RETURN_PATH_KEY) || '/myaccount/authsync';
        localStorage.removeItem(RETURN_PATH_KEY);
        return path;
    },

    /**
     * Initiates the Google OAuth flow.
     * Redirects the user to Google's consent screen.
     */
    connectGoogle(): void {
        this.saveReturnPath();
        const scopes = [
            'openid',
            'email',
            'profile',
            'https://www.googleapis.com/auth/chat.spaces',
            'https://www.googleapis.com/auth/chat.messages',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/calendar.events'
        ].join(' ');

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${GOOGLE_CLIENT_ID}&` +
            `redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&` +
            `response_type=code&` +
            `scope=${encodeURIComponent(scopes)}&` +
            `access_type=offline&` +
            `include_granted_scopes=true&` +
            `prompt=consent`;

        window.location.href = authUrl;
    },

    /**
     * Initiates the Microsoft Office 365 OAuth flow with PKCE.
     */
    async connectMicrosoft(): Promise<void> {
        this.saveReturnPath();
        const verifier = generateCodeVerifier();
        sessionStorage.setItem(MS_VERIFIER_KEY, verifier);
        const challenge = await generateCodeChallenge(verifier);

        const scopes = [
            'openid',
            'email',
            'profile',
            'offline_access',
            'Files.Read.All', // For OneDrive/SharePoint
            'Calendars.ReadWrite'
        ].join(' ');

        const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
            `client_id=${MICROSOFT_CLIENT_ID}&` +
            `response_type=code&` +
            `redirect_uri=${encodeURIComponent(MICROSOFT_REDIRECT_URI)}&` +
            `response_mode=query&` +
            `scope=${encodeURIComponent(scopes)}&` +
            `code_challenge=${challenge}&` +
            `code_challenge_method=S256&` +
            `prompt=consent`;

        window.location.href = authUrl;
    },

    /**
     * Disconnects a workspace integration.
     */
    async disconnect(provider: 'google' | 'microsoft'): Promise<void> {
        await api.delete(`/user/integrations/${provider}`);
    },

    /**
     * Handles the callback from Google/Microsoft OAuth.
     * Sends the authorization code to the backend.
     */
    async handleCallback(provider: 'google' | 'microsoft', code: string): Promise<void> {
        const redirectUri = provider === 'google' ? GOOGLE_REDIRECT_URI : MICROSOFT_REDIRECT_URI;
        const payload: any = { code, redirectUri };

        if (provider === 'microsoft') {
            const verifier = sessionStorage.getItem(MS_VERIFIER_KEY);
            if (verifier) {
                payload.codeVerifier = verifier;
                sessionStorage.removeItem(MS_VERIFIER_KEY);
            }
        }

        await api.post(`/user/integrations/${provider}/callback`, payload);
    },

    /**
     * Gets a temporary access token for the Google Picker.
     */
    async getPickerToken(): Promise<string> {
        const response = await api.get('/user/integrations/tokens/google');
        return response.data.access_token;
    },

    /**
     * Fetches files from Google Drive and returns parsed metadata.
     */
    async fetchDriveFiles(files: { fileId: string; fileName: string; size?: number }[]): Promise<any[]> {
        return Promise.all(
            files.map(file => api.post('/user/integrations/google/drive/fetch', file).then(res => res.data))
        );
    },

    /**
     * Fetches files from Microsoft OneDrive/SharePoint and returns parsed metadata.
     */
    async fetchMicrosoftFiles(files: { resourceId: string; siteId?: string; fileName: string; size?: number }[]): Promise<any[]> {
        return Promise.all(
            files.map(file => api.post('/user/integrations/microsoft/drive/fetch', file).then(res => res.data))
        );
    },

    /**
     * Triggers a manual sync of the Google Calendar.
     */
    async syncCalendar(): Promise<{ success: boolean; count: number }> {
        const response = await api.post('/user/integrations/google/calendar/sync');
        return response.data;
    },

    /**
     * Fetches synced calendar events.
     */
    async getCalendarEvents(): Promise<{ success: boolean; count: number; events: any[] }> {
        const response = await api.get('/user/integrations/google/calendar/events');
        return response.data;
    },

    /**
     * Creates a new event in the synced calendar.
     */
    async createCalendarEvent(eventData: {
        summary: string;
        description?: string;
        start: { dateTime: string; timeZone: string };
        end: { dateTime: string; timeZone: string };
        attendees?: string[];
        location?: string;
        createMeeting?: boolean;
    }): Promise<{ success: boolean; event: any }> {
        const response = await api.post('/user/integrations/google/calendar/events', eventData);
        return response.data;
    },

    /**
     * Deletes an event from the synced calendar.
     */
    async deleteCalendarEvent(eventId: string): Promise<{ success: boolean }> {
        const response = await api.delete(`/user/integrations/google/calendar/events/${eventId}`);
        return response.data;
    },

    /**
     * Updates an event in the synced calendar.
     */
    async updateCalendarEvent(eventId: string, eventData: any): Promise<{ success: boolean; event: any }> {
        const response = await api.put(`/user/integrations/google/calendar/events/${eventId}`, eventData);
        return response.data;
    }
};

// Helper for UI notifications (since service is outside component tree)
const addToast = (msg: string, type: 'success' | 'info' | 'error') => {
    // UI components handle their own toast notifications
};
