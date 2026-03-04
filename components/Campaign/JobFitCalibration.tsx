import React from 'react';
import { SlidersHorizontal, Info } from 'lucide-react';

interface JobFitConfig {
    answerContext: { enable: boolean, weightage: number };
    accentNeutrality: { enable: boolean, weightage: number };
    fluencyFillers: { enable: boolean, weightage: number };
    fluencyResponsiveness: { enable: boolean, weightage: number };
    spokenProficiency: { enable: boolean, weightage: number };
    pronunciation: { enable: boolean, weightage: number };
}

interface JobFitCalibrationProps {
    config: JobFitConfig;
    onChange: (newConfig: JobFitConfig) => void;
}

export const JobFitCalibration: React.FC<JobFitCalibrationProps> = ({ config, onChange }) => {

    // Helper to update a specific field
    const updateField = (key: keyof JobFitConfig, field: 'enable' | 'weightage', value: any) => {
        onChange({
            ...config,
            [key]: {
                ...config[key],
                [field]: value
            }
        });
    };

    const FIELDS: { key: keyof JobFitConfig, label: string, desc: string }[] = [
        { key: 'answerContext', label: 'Answer Context', desc: 'Relevance of the answer to the question.' },
        { key: 'spokenProficiency', label: 'Spoken Proficiency', desc: 'Grammar and vocabulary usage.' },
        { key: 'fluencyResponsiveness', label: 'Fluency & Responsiveness', desc: 'Speed and natural flow of speech.' },
        { key: 'pronunciation', label: 'Pronunciation', desc: 'Clarity of speech sounds.' },
        { key: 'accentNeutrality', label: 'Accent Neutrality', desc: 'How neutral the accent is.' },
        { key: 'fluencyFillers', label: 'Filler Words', desc: 'Use of "um", "ah", etc.' },
    ];

    const getImportanceLabel = (val: number) => {
        if (val === 0) return 'Ignored';
        if (val <= 3) return 'Low';
        if (val <= 7) return 'Medium';
        return 'High';
    };

    const getImportanceColor = (val: number) => {
        if (val === 0) return 'text-slate-400';
        if (val <= 3) return 'text-emerald-500';
        if (val <= 7) return 'text-amber-500';
        return 'text-red-500';
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                    <SlidersHorizontal size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">Job Fit Score Calibration</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Adjust the weightage of AI evaluation parameters.</p>
                </div>
            </div>

            <div className="space-y-6">
                {FIELDS.map(({ key, label, desc }) => (
                    <div key={key} className="group">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className={`font-semibold text-sm ${config[key].enable ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 line-through'}`}>
                                    {label}
                                </span>
                                <div className="group/tooltip relative">
                                    <Info size={14} className="text-slate-400 cursor-help" />
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                                        {desc}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-bold w-12 text-right ${!config[key].enable ? 'opacity-50' : getImportanceColor(config[key].weightage)}`}>
                                    {config[key].enable ? getImportanceLabel(config[key].weightage) : 'OFF'}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={config[key].enable}
                                        onChange={(e) => updateField(key, 'enable', e.target.checked)}
                                    />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>
                        </div>

                        <div className={`transition-all duration-300 ${config[key].enable ? 'opacity-100' : 'opacity-40 pointer-events-none blur-[1px]'}`}>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                step="1"
                                value={config[key].weightage}
                                onChange={(e) => updateField(key, 'weightage', parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-emerald-600"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                                <span>0 (Ignore)</span>
                                <span>5 (Balanced)</span>
                                <span>10 ( Critical)</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
