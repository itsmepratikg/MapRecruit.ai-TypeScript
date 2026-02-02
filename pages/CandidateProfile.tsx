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
import { EditProfileModal } from '../components/EditProfileModal'; // Import Modal
import { ExportProfileModal } from '../components/ExportProfileModal'; // Import Export Modal
import { ContactPreviewModal } from '../components/Profile/ContactPreviewModal'; // Import Contact Modal
import { HeroWidgets } from '../components/HeroWidgets'; // Import Widgets
import { profileService, clientService, companyService, userService } from '../services/api'; // Added companyService, userService
import { owningEntityService } from '../services/owningEntityService'; // Added OwningEntityService
import { useToast } from '../components/Toast';

import { LocalMatchAnalysisModal } from '../components/LocalMatchAnalysisModal';

import { useParams, useLocation } from 'react-router-dom';
import { useCandidateProfile } from '../hooks/useCandidateProfile';
import { interviewService } from '../services/interviewService';
import { mapInterviewToCampaign } from '../components/ProfileCampaigns';

// Import Sub-pages
import { Overview } from './Profile/Overview';
import { Resume } from './Profile/Resume';
import { LinkedCampaigns } from './Profile/Campaigns';
import { Interviews } from './Profile/Interviews';
import { Activities } from './Profile/Activities';
import { Folders } from './Profile/Folders';
import { Duplicates } from './Profile/Duplicates';
import { Similar } from './Profile/Similar';
import { Recommended } from './Profile/Recommended';
import { Chat } from './Profile/Chat';

export const CandidateProfile = ({ activeTab: propsActiveTab, candidateId: propsCandidateId }: { activeTab?: string, candidateId?: string }) => {
  const { tab: urlTab, id: urlId } = useParams<{ tab?: string; id: string }>();
  const activeTab = propsActiveTab || urlTab || 'profile';
  const id = propsCandidateId || urlId;

  const { profile: liveData, loading, error, refresh: refreshProfile } = useCandidateProfile(id || null);
  const location = useLocation();
  const { addToast } = useToast();

  const [accessDenied, setAccessDenied] = useState(false);
  const [owningEntityName, setOwningEntityName] = useState<string | null>(null);
  const [ownerDisplay, setOwnerDisplay] = useState<{ label: string, name: string } | null>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // States for Modals/Drill-downs
  const [previewCampaign, setPreviewCampaign] = useState<any>(null);
  const [maximizedTemplate, setMaximizedTemplate] = useState<any>(null);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [showMatchScore, setShowMatchScore] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit State
  const [editModalTab, setEditModalTab] = useState('BASIC');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false); // Contact Modal State
  const [shortlistStatus, setShortlistStatus] = useState<'shortlisted' | 'rejected' | 'none'>('none');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // --- ACCESS CONTROL & OWNING ENTITY LOGIC ---
  useEffect(() => {
    const validateAccess = async () => {
      if (!liveData || loading) return;

      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);

        // Standardized Multi-Tenant IDs
        const currentUserCompanyId = user.currentCompanyID || user.companyID || user.companyId;
        const currentUserClientIds = Array.isArray(user.clientID || user.clients)
          ? (user.clientID || user.clients)
          : [user.clientID || user.clients].filter(Boolean);
        const currentActiveClientId = user.activeClientID || user.activeClient || user.clientId;

        const resumeClientId = liveData.clientID || liveData.clientId;
        const resumeCompanyId = liveData.companyID || liveData.companyId;
        const resumeFranchiseId = liveData.franchiseID || liveData.franchiseId;

        if (!currentActiveClientId) {
          console.warn("Current User Active Client ID missing");
          return;
        }

        // 1. Fetch Current Company Context (to check Franchise Mode)
        const activeCompany = await companyService.get();
        const isFranchiseMode = activeCompany.productSettings?.franchise === true;

        // 2. Fetch Active Client Settings
        const clientData = await clientService.getById(currentActiveClientId);
        const searchLevel = clientData.settings?.profileSearchAccessLevel || 'Client';

        // 3. Access Check Logic
        let isAllowed = false;
        let displayLabel = isFranchiseMode ? 'Franchise' : 'Client';
        let displayName = 'Unknown';

        // Fetch Resume Client Data (to get clientName)
        let resumeClientData = null;
        if (resumeClientId) {
          try {
            resumeClientData = await clientService.getById(resumeClientId);
            displayName = resumeClientData.clientName || resumeClientData.name || 'Unknown Client';
          } catch (e) {
            console.error("Could not fetch resume client details", e);
          }
        }

        const isAdmin = ['Product Admin', 'Admin', 'Super Admin'].includes(user.role);

        if (isAdmin) {
          // Admins have access to everything within their Accessible Companies
          const accessibleCompanies = user.AccessibleCompanyID || [user.companyID];
          isAllowed = accessibleCompanies.some((id: string) => id.toString() === resumeCompanyId?.toString());
        } else if (searchLevel === 'Company') {
          isAllowed = (resumeCompanyId === currentUserCompanyId);
          displayLabel = 'Company';
          displayName = activeCompany.companyProfile?.companyNameAlias?.[0] || activeCompany.companyProfile?.companyName || "Your Company";
        } else if (searchLevel === 'OwningEntity' && isFranchiseMode) {
          displayLabel = 'Franchise';
          // Check if candidate belongs to the same franchise as user's current client
          const userFranchise = clientData.franchiseID || clientData.franchise;
          if (userFranchise && resumeFranchiseId) {
            isAllowed = (userFranchise.toString() === resumeFranchiseId.toString());

            // Try to get Franchise Name
            if (isAllowed) {
              const franchiseDoc = await owningEntityService.getByClientId(currentActiveClientId);
              if (franchiseDoc) {
                displayName = franchiseDoc.name || franchiseDoc.franchiseName || 'Your Franchise';
              }
            }
          } else {
            // Fallback to client check if franchise missing
            isAllowed = currentUserClientIds.some((id: string) => id.toString() === resumeClientId?.toString());
          }
        } else {
          // Default Client Level Access
          isAllowed = currentUserClientIds.some((id: string) => id.toString() === resumeClientId?.toString());
          displayLabel = 'Client';
        }

        setOwnerDisplay({ label: displayLabel, name: displayName });
        setAccessDenied(!isAllowed);

        // Set owning entity name for the top badge if in franchise mode
        if (isFranchiseMode && isAllowed && resumeFranchiseId) {
          const oe = await owningEntityService.getByClientId(resumeClientId);
          if (oe) setOwningEntityName(oe.name || oe.franchiseName);
        }

      } catch (err) {
        console.error("Access Validation Error", err);
      }
    };

    validateAccess();
  }, [liveData, loading]);

  // --- LOG VISIT ---
  useEffect(() => {
    if (liveData && id) {
      userService.logVisit('Profile', id, liveData.profile?.fullName || 'Profile')
        .catch(console.error);
    }
  }, [id, !!liveData]);

  if (accessDenied) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Access Denied</h2>
          <p className="text-slate-600 dark:text-slate-400">You do not have permission to view this profile due to Client Access Restrictions.</p>
          <button onClick={() => window.history.back()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Extract Profile Data from liveData (MongoDB Schema)
  const resumeDetails = liveData || {};
  const profileResume = resumeDetails.resume || {};
  const profileBasic = profileResume.profile || {};
  const profileSummary = profileResume.professionalSummary || {};

  const candidateName = profileBasic.fullName || "Loading...";

  // Dynamic Job Title Logic
  const professionalExperience = profileResume.professionalExperience || [];
  const getCurrentJobTitle = () => {
    // Find updated/current role (no endDate or isCurrent flag)
    const currentRole = professionalExperience.find((exp: any) => !exp.endDate || exp.endDate.text?.toLowerCase() === 'present' || exp.currentStatus === 'Working');
    if (currentRole && currentRole.jobTitle) return currentRole.jobTitle.text;

    // Fallback to summary current role
    return profileSummary.currentRole?.jobTitle || "No Title";
  };
  const candidateRole = getCurrentJobTitle();

  const candidateLocation = profileBasic.locations?.[0]?.text || "No Location"; // Using first location
  const candidateStatus = resumeDetails.personnelStatus || "Pending";
  const candidateType = resumeDetails.employmentStatus || "N/A";
  const candidateAvailability = resumeDetails.availability || "N/A";

  // Tag handling
  const tags = resumeDetails.tagID || [];
  const displayTags = tags.map((t: any) => t.name || t.text).filter(Boolean);

  // Widget Data & Meta
  const metaData = resumeDetails.metaData || {};

  // FORCE ENABLE ALL WIDGETS (User Request)
  const profileWidgets = {
    ...(resumeDetails.profileWidgets || {}),
    duplicateWidget: true,
    attentionWidget: true,
    editProfileWidget: true,
    favouriteWidget: true,
    resumeWidget: true,
    shortListWidget: true,
    unSubscribeWidget: true,
    referralWidget: true,
    profileSummaryWidget: true,
    profileViewedWidget: true,
    downloadProfileWidget: true,
    linkCampaignWidget: true,
    massEmailWidget: true,
    massSMSWidget: true,
    profileShareWidget: true,
    linkFolderWidget: true,
    tagsAttachWidget: true,
    skipAutomationWidget: true,
    exportProfileWidget: true,
    directVideoWidget: true,
    uploadResumesWidget: true
  };

  const mockPermissions = { canEdit: true };

  const handleEditSection = (section: string) => {
    setEditModalTab(section);
    setIsEditModalOpen(true);
  };

  // Widget Handler
  const handleWidgetAction = async (action: string) => {
    console.log("Widget Action:", action);
    switch (action) {
      case 'edit_global':
        setEditModalTab('BASIC');
        setIsEditModalOpen(true);
        break;
      case 'shortlist':
        // Cycle Logic: None -> Shortlisted -> Rejected -> None
        const nextStatus = shortlistStatus === 'none' ? 'shortlisted' :
          shortlistStatus === 'shortlisted' ? 'rejected' : 'none';
        setShortlistStatus(nextStatus);
        // Mock API Call
        try {
          // await profileService.updateShortlist(id, nextStatus);
          addToast(`Status updated to ${nextStatus}`, "success");
        } catch (e) {
          addToast("Failed to update status", "error");
        }
        break;
      case 'export':
        addToast("Opening Export Dialog... (Placeholder)", "info");
        break;
      case 'duplicate':
        addToast("Duplicate check clicked", "info");
        break;
      case 'view_resume':
        // Trigger Resume Preview Logic
        break;
      default:
        addToast(`${action} widget clicked`, "default");
    }
  };

  useEffect(() => {
    setPreviewCampaign(null);
  }, [activeTab]);

  // Deep Link Logic for Campaign Details (CID)
  useEffect(() => {
    const checkDeepLink = async () => {
      const params = new URLSearchParams(location.search);
      const linkedCID = params.get('CID');
      const isValidTab = activeTab === 'campaigns' || urlTab === 'campaigns';

      if (linkedCID && isValidTab && id) {
        try {
          if (!liveData) return;

          const interviews = await interviewService.getAll({ resumeID: id });

          const match = interviews.find((iv: any) =>
            (iv.campaign?._id === linkedCID) ||
            (iv.campaignID === linkedCID) ||
            (iv._id === linkedCID)
          );

          if (match) {
            const mapped = mapInterviewToCampaign(match);
            setPreviewCampaign(mapped);
          }
        } catch (e) {
          console.error("Deep link failed", e);
        }
      }
    };
    checkDeepLink();
  }, [location.search, id, activeTab, liveData]);

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

  const handleSaveProfile = async (updatedData: any) => {
    try {
      if (!id) return;
      await profileService.update(id, updatedData);
      addToast("Profile updated successfully", "success");
      if (refreshProfile) refreshProfile();
    } catch (err) {
      console.error("Update failed", err);
      addToast("Failed to update profile", "error");
    }
  };

  const handleSaveCampaignFeedback = async (interviewId: string, data: any) => {
    try {
      await interviewService.update(interviewId, data);
      addToast("Evaluation saved successfully", "success");

      if (previewCampaign && previewCampaign.id === interviewId) {
        setPreviewCampaign({
          ...previewCampaign,
          rating: data.feedBack?.rating,
          feedback: data.feedBack?.comment,
          status: data.feedBack?.status
        });
      }
    } catch (err) {
      console.error("Failed to save evaluation", err);
      addToast("Failed to save evaluation", "error");
    }
  };

  if (loading && !liveData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Fetching Profile Details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-red-500 font-bold text-lg mb-2">Error Loading Profile</p>
          <p className="text-slate-500 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <Overview data={resumeDetails} onEditSection={handleEditSection} />;
      case 'resume': return <Resume />;
      case 'activity': return <Activities />;
      case 'chat': return <Chat />;
      case 'campaigns': return <LinkedCampaigns onPreviewCampaign={setPreviewCampaign} onShowMatchScore={() => setShowMatchScore(true)} onSaveFeedback={handleSaveCampaignFeedback} />;
      case 'folders': return <Folders />;
      case 'interviews': return <Interviews onSelectInterview={setSelectedInterview} />;
      case 'recommended': return <Recommended />;
      case 'duplicate': return <Duplicates />;
      case 'similar': return <Similar />;
      default: return <Overview data={resumeDetails} onEditSection={handleEditSection} />;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative bg-slate-50 dark:bg-slate-900 w-full animate-in fade-in duration-300">
      {/* MODALS */}
      {showMatchScore && <LocalMatchAnalysisModal onClose={() => setShowMatchScore(false)} />}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        data={liveData}
        onSave={handleSaveProfile}
        initialTab={editModalTab}
      />
      <ExportProfileModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        candidateName={candidateName}
      />

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
                  <button onClick={() => setSelectedInterview(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><ChevronLeft size={20} /></button>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
                  <FileEdit size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 mb-4">No Template Attached</p>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-700 transition-colors">Attach Template</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <header className={`relative shrink-0 sticky top-0 z-30 transition-all duration-500 ${isScrolled ? 'h-16 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-md border-b border-slate-200 dark:border-slate-700' : 'h-auto py-4 md:py-6 bg-white dark:bg-slate-800'}`}>
        {!isScrolled && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-20 transition-opacity duration-700">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-400/20 blur-[100px] rounded-full"></div>
            <div className="absolute top-1/2 -left-24 w-72 h-72 bg-indigo-400/10 blur-[80px] rounded-full"></div>
          </div>
        )}
        <div className="h-full relative px-4 md:px-8">

          <div className={`transition-all duration-300 ease-in-out origin-top ${isScrolled ? 'opacity-0 scale-95 pointer-events-none absolute inset-0' : 'opacity-100 scale-100 relative'}`}>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex gap-4 w-full md:w-auto">
                <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold text-2xl uppercase shrink-0">
                  {candidateName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">{candidateName}</h1>

                    {owningEntityName && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-[10px] font-bold border border-indigo-100 dark:border-indigo-800 shadow-sm">
                        <span className="opacity-60 uppercase tracking-tighter">{ownerDisplay?.label || 'Entity'}:</span>
                        <span className="truncate max-w-[150px]">{owningEntityName}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-3">{candidateRole}</p>

                  <div className="mb-3">
                    <button
                      onClick={() => setIsContactModalOpen(true)}
                      className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                      <User size={16} /> Contact Details
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-green-500 dark:text-green-400" />
                      <span>{candidateLocation}</span>
                      <CheckCircle size={16} className="text-green-500 dark:text-green-400" />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <TagIcon size={16} className="text-slate-400" />
                      <div className="flex items-center gap-2">
                        {displayTags.length > 0 ? (
                          <>
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs border border-slate-200 dark:border-slate-600">
                              {displayTags[0]}
                            </span>
                            {displayTags.length > 1 && (
                              <button className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                +{displayTags.length - 1} more
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No tags</span>
                        )}
                        <button className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 rounded text-xs text-slate-500 hover:text-green-600 hover:border-green-400 transition-colors flex items-center gap-1">
                          <span>+ Add Tags</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4 md:gap-6 w-full md:w-auto">
                <div className="flex justify-end w-full">
                  <HeroWidgets
                    widgets={profileWidgets}
                    metaData={metaData}
                    permissions={mockPermissions}
                    onAction={handleWidgetAction}
                    shortlistStatus={shortlistStatus}
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-right text-sm w-full md:w-auto">
                  <div><span className="text-slate-800 dark:text-slate-200 font-bold block">Personnel Status</span><span className="text-slate-500 dark:text-slate-400">{candidateStatus}</span></div>
                  <div><span className="text-slate-800 dark:text-slate-200 font-bold block">Availability</span><span className="text-slate-500 dark:text-slate-400">{candidateAvailability}</span></div>
                  <div><span className="text-slate-800 dark:text-slate-200 font-bold block">Employment Status</span><span className="text-slate-500 dark:text-slate-400">{candidateType}</span></div>
                  <div><span className="text-slate-800 dark:text-slate-200 font-bold block">Channel</span><span className="text-slate-500 dark:text-slate-400">{metaData.inputChannel || "Manual"}</span></div>
                  {ownerDisplay && (
                    <div className="col-span-2 border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                      <span className="text-slate-800 dark:text-slate-200 font-bold block">{ownerDisplay.label}</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">{ownerDisplay.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={`absolute inset-0 px-4 md:px-6 flex items-center justify-between transition-all duration-300 transform bg-white dark:bg-slate-800 z-50 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold text-lg uppercase shrink-0">
                {candidateName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 dark:text-white leading-tight">{candidateName}</h3>
                  {owningEntityName && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500" title={`Owning Entity: ${owningEntityName}`}></span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{candidateRole}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm">Shortlist</button>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
                <Mail size={18} />
              </button>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
                <FileEdit size={18} />
              </button>
            </div>
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
                onSaveFeedback={handleSaveCampaignFeedback}
                isScrolled={isScrolled}
              />
            </div>
          ) : (
            <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24">{renderContent()}</div>
          )}
        </div>
      </div>

      <ContactPreviewModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        data={{
          emails: profileBasic.emails || [],
          phones: profileBasic.phones || [],
          socials: profileBasic.socialLinks || []
        }}
      />
    </div>
  );
};
