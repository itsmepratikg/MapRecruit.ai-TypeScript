
import React, { useState } from 'react';
import {
   Briefcase, MapPin, CheckCircle, Clock, FileEdit,
   MessageCircle, Paperclip, Send, AlertCircle, ExternalLink, ThumbsUp,
   User, Phone, Mail, Globe, Award, Calendar, Shield, Lock, Star, X, FileText
} from 'lucide-react';
import { SectionCard, SecureContactCard } from './Common';
import { CANDIDATE } from '../data';
import { useActivities } from '../hooks/useActivities';
import { useParams } from 'react-router-dom';

import { Activity } from '../types/Activity';
import { ActivityItem } from './ActivityItem';


// Updated Profile Details Component to handle dynamic JSON schema with the OLD UI Layout
export const ProfileDetails = ({ data, onEditSection }: { data?: any, onEditSection?: (tab: string) => void }) => {
   const [showAllSkills, setShowAllSkills] = useState(false);

   // Safe extraction of nested data from MongoDB Document root
   const resume = data?.resume || {};
   const profile = resume.profile || {};
   const summary = resume.professionalSummary || {};
   const experience = resume.professionalExperience || [];
   const education = resume.professionalQualification?.education || [];
   const skills = resume.professionalQualification?.skills || [];

   // Format helpers
   const formatSalary = (salary: any) => {
      if (!salary) return 'N/A';
      if (salary.text) return salary.text;
      if (salary.value) return `${salary.currency || '$'} ${salary.value} ${salary.period || ''}`;
      return 'N/A';
   };

   const toSentenceCase = (str: string) => {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
   };

   // Helper for Section Header with Edit Button
   const SectionHeader = ({ title, tab }: { title: string, tab: string }) => (
      <div className="flex justify-between items-center mb-4">
         <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</h3>
         {onEditSection && (
            <button
               onClick={() => onEditSection(tab)}
               className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-emerald-600 transition-colors"
               title={`Edit ${title}`}
            >
               <FileEdit size={14} />
            </button>
         )}
      </div>
   );

   return (
      <>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* LEFT COLUMN - MAIN CONTENT */}
            <div className="lg:col-span-2 space-y-6">

               {/* Professional Summary */}
               <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors">
                  <SectionHeader title="Professional Summary" tab="SUMMARY" />
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                     {summary.summary || "No summary provided."}
                  </p>
               </div>

               {/* Work Experience - Timeline UI */}
               <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors">
                  <SectionHeader title="Work Experience" tab="EXPERIENCE" />

                  <div className="relative border-l-2 border-slate-100 dark:border-slate-700 ml-3 space-y-8 pb-2">
                     {experience.map((exp: any, idx: number) => (
                        <div key={idx} className="relative pl-8">
                           {/* Timeline Dot */}
                           <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 shadow-sm z-10 ${exp.currentStatus === 'Working' || idx === 0 ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>

                           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                              <div>
                                 <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">{exp.jobTitle?.text || 'N/A'}</h4>
                                 <div className="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center gap-2 mt-0.5">
                                    {exp.company?.text || 'Unknown Company'}
                                    {exp.location?.text && <span className="text-slate-400 font-normal text-xs">• {exp.location.text}</span>}
                                 </div>
                              </div>
                              <div className="mt-1 sm:mt-0 text-right">
                                 <div className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded inline-block font-medium">
                                    {exp.startDate?.text || 'N/A'} - {exp.endDate?.text || 'Present'}
                                 </div>
                                 {exp.duration?.text && <div className="text-[10px] text-slate-400 mt-1">{exp.duration.text}</div>}
                              </div>
                           </div>

                           <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3 whitespace-pre-line">
                              {exp.description || "No description provided."}
                           </p>

                           {/* Skills used in this role */}
                           {exp.skills && exp.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                 {exp.skills.slice(0, 5).map((skill: any, sIdx: number) => (
                                    <span key={sIdx} className="text-[10px] px-2 py-0.5 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-full text-slate-500 dark:text-slate-300">
                                       {toSentenceCase(skill.text)}
                                    </span>
                                 ))}
                                 {exp.skills.length > 5 && <span className="text-[10px] px-2 py-0.5 text-slate-400">+{exp.skills.length - 5} more</span>}
                              </div>
                           )}
                        </div>
                     ))}
                     {experience.length === 0 && <div className="pl-8 text-slate-400 italic">No experience listed.</div>}
                  </div>
               </div>

               {/* Education */}
               <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors">
                  <SectionHeader title="Education" tab="EDUCATION" />
                  <div className="space-y-4">
                     {education.map((edu: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-4 p-4 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                           <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300 shrink-0">
                              <Award size={20} />
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{edu.degree?.text || 'Degree'}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mt-0.5">{edu.university?.text || edu.campus?.text || 'University'}</p>
                              <p className="text-xs text-slate-400 mt-1">{edu.endDate?.year || 'Year N/A'}</p>
                           </div>
                        </div>
                     ))}
                     {education.length === 0 && <div className="text-slate-400 italic">No education listed.</div>}
                  </div>
               </div>

            </div>

            {/* RIGHT COLUMN - SIDEBAR */}
            <div className="space-y-6">



               {/* Skills & Competencies */}
               <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-5 transition-colors">
                  <SectionHeader title="Skills & Competencies" tab="SKILLS" />
                  <div className="flex flex-wrap gap-2">
                     {skills.slice(0, 15).map((skill: any, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-200 hover:border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-default">
                           {toSentenceCase(skill.text)}
                           {skill.yearsOfExperience ? <span className="ml-1 text-slate-400">({skill.yearsOfExperience}y)</span> : ''}
                        </span>
                     ))}
                     {skills.length > 15 && (
                        <button
                           onClick={() => setShowAllSkills(true)}
                           className="px-2.5 py-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                        >
                           +{skills.length - 15} more
                        </button>
                     )}
                     {skills.length === 0 && <span className="text-slate-400 text-xs">No skills extracted.</span>}
                  </div>
               </div>

               {/* Key Details */}
               <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-5 transition-colors">
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Key Details</h3>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Willing to Relocate</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{summary.preferredLocations && summary.preferredLocations.length > 0 ? 'Yes' : 'No'}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Work Authorization</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{summary.workPermit?.text || 'Unknown'}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Notice Period</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{summary.noticePeriod?.text || 'N/A'}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Current Salary</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{formatSalary(summary.currentSalary)}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Expected Salary</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{formatSalary(summary.expectedSalary)}</span>
                     </div>
                     <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Experience</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{summary.yearsOfExperience?.finalYears || 0} Years</span>
                     </div>
                  </div>
               </div>

               {/* AI Summary Widget */}
               {data?.genAISummary && (
                  <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/30 dark:to-slate-800 rounded-lg border border-indigo-100 dark:border-indigo-800 shadow-sm p-5 relative overflow-hidden transition-colors">
                     <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Briefcase size={64} className="text-indigo-600 dark:text-indigo-400" />
                     </div>
                     <h3 className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <AlertCircle size={14} /> AI Profile Summary
                     </h3>
                     <p className="text-xs leading-relaxed text-indigo-900/80 dark:text-indigo-200/80">
                        {data.resumeDetails?.genAISummary?.profileSummary || "AI is analyzing this profile to provide insights on fit and potential."}
                     </p>
                  </div>
               )}

            </div>
         </div>

         {/* All Skills Modal */}
         {showAllSkills && (
            <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
               <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[80vh]">
                  <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                     <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">All Skills ({skills.length})</h2>
                     <button onClick={() => setShowAllSkills(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <X size={20} />
                     </button>
                  </div>
                  <div className="p-6 overflow-y-auto custom-scrollbar">
                     <div className="flex flex-wrap gap-2">
                        {skills.map((skill: any, idx: number) => (
                           <span key={idx} className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                              {toSentenceCase(skill.text)}
                              {skill.yearsOfExperience ? <span className="ml-1.5 text-slate-400 text-xs font-normal">({skill.yearsOfExperience} Years)</span> : ''}
                           </span>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export const ActivitiesView = ({ companyID, resumeID }: { companyID?: string, resumeID?: string }) => {
   const { id: paramID } = useParams<{ id: string }>();
   const activeResumeID = resumeID || paramID;

   const { activities, loading, error } = useActivities({
      candidateID: activeResumeID,
      limit: 100
   });

   // Filter State
   const [filterType, setFilterType] = useState<string>('');
   const [dateRange, setDateRange] = useState<{ start: string, end: string }>({ start: '', end: '' });
   const [isFilterOpen, setIsFilterOpen] = useState(false);

   if (loading) return <div className="p-8 text-center text-slate-500">Loading activities...</div>;
   if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

   // 1. Get Unique Activity Types for Dropdown
   const uniqueTypes = Array.from(new Set(activities.map(a => a.activityType))).sort();

   // 2. Filter Logic
   const filteredActivities = activities.filter(act => {
      // Basic Context Checks
      if (companyID && act.companyID !== companyID) return false;
      if (activeResumeID && act.resumeID) {
         const hasMatch = act.resumeID.some((id: any) => {
            const val = typeof id === 'object' && id?._id ? id._id : id;
            return val === activeResumeID;
         });
         if (!hasMatch) return false;
      }
      if (act.visible === false || act.deleted === true) return false;

      // User Filters
      if (filterType && act.activityType !== filterType) return false;

      if (dateRange.start) {
         const actDate = new Date(act.activityAt || act.createdAt);
         const startDate = new Date(dateRange.start);
         if (actDate < startDate) return false;
      }
      if (dateRange.end) {
         const actDate = new Date(act.activityAt || act.createdAt);
         const endDate = new Date(dateRange.end);
         endDate.setHours(23, 59, 59, 999); // End of day
         if (actDate > endDate) return false;
      }

      return true;
   });

   // 3. Group by Date
   const groupedActivities: Record<string, Activity[]> = {};
   filteredActivities.forEach(act => {
      const date = new Date(act.activityAt || act.createdAt);
      // Format: "Monday, 30 June 2025"
      const dateKey = date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      if (!groupedActivities[dateKey]) {
         groupedActivities[dateKey] = [];
      }
      groupedActivities[dateKey].push(act);
   });

   return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
         {/* Interaction Header */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
            <div>
               <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Activity Log</h3>
               <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{filteredActivities.length} events recorded</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
               {/* Type Filter */}
               <select
                  className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-600 dark:text-slate-200 transition-colors"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
               >
                  <option value="">All Types</option>
                  {uniqueTypes.map(type => (
                     <option key={type} value={type}>{type}</option>
                  ))}
               </select>

               {/* Date Filter Toggle */}
               <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`p-2 rounded-lg border transition-colors ${isFilterOpen || dateRange.start ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300'}`}
                  title="Date Filter"
               >
                  <Calendar size={18} />
               </button>
            </div>
         </div>

         {/* Date Range Picker Panel */}
         {(isFilterOpen || dateRange.start || dateRange.end) && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-end gap-4 animate-in slide-in-from-top-2 transition-colors">
               <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Start Date</label>
                  <input
                     type="date"
                     className="px-3 py-2 text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-slate-200 dark:[color-scheme:dark]"
                     value={dateRange.start}
                     onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">End Date</label>
                  <input
                     type="date"
                     className="px-3 py-2 text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-slate-200 dark:[color-scheme:dark]"
                     value={dateRange.end}
                     onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
               </div>
               <button
                  onClick={() => { setDateRange({ start: '', end: '' }); setIsFilterOpen(false); }}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
               >
                  Clear Dates
               </button>
            </div>
         )}

         {/* Activities List */}
         <div className="space-y-8 pb-8">
            {filteredActivities.length === 0 && (
               <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                     <FileText size={32} opacity={0.5} />
                  </div>
                  <p>No activities found matching filters.</p>
                  <button onClick={() => { setFilterType(''); setDateRange({ start: '', end: '' }); }} className="mt-2 text-sm text-emerald-600 font-medium hover:underline">
                     Clear Filters
                  </button>
               </div>
            )}

            {Object.entries(groupedActivities).map(([dateLabel, acts], gIdx) => (
               <div key={dateLabel} className="relative animate-in fade-in duration-500" style={{ animationDelay: `${gIdx * 100}ms` }}>
                  {/* Date Header */}
                  <div className="sticky top-0 z-20 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur py-2 mb-4 border-b border-slate-200 dark:border-slate-800 transition-colors">
                     <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider pl-1">
                        {dateLabel}
                     </h4>
                  </div>

                  <div className="space-y-0">
                     {acts.map((act, idx) => (
                        // Use index within common date group? Or global?
                        // ActivityItem index prop controls the 'dot' color (first item green).
                        // Should we make the first item OF THE DAY green? Or just first global? 
                        // Current logic makes first global green. Let's pass 'idx' here which resets per day.
                        // So first item of each day is green? Maybe nice.
                        <ActivityItem key={act._id || idx} activity={act} index={idx} viewContext="profile" />
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};


export const TalentChatView = () => (
   <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-[600px] overflow-hidden transition-colors">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
         <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"><MessageCircle size={18} className="text-emerald-600 dark:text-emerald-400" /> Talent Chat</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Secure conversation with {CANDIDATE.name}</p>
         </div>
         <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">Online</span>
      </div>
      <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30 dark:bg-slate-900/30 space-y-6 custom-scrollbar">
         <div className="flex justify-center"><span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">Today, 9:41 AM</span></div>
         <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs">R</div>
            <div><div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 dark:text-slate-200 max-w-md">Hi Testy, thanks for applying. Are you available for a quick call tomorrow?</div><span className="text-[10px] text-slate-400 ml-1 mt-1 block">Recruiter • 9:42 AM</span></div>
         </div>
         <div className="flex gap-3 flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 text-xs font-bold">TM</div>
            <div><div className="bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-sm max-w-md">Hello! Yes, I am available anytime after 2 PM EST. Looking forward to it.</div><span className="text-[10px] text-slate-400 text-right mr-1 mt-1 block">Read • 9:45 AM</span></div>
         </div>
      </div>
      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
         <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-colors"><Paperclip size={20} /></button>
            <input type="text" placeholder="Type a message..." className="flex-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all dark:text-slate-200 dark:placeholder-slate-400" />
            <button className="p-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-full shadow-sm transition-colors"><Send size={18} /></button>
         </div>
      </div>
   </div>
);

export const RecommendedView = () => (
   <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500 transition-colors">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
         <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Recommended Jobs</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">AI-suggested requisitions based on candidate skills.</p>
         </div>
         <button className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors">
            Run Matching Engine
         </button>
      </div>
      <div className="overflow-x-auto">
         <table className="w-full text-sm text-left">
            <thead className="bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
               <tr>
                  <th className="px-6 py-4 uppercase text-xs tracking-wider">Campaign Name</th>
                  <th className="px-6 py-4 uppercase text-xs tracking-wider">Job ID</th>
                  <th className="px-6 py-4 uppercase text-xs tracking-wider">Location</th>
                  <th className="px-6 py-4 uppercase text-xs tracking-wider">Company</th>
                  <th className="px-6 py-4 w-24"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
               {CANDIDATE.recommended?.map((rec: any) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors group">
                     <td className="px-6 py-4 font-bold text-emerald-700 dark:text-emerald-400 group-hover:underline cursor-pointer">{rec.name}</td>
                     <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono text-xs bg-slate-50/0 dark:bg-slate-700/0 group-hover:bg-white dark:group-hover:bg-slate-700 w-fit rounded px-2">{rec.jobID}</td>
                     <td className="px-6 py-4 text-slate-600 dark:text-slate-300"><div className="flex items-center gap-2"><MapPin size={14} className="text-slate-400" /> {rec.location}</div></td>
                     <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{rec.company}</td>
                     <td className="px-6 py-4 text-right">
                        <button className="px-4 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white hover:border-emerald-600 dark:hover:bg-emerald-600 dark:hover:text-white dark:hover:border-emerald-600 transition-all shadow-sm">Select</button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   </div>
);

export const SimilarProfilesView = () => (
   <div className="space-y-4 max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-5 flex items-start gap-4 mb-6">
         <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-full text-blue-600 dark:text-blue-400">
            <AlertCircle size={24} />
         </div>
         <div>
            <h4 className="font-bold text-blue-900 dark:text-blue-300 text-sm">Similar Candidates Found</h4>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1 leading-relaxed">These candidates share similar skills, experience, or location data with the current profile.</p>
         </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
         {CANDIDATE.similar?.map((profile: any) => (
            <div key={profile.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all flex flex-col sm:flex-row items-center justify-between group">
               <div className="flex items-center gap-5 w-full sm:w-auto">
                  <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold text-xl group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                     {profile.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors text-base cursor-pointer">{profile.name}</h4>
                     <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-sm text-slate-500 dark:text-slate-400 mt-1">
                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" /> {profile.location}</span>
                        <span className="hidden sm:inline text-slate-300 dark:text-slate-600">|</span>
                        <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-slate-400" /> {profile.role}</span>
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                     <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Match Score</span>
                     <div className="flex items-center gap-1 justify-end">
                        <div className="h-2 w-16 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${profile.score}%` }}></div>
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">{profile.score}%</span>
                     </div>
                  </div>
                  <button className="p-2.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900">
                     <ExternalLink size={20} />
                  </button>
               </div>
            </div>
         ))}
      </div>
   </div>
);
