import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, ArrowRight } from 'lucide-react';

interface GenerateJDButtonProps {
    onClick: () => void;
}

export const GenerateJDButton: React.FC<GenerateJDButtonProps> = ({ onClick }) => {
    const { t } = useTranslation();

    return (
        <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Sparkles size={20} className="fill-current" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{t("Provide basic info to generate JD")}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t("Use our advanced AI to craft the perfect job description")}</p>
                    </div>
                </div>

                <button
                    onClick={onClick}
                    className="px-4 py-2 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-medium text-sm rounded-lg shadow-sm border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 group-hover:translate-x-0.5"
                >
                    {t("Generate")} <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};
