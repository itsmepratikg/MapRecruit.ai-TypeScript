
import React from 'react';
import { CampaignSettings } from '../../../services/CampaignService';
import TeamSelector, { TeamsState } from './TeamSelector';
import JobBoardSelector from './JobBoardSelector';

interface CampaignSettingsStepProps {
    settings: CampaignSettings;
    onChange: (settings: CampaignSettings) => void;
    users: any[]; // Mock users
    currentUserID: string;
}

const CampaignSettingsStep: React.FC<CampaignSettingsStepProps> = ({ settings, onChange, users, currentUserID }) => {

    const updateSettings = (partial: Partial<CampaignSettings>) => {
        onChange({ ...settings, ...partial });
    };

    const handleModulesChange = (moduleKey: keyof typeof settings.campaignModules) => {
        updateSettings({
            campaignModules: {
                ...settings.campaignModules,
                [moduleKey]: !settings.campaignModules[moduleKey]
            }
        });
    };

    return (
        <div className="h-full space-y-8 animate-in slide-in-from-right-4 duration-300 overflow-y-auto custom-scrollbar p-1">
            {/* General Settings */}
            <section className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg border-b border-slate-100 dark:border-slate-800 pb-2">Campaign Settings</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Visibility */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Visibility</label>
                        <select
                            value={settings.visibility}
                            onChange={(e) => updateSettings({ visibility: e.target.value as any })}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                        >
                            <option value="All">All - Visible to everyone</option>
                            <option value="Few">Few - Restricted access</option>
                            <option value="None">None - Private</option>
                        </select>
                    </div>

                    {/* Open Job Toggle */}
                    <div className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                        <div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Open Job</span>
                            <span className="text-xs text-slate-500">Accepting applications immediately</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.openJob}
                                onChange={(e) => updateSettings({ openJob: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>
                </div>
            </section>

            {/* AI Modules */}
            <section className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg border-b border-slate-100 dark:border-slate-800 pb-2">AI Modules</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(settings.campaignModules).map(([key, enabled]) => (
                        <div key={key} className={`flex items-center justify-between p-4 border rounded-lg transition-all ${enabled ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'}`}>
                            <div>
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100 block capitalize">{key.replace('AI', ' AI')}</span>
                                <span className="text-xs text-slate-500">{enabled ? 'Enabled' : 'Disabled'}</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={enabled}
                                    onChange={() => handleModulesChange(key as any)}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </section>

            {/* Teams */}
            <section className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg border-b border-slate-100 dark:border-slate-800 pb-2">Team Members</h3>
                <TeamSelector
                    teams={settings.teams}
                    onChange={(teams) => updateSettings({ teams })}
                    users={users}
                    currentUserID={currentUserID}
                />
            </section>

            {/* Job Boards */}
            <section className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg border-b border-slate-100 dark:border-slate-800 pb-2">Job Boards</h3>
                <JobBoardSelector
                    selectedBoards={settings.jobPosting.jobBoards}
                    onChange={(boards) => updateSettings({
                        jobPosting: { ...settings.jobPosting, jobBoards: boards }
                    })}
                />
            </section>
        </div>
    );
};

export default CampaignSettingsStep;
