
import React from 'react';
import { History, Link, Upload } from '../../../components/Icons';
import { CAMPAIGN_ACTIVITIES } from '../../../data';

export const ActivityLog = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-full overflow-hidden flex flex-col">
    <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <History size={18} className="text-blue-500"/> Recent Activity
        </h3>
        <div className="flex gap-2">
            <button className="text-xs text-slate-500 hover:text-blue-600 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2 py-1 rounded">Filter</button>
            <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Export</button>
        </div>
    </div>
    <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {CAMPAIGN_ACTIVITIES.map((group) => (
            <div key={group.id} className="relative pl-6 border-l border-slate-200 dark:border-slate-700">
                <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-900"></div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    {group.date}
                </h4>
                <div className="space-y-4">
                    {group.items.map((item) => (
                        <div key={item.id} className="flex gap-4 group p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                            <div className="mt-1 p-2 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors shadow-sm text-slate-500">
                                {item.type === 'link' ? <Link size={14} className="text-blue-500" /> : <Upload size={14} className="text-green-500" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">{item.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                                    <span className="font-semibold text-slate-600 dark:text-slate-300">{item.subtitle}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                    <span>by <span className="font-medium text-slate-700 dark:text-slate-300">{item.author}</span></span>
                                </p>
                            </div>
                            <span className="text-xs text-slate-400 font-mono whitespace-nowrap">{item.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
  </div>
);
