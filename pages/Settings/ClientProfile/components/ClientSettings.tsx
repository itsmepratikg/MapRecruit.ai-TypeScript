
import React, { useState } from 'react';
import { ClientData } from '../../../../Schema/ClientSchema';
import { useTranslation } from 'react-i18next';
import { Save, ChevronDown, Check, AlertCircle } from '../../../../components/Icons';
import { useToast } from '../../../../components/Toast';

interface ClientSettingsProps {
    client: ClientData;
}

export const ClientSettings = ({ client }: ClientSettingsProps) => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [editMode, setEditMode] = useState(false);

    // Weights State
    const [weights, setWeights] = useState({
        candidateJobTitle: 25,
        skills: 25,
        jobDescription: 25,
        location: 25,
        minSkills: 3,
        salary: 0,
        experience: 0
    });

    const totalWeight = Object.entries(weights)
        .filter(([key]) => key !== 'minSkills')
        .reduce((sum, [, value]) => sum + value, 0);

    const isTotalValid = totalWeight === 100;

    const handleWeightChange = (key: keyof typeof weights, value: string) => {
        const numValue = parseInt(value) || 0;
        setWeights(prev => ({ ...prev, [key]: numValue }));
    };

    // Placeholder Schedule Data
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [schedule, setSchedule] = useState<Record<string, { start: string, end: string, active: boolean }>>({
        'Monday': { start: '10:00', end: '22:00', active: true },
        'Tuesday': { start: '09:30', end: '21:00', active: true },
        'Wednesday': { start: '10:00', end: '22:00', active: true },
        'Thursday': { start: '10:13', end: '20:13', active: true },
        'Friday': { start: '09:00', end: '19:00', active: true },
        'Saturday': { start: '', end: '', active: false },
        'Sunday': { start: '', end: '', active: false },
    });

    const handleSave = () => {
        if (!isTotalValid) {
            addToast(t("Total JD Completeness weightage must equal 100%"), 'error');
            return;
        }
        setEditMode(false);
        addToast(t("Configuration saved successfully"), 'success');
    };

    const SectionHeader = ({ title, desc }: { title: string, desc?: string }) => (
        <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
            {desc && <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>}
        </div>
    );

    const Toggle = ({ label, active }: { label: string, active: boolean }) => (
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
            <div className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${active ? 'left-6' : 'left-1'}`}></div>
            </div>
        </div>
    );

    const Select = ({ label, options, value }: any) => (
        <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>
            <div className="relative">
                <select
                    disabled={!editMode}
                    className="w-full pl-3 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-70"
                    defaultValue={value}
                >
                    {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
            </div>
        </div>
    );

    const WeightInput = ({ label, value, onChange, isCount = false }: { label: string, value: number, onChange: (val: string) => void, isCount?: boolean }) => (
        <div className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 -mx-2 rounded-lg transition-colors">
            <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    disabled={!editMode}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-20 text-right px-2 py-1 text-sm border rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 disabled:bg-transparent transition-all ${!isCount && !isTotalValid && editMode ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 dark:border-slate-600 focus:ring-emerald-500/20 focus:border-emerald-500'}`}
                    value={value}
                />
                <span className="text-slate-400 text-xs w-4">{isCount ? '' : '%'}</span>
            </div>
        </div>
    );

    return (
        <div className="p-8 lg:p-12 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t("Client Configuration")}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t("Advanced settings for campaigns, job candidates, and operations.")}</p>
                </div>
                <button
                    onClick={() => editMode ? handleSave() : setEditMode(true)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2 ${editMode ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                    {editMode ? <Save size={16} /> : null}
                    {editMode ? t("Save Configuration") : t("Edit Configuration")}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                    {/* Profile Search Settings */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                        <SectionHeader title={t("Profile Search Settings")} />
                        <Select label="Search Access Level" options={['Company', 'Client']} value="Company" />
                    </div>

                    {/* Campaign Settings */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                        <SectionHeader title={t("Campaign Settings")} desc={t("Default sharing options for new campaigns.")} />
                        <div className="space-y-4">
                            <Select label="Share Campaign Recruiters" options={['All', 'Few', 'Self']} value="All" />
                            <Select label="Share Campaign Hiring Managers" options={['All', 'Few', 'Self']} value="All" />
                        </div>
                    </div>

                    {/* Job Seeker Page Settings */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                        <SectionHeader title={t("Job Seeker Settings")} />
                        <div className="space-y-3">
                            <Toggle label={t("Skip OTP Verification")} active={false} />
                            <Toggle label={t("Remove Refer Friend")} active={false} />
                            <Toggle label={t("Registration Confirmation Email")} active={true} />
                            <Toggle label={t("Client Active Status")} active={client.status === 'Active'} />
                        </div>
                    </div>

                    {/* Defaults */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                        <SectionHeader title={t("Defaults")} />
                        <div className="space-y-4">
                            <Select label="Candidate Type" options={['Type A', 'Type B', 'Standard']} value="Standard" />
                            <Select label="Candidate Source" options={['LinkedIn', 'Manual', 'Web']} value="Web" />
                            {client.clientType === 'Vendor' && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Show Jobs After (Hours)</label>
                                    <input type="number" disabled={!editMode} defaultValue={48} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* JD Completeness */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t("JD Completeness Criteria")}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{t("Weights for calculating job description completeness score.")}</p>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${isTotalValid
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 animate-pulse'}`}>
                                Total: {totalWeight}%
                            </div>
                        </div>

                        <div className="space-y-1">
                            <WeightInput label="Candidate Job Title" value={weights.candidateJobTitle} onChange={(v) => handleWeightChange('candidateJobTitle', v)} />
                            <WeightInput label="Skills" value={weights.skills} onChange={(v) => handleWeightChange('skills', v)} />
                            <WeightInput label="Job Description" value={weights.jobDescription} onChange={(v) => handleWeightChange('jobDescription', v)} />
                            <WeightInput label="Location" value={weights.location} onChange={(v) => handleWeightChange('location', v)} />
                            <hr className="my-2 border-slate-100 dark:border-slate-700" />
                            <WeightInput label="Salary" value={weights.salary} onChange={(v) => handleWeightChange('salary', v)} />
                            <WeightInput label="Years of Experience" value={weights.experience} onChange={(v) => handleWeightChange('experience', v)} />
                            <hr className="my-2 border-slate-100 dark:border-slate-700" />
                            <WeightInput label="Minimum Skills Required" value={weights.minSkills} onChange={(v) => handleWeightChange('minSkills', v)} isCount={true} />
                        </div>

                        {!isTotalValid && (
                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-xs flex gap-2 items-start border border-red-100 dark:border-red-800/50">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold">{t("Invalid Configuration")}</p>
                                    <p>{t("Total weightage must equal exactly 100%.")}</p>
                                </div>
                            </div>
                        )}
                        {isTotalValid && (
                            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs flex gap-2 items-center border border-blue-100 dark:border-blue-800/50">
                                <Check size={16} className="shrink-0" />
                                {t("Total weightage is correctly set to 100% (excluding min skills count).")}
                            </div>
                        )}
                    </div>

                    {/* Weekly Hours */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                        <SectionHeader title={t("Weekly Schedule")} desc={t("Define working hours for automatic communication scheduling.")} />
                        <div className="space-y-3">
                            {weekDays.map(day => (
                                <div key={day} className="flex items-center justify-between text-sm py-1">
                                    <span className={`w-24 font-medium ${schedule[day].active ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 line-through'}`}>{day}</span>
                                    {schedule[day].active ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs">{schedule[day].start}</span>
                                            <span className="text-slate-400">-</span>
                                            <span className="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs">{schedule[day].end}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">No Timings</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
