import React from 'react';
import { X } from 'lucide-react';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string; // HTML content
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content - Sandbox with Iframe to prevent style bleeding */}
                <div className="flex-1 overflow-hidden relative bg-slate-50 dark:bg-black/20">
                    <iframe
                        srcDoc={`
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <style>
                                    body { font-family: ui-sans-serif, system-ui, sans-serif; padding: 20px; color: #334155; margin: 0; line-height: 1.5; }
                                    img { max-width: 100%; height: auto; }
                                    p { margin-bottom: 1em; }
                                    a { color: #2563eb; text-decoration: underline; }
                                    .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center; color: #94a3b8; margin-top: -20px; }
                                    .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.5; }
                                </style>
                            </head>
                            <body>
                                ${content ? content : `
                                    <div class="empty-state">
                                        <div class="empty-icon">📄</div>
                                        <p>No preview content found.</p>
                                        <div style="font-size: 12px; opacity: 0.7;">Data will be fetched from communications in future update.</div>
                                    </div>
                                `}
                            </body>
                            </html>
                        `}
                        className="w-full h-full border-0 block bg-white"
                        title="Preview"
                        sandbox="allow-same-origin" // Restrict scripts for security
                    />
                </div>

                {/* Footer (Optional) */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
