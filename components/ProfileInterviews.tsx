import React from 'react';
import { Video, Phone, MapPin, Calendar, Clock, Plus } from 'lucide-react';
import { StatusBadge } from './Common';
import { CANDIDATE } from '../data';

export const InterviewCard = ({ interview, onClick }: any) => {
  const getIcon = () => {
      switch(interview.mode) {
          case 'Video': return <Video size={20} className="text-blue-500" />;
          case 'Phone': return <Phone size={20} className="text-purple-500" />;
          case 'In-Person': return <MapPin size={20} className="text-orange-500" />;
          default: return <Calendar size={20} className="text-slate-500" />;
      }
  };

  return (
     <div 
        onClick={onClick}
        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-green-300 cursor-pointer flex flex-col h-full"
     >
        <div className="p-5 flex flex-col h-full relative">
           <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  {getIcon()}
              </div>
              <StatusBadge status={interview.status} />
           </div>

           <div className="mb-4 flex-1">
              <h4 className="font-bold text-slate-800 text-lg mb-1 leading-tight group-hover:text-green-600 transition-colors">
                  {interview.name}
              </h4>
              <p className="text-xs text-slate-500 mb-2">by {interview.author}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-medium text-slate-500">
                      <Clock size={10} /> {interview.lastUpdated.split(' ')[0]}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-medium text-slate-500">
                      {interview.type}
                  </span>
              </div>
           </div>

           <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
              <span className="font-mono">ID: {interview.id}</span>
              <span>Click to view</span>
           </div>
        </div>
     </div>
  );
};

export const InterviewsView = ({ onSelectInterview }: { onSelectInterview: (i: any) => void }) => {
   return (
      <div className="space-y-6">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h3 className="font-bold text-slate-800 text-xl">Interviews</h3>
                <p className="text-sm text-slate-500">Manage screening and technical rounds.</p>
            </div>
            <div className="flex gap-2">
               <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2">
                  <Plus size={16} /> New Interview
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CANDIDATE.standaloneInterviews?.map((interview: any) => (
               <InterviewCard key={interview.id} interview={interview} onClick={() => onSelectInterview(interview)} />
            ))}
            
            <button className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-green-400 hover:text-green-600 hover:bg-green-50/50 transition-all group h-full min-h-[250px]">
                <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-white flex items-center justify-center mb-3 transition-colors">
                    <Plus size={24} />
                </div>
                <span className="font-medium text-sm">Schedule New</span>
            </button>
         </div>
      </div>
   );
};