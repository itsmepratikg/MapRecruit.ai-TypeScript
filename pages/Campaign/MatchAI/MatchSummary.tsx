
import React from 'react';
import { Sparkles, Brain, CheckCircle, XCircle } from '../../../components/Icons';

export const MatchSummary = ({ candidate }: any) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={100} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Brain size={18} className="text-indigo-600 dark:text-indigo-400" /> Match Intelligence
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
            {candidate.aiSummary}
        </p>
        
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Skills Match</h4>
                <div className="flex flex-wrap gap-2">
                    {candidate.skills.matched.map((skill: string) => (
                        <span key={skill} className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 rounded-md text-xs font-medium flex items-center gap-1">
                            <CheckCircle size={12} /> {skill}
                        </span>
                    ))}
                </div>
            </div>
            <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Missing / Gaps</h4>
                {candidate.skills.missing.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {candidate.skills.missing.map((skill: string) => (
                            <span key={skill} className="px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800 rounded-md text-xs font-medium flex items-center gap-1">
                                <XCircle size={12} /> {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-xs text-slate-400 italic">No significant skill gaps identified.</span>
                )}
            </div>
        </div>
    </div>
);
