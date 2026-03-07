
import React, { useState, useMemo } from 'react';
import { Tag, X, Search, CheckCircle, Trash2, PlusCircle, Link2, Unlink, Loader2 } from '../Icons';
import { useToast } from '../Toast';
import { ConfirmationModal } from '../ConfirmationModal';
import { Portal } from '../Menu/Portal';
import { useTranslation } from 'react-i18next';

interface TagManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    availableTags: any[];
    attachedTags: any[];
    onAddTag: (tag: any) => Promise<void>;
    onRemoveTag: (tag: any) => Promise<void>;
    onCreateTag?: () => void;
    isLoading?: boolean;
}

export const TagManagementModal: React.FC<TagManagementModalProps> = ({
    isOpen,
    onClose,
    availableTags,
    attachedTags,
    onAddTag,
    onRemoveTag,
    onCreateTag,
    isLoading
}) => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'attach' | 'attached'>('attach');
    const [searchQuery, setSearchQuery] = useState('');

    // Confirmation State
    const [confirmAction, setConfirmAction] = useState<{
        type: 'attach' | 'remove';
        tag: any;
    } | null>(null);

    const filteredTags = useMemo(() => {
        const query = searchQuery.toLowerCase();
        if (activeTab === 'attach') {
            // Filter out already attached tags and apply search
            return availableTags.filter(tag => {
                const tagId = tag._id?.$oid || tag._id || tag.id;
                const isAlreadyAttached = attachedTags.some((at: any) => (at._id?.$oid || at._id || at.id) === tagId);
                const matchesSearch = (tag.name || tag.tag || '').toLowerCase().includes(query);
                return !isAlreadyAttached && matchesSearch;
            });
        } else {
            return attachedTags.filter((tag: any) =>
                (tag.name || tag.tag || '').toLowerCase().includes(query)
            );
        }
    }, [activeTab, availableTags, attachedTags, searchQuery]);

    const handleActionClick = (tag: any, type: 'attach' | 'remove') => {
        setConfirmAction({ type, tag });
    };

    const handleConfirmAction = async () => {
        if (!confirmAction) return;

        try {
            if (confirmAction.type === 'attach') {
                await onAddTag(confirmAction.tag);
                addToast(`Tag attached`, "success");
            } else {
                await onRemoveTag(confirmAction.tag);
                addToast(`Tag removed`, "success");
            }
        } catch (err) {
            addToast(`Failed to ${confirmAction.type} tag`, "error");
        } finally {
            setConfirmAction(null);
        }
    };

    if (!isOpen) return null;

    return (
        <Portal>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 pointer-events-auto">
                <div
                    className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                    onClick={onClose}
                />

                <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col h-full max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                                <Tag size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Manage Profile Tags</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Tagging Workspace</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation & Search */}
                    <div className="px-6 py-4 space-y-4 bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto shadow-inner">
                                <button
                                    onClick={() => setActiveTab('attach')}
                                    className={`flex items-center gap-2 px-6 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'attach'
                                        ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    Attach Tags
                                </button>
                                <button
                                    onClick={() => setActiveTab('attached')}
                                    className={`flex items-center gap-2 px-6 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'attached'
                                        ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    Attached ({attachedTags.length})
                                </button>
                            </div>

                            <div className="relative w-full sm:w-72 group">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder={t ? t("Search tags...") : "Search tags..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 dark:text-slate-200 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table Area */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar bg-white dark:bg-slate-900">
                        {isLoading ? (
                            <div className="h-full flex flex-col items-center justify-center py-12">
                                <Loader2 size={32} className="animate-spin text-emerald-600 mb-4" />
                                <p className="text-sm font-medium text-slate-400 animate-pulse uppercase tracking-widest">Loading Tags...</p>
                            </div>
                        ) : (
                            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50/80 dark:bg-slate-800/50 backdrop-blur-sm text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                                        <tr>
                                            <th className="px-6 py-4 uppercase tracking-wider text-[10px]">Tag Details</th>
                                            <th className="px-6 py-4 uppercase tracking-wider text-[10px]">Access</th>
                                            <th className="px-6 py-4 text-right uppercase tracking-wider text-[10px]">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {filteredTags.length > 0 ? (
                                            filteredTags.map((tag: any) => (
                                                <tr key={tag._id?.$oid || tag._id || tag.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
                                                                style={{ backgroundColor: tag.color || '#10b981' }}
                                                            />
                                                            <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 transition-colors">
                                                                {tag.name || tag.tag || tag.text}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                                                            {tag.accessLevel || 'Company'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {activeTab === 'attach' ? (
                                                            <button
                                                                onClick={() => handleActionClick(tag, 'attach')}
                                                                className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg font-bold text-xs hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2 ml-auto"
                                                            >
                                                                <Link2 size={14} /> Attach Tag
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleActionClick(tag, 'remove')}
                                                                className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-bold text-xs hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 ml-auto"
                                                            >
                                                                <Trash2 size={14} /> Remove
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="px-4 py-20 text-center text-slate-400">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center">
                                                            <Tag size={32} className="opacity-20" />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="font-bold text-slate-500 dark:text-slate-400">No {activeTab === 'attach' ? 'available' : 'attached'} tags</p>
                                                            <p className="text-xs opacity-60">Try searching for a different name or create a new tag.</p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center shrink-0">
                        <button
                            onClick={onCreateTag}
                            className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors group"
                        >
                            <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" />
                            Create New Tag
                        </button>
                        <button
                            onClick={onClose}
                            className="px-8 py-2.5 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-200 dark:shadow-none"
                        >
                            Done
                        </button>
                    </div>
                </div>

                <ConfirmationModal
                    isOpen={!!confirmAction}
                    onClose={() => setConfirmAction(null)}
                    onConfirm={handleConfirmAction}
                    title={confirmAction?.type === 'attach' ? 'Attach Tag?' : 'Remove Tag?'}
                    message={
                        confirmAction?.type === 'attach'
                            ? `Are you sure you want to attach "${confirmAction.tag.name || confirmAction.tag.tag || confirmAction.tag.text}" to this profile?`
                            : `Are you sure you want to remove this tag from the profile?`
                    }
                    isDelete={confirmAction?.type === 'remove'}
                />
            </div>
        </Portal>
    );
};
