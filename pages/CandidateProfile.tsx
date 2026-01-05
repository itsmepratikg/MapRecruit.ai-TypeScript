
import React, { useState, useRef, useEffect } from 'react';
import { 
  User, FileText, Briefcase, Activity, MessageSquare, 
  Users, ThumbsUp, Video, Mail, Phone, Linkedin, 
  ChevronLeft, MoreHorizontal, Minimize2, HelpCircle, 
  FileEdit, Folder, Copy, MessageCircle, MapPin, CheckCircle, Tag as TagIcon
} from '../components/Icons';
import { ActionIcons, StatusBadge, EmptyView } from '../components/Common';
import { CANDIDATE, FULL_PROFILE_DATA } from '../data';
import { InterviewFormContent } from '../components/InterviewComponents';
import { CampaignsView, CampaignDetailView } from '../components/ProfileCampaigns';
import { InterviewsView } from '../components/ProfileInterviews';
import { ProfileDetails, ActivitiesView, TalentChatView, RecommendedView, SimilarProfilesView } from '../components/ProfileViews';

// Re-implement MatchAnalysisModal locally if not exported from Profiles.tsx to avoid circular dependency or import issues.
const LocalMatchAnalysisModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
       <div className="bg-white dark:bg-slate-800 w-full max-w-4xl h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800">
             <div className="flex items-center gap-3">
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">Close</button>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">Match Analysis</h3>
             </div>
          </div>
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">Analysis Content Placeholder</div>
       </div>
    </div>
  );
};

export const CandidateProfile = ({ activeTab }: { activeTab: string }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // States for Modals/Drill-downs
  const [previewCampaign, setPreviewCampaign] = useState<any>(null);
  const [maximizedTemplate, setMaximizedTemplate] = useState<any>(null);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [showMatchScore, setShowMatchScore] = useState(false);

  // Extract Profile Data safely from the dynamic JSON
  const profileResume = (FULL_PROFILE_DATA.resumeDetails?.resume || {}) as any;
  const profileBasic = profileResume.profile || {};
  const profileSummary = profileResume.professionalSummary || {};
  
  const candidateName = profileBasic.fullName || CANDIDATE.name;
  const candidateRole = profileSummary.currentRole?.jobTitle || CANDIDATE.role;
  const candidateLocation = profileBasic.locations?.[0]?.text || CANDIDATE.location;
  const candidateStatus = FULL_PROFILE_DATA.resumeDetails?.personnelStatus || CANDIDATE.status;
  const candidateType = "Pending Applicant"; // hardcoded in schema as personnelStatus but using separate var
  const candidateAvailability = FULL_PROFILE_DATA.resumeDetails?.availability || CANDIDATE.availability;
  
  // Tag handling - dynamic tags
  const tags = (FULL_PROFILE_DATA.resumeDetails as any).tags || [];
  // If no main tags, try to grab some skills as tags for display
  const displayTags = tags.length > 0 ? tags : (profileResume.professionalQualification?.skills?.slice(0, 3).map((s: any) => s.text) || []);

  useEffect(() => {
    // Reset preview campaign when tab changes
    setPreviewCampaign(null);
  }, [activeTab]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setIsScrolled(scrollContainerRef.current.scrollTop > 80);
      }
    };
    const container = scrollContainerRef.current;
    if (container) container.addEventListener('scroll', handleScroll);
    return () => { if (container) container.removeEventListener('scroll', handleScroll); };
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'profile': return <ProfileDetails data={FULL_PROFILE_DATA} />;
      case 'resume': return <div className="h-[800px] bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center text-slate-400 dark:text-slate-500 font-medium">PDF Viewer Placeholder</div>;
      case 'activity': return <ActivitiesView />;
      case 'chat': return <TalentChatView />;
      case 'campaigns': return <CampaignsView onPreviewCampaign={setPreviewCampaign} onShowMatchScore={() => setShowMatchScore(true)} />;
      case 'folders': return <EmptyView title="No Linked Folders" message="This candidate hasn't been added to any folders yet." icon={Folder} />;
      case 'interviews': return <InterviewsView onSelectInterview={setSelectedInterview} />;
      case 'recommended': return <RecommendedView />;
      case 'duplicate': return <EmptyView title="No Duplicate Profiles" message="We didn't find any potential duplicates for this candidate in the system." icon={Copy} />;
      case 'similar': return <SimilarProfilesView />;
      default: return <ProfileDetails data={FULL_PROFILE_DATA} />;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative bg-slate-50 dark:bg-slate-900 w-full animate-in fade-in duration-300">
        {/* MODALS */}
        {showMatchScore && <LocalMatchAnalysisModal onClose={() => setShowMatchScore(false)} />}
        
        {maximizedTemplate && (
            <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 w-full max-w-6xl h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col"> 
                <InterviewFormContent 
                    template={maximizedTemplate.template}
                    roundName={maximizedTemplate.roundName}
                    onClose={() => setMaximizedTemplate(null)}
                    onMaximize={() => setMaximizedTemplate(null)} 
                    isMaximized={true}
                    readOnly={maximizedTemplate.readOnly}
                />
            </div>
            </div>
        )}

        {selectedInterview && (
            <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 w-full max-w-6xl h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col"> 
                {selectedInterview.templateAttached ? (
                    <InterviewFormContent 
                        template={{ title: selectedInterview.name }}
                        roundName={selectedInterview.type}
                        onClose={() => setSelectedInterview(null)}
                        readOnly={selectedInterview.status === 'Completed'}
                    />
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200">{selectedInterview.name}</h3>
                            <button onClick={() => setSelectedInterview(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><ChevronLeft size={20}/></button>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
                            <FileEdit size={48} className="text-slate-300 dark:text-slate-600 mb-4"/>
                            <p className="text-slate-500 dark:text-slate-400 mb-4">No Template Attached</p>
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-700 transition-colors">Attach Template</button>
                        </div>
                    </div>
                )}
            </div>
            </div>
        )}

        <header className={`bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shrink-0 sticky top-0 z-30 transition-all duration-300 ${isScrolled ? 'py-2 px-6 shadow-sm' : 'py-6 px-8'}`}>
          <div className="h-full">
            <div className={`transition-opacity duration-200 ${isScrolled ? 'hidden opacity-0' : 'block opacity-100'}`}>
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold text-2xl uppercase">
                    {candidateName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">{candidateName}</h1>
                        <button className="text-slate-400 hover:text-green-600 dark:hover:text-green-400"><FileEdit size={14} /></button>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{candidateRole}</p>
                    <div className="flex flex-col gap-1 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2"><span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1"><User size={12}/> Contact Details</span></div>
                      <div className="flex items-center gap-2"><MapPin size={14} className="text-green-500 dark:text-green-400" /><span>{candidateLocation}</span><CheckCircle size={14} className="text-green-500 dark:text-green-400" /></div>
                      <div className="flex items-center gap-2"><TagIcon size={14} className="text-slate-400" />
                        {displayTags.length > 0 ? (
                            displayTags.map((tag: any, i: number) => (<span key={i} className="bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2 py-0.5 rounded text-xs">{tag}</span>))
                        ) : (
                            <span className="text-xs text-slate-400 italic">No Tags</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-6">
                  <ActionIcons />
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-right text-sm">
                    <div><span className="text-slate-800 dark:text-slate-200 font-bold block">Candidate Type</span><span className="text-slate-500 dark:text-slate-400">{candidateType}</span></div>
                    <div><span className="text-slate-800 dark:text-slate-200 font-bold block">Availability</span><span className="text-slate-500 dark:text-slate-400">{candidateAvailability}</span></div>
                    <div><span className="text-slate-800 dark:text-slate-200 font-bold block">Employment Status</span><span className="text-slate-500 dark:text-slate-400">{candidateStatus}</span></div>
                    <div><span className="text-slate-800 dark:text-slate-200 font-bold block">Channel</span><span className="text-slate-500 dark:text-slate-400">{CANDIDATE.channel}</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`flex items-center justify-between transition-opacity duration-200 ${isScrolled ? 'flex opacity-100' : 'hidden opacity-0'}`}>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold">
                        {candidateName.charAt(0)}
                    </div>
                    <span className="font-bold text-green-600 dark:text-green-400 text-lg">{candidateName}</span>
                </div>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2"><span className="text-slate-400 font-medium">Type:</span><span className="text-slate-700 dark:text-slate-200 font-semibold">{candidateType}</span></div>
                  <div className="flex items-center gap-2"><span className="text-slate-400 font-medium">Availability:</span><span className="text-slate-700 dark:text-slate-200 font-semibold">{candidateAvailability}</span></div>
                  <div className="flex items-center gap-2"><span className="text-slate-400 font-medium">Status:</span><StatusBadge status={candidateStatus} /></div>
                </div>
              </div>
              <div className="scale-90 origin-right"><ActionIcons /></div>
            </div>
          </div>
        </header>
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="h-full">
          {previewCampaign ? (
            <div className="min-h-full">
            <CampaignDetailView 
              campaign={previewCampaign} 
              onBack={() => setPreviewCampaign(null)} 
              onMaximizeTemplate={setMaximizedTemplate}
              onShowMatchScore={() => setShowMatchScore(true)} 
              isScrolled={isScrolled}
            />
            </div>
          ) : (
            <div className="p-8 max-w-7xl mx-auto pb-24">{renderContent()}</div>
          )}
          </div>
        </div>
    </div>
  );
};
