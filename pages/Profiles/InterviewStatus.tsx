
import React, { useState, useMemo } from 'react';
import { Target, Filter, Search, ChevronDown, CheckCircle, Clock, XCircle, Eye, User } from '../../components/Icons';
import { MOCK_PROFILES } from '../../data';

type RoundType = 'Assessment' | 'Interview';

const STATUS_OPTIONS: Record<RoundType, string[]> = {
    Assessment: [
        'Scheduled', 'Delivered', 'Bounced', 'Viewed', 'Opt-Out', 
        'Progressing', 'Completed', 'Knockout', 'Reviewed'
    ],
    Interview: [
        'Scheduled', 'Delivered', 'Bounced', 'Viewed', 'Opt-Out', 
        'Confirmed', 'Cancelled', 'Progressing', 'Completed', 
        'Interview Completed', 'Reviewed'
    ]
};

// Dummy status generator for mock profiles
const getRandomStatus = (type: RoundType) => {
    const options = STATUS_OPTIONS[type];
    return options[Math.floor(Math.random() * options.length)];
};

export const InterviewStatus = () => {
  const [roundType, setRoundType] = useState<RoundType>('Interview');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Enhance mock profiles with dummy interview data
  const profilesWithStatus = useMemo(() => {
      return MOCK_PROFILES.map(p => ({
          ...p,
          interviewData: {
              type: roundType,
              status: getRandomStatus(roundType),
              date: '2025-05-20'
          }
      }));
  }, [roundType]); // Re-generate when type changes for demo purposes

  const filteredData = useMemo(() => {
      return profilesWithStatus.filter(p => {
          const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesStatus = selectedStatus === 'All' || p.interviewData.status === selectedStatus;
          return matchesSearch && matchesStatus;
      });
  }, [profilesWithStatus, searchQuery, selectedStatus]);

  const getStatusColor = (status: string) => {
      if (['Completed', 'Reviewed', 'Interview Completed', 'Confirmed'].includes(status)) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      if (['Cancelled', 'Bounced', 'Opt-Out', 'Knockout'].includes(status)) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      if (['Scheduled', 'Progressing'].includes(status)) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600';
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 p-6 lg:p-8">
       <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <Target size={24} className="text-indigo-600 dark:text-indigo-400" /> 
            Interview Status
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track candidate progress through assessment and interview stages.</p>
       </div>

       <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col flex-1 overflow-hidden">
          
          {/* Controls */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
             <div className="flex gap-4 items-center w-full md:w-auto">
                {/* Round Type Switcher */}
                <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                    <button 
                        onClick={() => { setRoundType('Assessment'); setSelectedStatus('All'); }}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${roundType === 'Assessment' ? 'bg-white dark:bg-slate-600 shadow text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        Assessment
                    </button>
                    <button 
                        onClick={() => { setRoundType('Interview'); setSelectedStatus('All'); }}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${roundType === 'Interview' ? 'bg-white dark:bg-slate-600 shadow text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        Interview
                    </button>
                </div>

                {/* Status Dropdown */}
                <div className="relative">
                    <select 
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                        <option value="All">All Statuses</option>
                        {STATUS_OPTIONS[roundType].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                </div>
             </div>

             <div className="relative w-full md:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search candidate..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-slate-200"
                />
             </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto custom-scrollbar">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                   <tr>
                      <th className="px-6 py-3">Candidate</th>
                      <th className="px-6 py-3">Stage Type</th>
                      <th className="px-6 py-3">Current Status</th>
                      <th className="px-6 py-3">Last Updated</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                   {filteredData.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs font-bold">
                                  {p.avatar}
                               </div>
                               <div>
                                  <p className="font-bold text-slate-800 dark:text-slate-200">{p.name}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">{p.title}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                {roundType === 'Assessment' ? <CheckCircle size={14}/> : <User size={14}/>}
                                {roundType}
                            </span>
                         </td>
                         <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(p.interviewData.status)}`}>
                               {p.interviewData.status}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1.5">
                               <Clock size={14}/> {p.interviewData.date}
                            </div>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <button className="text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline">View Details</button>
                         </td>
                      </tr>
                   ))}
                   {filteredData.length === 0 && (
                       <tr>
                           <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                               No candidates found with status "{selectedStatus}"
                           </td>
                       </tr>
                   )}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};
