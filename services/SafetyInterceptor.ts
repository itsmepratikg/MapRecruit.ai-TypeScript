import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Simple modal trigger event (since we can't easily use React context inside Axios interceptor directly)
export const TRIGGER_SAFETY_MODAL = 'TRIGGER_IMPERSONATION_SAFETY_MODAL';

export const attachSafetyInterceptor = (api: AxiosInstance) => {
    api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
        // 1. Check if we are impersonating
        const userStr = localStorage.getItem('user');
        if (!userStr) return config;

        const user = JSON.parse(userStr);
        // Check if user object has 'mode' (added during impersonation login)
        // OR check sessionStorage for admin backup
        const isImpersonating = sessionStorage.getItem('admin_restore_token'); // Reliable flag

        if (!isImpersonating) return config;

        const mode = user.mode || 'read-only';
        const method = config.method?.toUpperCase() || 'GET';
        const url = config.url || '';

        // 2. Allow GET/OPTIONS always
        if (method === 'GET' || method === 'OPTIONS') {
            return config;
        }

        // 3. SPECIAL CASE: Allow Client Switch in Impersonation Mode
        if (url.includes('/auth/switch-context')) {
            try {
                const data = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});
                const targetCompanyId = (data.companyId || '').toString();
                const myCompanyId = (user.currentCompanyID || user.companyID || '').toString();

                if (targetCompanyId === myCompanyId) {
                    return config;
                }
            } catch (e) {
                // Ignore parse errors
            }
        }

        // 4. Handle VIEW-ONLY Mode
        if (mode === 'read-only') {
            const friendliness = "Action Restricted: You are currently in 'View-Only' mode. To make changes, please restart impersonation with 'Full Access' if permitted.";
            const error = new Error(friendliness);
            (error as any).isSafetyBlock = true;

            window.dispatchEvent(new CustomEvent('IMPERSONATION_BLOCK_TOAST', {
                detail: { message: friendliness }
            }));

            return Promise.reject(error);
        }

        // 4. Handle FULL-ACCESS Mode
        if (mode === 'full') {
            // We need to pause and ask for confirmation
            // This is tricky in Axios. We return a Promise that resolves ONLY when user confirms.

            return new Promise((resolve, reject) => {
                const handleConfirm = () => {
                    cleanup();
                    resolve(config);
                };

                const handleCancel = () => {
                    cleanup();
                    const error = new Error('Action cancelled by user.');
                    (error as any).isSafetyBlock = true;
                    reject(error);
                };

                const cleanup = () => {
                    window.removeEventListener('SAFETY_MODAL_CONFIRM', handleConfirm);
                    window.removeEventListener('SAFETY_MODAL_CANCEL', handleCancel);
                };

                window.addEventListener('SAFETY_MODAL_CONFIRM', handleConfirm);
                window.addEventListener('SAFETY_MODAL_CANCEL', handleCancel);

                // Trigger UI Modal
                window.dispatchEvent(new CustomEvent(TRIGGER_SAFETY_MODAL, {
                    detail: {
                        method,
                        url: config.url
                    }
                }));
            });
        }

        return config;
    }, (error) => {
        return Promise.reject(error);
    });
};
