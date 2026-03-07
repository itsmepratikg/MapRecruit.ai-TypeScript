
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
   Megaphone, Video, Phone, MapPin, Calendar, Activity,
   ChevronUp, ChevronDown, FileEdit, Plus, Briefcase, Building2,
   MoreHorizontal, Share2, ChevronLeft, CheckCircle, Search
} from 'lucide-react';
import { StatusBadge, StarRating } from './Common';
import { TemplateSelector, InterviewFormContent, AssessmentQuestion } from './InterviewComponents';
import { stripHtml, getSkillCategory, SkillMatchCategory } from '../utils/mongoUtils';

/**
 * Helper to get score color coding based on value (0-10)
 * 0-4: Red, 5-7: Yellow, 7-9: Blue, 9-10: Green
 */
const getScoreColor = (score: number) => {
   if (score <= 4) return 'bg-[#FF8A8A] text-white'; // 0-4: Red
   if (score <= 7) return 'bg-[#F9BF3B] text-white'; // 5-7: Yellow
   if (score <= 9) return 'bg-[#4BACE1] text-white'; // 7-9: Blue
   return 'bg-[#4CAF50] text-white'; // 9-10: Green
};

const formatScore = (score: any) => {
   const val = parseFloat(score);
   if (isNaN(val)) return "0";
   // If it's a whole number, show no decimals, otherwise show 1
   return val % 1 === 0 ? val.toString() : val.toFixed(1);
};

export const RoundCard = ({ round, isOpen, onToggle, onMaximizeTemplate }: any) => {
   const [activeTemplate, setActiveTemplate] = useState<any>(round.templateAttached ? { title: "Existing Template" } : null);
   const [showSelector, setShowSelector] = useState(false);
   const [roundRating, setRoundRating] = useState(0);

   const getRoundIcon = () => {
      switch (round.type) {
         case 'Announcement': return <Megaphone size={16} />;
         case 'Interview':
            if (round.mode === 'Video') return <Video size={16} />;
            if (round.mode === 'In-Person') return <MapPin size={16} />;
            if (round.mode === 'Phone') return <Phone size={16} />;
            return <Calendar size={16} />;
         case 'Assessment': return <FileEdit size={16} />;
         default: return <Activity size={16} />;
      }
   };

   const getRoundColor = () => {
      switch (round.type) {
         case 'Announcement': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
         case 'Interview': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
         case 'Assessment': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
         default: return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
      }
   };

   const handleTemplateSelect = (template: any) => {
      setActiveTemplate(template);
      setShowSelector(false);
   };

   const handleMaximize = () => {
      if (onMaximizeTemplate) {
         onMaximizeTemplate({
            template: activeTemplate,
            roundName: round.name,
            readOnly: round.status === 'Completed'
         });
      }
   };

   return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden transition-all">
         <div
            className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
            onClick={onToggle}
         >
            <div className="flex items-center gap-3">
               <div className={`p-2 rounded-md ${getRoundColor()}`}>
                  {getRoundIcon()}
               </div>
               <div>
                  <h5 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{round.name}</h5>
                  <div className="flex flex-col">
                     <span className="text-[10px] text-slate-500 dark:text-slate-400">{round.type} {round.mode ? `• ${round.mode}` : ''}</span>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
               <div className="flex items-center gap-1">
                  <StatusBadge status={round.status} />
               </div>
               <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
               </button>
            </div>
         </div>

         {isOpen && (
            <div className="p-4 space-y-4 bg-white dark:bg-slate-800 animate-in slide-in-from-top-1 duration-200">
               {round.type === 'Announcement' && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded border border-slate-100 dark:border-slate-600 text-center">
                     <Megaphone size={24} className="text-purple-300 mx-auto mb-2" />
                     <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{round.description}"</p>
                     <p className="text-xs text-slate-400 mt-2">Sent on {round.date}</p>
                  </div>
               )}

               {round.type === 'Interview' && !activeTemplate && !showSelector && (
                  <div className="text-center py-8 bg-slate-50 dark:bg-slate-700/30 rounded border border-dashed border-slate-300 dark:border-slate-600">
                     <FileEdit size={32} className="text-slate-300 dark:text-slate-500 mx-auto mb-2" />
                     <p className="text-slate-600 dark:text-slate-300 font-medium mb-1">No Interview Template Attached</p>
                     <p className="text-xs text-slate-400 mb-4">Select a template to start evaluating the candidate.</p>
                     <button
                        onClick={() => setShowSelector(true)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded shadow-sm transition-colors flex items-center gap-2 mx-auto"
                     >
                        <Plus size={16} /> Attach Template
                     </button>
                  </div>
               )}

               {showSelector && (
                  <TemplateSelector onSelect={handleTemplateSelect} onClose={() => setShowSelector(false)} />
               )}

               {activeTemplate && round.type === 'Interview' && (
                  <InterviewFormContent
                     template={activeTemplate}
                     roundName={round.name}
                     onClose={() => { setActiveTemplate(null); setShowSelector(false); }}
                     onMaximize={handleMaximize}
                     isMaximized={false}
                     readOnly={round.status === 'Completed'}
                  />
               )}

               {round.type === 'Assessment' && round.questions && (
                  <div className="space-y-6">
                     <div className="space-y-4">
                        {round.questions.map((q: any) => (
                           <AssessmentQuestion key={q.id} question={q} />
                        ))}
                     </div>

                     {/* Round Level Feedback */}
                     <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                        <div className="flex justify-between items-start mb-3">
                           <div>
                              <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Assessment Feedback</h5>
                              <p className="text-xs text-slate-400">Rate the candidate's performance in this specific round.</p>
                           </div>
                           <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600">
                              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Score:</span>
                              <StarRating rating={roundRating} onRate={setRoundRating} />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <textarea
                              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded text-sm focus:outline-none focus:border-green-500 resize-none h-24 bg-white dark:bg-slate-800 dark:text-slate-200"
                              placeholder="Enter detailed feedback for this assessment round..."
                           ></textarea>
                           <div className="flex justify-end">
                              <button className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded shadow-sm transition-colors">Save Assessment Review</button>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

export const CampaignDetailView = ({ campaign, onBack, onMaximizeTemplate, isScrolled, onShowMatchScore, onSaveFeedback }: any) => {

   const navigate = useNavigate();

   const [expandedRoundId, setExpandedRoundId] = useState<number | null>(null);
   const [overallRating, setOverallRating] = useState(campaign?.rating || 0);
   const [overallComment, setOverallComment] = useState(campaign?.feedback || "");
   const [overallStatus, setOverallStatus] = useState(campaign?.status || "Pending");
   const [isSaving, setIsSaving] = useState(false);

   useEffect(() => {
      if (campaign) {
         setOverallRating(campaign.rating || 0);
         setOverallComment(campaign.feedback || "");
         setOverallStatus(campaign.status || "Pending");
      }
   }, [campaign]);

   const handleSave = async () => {
      if (!onSaveFeedback) return;
      setIsSaving(true);
      try {
         await onSaveFeedback(campaign.id, {
            feedBack: {
               rating: overallRating,
               comment: overallComment,
               status: overallStatus
            }
         });
      } finally {
         setIsSaving(false);
      }
   };

   if (!campaign) return null;

   return (
      <div className="flex flex-col min-h-full bg-white dark:bg-slate-900 shadow-sm overflow-hidden relative transition-colors">
         {/* Sticky Header */}
         <div className={`bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-30 transition-all duration-300 sticky top-0 ${isScrolled ? 'py-2 px-6 shadow-sm sticky top-0' : 'py-6 px-8'}`}>
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-4 overflow-hidden">
                  <button onClick={onBack} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors shrink-0" title="Back to Campaigns List"><ChevronLeft size={24} /></button>

                  {/* COMPACT STATE */}
                  <div className={`flex items-center gap-4 transition-all duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                     <button
                        onClick={() => onShowMatchScore && onShowMatchScore(campaign)}
                        className={`rounded-full ${getScoreColor(parseFloat(campaign.score))} flex items-center justify-center font-bold shadow-sm w-8 h-8 text-[10px] shrink-0 transform hover:scale-110 transition-transform`}
                     >
                        {formatScore(campaign.score)}
                     </button>
                     <div className="flex items-center gap-3 min-w-0">
                        <h3 className="font-bold text-green-600 dark:text-green-400 truncate text-base">{campaign.name}</h3>
                        <div className="hidden sm:block font-mono text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">ID: {campaign.jobID}</div>
                        <StatusBadge status={campaign.status} />
                     </div>
                  </div>

                  {/* EXPANDED STATE */}
                  <div className={`flex items-start gap-4 transition-all duration-300 ${!isScrolled ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                     <button
                        onClick={() => onShowMatchScore && onShowMatchScore(campaign)}
                        className={`w-10 h-10 rounded-full ${getScoreColor(parseFloat(campaign.score))} flex items-center justify-center font-bold shadow-sm hover:scale-105 transition-transform shrink-0`}
                     >
                        {formatScore(campaign.score)}
                     </button>
                     <div>
                        <h3 className="font-bold text-green-600 dark:text-green-400 text-xl leading-tight mb-1">{campaign.name}</h3>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                           <span className="flex items-center gap-1"><Briefcase size={12} /> {campaign.role}</span>
                           <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">ID: {campaign.jobID}</span>
                           <span className="flex items-center gap-1"><MapPin size={12} /> {campaign.location}</span>
                           <StatusBadge status={campaign.status} />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-2 shrink-0">
                  <button className="p-2 text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full transition-colors" title="Share Campaign"><Share2 size={18} /></button>
                  <button onClick={() => navigate(`/showcampaign/sourceai/jobdescription/${campaign.campaignID || campaign.id}`)} className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors" title="View Job Description"><Briefcase size={18} /></button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-colors" title="More Options"><MoreHorizontal size={18} /></button>
               </div>
            </div>
         </div>

         {/* Content Area */}
         <div className="flex-1 p-6 space-y-6">
            <div className="flex items-center gap-2 mb-2">
               <Activity size={18} className="text-slate-700 dark:text-slate-300" />
               <h4 className="font-bold text-slate-700 dark:text-slate-300">Screening Rounds</h4>
            </div>
            {(!campaign.rounds || campaign.rounds.length === 0) ? (
               <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center shadow-sm">
                  <p className="text-slate-500 dark:text-slate-400 mb-1">No Screening Rounds Scheduled!</p>
               </div>
            ) : (
               <div className="space-y-4">
                  {campaign.rounds.map((round: any) => (
                     <RoundCard
                        key={round.id} round={round}
                        isOpen={expandedRoundId === round.id}
                        onToggle={() => setExpandedRoundId(expandedRoundId === round.id ? null : round.id)}
                        onMaximizeTemplate={onMaximizeTemplate}
                     />
                  ))}
               </div>
            )}

            <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
               <div className="flex items-center gap-2 mb-4">
                  <CheckCircle size={18} className="text-slate-700 dark:text-slate-300" />
                  <h4 className="font-bold text-slate-700 dark:text-slate-300">Overall Feedback</h4>
               </div>

               <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Rate this candidate</label>
                     <div className="flex items-center gap-2">
                        <StarRating rating={overallRating} onRate={setOverallRating} />
                        <span className="text-xs text-slate-400 font-medium">{overallRating > 0 ? `${overallRating}/5` : ''}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                     <div className="md:col-span-1">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Status</label>
                        <select
                           value={overallStatus}
                           onChange={(e) => setOverallStatus(e.target.value)}
                           className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-700 dark:text-slate-200 focus:outline-none focus:border-green-500"
                        >
                           <option value="Pending">Pending</option>
                           <option value="Shortlisted">Shortlisted</option>
                           <option value="Rejected">Rejected</option>
                           <option value="On Hold">On Hold</option>
                        </select>
                     </div>
                     <div className="md:col-span-3">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Overall Comment</label>
                        <textarea
                           value={overallComment}
                           onChange={(e) => setOverallComment(e.target.value)}
                           className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded text-sm focus:outline-none focus:border-green-500 resize-none h-20 bg-white dark:bg-slate-700 dark:text-slate-200"
                           placeholder="Add overall feedback for this candidate..."
                        ></textarea>
                     </div>
                  </div>

                  <div className="flex justify-end pt-2">
                     <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded shadow-sm transition-colors flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                     >
                        {isSaving ? (
                           <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Saving...
                           </>
                        ) : 'Save Feedback'}
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export const CampaignCard = ({ camp, onPreview, expanded, onToggle, onShowMatchScore }: any) => {
   const navigate = useNavigate();

   return (
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md overflow-hidden">
         <div className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <div className="shrink-0">
               <button
                  onClick={(e) => { e.stopPropagation(); onShowMatchScore && onShowMatchScore(camp); }}
                  className={`w-8 h-8 rounded-full ${getScoreColor(parseFloat(camp.score))} flex items-center justify-center font-bold shadow-sm text-[10px] hover:scale-110 transition-transform`}
               >
                  {formatScore(camp.score)}
               </button>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
               <button onClick={() => onPreview(camp)} className="font-medium text-green-600 dark:text-green-400 text-sm truncate hover:underline text-left">{camp.name}</button>
               <div className="hidden md:block font-mono text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded w-fit">ID: {camp.jobID}</div>
               <div className="text-xs text-slate-500 dark:text-slate-400">Linked: {camp.date}</div>
               <div><StatusBadge status={camp.status} /></div>
            </div>
            <button onClick={onToggle} className="text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors p-2">{expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</button>
         </div>
         {expanded && (
            <div className="px-4 pb-4 pt-0 bg-slate-50/50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700 animate-in slide-in-from-top-2 duration-200">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 pt-4 text-sm">
                  <div><p className="text-xs font-semibold text-slate-400 uppercase mb-1">Role / Position</p><div className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><Briefcase size={14} className="text-slate-400" />{camp.role}</div></div>
                  <div><p className="text-xs font-semibold text-slate-400 uppercase mb-1">Company</p><div className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><Building2 size={14} className="text-slate-400" />{camp.company}</div></div>
                  <div><p className="text-xs font-semibold text-slate-400 uppercase mb-1">Location</p><div className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><MapPin size={14} className="text-slate-400" /><span className="truncate" title={camp.location}>{camp.location}</span></div></div>
                  <div><p className="text-xs font-semibold text-slate-400 uppercase mb-1">Source</p><div className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><Share2 size={14} className="text-slate-400" />{camp.source}</div></div>
                  <div><p className="text-xs font-semibold text-slate-400 uppercase mb-1">Offer Status</p><div className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><CheckCircle size={14} className="text-slate-400" />{camp.offerStatus}</div></div>
                  <div><p className="text-xs font-semibold text-slate-400 uppercase mb-1">Status Check</p><div className="flex justify-between items-center text-xs"><span className="text-slate-500 dark:text-slate-400">Applied: <b className="text-slate-800 dark:text-slate-200">{camp.applied}</b></span><span className="text-slate-500 dark:text-slate-400">Feedback: <b className="text-slate-800 dark:text-slate-200">{camp.feedback}</b></span></div></div>
               </div>
               <div className="mt-4 flex justify-end gap-2 pt-3 border-t border-slate-200/50 dark:border-slate-600/50">
                  <button onClick={() => navigate(`/showcampaign/sourceai/jobdescription/${camp.campaignID || camp.id}`)} className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1.5 hover:bg-white dark:hover:bg-slate-700 rounded border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all">View Job Details</button>
                  <button className="text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded transition-colors">Unlink Campaign</button>
               </div>
            </div>
         )}
      </div>
   );
};

export const mapInterviewToCampaign = (iv: any) => {
   const allSkills = iv.MRI?.experience?.skills || iv.experience?.skills || [];
   return {
      id: iv._id,
      campaignID: iv.campaign?._id || iv.campaignID,
      name: iv.campaign?.title || "Unknown Campaign",
      jobID: iv.campaign?.passcode || "N/A",
      date: iv.sourceAI?.linkedAt ? new Date(iv.sourceAI.linkedAt).toLocaleDateString() :
         iv.createdAt ? new Date(iv.createdAt).toLocaleDateString() : 'N/A',
      status: iv.status || 'Linked',
      offerStatus: iv.offerStatus || 'N/A',
      role: iv.MRI?.experience?.jobTitle?.jobTitle || "Not Specified",
      company: iv.campaign?.company || "MapRecruit",
      location: iv.campaign?.locations?.[0]?.text || "Remote / Various",
      applied: iv.applicationType === 'Applied' ? 'Yes' : 'No',
      source: iv.sourceAI?.applicationSource || "Other",
      feedback: iv.feedBack?.comment || "No feedback yet",
      rating: iv.feedBack?.rating || 0,
      score: iv.MRI?.actual_mri_score !== undefined ? iv.MRI.actual_mri_score : 0,
      rounds: iv.screeningRounds || [],
      skills: {
         matched: {
            required: allSkills.filter((s: any) => s.eligibilityCheck === 'Required' && getSkillCategory(s) !== SkillMatchCategory.NOT_MENTIONED)
               .map((s: any) => ({ text: stripHtml(s.jobSkill), category: getSkillCategory(s) })),
            preferred: allSkills.filter((s: any) => s.eligibilityCheck === 'Preferred' && getSkillCategory(s) !== SkillMatchCategory.NOT_MENTIONED)
               .map((s: any) => ({ text: stripHtml(s.jobSkill), category: getSkillCategory(s) }))
         },
         missing: {
            required: allSkills.filter((s: any) => s.eligibilityCheck === 'Required' && getSkillCategory(s) === SkillMatchCategory.NOT_MENTIONED)
               .map((s: any) => stripHtml(s.jobSkill)),
            preferred: allSkills.filter((s: any) => s.eligibilityCheck === 'Preferred' && getSkillCategory(s) === SkillMatchCategory.NOT_MENTIONED)
               .map((s: any) => stripHtml(s.jobSkill))
         }
      },
      aiSummary: iv.MRI?.genAI?.[0]?.matchSummary || iv.MRI?.experience?.matchSummary || 'No summary available.'
   };
};

export const CampaignsView = ({ interviews, onPreviewCampaign, onShowMatchScore, onSaveFeedback }: any) => {
   const [expandedId, setExpandedId] = useState<string | null>(null);

   const displayCampaigns = (Array.isArray(interviews) ? interviews : []).map(mapInterviewToCampaign);

   return (
      <div className="space-y-4">
         <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-green-600 dark:text-green-400 text-lg">Linked Campaigns</h3>
            <div className="flex gap-2">
               <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search..." className="pl-9 pr-4 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full w-64 focus:outline-none focus:border-green-500 dark:text-slate-200" />
               </div>
            </div>
         </div>
         <div className="space-y-2">
            {displayCampaigns.length > 0 ? (
               displayCampaigns.map((camp: any) => (
                  <CampaignCard
                     key={camp.id}
                     camp={camp}
                     onPreview={onPreviewCampaign}
                     onShowMatchScore={onShowMatchScore}
                     expanded={expandedId === camp.id}
                     onToggle={() => setExpandedId(expandedId === camp.id ? null : camp.id)}
                  />
               ))
            ) : (
               <div className="bg-white dark:bg-slate-800 p-8 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-500">
                  No campaigns linked to this candidate.
               </div>
            )}
         </div>
         <div className="text-xs text-slate-400 mt-2">Total Rows: {displayCampaigns.length}</div>
      </div>
   );
};
