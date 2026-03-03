import React, { useState, useEffect } from 'react';
import {
    FileText, Link as LinkIcon, Upload, Download, Eye,
    ChevronRight, Calendar, Clock, Check, ChevronDown,
    ExternalLink, Lock, X, AlertTriangle
} from './Icons';

interface CustomFieldProps {
    field: {
        _id: string;
        name: string;
        format: string;
        possibleValues?: string[];
        validation?: any;
        placeholder?: string;
        dependentFieldID?: string;
        dependentValue?: string;
        editable?: boolean; // Respect individual field editability
    };
    value: any;
    onChange: (value: any) => void;
    allValues?: Record<string, any>;
    readOnly?: boolean;
}

const normalizeValue = (val: any) => {
    if (val && typeof val === 'object' && val.$date) {
        return val.$date;
    }
    return val;
};

const formatForInput = (val: any, format: string) => {
    const normalized = normalizeValue(val);
    if (!normalized) return '';
    try {
        const date = new Date(normalized);
        if (isNaN(date.getTime())) return normalized;

        if (format === 'date') {
            return date.toISOString().split('T')[0];
        } else if (format === 'date time' || format === 'datetime') {
            return date.toISOString().slice(0, 16);
        }
    } catch (e) {
        return normalized;
    }
    return normalized;
};

export const CustomFieldRenderer: React.FC<CustomFieldProps> = ({
    field,
    value,
    onChange,
    allValues = {},
    readOnly = false
}) => {
    const [showOptions, setShowOptions] = useState(false);

    // Hard read-only if the field is not editable OR the parent says read-only
    const effectiveReadOnly = readOnly || field.editable === false;

    // Handle Dependent Logic
    if (field.dependentFieldID) {
        const parentValue = allValues[field.dependentFieldID];
        if (parentValue !== field.dependentValue) {
            return null;
        }
    }

    const baseInputClasses = "w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed";
    const viewClasses = "w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/20 border border-transparent rounded-xl text-slate-700 dark:text-slate-300 font-medium flex items-center min-h-[46px]";

    const renderInput = () => {
        const format = (field.format || '').toLowerCase();

        if (effectiveReadOnly) {
            // View Mode Component
            switch (format) {
                case 'boolean':
                    return (
                        <div className={viewClasses}>
                            <span className={`w-2 h-2 rounded-full mr-2 ${value ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                            {value ? 'Yes' : 'No'}
                        </div>
                    );
                case 'link':
                    return (
                        <div className="flex gap-2">
                            <div className={`${viewClasses} flex-1 truncate`}>
                                <LinkIcon size={14} className="mr-2 text-slate-400" />
                                <span className="truncate">{value || 'Not set'}</span>
                            </div>
                            {value && (
                                <a
                                    href={value.startsWith('http') ? value : `https://${value}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all flex items-center justify-center shadow-sm"
                                    title="Open in new page"
                                >
                                    <Eye size={18} />
                                </a>
                            )}
                        </div>
                    );
                case 'file':
                    return (
                        <div className="flex gap-2">
                            <div className={`${viewClasses} flex-1`}>
                                <FileText size={14} className="mr-2 text-slate-400" />
                                {value ? (value.name || 'File Attached') : 'None'}
                            </div>
                            {value && (
                                <div className="flex gap-2">
                                    <button className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all shadow-sm" title="Preview File">
                                        <Eye size={18} />
                                    </button>
                                    <button className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all shadow-sm" title="Download">
                                        <Download size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                case 'multi-select':
                case 'multi-select dropdown':
                case 'list':
                    const items = Array.isArray(value) ? value : (value ? [value] : []);
                    return (
                        <div className={`${viewClasses} flex-wrap gap-2 h-auto py-3`}>
                            {items.length > 0 ? items.map(val => (
                                <span key={val} className="px-3 py-1 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-lg border border-slate-200 dark:border-slate-600 font-bold">
                                    {val}
                                </span>
                            )) : <span className="text-slate-400 italic font-normal">No selection</span>}
                        </div>
                    );
                default:
                    const displayVal = normalizeValue(value);
                    return (
                        <div className={viewClasses}>
                            {displayVal !== undefined && displayVal !== null && displayVal !== '' ? displayVal.toString() : <span className="text-slate-400 italic font-normal">Not set</span>}
                        </div>
                    );
            }
        }

        // Edit Mode Components
        switch (format) {
            case 'text':
                return (
                    <input
                        type="text"
                        className={baseInputClasses}
                        value={value || ''}
                        placeholder={field.placeholder || 'Enter text...'}
                        onChange={(e) => onChange(e.target.value)}
                    />
                );

            case 'long text':
                return (
                    <textarea
                        className={`${baseInputClasses} min-h-[120px] resize-y leading-relaxed`}
                        value={value || ''}
                        placeholder={field.placeholder || 'Enter long text...'}
                        onChange={(e) => onChange(e.target.value)}
                    />
                );

            case 'integer':
            case 'float':
            case 'number':
                return (
                    <input
                        type="number"
                        step={format === 'integer' ? '1' : '0.01'}
                        className={baseInputClasses}
                        value={value || ''}
                        onChange={(e) => onChange(format === 'integer' ? parseInt(e.target.value) : parseFloat(e.target.value))}
                    />
                );

            case 'boolean':
                return (
                    <div className="flex items-center gap-4 py-2">
                        <button
                            onClick={() => onChange(!value)}
                            className={`w-14 h-7 rounded-full transition-all relative shadow-inner ${value ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${value ? 'left-8' : 'left-1'}`} />
                        </button>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{value ? 'Yes' : 'No'}</span>
                    </div>
                );

            case 'date':
                return (
                    <div className="relative group">
                        <input
                            type="date"
                            className={baseInputClasses}
                            value={formatForInput(value, 'date')}
                            onChange={(e) => onChange(e.target.value)}
                        />
                        <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-focus-within:text-emerald-500" />
                    </div>
                );

            case 'date time':
            case 'datetime':
                return (
                    <div className="relative group">
                        <input
                            type="datetime-local"
                            className={baseInputClasses}
                            value={formatForInput(value, 'datetime')}
                            onChange={(e) => onChange(e.target.value)}
                        />
                        <Clock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-focus-within:text-emerald-500" />
                    </div>
                );

            case 'drop down':
            case 'dropdown':
                return (
                    <div className="relative group">
                        <select
                            className={`${baseInputClasses} appearance-none cursor-pointer pr-10`}
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                        >
                            <option value="">Select option</option>
                            {field.possibleValues?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-focus-within:text-emerald-500" />
                    </div>
                );

            case 'multi-select':
            case 'multi-select dropdown':
            case 'list':
                const selected = Array.isArray(value) ? value : (value ? [value] : []);
                return (
                    <div className="relative">
                        <div
                            className={`${baseInputClasses} min-h-[46px] flex flex-wrap gap-2 cursor-pointer items-center pr-10`}
                            onClick={() => setShowOptions(!showOptions)}
                        >
                            {selected.length === 0 && <span className="text-slate-400 italic text-sm px-1 font-normal uppercase tracking-wider text-[10px]">Select multiple...</span>}
                            {selected.map(val => (
                                <span key={val} className="pl-2.5 pr-1.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs rounded-lg border border-emerald-100 dark:border-emerald-800/60 flex items-center gap-1.5 font-bold shadow-sm">
                                    {val}
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        onChange(selected.filter(v => v !== val));
                                    }} className="hover:bg-emerald-200/50 dark:hover:bg-emerald-800/50 p-0.5 rounded transition-colors">
                                        <X size={12} className="stroke-[3]" />
                                    </button>
                                </span>
                            ))}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${showOptions ? 'rotate-180' : ''}`} />
                            </div>
                        </div>

                        {showOptions && field.possibleValues && field.possibleValues.length > 0 && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowOptions(false)} />
                                <div className="absolute z-20 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-black/5">
                                    <div className="max-h-[240px] overflow-y-auto p-1.5 space-y-0.5">
                                        {field.possibleValues?.map(opt => {
                                            const isSelected = selected.includes(opt);
                                            return (
                                                <button
                                                    key={opt}
                                                    onClick={() => {
                                                        const next = isSelected ? selected.filter(v => v !== opt) : [...selected, opt];
                                                        onChange(next);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 text-sm rounded-xl flex justify-between items-center transition-all ${isSelected ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                                >
                                                    {opt}
                                                    {isSelected && <Check size={16} className="text-emerald-500" strokeWidth={3} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );

            case 'link':
                return (
                    <div className="flex gap-2 group">
                        <div className="relative flex-1">
                            <input
                                type="url"
                                className={`${baseInputClasses} pl-11`}
                                value={value || ''}
                                placeholder="https://..."
                                onChange={(e) => onChange(e.target.value)}
                            />
                            <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-500" />
                        </div>
                        {value && (
                            <a
                                href={value.startsWith('http') ? value : `https://${value}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all shadow-sm flex items-center justify-center min-w-[46px]"
                            >
                                <ExternalLink size={20} />
                            </a>
                        )}
                    </div>
                );

            case 'file':
                return (
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <div className="flex-1 relative group">
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            onChange({ name: file.name, size: file.size, lastModified: file.lastModified });
                                        }
                                    }}
                                />
                                <div className={`${baseInputClasses} flex items-center justify-center gap-3 border-dashed bg-slate-50/50 dark:bg-slate-800/10 border-slate-300 dark:border-slate-700 min-h-[46px] group-hover:border-emerald-500/50 group-hover:bg-emerald-500/[0.02] transition-all`}>
                                    <Upload size={20} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                    <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors truncate px-2">{value ? value.name : 'Upload File'}</span>
                                </div>
                            </div>
                            {value && (
                                <div className="flex gap-2">
                                    <button className="p-3 text-slate-400 hover:text-emerald-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl transition-all shadow-sm" title="Download"><Download size={20} /></button>
                                    <button className="p-3 text-slate-400 hover:text-blue-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl transition-all shadow-sm" title="Preview"><Eye size={20} /></button>
                                </div>
                            )}
                        </div>
                        {field.validation?.allowedExtensions && (
                            <div className="flex items-center gap-1.5 px-1">
                                <FileText size={10} className="text-slate-300" />
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Allowed: {field.validation.allowedExtensions.join(', ')}</p>
                            </div>
                        )}
                    </div>
                );

            default:
                return (
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-center gap-3 animate-pulse">
                        <AlertTriangle size={18} className="text-red-500" />
                        <p className="text-xs text-red-600 dark:text-red-400 font-bold uppercase tracking-tight">Unsupported: {field.format}</p>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-2 group/field focus-within:transform focus-within:scale-[1.01] transition-all duration-300">
            <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                    {field.name}
                </label>
                {field.editable === false && !readOnly && (
                    <div className="flex items-center gap-1 text-[9px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/10 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/20">
                        <Lock size={10} />
                        LOCKED
                    </div>
                )}
            </div>
            {renderInput()}
        </div>
    );
};
