import React, { useState } from 'react';
import { X, Mail, Phone, Globe, Linkedin, Twitter, Facebook, Instagram, Github, CheckCircle, AlertCircle, Copy, Plus, Edit2 } from '../Icons';
import { useToast } from '../Toast';

interface ContactPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        emails: any[];
        phones: any[];
        socials?: any[];
    };
    onEdit?: (type: 'email' | 'phone', index?: number) => void;
}

export const ContactPreviewModal = ({ isOpen, onClose, data, onEdit }: ContactPreviewModalProps) => {
    const { addToast } = useToast();
    const [copiedIndex, setCopiedIndex] = useState<{ type: string, index: number } | null>(null);

    if (!isOpen) return null;

    const { emails, phones, socials = [] } = data;

    const handleCopy = (text: string, type: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex({ type, index });
        addToast("Copied to clipboard", "success");
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const getSocialIcon = (network: string) => {
        const lower = network.toLowerCase();
        if (lower.includes('linkedin')) return <Linkedin size={16} />;
        if (lower.includes('twitter')) return <Twitter size={16} />;
        if (lower.includes('facebook')) return <Facebook size={16} />;
        if (lower.includes('instagram')) return <Instagram size={16} />;
        if (lower.includes('github')) return <Github size={16} />;
        return <Globe size={16} />;
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Contact Details</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                    {/* EMAILS */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Mail size={14} /> Email Addresses
                            </h3>
                            <button
                                onClick={() => onEdit?.('email')}
                                className="text-[10px] font-bold text-green-600 hover:text-green-700 flex items-center gap-1 uppercase tracking-tighter bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded"
                            >
                                <Plus size={10} /> Add Email
                            </button>
                        </div>
                        {emails && emails.length > 0 ? (
                            <div className="space-y-2">
                                {emails.map((email: any, idx: number) => {
                                    const address = email.address || email.text || email.value || (typeof email === 'string' ? email : '');
                                    const isPrimary = email.type === 'Primary' || email.preferred === 'Yes';
                                    const isOptedOut = email.subscribeStatus === 'Unsubscribed';

                                    return (
                                        <div key={idx} className="flex flex-col p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700 group hover:border-green-200 dark:hover:border-green-800 transition-all shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1.5 mb-0.5">
                                                        <a
                                                            href={`mailto:${address}`}
                                                            className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                                        >
                                                            {address}
                                                        </a>
                                                        {isPrimary && (
                                                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[9px] font-black rounded-lg uppercase">Primary</span>
                                                        )}
                                                        {isOptedOut ? (
                                                            <AlertCircle size={14} className="text-amber-500" title="Opted Out" />
                                                        ) : (
                                                            <CheckCircle size={14} className="text-green-500" title="Opted In" />
                                                        )}
                                                    </div>
                                                    {email.type && email.type !== 'Primary' && (
                                                        <span className="text-[10px] text-slate-400">{email.type}</span>
                                                    )}
                                                </div>
                                                <div className="flex gap-1.5">
                                                    <button
                                                        onClick={() => onEdit?.('email', idx)}
                                                        className="p-1.5 bg-white dark:bg-slate-800 text-slate-400 hover:text-green-600 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={12} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleCopy(address, 'email', idx)}
                                                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-slate-800 text-slate-500 hover:text-emerald-600 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:border-emerald-200"
                                                        title="Copy"
                                                    >
                                                        <Copy size={12} />
                                                        <span className="text-[10px] font-bold uppercase transition-colors">Copy</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 italic bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">No email addresses found.</p>
                        )}
                    </div>

                    {/* PHONES */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Phone size={14} /> Phone Numbers
                            </h3>
                            <button
                                onClick={() => onEdit?.('phone')}
                                className="text-[10px] font-bold text-green-600 hover:text-green-700 flex items-center gap-1 uppercase tracking-tighter bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded"
                            >
                                <Plus size={10} /> Add Phone
                            </button>
                        </div>
                        {phones && phones.length > 0 ? (
                            <div className="space-y-2">
                                {phones.map((phone: any, idx: number) => {
                                    const number = phone.number || phone.text || phone.value || (typeof phone === 'string' ? phone : '');
                                    const isPrimary = phone.type === 'Primary' || phone.preferred === 'Yes';
                                    const isOptedOut = phone.subscribeStatus === 'Unsubscribed' || phone.DNDStatus === 'Unsubscribed';

                                    return (
                                        <div key={idx} className="flex flex-col p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700 group hover:border-green-200 dark:hover:border-green-800 transition-all shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1.5 mb-0.5">
                                                        <a
                                                            href={`tel:${number}`}
                                                            className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                                        >
                                                            {number}
                                                        </a>
                                                        {isPrimary && (
                                                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[9px] font-black rounded-lg uppercase">Primary</span>
                                                        )}
                                                        {isOptedOut ? (
                                                            <AlertCircle size={14} className="text-amber-500" title="DND / Opted Out" />
                                                        ) : (
                                                            <CheckCircle size={14} className="text-green-500" title="Opted In" />
                                                        )}
                                                    </div>
                                                    {phone.type && phone.type !== 'Primary' && (
                                                        <span className="text-[10px] text-slate-400">{phone.type}</span>
                                                    )}
                                                </div>
                                                <div className="flex gap-1.5">
                                                    <button
                                                        onClick={() => onEdit?.('phone', idx)}
                                                        className="p-1.5 bg-white dark:bg-slate-800 text-slate-400 hover:text-green-600 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={12} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleCopy(number, 'phone', idx)}
                                                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-slate-800 text-slate-500 hover:text-emerald-600 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:border-emerald-200"
                                                        title="Copy Number"
                                                    >
                                                        <Copy size={12} />
                                                        <span className="text-[10px] font-bold uppercase transition-colors">Copy</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 italic bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">No phone numbers found.</p>
                        )}
                    </div>

                    {/* SOCIALS */}
                    {socials && socials.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Globe size={14} /> Social Profiles
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {socials.map((social: any, idx: number) => (
                                    <a
                                        key={idx}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-green-600 dark:hover:text-green-400 transition-colors shadow-sm"
                                    >
                                        {getSocialIcon(social.network || 'website')}
                                        <span className="font-medium">{social.network || social.text || 'Website'}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
