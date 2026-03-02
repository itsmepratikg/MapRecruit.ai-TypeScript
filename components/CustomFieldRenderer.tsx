import React, { useState, useEffect } from 'react';
import {
    FileText, Link as LinkIcon, Upload, Download, Eye,
    ChevronRight, Calendar, Clock, Check, ChevronDown
} from './Icons';

interface CustomFieldProps {
    field: {
        _id: string;
        label: string;
        type: string;
        options?: string[];
        validation?: any;
        placeholder?: string;
        dependentFieldID?: string;
        dependentValue?: string;
    };
    value: any;
    onChange: (value: any) => void;
    allValues?: Record<string, any>;
    readOnly?: boolean;
}

export const CustomFieldRenderer: React.FC<CustomFieldProps> = ({
    field,
    value,
    onChange,
    allValues = {},
    readOnly = false
}) => {
    const [showOptions, setShowOptions] = useState(false);

    // Handle Dependent Logic
    if (field.dependentFieldID) {
        const parentValue = allValues[field.dependentFieldID];
        if (parentValue !== field.dependentValue) {
            return null; // Don't show if dependency isn't met
        }
    }

    const baseInputClasses = "w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const renderInput = () => {
        switch (field.type) {
            case 'Text':
                return (
                    <input
                        type="text"
                        className={baseInputClasses}
                        value={value || ''}
                        placeholder={field.placeholder}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={readOnly}
                    />
                );

            case 'Long Text':
                return (
                    <textarea
                        className={`${baseInputClasses} min-h-[100px] resize-y`}
                        value={value || ''}
                        placeholder={field.placeholder}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={readOnly}
                    />
                );

            case 'Integer':
                return (
                    <input
                        type="number"
                        step="1"
                        className={baseInputClasses}
                        value={value || ''}
                        onChange={(e) => onChange(parseInt(e.target.value))}
                        disabled={readOnly}
                    />
                );

            case 'Float':
                return (
                    <input
                        type="number"
                        step="0.01"
                        className={baseInputClasses}
                        value={value || ''}
                        onChange={(e) => onChange(parseFloat(e.target.value))}
                        disabled={readOnly}
                    />
                );

            case 'Boolean':
                return (
                    <div className="flex items-center gap-3 py-2">
                        <button
                            onClick={() => !readOnly && onChange(!value)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                            disabled={readOnly}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? 'left-7' : 'left-1'}`} />
                        </button>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{value ? 'Yes' : 'No'}</span>
                    </div>
                );

            case 'Date':
                return (
                    <div className="relative">
                        <input
                            type="date"
                            className={baseInputClasses}
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            disabled={readOnly}
                        />
                        <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                );

            case 'Date Time':
                return (
                    <div className="relative">
                        <input
                            type="datetime-local"
                            className={baseInputClasses}
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            disabled={readOnly}
                        />
                        <Clock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                );

            case 'Dropdown':
                return (
                    <div className="relative">
                        <select
                            className={`${baseInputClasses} appearance-none`}
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            disabled={readOnly}
                        >
                            <option value="">Select option</option>
                            {field.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                );

            case 'Dropdown Dependent':
                return (
                    <div className="relative">
                        <select
                            className={`${baseInputClasses} appearance-none`}
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            disabled={readOnly}
                        >
                            <option value="">Select option</option>
                            {field.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                );

            case 'Multi-Select Dropdown':
                const selected = Array.isArray(value) ? value : [];
                return (
                    <div className="relative">
                        <div
                            className={`${baseInputClasses} min-h-[42px] flex flex-wrap gap-1 cursor-pointer items-center`}
                            onClick={() => !readOnly && setShowOptions(!showOptions)}
                        >
                            {selected.length === 0 && <span className="text-slate-400">Select options</span>}
                            {selected.map(val => (
                                <span key={val} className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs rounded-md border border-emerald-100 dark:border-emerald-800 flex items-center gap-1">
                                    {val}
                                    {!readOnly && (
                                        <button onClick={(e) => {
                                            e.stopPropagation();
                                            onChange(selected.filter(v => v !== val));
                                        }} className="hover:text-emerald-900 dark:hover:text-emerald-200">×</button>
                                    )}
                                </span>
                            ))}
                            <ChevronDown size={18} className="ml-auto text-slate-400" />
                        </div>

                        {showOptions && !readOnly && (
                            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="max-h-[200px] overflow-y-auto">
                                    {field.options?.map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => {
                                                const next = selected.includes(opt) ? selected.filter(v => v !== opt) : [...selected, opt];
                                                onChange(next);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 flex justify-between items-center"
                                        >
                                            {opt}
                                            {selected.includes(opt) && <Check size={14} className="text-emerald-500" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'Link':
                return (
                    <div className="flex gap-2">
                        <input
                            type="url"
                            className={baseInputClasses}
                            value={value || ''}
                            placeholder="https://..."
                            onChange={(e) => onChange(e.target.value)}
                            disabled={readOnly}
                        />
                        {value && (
                            <a
                                href={value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                            >
                                <LinkIcon size={20} />
                            </a>
                        )}
                    </div>
                );

            case 'File':
                return (
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                    disabled={readOnly}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            // Mock file handling - in real app would upload
                                            onChange({ name: file.name, size: file.size, lastModified: file.lastModified });
                                        }
                                    }}
                                />
                                <div className={`${baseInputClasses} flex items-center justify-center gap-2 border-dashed bg-slate-50/50 dark:bg-slate-800/30`}>
                                    <Upload size={18} className="text-slate-400" />
                                    <span className="text-sm text-slate-500">{value ? value.name : 'Upload File'}</span>
                                </div>
                            </div>
                            {value && (
                                <div className="flex gap-1">
                                    <button className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"><Download size={18} /></button>
                                    <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Eye size={18} /></button>
                                </div>
                            )}
                        </div>
                        {field.validation?.allowedExtensions && (
                            <p className="text-[10px] text-slate-400">Allowed: {field.validation.allowedExtensions.join(', ')}</p>
                        )}
                    </div>
                );

            default:
                return <p className="text-xs text-red-500 italic">Unsupported field type: {field.type}</p>;
        }
    };

    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
                {field.label}
            </label>
            {renderInput()}
        </div>
    );
};
