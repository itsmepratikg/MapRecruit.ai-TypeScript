import api from './api';

export interface IntegrationStatus {
    connected: boolean;
    email?: string;
    workspaceName?: string;
    lastSynced?: string;
}

export interface WorkspaceIntegrations {
    google: IntegrationStatus;
    microsoft: IntegrationStatus;
}

const GOOGLE_CLIENT_ID = "1001864596436-5uldln2ve14spbphgo2rpjf02jrntm2d.apps.googleusercontent.com";
const REDIRECT_URI = `${window.location.origin}/auth/google/callback`;

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
     * Initiates the Google OAuth flow.
     * Redirects the user to Google's consent screen.
     */
    connectGoogle(): void {
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
            `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
            `response_type=code&` +
            `scope=${encodeURIComponent(scopes)}&` +
            `access_type=offline&` +
            `include_granted_scopes=true&` +
            `prompt=consent`;

        window.location.href = authUrl;
    },

    /**
     * Initiates the Microsoft MS Teams/Office 365 OAuth flow.
     */
    connectMicrosoft(): void {
        // Placeholder for MS Teams OAuth
        // In a real implementation, this would use MSAL or a similar redirect flow
        addToast('Microsoft Teams integration flow coming soon.', 'info');
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
        await api.post(`/user/integrations/${provider}/callback`, { code, redirectUri: REDIRECT_URI });
    },

    /**
     * Gets a temporary access token for the Google Picker.
     */
    async getPickerToken(): Promise<string> {
        const response = await api.get('/user/integrations/tokens/google');
        return response.data.access_token;
    },

    /**
     * Fetches a file from Google Drive and returns parsed metadata.
     */
    async fetchDriveFile(fileId: string, fileName: string): Promise<any> {
        const response = await api.post('/user/integrations/google/drive/fetch', { fileId, fileName });
        return response.data;
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
    }
};

// Helper for UI notifications (since service is outside component tree)
const addToast = (msg: string, type: 'success' | 'info' | 'error') => {
    // This is a bridge to the toast system if needed, 
    // though usually handled in the component
    console.log(`[IntegrationService] ${type}: ${msg}`);
};
