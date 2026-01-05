import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, Search, ArrowLeft, MoreHorizontal, PlusCircle, 
  ChevronLeft, ChevronRight, Filter, Link, Upload, Plus, History,
  RotateCcw, MoreVertical, HelpCircle, X, Check, Calendar, Power,
  BarChart as BarChartIcon, PieChart as PieChartIcon, TrendingUp, CheckCircle, Clock, Users,
  AlertCircle, FileText, Share2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, LineChart, Line
} from 'recharts';
import { Campaign, PanelMember, CampaignActivity } from '../types';
import { PANEL_MEMBERS, CAMPAIGN_ACTIVITIES } from '../data';
import { CampaignSourceAI } from '../components/CampaignSourceAI';
import { EngageWorkflow } from '../components/EngageWorkflow';
import { MatchWorkflow } from '../components/MatchWorkflow';

// --- MOCK DATA ---

const TREND_DATA = [
  { name: 'Dec 20', profiles: 280, applies: 240 },
  { name: 'Dec 21', profiles: 480, applies: 230 },
  { name: 'Dec 22', profiles: 580, applies: 490 },
  { name: 'Dec 23', profiles: 450, applies: 380 },
  { name: 'Dec 24', profiles: 817, applies: 268 },
  { name: 'Dec 25', profiles: 180, applies: 160 },
  { name: 'Dec 26', profiles: 120, applies: 110 },
];

const SOURCE_DATA = [
  { name: 'LinkedIn', value: 35, color: '#82ca9d' },
  { name: 'ZipRecruiter', value: 25, color: '#ffc658' },
  { name: 'Indeed', value: 14, color: '#ff8042' },
  { name: 'Dice', value: 17, color: '#8884d8' },
  { name: 'Other', value: 9, color: '#a4de6c' },
];

const EMAIL_DATA = [
  { name: 'Dec 20', opened: 0, bounced: 0 },
  { name: 'Dec 21', opened: 0, bounced: 0 },
  { name: 'Dec 22', opened: 0, bounced: 0 },
  { name: 'Dec 23', opened: 0, bounced: 0 },
  { name: 'Dec 24', opened: 0, bounced: 0 },
  { name: 'Dec 25', opened: 0, bounced: 0 },
  { name: 'Dec 26', opened: 0, bounced: 0 },
];

// --- SUB-COMPONENTS ---

const RecommendedProfilesView = () => (
  <div className="p-8 h-full">
     <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Recommended Profiles</h2>
     <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
           <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
              <tr>
                 <th className="px-6 py-4">Candidate</th>
                 <th className="px-6 py-4">Current Role</th>
                 <th className="px-6 py-4">Match Reason</th>
                 <th className="px-6 py-4">Action</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                 <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">David Miller</td>
                 <td className="px-6 py-4 text-slate-500 dark:text-slate-400">Senior Warehouse Lead</td>
                 <td className="px-6 py-4 text-slate-500 dark:text-slate-400"><span className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs">Skills Match</span></td>
                 <td className="px-6 py-4"><button className="text-blue-600 dark:text-blue-400 hover:underline">View Profile</button></td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                 <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">Sarah Jenkins</td>
                 <td className="px-6 py-4 text-slate-500 dark:text-slate-400">Logistics Coordinator</td>
                 <td className="px-6 py-4 text-slate-500 dark:text-slate-400"><span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded text-xs">Experience Match</span></td>
                 <td className="px-6 py-4"><button className="text-blue-600 dark:text-blue-400 hover:underline">View Profile</button></td>
              </tr>
           </tbody>
        </table>
     </div>
  </div>
);

const CampaignHeader = ({ campaign, isScrolled }: { campaign: Campaign, isScrolled: boolean }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm sticky top-0 z-30 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-0'}`}>
      <div className="flex flex-col lg:flex-row">
        {/* Left Side: Campaign Info */}
        <div className={`flex-1 flex items-start gap-4 transition-all duration-300 ${isScrolled ? 'px-6 items-center' : 'p-6'}`}>
          <div className="flex-shrink-0">
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

export const CampaignDashboard = ({ campaign, activeTab }: { campaign: Campaign, activeTab: string }) => {
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

  const renderContent = () => {
      if (activeTab === 'Intelligence') {
          return (
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm min-h-[250px] flex flex-col justify-center items-center text-slate-400">
                      <BarChartIcon size={48} className="mb-4 opacity-50" />
                      <span className="font-medium">Campaign Analytics Placeholder</span>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm min-h-[250px] flex flex-col justify-center items-center text-slate-400">
                      <PieChartIcon size={48} className="mb-4 opacity-50" />
                      <span className="font-medium">Candidate Source Breakdown</span>
                  </div>
              </div>
          );
      } 
      else if (activeTab.startsWith('Source AI')) {
          const subView = activeTab.split(':')[1] || 'ATTACH';
          return <CampaignSourceAI activeView={subView} hideSidebar={false} />;
      }
      else if (activeTab === 'Match AI') {
          return <MatchWorkflow />;
      }
      else if (activeTab.startsWith('Engage AI')) {
          const subView = activeTab.split(':')[1] || 'BUILDER';
          return <EngageWorkflow activeView={subView} />;
      }
      else if (activeTab === 'Recommended Profiles') {
          return <RecommendedProfilesView />;
      }
      
      return <div className="p-8 text-center text-slate-500">Module: {activeTab}</div>;
  };

  if (!campaign) return <div className="p-8 text-center text-slate-500">No Campaign Selected</div>;

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900 transition-colors overflow-hidden">
       <CampaignHeader campaign={campaign} isScrolled={isScrolled} />
       <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          {renderContent()}
       </div>
    </div>
  );
};