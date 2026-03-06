
import React, { useState, useMemo } from 'react';
import { Tag, X, Search, CheckCircle, Trash2, PlusCircle, Link2, Unlink } from '../Icons';
import { useToast } from '../Toast';
import { ConfirmationModal } from '../ConfirmationModal';

interface TagManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: any;
    availableTags: any[];
    onAttach: (tag: any) => Promise<void>;
    onRemove: (tagId: string) => Promise<void>;
    onCreateTag?: () => void;
}

export const TagManagementModal: React.FC<TagManagementModalProps> = ({
    isOpen,
    onClose,
    profile,
    availableTags,
    onAttach,
    onRemove,
    onCreateTag
}) => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'attach' | 'attached'>('attach');
    const [searchQuery, setSearchQuery] = useState('');

    // Confirmation State
    const [confirmAction, setConfirmAction] = useState<{
        type: 'attach' | 'remove';
        tag: any;
    } | null>(null);

    const attachedTags = useMemo(() => profile?.tagID || [], [profile]);

    const filteredTags = useMemo(() => {
        const query = searchQuery.toLowerCase();
        if (activeTab === 'attach') {
            // Filter out already attached tags and apply search
            return availableTags.filter(tag =>
                !attachedTags.some((at: any) => (at._id || at.id) === (tag._id || tag.id)) &&
                (tag.name || tag.tag || '').toLowerCase().includes(query)
            );
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
                await onAttach(confirmAction.tag);
                addToast(`Tag "${confirmAction.tag.name || confirmAction.tag.tag}" attached`, "success");
            } else {
                await onRemove(confirmAction.tag._id || confirmAction.tag.id);
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
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-auto">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                            <Tag size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Manage Profile Tags</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Profile: {profile?.firstName} {profile?.lastName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation & Search */}
                <div className="px-6 py-4 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto">
                            <button
                                onClick={() => setActiveTab('attach')}
                                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'attach'
                                        ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                Attach Tag
                            </button>
                            <button
                                onClick={() => setActiveTab('attached')}
                                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'attached'
                                        ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                Attached ({attachedTags.length})
                            </button>
                        </div>

                        <div className="relative w-full sm:w-64">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search tags..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Table Area */}
                <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-4 py-3">Tag Name</th>
                                    <th className="px-4 py-3">Access</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredTags.length > 0 ? (
                                    filteredTags.map((tag: any) => (
                                        <tr key={tag._id || tag.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: tag.color || '#10b981' }}
                                                    />
                                                    <span className="font-bold text-slate-700 dark:text-slate-200">
                                                        {tag.name || tag.tag}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                                                    {tag.accessLevel || 'Company'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {activeTab === 'attach' ? (
                                                    <button
                                                        onClick={() => handleActionClick(tag, 'attach')}
                                                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors group"
                                                        title="Attach Tag"
                                                    >
                                                        <Link2 size={18} className="group-hover:scale-110 transition-transform" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleActionClick(tag, 'remove')}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                                                        title="Remove Tag"
                                                    >
                                                        <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <Tag size={32} className="opacity-20" />
                                                <p>No {activeTab === 'attach' ? 'available' : 'attached'} tags found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                    <button
                        onClick={onCreateTag}
                        className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                        <PlusCircle size={16} />
                        Create New Tag
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:scale-105 transition-all"
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
                        ? `Are you sure you want to attach "${confirmAction.tag.name || confirmAction.tag.tag}" to this profile?`
                        : `Are you sure you want to remove this tag from the profile?`
                }
                isDelete={confirmAction?.type === 'remove'}
            />
        </div>
    );
};
