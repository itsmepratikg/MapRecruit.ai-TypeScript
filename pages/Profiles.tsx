

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
   FolderOpen, Tag as TagIcon, Search, FolderPlus, Users,
   BarChart2, ArrowUpRight, TrendingUp, MoreHorizontal, ChevronRight,
   ChevronLeft, Calendar, UserCheck, Briefcase, FileText, UserPlus,
   Mail, MessageSquare, Link, Sparkles, CheckSquare, Square, X, Filter,
   Share2, Send
} from '../components/Icons';
import { SearchState, Campaign } from '../types';
import { EmptyView } from '../components/Common';
import { TalentSearchEngine } from '../components/TalentSearchEngine';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GLOBAL_CAMPAIGNS } from '../data';
import { useToast } from '../components/Toast';
import { profileService } from '../services/api';
import { useEffect } from 'react';

// --- MOCK DATA FOR FOLDERS ---

const FOLDER_STATS = [
   { name: 'Pending Applicant', value: 450, color: '#eab308' }, // Yellow
   { name: 'Applicant', value: 320, color: '#3b82f6' }, // Blue
   { name: 'Contractor', value: 85, color: '#8b5cf6' }, // Purple
   { name: 'Direct Hire', value: 45, color: '#10b981' }  // Green
];

const TREND_DATA = [
   { name: 'Jan', added: 40, active: 24 },
   { name: 'Feb', added: 30, active: 13 },
   { name: 'Mar', added: 20, active: 58 },
   { name: 'Apr', added: 27, active: 39 },
   { name: 'May', added: 18, active: 48 },
   { name: 'Jun', added: 23, active: 38 },
];

// --- SUB-COMPONENTS ---

const ActionModal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children?: React.ReactNode }) => {
   if (!isOpen) return null;
   return (
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
         <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
               <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
               <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  <X size={20} />
               </button>
            </div>
            <div className="p-6">
               {children}
            </div>
         </div>
      </div>
   );
};

const FolderDetailView = ({ folder, onBack }: { folder: any, onBack: () => void }) => {
   const { addToast } = useToast();
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
   const [profiles, setProfiles] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

   // Modal States
   const [actionType, setActionType] = useState<'COMM' | 'LINK' | 'ATTACH_CAMPAIGN' | 'TAG' | 'REFERRAL' | null>(null);
   const [activeCommTab, setActiveCommTab] = useState<'EMAIL' | 'SMS'>('EMAIL');

   useEffect(() => {
      fetchProfiles();
   }, [folder.id, pagination.page, searchQuery]);

   const fetchProfiles = async () => {
      setLoading(true);
      try {
         const params: any = {
            folderId: folder._id,
            page: pagination.page,
            limit: 20
         };
         if (searchQuery) params.search = searchQuery;

         const data = await profileService.getAll(params);
         setProfiles(data.profiles);
         setPagination(prev => ({ ...prev, pages: data.pages, total: data.total }));
      } catch (error) {
         addToast("Failed to fetch profiles", "error");
      } finally {
         setLoading(false);
      }
   };

   const toggleSelection = (id: string) => {
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedIds(newSet);
   };

   const toggleSelectAll = () => {
      if (selectedIds.size === profiles.length) {
         setSelectedIds(new Set());
      } else {
         setSelectedIds(new Set(profiles.map(p => p._id)));
      }
   };

   const handleAction = (type: string) => {
      // Placeholder actions
      if (type === 'TAG' || type === 'REFERRAL') {
         addToast("This feature will be available in the next update.", "info");
         return;
      }
      // @ts-ignore
      setActionType(type);
   };

   const executeAction = () => {
      addToast("Action completed successfully!", "success");
      setActionType(null);
      setSelectedIds(new Set());
   };

   return (
      <div className="h-full flex flex-col bg-white dark:bg-slate-900">

         {/* MODALS */}
         <ActionModal isOpen={actionType === 'ATTACH_CAMPAIGN'} onClose={() => setActionType(null)} title="Attach to Campaign">
            <div className="space-y-4">
               <p className="text-sm text-slate-600 dark:text-slate-300">
                  Attaching <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedIds.size}</span> profiles to:
               </p>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Select Campaign</label>
                  <select className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm outline-none focus:border-emerald-500 dark:text-slate-200">
                     <option>Select a campaign...</option>
                     {GLOBAL_CAMPAIGNS.filter(c => c.status === 'Active').map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.jobID})</option>
                     ))}
                  </select>
               </div>
               <div className="pt-4 flex justify-end gap-3">
                  <button onClick={() => setActionType(null)} className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-300">Cancel</button>
                  <button onClick={executeAction} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm">Attach</button>
               </div>
            </div>
         </ActionModal>

         <ActionModal isOpen={actionType === 'LINK'} onClose={() => setActionType(null)} title="Link to Folder">
            <div className="space-y-4">
               <p className="text-sm text-slate-600 dark:text-slate-300">
                  Link <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedIds.size}</span> profiles to another folder:
               </p>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Target Folder</label>
                  <select className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm outline-none focus:border-emerald-500 dark:text-slate-200">
                     <option>Select a folder...</option>
                     {FOLDERS_LIST.filter(f => f.id !== folder.id).map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                     ))}
                  </select>
               </div>
               <div className="pt-4 flex justify-end gap-3">
                  <button onClick={() => setActionType(null)} className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-300">Cancel</button>
                  <button onClick={executeAction} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm">Link Profiles</button>
               </div>
            </div>
         </ActionModal>

         <ActionModal isOpen={actionType === 'COMM'} onClose={() => setActionType(null)} title="Send Communication">
            <div className="space-y-4">
               <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg w-fit">
                  <button
                     onClick={() => setActiveCommTab('EMAIL')}
                     className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeCommTab === 'EMAIL' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                  >
                     Email
                  </button>
                  <button
                     onClick={() => setActiveCommTab('SMS')}
                     className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeCommTab === 'SMS' ? 'bg-white dark:bg-slate-600 shadow-sm text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                  >
                     SMS
                  </button>
               </div>

               <p className="text-sm text-slate-600 dark:text-slate-300">
                  Sending to <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedIds.size}</span> recipients.
               </p>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                     {activeCommTab === 'EMAIL' ? 'Subject' : 'Message Body'}
                  </label>
                  {activeCommTab === 'EMAIL' && (
                     <input type="text" placeholder="Enter email subject..." className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm outline-none focus:border-blue-500 dark:text-slate-200 mb-2" />
                  )}
                  <textarea
                     className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm outline-none focus:border-blue-500 resize-none h-32 dark:text-slate-200"
                     placeholder={activeCommTab === 'EMAIL' ? "Compose your email..." : "Type your SMS message..."}
                  ></textarea>
               </div>

               <div className="pt-4 flex justify-end gap-3">
                  <button onClick={() => setActionType(null)} className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-300">Cancel</button>
                  <button onClick={executeAction} className={`px-4 py-2 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 ${activeCommTab === 'EMAIL' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'}`}>
                     <Send size={14} /> Send {activeCommTab}
                  </button>
               </div>
            </div>
         </ActionModal>

         {/* HEADER */}
         <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 sticky top-0 z-20">
            <div className="flex items-center gap-3">
               <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                  <ChevronLeft size={20} />
               </button>
               <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                     <FolderOpen size={20} className="text-emerald-600 dark:text-emerald-400" />
                     {folder.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                     <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">{folder.type || 'Custom'}</span>
                     <span>•</span>
                     <span>{pagination.total} Profiles</span>
                  </p>
               </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
               {/* Folder Actions */}
               <button
                  onClick={() => { setSelectedIds(new Set(profiles.map(p => p._id))); setActionType('ATTACH_CAMPAIGN'); }}
                  className="flex-1 md:flex-none px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
               >
                  <Briefcase size={16} /> Attach Folder to Campaign
               </button>
               <button className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2">
                  <UserPlus size={16} /> Add Profile
               </button>
            </div>
         </div>

         {/* SEARCH & FILTER BAR */}
         <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full group">
               <Sparkles size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 transition-colors group-focus-within:text-emerald-600" />
               <input
                  type="text"
                  placeholder="Search profiles in this folder..."
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all dark:text-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
            <div className="flex items-center gap-2">
               <button className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors" title="Filters">
                  <Filter size={16} />
               </button>
            </div>
         </div>

         {/* ACTION BAR (Visible on Selection) */}
         {selectedIds.size > 0 && (
            <div className="px-6 py-2 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800 flex flex-col sm:flex-row justify-between items-center gap-3 animate-in slide-in-from-top-1">
               <div className="flex items-center gap-2 text-sm text-indigo-900 dark:text-indigo-200">
                  <span className="font-bold bg-indigo-200 dark:bg-indigo-800 px-2 py-0.5 rounded-full text-xs">{selectedIds.size}</span>
                  <span>Selected</span>
                  <button onClick={() => setSelectedIds(new Set())} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline ml-2">Clear</button>
               </div>
               <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                  <button onClick={() => handleAction('ATTACH_CAMPAIGN')} className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 flex items-center gap-1 whitespace-nowrap transition-colors">
                     <Briefcase size={14} /> Attach to Campaign
                  </button>
                  <div className="h-4 w-px bg-indigo-200 dark:bg-indigo-800 mx-1"></div>
                  <button onClick={() => handleAction('COMM')} className="px-3 py-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-xs font-medium text-indigo-700 dark:text-indigo-300 flex items-center gap-1 whitespace-nowrap transition-colors">
                     <Mail size={14} /> Communication
                  </button>
                  <button onClick={() => handleAction('LINK')} className="px-3 py-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-xs font-medium text-indigo-700 dark:text-indigo-300 flex items-center gap-1 whitespace-nowrap transition-colors">
                     <Link size={14} /> Link Folder
                  </button>
                  <button onClick={() => handleAction('TAG')} className="px-3 py-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-xs font-medium text-indigo-700 dark:text-indigo-300 flex items-center gap-1 whitespace-nowrap transition-colors">
                     <TagIcon size={14} /> Tag
                  </button>
                  <button onClick={() => handleAction('REFERRAL')} className="px-3 py-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-xs font-medium text-indigo-700 dark:text-indigo-300 flex items-center gap-1 whitespace-nowrap transition-colors">
                     <Share2 size={14} /> Referral
                  </button>
               </div>
            </div>
         )}

         {/* TABLE */}
         <div className="flex-1 overflow-auto bg-slate-50/50 dark:bg-slate-900/50 p-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-medium">
                     <tr>
                        <th className="px-4 py-3 w-12 text-center">
                           <button onClick={toggleSelectAll} className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                              {selectedIds.size === profiles.length && profiles.length > 0 ? <CheckSquare size={18} className="text-emerald-600 dark:text-emerald-400" /> : <Square size={18} />}
                           </button>
                        </th>
                        <th className="px-4 py-3">Candidate</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Availability</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                     {profiles.map((p) => {
                        const isSelected = selectedIds.has(p._id);
                        const profile = p.profile || {};
                        return (
                           <tr key={p._id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group ${isSelected ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                              <td className="px-4 py-3 text-center">
                                 <button onClick={() => toggleSelection(p._id)} className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                                    {isSelected ? <CheckSquare size={18} className="text-emerald-600 dark:text-emerald-400" /> : <Square size={18} />}
                                 </button>
                              </td>
                              <td className="px-4 py-3">
                                 <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300`}>
                                       {profile.fullName?.charAt(0) || '?'}
                                    </div>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{profile.fullName}</span>
                                 </div>
                              </td>
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{p.professionalSummary?.currentRole?.jobTitle || 'N/A'}</td>
                              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{p.availability}</td>
                              <td className="px-4 py-3 text-right">
                                 <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                    <MoreHorizontal size={16} />
                                 </button>
                              </td>
                           </tr>
                        );
                     })}
                     {profiles.length === 0 && !loading && (
                        <tr>
                           <td colSpan={6} className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center gap-2">
                                 <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                                    <Search size={24} />
                                 </div>
                                 <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No profiles found</p>
                                 <p className="text-xs text-slate-400">Try adjusting your search query.</p>
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

const FolderMetricsView = () => {
   const [selectedFolder, setSelectedFolder] = useState<any | null>(null);
   const [folders, setFolders] = useState<any[]>([]);
   const [metrics, setMetrics] = useState<any[]>([]);
   const [stats, setStats] = useState({ total: 0 });
   const [loading, setLoading] = useState(true);
   const { addToast } = useToast();

   useEffect(() => {
      fetchData();
   }, []);

   const fetchData = async () => {
      setLoading(true);
      try {
         const [folderData, metricsData, statsData] = await Promise.all([
            profileService.getArticles(), // articles -> folders
            profileService.getFolderMetrics(),
            profileService.getStats()
         ]);
         setFolders(folderData);
         setMetrics(metricsData);
         setStats({ total: statsData.totalProfiles });
      } catch (error) {
         addToast("Failed to load folder data", "error");
      } finally {
         setLoading(false);
      }
   };

   // Drill-down View
   if (selectedFolder) {
      return <FolderDetailView folder={selectedFolder} onBack={() => setSelectedFolder(null)} />;
   }

   // Main Dashboard View
   return (
      <div className="h-full flex flex-col overflow-y-auto p-6 lg:p-8 bg-white dark:bg-slate-900 transition-colors">

         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
               <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                  <FolderOpen size={24} className="text-emerald-600 dark:text-emerald-400" />
                  Folder Metrics
               </h2>
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Analyze candidate distribution and activity across your talent pools.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm transition-colors text-sm">
               <FolderPlus size={16} /> Create Folder
            </button>
         </div>

         {/* Metrics Row */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* Total Stats Card */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Profiles</p>
                     <h3 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">{stats.total}</h3>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-sm">
                     <Users size={24} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
               </div>

               <div className="mt-6 space-y-3">
                  {metrics.map((stat) => (
                     <div key={stat.name} className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                           <span className="text-slate-600 dark:text-slate-300 font-medium">{stat.name}</span>
                           <span className="text-slate-500 dark:text-slate-400 font-mono">{stat.value}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                           <div className="h-full rounded-full" style={{ width: `${(stat.value / (stats.total || 1)) * 100}%`, backgroundColor: stat.color }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Trends Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                     <TrendingUp size={16} className="text-blue-500" /> Profile Trends (All Folders)
                  </h3>
                  <select className="text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-2 py-1 text-slate-600 dark:text-slate-300 outline-none">
                     <option>Last 6 Months</option>
                  </select>
               </div>
               <div className="flex-1 min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={TREND_DATA} barGap={0} barSize={20}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                        <Tooltip
                           cursor={{ fill: 'transparent' }}
                           contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar dataKey="added" name="Profiles Added" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="active" name="Active Engagement" fill="#6366f1" radius={[4, 4, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>

         {/* Data Table */}
         <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
               <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Folder Details</h3>
               <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                     type="text"
                     placeholder="Search folders..."
                     className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-200 w-64"
                  />
               </div>
            </div>

            <div className="overflow-x-auto flex-1">
               <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                     <tr>
                        <th className="px-6 py-3 min-w-[200px]">Folder Name</th>
                        <th className="px-6 py-3 text-center">Total Profiles</th>
                        <th className="px-6 py-3"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                     {folders.map((folder) => (
                        <tr key={folder._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                           <td className="px-6 py-3">
                              <button
                                 onClick={() => setSelectedFolder(folder)}
                                 className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-2"
                              >
                                 <FolderOpen size={16} /> {folder.name}
                              </button>
                           </td>
                           <td className="px-6 py-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">{folder.count}</td>
                           <td className="px-6 py-3 text-right">
                              <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                 <MoreHorizontal size={16} />
                              </button>
                           </td>
                        </tr>
                     ))}
                     {folders.length === 0 && !loading && (
                        <tr>
                           <td colSpan={3} className="px-6 py-12 text-center text-slate-500">No folders (articles) found.</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};

const TagsView = () => {
   const [tags, setTags] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const { addToast } = useToast();

   useEffect(() => {
      fetchTags();
   }, []);

   const fetchTags = async () => {
      try {
         const data = await profileService.getTags();
         setTags(data);
      } catch (error) {
         addToast("Failed to fetch tags", "error");
      } finally {
         setLoading(false);
      }
   };

   if (loading) return <div className="p-8 text-center text-slate-500">Loading tags...</div>;

   if (tags.length === 0) {
      return (
         <EmptyView
            title="Tags Management"
            message="No tags found. Start tagging profiles to see them here."
            icon={TagIcon}
         />
      );
   }

   return (
      <div className="p-8">
         <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3 mb-6">
            <TagIcon size={24} className="text-indigo-600 dark:text-indigo-400" />
            Tags Management
         </h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tags.map(tag => (
               <div key={tag._id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }}></div>
                     <span className="font-bold text-slate-800 dark:text-slate-100">{tag.name}</span>
                  </div>
                  <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                     {tag.count}
                  </span>
               </div>
            ))}
         </div>
      </div>
   );
};

export const Profiles = ({ onNavigateToProfile, view }: { onNavigateToProfile: () => void, view: 'SEARCH' | 'FOLDERS' | 'TAGS' }) => {
   const [searchParams] = useSearchParams();
   const hasRid = searchParams.get('rid');

   const [searchState, setSearchState] = useState<SearchState>({
      view: hasRid ? 'results' : 'initial',
      inputValue: '',
      activeFilters: [],
      searchKeywords: [],
      advancedParams: {},
      chatMessages: []
   });

   return (
      <div className="flex-1 overflow-hidden h-full flex flex-col">
         {view === 'SEARCH' && <TalentSearchEngine searchState={searchState} setSearchState={setSearchState} onNavigateToProfile={onNavigateToProfile} />}
         {view === 'FOLDERS' && <FolderMetricsView />}
         {view === 'TAGS' && <TagsView />}
      </div>
   );
};