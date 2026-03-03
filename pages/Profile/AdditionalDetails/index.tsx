import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CustomFieldRenderer } from '../../../components/CustomFieldRenderer';
import { profileService, customFieldService, campaignService } from '../../../services/api';
import { useToast } from '../../../components/Toast';
import { EmptyView } from '../../../components/Common';
import { ClipboardList, Save, Shield, Edit2, X, Undo2, AlertTriangle } from '../../../components/Icons';
import { ConfirmationModal } from '../../../components/ConfirmationModal';

interface AdditionalDetailsProps {
    collection?: 'resumes' | 'campaigns' | 'interviews';
    id?: string;
    readOnly?: boolean;
}

export const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({
    collection: propsCollection,
    id: propsId,
    readOnly: propsReadOnly = false
}) => {
    const { id: urlId } = useParams<{ id: string }>();
    const id = propsId || urlId;
    const collection = propsCollection || 'resumes'; // Default to resumes/profile

    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState<any[]>([]);
    const [customData, setCustomData] = useState<Record<string, any>>({});
    const [tempData, setTempData] = useState<Record<string, any>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Confirmation States
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const { addToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // 1. Fetch Custom Field Definitions Grouped by Section
                const groupedFields = await customFieldService.getGroupedByCollection(collection);
                setSections(groupedFields);

                // 2. Fetch the Actual Document to get customData values
                let doc;
                if (collection === 'resumes') {
                    doc = await profileService.getById(id);
                } else if (collection === 'campaigns') {
                    doc = await campaignService.getById(id);
                }

                const data = doc?.customData || {};
                setCustomData(data);
                setTempData(data);
            } catch (err) {
                console.error("Failed to fetch additional details", err);
                addToast("Failed to load details", "error");
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchData();
        }, [id, collection]);

        useEffect(() => {
            const handleEditEvent = () => setIsEditing(true);
            window.addEventListener('CAMPAIGN_EDIT_DETAILS', handleEditEvent);
            return () => window.removeEventListener('CAMPAIGN_EDIT_DETAILS', handleEditEvent);
        }, []);

        const getFieldData = (data: any, sectionId: string, fieldId: string) => {
            if (!data) return {};
            // 1. Try strict section path (Standard)
            if (data[sectionId]?.[fieldId]) return data[sectionId][fieldId];
            // 2. Try direct field ID (Flat structure)
            if (data[fieldId] && (data[fieldId].value !== undefined || data[fieldId].label)) return data[fieldId];
            // 3. Deep search (Nested by Client/Company ID)
            for (const key in data) {
                if (data[key] && typeof data[key] === 'object' && data[key][fieldId]) {
                    return data[key][fieldId];
                }
            }
            return {};
        };

        const handleFieldChange = (sectionID: string, fieldID: string, value: any, fieldDef: any) => {
            setTempData(prev => {
                const next = { ...prev };

                // Determine the target container key safely
                let targetKey = sectionID;
                if (prev[sectionID]?.[fieldID]) {
                    targetKey = sectionID;
                } else {
                    // Find where the field already exists or default to sectionID
                    for (const key in prev) {
                        if (prev[key] && typeof prev[key] === 'object' && prev[key][fieldID]) {
                            targetKey = key;
                            break;
                        }
                    }
                }

                next[targetKey] = {
                    ...(next[targetKey] || {}),
                    [fieldID]: {
                        label: fieldDef.name,
                        format: fieldDef.format,
                        value: value
                    }
                };
                return next;
            });
        };

        const hasChanges = JSON.stringify(customData) !== JSON.stringify(tempData);

        const handleSaveInitiate = () => {
            if (!hasChanges) {
                setIsEditing(false);
                return;
            }
            setShowSaveConfirm(true);
        };

        const handleSaveConfirm = async () => {
            if (!id || saving) return;
            setSaving(true);
            try {
                await customFieldService.updateCustomDataBatch(collection, id, tempData);
                setCustomData(tempData);
                setIsEditing(false);
                addToast("Details saved successfully", "success");
            } catch (err) {
                console.error("Failed to save", err);
                addToast("Failed to save changes", "error");
            } finally {
                setSaving(false);
                setShowSaveConfirm(false);
            }
        };

        const handleCancelInitiate = () => {
            if (hasChanges) {
                setShowCancelConfirm(true);
            } else {
                setIsEditing(false);
            }
        };

        const handleCancelConfirm = () => {
            setTempData(customData);
            setIsEditing(false);
            setShowCancelConfirm(false);
        };

        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                    <p className="mt-4 text-slate-500 text-sm">Loading field configurations...</p>
                </div>
            );
        }

        if (sections.length === 0) {
            return (
                <EmptyView
                    icon={Shield}
                    title="No Custom Fields Configured"
                    message="There are no client-specific custom fields configured for this section."
                />
            );
        }

        return (
            <div className="space-y-6 pb-20 px-4">
                <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800/60 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-extrabold text-slate-800 dark:text-white uppercase tracking-tighter">
                            Additional Details
                        </h2>
                    </div>

                    {!propsReadOnly && (
                        <div className="flex items-center gap-3">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="group flex items-center gap-2 px-6 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all active:scale-95 shadow-sm"
                                >
                                    <Edit2 size={16} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                    <span className="text-sm">Edit Details</span>
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleCancelInitiate}
                                        className="group flex items-center gap-2 px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all active:scale-95 text-sm"
                                    >
                                        <Undo2 size={16} />
                                        <span>Discard</span>
                                    </button>
                                    <button
                                        onClick={handleSaveInitiate}
                                        disabled={saving}
                                        className="group flex items-center gap-2 px-8 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-200/50 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 text-sm"
                                    >
                                        {saving ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {sections.map((section, idx) => (
                        <section
                            key={section._id}
                            style={{ animationDelay: `${idx * 100}ms` }}
                            className="bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800/60 overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 group/section"
                        >
                            <header className="px-8 py-5 bg-slate-50/20 dark:bg-slate-800/20 border-b border-slate-50 dark:border-slate-800/40 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                                    <h3 className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest text-[11px]">{section.name}</h3>
                                </div>
                                <span className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded-full uppercase">
                                    {section.fields?.length || 0} Fields
                                </span>
                            </header>
                            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
                                {section.fields?.map((field: any) => {
                                    // Get document-specific data using resilient search
                                    const docData = getFieldData(tempData, section._id, field._id);

                                    // Merge document metadata with field definition for display
                                    const mergedField = {
                                        ...field,
                                        name: docData.label || field.name,
                                        format: docData.format || field.format
                                    };

                                    return (
                                        <CustomFieldRenderer
                                            key={field._id}
                                            field={mergedField}
                                            value={docData.value}
                                            onChange={(val) => handleFieldChange(section._id, field._id, val, mergedField)}
                                            allValues={tempData}
                                            readOnly={!isEditing}
                                        />
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Confirmation Modals */}
                <ConfirmationModal
                    isOpen={showSaveConfirm}
                    onClose={() => setShowSaveConfirm(false)}
                    onConfirm={handleSaveConfirm}
                    title="Save Changes?"
                    message="Are you sure you want to save the modifications made to these custom fields?"
                    confirmText="Save Now"
                    cancelText="Keep Editing"
                />

                <ConfirmationModal
                    isOpen={showCancelConfirm}
                    onClose={() => setShowCancelConfirm(false)}
                    onConfirm={handleCancelConfirm}
                    title="Discard Changes?"
                    message="You have unsaved changes. Are you sure you want to discard them? This action cannot be undone."
                    confirmText="Discard Changes"
                    cancelText="Back to Editing"
                    isDelete={true}
                />
            </div>
        );
    };

    export default AdditionalDetails;
