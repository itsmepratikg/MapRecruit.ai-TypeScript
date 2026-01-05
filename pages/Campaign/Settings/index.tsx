
import React from 'react';
import { Campaign } from '../../../types';
import { UserPlus, Trash2 } from '../../../components/Icons';

export const CampaignSettings = ({ campaign }: { campaign: Campaign }) => (
  <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Campaign Settings</h2>
    
    <div className="space-y-8 pb-10">
        {/* General Details */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2">General Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Campaign Name</label>
                    <input type="text" defaultValue={campaign.name} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Job Reference ID</label>
                    <input type="text" defaultValue={campaign.jobID} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
                    <select defaultValue={campaign.status} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option value="Active">Active</option>
                        <option value="Closed">Closed</option>
                        <option value="Archived">Archived</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location</label>
                    <input type="text" defaultValue={campaign.location || 'Remote'} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                <textarea className="w-full h-32 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"></textarea>
            </div>
        </div>

        {/* Panel Members Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Panel Members</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage access and roles for this campaign.</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
                    <UserPlus size={16} /> Add Member
                </button>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                        <tr>
                            <th className="px-4 py-3">Member</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Access Level</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {campaign.members && campaign.members.length > 0 ? campaign.members.map((member, idx) => (
                            <tr key={idx} className="hover:bg-white dark:hover:bg-slate-800 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${member.color || 'bg-slate-200 text-slate-600'}`}>
                                            {member.initials}
                                        </div>
                                        <span className="font-medium text-slate-700 dark:text-slate-200">{member.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">Recruiter</td>
                                <td className="px-4 py-3">
                                    <select className="bg-transparent border-none text-slate-600 dark:text-slate-300 focus:ring-0 cursor-pointer text-sm p-0">
                                        <option>Editor</option>
                                        <option>Viewer</option>
                                        <option>Admin</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="px-4 py-3 text-center text-slate-500">No members assigned.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
            <button className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors">Cancel</button>
            <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm transition-colors">Save Changes</button>
        </div>
    </div>
  </div>
);
