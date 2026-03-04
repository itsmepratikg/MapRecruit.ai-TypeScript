import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

export interface EducationEntry {
    id: string;
    level: string;
    degree: string;
    major: string;
    institution: string;
    year: string;
    merit: string;
    meritType: 'GPA' | 'Percentage';
    importance: 'Required' | 'Preferred';
}

interface EducationBuilderProps {
    entries: EducationEntry[];
    onChange: (entries: EducationEntry[]) => void;
}

const DEGREE_LEVELS = [
    'Secondary School', 'Higher Secondary School', 'Vocational Education',
    'Diploma', 'Bachelors', 'Masters', 'PHD', 'Law', 'Others'
];

export const EducationBuilder: React.FC<EducationBuilderProps> = ({ entries, onChange }) => {
    const { t } = useTranslation();
    const [isAdding, setIsAdding] = useState(false);

    // Initial Empty State for Form
    const initialEntry: EducationEntry = {
        id: '',
        level: 'Bachelors',
        degree: '',
        major: '',
        institution: '',
        year: '',
        merit: '',
        meritType: 'GPA',
        importance: 'Required'
    };

    const [newEntry, setNewEntry] = useState<EducationEntry>(initialEntry);

    const handleAdd = () => {
        if (!newEntry.degree && !newEntry.major) return; // Basic validation
        onChange([...entries, { ...newEntry, id: crypto.randomUUID() }]);
        setNewEntry(initialEntry);
        setIsAdding(false);
    };

    const removeEntry = (id: string) => {
        onChange(entries.filter(e => e.id !== id));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t("Education")}</label>
                <button
                    onClick={() => setIsAdding(true)}
                    className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1 hover:underline"
                >
                    <Plus size={16} /> {t("Add Education")}
                </button>
            </div>

            {/* List */}
            <div className="space-y-3">
                {entries.map(entry => (
                    <div key={entry.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 group">
                        <div className="mt-1 text-slate-400">
                            <GraduationCap size={18} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                                {entry.level} - {entry.degree} in {entry.major}
                            </h4>
                            <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                <span>{entry.institution}</span>
                                {entry.year && <span>Class of {entry.year}</span>}
                                {entry.merit && <span>{entry.merit} {entry.meritType === 'Percentage' ? '%' : 'GPA'}</span>}
                                <span className={`px-1.5 py-0.5 rounded ${entry.importance === 'Required' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                                    {entry.importance}
                                </span>
                            </div>
                        </div>
                        <button onClick={() => removeEntry(entry.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Form */}
            {isAdding && (
                <div className="p-4 bg-white dark:bg-slate-800 border-2 border-emerald-100 dark:border-emerald-900/30 rounded-xl animate-in zoom-in-95 duration-200 space-y-4 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-slate-500 uppercase">{t("Degree Level")}</label>
                            <select
                                value={newEntry.level}
                                onChange={e => setNewEntry({ ...newEntry, level: e.target.value })}
                                className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                            >
                                {DEGREE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 uppercase">{t("Degree")}</label>
                            <input
                                type="text"
                                value={newEntry.degree}
                                onChange={e => setNewEntry({ ...newEntry, degree: e.target.value })}
                                className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                                placeholder="e.g. Bachelor of Science"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 uppercase">{t("Major")}</label>
                            <input
                                type="text"
                                value={newEntry.major}
                                onChange={e => setNewEntry({ ...newEntry, major: e.target.value })}
                                className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                                placeholder="e.g. Computer Science"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 uppercase">{t("Institution")}</label>
                            <input
                                type="text"
                                value={newEntry.institution}
                                onChange={e => setNewEntry({ ...newEntry, institution: e.target.value })}
                                className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-slate-500 uppercase">{t("Grad Year")}</label>
                                <input
                                    type="number"
                                    value={newEntry.year}
                                    onChange={e => setNewEntry({ ...newEntry, year: e.target.value.replace(/[^0-9]/g, '') })}
                                    className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                                    placeholder="YYYY"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 uppercase">{t("Importance")}</label>
                                <select
                                    value={newEntry.importance}
                                    onChange={e => setNewEntry({ ...newEntry, importance: e.target.value as any })}
                                    className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                                >
                                    <option value="Required">Required</option>
                                    <option value="Preferred">Preferred</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 uppercase">{t("Merit")}</label>
                            <div className="flex gap-2 mt-1">
                                <input
                                    type="text"
                                    value={newEntry.merit}
                                    onChange={e => setNewEntry({ ...newEntry, merit: e.target.value })}
                                    className="flex-1 px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm"
                                    placeholder="Score"
                                />
                                <select
                                    value={newEntry.meritType}
                                    onChange={e => setNewEntry({ ...newEntry, meritType: e.target.value as any })}
                                    className="w-24 px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-sm bg-slate-50"
                                >
                                    <option value="GPA">GPA</option>
                                    <option value="Percentage">%</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
                        >
                            Add Details
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
