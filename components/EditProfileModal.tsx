import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, GripVertical, CheckCircle, AlertCircle, Trash, Award, BookOpen, User, Hash, Mail, Phone } from './Icons';
import { useToast } from './Toast';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any; // Full profile object
    onSave: (updatedData: any) => Promise<void>;
    initialTab?: string;
}

export const EditProfileModal = ({ isOpen, onClose, data, onSave, initialTab = 'BASIC' }: EditProfileModalProps) => {
    const { addToast } = useToast();
    const [formData, setFormData] = useState<any>(null);
    const [activeSection, setActiveSection] = useState(initialTab);
    const [isSaving, setIsSaving] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

    if (!isOpen || !formData) return null;

    const resume = formData.resume || {};
    const profile = resume.profile || {};
    const summary = resume.professionalSummary || {};
    const experience = resume.professionalExperience || [];
    const education = resume.professionalQualification?.education || [];
    const skills = resume.professionalQualification?.skills || [];
    const customData = formData.customData || {};

    const handleSaveClick = () => setShowConfirm(true);

    const confirmSave = async () => {
        try {
            setIsSaving(true);
            setShowConfirm(false);
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error("Save failed", error);
            addToast("Failed to save changes", "error");
        } finally {
            setIsSaving(false);
        }
    };

    // --- GENERIC HELPERS ---
    const updateNested = (path: string[], value: any) => {
        setFormData((prev: any) => {
            const next = { ...prev };
            let current = next;
            for (let i = 0; i < path.length - 1; i++) {
                current[path[i]] = { ...(current[path[i]] || {}) };
                current = current[path[i]];
            }
            current[path[path.length - 1]] = value;
            return next;
        });
    };

    // --- CONTACT MANAGEMENT ---
    const addContact = (type: 'emails' | 'phones') => {
        const current = [...(profile[type] || [])];
        const newItem = type === 'emails'
            ? { text: '', type: 'Personal', subscribeStatus: 'Subscribed', preferred: current.length === 0 ? 'Yes' : 'No' }
            : { text: '', type: 'Mobile', subscribeStatus: 'Subscribed', preferred: current.length === 0 ? 'Yes' : 'No', DNDStatus: 'Subscribed' };

        updateNested(['resume', 'profile', type], [...current, newItem]);
    };

    const removeContact = (type: 'emails' | 'phones', index: number) => {
        const current = [...(profile[type] || [])];
        current.splice(index, 1);
        // Ensure at least one primary if list not empty
        if (current.length > 0 && !current.some(i => i.preferred === 'Yes')) {
            current[0].preferred = 'Yes';
        }
        updateNested(['resume', 'profile', type], current);
    };

    const toggleOptStatus = (type: 'emails' | 'phones', index: number) => {
        const current = [...(profile[type] || [])];
        const item = { ...current[index] };
        const field = type === 'emails' ? 'subscribeStatus' : 'DNDStatus';
        item[field] = item[field] === 'Unsubscribed' ? 'Subscribed' : 'Unsubscribed';
        if (type === 'phones') item.subscribeStatus = item.DNDStatus; // Keep synced
        current[index] = item;
        updateNested(['resume', 'profile', type], current);
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, index: number, type: 'emails' | 'phones') => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const current = [...(profile[type] || [])];
        const item = current[draggedIndex];
        current.splice(draggedIndex, 1);
        current.splice(index, 0, item);

        // Auto-update Primary tag based on order (first item is primary)
        current.forEach((item, idx) => {
            item.preferred = idx === 0 ? 'Yes' : 'No';
            item.type = idx === 0 ? 'Primary' : (item.type === 'Primary' ? 'Alternative' : item.type);
        });

        setDraggedIndex(index);
        updateNested(['resume', 'profile', type], current);
    };

    // --- EDUCATION & SKILLS ---
    const addEducation = () => {
        const current = [...education];
        updateNested(['resume', 'professionalQualification', 'education'], [
            { degree: { text: '' }, university: { text: '' }, currentStatus: 'Completed', startDate: { text: '' }, endDate: { text: '' } },
            ...current
        ]);
    };

    const addSkill = () => {
        const current = [...skills];
        updateNested(['resume', 'professionalQualification', 'skills'], [
            ...current,
            { text: '', yearsOfExperience: 0 }
        ]);
    };

    const addExperience = () => {
        const current = [...experience];
        updateNested(['resume', 'professionalExperience'], [
            {
                jobTitle: { text: '' },
                company: { text: '' },
                startDate: { text: '' },
                endDate: { text: '' },
                currentStatus: 'Working',
                description: ''
            },
            ...current
        ]);
    };

    const removeExperience = (index: number) => {
        const current = [...experience];
        current.splice(index, 1);
        updateNested(['resume', 'professionalExperience'], current);
    };

    // --- RENDER SECTIONS ---
    const renderBasicInfo = () => (
        <div className="space-y-6 max-w-2xl">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 border-b pb-2">Identification</h3>
            <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1 focus-within:text-emerald-500">Full Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                        value={profile.fullName || ''}
                        onChange={(e) => updateNested(['resume', 'profile', 'fullName'], e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">First Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 transition-all outline-none"
                        value={profile.firstName || ''}
                        onChange={(e) => updateNested(['resume', 'profile', 'firstName'], e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Last Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 transition-all outline-none"
                        value={profile.lastName || ''}
                        onChange={(e) => updateNested(['resume', 'profile', 'lastName'], e.target.value)}
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Primary Location</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 transition-all outline-none"
                        value={profile.locations?.[0]?.text || ''}
                        onChange={(e) => {
                            const locs = [...(profile.locations || [])];
                            if (!locs[0]) locs[0] = { text: '' };
                            locs[0].text = e.target.value;
                            updateNested(['resume', 'profile', 'locations'], locs);
                        }}
                    />
                </div>
            </div>
        </div>
    );

    const renderContactList = (type: 'emails' | 'phones') => {
        const items = profile[type] || [];
        const label = type === 'emails' ? 'Email Address' : 'Phone Number';
        const optField = type === 'emails' ? 'subscribeStatus' : 'DNDStatus';

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/40 p-3 rounded-t-lg border border-b-0 border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-2">
                        {type === 'emails' ? <Mail size={16} /> : <Phone size={16} />} {label}s
                    </h4>
                    <button onClick={() => addContact(type)} className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:text-emerald-700">
                        <Plus size={14} /> Add New
                    </button>
                </div>
                <div className="space-y-2">
                    {items.length > 0 ? items.map((item: any, idx: number) => (
                        <div
                            key={idx}
                            draggable
                            onDragStart={(e) => handleDragStart(e, idx)}
                            onDragOver={(e) => handleDragOver(e, idx, type)}
                            onDragEnd={() => setDraggedIndex(null)}
                            className={`relative flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border shadow-sm transition-all ${draggedIndex === idx ? 'opacity-50 ring-2 ring-emerald-500' : 'hover:border-emerald-300 dark:hover:border-emerald-700'}`}
                        >
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-10">
                                {idx === 0 && (
                                    <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded-lg uppercase shadow-sm">Primary</span>
                                )}
                            </div>
                            <div className="cursor-grab text-slate-400 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"><GripVertical size={16} /></div>

                            <div className="flex-1 grid grid-cols-12 gap-3 items-center">
                                <div className="col-span-6">
                                    <input
                                        type="text"
                                        placeholder={`Enter ${label.toLowerCase()}`}
                                        className="w-full bg-transparent text-sm font-medium border-b border-transparent focus:border-emerald-500 outline-none p-1"
                                        value={item.text || ''}
                                        onChange={(e) => {
                                            const current = [...items];
                                            current[idx] = { ...current[idx], text: e.target.value };
                                            updateNested(['resume', 'profile', type], current);
                                        }}
                                    />
                                </div>
                                <div className="col-span-3 flex items-center gap-2">
                                    <select
                                        className="bg-slate-50 dark:bg-slate-900 text-[10px] font-bold uppercase p-1.5 rounded border border-slate-200 dark:border-slate-700 outline-none w-full"
                                        value={item.type || 'Personal'}
                                        onChange={(e) => {
                                            const current = [...items];
                                            current[idx] = { ...current[idx], type: e.target.value };
                                            updateNested(['resume', 'profile', type], current);
                                        }}
                                    >
                                        <option value="Primary">Primary</option>
                                        <option value="Personal">Personal</option>
                                        <option value="Work">Work</option>
                                        <option value="Alternative">Alternative</option>
                                        <option value="Mobile">Mobile</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="col-span-2 flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => toggleOptStatus(type, idx)}
                                        className={`transition-colors p-1.5 rounded-full ${item[optField] === 'Unsubscribed' ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-green-500 bg-green-50 dark:bg-green-900/20'}`}
                                        title={item[optField] === 'Unsubscribed' ? 'Opted Out' : 'Opted In'}
                                    >
                                        {item[optField] === 'Unsubscribed' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                                    </button>
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <button onClick={() => removeContact(type, idx)} className="text-slate-300 hover:text-red-500 transition-colors p-1"><Trash size={16} /></button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center p-8 bg-slate-50/50 dark:bg-slate-900/20 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 italic text-slate-400 text-sm">
                            No {label.toLowerCase()}s added yet.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderExperience = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Work History</h3>
                <button onClick={addExperience} className="flex items-center gap-2 text-sm text-emerald-600 font-bold hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors border border-emerald-100">
                    <Plus size={16} /> Add Position
                </button>
            </div>
            {experience.map((exp: any, idx: number) => (
                <div key={idx} className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl space-y-4 relative group bg-white dark:bg-slate-900 shadow-sm">
                    <button onClick={() => removeExperience(idx)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <Trash2 size={18} />
                    </button>
                    <div className="grid grid-cols-2 gap-4 mr-10">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Job Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-1 focus:ring-emerald-500 outline-none"
                                value={exp.jobTitle?.text || ''}
                                onChange={(e) => {
                                    const current = [...experience];
                                    current[idx] = { ...current[idx], jobTitle: { ...current[idx].jobTitle, text: e.target.value } };
                                    updateNested(['resume', 'professionalExperience'], current);
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-1 focus:ring-emerald-500 outline-none"
                                value={exp.company?.text || ''}
                                onChange={(e) => {
                                    const current = [...experience];
                                    current[idx] = { ...current[idx], company: { ...current[idx].company, text: e.target.value } };
                                    updateNested(['resume', 'professionalExperience'], current);
                                }}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start Date</label>
                                <input type="text" placeholder="Jan 2020" className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-sm" value={exp.startDate?.text || ''} onChange={(e) => {
                                    const current = [...experience];
                                    current[idx] = { ...current[idx], startDate: { ...current[idx].startDate, text: e.target.value } };
                                    updateNested(['resume', 'professionalExperience'], current);
                                }} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">End Date</label>
                                <input type="text" placeholder="Present" className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-sm" value={exp.endDate?.text || ''} onChange={(e) => {
                                    const current = [...experience];
                                    current[idx] = { ...current[idx], endDate: { ...current[idx].endDate, text: e.target.value } };
                                    updateNested(['resume', 'professionalExperience'], current);
                                }} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                            <select className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-sm" value={exp.currentStatus || 'Completed'} onChange={(e) => {
                                const current = [...experience];
                                current[idx] = { ...current[idx], currentStatus: e.target.value };
                                updateNested(['resume', 'professionalExperience'], current);
                            }}>
                                <option value="Working">Currently Working</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role Description</label>
                        <textarea
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
                            rows={4}
                            value={exp.description || ''}
                            onChange={(e) => {
                                const current = [...experience];
                                current[idx] = { ...current[idx], description: e.target.value };
                                updateNested(['resume', 'professionalExperience'], current);
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );

    const renderEducation = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Education</h3>
                <button onClick={addEducation} className="flex items-center gap-2 text-sm text-emerald-600 font-bold hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors border border-emerald-100">
                    <Plus size={16} /> Add Education
                </button>
            </div>
            {education.map((edu: any, idx: number) => (
                <div key={idx} className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl space-y-4 relative group bg-white dark:bg-slate-900 shadow-sm">
                    <button onClick={() => {
                        const current = [...education];
                        current.splice(idx, 1);
                        updateNested(['resume', 'professionalQualification', 'education'], current);
                    }} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <Trash2 size={18} />
                    </button>
                    <div className="flex gap-4 items-start">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400"><BookOpen size={20} /></div>
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Degree / Certification</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-1 focus:ring-emerald-500 outline-none font-bold"
                                    value={edu.degree?.text || ''}
                                    onChange={(e) => {
                                        const current = [...education];
                                        current[idx] = { ...current[idx], degree: { ...current[idx].degree, text: e.target.value } };
                                        updateNested(['resume', 'professionalQualification', 'education'], current);
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">University / School</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent transition-all outline-none"
                                    value={edu.university?.text || ''}
                                    onChange={(e) => {
                                        const current = [...education];
                                        current[idx] = { ...current[idx], university: { ...current[idx].university, text: e.target.value } };
                                        updateNested(['resume', 'professionalQualification', 'education'], current);
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Campus / Location</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent transition-all outline-none"
                                    value={edu.campus?.text || ''}
                                    onChange={(e) => {
                                        const current = [...education];
                                        current[idx] = { ...current[idx], campus: { ...current[idx].campus, text: e.target.value } };
                                        updateNested(['resume', 'professionalQualification', 'education'], current);
                                    }}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start Year</label>
                                    <input type="text" className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-sm" value={edu.startDate?.text || ''} onChange={(e) => {
                                        const current = [...education];
                                        current[idx] = { ...current[idx], startDate: { ...current[idx].startDate, text: e.target.value } };
                                        updateNested(['resume', 'professionalQualification', 'education'], current);
                                    }} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">End Year</label>
                                    <input type="text" className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-sm" value={edu.endDate?.text || ''} onChange={(e) => {
                                        const current = [...education];
                                        current[idx] = { ...current[idx], endDate: { ...current[idx].endDate, text: e.target.value } };
                                        updateNested(['resume', 'professionalQualification', 'education'], current);
                                    }} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Result (GPA / %)</label>
                                <input type="text" className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-sm" value={edu.merit?.percentage || edu.merit?.GPA || ''} onChange={(e) => {
                                    const current = [...education];
                                    current[idx] = { ...current[idx], merit: { ...current[idx].merit, percentage: e.target.value } };
                                    updateNested(['resume', 'professionalQualification', 'education'], current);
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderSkills = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4 mb-4">
                <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-200">Skills & Competencies</h3>
                    <p className="text-xs text-slate-500 mt-1">Manage core competencies and expertise levels.</p>
                </div>
                <button
                    onClick={addSkill}
                    className="flex items-center gap-2 text-sm bg-emerald-600 text-white font-bold hover:bg-emerald-700 px-4 py-2 rounded-xl transition-all shadow-lg shadow-emerald-200 dark:shadow-none active:scale-95"
                >
                    <Plus size={16} /> Add New Skill
                </button>
            </div>

            <div className="flex flex-wrap gap-3">
                {skills.map((skill: any, idx: number) => (
                    <div
                        key={idx}
                        className="group flex items-center gap-2 pl-3 pr-1 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-emerald-500 dark:hover:border-emerald-500 transition-all"
                    >
                        <div className="flex items-center gap-1.5 min-w-[80px]">
                            <input
                                className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none w-full placeholder:font-normal placeholder:text-slate-300"
                                value={skill.text || ''}
                                placeholder="Skill name..."
                                onChange={(e) => {
                                    const current = [...skills];
                                    current[idx] = { ...current[idx], text: e.target.value };
                                    updateNested(['resume', 'professionalQualification', 'skills'], current);
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-1 px-2 border-l border-slate-100 dark:border-slate-700">
                            <input
                                type="number"
                                step="0.5"
                                className="w-10 bg-transparent text-[11px] font-black text-emerald-600 dark:text-emerald-400 outline-none text-center"
                                value={skill.yearsOfExperience || 0}
                                onChange={(e) => {
                                    const current = [...skills];
                                    current[idx] = { ...current[idx], yearsOfExperience: parseFloat(e.target.value) };
                                    updateNested(['resume', 'professionalQualification', 'skills'], current);
                                }}
                            />
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">yr</span>
                        </div>
                        <button
                            onClick={() => {
                                const current = [...skills];
                                current.splice(idx, 1);
                                updateNested(['resume', 'professionalQualification', 'skills'], current);
                            }}
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}

                {skills.length === 0 && (
                    <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400">
                        <Award size={32} className="mb-2 opacity-20" />
                        <p className="text-sm">No skills added yet.</p>
                        <button onClick={addSkill} className="text-emerald-500 font-bold text-xs mt-2 hover:underline">Click to add your first skill</button>
                    </div>
                )}
            </div>
        </div>
    );

    const renderCustomFields = () => {
        // Find all client custom data keys
        const allKeys = Object.keys(customData);
        if (allKeys.length === 0) return (
            <div className="text-center p-12 text-slate-400 italic">No custom fields defined for this profile.</div>
        );

        return (
            <div className="space-y-8">
                {allKeys.map((clientId) => {
                    const fields = customData[clientId] || {};
                    const fieldIds = Object.keys(fields);
                    if (fieldIds.length === 0) return null;

                    return (
                        <div key={clientId} className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-2 flex items-center gap-2">
                                <Hash size={14} /> Client Context: {clientId.slice(-6)}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                {fieldIds.map((fieldId) => {
                                    const field = fields[fieldId];
                                    return (
                                        <div key={fieldId} className="flex flex-col gap-1">
                                            <label className="text-xs font-bold text-slate-500">{field.label || 'Custom Field'}</label>
                                            {field.format === 'Boolean' ? (
                                                <div className="flex items-center gap-3 py-2">
                                                    <button
                                                        onClick={() => {
                                                            const current = { ...customData };
                                                            current[clientId][fieldId].value = !current[clientId][fieldId].value;
                                                            updateNested(['customData'], current);
                                                        }}
                                                        className={`w-10 h-5 rounded-full transition-colors relative ${field.value ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                                                    >
                                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${field.value ? 'left-6' : 'left-1'}`}></div>
                                                    </button>
                                                    <span className="text-sm font-medium text-slate-600">{field.value ? 'Yes' : 'No'}</span>
                                                </div>
                                            ) : field.format === 'Number' ? (
                                                <input
                                                    type="number"
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm"
                                                    value={field.value || 0}
                                                    onChange={(e) => {
                                                        const current = { ...customData };
                                                        current[clientId][fieldId].value = parseFloat(e.target.value);
                                                        updateNested(['customData'], current);
                                                    }}
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm"
                                                    value={field.value || ''}
                                                    onChange={(e) => {
                                                        const current = { ...customData };
                                                        current[clientId][fieldId].value = e.target.value;
                                                        updateNested(['customData'], current);
                                                    }}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">

            {showConfirm && (
                <div className="absolute inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-[2px] animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-600 max-w-sm w-full animate-in zoom-in-95">
                        <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4 text-amber-600">
                            <Save size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-slate-200 mb-2">Save Profile Changes?</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed">You are about to update the candidate's core record. These changes will be reflected across all linked campaigns.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-3 text-slate-600 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all">Go Back</button>
                            <button onClick={confirmSave} className="flex-1 px-4 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 dark:shadow-none active:scale-95 transition-all">Yes, Save</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
                {/* Header */}
                <div className="px-8 py-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600"><User size={20} /></div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 dark:text-slate-200">Modify Professional Profile</h2>
                            <p className="text-xs text-slate-400 font-medium">Update candidate information, experience, and custom metadata.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-72 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 overflow-y-auto shrink-0 p-4 space-y-1">
                        {[
                            { id: 'BASIC', label: 'Basic Identity', icon: <User size={16} /> },
                            { id: 'CONTACTS', label: 'Contact Methods', icon: <Mail size={16} /> },
                            { id: 'SUMMARY', label: 'Executive Summary', icon: <Plus size={16} /> },
                            { id: 'EXPERIENCE', label: 'Work History', icon: <Hash size={16} /> },
                            { id: 'EDUCATION', label: 'Academic Details', icon: <Award size={16} /> },
                            { id: 'SKILLS', label: 'Core Skills', icon: <CheckCircle size={16} /> },
                            { id: 'CUSTOM', label: 'Extension Fields', icon: <Plus size={16} /> },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSection(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all relative ${activeSection === tab.id
                                    ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm border border-slate-200 dark:border-slate-700 ring-1 ring-emerald-500/20'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                                {activeSection === tab.id && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>}
                            </button>
                        ))}
                    </div>

                    {/* Content Form */}
                    <div className="flex-1 p-10 overflow-y-auto bg-white dark:bg-slate-800 custom-scrollbar">
                        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-300">
                            {activeSection === 'BASIC' && renderBasicInfo()}
                            {activeSection === 'CONTACTS' && (
                                <div className="space-y-8">
                                    <div className="border-b pb-4 mb-6">
                                        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200">Manage Contact Points</h3>
                                        <p className="text-sm text-slate-500">Drag to reorder. The top item is automatically designated as <b>Primary</b>.</p>
                                    </div>
                                    {renderContactList('emails')}
                                    {renderContactList('phones')}
                                </div>
                            )}
                            {activeSection === 'SUMMARY' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 border-b pb-2">Professional Summary</h3>
                                    <textarea
                                        rows={12}
                                        className="w-full px-6 py-4 border border-slate-300 dark:border-slate-600 rounded-2xl bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-emerald-500 outline-none text-sm leading-relaxed"
                                        placeholder="Write a compelling summary..."
                                        value={summary.summary || ''}
                                        onChange={(e) => updateNested(['resume', 'professionalSummary', 'summary'], e.target.value)}
                                    />
                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
                                        <div className="flex items-center gap-3">
                                            <Award size={20} className="text-emerald-600" />
                                            <div>
                                                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase">Expertise Impact</p>
                                                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Detailed summaries improve profile match scores by up to 40%.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeSection === 'EXPERIENCE' && renderExperience()}
                            {activeSection === 'EDUCATION' && renderEducation()}
                            {activeSection === 'SKILLS' && renderSkills()}
                            {activeSection === 'CUSTOM' && (
                                <div className="space-y-6">
                                    <div className="border-b pb-4 mb-6">
                                        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200">Custom Attributes</h3>
                                        <p className="text-sm text-slate-500">View and edit organization-specific metadata fields.</p>
                                    </div>
                                    {renderCustomFields()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                    <div className="text-xs font-medium text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                        Editing: <span className="text-emerald-500 font-bold">{formData.resume?.profile?.fullName || 'Untitled Profile'}</span>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-all">Cancel</button>
                        <button
                            onClick={handleSaveClick}
                            className="px-8 py-2.5 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 shadow-xl shadow-emerald-200 dark:shadow-none flex items-center gap-2 active:scale-95 transition-all"
                            disabled={isSaving}
                        >
                            {isSaving ? <span className="animate-spin text-lg">⌛</span> : <Save size={18} />}
                            Update Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
