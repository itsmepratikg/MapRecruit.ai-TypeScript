import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import dayjs from 'dayjs';
import { CornerUpLeft, MoreVertical, Star, CornerUpRight, Download, Paperclip } from 'lucide-react';

interface EmailReaderProps {
    email: any;
}

export const EmailReader: React.FC<EmailReaderProps> = ({ email }) => {
    // Determine the main content to display. For demonstration, we'll try to find an HTML body,
    // otherwise fallback to the snippet. A real integration would parse the full MIME tree.
    const [bodyHtml, setBodyHtml] = useState(email.snippet || '');

    useEffect(() => {
        // Placeholder logic - assuming the backend might attach the raw HTML inside `body` property eventually.
        // As per the current implementation, we just have the snippet. We render it cleanly.
        if (email.bodyHtml) {
            setBodyHtml(DOMPurify.sanitize(email.bodyHtml));
        } else {
            setBodyHtml(email.snippet || 'No content preview available.');
        }
    }, [email]);

    const formattedDate = email.date ? dayjs(email.date).format('MMM D, YYYY, h:mm A') : '';
    const avatarLetter = email.from ? email.from.charAt(0).toUpperCase() : '?';

    return (
        <div className="h-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Header/Action Bar */}
            <div className="shrink-0 flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm relative z-10">
                <div className="flex gap-2">
                    <button className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm" title="Reply">
                        <CornerUpLeft className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm" title="Forward">
                        <CornerUpRight className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex gap-2">
                    <button className="p-2.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-colors">
                        <Star className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Email Metadata */}
            <div className="shrink-0 p-8 pb-6 bg-white dark:bg-slate-900">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
                    {email.subject}
                </h2>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-500/20">
                            {avatarLetter}
                        </div>
                        <div>
                            <div className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-0.5">
                                {email.from}
                            </div>
                            <div className="text-sm font-medium text-slate-500">
                                to <span className="text-slate-700 dark:text-slate-300">me</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 whitespace-nowrap bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                            {formattedDate}
                        </span>
                    </div>
                </div>
            </div>

            {/* Attachments Placeholder (If any) */}
            {email.hasAttachments && (
                <div className="px-8 py-3 bg-slate-50 dark:bg-slate-800/50 border-y border-slate-100 dark:border-slate-800 flex gap-3 overflow-x-auto">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-sm font-medium hover:border-emerald-500 cursor-pointer transition-colors group">
                        <Paperclip className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                        <span className="text-slate-700 dark:text-slate-300">Attachment.pdf</span>
                        <Download className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 ml-2" />
                    </div>
                </div>
            )}

            {/* Email Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-3xl prose prose-slate dark:prose-invert prose-emerald prose-p:leading-relaxed prose-headings:font-bold prose-a:text-emerald-600 hover:prose-a:text-emerald-700"
                    dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
            </div>
        </div>
    );
};
