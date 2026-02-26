import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { Mail, Reply, Archive } from 'lucide-react';

interface EmailListProps {
    emails: any[];
    selectedEmailId?: string;
    onSelect: (email: any) => void;
}

export const EmailList: React.FC<EmailListProps> = ({ emails, selectedEmailId, onSelect }) => {

    if (emails.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <Mail className="w-12 h-12 mb-4 opacity-30" />
                <p className="font-medium text-lg">Inbox is empty</p>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto w-full h-full custom-scrollbar">
            {emails.map((email) => {
                const isSelected = email.id === selectedEmailId;
                const formattedDate = email.date ? dayjs(email.date).fromNow() : '';

                return (
                    <div
                        key={email.id}
                        onClick={() => onSelect(email)}
                        className={`group relative p-5 border-b border-slate-100 dark:border-slate-800/80 cursor-pointer transition-all duration-200
                            ${isSelected
                                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-l-4 border-l-emerald-500'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-4 border-l-transparent'
                            }
                        `}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className={`font-bold truncate pr-3 ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                {email.from}
                            </h4>
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap pt-1">
                                {formattedDate}
                            </span>
                        </div>
                        <h5 className={`text-sm font-semibold truncate mb-1.5 ${isSelected ? 'text-slate-800 dark:text-slate-200' : 'text-slate-700 dark:text-slate-300'}`}>
                            {email.subject}
                        </h5>
                        <p className="text-sm text-slate-500 dark:text-slate-500 line-clamp-2 leading-relaxed">
                            {email.snippet}
                        </p>

                        {/* Quick Actions (Hover Reveal) */}
                        <div className="absolute right-4 bottom-4 flex bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-y-2 group-hover:translate-y-0">
                            <button className="p-2 hover:bg-emerald-50 hover:text-emerald-600 text-slate-400 dark:text-slate-500 transition-colors" title="Reply">
                                <Reply className="w-4 h-4" />
                            </button>
                            <div className="w-px bg-slate-200 dark:bg-slate-700" />
                            <button className="p-2 hover:bg-rose-50 hover:text-rose-600 text-slate-400 dark:text-slate-500 transition-colors" title="Archive">
                                <Archive className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
