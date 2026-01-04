import React, { useState } from 'react';
import { 
  Megaphone, Video, Phone, MapPin, Calendar, Activity, 
  ChevronUp, ChevronDown, FileEdit, Plus, Briefcase, Building2, 
  MoreHorizontal, Share2, ChevronLeft, CheckCircle, Search
} from 'lucide-react';
import { StatusBadge, StarRating } from './Common';
import { TemplateSelector, InterviewFormContent, AssessmentQuestion } from './InterviewComponents';
import { CANDIDATE } from '../data';

export const RoundCard = ({ round, isOpen, onToggle, onMaximizeTemplate }: any) => {
  const [activeTemplate, setActiveTemplate] = useState<any>(round.templateAttached ? { title: "Existing Template" } : null);
  const [showSelector, setShowSelector] = useState(false);
  const [roundRating, setRoundRating] = useState(0);

  const getRoundIcon = () => {
    switch(round.type) {
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
    switch(round.type) {
      case 'Announcement': return 'bg-purple-100 text-purple-600';
      case 'Interview': return 'bg-orange-100 text-orange-600';
      case 'Assessment': return 'bg-blue-100 text-blue-600';
      default: return 'bg-slate-100 text-slate-600';
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
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden transition-all">
       <div 
         className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors"
         onClick={onToggle}
       >
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-md ${getRoundColor()}`}>
                {getRoundIcon()}
             </div>
             <div>
                <h5 className="font-semibold text-slate-800 text-sm">{round.name}</h5>
                <div className="flex flex-col">
                   <span className="text-[10px] text-slate-500">{round.type} {round.mode ? `• ${round.mode}` : ''}</span>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
             <div className="flex items-center gap-1">
                <StatusBadge status={round.status} />
             </div>
             <button className="text-slate-400 hover:text-slate-600">
               {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
             </button>
          </div>
       </div>

       {isOpen && (
          <div className="p-4 space-y-4 bg-white animate-in slide-in-from-top-1 duration-200">
             {round.type === 'Announcement' && (
                <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center">
                   <Megaphone size={24} className="text-purple-300 mx-auto mb-2" />
                   <p className="text-sm text-slate-600 italic">"{round.description}"</p>
                   <p className="text-xs text-slate-400 mt-2">Sent on {round.date}</p>
                </div>
             )}

             {round.type === 'Interview' && !activeTemplate && !showSelector && (
                <div className="text-center py-8 bg-slate-50 rounded border border-dashed border-slate-300">
                   <FileEdit size={32} className="text-slate-300 mx-auto mb-2" />
                   <p className="text-slate-600 font-medium mb-1">No Interview Template Attached</p>
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
                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex justify-between items-start mb-3">
                         <div>
                            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Assessment Feedback</h5>
                            <p className="text-xs text-slate-400">Rate the candidate's performance in this specific round.</p>
                         </div>
                         <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200">
                            <span className="text-xs font-medium text-slate-700">Score:</span>
                            <StarRating rating={roundRating} onRate={setRoundRating} />
                         </div>
                      </div>
                      <div className="space-y-3">
                         <textarea 
                            className="w-full p-3 border border-slate-300 rounded text-sm focus:outline-none focus:border-green-500 resize-none h-24 bg-white" 
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

export const CampaignDetailView = ({ campaign, onBack, onMaximizeTemplate, isScrolled, onShowMatchScore }: any) => {
  const [expandedRoundId, setExpandedRoundId] = useState<number | null>(null);
  const [overallRating, setOverallRating] = useState(0);

  if (!campaign) return null;

  return (
    <div className="flex flex-col min-h-full bg-white shadow-sm overflow-hidden relative"> 
       {/* Sticky Header */}
       <div className={`bg-white border-b border-slate-200 z-30 transition-all duration-300 sticky top-0 ${isScrolled ? 'py-2 px-6 shadow-sm sticky top-0' : 'py-6 px-8'}`}>
         <div className="flex justify-between items-center">
             <div className="flex items-center gap-4 overflow-hidden">
                 <button onClick={onBack} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors shrink-0" title="Back to Campaigns List"><ChevronLeft size={24} /></button>
                 
                 {/* COMPACT STATE */}
                 <div className={`flex items-center gap-4 transition-all duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                     <button onClick={() => onShowMatchScore && onShowMatchScore()} className="rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold border border-red-200 shadow-sm w-8 h-8 text-xs shrink-0">0.1</button>
                     <div className="flex items-center gap-3 min-w-0">
                        <h3 className="font-bold text-green-600 truncate text-base">{campaign.name}</h3>
                        <div className="hidden sm:block font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">ID: {campaign.jobID}</div>
                        <StatusBadge status={campaign.status} />
                     </div>
                 </div>

                 {/* EXPANDED STATE */}
                 <div className={`flex items-start gap-4 transition-all duration-300 ${!isScrolled ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                     <button onClick={() => onShowMatchScore && onShowMatchScore()} className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold border border-red-200 shadow-sm hover:scale-105 transition-transform shrink-0">0.1</button>
                     <div>
                        <h3 className="font-bold text-green-600 text-xl leading-tight mb-1">{campaign.name}</h3>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                           <span className="flex items-center gap-1"><Briefcase size={12}/> {campaign.role}</span>
                           <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">ID: {campaign.jobID}</span>
                           <span className="flex items-center gap-1"><MapPin size={12}/> {campaign.location}</span>
                           <StatusBadge status={campaign.status} />
                        </div>
                     </div>
                 </div>
             </div>

             <div className="flex items-center gap-2 shrink-0">
                <button className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors" title="Share Campaign"><Share2 size={18} /></button>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors" title="More Options"><MoreHorizontal size={18} /></button>
             </div>
         </div>
       </div>

       {/* Content Area */}
       <div className="flex-1 p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2">
             <Activity size={18} className="text-slate-700" />
             <h4 className="font-bold text-slate-700">Screening Rounds</h4>
          </div>
          {(!campaign.rounds || campaign.rounds.length === 0) ? (
             <div className="bg-white border border-slate-200 rounded-lg p-8 text-center shadow-sm">
                <p className="text-slate-500 mb-1">No Screening Rounds Scheduled!</p>
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
          
          <div className="pt-8 border-t border-slate-200">
             <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={18} className="text-slate-700" />
                <h4 className="font-bold text-slate-700">Overall Feedback</h4>
             </div>
             
             <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Rate this candidate</label>
                   <div className="flex items-center gap-2">
                      <StarRating rating={overallRating} onRate={setOverallRating} />
                      <span className="text-xs text-slate-400 font-medium">{overallRating > 0 ? `${overallRating}/5` : ''}</span>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                   <div className="md:col-span-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Status</label>
                      <select className="w-full p-2 border border-slate-300 rounded text-sm bg-white focus:outline-none focus:border-green-500">
                         <option value="Pending">Pending</option>
                         <option value="Shortlisted">Shortlisted</option>
                         <option value="Rejected">Rejected</option>
                         <option value="On Hold">On Hold</option>
                      </select>
                   </div>
                   <div className="md:col-span-3">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Overall Comment</label>
                      <textarea 
                         className="w-full p-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-green-500 resize-none h-20" 
                         placeholder="Add overall feedback for this candidate..."
                      ></textarea>
                   </div>
                </div>
                
                <div className="flex justify-end pt-2">
                   <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded shadow-sm transition-colors">Save Feedback</button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export const CampaignCard = ({ camp, onPreview, expanded, onToggle, onShowMatchScore }: any) => {
  return (
    <div className="bg-white rounded-lg border border-slate-100 shadow-sm transition-all hover:shadow-md overflow-hidden">
      <div className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
        <div className="shrink-0">
            <button 
                onClick={(e) => { e.stopPropagation(); onShowMatchScore && onShowMatchScore(); }}
                className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center text-white font-bold shadow-sm text-sm hover:scale-110 transition-transform"
            >
                0
            </button>
        </div>
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
           <button onClick={() => onPreview(camp)} className="font-medium text-green-600 text-sm truncate hover:underline text-left">{camp.name}</button>
           <div className="hidden md:block font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded w-fit">ID: {camp.jobID}</div>
           <div className="text-xs text-slate-500">Linked: {camp.date}</div>
           <div><StatusBadge status={camp.status} /></div>
        </div>
        <button onClick={onToggle} className="text-slate-400 hover:text-green-600 transition-colors p-2">{expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</button>
      </div>
      {expanded && (
        <div className="px-4 pb-4 pt-0 bg-slate-50/50 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 text-sm">
              <div><p className="text-xs font-semibold text-slate-400 uppercase mb-1">Role / Position</p><div className="flex items-center gap-2 text-slate-700"><Briefcase size={14} className="text-slate-400" />{camp.role}</div></div>
              <div><p className="text-xs font-semibold text-slate-400 uppercase mb-1">Company</p><div className="flex items-center gap-2 text-slate-700"><Building2 size={14} className="text-slate-400" />{camp.company}</div></div>
              <div><p className="text-xs font-semibold text-slate-400 uppercase mb-1">Location</p><div className="flex items-center gap-2 text-slate-700"><MapPin size={14} className="text-slate-400" /><span className="truncate" title={camp.location}>{camp.location}</span></div></div>
              <div><p className="text-xs font-semibold text-slate-400 uppercase mb-1">Status Check</p><div className="flex justify-between items-center text-xs"><span className="text-slate-500">Applied: <b className="text-slate-800">{camp.applied}</b></span><span className="text-slate-500">Feedback: <b className="text-slate-800">{camp.feedback}</b></span></div></div>
           </div>
           <div className="mt-4 flex justify-end gap-2 pt-3 border-t border-slate-200/50">
              <button className="text-xs font-medium text-slate-500 hover:text-slate-800 px-3 py-1.5 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all">View Job Details</button>
              <button className="text-xs font-medium text-red-600 hover:bg-red-50 px-3 py-1.5 rounded transition-colors">Unlink Campaign</button>
           </div>
        </div>
      )}
    </div>
  );
};

export const CampaignsView = ({ onPreviewCampaign, onShowMatchScore }: any) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-green-600 text-lg">Linked Campaigns</h3>
          <div className="flex gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search..." className="pl-9 pr-4 py-1.5 text-sm bg-white border border-slate-200 rounded-full w-64 focus:outline-none focus:border-green-500" />
              </div>
          </div>
       </div>
       <div className="space-y-2">
          {CANDIDATE.campaigns?.map((camp: any) => (
             <CampaignCard 
               key={camp.id} 
               camp={camp} 
               onPreview={onPreviewCampaign}
               onShowMatchScore={onShowMatchScore}
               expanded={expandedId === camp.id}
               onToggle={() => setExpandedId(expandedId === camp.id ? null : camp.id)}
             />
          ))}
       </div>
       <div className="text-xs text-slate-400 mt-2">Total Rows: {CANDIDATE.campaigns?.length}</div>
    </div>
  );
};