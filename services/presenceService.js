import axios from 'axios';

// Get API URL from environment
const getApiUrl = () => {
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
    return base.endsWith('/api') ? base : `${base}/api`;
};

const API_URL = getApiUrl();

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add Interceptor for Auth
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const presenceService = {
    heartbeat: async (data) => {
        try {
            const response = await api.post('/presence/heartbeat', data);
            return response.data;
        } catch (error) {
            console.error('[PresenceService] Heartbeat failed:', error);
            throw error;
        }
    },

    leave: async (data) => {
        try {
            const response = await api.post('/presence/leave', data);
            return response.data;
        } catch (error) {
            console.error('[PresenceService] Leave failed:', error);
            throw error;
        }
    }
};
