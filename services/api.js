import axios from 'axios';
// Construct API URL carefully
// If env var is "http://localhost:5000", we want "http://localhost:5000/api"
// If env var is "http://localhost:5000/api", we want "http://localhost:5000/api"
const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = VITE_API_URL.endsWith('/api') ? VITE_API_URL : `${VITE_API_URL}/api`;

import { attachSafetyInterceptor } from './SafetyInterceptor';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach Safety Interceptor
attachSafetyInterceptor(api);

// Add a request interceptor to attach the Token
api.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem('user');
        if (user) {
            const { token } = JSON.parse(user);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.error("Login Failed:", error.response?.data?.message || error.message);
            throw error;
        }
    },
    googleLogin: async (credential) => {
        try {
            const response = await api.post('/auth/google', { credential });
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.error("Google Login Failed:", error);
            throw error;
        }
    },
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('user');
    },
    switchCompany: async (companyId, clientId) => {
        const response = await api.post('/auth/switch-context', { companyId, clientId });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    }
};

export const userService = {
    getAll: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },
    create: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },
    update: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },
    updateActiveAt: async () => {
        // This endpoint doesn't exist yet but it's a lightweight update
        try {
            await api.post('/users/active');
        } catch (e) { /* ignore */ }
    },
    resetPassword: async (id) => {
        const response = await api.post(`/users/${id}/reset-password`);
        return response.data;
    },
    // Activity Endpoints
    getRecentSearches: async () => {
        const response = await api.get('/users/recent-searches');
        return response.data;
    },
    logRecentSearch: async (terms) => {
        const response = await api.post('/users/recent-searches', { terms });
        return response.data;
    },
    getSavedSearches: async () => {
        const response = await api.get('/users/saved-searches');
        return response.data;
    },
    saveSearch: async (name, filters) => {
        const response = await api.post('/users/saved-searches', { name, filters });
        return response.data;
    },
    getRecentVisits: async () => {
        const response = await api.get('/users/recent-visits');
        return response.data;
    },
    logVisit: async (type, referenceID, title) => {
        const response = await api.post('/users/recent-visits', { type, referenceID, title });
        return response.data;
    }
};

export const campaignService = {
    getAll: async () => {
        const response = await api.get('/campaigns');
        return response.data;
    },
    getStats: async (clientID) => {
        const params = clientID ? { clientID } : {};
        const response = await api.get('/campaigns/stats', { params });
        return response.data;
    },
    getRecent: async () => {
        const response = await api.get('/campaigns/recent');
        return response.data;
    },
    create: async (campaignData) => {
        const response = await api.post('/campaigns', campaignData);
        return response.data;
    },
    bulkUpdateStatus: async (ids, status) => {
        const response = await api.post('/campaigns/bulk-status', { ids, status });
        return response.data;
    },
};

export const clientService = {
    getAll: async () => {
        const response = await api.get('/clients');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/clients/${id}`);
        return response.data;
    }
};

export const profileService = {
    getAll: async (params) => {
        const response = await api.get('/profiles', { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/profiles/${id}`);
        return response.data;
    },
    create: async (profileData) => {
        const response = await api.post('/profiles', profileData);
        return response.data;
    },
    update: async (id, profileData) => {
        const response = await api.put(`/profiles/${id}`, profileData);
        return response.data;
    },
    getArticles: async () => {
        const response = await api.get('/profiles/articles');
        return response.data;
    },
    getTags: async () => {
        const response = await api.get('/profiles/tags');
        return response.data;
    },
    getStats: async () => {
        const response = await api.get('/profiles/stats');
        return response.data;
    },
    getFolderMetrics: async () => {
        const response = await api.get('/profiles/folder-metrics');
        return response.data;
    }
};

export const passkeyService = {
    getRegistrationOptions: async (deviceType) => {
        const response = await api.post('/auth/passkey/register-options', { deviceType });
        return response.data;
    },
    verifyRegistration: async (body, deviceType) => {
        const response = await api.post('/auth/passkey/register-verify', { body, deviceType });
        return response.data;
    },
    getAuthenticationOptions: async (email) => {
        const response = await api.post('/auth/passkey/login-options', { email });
        return response.data;
    },
    verifyLogin: async (email, body) => {
        const response = await api.post('/auth/passkey/login-verify', { email, body });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    }
};

export const companyService = {
    get: async () => {
        const response = await api.get('/company');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/company/${id}`);
        return response.data;
    },
    update: async (companyData) => {
        const response = await api.put('/company', companyData);
        return response.data;
    }
};

export const workflowService = {
    getByCampaign: async (campaignId) => {
        const response = await api.get(`/workflows/${campaignId}`);
        return response.data;
    },
    save: async (data) => {
        const response = await api.post('/workflows', data);
        return response.data;
    }
};

export const activityService = {
    getAll: async (params) => {
        const response = await api.get('/activities', { params });
        return response.data;
    },
    log: async (data) => {
        const response = await api.post('/activities', data);
        return response.data;
    }
};

export const analyticsService = {
    getTrends: async () => {
        const response = await api.get('/analytics/trends');
        return response.data;
    },
    getSources: async () => {
        const response = await api.get('/analytics/sources');
        return response.data;
    }
};

export const libraryService = {
    getAll: async (params) => {
        const response = await api.get('/library', { params });
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/library', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/library/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/library/${id}`);
        return response.data;
    }
};

export default api;
