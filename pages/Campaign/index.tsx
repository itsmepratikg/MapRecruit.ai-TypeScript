
import React, { useState, useEffect, useRef } from 'react';
import {
   Briefcase, MapPin, Clock, Users, Plus, Share2, MoreHorizontal, ChevronLeft
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
import { Routes, Route, Navigate } from 'react-router-dom';

const CampaignHeader = ({ campaign, isScrolled, onBack }: { campaign: Campaign, isScrolled: boolean, onBack?: () => void }) => {
   return (
      <div className={`bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm sticky top-0 z-30 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-0'}`}>
         <div className="flex flex-col lg:flex-row">
            {/* Left Side: Campaign Info */}
            <div className={`flex-1 flex items-start gap-4 transition-all duration-300 ${isScrolled ? 'px-6 items-center' : 'p-6'}`}>
               <button onClick={onBack} className="mt-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 lg:hidden"><ChevronLeft size={24} /></button>
               <div className="flex-shrink-0 hidden lg:block">
                  <div className={`rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md transition-all duration-300 ${isScrolled ? 'w-10 h-10' : 'w-14 h-14'}`}>
                     <Briefcase size={isScrolled ? 18 : 24} />
                  </div>
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-1">
                     <h1 className={`font-bold text-gray-800 dark:text-slate-100 truncate transition-all duration-300 ${isScrolled ? 'text-base' : 'text-lg'}`} title={campaign.name}>{campaign.name}</h1>

                     {/* Always visible info */}
                     <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 hidden md:block"></span>
                        <span className="font-mono text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">ID: {campaign.jobID}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                        <span className={campaign.daysLeft < 5 ? "text-red-500 font-medium" : "text-green-600 dark:text-green-400 font-medium"}>
                           {campaign.daysLeft} Days Left
                        </span>
                        <StatusBadge status={campaign.status} />
                     </div>
                  </div>

                  {/* Collapsible Details */}
                  <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-slate-400 mt-1 ${isScrolled ? 'hidden' : 'block'}`}>
                     <span className="flex items-center gap-1"><Briefcase size={12} /> {campaign.role}</span>
                     <span className="flex items-center gap-1"><Users size={12} /> {campaign.candidates} Candidates</span>
                     <span className="flex items-center gap-1"><Clock size={12} /> Updated {campaign.updatedDate}</span>
                  </div>
               </div>
            </div>

            {/* Right Side: Actions */}
            <div className={`flex items-center gap-3 transition-all duration-300 ${isScrolled ? 'pr-6' : 'p-6 pt-2 lg:pt-6'}`}>
               <div className="flex -space-x-2 mr-2">
                  {campaign.members.map((m, i) => (
                     <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${m.color} border-2 border-white dark:border-slate-800 ring-1 ring-white dark:ring-slate-700`} title={m.name}>
                        {m.initials}
                     </div>
                  ))}
                  <button className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                     <Plus size={14} />
                  </button>
               </div>

               <div className="h-8 w-px bg-gray-200 dark:bg-slate-700 mx-1 hidden md:block"></div>

               <button className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                  <Share2 size={20} />
               </button>
               <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <MoreHorizontal size={20} />
               </button>
            </div>
         </div>
      </div>
   );
};

export const CampaignDashboard = ({ campaign, onBack }: { campaign: Campaign, onBack?: () => void }) => {
   const [isScrolled, setIsScrolled] = useState(false);
   const scrollContainerRef = useRef<HTMLDivElement>(null);

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
         <CampaignHeader campaign={campaign} isScrolled={isScrolled} onBack={onBack} />
         <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar">
            <Routes>
               <Route path="/" element={<Navigate to="Intelligence" replace />} />
               <Route path="Intelligence" element={<Intelligence />} />
               <Route path="SourceAI/*" element={
                  <Routes>
                     <Route path="/" element={<Navigate to="Attach" replace />} />
                     <Route path="Attach" element={<SourceAIWrapper activeView="ATTACH" />} />
                     <Route path="Profiles" element={<SourceAIWrapper activeView="PROFILES" />} />
                     <Route path="Integrations" element={<SourceAIWrapper activeView="INTEGRATIONS" />} />
                     <Route path="JD" element={<SourceAIWrapper activeView="JD" />} />
                  </Routes>
               } />
               <Route path="MatchAI" element={<MatchAI />} />
               <Route path="EngageAI/*" element={
                  <Routes>
                     <Route path="/" element={<Navigate to="Builder" replace />} />
                     <Route path="Builder" element={<EngageAIWrapper activeView="BUILDER" />} />
                     <Route path="Room" element={<EngageAIWrapper activeView="ROOM" />} />
                     <Route path="Tracking" element={<EngageAIWrapper activeView="TRACKING" />} />
                  </Routes>
               } />
               <Route path="Recommendations" element={<Recommendations activeView="PROFILES" />} />
               <Route path="Settings" element={<CampaignSettings campaign={campaign} />} />
               <Route path="*" element={<Navigate to="Intelligence" replace />} />
            </Routes>
         </div>
      </div>
   );
};
