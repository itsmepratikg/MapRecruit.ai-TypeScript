import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Link as LinkIcon, Upload, FileText } from 'lucide-react';
import { CampaignTitle } from './CampaignTitle';
import { JobUrlFetcher } from './JobUrlFetcher';
import { JobDescriptionUpload } from './JobDescriptionUpload';
import { JobDescriptionEditor } from './JobDescriptionEditor';
import { GenerateJDButton } from './GenerateJDButton';

export type JDSource = 'AI' | 'URL' | 'UPLOAD' | 'MANUAL';

interface JDSourceStepProps {
    title: string;
    generatedHtml: string;
    selectedSource: JDSource | null;
    onTitleChange: (title: string) => void;
    onSourceSelect: (source: JDSource, data?: any) => void;
    onNext: () => void;
}

export const JDSourceStep: React.FC<JDSourceStepProps> = ({
    title,
    generatedHtml,
    selectedSource: initialSource,
    onTitleChange,
    onSourceSelect,
    onNext
}) => {
    const { t } = useTranslation();
    const [selectedSource, setSelectedSource] = useState<JDSource>(initialSource || 'AI');

    const sources = [
        { id: 'AI' as JDSource, title: t('AI Generation'), description: t('Smartly craft using AI'), icon: Sparkles, color: 'text-violet-600' },
        { id: 'URL' as JDSource, title: t('Import from URL'), description: t('Fetch from job board'), icon: LinkIcon, color: 'text-emerald-600' },
        { id: 'UPLOAD' as JDSource, title: t('Upload File'), description: t('PDF, Docx or Text'), icon: Upload, color: 'text-emerald-600' },
        { id: 'MANUAL' as JDSource, title: t('Manual Entry'), description: t('Write from scratch'), icon: FileText, color: 'text-amber-600' },
    ];

    const handleSourceClick = (source: JDSource) => {
        setSelectedSource(source);
        if (source === 'AI') {
            onSourceSelect('AI');
        }
    };

    return (
        <div className="h-full flex flex-col p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto custom-scrollbar">
            <div className="max-w-4xl mx-auto w-full space-y-8">
                {/* Campaign Title */}
                <CampaignTitle value={title} onChange={onTitleChange} />

                {/* Source Selection Tabs */}
                <div className="space-y-6">
                    <div className="flex border-b border-slate-200 dark:border-slate-800">
                        {sources.map((src) => (
                            <button
                                key={src.id}
                                onClick={() => handleSourceClick(src.id)}
                                className={`flex-1 flex flex-col items-center py-4 px-2 border-b-2 transition-all relative ${selectedSource === src.id
                                    ? 'border-emerald-600 text-emerald-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                    }`}
                            >
                                <src.icon size={20} className={`mb-2 ${selectedSource === src.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                                <span className="text-sm font-bold truncate w-full text-center">{src.title}</span>
                                <span className="text-[10px] text-slate-500 hidden md:block">{src.description}</span>
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[300px]">
                        <div className="p-8 animate-in fade-in slide-in-from-top-2 duration-300">
                            {selectedSource === 'AI' && (
                                <div className="flex flex-col items-center justify-center space-y-6 py-10">
                                    <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600">
                                        <Sparkles size={32} />
                                    </div>
                                    <div className="text-center max-w-sm">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">AI Job Generator</h3>
                                        <p className="text-sm text-slate-500 mt-2">Provide minimal details and let our AI craft a professional job description for you in seconds.</p>
                                    </div>
                                    <GenerateJDButton onClick={onNext} />
                                </div>
                            )}

                            {selectedSource === 'URL' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
                                            <LinkIcon size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Import from URL</h3>
                                            <p className="text-sm text-slate-500">Paste a link to an existing job posting on LinkedIn, Indeed, or your careers page.</p>
                                        </div>
                                    </div>
                                    <JobUrlFetcher
                                        onFetch={(data) => onSourceSelect('URL', data)}
                                    />
                                </div>
                            )}

                            {selectedSource === 'UPLOAD' && (
                                <div className="space-y-6 text-center py-6">
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                                            <Upload size={32} />
                                        </div>
                                        <div className="max-w-md">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Upload Job Description</h3>
                                            <p className="text-sm text-slate-500 mt-2">Simply drag and drop your PDF or Word document here to extract all relevant details automatically.</p>
                                        </div>
                                    </div>
                                    <JobDescriptionUpload
                                        onUpload={(file) => onSourceSelect('UPLOAD', file)}
                                    />
                                </div>
                            )}

                            {selectedSource === 'MANUAL' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between gap-3 mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Manual Entry</h3>
                                                <p className="text-sm text-slate-500">Write your job description from scratch or paste existing text.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={onNext}
                                            disabled={!generatedHtml || generatedHtml.length < 50}
                                            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            {t("Next: Review")}
                                        </button>
                                    </div>
                                    <JobDescriptionEditor
                                        value={generatedHtml}
                                        onChange={(html) => onSourceSelect('MANUAL', html)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
