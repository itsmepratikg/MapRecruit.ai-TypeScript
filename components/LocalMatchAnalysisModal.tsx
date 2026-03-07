
import React from 'react';
import { X, Brain, CheckCircle, XCircle, Sparkles, Zap, Clock } from 'lucide-react';
import { SkillMatchCategory } from '../utils/mongoUtils';

interface LocalMatchAnalysisModalProps {
    analysis: any;
    onClose: () => void;
}

const SkillTag = ({ skill, category }: { skill: string, category: SkillMatchCategory }) => {
    let styles = "bg-slate-50 text-slate-700 border-slate-100";
    let Icon = CheckCircle;

    switch (category) {
        case SkillMatchCategory.EXACT_MATCH:
            styles = "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800";
            Icon = CheckCircle;
            break;
        case SkillMatchCategory.EXACT_MATCH_NOT_RECENT:
            styles = "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800";
            Icon = Clock;
            break;
        case SkillMatchCategory.SIMILAR_SKILL:
            styles = "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800";
            Icon = Zap;
            break;
        case SkillMatchCategory.NOT_MENTIONED:
            styles = "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800";
            Icon = XCircle;
            break;
    }

    return (
        <span className={`px-2.5 py-1 ${styles} border rounded-md text-xs font-medium flex items-center gap-1`}>
            <Icon size={12} /> {skill}
        </span>
    );
};

export const LocalMatchAnalysisModal = ({ analysis, onClose }: LocalMatchAnalysisModalProps) => {
    if (!analysis) return null;

    const { skills, aiSummary, name } = analysis;

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden relative border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center">
                            <Brain className="text-indigo-600 dark:text-indigo-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Match Analysis</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{name}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    {/* Match Intelligence Summary */}
                    <div className="relative mb-8 p-6 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-900/10 dark:to-slate-900 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Sparkles size={120} className="text-indigo-600 dark:text-indigo-400" />
                        </div>

                        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                            Match Intelligence
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                            {aiSummary || "No AI summary available for this match."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Matched Skills */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                                    <CheckCircle size={18} className="text-emerald-500" /> Matched Skills
                                </h4>
                            </div>

                            {/* Required */}
                            <div>
                                <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Required Criteria</h5>
                                <div className="flex flex-wrap gap-2">
                                    {skills?.matched?.required?.length > 0 ? skills.matched.required.map((skill: any, idx: number) => (
                                        <SkillTag key={`matched-req-${idx}`} skill={skill.text} category={skill.category} />
                                    )) : <span className="text-xs text-slate-400 italic">No required skills matched.</span>}
                                </div>
                            </div>

                            {/* Preferred */}
                            <div>
                                <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Preferred Criteria</h5>
                                <div className="flex flex-wrap gap-2">
                                    {skills?.matched?.preferred?.length > 0 ? skills.matched.preferred.map((skill: any, idx: number) => (
                                        <SkillTag key={`matched-pref-${idx}`} skill={skill.text} category={skill.category} />
                                    )) : <span className="text-xs text-slate-400 italic">No preferred skills matched.</span>}
                                </div>
                            </div>
                        </div>

                        {/* Missing Gaps */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                                    <XCircle size={18} className="text-red-500" /> Missing Gaps
                                </h4>
                            </div>

                            {/* Required */}
                            <div>
                                <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Required Criteria</h5>
                                <div className="flex flex-wrap gap-2">
                                    {skills?.missing?.required?.length > 0 ? skills.missing.required.map((skill: string, idx: number) => (
                                        <span key={`missing-req-${idx}`} className="px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800 rounded-md text-xs font-medium flex items-center gap-1">
                                            <XCircle size={12} /> {skill}
                                        </span>
                                    )) : <span className="text-xs text-slate-400 italic">No required skills missing.</span>}
                                </div>
                            </div>

                            {/* Preferred */}
                            <div>
                                <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Preferred Criteria</h5>
                                <div className="flex flex-wrap gap-2">
                                    {skills?.missing?.preferred?.length > 0 ? skills.missing.preferred.map((skill: string, idx: number) => (
                                        <span key={`missing-pref-${idx}`} className="px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800 rounded-md text-xs font-medium flex items-center gap-1">
                                            <XCircle size={12} /> {skill}
                                        </span>
                                    )) : <span className="text-xs text-slate-400 italic">No preferred skills missing.</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors shadow-lg shadow-slate-200 dark:shadow-none"
                    >
                        Close Analysis
                    </button>
                </div>
            </div>
        </div>
    );
};
