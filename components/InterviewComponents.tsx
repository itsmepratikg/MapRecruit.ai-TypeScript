import React, { useState } from 'react';
import { 
  FileText, Video, Mic, Image as ImageIcon, Film, File, HelpCircle, CheckCircle, MapPin, 
  Play, X, Plus, Edit3, Copy as CopyIcon, Trash2, Eye, EyeOff, Maximize2, Minimize2
} from 'lucide-react';
import { CANDIDATE, INTERVIEW_TEMPLATES } from '../data';

export const AssessmentQuestion: React.FC<{ question: any }> = ({ question }) => {
  const renderMedia = (type: string, label: string) => {
    const iconClass = "w-10 h-10 text-slate-400 mb-2";
    let Icon = ImageIcon;
    if (type === 'video') Icon = Video;
    if (type === 'audio') Icon = Mic;
    if (type === 'gif') Icon = Film;
    if (type === 'file') Icon = File;
    
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center w-full mb-3">
        <Icon className={iconClass} />
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>
    );
  };

  const renderQuestionMedia = () => {
    if (!question.qType || question.qType === 'text') return null;
    let label = `${question.qType.charAt(0).toUpperCase() + question.qType.slice(1)} Question`;
    return renderMedia(question.qType, label);
  };

  const renderResponse = () => {
    const { responseType, answer } = question;

    if (responseType === 'text') {
      return <div className="p-3 bg-slate-50 border border-slate-200 rounded text-sm text-slate-700">{answer}</div>;
    }

    if (responseType === 'mcq-single' || responseType === 'mcq-multi') {
      const answers = Array.isArray(answer) ? answer : [answer];
      return (
        <div className="flex flex-wrap gap-2">
          {answers.map((ans: string, idx: number) => (
            <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium animate-in fade-in zoom-in duration-200">
               <CheckCircle size={14} className="text-emerald-600" />
               {ans}
            </div>
          ))}
        </div>
      );
    }

    if (responseType === 'video' || responseType === 'audio') {
      return (
        <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-emerald-600 cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
            {responseType === 'video' ? <Play size={16} className="ml-0.5" /> : <Mic size={16} />}
          </div>
          <div className="flex-1">
             <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-emerald-500"></div>
             </div>
             <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>00:12</span>
                <span>00:45</span>
             </div>
          </div>
        </div>
      );
    }

    if (responseType === 'file') {
       return (
         <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
            <div className="p-2 bg-red-50 text-red-600 rounded"><FileText size={20}/></div>
            <div>
               <p className="text-sm font-medium text-slate-800 hover:underline cursor-pointer">{answer?.name}</p>
               <p className="text-xs text-slate-400">{answer?.size}</p>
            </div>
         </div>
       );
    }

    if (responseType === 'location-single' || responseType === 'location-multi') {
       const locs = Array.isArray(answer) ? answer : [answer];
       return (
         <div className="flex flex-wrap gap-2">
           {locs.map((loc: string, i: number) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-xs font-medium">
                 <MapPin size={12}/> {loc}
              </div>
           ))}
         </div>
       );
    }

    return null;
  };

  const getBadgeIcon = (type: string) => {
     switch(type) {
        case 'video': return <Video size={12} />;
        case 'audio': return <Mic size={12} />;
        case 'image': return <ImageIcon size={12} />;
        case 'gif': return <Film size={12} />;
        case 'text': return <HelpCircle size={12} />;
        default: return <HelpCircle size={12} />;
     }
  };

  return (
    <div className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm hover:border-slate-300 transition-colors">
      <div className="bg-slate-50/50 px-4 py-2 border-b border-slate-100 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <HelpCircle size={14} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase">Question {question.id}</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-medium border border-slate-200 capitalize">
               {getBadgeIcon(question.qType)} {question.responseType.replace('-', ' ')}
            </span>
         </div>
      </div>
      <div className="p-4">
         <h4 className="font-semibold text-slate-800 text-sm mb-3">{question.q}</h4>
         {renderQuestionMedia()}
         <div className="mt-3">
            {renderResponse()}
         </div>
      </div>
    </div>
  );
};

export const TemplateSelector = ({ onSelect, onClose }: { onSelect: (t: any) => void, onClose: () => void }) => (
  <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center animate-in fade-in zoom-in duration-200 relative">
     <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-white p-1 rounded-full border border-slate-200 hover:bg-slate-50"><X size={16} /></button>
     
     <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-slate-700">Select Interview Template</h4>
        <div className="flex gap-2">
           <input type="text" placeholder="Search..." className="text-sm px-3 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:border-green-500" />
           <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1"><Plus size={14}/> Create</button>
        </div>
     </div>
     <div className="bg-white rounded border border-slate-200 overflow-hidden text-left">
        <table className="w-full text-sm">
           <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr><th className="px-4 py-2 font-medium">Title</th><th className="px-4 py-2 font-medium">Created Date</th><th className="px-4 py-2 font-medium">Created By</th><th className="px-4 py-2 font-medium">Access</th></tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
              {INTERVIEW_TEMPLATES.map(t => (
                 <tr key={t.id} className="hover:bg-blue-50/50 group transition-colors">
                    <td className="px-4 py-3">
                       <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-700">{t.title}</span>
                          <div className="hidden group-hover:flex gap-1">
                             <button onClick={() => onSelect(t)} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200" title="Select"><CheckCircle size={14}/></button>
                             <button className="p-1.5 bg-slate-100 text-slate-600 rounded hover:bg-slate-200" title="Edit"><Edit3 size={14}/></button>
                             <button className="p-1.5 bg-slate-100 text-slate-600 rounded hover:bg-slate-200" title="Copy"><CopyIcon size={14}/></button>
                             <button className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Delete"><Trash2 size={14}/></button>
                          </div>
                       </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{t.created}</td>
                    <td className="px-4 py-3 text-slate-500">{t.author}</td>
                    <td className="px-4 py-3 text-slate-500">{t.access}</td>
                 </tr>
              ))}
           </tbody>
        </table>
     </div>
  </div>
);

export const InterviewFormContent = ({ template, roundName, onClose, onMaximize, isMaximized, readOnly }: any) => {
  const [showResume, setShowResume] = useState(false);

  return (
    <div className="flex flex-col h-full bg-slate-50/50 rounded-lg overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-2">
       <div className="px-4 py-3 bg-white border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h4 className="font-bold text-slate-800">{template.title}</h4>
            {readOnly && <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">Read Only</span>}
          </div>
          <div className="flex items-center gap-2">
             {!readOnly && (
               <button 
                  onClick={() => setShowResume(!showResume)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded transition-colors ${showResume ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
               >
                  {showResume ? <Eye size={14} /> : <EyeOff size={14} />} 
                  {showResume ? 'Hide Resume' : 'Show Resume'}
               </button>
             )}
             
             {onMaximize && (
               <button 
                  onClick={() => onMaximize()}
                  className="p-2 rounded transition-colors hover:bg-slate-200 text-slate-600 bg-slate-100"
                  title={isMaximized ? "Minimize" : "Maximize Template"}
               >
                  {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
               </button>
             )}

             <div className="w-px h-4 bg-slate-300 mx-1"></div>
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded"><X size={18} /></button>
          </div>
       </div>

       <div className="flex flex-1 overflow-hidden">
          <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${showResume ? 'border-r border-slate-200' : ''}`}>
             <div className="space-y-4">
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Current Location</label>
                   {!readOnly ? (
                     <>
                      <div className="flex gap-1 mb-1">
                          <button className="px-2 py-0.5 border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50">B</button>
                          <button className="px-2 py-0.5 border border-slate-200 rounded text-xs underline text-slate-600 hover:bg-slate-50">U</button>
                      </div>
                      <textarea className="w-full p-2 border border-slate-300 rounded text-sm h-16 resize-none focus:ring-1 focus:ring-green-500 outline-none bg-white" defaultValue={CANDIDATE.location}></textarea>
                     </>
                   ) : (
                      <p className="text-sm text-slate-700 bg-white p-3 border border-slate-200 rounded">{CANDIDATE.location}</p>
                   )}
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Education Qualification</label>
                   {!readOnly ? (
                      <textarea className="w-full p-2 border border-slate-300 rounded text-sm h-16 resize-none focus:ring-1 focus:ring-green-500 outline-none bg-white" defaultValue="Bachelor of Science, Georgia Southern University"></textarea>
                   ) : (
                      <p className="text-sm text-slate-700 bg-white p-3 border border-slate-200 rounded">Bachelor of Science, Georgia Southern University</p>
                   )}
                </div>
             </div>

             {!readOnly && (
               <div className="py-4 border-t border-b border-slate-100 text-center">
                  <button className="text-slate-400 hover:text-green-600 flex flex-col items-center gap-1 mx-auto">
                     <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><Plus size={16}/></div>
                     <span className="text-xs font-medium">Add Question</span>
                  </button>
               </div>
             )}

             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Client</label>
                   <select className="w-full p-2 border border-slate-300 rounded text-sm bg-white" disabled={readOnly}><option>TRC Talent Solutions</option></select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Event Type *</label>
                   <select className="w-full p-2 border border-slate-300 rounded text-sm bg-white" disabled={readOnly}><option>Other (OTH)</option></select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Campaigns</label>
                   <select className="w-full p-2 border border-slate-300 rounded text-sm bg-white" disabled><option>Test Forklift</option></select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Interview Round Number</label>
                   <select className="w-full p-2 border border-slate-300 rounded text-sm bg-white" disabled><option>{roundName}</option></select>
                </div>
             </div>

             {!readOnly && (
               <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button onClick={onClose} className="px-4 py-2 border border-slate-300 text-slate-600 rounded text-sm font-medium hover:bg-slate-50">Cancel</button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700">Save</button>
                  <button className="px-4 py-2 bg-green-500 text-white rounded text-sm font-medium hover:bg-green-600">Complete</button>
               </div>
             )}
          </div>

          {showResume && !readOnly && (
             <div className="w-1/2 bg-slate-100 flex items-center justify-center border-l border-slate-200 relative">
                <div className="text-center">
                   <FileText size={48} className="text-slate-300 mx-auto mb-2" />
                   <p className="text-slate-500 font-medium">Resume Preview</p>
                   <p className="text-xs text-slate-400">PDF Viewer would load here</p>
                </div>
             </div>
          )}
       </div>
    </div>
  );
};