import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Mail, MessageSquare, Phone, CheckCircle, Search,
    Save, AlertCircle, Edit2, X, RefreshCw, Loader2,
    Type, Globe, ShieldCheck, ChevronDown
} from '../../components/Icons';
import { useToast } from '../../components/Toast';
import { communicationSenderService } from '../../services/api';
import { useUserContext } from '../../context/UserContext';
import { RichTextEditor } from '../../components/RichTextEditor';

// --- Types ---
interface SenderRecord {
    _id: string;
    name: string;
    provider: string;
    channel: 'Email' | 'SMS' | 'Phone';
    email?: string;
    phoneNumber?: string;
    verified: boolean;
    active: boolean;
}

interface DefaultSenders {
    Email?: string;
    SMS?: string;
    Phone?: string;
}

export const Communication = () => {
    const { addToast } = useToast();
    const { userProfile, refetchProfile } = useUserContext();

    // State
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [senders, setSenders] = useState<SenderRecord[]>([]);
    const [defaults, setDefaults] = useState<DefaultSenders>({});

    // Existing functionalities (Signature & Auto Reply)
    const [signature, setSignature] = useState("");
    const [autoReplyText, setAutoReplyText] = useState("");
    const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);

    // Search states for each category
    const [searchQueries, setSearchQueries] = useState({
        Email: '',
        SMS: '',
        Phone: ''
    });

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await communicationSenderService.getMySenders();
                setSenders(data);

                // Initial defaults from user profile
                if (userProfile?.defaultCommunicationSender) {
                    setDefaults(userProfile.defaultCommunicationSender);
                }

                // Restore other functionalities
                setSignature(userProfile?.metadata?.signature || "");
                setAutoReplyText(userProfile?.metadata?.autoReplyText || "");
                setAutoReplyEnabled(userProfile?.metadata?.autoReplyEnabled || false);

            } catch (error) {
                console.error("Failed to fetch settings:", error);
                addToast("Failed to load communication settings", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userProfile]);

    const handleSave = async () => {
        try {
            setSaving(true);

            // 1. Save Defaults to the dedicated field
            await communicationSenderService.updateMyDefaults(defaults);

            // 2. Save Signature & Auto-reply to metadata (or dedicated fields if you prefer)
            // For now keeping it consistent with mock logic but persisting to backend
            // Assuming a general profile update endpoint exists
            const { default: api } = await import('../../services/api');
            await api.put('/auth/profile', {
                metadata: {
                    ...userProfile?.metadata,
                    signature,
                    autoReplyText,
                    autoReplyEnabled
                }
            });

            await refetchProfile(); // Refresh context
            addToast("Communication preferences saved successfully", "success");
            setIsEditing(false);
        } catch (error) {
            console.error("Save failed:", error);
            addToast("Failed to save changes", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Re-trigger useEffect logic by fetching or just from profile
        if (userProfile?.defaultCommunicationSender) {
            setDefaults(userProfile.defaultCommunicationSender);
        }
        setSignature(userProfile?.metadata?.signature || "");
        setAutoReplyText(userProfile?.metadata?.autoReplyText || "");
        setAutoReplyEnabled(userProfile?.metadata?.autoReplyEnabled || false);
        addToast("Changes discarded", "info");
    };

    const handleSyncSignature = (provider: 'google' | 'microsoft') => {
        addToast(`Syncing ${provider} signature...`, 'info');
        setTimeout(() => {
            addToast(`Successfully synced ${provider} signature!`, 'success');
            setSignature(`<p>Synced signature from ${provider}</p><br/><strong>${userProfile?.email}</strong>`);
        }, 1500);
    };

    // Grouping and Filtering logic
    const categorizedSenders = useMemo(() => {
        const categories: Record<string, SenderRecord[]> = {
            Email: [],
            SMS: [],
            Phone: []
        };

        senders.forEach(s => {
            if (categories[s.channel]) {
                const query = searchQueries[s.channel as keyof typeof searchQueries].toLowerCase();
                const matchesSearch = s.name.toLowerCase().includes(query) ||
                    (s.email?.toLowerCase().includes(query)) ||
                    (s.phoneNumber?.includes(query));

                if (matchesSearch) {
                    categories[s.channel].push(s);
                }
            }
        });

        return categories;
    }, [senders, searchQueries]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center p-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-bold">{t("Loading Identity Configuration...")}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 lg:p-12 min-h-full bg-slate-50 dark:bg-slate-950/20">
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

                {/* Header - Preserved Layout */}
                <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-800 pb-6 sticky top-0 bg-slate-50 dark:bg-slate-900/90 backdrop-blur-md z-30 pt-2 -mx-4 px-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                            <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-500/20">
                                <MessageSquare size={20} />
                            </div>
                            Communication Settings
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage your personal sender IDs and messaging defaults.</p>
                    </div>
                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="px-5 py-2.5 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-2xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-black transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-black transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-2 active:scale-95"
                            >
                                <Edit2 size={16} /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* 2-Column Grid - Previous Layout Structure */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* LEFT COLUMN: Sender IDs (Refined with Bento Cards) */}
                    <div className="space-y-6">

                        {/* Email Bento card */}
                        <IDBentoCard
                            title="Default Sender Email"
                            icon={<Mail size={18} />}
                            colorClass="text-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            accentColor="blue"
                            senders={categorizedSenders.Email}
                            searchQuery={searchQueries.Email}
                            onSearchChange={(v) => setSearchQueries(p => ({ ...p, Email: v }))}
                            selectedID={defaults.Email}
                            onSelect={(id) => setDefaults(p => ({ ...p, Email: id }))}
                            isEditing={isEditing}
                        />

                        {/* SMS Bento card */}
                        <IDBentoCard
                            title="Default for SMS"
                            icon={<MessageSquare size={18} />}
                            colorClass="text-purple-500 bg-purple-50 dark:bg-purple-900/20"
                            accentColor="purple"
                            senders={categorizedSenders.SMS}
                            searchQuery={searchQueries.SMS}
                            onSearchChange={(v) => setSearchQueries(p => ({ ...p, SMS: v }))}
                            selectedID={defaults.SMS}
                            onSelect={(id) => setDefaults(p => ({ ...p, SMS: id }))}
                            isEditing={isEditing}
                        />

                        {/* Call Bento card */}
                        <IDBentoCard
                            title="Default for Calls"
                            icon={<Phone size={18} />}
                            colorClass="text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                            accentColor="emerald"
                            senders={categorizedSenders.Phone}
                            searchQuery={searchQueries.Phone}
                            onSearchChange={(v) => setSearchQueries(p => ({ ...p, Phone: v }))}
                            selectedID={defaults.Phone}
                            onSelect={(id) => setDefaults(p => ({ ...p, Phone: id }))}
                            isEditing={isEditing}
                        />

                        {/* Private Policy Indicator */}
                        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-4">
                            <ShieldCheck size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[11px] font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-widest mb-1">Assigned Identities Only</p>
                                <p className="text-xs text-emerald-700/70 dark:text-emerald-500/60 leading-relaxed font-medium">
                                    Only identities assigned to your account by the Organization Administrator are available here. If you need a new verified identity, please reach out to your IT department.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Editors - Previous Functionalities Refined */}
                    <div className="space-y-6">

                        {/* Email Signature Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 blur-3xl rounded-full translate-x-12 -translate-y-12" />

                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="font-black text-slate-800 dark:text-slate-100 flex items-center gap-3 text-sm uppercase tracking-tighter">
                                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500">
                                            <Type size={18} />
                                        </div>
                                        Email Signature
                                    </h3>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-bold">Appended to all outgoing communication.</p>
                                </div>
                            </div>

                            <div className={!isEditing ? 'opacity-70 pointer-events-none grayscale-[0.2]' : ''}>
                                <RichTextEditor
                                    label="Signature Editor"
                                    value={signature}
                                    onChange={setSignature}
                                    disabled={!isEditing}
                                    height={280}
                                />
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2">
                                <SyncBtn provider="google" onClick={() => handleSyncSignature('google')} disabled={!isEditing} />
                                <SyncBtn provider="microsoft" onClick={() => handleSyncSignature('microsoft')} disabled={!isEditing} />
                            </div>

                            <div className="mt-5 p-4 bg-blue-50/30 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/30 flex items-start gap-3">
                                <AlertCircle size={14} className="text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-blue-600/70 dark:text-blue-400/60 leading-relaxed font-black uppercase tracking-tight">
                                    Syncing with Google or Microsoft will overwrite your current signature with the one configured in your workspace account.
                                </p>
                            </div>
                        </div>

                        {/* Auto Reply Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-xl text-green-500">
                                        <MessageSquare size={18} />
                                    </div>
                                    <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm uppercase tracking-tighter">Chat Auto-Reply</h3>
                                </div>

                                <button
                                    type="button"
                                    disabled={!isEditing}
                                    onClick={() => setAutoReplyEnabled(!autoReplyEnabled)}
                                    className={`relative inline-flex items-center h-6 w-11 rounded-full transition-all duration-300 ${autoReplyEnabled ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'} ${!isEditing ? 'opacity-50 cursor-default' : 'cursor-pointer'}`}
                                >
                                    <span className={`inline-block h-4.5 w-4.5 bg-white rounded-full transform transition-all duration-300 ${autoReplyEnabled ? 'translate-x-5.5' : 'translate-x-0.5 shadow-sm'}`} />
                                </button>
                            </div>

                            <div className={`relative ${!isEditing ? 'opacity-60 pointer-events-none' : ''}`}>
                                <textarea
                                    className="w-full h-32 p-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] text-sm font-bold focus:outline-none focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 transition-all dark:text-slate-200 resize-none custom-scrollbar placeholder:text-slate-400"
                                    value={autoReplyText}
                                    onChange={(e) => setAutoReplyText(e.target.value)}
                                    placeholder="Type your auto-reply message here for when you're away..."
                                    disabled={!isEditing}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Helper Components ---

interface IBentoProps {
    title: string; icon: React.ReactNode; colorClass: string; accentColor: string;
    senders: SenderRecord[]; searchQuery: string; onSearchChange: (v: string) => void;
    selectedID?: string; onSelect: (id: string) => void; isEditing: boolean;
}

const IDBentoCard = ({ title, icon, colorClass, accentColor, senders, searchQuery, onSearchChange, selectedID, onSelect, isEditing }: IBentoProps) => (
    <div className={`bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-all duration-300 group ${!isEditing ? 'opacity-90' : 'hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5'}`}>
        <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
                <div className={`p-2.5 ${colorClass} rounded-2xl`}>{icon}</div>
                <h3 className="font-black text-slate-800 dark:text-slate-200 text-xs uppercase tracking-widest">{title}</h3>
            </div>
            <span className="text-[10px] font-black text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg uppercase border border-slate-100 dark:border-slate-700">{senders.length} IDs</span>
        </div>

        {/* Search - Always available height-wise but disabled if !isEditing */}
        <div className="relative mb-5 group/search">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-emerald-500 transition-colors" />
            <input
                type="text"
                placeholder="Find identity..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                disabled={!isEditing}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-2.5 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
        </div>

        {/* List - Constrained height with scroll */}
        <div className="h-[120px] overflow-y-auto custom-scrollbar space-y-2 pr-1">
            {senders.length > 0 ? (
                senders.map((s) => (
                    <div
                        key={s._id}
                        onClick={() => isEditing && onSelect(s._id)}
                        className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${selectedID === s._id
                                ? `bg-${accentColor}-50/30 dark:bg-${accentColor}-900/10 border-${accentColor}-500/30`
                                : isEditing ? 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer' : 'bg-white dark:bg-slate-800 border-transparent'
                            }`}
                    >
                        <div className="flex flex-col">
                            <span className={`text-[13px] font-black leading-tight ${selectedID === s._id ? `text-${accentColor}-600 dark:text-${accentColor}-400` : 'text-slate-700 dark:text-slate-200'}`}>{s.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold truncate max-w-[180px]">{s.email || s.phoneNumber}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selectedID === s._id
                                ? `bg-${accentColor}-600 border-${accentColor}-600 text-white shadow-lg shadow-${accentColor}-500/30`
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                            }`}>
                            {selectedID === s._id && <CheckCircle size={10} />}
                        </div>
                    </div>
                ))
            ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-slate-400">
                    <Globe size={32} />
                    <span className="text-[10px] uppercase font-black tracking-widest mt-2">No matching IDs</span>
                </div>
            )}
        </div>
    </div>
);

const SyncBtn = ({ provider, onClick, disabled }: any) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="px-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-[11px] font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 uppercase tracking-tight"
    >
        <RefreshCw size={14} className="text-emerald-500" /> Sync {provider}
    </button>
);

const t = (s: string) => s; // Replace with translation hook in real usage
