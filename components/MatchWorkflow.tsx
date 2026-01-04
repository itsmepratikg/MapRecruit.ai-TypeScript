
import React, { useState } from 'react';
import { 
  CheckCircle, XCircle, AlertCircle, ChevronRight, User, 
  Briefcase, MapPin, GraduationCap, Award, Brain, 
  ArrowUpRight, MessageSquare, Download, ThumbsUp, ThumbsDown,
  Search, Filter, MoreHorizontal, Sparkles, TrendingUp, FileText,
  Mail, Phone, Linkedin, ExternalLink
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

// --- MOCK DATA ---
const MATCH_CANDIDATES = [
  { 
    id: 1, name: "Deanthony Quarterman", role: "Senior Warehouse Lead", location: "Atlanta, GA", 
    score: 98, avatar: "DQ", status: "New",
    breakdown: { skills: 95, experience: 100, education: 90, culture: 85 },
    skills: { matched: ["Forklift Certified", "OSHA Safety", "Team Leadership", "Inventory Mgmt"], missing: [] },
    aiSummary: "Exceptional match. Deanthony exceeds the experience requirements and holds all necessary certifications. Strong leadership background aligns with the senior role."
  },
  { 
    id: 2, name: "Shantrice Little", role: "Logistics Coordinator", location: "Atlanta, GA", 
    score: 92, avatar: "SL", status: "Reviewing",
    breakdown: { skills: 90, experience: 85, education: 100, culture: 90 },
    skills: { matched: ["Shipping & Receiving", "SAP", "Data Entry"], missing: ["Team Leadership"] },
    aiSummary: "Strong candidate with perfect educational background. Lacks direct team leadership experience but shows high potential for growth based on previous logistics coordination roles."
  },
  { 
    id: 3, name: "Marcus Johnson", role: "Forklift Operator", location: "Marietta, GA", 
    score: 88, avatar: "MJ", status: "Shortlisted",
    breakdown: { skills: 100, experience: 70, education: 80, culture: 80 },
    skills: { matched: ["Forklift Certified", "Heavy Lifting", "Loading/Unloading"], missing: ["Inventory Mgmt", "SAP"] },
    aiSummary: "Technical skills are a perfect match. Experience is slightly less than desired (3.5 years vs 5 years requested), but current role is identical to requirements."
  },
  { 
    id: 4, name: "Sarah Connors", role: "Operations Manager", location: "Atlanta, GA", 
    score: 85, avatar: "SC", status: "Contacted",
    breakdown: { skills: 80, experience: 100, education: 85, culture: 60 },
    skills: { matched: ["Process Improvement", "Six Sigma", "Budgeting"], missing: ["Forklift Certified"] },
    aiSummary: "Overqualified for the associate role, potentially a flight risk. However, brings extensive operational experience that could benefit process optimization."
  },
  { 
    id: 5, name: "David Chen", role: "Warehouse Associate", location: "Decatur, GA", 
    score: 78, avatar: "DC", status: "New",
    breakdown: { skills: 75, experience: 60, education: 90, culture: 85 },
    skills: { matched: ["Packing", "Labeling"], missing: ["Forklift Certified", "Inventory Mgmt"] },
    aiSummary: "Good junior candidate. Lacks key certifications (Forklift) which are mandatory for this role. Would require training investment."
  }
];

const SKILL_DATA = [
  { subject: 'Technical', A: 120, B: 110, fullMark: 150 },
  { subject: 'Experience', A: 98, B: 130, fullMark: 150 },
  { subject: 'Education', A: 86, B: 130, fullMark: 150 },
  { subject: 'Culture', A: 99, B: 100, fullMark: 150 },
  { subject: 'Longevity', A: 85, B: 90, fullMark: 150 },
  { subject: 'Location', A: 65, B: 85, fullMark: 150 },
];

const ScoreRing = ({ score, size = 60, stroke = 4, fontSize = "text-sm" }: any) => {
    const radius = (size - stroke) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;
    
    let color = "text-red-500";
    if (score >= 90) color = "text-emerald-500";
    else if (score >= 70) color = "text-yellow-500";

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90 w-full h-full">
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={stroke} fill="transparent" className="text-slate-100" />
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={stroke} fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} className={`transition-all duration-1000 ease-out ${color}`} strokeLinecap="round" />
            </svg>
            <span className={`absolute font-bold ${color} ${fontSize}`}>{score}%</span>
        </div>
    );
};

const CandidateListCard = ({ candidate, isSelected, onClick }: any) => (
    <div 
        onClick={onClick}
        className={`p-4 border-b border-slate-100 cursor-pointer transition-all hover:bg-slate-50 group ${isSelected ? 'bg-indigo-50/60 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
    >
        <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${isSelected ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-200 text-slate-500'}`}>
                    {candidate.avatar}
                </div>
                <div>
                    <h4 className={`font-bold text-sm ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>{candidate.name}</h4>
                    <p className="text-xs text-slate-500 truncate w-32">{candidate.role}</p>
                </div>
            </div>
            <ScoreRing score={candidate.score} size={40} stroke={3} fontSize="text-[10px]" />
        </div>
        <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${candidate.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {candidate.status}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <MapPin size={10} /> {candidate.location}
            </span>
        </div>
    </div>
);

const MatchAnalysisView = ({ candidate }: { candidate: typeof MATCH_CANDIDATES[0] }) => {
    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="flex gap-5">
                            <div className="w-20 h-20 rounded-xl bg-slate-200 flex items-center justify-center text-2xl font-bold text-slate-500 shadow-inner">
                                {candidate.avatar}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    {candidate.name}
                                    <a href="#" className="text-slate-400 hover:text-indigo-600"><ExternalLink size={18}/></a>
                                </h2>
                                <p className="text-slate-600 font-medium mb-2">{candidate.role} <span className="text-slate-300 mx-2">|</span> {candidate.location}</p>
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm transition-colors">
                                        <ThumbsUp size={16} /> Shortlist
                                    </button>
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                                        <MessageSquare size={16} /> Message
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <ThumbsDown size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 bg-slate-50 px-6 py-4 rounded-xl border border-slate-100">
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-emerald-600">{candidate.score}%</span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Match Score</span>
                            </div>
                            <div className="w-px h-10 bg-slate-200"></div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    <span className="text-slate-600 font-medium">Skills: {candidate.breakdown.skills}%</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    <span className="text-slate-600 font-medium">Exp: {candidate.breakdown.experience}%</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                    <span className="text-slate-600 font-medium">Edu: {candidate.breakdown.education}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Summary & Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Sparkles size={100} className="text-indigo-600" />
                            </div>
                            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <Brain size={18} className="text-indigo-600" /> Match Intelligence
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                                {candidate.aiSummary}
                            </p>
                            
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Skills Match</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {candidate.skills.matched.map(skill => (
                                            <span key={skill} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-xs font-medium flex items-center gap-1">
                                                <CheckCircle size={12} /> {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Missing / Gaps</h4>
                                    {candidate.skills.missing.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {candidate.skills.missing.map(skill => (
                                                <span key={skill} className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-100 rounded-md text-xs font-medium flex items-center gap-1">
                                                    <XCircle size={12} /> {skill}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">No significant skill gaps identified.</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Comparative Chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <TrendingUp size={18} className="text-blue-600" /> Attribute Comparison
                            </h3>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SKILL_DATA}>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                        <Radar
                                            name={candidate.name}
                                            dataKey="A"
                                            stroke="#6366f1"
                                            strokeWidth={2}
                                            fill="#6366f1"
                                            fillOpacity={0.3}
                                        />
                                        <Radar
                                            name="Job Requirement"
                                            dataKey="B"
                                            stroke="#94a3b8"
                                            strokeWidth={2}
                                            strokeDasharray="4 4"
                                            fill="transparent"
                                        />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-6 mt-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded bg-indigo-500/30 border border-indigo-500"></span>
                                    <span className="text-slate-600">{candidate.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded bg-transparent border-2 border-dashed border-slate-400"></span>
                                    <span className="text-slate-600">Job Profile</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Contact Info</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-slate-700">
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Mail size={16} /></div>
                                    <span className="truncate">michael.ross@example.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-700">
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Phone size={16} /></div>
                                    <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-700">
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Linkedin size={16} /></div>
                                    <span className="text-blue-600 hover:underline cursor-pointer">linkedin.com/in/mross</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Work History</h4>
                            <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
                                <div className="pl-6 relative">
                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white"></div>
                                    <h5 className="font-bold text-slate-800 text-sm">Senior Warehouse Lead</h5>
                                    <p className="text-xs text-slate-500 mb-1">Amazon Logistics • 2020 - Present</p>
                                    <p className="text-xs text-slate-600 line-clamp-2">Managed team of 15 associates. Implemented new inventory tracking system reducing errors by 12%.</p>
                                </div>
                                <div className="pl-6 relative">
                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white"></div>
                                    <h5 className="font-bold text-slate-800 text-sm">Forklift Operator</h5>
                                    <p className="text-xs text-slate-500 mb-1">XPO Logistics • 2018 - 2020</p>
                                </div>
                            </div>
                            <button className="w-full mt-4 text-xs font-medium text-indigo-600 hover:bg-indigo-50 py-2 rounded transition-colors">
                                View Full Resume
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const MatchWorkflow = () => {
    const [selectedCandidateId, setSelectedCandidateId] = useState<number>(1);
    const selectedCandidate = MATCH_CANDIDATES.find(c => c.id === selectedCandidateId) || MATCH_CANDIDATES[0];

    return (
        <div className="flex h-full bg-white relative overflow-hidden">
            {/* Left Sidebar List */}
            <div className="w-80 border-r border-slate-200 bg-white flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                <div className="p-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-2">Ranked Candidates</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                        <input type="text" placeholder="Filter list..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                    <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                        <span>Sort by: <b>Match Score</b></span>
                        <button className="hover:text-indigo-600"><Filter size={14}/></button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {MATCH_CANDIDATES.map(candidate => (
                        <CandidateListCard 
                            key={candidate.id} 
                            candidate={candidate} 
                            isSelected={selectedCandidateId === candidate.id}
                            onClick={() => setSelectedCandidateId(candidate.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <MatchAnalysisView candidate={selectedCandidate} />
        </div>
    );
};
