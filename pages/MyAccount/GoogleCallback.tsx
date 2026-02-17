import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle } from '../../components/Icons';
import { integrationService } from '../../services/integrationService';
import { useToast } from '../../components/Toast';

export const GoogleCallback: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addToast } = useToast();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);

    const hasRun = React.useRef(false);

    useEffect(() => {
        if (hasRun.current) return;

        const handleAuth = async () => {
            const params = new URLSearchParams(location.search);
            const code = params.get('code');
            const errorParam = params.get('error');

            if (errorParam) {
                hasRun.current = true;
                setStatus('error');
                setError(errorParam);
                addToast(`Auth Error: ${errorParam}`, 'error');
                setTimeout(() => navigate('/myaccount/usernotifications'), 3000);
                return;
            }

            if (!code) {
                return; // Wait for code
            }

            hasRun.current = true;

            try {
                const [result] = await Promise.all([
                    integrationService.handleCallback('google', code),
                    new Promise(resolve => setTimeout(resolve, 800))
                ]);

                setStatus('success');
                addToast('Google Workspace connected successfully!', 'success');
                const returnPath = integrationService.getReturnPath();
                setTimeout(() => navigate(returnPath), 2000);
            } catch (err: any) {
                console.error('OAuth Callback Failed:', err);

                setStatus('error');
                setError(err.response?.data?.message || 'Failed to exchange authorization code.');
                addToast('Failed to connect Google Workspace', 'error');
                const returnPath = integrationService.getReturnPath();
                setTimeout(() => navigate(returnPath), 4000);
            }
        };

        handleAuth();
    }, [location.search, navigate, addToast]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
            {status === 'loading' && (
                <div className="space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Connecting Google Workspace...</h2>
                    <p className="text-slate-500 dark:text-slate-400">Please wait while we finalize the connection.</p>
                </div>
            )}

            {status === 'success' && (
                <div className="space-y-4 animate-in zoom-in duration-300">
                    <CheckCircle size={64} className="text-emerald-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Successfully Connected!</h2>
                    <p className="text-slate-500 dark:text-slate-400">You will be redirected back to notification settings in a moment.</p>
                </div>
            )}

            {status === 'error' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <XCircle size={64} className="text-red-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Connection Failed</h2>
                    <p className="text-red-500 font-medium">{error}</p>
                    <p className="text-slate-500 dark:text-slate-400">Redirecting you back to settings...</p>
                </div>
            )}
        </div>
    );
};
