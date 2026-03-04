import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    MessageSquare, Search, Filter, Mail, Phone, CheckCircle2,
    XCircle, Clock, Calendar, ShieldCheck, Check, X, Copy,
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RefreshCw, Loader2,
    ChevronDown, Plus
} from '../../../components/Icons';
import { useToast } from '../../../components/Toast';
import { useUserContext } from '../../../context/UserContext';
import { communicationSenderService } from '../../../services/api';

export interface CommunicationSender {
    _id: any;
    name: string;
    provider: string;
    channel: string; // "Email" | "SMS" | "Phone"
    email: string;
    phoneNumber: string;
    active: boolean;
    verified: boolean;
    verifiedAt?: any;
    createdAt: any;
    updatedAt: any;
    postmark?: {
        signatureVerified: boolean;
        signatureID: string;
    };
}

export const CommunicationSettings = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { userProfile } = useUserContext();
    const [senders, setSenders] = useState<CommunicationSender[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [verifyingId, setVerifyingId] = useState<string | null>(null);

    // Pagination
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pagination, setPagination] = useState({
        total: 0,
        pages: 1
    });

    // Filters
    const [channelFilter, setChannelFilter] = useState('All');
    const [activeFilter, setActiveFilter] = useState('All');
    const [verifiedFilter, setVerifiedFilter] = useState('All');

    useEffect(() => {
        const fetchData = async () => {
            if (!userProfile?.companyID) return;

            try {
                setLoading(true);
                const response = await communicationSenderService.getAll({
                    companyID: userProfile.companyID,
                    page,
                    limit,
                    search: searchQuery,
                    channel: channelFilter,
                    active: activeFilter,
                    verified: verifiedFilter
                });

                // Based on backend returning { data, pagination }
                setSenders(response.data || []);
                setPagination(response.pagination || { total: 0, pages: 1 });
            } catch (error) {
                console.error("Failed to fetch communication senders:", error);
                addToast(t("Failed to load communication settings"), 'error');
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchData, searchQuery ? 500 : 0);
        return () => clearTimeout(timer);
    }, [userProfile?.companyID, page, limit, searchQuery, channelFilter, activeFilter, verifiedFilter]);

    const handleReVerify = async (id: string) => {
        try {
            setVerifyingId(id);
            const response = await communicationSenderService.verify(id);
            if (response.success) {
                addToast(t("Success: The owner of the communication should have received an email to verify. Follow the steps in the email to verify the email address."), 'success');
            }
        } catch (error) {
            addToast(t("Failed to trigger verification"), 'error');
        } finally {
            setVerifyingId(null);
        }
    };

    const formatDate = (dateValue: any) => {
        if (!dateValue) return 'N/A';
        const dateStr = typeof dateValue === 'object' && dateValue.$date ? dateValue.$date : dateValue;
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return 'N/A';

        return d.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        addToast(t("Copied to clipboard"), 'success');
    };

    const getChannelIcon = (channel: string) => {
        switch (channel?.toLowerCase()) {
            case 'email': return <Mail size={14} />;
            case 'sms': return <MessageSquare size={14} />;
            case 'phone': return <Phone size={14} />;
            default: return <MessageSquare size={14} />;
        }
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto custom-scrollbar p-6 lg:p-10 transition-all scroll-smooth">
                <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                                    <MessageSquare size={28} />
                                </div>
                                {t("Communication Settings")}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                                {t("Manage your unified communication providers and verified senders.")}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <button
                                onClick={() => navigate('/settings/communication/new')}
                                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                            >
                                <Plus size={18} />
                                {t("Add Sender")}
                            </button>
                            <div className="relative flex-1 md:w-80 group">
                                <input
                                    type="text"
                                    placeholder={t("Search by name, ID, or provider...")}
                                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-slate-200 shadow-sm group-hover:border-slate-300 dark:group-hover:border-slate-600 transition-all backdrop-blur-sm"
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                                />
                                <Search size={20} className="absolute left-4 top-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* Filters Strip */}
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <Filter size={14} /> {t("Filters")}
                        </div>

                        {/* Channel Filter */}
                        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                            {['All', 'Email', 'SMS', 'Phone'].map(ch => (
                                <button
                                    key={ch}
                                    onClick={() => { setChannelFilter(ch); setPage(1); }}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${channelFilter === ch ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                >
                                    {t(ch)}
                                </button>
                            ))}
                        </div>

                        {/* Active Filter */}
                        <div className="relative group">
                            <select
                                className="appearance-none bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-2.5 pr-12 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer shadow-sm text-slate-700 dark:text-slate-200 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50"
                                value={activeFilter}
                                onChange={(e) => { setActiveFilter(e.target.value); setPage(1); }}
                            >
                                <option value="All">{t("Any Status")}</option>
                                <option value="Active">{t("Active Only")}</option>
                                <option value="Inactive">{t("Inactive Only")}</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-emerald-500 transition-colors" />
                        </div>

                        {/* Verified Filter */}
                        <div className="relative group">
                            <select
                                className="appearance-none bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-2.5 pr-12 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer shadow-sm text-slate-700 dark:text-slate-200 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50"
                                value={verifiedFilter}
                                onChange={(e) => { setVerifiedFilter(e.target.value); setPage(1); }}
                            >
                                <option value="All">{t("Verification (Any)")}</option>
                                <option value="Verified">{t("Verified")}</option>
                                <option value="Unverified">{t("Not Verified")}</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-emerald-500 transition-colors" />
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest min-w-[200px]">{t("Name")}</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest min-w-[200px]">{t("Communication ID")}</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest min-w-[180px]">{t("Channel / Provider")}</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest min-w-[150px]">{t("Created / Updated")}</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center min-w-[100px]">{t("Verified")}</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center min-w-[100px]">{t("Active")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                                <span className="text-slate-400 font-medium">{t("Loading data...")}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : senders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Search size={48} className="text-slate-300 dark:text-slate-700" />
                                                <span className="text-slate-400 text-lg">{t("No senders matched your criteria")}</span>
                                                <button
                                                    onClick={() => { setSearchQuery(''); setChannelFilter('All'); setActiveFilter('All'); setVerifiedFilter('All'); setPage(1); }}
                                                    className="text-emerald-500 hover:underline text-sm font-bold"
                                                >
                                                    {t("Clear all filters")}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    senders.map((item, idx) => {
                                        const commId = item.channel === 'Email' ? item.email : item.phoneNumber;
                                        const isPostmarkEmail = item.provider?.toLowerCase() === 'postmark' && item.channel === 'Email';

                                        return (
                                            <tr key={item._id?.toString() || idx} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3 font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors cursor-pointer" onClick={() => navigate(`/settings/communication/${item._id}`)}>
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                                                            {item.channel === 'Email' ? <Mail size={18} /> : item.channel === 'SMS' ? <MessageSquare size={18} /> : <Phone size={18} />}
                                                        </div>
                                                        <div
                                                            className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate max-w-[180px] cursor-pointer hover:underline decoration-emerald-500/30 underline-offset-4"
                                                            title={`${t("Edit")} ${item.name || 'Untitled Sender'}`}
                                                        >
                                                            {item.name || 'Untitled Sender'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 group/id">
                                                        <span
                                                            className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg truncate max-w-[180px] inline-block align-middle"
                                                            title={commId || 'N/A'}
                                                        >
                                                            {commId || 'N/A'}
                                                        </span>
                                                        {commId && (
                                                            <button
                                                                onClick={() => copyToClipboard(commId)}
                                                                className="opacity-0 group-hover/id:opacity-100 p-1 text-slate-400 hover:text-emerald-600 transition-all flex-shrink-0"
                                                                title={t("Copy ID")}
                                                            >
                                                                <Copy size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${item.channel === 'Email' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                                                                item.channel === 'SMS' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                                    'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                                }`}>
                                                                {getChannelIcon(item.channel)}
                                                                {item.channel}
                                                            </span>
                                                            <span className="text-xs font-bold text-slate-400">via</span>
                                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.provider}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col text-xs gap-1">
                                                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                                            <Calendar size={12} className="text-slate-300" />
                                                            <span>{t("Created:")} <span className="text-slate-700 dark:text-slate-200 font-medium">{formatDate(item.createdAt)}</span></span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                                            <Clock size={12} className="text-slate-300" />
                                                            <span>{t("Updated:")} <span className="text-slate-700 dark:text-slate-200 font-medium">{formatDate(item.updatedAt)}</span></span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col items-center gap-2">
                                                        {(item.verified || (isPostmarkEmail && item.postmark?.signatureVerified)) ? (
                                                            <div className="flex flex-col items-center gap-1.5">
                                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-800">
                                                                    <CheckCircle2 size={12} />
                                                                    {t("Verified")}
                                                                </span>
                                                                {item.verifiedAt && (
                                                                    <span className="text-[10px] font-bold text-slate-400">
                                                                        {formatDate(item.verifiedAt)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-3">
                                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest border border-rose-200 dark:border-rose-800">
                                                                    <XCircle size={12} />
                                                                    {t("Not Verified")}
                                                                </span>

                                                                {isPostmarkEmail && (
                                                                    <button
                                                                        onClick={() => handleReVerify(item._id)}
                                                                        disabled={verifyingId === item._id}
                                                                        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase tracking-tight transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
                                                                    >
                                                                        {verifyingId === item._id ? (
                                                                            <Loader2 size={12} className="animate-spin" />
                                                                        ) : (
                                                                            <RefreshCw size={12} />
                                                                        )}
                                                                        {t("Verify Now")}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <div className="flex justify-center">
                                                        <div
                                                            className={`relative inline-flex items-center h-6 w-12 rounded-full transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] cursor-default shadow-inner ${item.active ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-slate-200 dark:bg-slate-700'}`}
                                                        >
                                                            <span className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-md transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${item.active ? 'translate-x-6.5' : 'translate-x-1'}`} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!loading && pagination.pages > 1 && (
                        <div className="mt-8 flex flex-col xl:flex-row items-center justify-between gap-6 px-4 py-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="flex flex-col sm:flex-row items-center gap-6 order-2 xl:order-1">
                                <p className="text-sm text-slate-500 font-medium">
                                    {t("Showing")} <span className="text-slate-900 dark:text-white font-bold">{senders.length}</span> {t("of")} <span className="text-slate-900 dark:text-white font-bold">{pagination.total}</span> {t("senders")}
                                </p>

                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("Rows per page")}</span>
                                    <div className="relative group">
                                        <select
                                            className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 pr-8 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer text-slate-700 dark:text-slate-200"
                                            value={limit}
                                            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                                        >
                                            {[10, 20, 50, 100].map(val => (
                                                <option key={val} value={val}>{val}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 order-1 xl:order-2">
                                {/* First Page */}
                                <button
                                    onClick={() => setPage(1)}
                                    disabled={page === 1}
                                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-20 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-400 shadow-sm"
                                    title={t("First Page")}
                                >
                                    <ChevronsLeft size={18} />
                                </button>

                                {/* Prev Page */}
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-20 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-400 shadow-sm mr-1"
                                    title={t("Previous Page")}
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                <div className="flex items-center gap-1">
                                    {(() => {
                                        const pages = [];
                                        const totalPages = pagination.pages;
                                        const showMax = 3;

                                        let start = Math.max(1, page - 1);
                                        let end = Math.min(totalPages, page + 1);

                                        if (page <= showMax) {
                                            start = 1;
                                            end = Math.min(totalPages, showMax);
                                        } else if (page > totalPages - showMax) {
                                            start = Math.max(1, totalPages - showMax + 1);
                                            end = totalPages;
                                        }

                                        if (start > 1) {
                                            pages.push(
                                                <button key={1} onClick={() => setPage(1)} className="w-10 h-10 rounded-xl text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50">1</button>
                                            );
                                            if (start > 2) pages.push(<span key="sp1" className="px-1 text-slate-400 text-xs font-black">...</span>);
                                        }

                                        for (let i = start; i <= end; i++) {
                                            pages.push(
                                                <button
                                                    key={i}
                                                    onClick={() => setPage(i)}
                                                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${page === i ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 scale-110 z-10' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50'}`}
                                                >
                                                    {i}
                                                </button>
                                            );
                                        }

                                        if (end < totalPages) {
                                            if (end < totalPages - 1) pages.push(<span key="sp2" className="px-1 text-slate-400 text-xs font-black">...</span>);
                                            pages.push(
                                                <button key={totalPages} onClick={() => setPage(totalPages)} className="w-10 h-10 rounded-xl text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50">{totalPages}</button>
                                            );
                                        }

                                        return pages;
                                    })()}
                                </div>

                                {/* Next Page */}
                                <button
                                    onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                                    disabled={page === pagination.pages}
                                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-20 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-400 shadow-sm ml-1"
                                    title={t("Next Page")}
                                >
                                    <ChevronRight size={18} />
                                </button>

                                {/* Last Page */}
                                <button
                                    onClick={() => setPage(pagination.pages)}
                                    disabled={page === pagination.pages}
                                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-20 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-400 shadow-sm"
                                    title={t("Last Page")}
                                >
                                    <ChevronsRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
