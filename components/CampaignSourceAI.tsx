
import React, { useState } from 'react';
import { 
  PlusCircle, Users, Link, FileText 
} from 'lucide-react';
import { SourceAI } from './SourceAI';

// --- SUB-VIEWS PLACEHOLDERS ---

const AttachedProfilesPlaceholder = () => (
  <div className="p-8 h-full overflow-y-auto">
    <h3 className="text-xl font-bold mb-4 text-slate-800">Attached Profiles (4)</h3>
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Match Score</th>
            <th className="px-6 py-4">Date Added</th>
            <th className="px-6 py-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
           <tr className="hover:bg-slate-50">
             <td className="px-6 py-4 font-medium text-slate-800">Deanthony Quarterman</td>
             <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Active</span></td>
             <td className="px-6 py-4"><span className="text-green-600 font-bold">98%</span></td>
             <td className="px-6 py-4 text-slate-500">Dec 26, 2025</td>
             <td className="px-6 py-4"><button className="text-red-500 hover:underline text-xs">Remove</button></td>
           </tr>
           <tr className="hover:bg-slate-50">
             <td className="px-6 py-4 font-medium text-slate-800">Shantrice Little</td>
             <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Pending</span></td>
             <td className="px-6 py-4"><span className="text-green-600 font-bold">92%</span></td>
             <td className="px-6 py-4 text-slate-500">Dec 25, 2025</td>
             <td className="px-6 py-4"><button className="text-red-500 hover:underline text-xs">Remove</button></td>
           </tr>
           <tr className="hover:bg-slate-50">
             <td className="px-6 py-4 font-medium text-slate-800">Marcus Johnson</td>
             <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">Passive</span></td>
             <td className="px-6 py-4"><span className="text-emerald-600 font-bold">88%</span></td>
             <td className="px-6 py-4 text-slate-500">Dec 24, 2025</td>
             <td className="px-6 py-4"><button className="text-red-500 hover:underline text-xs">Remove</button></td>
           </tr>
           <tr className="hover:bg-slate-50">
             <td className="px-6 py-4 font-medium text-slate-800">Sarah Connors</td>
             <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Active</span></td>
             <td className="px-6 py-4"><span className="text-emerald-600 font-bold">85%</span></td>
             <td className="px-6 py-4 text-slate-500">Dec 23, 2025</td>
             <td className="px-6 py-4"><button className="text-red-500 hover:underline text-xs">Remove</button></td>
           </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const IntegrationsPlaceholder = () => (
  <div className="p-8 h-full overflow-y-auto">
     <h3 className="text-xl font-bold mb-6 text-slate-800">Source Integrations</h3>
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['LinkedIn Recruiter', 'Indeed', 'ZipRecruiter', 'Monster', 'Dice', 'CareerBuilder'].map(platform => (
          <div key={platform} className="border border-slate-200 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow bg-white">
              <div className="w-12 h-12 bg-slate-100 rounded-full mb-4 flex items-center justify-center font-bold text-slate-500 text-lg shadow-sm">
                {platform[0]}
              </div>
              <h4 className="font-bold text-slate-800 mb-1">{platform}</h4>
              <p className="text-xs text-slate-500 mb-4">Connect to source candidates directly from {platform}.</p>
              <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 text-slate-700 transition-colors w-full">Connect</button>
          </div>
        ))}
     </div>
  </div>
);

const JobDescriptionPlaceholder = () => (
  <div className="p-8 h-full overflow-y-auto max-w-5xl">
     <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">Job Description</h3>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg font-medium transition-colors">
           <FileText size={14}/> Edit JD
        </button>
     </div>
     <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm prose prose-sm text-slate-600 max-w-none">
        <h4 className="text-slate-800 font-bold text-lg mb-2">About the Role</h4>
        <p className="mb-4">We are looking for a skilled Warehouse Associate to participate in our warehouse operations and activities. Warehouse Associate responsibilities include storing materials, picking, packing and scanning orders. The goal is to increase efficiency, profitability and customer satisfaction.</p>
        
        <h4 className="text-slate-800 font-bold text-lg mb-2">Responsibilities</h4>
        <ul className="list-disc pl-5 space-y-1 mb-4">
           <li>Prepare and complete orders for delivery or pickup according to schedule (load, pack, wrap, label, ship)</li>
           <li>Receive and process warehouse stock products (pick, unload, label, store)</li>
           <li>Perform inventory controls and keep quality standards high for audits</li>
           <li>Keep a clean and safe working environment and optimize space utilization</li>
           <li>Report any discrepancies</li>
           <li>Communicate and cooperate with supervisors and coworkers</li>
           <li>Operate and maintain preventively warehouse vehicles and equipment</li>
           <li>Follow quality service standards and comply with procedures, rules and regulations</li>
        </ul>

        <h4 className="text-slate-800 font-bold text-lg mb-2">Requirements</h4>
        <ul className="list-disc pl-5 space-y-1">
           <li>Proven working experience as a warehouse worker</li>
           <li>Proficiency in inventory software, databases and systems</li>
           <li>Familiarity with modern warehousing practices and methods</li>
           <li>Good organisational and time management skills</li>
           <li>Ability to lift heavy objects</li>
           <li>Current forklift license</li>
           <li>High school degree</li>
        </ul>
     </div>
  </div>
);

interface CampaignSourceAIProps {
  hideSidebar?: boolean;
  activeView?: string;
}

export const CampaignSourceAI: React.FC<CampaignSourceAIProps> = ({ hideSidebar = false, activeView = 'ATTACH' }) => {
  const [internalView, setInternalView] = useState('ATTACH');
  
  // Use prop if hideSidebar is true (controlled mode), otherwise use internal state
  const view = hideSidebar ? activeView : internalView;
  const setView = hideSidebar ? () => {} : setInternalView;

  return (
    <div className="flex h-full bg-slate-50/30">
       {/* Sidebar - Only rendered if not hidden */}
       {!hideSidebar && (
         <div className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col gap-1 p-3 shrink-0">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-2">Sourcing Tools</div>
            <button onClick={() => setView('ATTACH')} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${view === 'ATTACH' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100' : 'text-slate-600 hover:bg-slate-100'}`}>
               <PlusCircle size={18} /> Attach People
            </button>
            <button onClick={() => setView('PROFILES')} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${view === 'PROFILES' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100' : 'text-slate-600 hover:bg-slate-100'}`}>
               <Users size={18} /> Attached Profiles
               <span className="ml-auto bg-slate-200 text-slate-600 text-xs px-1.5 py-0.5 rounded-full">4</span>
            </button>
            <button onClick={() => setView('INTEGRATIONS')} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${view === 'INTEGRATIONS' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100' : 'text-slate-600 hover:bg-slate-100'}`}>
               <Link size={18} /> Integrations
            </button>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-4">Job Details</div>
            <button onClick={() => setView('JD')} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${view === 'JD' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100' : 'text-slate-600 hover:bg-slate-100'}`}>
               <FileText size={18} /> Job Description
            </button>
         </div>
       )}

       {/* Main Content */}
       <div className="flex-1 overflow-hidden relative bg-white">
          {view === 'ATTACH' && <SourceAI />}
          {view === 'PROFILES' && <AttachedProfilesPlaceholder />}
          {view === 'INTEGRATIONS' && <IntegrationsPlaceholder />}
          {view === 'JD' && <JobDescriptionPlaceholder />}
       </div>
    </div>
  );
};
