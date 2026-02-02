import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { CandidateProfile } from '../pages/CandidateProfile';
import { CandidateMenu } from './Menu/CandidateMenu';

interface ProfileDrawerProps {
    candidateIds: string[];
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ candidateIds }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const candidateId = searchParams.get('rid');
    const activeTab = searchParams.get('tab') || 'profile';

    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

    const onClose = () => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.delete('rid');
            newParams.delete('tab');
            return newParams;
        });
    };

    const handleTabChange = (tab: string) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('tab', tab);
            return newParams;
        });
    };

    // Navigation Logic
    const currentIndex = candidateIds.indexOf(candidateId || "");
    const hasNext = currentIndex !== -1 && currentIndex < candidateIds.length - 1;
    const hasPrev = currentIndex !== -1 && currentIndex > 0;

    const handleNext = () => {
        if (hasNext) {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set('rid', candidateIds[currentIndex + 1]);
                return newParams;
            });
        }
    };

    const handlePrev = () => {
        if (hasPrev) {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set('rid', candidateIds[currentIndex - 1]);
                return newParams;
            });
        }
    };

    // Keyboard Support
    useEffect(() => {
        if (!candidateId) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [candidateId, candidateIds, currentIndex, hasNext, hasPrev]); // Updated dependencies

    if (!candidateId) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div className="relative w-[85%] max-w-[90%] h-full bg-slate-50 dark:bg-slate-900 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-slate-200 dark:border-slate-700 rounded-l-[2rem] overflow-hidden ml-4">

                {/* Header / Nav Bar */}
                <div className="h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                            <BookOpen size={18} className="text-emerald-600 dark:text-emerald-400" />
                            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Quick Preview</span>
                        </div>

                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrev}
                                disabled={!hasPrev}
                                className={`p-1.5 rounded-md flex items-center gap-1 text-xs font-medium transition-colors border border-slate-200 dark:border-slate-600
                                    ${!hasPrev
                                        ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800 text-slate-400'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-500'}`}
                            >
                                <ChevronLeft size={14} /> Prev
                            </button>
                            <span className="text-xs text-slate-400 font-mono">
                                {currentIndex + 1} / {candidateIds.length}
                            </span>
                            <button
                                onClick={handleNext}
                                disabled={!hasNext}
                                className={`p-1.5 rounded-md flex items-center gap-1 text-xs font-medium transition-colors border border-slate-200 dark:border-slate-600
                                    ${!hasNext
                                        ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800 text-slate-400'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-500'}`}
                            >
                                Next <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
                        title="Close Preview"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Internal Sidebar */}
                    <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col pt-4">
                        <CandidateMenu
                            selectedCandidateId={candidateId}
                            activeProfileTab={activeTab}
                            setActiveProfileTab={handleTabChange}
                            onBack={onClose}
                            isCollapsed={false}
                            setIsSidebarOpen={() => { }}
                            onTabChange={handleTabChange}
                        />
                    </div>

                    {/* Main Profile Content */}
                    <div className="flex-1 overflow-hidden relative bg-slate-50 dark:bg-slate-900">
                        <CandidateProfile
                            candidateId={candidateId}
                            activeTab={activeTab}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
