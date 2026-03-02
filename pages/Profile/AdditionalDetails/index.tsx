import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CustomFieldRenderer } from '../../../components/CustomFieldRenderer';
import { profileService, customFieldService } from '../../../services/api';
import { useToast } from '../../../components/Toast';
import { EmptyView } from '../../../components/Common';
import { ClipboardList, Save, Shield } from '../../../components/Icons';

interface AdditionalDetailsProps {
    collection?: 'resumes' | 'campaigns' | 'interviews';
    id?: string;
    readOnly?: boolean;
}

export const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({
    collection: propsCollection,
    id: propsId,
    readOnly = false
}) => {
    const { id: urlId } = useParams<{ id: string }>();
    const id = propsId || urlId;
    const collection = propsCollection || 'resumes'; // Default to resumes/profile

    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState<any[]>([]);
    const [customData, setCustomData] = useState<Record<string, any>>({});
    const [saving, setSaving] = useState(false);
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
                    // Mock or actual campaign service
                    const { campaignService } = await import('../../../services/api');
                    doc = await campaignService.getById(id);
                }

                setCustomData(doc?.customData || {});
            } catch (err) {
                console.error("Failed to fetch additional details", err);
                addToast("Failed to load details", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, collection]);

    const handleFieldChange = (sectionID: string, fieldID: string, value: any) => {
        setCustomData(prev => ({
            ...prev,
            [sectionID]: {
                ...(prev[sectionID] || {}),
                [fieldID]: {
                    ...(prev[sectionID]?.[fieldID] || {}),
                    value: value
                }
            }
        }));
    };

    const handleSave = async () => {
        if (!id || saving) return;
        setSaving(true);
        try {
            // Flat update for each field that changed might be too many requests
            // For now, let's assume we can push the whole customData or we use our batch endpoint
            await customFieldService.updateCustomDataBatch(collection, id, customData);
            addToast("Details saved successfully", "success");
        } catch (err) {
            console.error("Failed to save", err);
            addToast("Failed to save changes", "error");
        } finally {
            setSaving(false);
        }
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
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <ClipboardList className="text-emerald-500" />
                        Additional Details
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage client-specific integrated custom fields and attributes.</p>
                </div>
                {!readOnly && (
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6">
                {sections.map(section => (
                    <section key={section._id} className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
                        <header className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-xs">{section.name}</h3>
                        </header>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {section.fields?.map((field: any) => (
                                <CustomFieldRenderer
                                    key={field._id}
                                    field={field}
                                    value={customData[section._id]?.[field._id]?.value}
                                    onChange={(val) => handleFieldChange(section._id, field._id, val)}
                                    allValues={customData}
                                    readOnly={readOnly}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default AdditionalDetails;
