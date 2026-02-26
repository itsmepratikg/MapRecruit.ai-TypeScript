import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, RefreshCw, AlertCircle } from 'lucide-react';
import { EmailList } from './components/EmailList';
import { EmailReader } from './components/EmailReader';
import { PagePreloader } from '../../components/Common/PagePreloader';
import { integrationService } from '../../services/integrationService';

export const EmailDashboard = () => {
    const [emails, setEmails] = useState<any[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const fetchEmails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${apiURL}/api/emails`, { withCredentials: true });
            setEmails(response.data.emails || []);
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError('unauthorized');
            } else {
                setError('Failed to fetch emails');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, []);

    if (error === 'unauthorized') {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4 p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl m-6 shadow-sm animate-in zoom-in-95 duration-500">
                <Mail className="w-20 h-20 text-slate-300 dark:text-slate-700 mb-6" strokeWidth={1.5} />
                <h2 className="text-4xl font-black tracking-tight text-slate-800 dark:text-slate-100">Workspace Authentication</h2>
                <p className="text-slate-500 dark:text-slate-400 text-center max-w-lg pb-6 text-lg">
                    Please connect your MapRecruit account to Google Workspace or Microsoft 365 to view your enterprise emails directly in the dashboard securely.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => integrationService.connectGoogle()}
                        className="px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:shadow-lg transition-all font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-3 hover:border-emerald-500 hover:text-emerald-600 group"
                    >
                        <span className="group-hover:scale-105 transition-transform">Connect Google</span>
                    </button>
                    <button
                        onClick={() => integrationService.connectMicrosoft()}
                        className="px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 font-semibold flex items-center gap-3 hover:-translate-y-1"
                    >
                        <span>Connect Microsoft</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col bg-slate-50 dark:bg-slate-950 p-6 overflow-hidden animate-in fade-in duration-500">
            <div className="flex justify-between items-end mb-6 shrink-0">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">Inbox</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">Enterprise Email Integration</p>
                </div>
                <button
                    onClick={fetchEmails}
                    disabled={loading}
                    className="p-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 transition-all hover:text-emerald-600 disabled:opacity-50"
                >
                    <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
                </button>
            </div>

            <div className="flex-1 flex gap-6 min-h-0">
                {/* Left Pane: Email List */}
                <div className="w-1/3 min-w-[380px] max-w-md h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-rose-50/50 dark:bg-rose-900/10">
                            <AlertCircle className="w-12 h-12 text-rose-500 mb-4 opacity-80" />
                            <p className="text-slate-700 dark:text-slate-300 font-semibold text-lg">{error}</p>
                        </div>
                    ) : (
                        <EmailList
                            emails={emails}
                            selectedEmailId={selectedEmail?.id}
                            onSelect={setSelectedEmail}
                        />
                    )}
                </div>

                {/* Right Pane: Email Reader */}
                <div className="flex-1 h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden relative">
                    {selectedEmail ? (
                        <EmailReader email={selectedEmail} />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 select-none bg-slate-50/50 dark:bg-slate-900/50">
                            <Mail className="w-32 h-32 mb-8 opacity-10" strokeWidth={1} />
                            <p className="text-2xl font-bold opacity-40 tracking-tight">Select an email to read</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
