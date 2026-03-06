
import React, { useState, useMemo, useEffect } from 'react';
import { Tag, Search, PlusCircle, User, Edit2, Trash2, Tag as TagIcon, BarChart2 } from '../../../components/Icons';
import { MOCK_TAGS } from '../../../data';
import { AccessControlModal } from '../../../components/AccessControlModal';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { useToast } from '../../../components/Toast';
import { CreateTagModal } from './CreateTagModal';
import { TagDetailView } from './TagDetailView';
import { canEdit } from '../../../utils/accessControl';
import { Tag as TagType } from '../../../types';
import { profileService } from '../../../services/api';

const TagsMetricView = ({ tags }: { tags: any[] }) => {
   // Sort by usage (profilesCount)
   const topTags = [...tags].sort((a, b) => (b.count || b.profilesCount || 0) - (a.count || a.profilesCount || 0)).slice(0, 4);

   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         {topTags.map((tag, idx) => {
            const count = tag.count || tag.profilesCount || 0;
            const name = tag.tag || tag.name || '';
            return (
               <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                     <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                        <Tag size={18} />
                     </div>
                     <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{count}</span>
                  </div>
                  <div>
                     <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate" title={name}>{name}</h4>
                     <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (count / 300) * 100)}%` }}></div>
                     </div>
                  </div>
               </div>
            )
         })}
      </div>
   );
};

export const TagsView = () => {
   const { userProfile } = useUserProfile();
   const { addToast } = useToast();

   // State Management
   const [tags, setTags] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState('');

   useEffect(() => {
      const fetchTags = async () => {
         try {
            setLoading(true);
            const data = await profileService.getTags();
            if (Array.isArray(data)) {
               setTags(data);
            }
         } catch (error) {
            console.error("Error fetching tags:", error);
         } finally {
            setLoading(false);
         }
      };
      fetchTags();
   }, []);

   // Modal States
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const [editingTag, setEditingTag] = useState<TagType | null>(null);

   const [deletingTag, setDeletingTag] = useState<TagType | null>(null);
   const [sharingModalTag, setSharingModalTag] = useState<TagType | null>(null);

   const [selectedTag, setSelectedTag] = useState<TagType | null>(null);

   // Filter Tags
   const filteredTags = useMemo(() => {
      if (!searchQuery) return tags;
      return tags.filter(t => (t.name || t.tag || '').toLowerCase().includes(searchQuery.toLowerCase()));
   }, [searchQuery, tags]);

   // --- Handlers ---

   const handleCreateOrUpdate = (tagData: Partial<TagType>) => {
      if (editingTag) {
         // Update
         setTags(prev => prev.map(t => t.id === editingTag.id ? { ...t, ...tagData } as TagType : t));
         addToast(`Tag "${tagData.name}" updated successfully`, "success");
      } else {
         // Create
         const newTag = {
            id: Date.now(), // Generate mock ID
            ...tagData
         } as TagType;
         setTags(prev => [newTag, ...prev]);
         addToast(`Tag "${tagData.name}" created successfully`, "success");
      }
      setEditingTag(null);
   };

   const handleEditClick = (tag: TagType) => {
      // Access check could go here if needed, relying on UI disabled state mostly
      if (!canEdit({ id: userProfile.id || 'usr_123' }, tag.access)) {
         addToast("You do not have permission to edit this tag.", "error");
         return;
      }
      setEditingTag(tag);
      setIsCreateModalOpen(true);
   };

   const handleDeleteClick = (tag: TagType) => {
      if (!canEdit({ id: userProfile.id || 'usr_123' }, tag.access)) {
         addToast("You do not have permission to delete this tag.", "error");
         return;
      }
      setDeletingTag(tag);
   };

   const confirmDelete = () => {
      if (deletingTag) {
         setTags(prev => prev.filter(t => t.id !== deletingTag.id));
         addToast(`Tag "${deletingTag.name}" deleted`, "success");
         setDeletingTag(null);
      }
   };

   const handleShareClick = (tag: TagType) => {
      if (!canEdit({ id: userProfile.id || 'usr_123' }, tag.access)) {
         addToast("You do not have permission to share this tag.", "error");
         return;
      }
      setSharingModalTag(tag);
   };

   const handleUpdateAccess = (newAccess: any) => {
      if (sharingModalTag) {
         setTags(prev => prev.map(t => t.id === sharingModalTag.id ? { ...t, access: newAccess } : t));
         addToast("Sharing settings updated", "success");
      }
   };

   // --- Render ---

   if (selectedTag) {
      return <TagDetailView tag={selectedTag} onBack={() => setSelectedTag(null)} />;
   }

   return (
      <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 overflow-y-auto custom-scrollbar p-6 lg:p-8">

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
            message={`Are you sure you want to delete the tag "${deletingTag?.name}"? This action cannot be undone.`}
            isDelete
         />

         {sharingModalTag && (
            <AccessControlModal
               isOpen={!!sharingModalTag}
               onClose={() => setSharingModalTag(null)}
               entityName={sharingModalTag.name}
               currentSettings={sharingModalTag.access}
               onSave={handleUpdateAccess}
               currentUser={{ id: userProfile.id || 'usr_123', name: `${userProfile.firstName} ${userProfile.lastName}` }}
            />
         )}

         {/* HEADER */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
               <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                  <TagIcon size={24} className="text-emerald-600 dark:text-emerald-400" />
                  Tags Management
               </h2>
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Organize candidates with custom tags and manage access permissions.</p>
            </div>
            <button
               onClick={() => setIsCreateModalOpen(true)}
               className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm transition-colors text-sm"
            >
               <PlusCircle size={16} /> Create Tag
            </button>
         </div>

         {/* METRICS */}
         <TagsMetricView tags={tags} />

         {/* MAIN CONTENT */}
         <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">

            {/* Search Bar */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
               <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                  <BarChart2 size={16} className="text-slate-400" /> All Tags
               </h3>
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
            </div>

            {/* List */}
            <div className="overflow-x-auto flex-1 custom-scrollbar">
               <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                     <tr>
                        <th className="px-6 py-3">Tag Name</th>
                        <th className="px-6 py-3">Description</th>
                        <th className="px-6 py-3 text-center">Profiles</th>
                        <th className="px-6 py-3">Created By</th>
                        <th className="px-6 py-3">Last Updated</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                     {loading ? (
                        <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">Loading tags...</td></tr>
                     ) : filteredTags.map((tag, idx) => (
                        <tr
                           key={tag.id || tag._id || idx}
                           className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer"
                           onClick={() => setSelectedTag(tag)}
                        >
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-500 dark:text-slate-400">
                                    <Tag size={14} />
                                 </div>
                                 <span className="font-bold text-slate-800 dark:text-slate-200">{tag.name || tag.tag}</span>
                                 {(tag.access?.level !== 'COMPANY' && tag.accessLevel !== 'Company') && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-600">
                                       {tag.access?.level === 'PRIVATE' || tag.accessLevel === 'User' ? 'Private' : 'Client'}
                                    </span>
                                 )}
                              </div>
                           </td>
                           <td className="px-6 py-4 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">{tag.description || '-'}</td>
                           <td className="px-6 py-4 text-center">
                              <span className="inline-block px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-800">
                                 {tag.profilesCount || tag.count || 0}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                 {tag.createdBy ? (
                                    <>
                                       <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                                          {typeof tag.createdBy === 'string' ? tag.createdBy.charAt(0) : (tag.createdBy.firstName?.charAt(0) || tag.createdBy.name?.charAt(0) || 'U')}
                                       </div>
                                       <span className="text-slate-600 dark:text-slate-300">
                                          {typeof tag.createdBy === 'string' ? tag.createdBy : (tag.createdBy.firstName ? `${tag.createdBy.firstName} ${tag.createdBy.lastName || ''}` : (tag.createdBy.name || 'Unknown'))}
                                       </span>
                                    </>
                                 ) : '-'}
                              </div>
                           </td>
                           <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                              {(() => {
                                 const dVal = tag.updatedAt || tag.updatedDate;
                                 if (!dVal) return '-';
                                 try {
                                    return new Intl.DateTimeFormat('en-GB', {
                                       day: '2-digit', month: 'short', year: 'numeric',
                                       hour: '2-digit', minute: '2-digit',
                                       timeZone: userProfile?.timeZone || 'Asia/Kolkata'
                                    }).format(new Date(dVal));
                                 } catch (e) { return dVal; }
                              })()}
                           </td>
                           <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button
                                    onClick={() => handleShareClick(tag)}
                                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    title="Share"
                                 >
                                    <User size={14} />
                                 </button>
                                 <button
                                    onClick={() => handleEditClick(tag)}
                                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                    title="Edit"
                                 >
                                    <Edit2 size={14} />
                                 </button>
                                 <button
                                    onClick={() => handleDeleteClick(tag)}
                                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-slate-400 hover:text-red-500 transition-colors"
                                    title="Delete"
                                 >
                                    <Trash2 size={14} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                     {!loading && filteredTags.length === 0 && (
                        <tr>
                           <td colSpan={6} className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center gap-2">
                                 <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                                    <Search size={24} />
                                 </div>
                                 <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No tags found</p>
                                 <p className="text-xs text-slate-400">Create a new tag or adjust your search.</p>
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
