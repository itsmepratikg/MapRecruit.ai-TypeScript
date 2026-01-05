
import React, { useState } from 'react';
import { 
  ChevronLeft, Search, Filter, MapPin, Mail, Phone, Linkedin 
} from '../../../components/Icons';
import { useScreenSize } from '../../../hooks/useScreenSize';
import { MatchScore } from './MatchScore';
import { MatchSummary } from './MatchSummary';
import { AdditionalJobRequirement } from './AdditionalJobRequirement';

// Mock Data
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
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={stroke} fill="transparent" className="text-slate-100 dark:text-slate-700" />
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={stroke} fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} className={`transition-all duration-1000 ease-out ${color}`} strokeLinecap="round" />
            </svg>
            <span className={`absolute font-bold ${color} ${fontSize}`}>{score}%</span>
        </div>
    );
};

const CandidateListCard = ({ candidate, isSelected, onClick }: any) => (
    <div 
        onClick={onClick}
        className={`p-4 border-b border-slate-100 dark:border-slate-700 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800 group ${isSelected ? 'bg-indigo-50/60 dark:bg-indigo-900/20 border-l-4 border-l-indigo-600 dark:border-l-indigo-400' : 'border-l-4 border-l-transparent'}`}
    >
        <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${isSelected ? 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                    {candidate.avatar}
                </div>
                <div>
                    <h4 className={`font-bold text-sm ${isSelected ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}`}>{candidate.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate w-32">{candidate.role}</p>
                </div>
            </div>
            <ScoreRing score={candidate.score} size={40} stroke={3} fontSize="text-[10px]" />
        </div>
        <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${candidate.status === 'New' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'}`}>
                {candidate.status}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <MapPin size={10} /> {candidate.location}
            </span>
        </div>
    </div>
);

export const MatchAI = () => {
    const [selectedCandidateId, setSelectedCandidateId] = useState<number>(1);
    const [isMobileListOpen, setIsMobileListOpen] = useState(true);
    const selectedCandidate = MATCH_CANDIDATES.find(c => c.id === selectedCandidateId) || MATCH_CANDIDATES[0];
    const { isDesktop } = useScreenSize();

    const handleSelectCandidate = (id: number) => {
        setSelectedCandidateId(id);
        if (!isDesktop) setIsMobileListOpen(false);
    };

    return (
        <div className="flex h-full bg-white dark:bg-slate-900 relative overflow-hidden transition-colors">
            {/* Sidebar List */}
            <div className={`w-full lg:w-80 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] absolute lg:relative inset-0 lg:inset-auto transition-transform duration-300 ${isMobileListOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Ranked Candidates</h3>
                        <button className="lg:hidden text-slate-400" onClick={() => setIsMobileListOpen(false)}><ChevronLeft/></button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                        <input type="text" placeholder="Filter list..." className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-slate-200 dark:placeholder-slate-500" />
                    </div>
                    <div className="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
                        <span>Sort by: <b>Match Score</b></span>
                        <button className="hover:text-indigo-600 dark:hover:text-indigo-400"><Filter size={14}/></button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {MATCH_CANDIDATES.map(candidate => (
                        <CandidateListCard 
                            key={candidate.id} 
                            candidate={candidate} 
                            isSelected={selectedCandidateId === candidate.id && isDesktop}
                            onClick={() => handleSelectCandidate(candidate.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col h-full overflow-hidden ${!isMobileListOpen ? 'w-full' : 'hidden lg:flex'}`}>
                <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-4 lg:p-6 transition-colors">
                    <div className="max-w-5xl mx-auto space-y-6">
                        
                        <button onClick={() => setIsMobileListOpen(true)} className="lg:hidden flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                            <ChevronLeft size={16} /> Back to List
                        </button>

                        <MatchScore candidate={selectedCandidate} />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <MatchSummary candidate={selectedCandidate} />
                                <AdditionalJobRequirement candidateName={selectedCandidate.name} />
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 transition-colors">
                                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Contact Info</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                                            <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-400"><Mail size={16} /></div>
                                            <span className="truncate">email@example.com</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                                            <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-400"><Phone size={16} /></div>
                                            <span>+1 (555) 123-4567</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                                            <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-400"><Linkedin size={16} /></div>
                                            <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">linkedin.com/in/user</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 transition-colors">
                                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Work History</h4>
                                    <div className="relative border-l-2 border-slate-100 dark:border-slate-700 ml-3 space-y-6">
                                        <div className="pl-6 relative">
                                            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-800"></div>
                                            <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Senior Warehouse Lead</h5>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Amazon Logistics • 2020 - Present</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">Managed team of 15 associates. Implemented new inventory tracking system.</p>
                                        </div>
                                    </div>
                                    <button className="w-full mt-4 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 py-2 rounded transition-colors">
                                        View Full Resume
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
