import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { CheckCircle, XCircle, Loader, MessageSquare } from '../../../components/Icons';

export const GoogleChatLinking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userProfile, updateProfile } = useUserProfile();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Linking your Google Chat space...');

    useEffect(() => {
        const linkAccount = async () => {
            // Wait for user profile to be available
            if (!userProfile) return;

            const searchParams = new URLSearchParams(location.search);
            const token = searchParams.get('token');

            if (!token) {
                setStatus('error');
                setMessage('Invalid linking URL. No token provided.');
                return;
            }

            try {
                // Use the standard maprecruit api axios instance
                const response = await api.post('/chat/link', {
                    token,
                    userId: userProfile._id || userProfile.id
                });

                if (response.data.success) {
                    setStatus('success');
                    setMessage('Your Google Chat space has been successfully linked to your MapRecruit account!');

                    // Optimistically update the local user profile context
                    if (updateProfile) {
                        updateProfile({
                            integrations: {
                                ...userProfile.integrations,
                                google: {
                                    ...userProfile.integrations?.google,
                                    chatSpaceId: response.data.spaceId
                                }
                            }
                        });
                    }
                } else {
                    setStatus('error');
                    setMessage(response.data.message || 'Failed to link account.');
                }
            } catch (error: any) {
                console.error('Error linking Google Chat:', error);
                setStatus('error');
                setMessage(error.response?.data?.message || 'An error occurred while linking your account.');
            }
        };

        linkAccount();
    }, [location.search, userProfile, updateProfile]);

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-10 max-w-md w-full text-center">

                <div className="flex justify-center mb-6">
                    <div className={`p-4 rounded-full ${status === 'loading' ? 'bg-blue-50 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400' :
                            status === 'success' ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                'bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {status === 'loading' && <Loader className="w-12 h-12 animate-spin" />}
                        {status === 'success' && <CheckCircle className="w-12 h-12" />}
                        {status === 'error' && <XCircle className="w-12 h-12" />}
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                    {status === 'loading' && 'Linking Account...'}
                    {status === 'success' && 'Account Linked!'}
                    {status === 'error' && 'Linking Failed'}
                </h2>

                <p className="text-slate-500 dark:text-slate-400 mb-8 px-4">
                    {message}
                </p>

                {status !== 'loading' && (
                    <button
                        onClick={() => navigate('/myaccount/usernotifications')}
                        className={`w-full py-3 px-4 rounded-xl font-medium transition-colors ${status === 'success'
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                            }`}
                    >
                        {status === 'success' ? 'Return to Notifications' : 'Go Back'}
                    </button>
                )}

                {status === 'success' && (
                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400 flex flex-col items-center gap-2">
                        <MessageSquare size={16} />
                        You can now receive MapRecruit notifications directly in Google Chat.
                    </div>
                )}
            </div>
        </div>
    );
};
