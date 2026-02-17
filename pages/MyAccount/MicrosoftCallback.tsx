import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle } from '../../components/Icons';
import { integrationService } from '../../services/integrationService';
import { useToast } from '../../components/Toast';

export const MicrosoftCallback: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addToast } = useToast();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);
    const [isPicker, setIsPicker] = useState(false);

    const hasRun = React.useRef(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const hash = location.hash;

        // Detect if this is a File Picker callback (SDK handshake)
        const isPickerCallback = params.get('oauth') ||
            (params.get('state') && params.get('state')?.includes('_')) ||
            hash.includes('access_token') ||
            hash.includes('error');

        if (isPickerCallback) {
            setIsPicker(true);
            console.log('[MicrosoftCallback] Detected File Picker callback. Loading SDK to handle handshake...');

            // Check if script already exists
            if (!document.getElementById('onedrive-js-sdk')) {
                const script = document.createElement('script');
                script.id = 'onedrive-js-sdk';
                script.src = 'https://js.live.net/v7.2/OneDrive.js';
                script.async = true;
                document.head.appendChild(script);
            }
            return;
        }

        if (hasRun.current) return;

        const handleAuth = async () => {
            const code = params.get('code');
            const errorParam = params.get('error');

            if (errorParam) {
                hasRun.current = true;
                setStatus('error');
                setError(errorParam);
                addToast(`Auth Error: ${errorParam}`, 'error');
                const returnPath = integrationService.getReturnPath();
                setTimeout(() => navigate(returnPath), 3000);
                return;
            }

            if (!code) {
                return; // Wait for code
            }

            hasRun.current = true;

            try {
                const [result] = await Promise.all([
                    integrationService.handleCallback('microsoft', code),
                    new Promise(resolve => setTimeout(resolve, 800))
                ]);

                setStatus('success');
                addToast('Microsoft 365 connected successfully!', 'success');
                const returnPath = integrationService.getReturnPath();
                setTimeout(() => navigate(returnPath), 2000);
            } catch (err: any) {
                console.error('Microsoft OAuth Callback Failed:', err);

                setStatus('error');
                setError(err.response?.data?.message || 'Failed to exchange authorization code.');
                addToast('Failed to connect Microsoft 365', 'error');
                const returnPath = integrationService.getReturnPath();
                setTimeout(() => navigate(returnPath), 4000);
            }
        };

        handleAuth();
    }, [location.search, location.hash, navigate, addToast]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
            {status === 'loading' && (
                <div className="space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        {isPicker ? 'Finalizing Selection...' : 'Connecting Microsoft 365...'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        {isPicker
                            ? 'Please wait while we transfer your selection. This window should close automatically.'
                            : 'Please wait while we finalize the connection.'}
                    </p>
                    {isPicker && (
                        <button
                            onClick={() => window.close()}
                            className="mt-8 text-xs font-bold text-slate-400 hover:text-slate-600 underline"
                        >
                            Window not closing? Click here
                        </button>
                    )}
                </div>
            )}

            {status === 'success' && (
                <div className="space-y-4 animate-in zoom-in duration-300">
                    <CheckCircle size={64} className="text-blue-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Successfully Connected!</h2>
                    <p className="text-slate-500 dark:text-slate-400">You will be redirected back in a moment.</p>
                </div>
            )}

            {status === 'error' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <XCircle size={64} className="text-red-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Connection Failed</h2>
                    <p className="text-red-500 font-medium">{error}</p>
                    <p className="text-slate-500 dark:text-slate-400">Redirecting you back...</p>
                </div>
            )}
        </div>
    );
};
