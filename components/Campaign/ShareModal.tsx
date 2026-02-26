import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Users, Globe, Lock, UserPlus, CheckCircle, Edit2 } from '../Icons';
import { Campaign } from '../../types';

interface ShareModalProps {
   isOpen: boolean;
   onClose: () => void;
   campaign: Campaign;
}

export const ShareModal = ({ isOpen, onClose, campaign }: ShareModalProps) => {
   const [visibility, setVisibility] = useState(campaign.jobPosting?.visibility || 'Private');
   const [shareEmail, setShareEmail] = useState('');
   const [sharedUsers, setSharedUsers] = useState<string[]>(campaign.sharedUserID || []);
   const [isSaving, setIsSaving] = useState(false);
   const [isEditing, setIsEditing] = useState(false);

   if (!isOpen) return null;

   const handleAddUser = (e: React.FormEvent) => {
      e.preventDefault();
      if (!isEditing) return;
      if (shareEmail && !sharedUsers.includes(shareEmail)) {
         setSharedUsers([...sharedUsers, shareEmail]);
         setShareEmail('');
      }
   };

   const handleRemoveUser = (email: string) => {
      if (!isEditing) return;
      setSharedUsers(sharedUsers.filter(u => u !== email));
   };

   const handleSave = async () => {
      setIsSaving(true);
      // Simulate API call to save settings
      setTimeout(() => {
         console.log('Saved Share Settings', { visibility, sharedUsers });
         setIsSaving(false);
         setIsEditing(false);
      }, 500);
   };

   const handleCancel = () => {
       if (isEditing) {
           // Revert changes (optional depending on UX preference)
           setIsEditing(false);
       } else {
           onClose();
       }
   }

   const modalContent = (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
         <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800">
               <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                     <Users size={18} className="text-emerald-500" /> Share Campaign
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[200px]">{campaign.name}</p>
               </div>
               <div className="flex items-center gap-2">
                  {!isEditing ? (
                      <>
                        <button
                           onClick={() => setIsEditing(true)}
                           className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-colors border border-transparent"
                        >
                           <Edit2 size={14} /> Edit
                        </button>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors ml-1 border border-transparent">
                           <X size={20} />
                        </button>
                      </>
                  ) : (
                      <>
                        <button
                           onClick={handleCancel}
                           className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                        >
                           Cancel
                        </button>
                        <button
                           onClick={handleSave}
                           disabled={isSaving}
                           className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed border border-transparent"
                        >
                           {isSaving ? 'Saving...' : 'Save'}
                        </button>
                      </>
                  )}
               </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white dark:bg-slate-900 custom-scrollbar">
               
               {/* Visibility Setting */}
               <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                     <Globe size={14} /> Job Visibility
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                     {[
                        { id: 'Public', icon: Globe, label: 'Public', desc: 'Anyone can view' },
                        { id: 'Private', icon: Users, label: 'Internal', desc: 'Team only' },
                        { id: 'Restricted', icon: Lock, label: 'Restricted', desc: 'Only invited' }
                     ].map((opt) => (
                        <button
                           key={opt.id}
                           onClick={() => isEditing && setVisibility(opt.id)}
                           disabled={!isEditing}
                           className={`relative border rounded-xl p-3 flex flex-col items-center justify-center gap-1 transition-all ${
                              visibility === opt.id 
                                 ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500 shadow-sm' 
                                 : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                           } ${isEditing ? 'hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer' : 'opacity-80 cursor-default'}`}
                        >
                           <opt.icon size={20} className={visibility === opt.id ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'} />
                           <div className="font-semibold text-sm">{opt.label}</div>
                           <div className="text-[10px] opacity-70 text-center">{opt.desc}</div>
                           {visibility === opt.id && (
                              <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                                 <CheckCircle size={14} />
                              </div>
                           )}
                        </button>
                     ))}
                  </div>
               </div>

               {/* Share with specific users */}
               <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                     <UserPlus size={14} /> Invite People
                  </label>
                  
                  <form onSubmit={handleAddUser} className="flex gap-2 relative">
                     <input
                        type="email"
                        required
                        disabled={!isEditing}
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                        placeholder="Enter email address..."
                        className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
                     />
                     <button
                        type="submit"
                        disabled={!shareEmail || !isEditing}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 outline-none focus:ring-2 focus:ring-emerald-500/50 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-transparent"
                     >
                        Invite
                     </button>
                  </form>

                  {/* Shared Users List */}
                  {sharedUsers.length > 0 && (
                     <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl max-h-48 overflow-y-auto custom-scrollbar p-2 mt-4">
                        <div className="space-y-1">
                           {sharedUsers.map((email) => (
                              <div key={email} className="flex items-center justify-between p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all group">
                                 <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs uppercase shrink-0 border border-emerald-200 dark:border-emerald-800/50">
                                       {email.charAt(0)}
                                    </div>
                                    <div className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                                       {email}
                                    </div>
                                 </div>
                                 {isEditing && (
                                     <button
                                        onClick={() => handleRemoveUser(email)}
                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100 border border-transparent"
                                        title="Remove User"
                                     >
                                        <X size={14} />
                                     </button>
                                 )}
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>

            </div>
         </div>
      </div>
   );

   return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
