
import React, { useState, useEffect, useRef } from 'react';
import {
   Briefcase, MapPin, Clock, Users, Plus, Share2, MoreHorizontal, ChevronLeft, Sparkles, FileText, Building2, Layers
} from '../../components/Icons';
import { StatusBadge } from '../../components/Common';
import { Campaign } from '../../types';

// Import Sub-Modules
import { Intelligence } from './Intelligence';
import { SourceAIWrapper } from './SourceAI';
import { MatchAI } from './MatchAI';
import { EngageAIWrapper } from './EngageAI';
import { Recommendations } from './Recommendations';
import { CampaignSettings } from './Settings';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useWebSocket } from '../../context/WebSocketContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { CoPresenceAvatars } from '../../components/engage/CoPresenceAvatars';
import { clientService } from '../../services/api';
import { ShareModal } from '../../components/Campaign/ShareModal';

export const CampaignHeader = ({ campaign, isScrolled, onBack, currentUserId }: { campaign: Campaign, isScrolled: boolean, onBack?: () => void, currentUserId?: string }) => {
   const [clientName, setClientName] = useState<string>('N/A');
   const [clientData, setClientData] = useState<any>(null);
   const [isShareModalOpen, setIsShareModalOpen] = useState(false);

   useEffect(() => {
      if (campaign.clientID) {
         clientService.getById(campaign.clientID)
            .then(res => {
               setClientName(res.clientName || res.name || 'N/A');
               setClientData(res);
            })
            .catch(() => {
               setClientName('N/A');
               setClientData(null);
            });
      } else {
         setClientName('N/A');
         setClientData(null);
      }
   }, [campaign.clientID]);

   const getIndustries = () => {
      const classified = (campaign as any).job?.otherInformation?.industry?.classified;
      if (classified && Array.isArray(classified) && classified.length > 0) {
         return classified.map((ind: any) => ind.industryLabel).join(' & ');
      }
      return 'N/A';
   };

   const getMatchColor = (score: number) => {
      if (score >= 80) return 'text-emerald-500';
      if (score >= 50) return 'text-blue-500';
      if (score >= 20) return 'text-yellow-500';
      return 'text-red-500';
   };

   const matchScoreDetails = React.useMemo(() => {
      const criteria = clientData?.settings?.jdCompletenessCriteria || clientData?.jdCompletenessCriteria;
      const isEnabled = criteria && (criteria.enabled === true || String(criteria.enabled).toLowerCase() === 'true');

      if (!isEnabled) {
         return { score: (campaign as any).matchScore || 100, enabled: false, breakdown: [], clientId: campaign.clientID };
      }

      let score = 0;
      const breakdown = [];

      // 1. Job Title
      const jobTitle = (campaign as any).job?.details?.jobTitle?.text || (campaign as any).jobtitle;
      const jobTitleMax = parseInt(criteria.jobTitleWeightage) || 0;
      const jobTitleScore = jobTitle ? jobTitleMax : 0;
      score += jobTitleScore;
      if (jobTitleMax > 0) breakdown.push({ label: 'Job Title', max: jobTitleMax, score: jobTitleScore });

      // 2. Location
      const location = (campaign as any).job?.details?.locations?.[0] || (campaign as any).locations?.[0] || (campaign as any).jobPosting?.location;
      const locationMax = parseInt(criteria.locationWeightage) || 0;
      const locationScore = location ? locationMax : 0;
      score += locationScore;
      if (locationMax > 0) breakdown.push({ label: 'Location', max: locationMax, score: locationScore });

      // 3. Skills
      let skillsCount = 0;
      const skillsArray = (campaign as any).job?.requirements?.skills;
      if (Array.isArray(skillsArray)) {
         skillsArray.forEach((group: any) => {
            if (group.skills && Array.isArray(group.skills)) {
               skillsCount += group.skills.length;
            } else {
               skillsCount += 1;
            }
         });
      }

      const minSkills = parseInt(criteria.skills?.minimumSkillsRequired) || 1;
      const skillsWeight = parseInt(criteria.skills?.skillsWeightage || criteria.skillsWeightage) || 0;

      let skillsScore = 0;
      if (skillsCount >= minSkills && minSkills > 0) {
         skillsScore = skillsWeight;
      } else if (skillsCount > 0 && minSkills > 0) {
         skillsScore = skillsCount * (skillsWeight / minSkills);
      }
      score += skillsScore;
      if (skillsWeight > 0) breakdown.push({ label: 'Skills', max: skillsWeight, score: Math.round(skillsScore * 10) / 10 });

      // 4. Job Description Text
      const jdText = (campaign as any).job?.details?.jobDescription?.text;
      const jdWeight = parseInt(criteria.jobDescriptionWeightage) || parseInt(criteria.skills?.jobDescriptionWeightage) || 0;
      const jdScore = jdText ? jdWeight : 0;
      score += jdScore;
      if (jdWeight > 0) breakdown.push({ label: 'Job Description', max: jdWeight, score: jdScore });

      // 5. Years of Experience
      const expText = (campaign as any).job?.requirements?.yearsOfExperience?.text;
      const expMax = parseInt(criteria.yearsOfExperienceWeightage) || 0;
      const expScore = (expText !== undefined && expText !== null && expText !== '') ? expMax : 0;
      score += expScore;
      if (expMax > 0) breakdown.push({ label: 'Experience', max: expMax, score: expScore });

      // 6. Salary
      const salaryText = (campaign as any).job?.details?.offeredSalary?.text;
      const salaryMax = parseInt(criteria.salaryWeightage) || 0;
      const salaryScore = (salaryText !== undefined && salaryText !== null && salaryText !== '') ? salaryMax : 0;
      score += salaryScore;
      if (salaryMax > 0) breakdown.push({ label: 'Salary', max: salaryMax, score: salaryScore });

      return { score: Math.min(Math.round(score), 100), enabled: true, breakdown, clientId: campaign.clientID };
   }, [campaign, clientData]);

   const matchScore = matchScoreDetails.score;

   return (
      <div className={`bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm sticky top-0 z-30 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-0'}`}>
         <div className="flex flex-col lg:flex-row">
            {/* Left Side: Campaign Info */}
            <div className={`flex-1 flex items-start gap-4 transition-all duration-300 ${isScrolled ? 'px-6 items-center' : 'p-6'}`}>
               <button onClick={onBack} className="mt-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 lg:hidden"><ChevronLeft size={24} /></button>
               <div className="flex-shrink-0 hidden lg:block relative group z-[9999]">
                  <div className={`relative transition-all duration-300 cursor-pointer w-10 h-10 lg:w-16 lg:h-16 flex items-center justify-center`}>
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                        <circle
                           cx="50%" cy="50%" r="40%"
                           stroke="currentColor" strokeWidth="3" fill="transparent"
                           strokeDasharray="251.2"
                           strokeDashoffset={251.2 - (251.2 * (matchScoreDetails.enabled ? matchScore : 100)) / 100}
                           className={`${matchScoreDetails.enabled ? getMatchColor(matchScore) : 'text-emerald-500'} transition-all duration-1000 ease-out`}
                           strokeLinecap="round"
                        />
                     </svg>
                     <div className="absolute inset-0 m-auto flex items-center justify-center p-[6px] lg:p-[10px] rounded-full z-10">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white/50 dark:bg-slate-800/50 flex items-center justify-center backdrop-blur-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] p-1">
                           {(clientData?.clientLogo || clientData?.logo) ? (
                              <img src={clientData.clientLogo || clientData.logo} alt="Company" className="w-full h-full object-contain rounded-full mix-blend-multiply dark:mix-blend-screen" />
                           ) : (
                              <Building2 size={isScrolled ? 14 : 18} className="text-slate-400" />
                           )}
                        </div>
                     </div>
                     {!isScrolled && matchScoreDetails.enabled && (
                        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 ${getMatchColor(matchScore)}`}>
                           {matchScore}%
                        </div>
                     )}
                  </div>

                  {/* JD Completeness Breakdown Tooltip on Hover */}
                  {!isScrolled && matchScoreDetails.clientId && (
                     <div className="absolute top-full left-0 pt-3 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto z-[9999] drop-shadow-2xl">
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-4 relative before:content-[''] before:absolute before:-top-[9px] before:left-5 lg:before:left-8 before:-translate-x-1/2 before:border-[5px] before:border-transparent before:border-b-slate-200 dark:before:border-b-slate-700 after:content-[''] after:absolute after:-top-[8px] after:left-5 lg:after:left-8 after:-translate-x-1/2 after:border-[4px] after:border-transparent after:border-b-white dark:after:border-b-slate-800">
                           <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-2 border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center gap-2">
                              <Sparkles size={14} className="text-indigo-500" />
                              JD Completeness
                           </h4>

                           {matchScoreDetails.enabled && matchScoreDetails.breakdown.length > 0 ? (
                              <div className="space-y-2 mb-4">
                                 {matchScoreDetails.breakdown.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs">
                                       <span className="text-slate-500 dark:text-slate-400 font-medium">{item.label}</span>
                                       <span className="font-semibold text-slate-700 dark:text-slate-300">
                                          <span className={item.score > 0 ? 'text-emerald-500' : 'text-slate-400'}>{item.score}</span> / {item.max}%
                                       </span>
                                    </div>
                                 ))}
                              </div>
                           ) : (
                              <div className="mb-4 text-xs text-slate-500 dark:text-slate-400 opacity-90 text-center py-2 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-100 dark:border-slate-800">
                                 JD Completeness evaluation is currently disabled.
                              </div>
                           )}

                           <a
                              href={`/settings/clientprofile/Settings/${matchScoreDetails.clientId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="block w-full py-2 text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer"
                           >
                              Edit Criteria Settings
                           </a>
                        </div>
                     </div>
                  )}
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-1">
                     <h1 className={`font-bold text-gray-800 dark:text-slate-100 truncate transition-all duration-300 ${isScrolled ? 'text-base' : 'text-lg'}`} title={campaign.name}>{campaign.name}</h1>

                     {/* Always visible info */}
                     <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 hidden md:block"></span>
                        <span className="font-mono text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">Job ID: {campaign.jobID}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                        <span className={campaign.daysLeft < 5 ? "text-red-500 font-medium" : "text-green-600 dark:text-green-400 font-medium"}>
                           {campaign.daysLeft} Days Left
                        </span>
                        <StatusBadge status={campaign.status} />
                     </div>
                  </div>

                  {/* Collapsible Details */}
                  <div className={`flex flex-col gap-2 mt-2 w-full max-w-4xl ${isScrolled ? 'hidden' : 'flex'}`}>
                     {/* Row 2: 4 items */}
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-gray-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 truncate" title={(campaign as any).jobPosting?.location || (campaign as any).location || 'Unspecified'}>
                           <MapPin size={12} className="shrink-0 text-slate-400" />
                           <span className="truncate font-medium text-slate-700 dark:text-slate-300">{(campaign as any).jobPosting?.location || (campaign as any).location || 'Unspecified'}</span>
                        </span>
                        <span className="flex items-center gap-1.5 truncate" title={campaign.role || (campaign as any).jobPosting?.primaryIndustry || 'Logistics'}>
                           <Briefcase size={12} className="shrink-0 text-slate-400" />
                           <span className="truncate">{campaign.role || (campaign as any).jobPosting?.primaryIndustry || 'Logistics'}</span>
                        </span>
                        <span className="flex items-center gap-1.5 truncate">
                           <span className="font-bold text-[10px] shrink-0 text-slate-400">$</span>
                           <span className="truncate">{(campaign as any).compensation?.min ? `${(campaign as any).compensation.min}k` : '15'} - {(campaign as any).compensation?.max ? `${(campaign as any).compensation.max}k` : '45'}/{(campaign as any).compensation?.period === 'Hour' ? 'hr' : 'yr'}</span>
                        </span>
                        <span className="flex items-center gap-1.5 truncate">
                           <Users size={12} className="shrink-0 text-slate-400" />
                           <span className="truncate">{campaign.candidates || 0} Candidates</span>
                        </span>
                     </div>
                     {/* Row 3: 4 items */}
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-gray-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 truncate">
                           <Clock size={12} className="shrink-0 text-slate-400" />
                           <span className="truncate">{(campaign as any).experience?.min || '1'} - {(campaign as any).experience?.max || '5'} Yrs Exp</span>
                        </span>
                        <span className="flex items-center gap-1.5 truncate">
                           <Clock size={12} className="shrink-0 text-slate-400" />
                           <span className="truncate">Updated {campaign.updatedDate || new Date().toLocaleDateString()}</span>
                        </span>
                        <span className="flex items-center gap-1.5 truncate" title={clientName}>
                           <Building2 size={12} className="shrink-0 text-slate-400" />
                           <span className="truncate">{clientName}</span>
                        </span>
                        <span className="flex items-center gap-1.5 truncate" title={getIndustries()}>
                           <Layers size={12} className="shrink-0 text-slate-400" />
                           <span className="truncate">{getIndustries()}</span>
                        </span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Side: Actions */}
            <div className={`flex items-center gap-3 transition-all duration-300 ${isScrolled ? 'pr-6' : 'p-6 pt-2 lg:pt-6'}`}>
               <div className="flex -space-x-2 mr-2">
                  {campaign.members?.length > 0 && campaign.members.map((m, i) => (
                     <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${m.color} border-2 border-white dark:border-slate-800 ring-1 ring-white dark:ring-slate-700`} title={m.name}>
                        {m.initials}
                     </div>
                  ))}
                  {/* Real-time Presence */}
                  <CoPresenceAvatars campaignId={String(campaign.id)} currentUserId={currentUserId || ''} />
               </div>

               <div className="h-8 w-px bg-gray-200 dark:bg-slate-700 mx-1 hidden md:block"></div>

               <button onClick={() => setIsShareModalOpen(true)} className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                  <Share2 size={20} />
               </button>
               <div className="relative group">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                     <MoreHorizontal size={20} />
                  </button>
                  {/* Dropdown Menu Wrapper for safe hover area */}
                  <div className="absolute right-0 top-full pt-2 w-48 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 delay-100">
                     <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-1">
                        <button
                           onClick={() => window.dispatchEvent(new CustomEvent('CAMPAIGN_ENHANCE_JD'))}
                           className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 rounded-lg flex items-center gap-2 transition-colors"
                        >
                           <Sparkles size={14} /> Enhance JD
                        </button>
                        <button
                           onClick={() => window.dispatchEvent(new CustomEvent('CAMPAIGN_EDIT_DETAILS'))}
                           className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 transition-colors"
                        >
                           <FileText size={14} /> Edit details
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Share Modal */}
         <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            campaign={campaign}
         />
      </div>
   );
};

export const CampaignDashboard = ({ campaign, onBack }: { campaign: Campaign, onBack?: () => void }) => {
   const [isScrolled, setIsScrolled] = useState(false);
   const scrollContainerRef = useRef<HTMLDivElement>(null);
   const { joinRoom, leaveRoom } = useWebSocket();
   const { userProfile } = useUserProfile();
   const location = useLocation();

   // Derive activeTab from the current URL path
   const activeTab = location.pathname.split('/').pop() || 'Intelligence';

   // Join Campaign Room for Co-presence
   useEffect(() => {
      if (campaign?.id && userProfile) {
         const roomId = String(campaign.id);
         joinRoom(roomId, {
            id: userProfile?._id || userProfile?.id || 'visitor',
            firstName: userProfile.firstName || 'Visitor',
            lastName: userProfile.lastName || '',
            email: userProfile.email || '',
            color: userProfile.color || 'blue',
            avatar: userProfile.avatar,
            role: userProfile.role,
            location: userProfile.location || userProfile.timeZone
         }, activeTab);

         return () => {
            leaveRoom(roomId, userProfile?._id || userProfile?.id || 'visitor');
         };
      }
   }, [campaign?.id, userProfile, joinRoom, leaveRoom, activeTab]);

   useEffect(() => {
      const handleScroll = () => {
         if (scrollContainerRef.current) {
            setIsScrolled(scrollContainerRef.current.scrollTop > 10);
         }
      };
      const container = scrollContainerRef.current;
      if (container) container.addEventListener('scroll', handleScroll);
      return () => { if (container) container.removeEventListener('scroll', handleScroll); };
   }, []);

   if (!campaign) return <div className="p-8 text-center text-slate-500">No Campaign Selected</div>;

   return (
      <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900 transition-colors overflow-hidden">
         <CampaignHeader campaign={campaign} isScrolled={isScrolled} onBack={onBack} currentUserId={userProfile?._id || userProfile?.id} />
         {/* Pass userProfile to header if needed, but CoPresenceAvatars uses context */}
         <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar">
            <Routes>
               <Route path="/" element={<Navigate to="intelligence" replace />} />
               <Route path="intelligence" element={<Intelligence />} />
               <Route path="sourceai/*" element={
                  <Routes>
                     <Route path="/" element={<Navigate to="attach" replace />} />
                     <Route path="attach" element={<SourceAIWrapper activeView="ATTACH" campaign={campaign} />} />
                     <Route path="profiles" element={<SourceAIWrapper activeView="PROFILES" campaign={campaign} />} />
                     <Route path="integrations" element={<SourceAIWrapper activeView="INTEGRATIONS" campaign={campaign} />} />
                     <Route path="jd" element={<SourceAIWrapper activeView="JD" campaign={campaign} />} />
                  </Routes>
               } />
               <Route path="matchai" element={<MatchAI />} />
               <Route path="engageai/*" element={
                  <Routes>
                     <Route path="/" element={<Navigate to="builder" replace />} />
                     <Route path="builder" element={<EngageAIWrapper activeView="BUILDER" />} />
                     <Route path="room" element={<EngageAIWrapper activeView="ROOM" />} />
                     <Route path="tracking" element={<EngageAIWrapper activeView="TRACKING" />} />
                  </Routes>
               } />
               <Route path="recommendations" element={<Recommendations activeView="PROFILES" />} />
               <Route path="settings" element={<CampaignSettings campaign={campaign} />} />
               <Route path="*" element={<Navigate to="intelligence" replace />} />
            </Routes>
         </div>
      </div>
   );
};
