
import React from 'react';
import { MapPin } from '../../../components/Icons';
import { CANDIDATE } from '../../../data';

export const RecommendedProfiles = () => (
  <div className="p-8 h-full">
     <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Recommended Profiles</h2>
     <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
           <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
              <tr>
                 <th className="px-6 py-4">Candidate</th>
                 <th className="px-6 py-4">Current Role</th>
                 <th className="px-6 py-4">Match Reason</th>
                 <th className="px-6 py-4">Action</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                 <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">David Miller</td>
                 <td className="px-6 py-4 text-slate-500 dark:text-slate-400">Senior Warehouse Lead</td>
                 <td className="px-6 py-4 text-slate-500 dark:text-slate-400"><span className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs">Skills Match</span></td>
                 <td className="px-6 py-4"><button className="text-blue-600 dark:text-blue-400 hover:underline">View Profile</button></td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                 <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">Sarah Jenkins</td>
                 <td className="px-6 py-4 text-slate-500 dark:text-slate-400">Logistics Coordinator</td>
                 <td className="px-6 py-4 text-slate-500 dark:text-slate-400"><span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded text-xs">Experience Match</span></td>
                 <td className="px-6 py-4"><button className="text-blue-600 dark:text-blue-400 hover:underline">View Profile</button></td>
              </tr>
           </tbody>
        </table>
     </div>
  </div>
);
