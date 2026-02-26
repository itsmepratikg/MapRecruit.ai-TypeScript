import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Edit2, Check, X, FileText, Settings, Type, AlignLeft, Hash, Calendar, ToggleLeft, List } from '../../../../components/Icons';

export const CustomFieldsPanel = ({ clientId }: { clientId: string }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'campaigns' | 'resumes' | 'interviews'>('campaigns');

    // Mock Data for demonstration purposes based on layout_schema.json concepts
    const [fields, setFields] = useState([
        { id: '1', area: 'campaigns', name: 'Pipeline', type: 'Drop Down', options: ['Active', 'Pipeline', 'Pending Lead', 'Lost'], required: true },
        { id: '2', area: 'campaigns', name: 'Estimated End Date', type: 'Date', required: false },
        { id: '3', area: 'resumes', name: 'Expected Salary', type: 'Integer', required: true },
        { id: '4', area: 'resumes', name: 'Visa Status', type: 'Drop Down', options: ['US Citizen', 'Green Card', 'H1B', 'OPT', 'Other'], required: true },
        { id: '5', area: 'resumes', name: 'Background Checked', type: 'Boolean', required: false },
        { id: '6', area: 'interviews', name: 'Technical Score', type: 'Integer', required: true },
        { id: '7', area: 'interviews', name: 'Interviewer Notes', type: 'Text', required: false }
    ]);

    const activeFields = fields.filter(f => f.area === activeTab);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Text': return <Type size={14} className="text-slate-400" />;
            case 'Text Area': return <AlignLeft size={14} className="text-slate-400" />;
            case 'Integer': return <Hash size={14} className="text-slate-400" />;
            case 'Date': return <Calendar size={14} className="text-slate-400" />;
            case 'Boolean': return <ToggleLeft size={14} className="text-slate-400" />;
            case 'Drop Down': return <List size={14} className="text-slate-400" />;
            default: return <FileText size={14} className="text-slate-400" />;
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Settings className="text-emerald-600" size={24} />
                        {t("Custom Fields Configuration")}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        {t("Manage custom data fields for various entities.")}
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm">
                    <Plus size={16} />
                    {t("Add Custom Field")}
                </button>
            </div>

            {/* Pill Tabs */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit mb-6">
                <button
                    onClick={() => setActiveTab('campaigns')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'campaigns' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                    {t("Campaigns")}
                </button>
                <button
                    onClick={() => setActiveTab('resumes')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'resumes' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                    {t("Resumes")}
                </button>
                <button
                    onClick={() => setActiveTab('interviews')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'interviews' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                    {t("Interviews")}
                </button>
            </div>

            {/* Fields List */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{activeTab} Fields</h3>
                    <span className="text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-full">{activeFields.length} Configured</span>
                </div>

                {activeFields.length > 0 ? (
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {activeFields.map(field => (
                            <div key={field.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">{field.name}</h4>
                                        {field.required && <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">Required</span>}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center gap-1">
                                            {getTypeIcon(field.type)}
                                            {field.type}
                                        </span>
                                        {field.options && (
                                            <span className="flex items-center gap-1 text-slate-400">
                                                <List size={12} />
                                                {field.options.length} Options
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-50 hover:bg-emerald-50 dark:bg-slate-700 dark:hover:bg-emerald-900/30 rounded-lg transition-colors" title="Edit Field">
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 bg-slate-50 hover:bg-red-50 dark:bg-slate-700 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete Field">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText size={24} />
                        </div>
                        <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No Custom Fields</h4>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                            You haven't configured any custom fields for {activeTab} yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
