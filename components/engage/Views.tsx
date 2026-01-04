
import React, { useState } from 'react';
import { 
  Search, MapPin, CheckCircle, Clock, User, FileText, Mail, ThumbsUp, ThumbsDown, AlertCircle
} from 'lucide-react';
import { MOCK_CANDIDATES_CAMPAIGN } from '../../data';

export const CandidateTracking = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(MOCK_CANDIDATES_CAMPAIGN[0]);

  const steps = [
    { label: "Announcement", status: "completed" },
    { label: "Screening (Basic)", status: "completed" },
    { label: "Tech Quiz", status: "completed" },
    { label: "Interview (System Design)", status: "active" },
    { label: "Offer", status: "locked" }
  ];

  return (
    <div className="flex h-full bg-white">
      <div className="w-80 border-r border-slate-200 bg-slate-50 flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {MOCK_CANDIDATES_CAMPAIGN.map(c => (
            <div 
              key={c.id} 
              onClick={() => setSelectedCandidate(c)}
              className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-white transition-colors group ${selectedCandidate.id === c.id ? 'bg-white border-l-4 border-l-indigo-600 shadow-sm' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${selectedCandidate.id === c.id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300'}`}>
                  {c.avatar}
                </div>
                <div className="min-w-0">
                  <h4 className={`font-bold text-sm truncate ${selectedCandidate.id === c.id ? 'text-indigo-900' : 'text-slate-700'}`}>{c.name}</h4>
                  <p className="text-xs text-slate-500 truncate">{c.role}</p>
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                 <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">{c.stage}</span>
                 <span className="text-[10px] text-slate-400">2h ago</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-white">
         <div className="p-8 pb-4 border-b border-slate-100">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedCandidate.name}</h2>
                    <p className="text-slate-500 text-sm flex items-center gap-2"><MapPin size={14}/> San Francisco, CA • {selectedCandidate.role}</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">View Profile</button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">Review & Advance</button>
                </div>
            </div>

            {/* Horizontal Stepper */}
            <div className="relative flex items-center justify-between px-4 pb-4">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-slate-100 -z-10"></div>
                {steps.map((step, i) => (
                    <div key={i} className="flex flex-col items-center bg-white px-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 transition-all ${
                            step.status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                            step.status === 'active' ? 'bg-white border-indigo-600 text-indigo-600 shadow-lg scale-110' :
                            'bg-white border-slate-200 text-slate-300'
                        }`}>
                            {step.status === 'completed' ? <CheckCircle size={16}/> : <span className="text-xs font-bold">{i + 1}</span>}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${step.status === 'active' ? 'text-indigo-600' : 'text-slate-400'}`}>{step.label}</span>
                    </div>
                ))}
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 space-y-6">
            {/* Active Action Card */}
            <div className="bg-white rounded-xl border border-indigo-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-white px-6 py-4 border-b border-indigo-50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse"></span>
                        <h3 className="font-bold text-indigo-900">Current Round: System Design Interview</h3>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-medium border border-yellow-200">Pending Feedback</span>
                </div>
                <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><User size={24}/></div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Interviewer: John Doe (Engineering Manager)</p>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Clock size={12}/> Scheduled for Today, 2:00 PM - 3:00 PM</p>
                            <div className="mt-2 flex gap-2">
                                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">Video Call</span>
                                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">Live Coding</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-slate-50">
                        <button className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm transition-colors">Launch Interview Room</button>
                        <button className="flex-1 bg-white border border-slate-200 text-slate-600 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Nudge Interviewer</button>
                    </div>
                </div>
            </div>

            {/* History */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Completed Rounds</h3>
                <div className="space-y-3">
                    <div className="bg-white rounded-lg p-4 border border-slate-200 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><FileText size={18}/></div>
                            <div>
                                <p className="font-bold text-slate-700 text-sm">Tech Quiz (React)</p>
                                <p className="text-xs text-slate-500">Score: 88/100 • Automated</p>
                            </div>
                        </div>
                        <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full border border-green-100">Passed</span>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-slate-200 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Mail size={18}/></div>
                            <div>
                                <p className="font-bold text-slate-700 text-sm">Initial Announcement</p>
                                <p className="text-xs text-slate-500">Sent on Oct 12 • Opened</p>
                            </div>
                        </div>
                        <span className="text-slate-400 text-xs hover:text-indigo-600 cursor-pointer">View Email</span>
                    </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export const InterviewRoom = () => (
  <div className="flex h-full bg-slate-100 overflow-hidden">
     {/* Left: Context */}
     <div className="w-1/2 bg-slate-600 flex flex-col border-r border-slate-700">
        <div className="h-14 bg-slate-800 flex items-center justify-between px-4 border-b border-slate-700 text-white shrink-0">
           <h3 className="font-bold text-sm flex items-center gap-2"><FileText size={16}/> Candidate Resume</h3>
           <div className="flex gap-2 text-xs text-slate-400">
              <button className="hover:text-white">Download</button>
              <span>|</span>
              <button className="hover:text-white">Pop-out</button>
           </div>
        </div>
        <div className="flex-1 bg-slate-500 p-8 overflow-y-auto">
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
     <div className="w-1/2 bg-white flex flex-col">
        <div className="h-14 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-white">
           <div>
              <h2 className="font-bold text-slate-800">System Design Interview</h2>
              <p className="text-xs text-slate-500">Evaluator: You</p>
           </div>
           <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-medium">In Progress</span>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
           {/* Criteria */}
           <div>
              <div className="flex justify-between mb-2">
                 <label className="font-bold text-slate-700 text-sm">Architecture Knowledge</label>
                 <span className="text-xs text-slate-400">Weight: High</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Ability to design scalable systems and choose correct databases.</p>
              <div className="flex gap-2">
                 {[1,2,3,4,5].map(n => (
                    <button key={n} className="flex-1 py-2 border border-slate-300 rounded hover:border-indigo-500 hover:bg-indigo-50 text-sm font-medium text-slate-600 focus:bg-indigo-600 focus:text-white focus:border-indigo-600 transition-colors">{n}</button>
                 ))}
              </div>
           </div>

           <div>
              <div className="flex justify-between mb-2">
                 <label className="font-bold text-slate-700 text-sm">Communication</label>
              </div>
              <p className="text-xs text-slate-500 mb-3">Clarity of thought and ability to explain trade-offs.</p>
              <div className="flex gap-4">
                 <button className="flex-1 py-3 border border-slate-200 rounded-lg hover:bg-green-50 hover:border-green-300 hover:text-green-700 text-slate-500 flex items-center justify-center gap-2 transition-colors"><ThumbsUp size={18}/> Good</button>
                 <button className="flex-1 py-3 border border-slate-200 rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-700 text-slate-500 flex items-center justify-center gap-2 transition-colors"><ThumbsDown size={18}/> Poor</button>
              </div>
           </div>

           <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-amber-800 mb-2">
                 <AlertCircle size={16} />
                 <span className="text-xs font-bold uppercase">Feedback Required</span>
              </div>
              <textarea className="w-full bg-white border border-amber-300 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[80px]" placeholder="Please explain the score..."></textarea>
           </div>

           <div className="pt-6 border-t border-slate-100">
              <label className="block font-bold text-slate-800 mb-4 text-sm">Final Recommendation</label>
              <div className="grid grid-cols-4 gap-3">
                 <button className="py-3 border border-red-200 bg-red-50 text-red-700 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors">Strong No</button>
                 <button className="py-3 border border-slate-200 bg-white text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">No</button>
                 <button className="py-3 border border-slate-200 bg-white text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Yes</button>
                 <button className="py-3 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md transition-colors">Strong Yes</button>
              </div>
           </div>
        </div>
     </div>
  </div>
);
