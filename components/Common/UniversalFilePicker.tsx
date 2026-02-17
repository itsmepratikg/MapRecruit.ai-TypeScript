import React, { useState, useEffect, useRef } from 'react';
import {
    X,
    Upload,
    Cloud,
    Laptop,
    CheckCircle,
    AlertCircle,
    Loader2,
    ArrowRight,
    Search,
    FileText,
    Image as ImageIcon,
    FileCode,
    File as FileIcon
} from 'lucide-react';
import { integrationService } from '../../services/integrationService';
import { googlePickerService } from '../../services/googlePickerService';
import { microsoftPickerService } from '../../services/microsoftPickerService';
import { useToast } from '../Toast';

export interface PickerFile {
    name: string;
    size: number;
    id?: string;
    raw?: File;
    provider: 'google' | 'microsoft' | 'local';
    url?: string; // Download URL if available
}

interface UniversalFilePickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (files: PickerFile[]) => void;
    allowedExtensions?: string[];
    maxFiles?: number;
    maxSizeMB?: number;
    title?: string;
    description?: string;
}

export const UniversalFilePicker: React.FC<UniversalFilePickerProps> = ({
    isOpen,
    onClose,
    onSelect,
    allowedExtensions = ['pdf', 'doc', 'docx', 'txt'],
    maxFiles = 10,
    maxSizeMB = 5,
    title = "Select Files",
    description = "Choose files from your device or cloud storage"
}) => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'local' | 'cloud'>('local');
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [integrations, setIntegrations] = useState<{ google: boolean; microsoft: boolean }>({
        google: false,
        microsoft: false
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const MAX_FILE_SIZE = maxSizeMB * 1024 * 1024;

    useEffect(() => {
        if (isOpen) {
            checkIntegrations();
        }

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen]);

    const checkIntegrations = async () => {
        const status = await integrationService.getStatus();
        setIntegrations({
            google: status.google.connected,
            microsoft: status.microsoft.connected
        });
    };

    const validateFiles = (files: File[]): { valid: PickerFile[], invalid: string[] } => {
        const valid: PickerFile[] = [];
        const invalid: string[] = [];

        files.forEach(file => {
            const ext = file.name.split('.').pop()?.toLowerCase() || '';
            const isAllowed = allowedExtensions.includes(ext);
            const isUnderLimit = file.size <= MAX_FILE_SIZE;

            if (isAllowed && isUnderLimit) {
                valid.push({
                    name: file.name,
                    size: file.size,
                    raw: file,
                    provider: 'local'
                });
            } else {
                if (!isAllowed) invalid.push(`${file.name}: Format not supported`);
                else if (!isUnderLimit) invalid.push(`${file.name}: Larger than ${maxSizeMB}MB`);
            }
        });

        return { valid, invalid };
    };

    const handleLocalSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const { valid, invalid } = validateFiles(Array.from(e.target.files));
            if (invalid.length > 0) {
                addToast(invalid[0], 'error');
            }
            if (valid.length > 0) {
                onSelect(valid.slice(0, maxFiles));
                onClose();
            }
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            const { valid, invalid } = validateFiles(Array.from(e.dataTransfer.files));
            if (invalid.length > 0) {
                addToast(invalid[0], 'error');
            }
            if (valid.length > 0) {
                onSelect(valid.slice(0, maxFiles));
                onClose();
            }
        }
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
                onSelect(results);
                onClose();
            }, maxFiles > 1);
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
                onSelect(results);
                onClose();
            }, maxFiles > 1);
        } catch (error) {
            console.error("OneDrive Picker Error:", error);
            addToast("Failed to open OneDrive", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const getFileIcon = (ext: string) => {
        if (['pdf'].includes(ext)) return <FileText className="text-red-500" />;
        if (['doc', 'docx'].includes(ext)) return <FileIcon className="text-blue-500" />;
        if (['png', 'jpg', 'jpeg'].includes(ext)) return <ImageIcon className="text-emerald-500" />;
        return <FileCode className="text-slate-500" />;
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Tabs */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl mb-8">
                        <button
                            onClick={() => setActiveTab('local')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'local' ? 'bg-white dark:bg-slate-800 shadow-md text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                        >
                            <Laptop size={16} />
                            This Device
                        </button>
                        <button
                            onClick={() => setActiveTab('cloud')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'cloud' ? 'bg-white dark:bg-slate-800 shadow-md text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                        >
                            <Cloud size={16} />
                            Cloud Storage
                        </button>
                    </div>

                    {activeTab === 'local' ? (
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center text-center ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}
                        >
                            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/40 rounded-full flex items-center justify-center mb-6 text-blue-500 animate-pulse">
                                <Upload size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Drag and drop files</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-[200px]">
                                or click browse to select from your storage
                            </p>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
                            >
                                <Search size={18} />
                                Browse Computer
                            </button>

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                multiple={maxFiles > 1}
                                onChange={handleLocalSelect}
                                accept={allowedExtensions.map(ext => `.${ext}`).join(',')}
                            />

                            <div className="mt-8 flex flex-wrap justify-center gap-3">
                                {allowedExtensions.slice(0, 4).map(ext => (
                                    <div key={ext} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                                        {getFileIcon(ext)}
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">{ext}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 py-4">
                            {/* Google Drive Option */}
                            <button
                                onClick={handleGoogleDrive}
                                className="group flex items-center gap-5 p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl hover:border-blue-200 dark:hover:border-blue-900 transition-all hover:shadow-xl hover:shadow-blue-500/5 text-left"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-700 flex items-center justify-center p-3 shadow-sm group-hover:scale-110 transition-transform">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="G" className="w-full h-full" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white">Google Drive</h4>
                                        {integrations.google ?
                                            <CheckCircle size={14} className="text-emerald-500" /> :
                                            <span className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-0.5 rounded-full font-bold">DISCONNECTED</span>
                                        }
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Import directly from your Google workspace</p>
                                </div>
                                <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                            </button>

                            {/* OneDrive Option */}
                            <button
                                onClick={handleOneDrive}
                                className="group flex items-center gap-5 p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl hover:border-blue-200 dark:hover:border-blue-900 transition-all hover:shadow-xl hover:shadow-blue-500/5 text-left"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-700 flex items-center justify-center p-3 shadow-sm group-hover:scale-110 transition-transform">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="MS" className="w-full h-full" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white">OneDrive / SharePoint</h4>
                                        {integrations.microsoft ?
                                            <CheckCircle size={14} className="text-emerald-500" /> :
                                            <span className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-0.5 rounded-full font-bold">DISCONNECTED</span>
                                        }
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Access files from Office 365 or company sites</p>
                                </div>
                                <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
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
                </div>

                {/* Footer Info */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/30 flex items-center gap-2">
                    <Loader2 size={12} className={`text-slate-400 animate-spin ${loading ? 'opacity-100' : 'opacity-0'}`} />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {loading ? 'Opening Provider...' : `Limits: ${maxFiles} Files · Max ${maxSizeMB}MB each`}
                    </p>
                </div>
            </div>
        </div>
    );
};
