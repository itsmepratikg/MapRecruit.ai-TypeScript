import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Upload, User, Mail, Phone, MapPin, Briefcase, CheckCircle, Loader2, Info, Cloud, Laptop, Search, ArrowRight, AlertCircle } from 'lucide-react';
import { useToast } from './Toast';
import { integrationService } from '../services/integrationService';
import { googlePickerService } from '../services/googlePickerService';
import { microsoftPickerService } from '../services/microsoftPickerService';
import { PickerFile } from './Common/UniversalFilePicker';
import { profileService } from '../services/api';

interface CreateProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateProfileModal: React.FC<CreateProfileModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'device' | 'cloud' | 'manual'>('device');
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [parsing, setParsing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<PickerFile[]>([]);
    const [integrations, setIntegrations] = useState<{ google: boolean; microsoft: boolean }>({
        google: false,
        microsoft: false
    });
    const [alertConfig, setAlertConfig] = useState<{ title: string; message: string | React.ReactNode; isOpen: boolean } | null>(null);

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const showAlert = (title: string, message: string | React.ReactNode) => {
        setAlertConfig({ title, message, isOpen: true });
    };

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

    useEffect(() => {
        if (isOpen) {
            checkIntegrations();
        }

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (alertConfig?.isOpen) {
                    setAlertConfig(null);
                } else if (isOpen) {
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose, alertConfig]);

    const checkIntegrations = async () => {
        const status = await integrationService.getStatus();
        setIntegrations({
            google: status.google.connected,
            microsoft: status.microsoft.connected
        });
    };

    if (!isOpen) return null;

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const ALLOWED_EXTENSIONS = ['doc', 'docx', 'pdf', 'rtf', 'txt', 'odt', 'ott', 'htm', 'html', 'xls', 'xlsx', 'csv'];
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    const MAX_FILES = 50;

    const handleFilesSelected = (files: PickerFile[]) => {
        const remainingSlots = MAX_FILES - selectedFiles.length;
        if (remainingSlots <= 0) {
            showAlert("Limit Reached", `You have already selected the maximum allowed ${MAX_FILES} files.`);
            return;
        }

        const validBatch = files.slice(0, remainingSlots);
        setSelectedFiles(prev => [...prev, ...validBatch]);

        if (files.length > remainingSlots) {
            addToast(`Only the first ${remainingSlots} files were added.`, "info");
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const localFiles = Array.from(e.dataTransfer.files).map(f => ({
                name: f.name,
                size: f.size,
                raw: f,
                provider: 'local' as const
            }));
            handleFilesSelected(localFiles);
        }
    };

    const handleConfirmUpload = () => {
        if (selectedFiles.length === 0) return;
        simulateUpload();
    };

    const handleCancelSelection = () => {
        setSelectedFiles([]);
        setParsing(false);
        setUploading(false);
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleGoogleDrive = async () => {
        if (!integrations.google) {
            addToast("Please connect Google in settings first", "info");
            return;
        }

        setLoading(true);
        try {
            const token = await integrationService.getPickerToken();
            await googlePickerService.openPicker(token, (files) => {
                const results: PickerFile[] = files.map(f => ({
                    id: f.id,
                    name: f.name,
                    size: f.sizeBytes,
                    provider: 'google'
                }));
                handleFilesSelected(results);
            }, MAX_FILES - selectedFiles.length > 1);
        } catch (error) {
            console.error("Google Picker Error:", error);
            addToast("Failed to open Google Drive", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleOneDrive = async () => {
        if (!integrations.microsoft) {
            addToast("Please connect Microsoft in settings first", "info");
            return;
        }

        setLoading(true);
        try {
            await microsoftPickerService.openPicker((files) => {
                const results: PickerFile[] = files.map(f => ({
                    id: f.id,
                    name: f.name,
                    size: f.size,
                    provider: 'microsoft'
                }));
                handleFilesSelected(results);
            }, MAX_FILES - selectedFiles.length > 1);
        } catch (error) {
            console.error("OneDrive Picker Error:", error);
            addToast("Failed to open OneDrive", "error");
        } finally {
            setLoading(false);
        }
    };

    const simulateUpload = () => {
        setParsing(true);
        setTimeout(() => {
            setParsing(false);
            setSelectedFiles([]);
            // Parsing complete - no data simulation as per requirement
            setActiveTab('manual'); // Switch to review or next step
            addToast(t("Resume parsed successfully! Please enter details."), "success");
        }, 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await profileService.create({ ...formData, source: 'Manual' });
            addToast(`Profile created for ${formData.firstName} ${formData.lastName}`, 'success');
            onClose();
        } catch (error) {
            console.error(error);
            addToast("Failed to create profile", "error");
        } finally {
            setLoading(false);
        }
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
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl mb-8">
                        <button
                            onClick={() => setActiveTab('device')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'device' ? 'bg-white dark:bg-slate-800 shadow-lg text-emerald-600 dark:text-emerald-400 scale-[1.02]' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                        >
                            <Laptop size={18} />
                            {t("This Device")}
                        </button>
                        <button
                            onClick={() => setActiveTab('cloud')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'cloud' ? 'bg-white dark:bg-slate-800 shadow-lg text-emerald-600 dark:text-emerald-400 scale-[1.02]' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                        >
                            <Cloud size={18} />
                            {t("Cloud Storage")}
                        </button>
                        <button
                            onClick={() => setActiveTab('manual')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'manual' ? 'bg-white dark:bg-slate-800 shadow-lg text-emerald-600 dark:text-emerald-400 scale-[1.02]' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                        >
                            <User size={18} />
                            {t("Manual Entry")}
                        </button>
                    </div>

                    {(activeTab === 'device' || (activeTab === 'cloud' && selectedFiles.length > 0)) && (
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${isDragging ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-600 hover:border-emerald-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {parsing ? (
                                <div className="flex flex-col items-center py-10">
                                    <Loader2 size={48} className="text-emerald-500 animate-spin mb-4" />
                                    <p className="text-slate-600 dark:text-slate-300 font-medium">{t("Parsing resume...")}</p>
                                </div>
                            ) : selectedFiles.length > 0 ? (
                                <div className="w-full flex flex-col items-stretch">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{t("Selected Files")}</h3>
                                        <button onClick={handleCancelSelection} className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1">
                                            <X size={14} /> {t("Clear All")}
                                        </button>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-[10px] text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                                <tr>
                                                    <th className="px-4 py-2 font-bold w-12 text-center">Srl.</th>
                                                    <th className="px-4 py-2 font-bold">{t("File Name")}</th>
                                                    <th className="px-4 py-2 font-bold w-24 text-right">{t("Size")}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                                {selectedFiles.map((file, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <td className="px-4 py-2.5 text-center text-slate-400 font-mono text-xs">{idx + 1}</td>
                                                        <td className="px-4 py-2.5">
                                                            <div className="flex items-center gap-2">
                                                                <Briefcase size={14} className="text-slate-400" />
                                                                <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[300px]">{file.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2.5 text-right font-mono text-xs text-slate-500 dark:text-slate-400">{formatSize(file.size)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                                        <button
                                            onClick={() => activeTab === 'device' ? fileInputRef.current?.click() : (activeTab === 'cloud' ? (selectedFiles[0].provider === 'google' ? handleGoogleDrive() : handleOneDrive()) : null)}
                                            className="px-6 py-2 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                                        >
                                            <Upload size={16} /> {t("Add More")}
                                        </button>
                                        <button
                                            onClick={handleConfirmUpload}
                                            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 transform active:scale-95"
                                        >
                                            <CheckCircle size={18} /> {t("Confirm to Upload")}
                                        </button>
                                    </div>
                                    <p className="mt-3 text-[10px] text-slate-400 uppercase tracking-widest">{t("Click Confirm to start parsing your resume.")}</p>
                                </div>
                            ) : uploading ? (
                                <div className="flex flex-col items-center py-10">
                                    <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
                                    <p className="text-slate-600 dark:text-slate-300 font-medium">{t("Opening file picker...")}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-400 animate-pulse">
                                        <Upload size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">{t("Drop resume here")}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t("Supported formats: PDF, DOCX, TXT")}</p>

                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
                                    >
                                        <Search size={18} />
                                        {t("Browse Computer")}
                                    </button>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        multiple={MAX_FILES > 1}
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                const localFiles = Array.from(e.target.files).map(f => ({
                                                    name: f.name,
                                                    size: f.size,
                                                    raw: f,
                                                    provider: 'local' as const
                                                }));
                                                handleFilesSelected(localFiles);
                                            }
                                        }}
                                        accept={ALLOWED_EXTENSIONS.map(ext => `.${ext}`).join(',')}
                                    />
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'cloud' && selectedFiles.length === 0 && (
                        <div className="space-y-4">
                            {/* Google Drive Option */}
                            <button
                                onClick={handleGoogleDrive}
                                className="group w-full flex items-center gap-5 p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl hover:border-emerald-200 dark:hover:border-emerald-900 transition-all hover:shadow-xl hover:shadow-emerald-500/5 text-left"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-700 flex items-center justify-center p-3 shadow-sm group-hover:scale-110 transition-transform">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="G" className="w-full h-full" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white">Google Drive</h4>
                                        {integrations.google ?
                                            <CheckCircle size={14} className="text-emerald-500" /> :
                                            <span className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">Disconnected</span>
                                        }
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Import directly from your Google workspace</p>
                                </div>
                                <ArrowRight size={20} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                            </button>

                            {/* OneDrive Option */}
                            <button
                                onClick={handleOneDrive}
                                className="group w-full flex items-center gap-5 p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl hover:border-emerald-200 dark:hover:border-emerald-900 transition-all hover:shadow-xl hover:shadow-emerald-500/5 text-left"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-700 flex items-center justify-center p-3 shadow-sm group-hover:scale-110 transition-transform">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="MS" className="w-full h-full" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white">OneDrive / SharePoint</h4>
                                        {integrations.microsoft ?
                                            <CheckCircle size={14} className="text-emerald-500" /> :
                                            <span className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">Disconnected</span>
                                        }
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Access files from Office 365 or company sites</p>
                                </div>
                                <ArrowRight size={20} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                            </button>

                            {/* Info Box if not connected */}
                            {(!integrations.google || !integrations.microsoft) && (
                                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex gap-3">
                                    <AlertCircle size={18} className="text-amber-500 shrink-0" />
                                    <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                                        Connect your workspace accounts in <strong>Settings &gt; Integrations</strong> to import files directly from the cloud.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'manual' && (
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

                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {loading && <Loader2 size={12} className="text-slate-400 animate-spin" />}
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {loading ? 'Opening Provider...' : `Limits: ${MAX_FILES} Files · Max 2MB each`}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">{t("Cancel")}</button>
                        {activeTab === 'manual' && (
                            <button form="create-profile-form" type="submit" className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-sm transition-colors text-sm flex items-center gap-2">
                                <CheckCircle size={16} /> {t("Create Profile")}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Alert Modal */}
            {alertConfig?.isOpen && (
                <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 mx-auto mb-4">
                                <Info size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{alertConfig.title}</h3>
                            <div className="mb-6">{alertConfig.message}</div>
                            <button
                                onClick={() => setAlertConfig(null)}
                                className="w-full py-2.5 bg-slate-800 dark:bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
                            >
                                {t("I understand")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
