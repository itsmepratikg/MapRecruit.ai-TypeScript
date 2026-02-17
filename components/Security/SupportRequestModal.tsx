
import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import html2canvas from 'html2canvas';
import { X, Send, Camera, AlertCircle, Image as ImageIcon, Trash2 } from 'lucide-react';

interface SupportRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    currentUrl: string;
    activeClientID: string;
    activeCompanyID: string;
    preCapturedScreenshot?: string | null;
}

export const SupportRequestModal: React.FC<SupportRequestModalProps> = ({
    isOpen,
    onClose,
    userId,
    currentUrl,
    activeClientID,
    activeCompanyID,
    preCapturedScreenshot
}) => {
    const [isCapturing, setIsCapturing] = useState(false);
    const [screenshot, setScreenshot] = useState<string | null>(preCapturedScreenshot || null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const editorRef = useRef<any>(null);

    const takeScreenshot = async () => {
        setIsCapturing(true);
        try {
            // Hide the modal itself from the screenshot using onclone
            const canvas = await html2canvas(document.body, {
                useCORS: true,
                allowTaint: true,
                scale: 0.8,
                logging: false,
                onclone: (clonedDoc) => {
                    const modal = clonedDoc.getElementById('support-modal-container');
                    if (modal) {
                        modal.style.display = 'none';
                    }
                }
            });
            const base64Image = canvas.toDataURL('image/png');
            setScreenshot(base64Image);

            // Also try to insert into editor as a backup/convenience if ready
            if (editorRef.current) {
                const imgHtml = `<p><img src="${base64Image}" style="max-width: 100%; border: 1px solid #ddd; border-radius: 4px;" /></p>`;
                editorRef.current.insertContent(imgHtml);
            }
        } catch (error) {
            console.error('Failed to capture screenshot:', error);
        } finally {
            setIsCapturing(false);
        }
    };

    // Sync with prop and auto-capture on open if needed
    useEffect(() => {
        if (isOpen) {
            if (preCapturedScreenshot) {
                setScreenshot(preCapturedScreenshot);
            } else {
                // Only auto-capture if nothing was passed in
                const timer = setTimeout(takeScreenshot, 400);
                return () => clearTimeout(timer);
            }
        } else {
            setScreenshot(null);
        }
    }, [isOpen, preCapturedScreenshot]);

    if (!isOpen) return null;

    const initialContent = `
        <p><strong>Support Request Context:</strong></p>
        <ul>
            <li><strong>User ID:</strong> ${userId}</li>
            <li><strong>Current URL:</strong> ${currentUrl}</li>
        </ul>
        <p>Please describe the issue you encountered:</p>
        <p>&nbsp;</p>
    `;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const content = editorRef.current ? editorRef.current.getContent() : 'No content provided';
            const { default: api } = await import('../../services/api');

            const response = await api.post('/support', {
                userId,
                currentUrl,
                activeClientID,
                activeCompanyID,
                content,
                screenshot
            });

            if (response.data.success) {
                alert(response.data.message || 'Support request submitted successfully');
                onClose();
            }
        } catch (error: any) {
            console.error('Submission failed:', error);
            alert(error.response?.data?.message || 'Failed to submit support request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div id="support-modal-container" className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/20 dark:border-slate-800 animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                            <AlertCircle className="w-7 h-7 text-orange-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Support Ticket</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Capture details and report an issue</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all group"
                    >
                        <X className="w-6 h-6 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                    </button>
                </div>

                {/* Main Body */}
                <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

                    {/* Form Side */}
                    <div className="flex-1 p-8 flex flex-col gap-6 overflow-hidden overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50">
                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block mb-1">User Ref</span>
                                <code className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold truncate block">{userId}</code>
                            </div>
                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50">
                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block mb-1">Client ID</span>
                                <code className="text-xs text-blue-600 dark:text-blue-400 font-mono font-bold truncate block">{activeClientID}</code>
                            </div>
                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50">
                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block mb-1">Company ID</span>
                                <code className="text-xs text-orange-600 dark:text-orange-400 font-mono font-bold truncate block">{activeCompanyID}</code>
                            </div>
                            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block mb-1">Page Path</span>
                                <p className="text-xs text-slate-600 dark:text-slate-300 truncate font-semibold" title={currentUrl}>{new URL(currentUrl).pathname}</p>
                            </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest block mb-1">Full Source URL</span>
                            <div className="text-[10px] font-mono text-slate-600 dark:text-slate-300 break-all bg-white dark:bg-black/20 p-2 rounded border border-slate-100 dark:border-white/5">
                                {currentUrl}
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col gap-2 min-h-0">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Issue Description</label>
                            <div className="flex-1 border rounded-2xl overflow-hidden border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
                                <Editor
                                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                                    onInit={(evt, editor) => editorRef.current = editor}
                                    initialValue={initialContent}
                                    init={{
                                        height: '100%',
                                        menubar: false,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | blocks | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:14px; color: #000000 !important; background-color: #ffffff !important; }',
                                        skin: 'oxide',
                                        content_css: 'default',
                                        branding: false,
                                        statusbar: false
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Screenshot / Attachment Sidebar */}
                    <div className="w-full lg:w-80 bg-slate-50 dark:bg-slate-800/30 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 p-8 flex flex-col gap-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-emerald-500" />
                            Attachments
                        </h3>

                        <div className="flex-1 flex flex-col gap-4">
                            {screenshot ? (
                                <div className="group relative aspect-video rounded-xl overflow-hidden border-2 border-emerald-500/30 shadow-lg bg-black animate-in fade-in zoom-in-95">
                                    <img src={screenshot} alt="Screenshot" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button
                                            onClick={() => window.open(screenshot)}
                                            className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-lg text-white transition-all scale-90 group-hover:scale-100"
                                            title="View Full Size"
                                        >
                                            <ExternalLink size={18} />
                                        </button>
                                        <button
                                            onClick={() => setScreenshot(null)}
                                            className="p-2 bg-red-500/20 hover:bg-red-500/80 backdrop-blur-md rounded-lg text-white transition-all scale-90 group-hover:scale-100"
                                            title="Remove"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white font-bold tracking-tight">
                                        AUTO-CAPTURE.PNG
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={takeScreenshot}
                                    className="flex-1 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Camera size={24} className="text-slate-400 group-hover:text-emerald-500" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Add Screenshot</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Capture current state</p>
                                    </div>
                                </button>
                            )}

                            <div className="mt-auto space-y-4">
                                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium leading-relaxed">
                                        Screenshots help our engineers diagnose visual bugs and layout issues faster.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {isCapturing && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold animate-pulse">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                CAPTURING SCREEN...
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center gap-3 px-10 py-2.5 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-extrabold shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Ticket
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple ExternalLink icon since it was missing from Lucide-react import
const ExternalLink = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
);
