
import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Briefcase, Tag, FileText, 
  X, ExternalLink, Linkedin, Github 
} from '../../../components/Icons';
import { Contact } from '../types';

interface ContactPanelProps {
    contact: Contact;
    isOpen: boolean;
    onClose: () => void;
}

export const ContactPanel = ({ contact, isOpen, onClose }: ContactPanelProps) => {
    const [activeTab, setActiveTab] = useState<'info' | 'notes'>('info');

    if (!isOpen) return null;

    return (
        <div className="w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 h-full flex flex-col shadow-xl absolute right-0 top-0 bottom-0 z-20 md:static md:shadow-none animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Contact Details</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X size={18} />
                </button>
            </div>

            <div className="p-6 flex flex-col items-center border-b border-slate-200 dark:border-slate-700">
                <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl font-bold text-slate-500 dark:text-slate-400 mb-3 shadow-inner">
                    {contact.avatar}
                </div>
                <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 text-center">{contact.name}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">{contact.company}</p>
                
                <div className="flex gap-2 mt-4">
                     <button className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                        <Mail size={16} />
                     </button>
                     <button className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                        <Phone size={16} />
                     </button>
                     {contact.socialProfiles?.linkedin && (
                        <button className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                            <Linkedin size={16} />
                        </button>
                     )}
                </div>
            </div>

            <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button 
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'info' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/10' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    onClick={() => setActiveTab('info')}
                >
                    Info
                </button>
                <button 
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'notes' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/10' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    onClick={() => setActiveTab('notes')}
                >
                    Notes
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {activeTab === 'info' ? (
                    <div className="space-y-5">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail size={16} className="text-slate-400 shrink-0" />
                                <span className="text-slate-700 dark:text-slate-300 truncate">{contact.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone size={16} className="text-slate-400 shrink-0" />
                                <span className="text-slate-700 dark:text-slate-300">{contact.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin size={16} className="text-slate-400 shrink-0" />
                                <span className="text-slate-700 dark:text-slate-300">{contact.location}</span>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                                <Tag size={12} /> Tags
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {contact.tags.map((tag, idx) => (
                                    <span key={idx} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs border border-slate-200 dark:border-slate-600">
                                        {tag}
                                    </span>
                                ))}
                                <button className="px-2 py-1 border border-dashed border-slate-300 dark:border-slate-600 text-slate-400 text-xs rounded hover:border-emerald-500 hover:text-emerald-500 transition-colors">+ Add</button>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-500">Last Seen</span>
                                <span className="text-xs text-slate-700 dark:text-slate-300">{contact.lastSeen}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500">IP Address</span>
                                <span className="text-xs text-slate-700 dark:text-slate-300">192.168.1.1</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <textarea 
                            className="w-full p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-yellow-500 placeholder:text-slate-400 resize-none"
                            rows={4}
                            placeholder="Add a private note..."
                            defaultValue={contact.notes}
                        ></textarea>
                        <button className="w-full py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors">Save Note</button>
                        
                        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">PG</div>
                                <div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300">Added urgent tag.</p>
                                    <span className="text-[10px] text-slate-400">2 hours ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
