
import React from 'react';

export const AttachedPeople = () => (
  <div className="p-8 h-full overflow-y-auto bg-white dark:bg-slate-900">
    <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">Attached Profiles (4)</h3>
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Match Score</th>
            <th className="px-6 py-4">Date Added</th>
            <th className="px-6 py-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-900">
           <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
             <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">Deanthony Quarterman</td>
             <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium">Active</span></td>
             <td className="px-6 py-4"><span className="text-green-600 dark:text-green-400 font-bold">98%</span></td>
             <td className="px-6 py-4 text-slate-500 dark:text-slate-400">Dec 26, 2025</td>
             <td className="px-6 py-4"><button className="text-red-500 hover:underline text-xs">Remove</button></td>
           </tr>
           <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
             <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">Shantrice Little</td>
             <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded text-xs font-medium">Pending</span></td>
             <td className="px-6 py-4"><span className="text-green-600 dark:text-green-400 font-bold">92%</span></td>
             <td className="px-6 py-4 text-slate-500 dark:text-slate-400">Dec 25, 2025</td>
             <td className="px-6 py-4"><button className="text-red-500 hover:underline text-xs">Remove</button></td>
           </tr>
           <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
             <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">Marcus Johnson</td>
             <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs font-medium">Passive</span></td>
             <td className="px-6 py-4"><span className="text-emerald-600 dark:text-emerald-400 font-bold">88%</span></td>
             <td className="px-6 py-4 text-slate-500 dark:text-slate-400">Dec 24, 2025</td>
             <td className="px-6 py-4"><button className="text-red-500 hover:underline text-xs">Remove</button></td>
           </tr>
           <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
             <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">Sarah Connors</td>
             <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium">Active</span></td>
             <td className="px-6 py-4"><span className="text-emerald-600 dark:text-emerald-400 font-bold">85%</span></td>
             <td className="px-6 py-4 text-slate-500 dark:text-slate-400">Dec 23, 2025</td>
             <td className="px-6 py-4"><button className="text-red-500 hover:underline text-xs">Remove</button></td>
           </tr>
        </tbody>
      </table>
    </div>
  </div>
);
