import React, { useState, useEffect } from 'react';
import { customFieldService } from '../../../services/api';
import { useToast } from '../../../components/Toast';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import {
    ChevronDown, ChevronUp, Edit2, Check, X,
    Plus, Trash2, SlidersHorizontal, Type, Hash,
    Calendar, List as ListIcon, ToggleLeft, ToggleRight,
    Link as LinkIcon, FileText, AlertCircle, Eye, EyeOff,
    Settings as SettingsIcon, Globe, Lock, Shield
} from '../../../components/Icons';

interface CustomFieldCollectionTabProps {
    collection: 'resumes' | 'campaigns' | 'interviews';
    clientId?: string;
}

const FILE_FORMATS = [
    { label: 'PDF', value: '.pdf' },
    { label: 'DOC', value: '.doc' },
    { label: 'DOCX', value: '.docx' },
    { label: 'JPG', value: '.jpg' },
    { label: 'PNG', value: '.png' },
    { label: 'CSV', value: '.csv' },
    { label: 'XLSX', value: '.xlsx' }
];

export const CustomFieldCollectionTab: React.FC<CustomFieldCollectionTabProps> = ({ collection, clientId }) => {
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState<any[]>([]);
    const [expandedSections, setExpandedSections] = useState<string[]>([]);
    const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
    const [sectionBuffer, setSectionBuffer] = useState<any>(null);
    const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
    const [fieldBuffer, setFieldBuffer] = useState<any>(null);

    // Confirmation Modal State
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{ type: 'section' | 'field', id: string } | null>(null);

    const { addToast } = useToast();

    useEffect(() => {
        fetchGroupedFields();
    }, [collection, clientId]);

    const fetchGroupedFields = async () => {
        setLoading(true);
        try {
            const data = await customFieldService.getGroupedByCollection(collection, clientId ? { clientID: clientId } : {});
            setSections(data);
            // Default to all collapsed as per user request
            setExpandedSections([]);
        } catch (err) {
            console.error("Failed to fetch custom fields", err);
            addToast("Failed to load custom fields", "error");
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (id: string) => {
        setExpandedSections(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleSectionEdit = (section: any) => {
        setEditingSectionId(section._id);
        setSectionBuffer({ ...section });
    };

    const triggerSaveSection = (id: string) => {
        setConfirmAction({ type: 'section', id });
        setShowConfirm(true);
    };

    const executeSaveSection = async () => {
        if (!confirmAction) return;
        try {
            await customFieldService.updateSection(confirmAction.id, sectionBuffer);
            setEditingSectionId(null);
            setShowConfirm(false);
            setConfirmAction(null);
            addToast("Section updated successfully", "success");
            fetchGroupedFields();
        } catch (err) {
            addToast("Failed to update section", "error");
            setShowConfirm(false);
        }
    };

    const toggleSectionStatus = async (section: any) => {
        // Enforce explicit edit mode: Cannot toggle status in view mode
        if (editingSectionId !== section._id) {
            addToast("Please enter Edit Mode to enable/disable sections", "info");
            return;
        }
        setSectionBuffer({ ...sectionBuffer, enabled: !sectionBuffer.enabled });
    };

    const handleFieldEdit = (field: any) => {
        setEditingFieldId(field._id);
        setFieldBuffer({ ...field });
    };

    const triggerSaveField = (id: string) => {
        setConfirmAction({ type: 'field', id });
        setShowConfirm(true);
    };

    const executeSaveField = async () => {
        if (!confirmAction) return;
        try {
            await customFieldService.updateField(confirmAction.id, fieldBuffer);
            setEditingFieldId(null);
            setShowConfirm(false);
            setConfirmAction(null);
            addToast("Field configuration saved", "success");
            fetchGroupedFields();
        } catch (err) {
            addToast("Failed to update field", "error");
            setShowConfirm(false);
        }
    };

    const toggleFieldStatus = (field: any) => {
        // Enforce explicit edit mode
        if (editingFieldId !== field._id) {
            addToast("Please enter Edit Mode to enable/disable fields", "info");
            return;
        }
        setFieldBuffer({ ...fieldBuffer, enabled: !fieldBuffer.enabled });
    };

    const BooleanSwitch = ({ label, value, onChange, disabled }: { label: string, value: boolean, onChange: (val: boolean) => void, disabled?: boolean }) => (
        <div className={`flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border ${disabled ? 'border-slate-100 dark:border-slate-800 opacity-60' : 'border-slate-100 dark:border-slate-700 shadow-sm hover:border-emerald-500/30'} transition-all`}>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
            <button
                disabled={disabled}
                onClick={() => onChange(!value)}
                className={`w-10 h-5 rounded-full transition-all relative ${value ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-md transition-all ${value ? 'left-6' : 'left-1'}`} />
            </button>
        </div>
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium animate-pulse">Scanning custom fields...</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map(section => (
                    <div key={section._id} className={`bg-white dark:bg-slate-900 rounded-[32px] border ${section.enabled ? 'border-slate-200 dark:border-slate-800 shadow-sm' : 'border-slate-100 dark:border-slate-800/50 opacity-75'} overflow-hidden transition-all hover:shadow-xl group/bento h-fit`}>
                        {/* Section Header */}
                        <div className={`px-6 py-5 flex items-center justify-between ${section.enabled ? 'bg-slate-50/50 dark:bg-slate-800/30' : 'bg-slate-100/30 dark:bg-slate-900/10'}`}>
                            <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                <button
                                    onClick={() => toggleSection(section._id)}
                                    className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors shrink-0"
                                >
                                    {expandedSections.includes(section._id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>

                                {editingSectionId === section._id ? (
                                    <div className="flex flex-col gap-2 flex-1 animate-in slide-in-from-top-2 duration-300">
                                        <input
                                            type="text"
                                            value={sectionBuffer.name}
                                            onChange={(e) => setSectionBuffer({ ...sectionBuffer, name: e.target.value })}
                                            className="w-full px-3 py-1 bg-white dark:bg-slate-800 border border-emerald-500 rounded-lg outline-none text-xs font-black"
                                            autoFocus
                                        />
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-2">
                                                <button onClick={() => triggerSaveSection(section._id)} className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                                                    <Check size={14} />
                                                </button>
                                                <button onClick={() => setEditingSectionId(null)} className="p-1.5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-lg hover:text-rose-500">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => toggleSectionStatus(section)}
                                                className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${sectionBuffer.enabled ? 'text-emerald-500 border-emerald-500/30' : 'text-slate-400 border-slate-300'}`}
                                            >
                                                {sectionBuffer.enabled ? 'Enabled' : 'Disabled'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 group cursor-pointer overflow-hidden" onClick={() => toggleSection(section._id)}>
                                        <h3 className={`text-sm font-black tracking-tight truncate ${section.enabled ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500 strike-through'}`}>
                                            {section.name}
                                        </h3>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleSectionEdit(section); }}
                                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-emerald-500 transition-all shrink-0"
                                        >
                                            <Edit2 size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                {section.accessLevel === 'Client' && <Shield size={14} className="text-amber-500" title="Client Level" />}
                                <span className="text-[10px] font-black text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700">
                                    {section.fields.length}
                                </span>
                            </div>
                        </div>

                        {/* Section Content - Bento Style */}
                        {expandedSections.includes(section._id) && (
                            <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-300">
                                <div className="space-y-3">
                                    {section.fields.map((field: any) => (
                                        <div key={field._id} className={`group/field p-4 rounded-2xl border transition-all ${field.enabled ? 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800' : 'bg-slate-50/50 grayscale'}`}>
                                            {editingFieldId === field._id ? (
                                                <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                                                    <div className="space-y-3">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Name</label>
                                                                <input
                                                                    type="text"
                                                                    value={fieldBuffer.name}
                                                                    onChange={(e) => setFieldBuffer({ ...fieldBuffer, name: e.target.value })}
                                                                    className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Format</label>
                                                                <select
                                                                    value={fieldBuffer.format}
                                                                    onChange={(e) => setFieldBuffer({ ...fieldBuffer, format: e.target.value })}
                                                                    className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                                                                >
                                                                    <option value="text">Text</option>
                                                                    <option value="number">Number</option>
                                                                    <option value="date">Date</option>
                                                                    <option value="dropdown">Dropdown</option>
                                                                    <option value="file">File</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Advanced Flags */}
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <BooleanSwitch label="Status" value={fieldBuffer.enabled} onChange={() => toggleFieldStatus(field)} />
                                                            <BooleanSwitch label="Required" value={fieldBuffer.required} onChange={(v) => setFieldBuffer({ ...fieldBuffer, required: v })} />
                                                            <BooleanSwitch label="Editable" value={fieldBuffer.editable} onChange={(v) => setFieldBuffer({ ...fieldBuffer, editable: v })} />
                                                            <BooleanSwitch label="Search" value={fieldBuffer.searchable} onChange={(v) => setFieldBuffer({ ...fieldBuffer, searchable: v })} />
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                                        <button onClick={() => triggerSaveField(field._id)} className="flex-1 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                                                            Save
                                                        </button>
                                                        <button onClick={() => setEditingFieldId(null)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase rounded-lg">
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                                                            {field.format === 'text' && <Type size={14} />}
                                                            {field.format === 'number' && <Hash size={14} />}
                                                            {field.format === 'dropdown' && <ListIcon size={14} />}
                                                            {field.format === 'file' && <FileText size={14} />}
                                                            {!['text', 'number', 'dropdown', 'file'].includes(field.format) && <SlidersHorizontal size={14} />}
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <h4 className={`text-xs font-bold truncate ${field.enabled ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 strike-through'}`}>{field.name}</h4>
                                                            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{field.format}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover/field:opacity-100 transition-all">
                                                        <button
                                                            onClick={() => handleFieldEdit(field)}
                                                            className="p-1.5 text-slate-400 hover:text-emerald-500 transition-all"
                                                        >
                                                            <SettingsIcon size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => toggleFieldStatus(field)}
                                                            className={`p-1.5 rounded-lg transition-all ${field.enabled ? 'text-slate-400 hover:text-rose-500' : 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'}`}
                                                        >
                                                            {field.enabled ? <EyeOff size={14} /> : <Eye size={14} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full py-3 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest">
                                    <Plus size={14} /> Add Field
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {sections.length === 0 && (
                <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-slate-900/50 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-2xl">
                    <Globe size={40} className="text-slate-300 animate-pulse mb-4" />
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">No Sections Configured</h3>
                    <button className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        Initialize First Section
                    </button>
                </div>
            )}

            <ConfirmationModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={confirmAction?.type === 'section' ? executeSaveSection : executeSaveField}
                title="Confirm Custom Changes"
                message={`Are you sure you want to save the new configuration for this ${confirmAction?.type}? This will apply changes immediately to all users.`}
                confirmText="Apply Changes"
                cancelText="Keep Revisions"
            />
        </>
    );
};
