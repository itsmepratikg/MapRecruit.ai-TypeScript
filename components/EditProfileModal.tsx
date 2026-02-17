
import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any; // Full profile object
    onSave: (updatedData: any) => Promise<void>;
    initialTab?: string;
}

export const EditProfileModal = ({ isOpen, onClose, data, onSave, initialTab = 'BASIC' }: EditProfileModalProps) => {
    const [formData, setFormData] = useState<any>(null);
    const [activeSection, setActiveSection] = useState(initialTab);
    const [isSaving, setIsSaving] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false); // Confirmation State

    useEffect(() => {
        if (isOpen) {
            setActiveSection(initialTab);
        }
    }, [isOpen, initialTab]);

    useEffect(() => {
        if (data && isOpen) {
            setFormData(JSON.parse(JSON.stringify(data)));
        }
    }, [data, isOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                if (showConfirm) {
                    setShowConfirm(false);
                } else {
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose, showConfirm]);

    if (!isOpen || !formData) return null;

    const resume = formData.resume || {};
    const profile = resume.profile || {};
    const summary = resume.professionalSummary || {};
    const experience = resume.professionalExperience || [];

    const handleSaveClick = () => setShowConfirm(true); // Trigger Confirmation

    const confirmSave = async () => {
        try {
            setIsSaving(true);
            setShowConfirm(false);
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Helper to update deeply nested state
    const updateProfile = (field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            resume: {
                ...prev.resume,
                profile: {
                    ...prev.resume?.profile,
                    [field]: value
                }
            }
        }));
    };

    // Update Array items (emails/phones)
    const updateProfileArray = (key: 'emails' | 'phones' | 'locations', index: number, field: string, value: any) => {
        const arr = [...(profile[key] || [])];
        if (!arr[index]) return;
        arr[index] = { ...arr[index], [field]: value };
        updateProfile(key, arr);
    };

    const updateSummary = (field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            resume: {
                ...prev.resume,
                professionalSummary: {
                    ...prev.resume?.professionalSummary,
                    [field]: value
                }
            }
        }));
    };

    // ... (keep experience helpers) ...
    const updateExperience = (index: number, field: string, value: any) => {
        const newExp = [...experience];
        newExp[index] = { ...newExp[index], [field]: value };
        if (field === 'jobTitle') newExp[index].jobTitle = { ...newExp[index].jobTitle, text: value };
        if (field === 'company') newExp[index].company = { ...newExp[index].company, text: value };
        if (field === 'description') newExp[index].description = value;

        setFormData((prev: any) => ({
            ...prev,
            resume: {
                ...prev.resume,
                professionalExperience: newExp
            }
        }));
    };

    const addExperience = () => {
        setFormData((prev: any) => ({
            ...prev,
            resume: {
                ...prev.resume,
                professionalExperience: [
                    { jobTitle: { text: '' }, company: { text: '' }, description: '', currentStatus: 'Working' },
                    ...(prev.resume?.professionalExperience || [])
                ]
            }
        }));
    };

    const removeExperience = (index: number) => {
        const newExp = [...experience];
        newExp.splice(index, 1);
        setFormData((prev: any) => ({
            ...prev,
            resume: {
                ...prev.resume,
                professionalExperience: newExp
            }
        }));
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">

            {/* Confirmation Dialog Overlay */}
            {showConfirm && (
                <div className="absolute inset-0 z-[110] flex items-center justify-center bg-black/20 backdrop-blur-[2px] animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-600 max-w-sm w-full animate-in zoom-in-95">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Confirm Changes</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">Are you sure you want to update this profile? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowConfirm(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">Cancel</button>
                            <button onClick={confirmSave} className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-sm">Yes, Update</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 w-full max-w-5xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Edit Profile</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 overflow-y-auto shrink-0">
                        <nav className="p-4 space-y-1">
                            {['BASIC', 'SUMMARY', 'EXPERIENCE', 'EDUCATION', 'SKILLS'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveSection(tab)}
                                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === tab
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    {tab === 'BASIC' ? 'Basic Info' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content Form */}
                    <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-slate-800 custom-scrollbar">

                        {/* BASIC INFO TAB */}
                        {activeSection === 'BASIC' && (
                            <div className="space-y-6 max-w-2xl">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 border-b pb-2">Basic Information</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                                            value={profile.fullName || ''}
                                            onChange={(e) => updateProfile('fullName', e.target.value)}
                                        />
                                    </div>

                                    {/* Location */}
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Primary Location</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                                            value={profile.locations?.[0]?.text || ''}
                                            onChange={(e) => updateProfileArray('locations', 0, 'text', e.target.value)}
                                            placeholder="City, State, Country"
                                        />
                                    </div>

                                    {/* Emails (Primary) */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email (Primary)</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                                            value={profile.emails?.[0]?.text || ''}
                                            onChange={(e) => updateProfileArray('emails', 0, 'text', e.target.value)}
                                        />
                                    </div>

                                    {/* Phone (Primary) */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone (Primary)</label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                                            value={profile.phones?.[0]?.text || ''}
                                            onChange={(e) => updateProfileArray('phones', 0, 'text', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mt-6">
                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                        <strong>Note:</strong> Editing contact details here will update the secure database records. Verification may be required for new emails.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeSection === 'SUMMARY' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 border-b pb-2">Professional Summary</h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Summary Text</label>
                                    <textarea
                                        rows={8}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-2 focus:ring-emerald-500"
                                        value={summary.summary || ''}
                                        onChange={(e) => updateSummary('summary', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Experience (Years)</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-2 focus:ring-emerald-500"
                                            value={summary.yearsOfExperience?.finalYears || ''}
                                            onChange={(e) => setFormData((prev: any) => ({
                                                ...prev,
                                                resume: { ...prev.resume, professionalSummary: { ...prev.resume.professionalSummary, yearsOfExperience: { ...prev.resume.professionalSummary?.yearsOfExperience, finalYears: e.target.value } } }
                                            }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'EXPERIENCE' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b pb-2 mb-4">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Work Experience</h3>
                                    <button onClick={addExperience} className="flex items-center gap-2 text-sm text-emerald-600 font-bold hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
                                        <Plus size={16} /> Add Position
                                    </button>
                                </div>
                                {experience.map((exp: any, idx: number) => (
                                    <div key={idx} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3 relative group bg-slate-50 dark:bg-slate-900/50">
                                        <button onClick={() => removeExperience(idx)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded">
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase">Job Title</label>
                                                <input
                                                    type="text"
                                                    className="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 focus:ring-1 focus:ring-emerald-500"
                                                    value={exp.jobTitle?.text || ''}
                                                    onChange={(e) => updateExperience(idx, 'jobTitle', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase">Company</label>
                                                <input
                                                    type="text"
                                                    className="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 focus:ring-1 focus:ring-emerald-500"
                                                    value={exp.company?.text || ''}
                                                    onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase">Description</label>
                                            <textarea
                                                className="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 focus:ring-1 focus:ring-emerald-500"
                                                rows={3}
                                                value={exp.description || ''}
                                                onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeSection === 'EDUCATION' && <div className="text-slate-500 italic p-4 text-center">Education editing coming in Phase 4...</div>}
                        {activeSection === 'SKILLS' && <div className="text-slate-500 italic p-4 text-center">Skills editing coming in Phase 4...</div>}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                    <button
                        onClick={handleSaveClick} // Use Confirmation Trigger
                        className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-sm flex items-center gap-2"
                        disabled={isSaving}
                    >
                        {isSaving ? <span className="animate-spin">⌛</span> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};
