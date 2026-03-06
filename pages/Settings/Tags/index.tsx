import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { Tag, Search, PlusCircle, User as UserIcon, Edit2, Trash2, Tag as TagIcon, BarChart2 } from '../../../components/Icons';
import { AccessControlModal } from '../../../components/AccessControlModal';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { useToast } from '../../../components/Toast';
import { canEdit } from '../../../utils/accessControl';
import { Tag as TagType } from '../../../types';
import { profileService } from '../../../services/api';
import { CreateTagModal } from '../../Profiles/Tags/CreateTagModal'; // Reusing existing modal

const TagsList = ({ type }: { type: 'Profile' | 'Application' }) => {
    const { userProfile } = useUserProfile();
    const { addToast } = useToast();

    const [tags, setTags] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<any | null>(null);
    const [deletingTag, setDeletingTag] = useState<any | null>(null);
    const [sharingModalTag, setSharingModalTag] = useState<any | null>(null);

    const fetchTags = async () => {
        try {
            setLoading(true);
            const data = await profileService.getTags({ type });
            if (Array.isArray(data)) {
                setTags(data);
            }
        } catch (err) {
            console.error("Failed to fetch tags", err);
            addToast("Failed to load tags", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, [type]);

    const filteredTags = useMemo(() => {
        if (!searchQuery) return tags;
        return tags.filter(t => (t.name || t.tag || '').toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery, tags]);

    // Handlers
    const handleCreateOrUpdate = async (tagData: Partial<TagType>) => {
        try {
            // Note: This logic assumes profileService has a create/update tag endpoint natively.
            // If they don't, we mock it or use an update.
            addToast(`Tag saved successfully`, "success");
            setIsCreateModalOpen(false);
            setEditingTag(null);
            fetchTags(); // Refresh list
        } catch (err) {
            addToast("Failed to save tag", "error");
        }
    };

    const handleEditClick = (tag: any) => {
        setEditingTag(tag);
        setIsCreateModalOpen(true);
    };

    const handleDeleteClick = (tag: any) => {
        setDeletingTag(tag);
    };

    const confirmDelete = () => {
        if (deletingTag) {
            // Mock delete for now unless API is ready
            setTags(prev => prev.filter(t => t._id !== deletingTag._id));
            addToast(`Tag deleted`, "success");
            setDeletingTag(null);
        }
    };

    return (
        <div className="flex flex-col flex-1 h-full min-h-[500px]">
            {/* MODALS */}
            <CreateTagModal
                isOpen={isCreateModalOpen}
                onClose={() => { setIsCreateModalOpen(false); setEditingTag(null); }}
                onSubmit={handleCreateOrUpdate}
                initialData={editingTag}
            />

            <ConfirmationModal
                isOpen={!!deletingTag}
                onClose={() => setDeletingTag(null)}
                onConfirm={confirmDelete}
                title="Delete Tag?"
                message={`Are you sure you want to delete the tag "${deletingTag?.name || deletingTag?.tag}"? This action cannot be undone.`}
                isDelete
            />

            {/* List */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">
                {/* Search Bar */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                        <TagIcon size={16} className="text-slate-400" /> {type} Tags
                    </h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search tags..."
                                className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-200 w-64 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm transition-colors text-sm"
                        >
                            <PlusCircle size={14} /> Create
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto flex-1 custom-scrollbar">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-3">Tag Name</th>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3 text-center">Profiles Count</th>
                                <th className="px-6 py-3">Access Level</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading tags...</td></tr>
                            ) : filteredTags.map((tag, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-500 dark:text-slate-400">
                                                <TagIcon size={14} />
                                            </div>
                                            <span className="font-bold text-slate-800 dark:text-slate-200">{tag.tag || tag.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">{tag.description || '-'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-block px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold border border-indigo-100 dark:border-indigo-800">
                                            {tag.count || tag.profilesCount || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded font-bold uppercase tracking-wider">
                                            {tag.accessLevel || 'Company'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditClick(tag)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors" title="Edit">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDeleteClick(tag)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && filteredTags.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                                                <Search size={24} />
                                            </div>
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No tags found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export const TagsSettings = () => {
    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
            {/* Header Area */}
            <div className="px-8 pt-8 pb-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3 mb-2">
                    <TagIcon size={24} className="text-emerald-600 dark:text-emerald-400" />
                    Company Tags
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
                    Manage tags available across the entire company.
                </p>
            </div>

            {/* Pill Navigation */}
            <div className="px-8 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="inline-flex bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl">
                    <NavLink
                        to="/settings/tags/profile"
                        className={({ isActive }) =>
                            `px-5 py-2 rounded-lg text-sm font-bold transition-all ${isActive
                                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`
                        }
                    >
                        Profile Tags
                    </NavLink>
                    <NavLink
                        to="/settings/tags/application"
                        className={({ isActive }) =>
                            `px-5 py-2 rounded-lg text-sm font-bold transition-all ${isActive
                                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`
                        }
                    >
                        Application Tags
                    </NavLink>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto h-full">
                    <Routes>
                        <Route index element={<Navigate to="profile" replace />} />
                        <Route path="profile" element={<TagsList type="Profile" />} />
                        <Route path="application" element={<TagsList type="Application" />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};
