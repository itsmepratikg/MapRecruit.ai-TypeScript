import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Plus, Trash2, ArrowRight, SkipForward, Sparkles, Video, ClipboardList, Bell } from 'lucide-react';
import { ScreeningRound } from '../../../types/Round';

interface EngageAIConfigStepProps {
    onBack: () => void;
    onContinue: (rounds: ScreeningRound[]) => void;
    onSkip: () => void;
    onSkipAll: () => void;
}

export const EngageAIConfigStep: React.FC<EngageAIConfigStepProps> = ({ onBack, onContinue, onSkip, onSkipAll }) => {
    const { t } = useTranslation();
    const [rounds, setRounds] = useState<ScreeningRound[]>([]);

    const roundTypes = [
        { id: 'Announcement', icon: Bell, title: 'Announcement', color: 'text-emerald-600 bg-emerald-50' },
        { id: 'Assessment', icon: ClipboardList, title: 'Assessment', color: 'text-emerald-600 bg-emerald-50' },
        { id: 'Interview', icon: Video, title: 'Interview', color: 'text-violet-600 bg-violet-50' },
        { id: 'Survey', icon: MessageSquare, title: 'Survey', color: 'text-amber-600 bg-amber-50' },
    ];

    const addRound = (type: string) => {
        const newRound: ScreeningRound = {
            roundName: `${type} Round ${rounds.length + 1}`,
            roundType: type,
            order: rounds.length
        };
        setRounds([...rounds, newRound]);
    };

    const removeRound = (index: number) => {
        setRounds(rounds.filter((_, i) => i !== index));
    };

    return (
        <div className="h-full flex flex-col p-6 space-y-8 animate-in fade-in duration-500 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full space-y-8 pb-10">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {roundTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => addRound(type.id)}
                            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 hover:shadow-md transition-all group text-left"
                        >
                            <div className={`p-2 rounded-lg w-fit mb-3 ${type.color} dark:bg-opacity-10 group-hover:scale-110 transition-transform`}>
                                <type.icon size={20} />
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{type.title}</h4>
                            <p className="text-[10px] text-slate-500 mt-1 lines-clamp-2">Add a new {type.id.toLowerCase()} round.</p>
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        Campaign Pipeline ({rounds.length})
                        {rounds.length === 0 && <span className="text-xs font-normal text-slate-400">(No rounds added yet)</span>}
                    </h3>

                    <div className="space-y-3">
                        {rounds.map((round, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm animate-in zoom-in-95 duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-slate-100">{round.roundName}</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-2">
                                            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 uppercase tracking-wider font-semibold text-[9px]">
                                                {round.roundType}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeRound(index)}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
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
                            onClick={() => onContinue(rounds)}
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
