
import React from 'react';
import { 
  FileText, ThumbsUp, ThumbsDown, AlertCircle
} from '../../../components/Icons';

export const InterviewPanel = () => (
  <div className="flex h-full bg-slate-100 dark:bg-slate-950 overflow-hidden transition-colors">
     {/* Left: Context */}
     <div className="w-1/2 bg-slate-600 dark:bg-slate-800 flex flex-col border-r border-slate-700">
        <div className="h-14 bg-slate-800 dark:bg-slate-900 flex items-center justify-between px-4 border-b border-slate-700 text-white shrink-0">
           <h3 className="font-bold text-sm flex items-center gap-2"><FileText size={16}/> Candidate Resume</h3>
           <div className="flex gap-2 text-xs text-slate-400">
              <button className="hover:text-white">Download</button>
              <span>|</span>
              <button className="hover:text-white">Pop-out</button>
           </div>
        </div>
        <div className="flex-1 bg-slate-500 dark:bg-slate-700/50 p-8 overflow-y-auto">
           <div className="bg-white shadow-2xl min-h-[800px] w-full max-w-2xl mx-auto rounded-sm p-12 relative">
              <div className="w-full h-6 bg-slate-200 mb-8"></div>
              <div className="w-2/3 h-4 bg-slate-300 mb-2"></div>
              <div className="w-1/2 h-4 bg-slate-300 mb-12"></div>
              <div className="space-y-4 mb-8">
                 <div className="w-full h-px bg-slate-200 mb-4"></div>
                 <div className="w-full h-3 bg-slate-100"></div>
                 <div className="w-full h-3 bg-slate-100"></div>
                 <div className="w-3/4 h-3 bg-slate-100"></div>
              </div>
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1">MOCK PDF</span>
           </div>
        </div>
     </div>

     {/* Right: Scorecard */}
     <div className="w-1/2 bg-white dark:bg-slate-900 flex flex-col transition-colors">
        <div className="h-14 border-b border-slate-200 dark:border-slate-700 px-6 flex items-center justify-between shrink-0 bg-white dark:bg-slate-900">
           <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100">System Design Interview</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Evaluator: You</p>
           </div>
           <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded font-medium border border-blue-200 dark:border-blue-800">In Progress</span>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
           {/* Criteria */}
           <div>
              <div className="flex justify-between mb-2">
                 <label className="font-bold text-slate-700 dark:text-slate-300 text-sm">Architecture Knowledge</label>
                 <span className="text-xs text-slate-400">Weight: High</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Ability to design scalable systems and choose correct databases.</p>
              <div className="flex gap-2">
                 {[1,2,3,4,5].map(n => (
                    <button key={n} className="flex-1 py-2 border border-slate-300 dark:border-slate-600 rounded hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-sm font-medium text-slate-600 dark:text-slate-300 focus:bg-indigo-600 dark:focus:bg-indigo-500 focus:text-white focus:border-indigo-600 dark:focus:border-indigo-500 transition-colors">{n}</button>
                 ))}
              </div>
           </div>

           <div>
              <div className="flex justify-between mb-2">
                 <label className="font-bold text-slate-700 dark:text-slate-300 text-sm">Communication</label>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Clarity of thought and ability to explain trade-offs.</p>
              <div className="flex gap-4">
                 <button className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-700 hover:text-green-700 dark:hover:text-green-400 text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 transition-colors"><ThumbsUp size={18}/> Good</button>
                 <button className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 hover:text-red-700 dark:hover:text-red-400 text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 transition-colors"><ThumbsDown size={18}/> Poor</button>
              </div>
           </div>

           <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 mb-2">
                 <AlertCircle size={16} />
                 <span className="text-xs font-bold uppercase">Feedback Required</span>
              </div>
              <textarea className="w-full bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700/50 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-slate-200 min-h-[80px] placeholder:text-slate-400 dark:placeholder:text-slate-500" placeholder="Please explain the score..."></textarea>
           </div>

           <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-4 text-sm">Final Recommendation</label>
              <div className="grid grid-cols-4 gap-3">
                 <button className="py-3 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">Strong No</button>
                 <button className="py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">No</button>
                 <button className="py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Yes</button>
                 <button className="py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-md transition-colors">Strong Yes</button>
              </div>
           </div>
        </div>
     </div>
  </div>
);
