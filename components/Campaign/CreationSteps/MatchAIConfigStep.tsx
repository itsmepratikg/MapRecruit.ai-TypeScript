import React from 'react';
import { useTranslation } from 'react-i18next';
import { Target, SkipForward, ArrowRight } from 'lucide-react';

interface MatchAIConfigStepProps {
    onBack: () => void;
    onContinue: () => void;
    onSkip: () => void;
    onSkipAll: () => void;
}

export const MatchAIConfigStep: React.FC<MatchAIConfigStepProps> = ({ onBack, onContinue, onSkip, onSkipAll }) => {
    const { t } = useTranslation();

    return (
        <div className="h-full flex flex-col p-6 space-y-8 animate-in fade-in duration-500 overflow-y-auto">
            <div className="max-w-3xl mx-auto w-full space-y-8 pb-10">

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
                    <div className="space-y-6">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800">
                            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Ideal Candidate Profile</h4>
                            <p className="text-sm text-slate-500">The AI will automatically prioritize candidates with the skills and experience extracted from your JD. You can adjust weights here once the campaign is created.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
                                <h5 className="font-medium text-sm mb-1">Skill Matching</h5>
                                <p className="text-xs text-slate-400">Semantic analysis of skill depth and recency.</p>
                            </div>
                            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
                                <h5 className="font-medium text-sm mb-1">Experience Logic</h5>
                                <p className="text-xs text-slate-400">Weighting for industry-specific tenure.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={onBack}
                        className="text-slate-500 hover:text-slate-700 font-medium"
                    >
                        {t("Back")}
                    </button>
                    <div className="flex gap-4">
                        <button
                            onClick={onSkip}
                            className="flex items-center gap-2 px-4 py-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium border border-slate-200 dark:border-slate-800"
                        >
                            Skip Step
                        </button>
                        <button
                            onClick={onSkipAll}
                            className="flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium border border-slate-200 dark:border-slate-800"
                        >
                            <SkipForward size={18} />
                            Skip All
                        </button>
                        <button
                            onClick={onContinue}
                            className="flex items-center gap-2 px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all"
                        >
                            {t("Continue")}
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
