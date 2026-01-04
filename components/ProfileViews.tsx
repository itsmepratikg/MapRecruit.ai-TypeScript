import React from 'react';
import { 
  Briefcase, MapPin, CheckCircle, Clock, 
  MessageCircle, Paperclip, Send, AlertCircle, ExternalLink, ThumbsUp
} from 'lucide-react';
import { SectionCard, SecureContactCard } from './Common';
import { CANDIDATE } from '../data';

export const ProfileDetails = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
     <div className="lg:col-span-2 space-y-6">
        <SectionCard title="Professional Summary" id="summary">
           <p className="text-sm leading-relaxed text-slate-600">{CANDIDATE.summary}</p>
        </SectionCard>

        <SectionCard title="Work Experience" id="experience">
           <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-slate-100">
              {CANDIDATE.experience?.map((exp: any) => (
                 <div key={exp.id} className="relative pl-8">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white bg-green-500 shadow-sm"></div>
                    <div className="flex justify-between items-start mb-1">
                       <h4 className="font-bold text-slate-800 text-sm">{exp.role}</h4>
                       <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{exp.period}</span>
                    </div>
                    <div className="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">{exp.company} • {exp.location}</div>
                    <p className="text-sm text-slate-600 leading-relaxed">{exp.desc}</p>
                 </div>
              ))}
           </div>
        </SectionCard>

        <SectionCard title="Education" id="education">
           <div className="space-y-4">
              {CANDIDATE.education?.map((edu: any) => (
                 <div key={edu.id} className="flex items-start gap-4 p-3 rounded-lg border border-slate-100 hover:border-green-200 hover:bg-green-50/30 transition-colors">
                    <div className="p-2 bg-slate-50 rounded text-slate-400"><Briefcase size={20} /></div>
                    <div>
                       <h4 className="font-bold text-slate-800 text-sm">{edu.degree}</h4>
                       <p className="text-xs text-slate-500 font-medium">{edu.school}, {edu.year}</p>
                    </div>
                 </div>
              ))}
           </div>
        </SectionCard>
     </div>

     <div className="space-y-6">
        <SecureContactCard contact={CANDIDATE.contact} />

        <SectionCard title="Skills & Competencies">
           <div className="flex flex-wrap gap-2">
              {CANDIDATE.skills?.map((skill: string) => (
                 <span key={skill} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-600 text-xs font-medium shadow-sm hover:border-green-400 hover:text-green-700 transition-colors cursor-default">
                    {skill}
                 </span>
              ))}
           </div>
        </SectionCard>

        <SectionCard title="Key Details">
           <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                 <span className="text-slate-500">Willing to Relocate</span>
                 <span className="font-medium text-slate-800">Yes</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                 <span className="text-slate-500">Security Clearance</span>
                 <span className="font-medium text-slate-800">None</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                 <span className="text-slate-500">Work Authorization</span>
                 <span className="font-medium text-slate-800">US Citizen</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-slate-500">Notice Period</span>
                 <span className="font-medium text-slate-800">2 Weeks</span>
              </div>
           </div>
        </SectionCard>
     </div>
  </div>
);

export const ActivitiesView = () => (
  <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
     <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">Activity Log</h3>
        <button className="text-sm text-green-600 font-medium hover:underline">Download Report</button>
     </div>
     
     <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-8">
        {CANDIDATE.activities?.map((act: any) => {
           const Icon = act.icon;
           return (
              <div key={act.id} className="relative pl-8">
                 <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 ${act.id === 1 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                 
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 sm:mb-0">{act.dateGroup}</span>
                    <span className="text-xs text-slate-400 font-mono">{act.time}</span>
                 </div>

                 <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                       <div className={`p-2 rounded-lg ${act.color} shrink-0`}>
                          <Icon size={18} />
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-800 text-sm mb-0.5">{act.title}</h4>
                          <p className="text-xs text-slate-500">Action by <span className="font-medium text-slate-700">{act.author}</span></p>
                       </div>
                    </div>
                 </div>
              </div>
           );
        })}
     </div>
  </div>
);

export const TalentChatView = () => (
   <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
         <div>
            <h3 className="font-semibold text-slate-800 flex items-center gap-2"><MessageCircle size={18} className="text-emerald-600" /> Talent Chat</h3>
            <p className="text-xs text-slate-500">Secure conversation with {CANDIDATE.name}</p>
         </div>
         <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">Online</span>
      </div>
      <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30 space-y-6">
         <div className="flex justify-center"><span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Today, 9:41 AM</span></div>
         <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs">R</div>
            <div><div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 max-w-md">Hi Testy, thanks for applying. Are you available for a quick call tomorrow?</div><span className="text-[10px] text-slate-400 ml-1 mt-1 block">Recruiter • 9:42 AM</span></div>
         </div>
         <div className="flex gap-3 flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold">TM</div>
            <div><div className="bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-sm max-w-md">Hello! Yes, I am available anytime after 2 PM EST. Looking forward to it.</div><span className="text-[10px] text-slate-400 text-right mr-1 mt-1 block">Read • 9:45 AM</span></div>
         </div>
      </div>
      <div className="p-4 bg-white border-t border-slate-200">
         <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"><Paperclip size={20} /></button>
            <input type="text" placeholder="Type a message..." className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
            <button className="p-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-full shadow-sm transition-colors"><Send size={18} /></button>
         </div>
      </div>
   </div>
);

export const RecommendedView = () => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div>
            <h3 className="font-bold text-slate-800">Recommended Jobs</h3>
            <p className="text-sm text-slate-500 mt-0.5">AI-suggested requisitions based on candidate skills.</p>
        </div>
        <button className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors">
            Run Matching Engine
        </button>
    </div>
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
        <thead className="bg-white text-slate-500 font-semibold border-b border-slate-200">
            <tr>
            <th className="px-6 py-4 uppercase text-xs tracking-wider">Campaign Name</th>
            <th className="px-6 py-4 uppercase text-xs tracking-wider">Job ID</th>
            <th className="px-6 py-4 uppercase text-xs tracking-wider">Location</th>
            <th className="px-6 py-4 uppercase text-xs tracking-wider">Company</th>
            <th className="px-6 py-4 w-24"></th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
            {CANDIDATE.recommended?.map((rec: any) => (
            <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4 font-bold text-emerald-700 group-hover:underline cursor-pointer">{rec.name}</td>
                <td className="px-6 py-4 text-slate-600 font-mono text-xs bg-slate-50/0 group-hover:bg-white w-fit rounded px-2">{rec.jobID}</td>
                <td className="px-6 py-4 text-slate-600"><div className="flex items-center gap-2"><MapPin size={14} className="text-slate-400"/> {rec.location}</div></td>
                <td className="px-6 py-4 text-slate-600">{rec.company}</td>
                <td className="px-6 py-4 text-right">
                <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm">Select</button>
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
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start gap-4 mb-6">
        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
            <AlertCircle size={24} />
        </div>
        <div>
            <h4 className="font-bold text-blue-900 text-sm">Similar Candidates Found</h4>
            <p className="text-sm text-blue-700 mt-1 leading-relaxed">These candidates share similar skills, experience, or location data with the current profile.</p>
        </div>
    </div>
    <div className="grid grid-cols-1 gap-4">
        {CANDIDATE.similar?.map((profile: any) => (
        <div key={profile.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col sm:flex-row items-center justify-between group">
            <div className="flex items-center gap-5 w-full sm:w-auto">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    {profile.name.substring(0,2).toUpperCase()}
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors text-base cursor-pointer">{profile.name}</h4>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400"/> {profile.location}</span>
                        <span className="hidden sm:inline text-slate-300">|</span>
                        <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-slate-400"/> {profile.role}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                    <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Match Score</span>
                    <div className="flex items-center gap-1 justify-end">
                         <div className="h-2 w-16 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${profile.score}%`}}></div>
                         </div>
                         <span className="font-bold text-slate-800 text-lg">{profile.score}%</span>
                    </div>
                </div>
                <button className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100">
                    <ExternalLink size={20} />
                </button>
            </div>
        </div>
        ))}
    </div>
  </div>
);