import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Upload, User, Mail, Phone, MapPin, Briefcase, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from './Toast';
import { integrationService } from '../services/integrationService';
import { googlePickerService } from '../services/googlePickerService';

interface CreateProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateProfileModal: React.FC<CreateProfileModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        title: '',
        company: '',
        location: '',
        source: 'Direct',
        skills: ''
    });

    if (!isOpen) return null;

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        simulateUpload(e.dataTransfer.files[0]?.name);
    };

    const simulateUpload = (fileName: string) => {
        setUploading(true);
        setTimeout(() => {
            setUploading(false);
            // Simulate parsing
            setFormData({
                firstName: 'Alex',
                lastName: 'Morgan',
                email: 'alex.morgan@example.com',
                phone: '+1 (555) 012-3456',
                title: 'Senior Software Engineer',
                company: 'TechFlow Inc.',
                location: 'San Francisco, CA',
                source: 'Upload',
                skills: 'React, TypeScript, Node.js'
            });
            setActiveTab('manual'); // Switch to review
            addToast("Resume parsed successfully! Please review details.", "success");
        }, 2000);
    };

    const handleGoogleDriveClick = async () => {
        try {
            const status = await integrationService.getStatus();
            if (!status.google.connected) {
                addToast("Please connect your Google Workspace in Settings first.", "info");
                return;
            }

            setUploading(true);
            const token = await integrationService.getPickerToken();

            await googlePickerService.openPicker(token, async (fileId, fileName) => {
                try {
                    const result = await integrationService.fetchDriveFile(fileId, fileName);
                    if (result.success) {
                        setFormData({
                            ...formData,
                            ...result.parsedData
                        });
                        setActiveTab('manual');
                        addToast(`Successfully imported ${fileName} from Google Drive!`, "success");
                    }
                } catch (error) {
                    console.error("Failed to fetch from Drive:", error);
                    addToast("Failed to fetch file from Google Drive", "error");
                } finally {
                    setUploading(false);
                }
            });

        } catch (error) {
            console.error("Google Drive Error:", error);
            addToast("Failed to open Google Drive picker", "error");
            setUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addToast(`Profile created for ${formData.firstName} ${formData.lastName}`, 'success');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t("Create New Profile")}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex gap-4 mb-6 border-b border-slate-100 dark:border-slate-700 pb-1">
                        <button
                            onClick={() => setActiveTab('upload')}
                            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'upload' ? 'border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            {t("Upload Resume")}
                        </button>
                        <button
                            onClick={() => setActiveTab('manual')}
                            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'manual' ? 'border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            {t("Manual Entry")}
                        </button>
                    </div>

                    {activeTab === 'upload' ? (
                        <div
                            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all ${isDragging ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-600 hover:border-emerald-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {uploading ? (
                                <div className="flex flex-col items-center">
                                    <Loader2 size={48} className="text-emerald-500 animate-spin mb-4" />
                                    <p className="text-slate-600 dark:text-slate-300 font-medium">{t("Parsing resume...")}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                        <Upload size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">{t("Drop resume here")}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t("Supported formats: PDF, DOCX, TXT")}</p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => (document.getElementById('resume-upload-input') as HTMLInputElement)?.click()}
                                            className="px-4 py-2 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-500 shadow-sm"
                                        >
                                            {t("Browse Files")}
                                        </button>
                                        <button
                                            onClick={handleGoogleDriveClick}
                                            className="px-4 py-2 bg-white dark:bg-slate-600 border border-blue-200 dark:border-blue-900 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 shadow-sm flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12.5,2L6,2C4.9,2,4,2.9,4,4V20C4,21.1,4.9,22,6,22H18C19.1,22,20,21.1,20,20V8L12.5,2M15,20H5V4H12V9H17V20H15M10,14H15V16H10V14M10,11H15V13H10V11M10,17H13V19H10V17Z" />
                                            </svg>
                                            {t("Google Drive")}
                                        </button>
                                        <input
                                            id="resume-upload-input"
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => e.target.files?.[0] && simulateUpload(e.target.files[0].name)}
                                            accept=".pdf,.docx,.txt"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <form id="create-profile-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t("First Name")} *</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-2.5 text-slate-400" />
                                    <input
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white dark:bg-slate-700 dark:text-slate-200"
                                        placeholder="John"
                                        autoComplete="given-name"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t("Last Name")} *</label>
                                <input
                                    required
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white dark:bg-slate-700 dark:text-slate-200"
                                    placeholder="Doe"
                                    autoComplete="family-name"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t("Email")} *</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-2.5 text-slate-400" />
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white dark:bg-slate-700 dark:text-slate-200"
                                        placeholder="john@example.com"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t("Phone")}</label>
                                <div className="relative">
                                    <Phone size={16} className="absolute left-3 top-2.5 text-slate-400" />
                                    <input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white dark:bg-slate-700 dark:text-slate-200"
                                        placeholder="+1 (555) 000-0000"
                                        autoComplete="tel"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t("Job Title")}</label>
                                <div className="relative">
                                    <Briefcase size={16} className="absolute left-3 top-2.5 text-slate-400" />
                                    <input
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white dark:bg-slate-700 dark:text-slate-200"
                                        placeholder="e.g. Software Engineer"
                                        autoComplete="organization-title"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t("Current Company")}</label>
                                <input
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white dark:bg-slate-700 dark:text-slate-200"
                                    placeholder="Current Employer"
                                    autoComplete="organization"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t("Location")}</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-3 top-2.5 text-slate-400" />
                                    <input
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white dark:bg-slate-700 dark:text-slate-200"
                                        placeholder="City, State"
                                        autoComplete="address-level2"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t("Skills (Comma separated)")}</label>
                                <textarea
                                    value={formData.skills}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none h-20 resize-none bg-white dark:bg-slate-700 dark:text-slate-200"
                                    placeholder="Java, Python, Leadership, etc."
                                />
                            </div>
                        </form>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">{t("Cancel")}</button>
                    {activeTab === 'manual' ? (
                        <button form="create-profile-form" type="submit" className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-sm transition-colors text-sm flex items-center gap-2">
                            <CheckCircle size={16} /> {t("Create Profile")}
                        </button>
                    ) : (
                        <button onClick={() => setActiveTab('manual')} className="px-6 py-2 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-200 font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors text-sm">
                            {t("Skip Upload")}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
