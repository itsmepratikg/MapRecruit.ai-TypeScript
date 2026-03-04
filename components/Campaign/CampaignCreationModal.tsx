
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ArrowRight } from 'lucide-react';
import { JDSourceStep, JDSource } from './CreationSteps/JDSourceStep';
import { GenerateJDForm, GenerateJDFormState } from './Generator/GenerateJDForm';
import CampaignSettingsStep from './CreationSteps/CampaignSettingsStep';
import { MatchAIConfigStep } from './CreationSteps/MatchAIConfigStep';
import { EngageAIConfigStep } from './CreationSteps/EngageAIConfigStep';
import { SourceCandidatesStep } from './CreationSteps/SourceCandidatesStep';
import { CampaignService, CampaignSettings } from '../../services/CampaignService';
import { Campaign } from '../../types/Campaign';
import { useUserProfile } from '../../hooks/useUserProfile';
import { userService } from '../../services/api';
import toast from 'react-hot-toast';

interface CampaignCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Temporary Mock Users until data.ts is fully integrated
const MOCK_USERS = [
    { id: 'usr_123', name: 'Pratik G', email: 'pratik@maprecruit.ai' },
    { id: 'usr_456', name: 'Sarah Miller', email: 'sarah.m@example.com', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    { id: 'usr_789', name: 'Mike Ross', email: 'mike.r@example.com' },
    { id: 'usr_101', name: 'Jessica P', email: 'jessica.p@example.com', avatar: 'https://i.pravatar.cc/150?u=jessica' },
];

const INITIAL_SETTINGS: CampaignSettings = {
    openJob: true,
    visibility: 'All',
    campaignModules: {
        sourceAI: true,
        matchAI: true,
        engageAI: true
    },
    teams: {
        ownerID: ['usr_123'], // Default to current user
        managerID: [],
        recruiterID: []
    },
    jobPosting: {
        enabled: false,
        startDate: '',
        endDate: '',
        jobBoards: []
    }
};

export const CampaignCreationModal: React.FC<CampaignCreationModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { userProfile } = useUserProfile();

    // State for Wizard
    const [step, setStep] = useState<number>(0);
    const [campaignTitle, setCampaignTitle] = useState('');
    const [selectedSource, setSelectedSource] = useState<JDSource | null>(null);

    // State for Data
    const [jdFormData, setJdFormData] = useState<GenerateJDFormState | null>(null);
    const [generatedHtml, setGeneratedHtml] = useState<string>('');
    const [settings, setSettings] = useState<CampaignSettings>(INITIAL_SETTINGS);
    const [companyUsers, setCompanyUsers] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);
    const [createdCampaignId, setCreatedCampaignId] = useState<string | null>(null);

    // Close on ESC key
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const handleSourceSelect = (source: JDSource, data?: any) => {
        setSelectedSource(source);
        // Only auto-advance for sources that are fully "provided" on selection (URL fetch or Upload)
        // Manual and AI generation require further steps (typing or clicking Generate)
        if (source === 'URL' || source === 'UPLOAD') {
            if (typeof data === 'string') setGeneratedHtml(data);
            setStep(2);
        } else if (source === 'MANUAL') {
            if (typeof data === 'string') setGeneratedHtml(data);
            // Stay on step 0, wait for onNext call from component
        }
    };

    const handleJDSubmit = (html: string, formData: GenerateJDFormState) => {
        setGeneratedHtml(html);
        setJdFormData(formData);
        setStep(2);
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(selectedSource === 'AI' ? 1 : 0);
        } else if (step === 3) {
            setStep(2);
        } else if (step === 4) {
            // Check if Step 3 was skipped
            if (!settings.campaignModules.matchAI) {
                setStep(2);
            } else {
                setStep(3);
            }
        } else if (step === 5) {
            if (!settings.campaignModules.engageAI) {
                if (!settings.campaignModules.matchAI) setStep(2);
                else setStep(3);
            } else {
                setStep(4);
            }
        } else if (step === 1) {
            setStep(0);
        } else {
            onClose();
        }
    };

    const handleStep2Complete = async () => {
        setSaving(true);
        try {
            const payload: Partial<Campaign> = CampaignService.createCampaignPayload(
                jdFormData || {} as any,
                campaignTitle || jdFormData?.jobTitle || "Untitled Campaign",
                generatedHtml,
                settings,
                userProfile
            );

            const result = await CampaignService.saveCampaign(payload);

            if (result.success && result.data?._id) {
                setCreatedCampaignId(result.data._id);
                toast.success("Campaign Job Created!");

                // Decide next step
                if (settings.campaignModules.matchAI) {
                    setStep(3);
                } else if (settings.campaignModules.engageAI) {
                    setStep(4);
                } else {
                    setStep(5);
                }
            } else {
                toast.error("Failed to create campaign base.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred.");
        } finally {
            setSaving(false);
        }
    };

    const handleStep3Complete = () => {
        if (settings.campaignModules.engageAI) {
            setStep(4);
        } else {
            setStep(5);
        }
    };

    const handleStep4Complete = () => {
        setStep(5);
    };

    const handleFinalize = () => {
        if (createdCampaignId) {
            window.location.href = `/showcampaign/intelligence/${createdCampaignId}`;
        } else {
            onClose();
        }
    };

    // --- Stepper Visualization ---
    const steps = [
        { label: 'Source', desc: 'Select JD Source' },
        { label: 'Details', desc: 'Review & Teams' },
        { label: 'Match AI', desc: 'Matching Config' },
        { label: 'Engage AI', desc: 'Screening Rounds' },
        { label: 'Source', desc: 'Finish & Source' }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 lg:p-8 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-6xl h-full max-h-[92vh] rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden relative border border-slate-200 dark:border-slate-800">

                {/* --- Visual Flow Stepper (Header) --- */}
                <div className="px-8 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900 z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-400 dark:to-emerald-500">
                                {t("Create New Campaign")}
                            </h2>
                            <p className="text-sm text-slate-500 font-medium">Step {Math.min(step + 1, 5)} of 5: {steps[Math.min(step, 4)].desc}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
                            title="Close (Esc)"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="relative flex justify-between">
                        {/* Progress Bar Background */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2" />
                        {/* Active Progress Line */}
                        <div
                            className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 transition-all duration-500 ease-out"
                            style={{ width: `${(Math.min(step, 4) / 4) * 100}%` }}
                        />

                        {steps.map((s, idx) => {
                            const isCompleted = step > idx;
                            const isActive = step === idx || (step === 1 && idx === 0); // Step 0 and 1 are Source phase
                            const displayIdx = idx;

                            return (
                                <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 font-bold
                                            ${isCompleted ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20' :
                                                isActive ? 'bg-white dark:bg-slate-900 border-emerald-500 text-emerald-600 scale-110 shadow-xl' :
                                                    'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'}`}
                                    >
                                        {isCompleted ? '✓' : idx + 1}
                                    </div>
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                                        {s.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    {step === 0 && (
                        <JDSourceStep
                            title={campaignTitle}
                            generatedHtml={generatedHtml}
                            selectedSource={selectedSource}
                            onTitleChange={setCampaignTitle}
                            onSourceSelect={handleSourceSelect}
                            onNext={() => setStep(1)}
                        />
                    )}

                    {step === 1 && (
                        <GenerateJDForm
                            onBack={() => setStep(0)}
                            onSubmit={handleJDSubmit}
                        />
                    )}

                    {step === 2 && (
                        <div className="h-full overflow-y-auto p-6 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
                            <div className="max-w-4xl mx-auto pb-20 space-y-8">

                                {/* JD Preview */}
                                <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Job Description Preview</h3>
                                        <button
                                            onClick={() => {
                                                if (selectedSource !== 'AI') {
                                                    setSelectedSource('MANUAL');
                                                    setStep(0);
                                                } else {
                                                    setStep(1);
                                                }
                                            }}
                                            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                        >
                                            Edit Details
                                        </button>
                                    </div>
                                    <div
                                        className="prose prose-slate dark:prose-invert max-w-none p-4 bg-slate-50 dark:bg-slate-950/30 rounded-lg border border-slate-100 dark:border-slate-800 min-h-[200px]"
                                        dangerouslySetInnerHTML={{ __html: generatedHtml }}
                                    />
                                </section>

                                <CampaignSettingsStep
                                    settings={settings}
                                    onChange={setSettings}
                                    users={companyUsers.length > 0 ? companyUsers : MOCK_USERS}
                                    currentUserID={userProfile?._id}
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <MatchAIConfigStep
                            onBack={handleBack}
                            onSkip={handleStep3Complete}
                            onSkipAll={handleFinalize}
                            onContinue={handleStep3Complete}
                        />
                    )}

                    {step === 4 && (
                        <EngageAIConfigStep
                            onBack={handleBack}
                            onSkip={handleStep4Complete}
                            onSkipAll={handleFinalize}
                            onContinue={handleStep4Complete}
                        />
                    )}

                    {step === 5 && (
                        <SourceCandidatesStep
                            onBack={handleBack}
                            onContinue={handleFinalize}
                        />
                    )}
                </div>

                {/* Footer for Step 2 */}
                {step === 2 && (
                    <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 shrink-0">
                        <button
                            onClick={handleBack}
                            className="px-6 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            {t("Back")}
                        </button>
                        <button
                            onClick={handleStep2Complete}
                            disabled={saving}
                            className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {t("Saving...")}
                                </>
                            ) : (
                                <>
                                    {t("Confirm & Continue")}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};
