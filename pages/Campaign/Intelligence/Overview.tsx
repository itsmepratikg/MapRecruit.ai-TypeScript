
import React from 'react';
import { 
  Users, PlusCircle, MoreHorizontal, Clock, FileText, 
  BarChart as BarChartIcon, CheckCircle, Database, TrendingUp
} from '../../../components/Icons';
import { PanelMember } from '../../../types';
import { PANEL_MEMBERS } from '../../../data';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 shadow-xl rounded-lg outline-none min-w-[150px]">
        {label && <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 pb-2 border-b border-slate-100 dark:border-slate-700">{label}</p>}
        <div className="space-y-1.5 pt-1">
            {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium capitalize">{entry.name}</span>
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200">{entry.value}%</span>
            </div>
            ))}
        </div>
      </div>
    );
  }
  return null;
};

export const PanelMembersWidget = ({ members }: { members: PanelMember[] }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 h-full flex flex-col">
    <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 text-sm">
            <Users size={16} className="text-indigo-500"/> Panel Members
        </h3>
        <button className="text-slate-400 hover:text-indigo-500"><PlusCircle size={16}/></button>
    </div>
    <div className="space-y-4 overflow-y-auto flex-1 custom-scrollbar pr-2">
        {members.map(m => (
            <div key={m.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${m.color} shadow-sm shrink-0`}>
                        {m.initials}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">{m.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{m.role}</p>
                    </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 transition-opacity"><MoreHorizontal size={16}/></button>
            </div>
        ))}
    </div>
  </div>
);

export const RemindersWidget = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 h-full flex flex-col">
    <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 text-sm">
            <Clock size={16} className="text-orange-500"/> Reminders
        </h3>
        <button className="text-slate-400 hover:text-orange-500"><PlusCircle size={16}/></button>
    </div>
    <div className="space-y-4 overflow-y-auto flex-1 custom-scrollbar">
        <div className="flex gap-3 items-start group">
            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 group-hover:scale-125 transition-transform"></div>
            <div>
                <p className="text-sm text-slate-700 dark:text-slate-200 font-medium group-hover:text-red-500 transition-colors cursor-pointer">Follow up with Sarah regarding offer</p>
                <p className="text-xs text-slate-400 mt-0.5">Today, 2:00 PM</p>
            </div>
        </div>
        <div className="flex gap-3 items-start group">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0 group-hover:scale-125 transition-transform"></div>
            <div>
                <p className="text-sm text-slate-700 dark:text-slate-200 font-medium group-hover:text-blue-500 transition-colors cursor-pointer">Review new applications for Sr. Dev</p>
                <p className="text-xs text-slate-400 mt-0.5">Tomorrow, 10:00 AM</p>
            </div>
        </div>
        <div className="flex gap-3 items-start group">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0 group-hover:scale-125 transition-transform"></div>
            <div>
                <p className="text-sm text-slate-700 dark:text-slate-200 font-medium group-hover:text-blue-500 transition-colors cursor-pointer">Sync with Hiring Manager</p>
                <p className="text-xs text-slate-400 mt-0.5">Dec 30, 11:30 AM</p>
            </div>
        </div>
    </div>
  </div>
);

export const TeamNotesWidget = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 h-full flex flex-col">
    <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 text-sm">
            <FileText size={16} className="text-yellow-500"/> Team Notes
        </h3>
        <button className="text-slate-400 hover:text-yellow-500"><PlusCircle size={16}/></button>
    </div>
    <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-lg p-4 flex-1 overflow-y-auto custom-scrollbar">
        <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
            <span className="font-bold text-slate-900 dark:text-slate-100">Strategy:</span> Focus on candidates with React Native experience for the mobile initiative.
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
            <span className="font-bold text-slate-900 dark:text-slate-100">Budget:</span> Approved for senior range up to $160k.
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-slate-100">Next Steps:</span> Schedule debrief with Engineering VP by Friday.
        </p>
    </div>
  </div>
);

const SourcingEfficiencySection = () => {
  const sourceData = [
    { name: 'Job Boards', value: 40, color: '#3b82f6' },
    { name: 'Internal DB', value: 30, color: '#10b981' },
    { name: 'Referrals', value: 20, color: '#f59e0b' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
            <Clock size={18} className="text-slate-400" />
            <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase">Sourcing Efficiency</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Active vs Passive */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">Active vs. Passive Mix</h4>
                <div className="flex justify-between items-end mb-2">
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">45%</span>
                    <span className="text-xl font-bold text-purple-600 dark:text-purple-400">55%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                    <div className="h-full bg-blue-500" style={{ width: '45%' }}></div>
                    <div className="h-full bg-purple-500" style={{ width: '55%' }}></div>
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-medium uppercase">
                    <span>Inbound (Active)</span>
                    <span>Outbound (Passive)</span>
                </div>
            </div>

            {/* Source Mix Donut */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700 flex items-center justify-center lg:justify-start">
                <div className="w-24 h-24 relative mr-6 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={sourceData}
                                cx="50%"
                                cy="50%"
                                innerRadius={25}
                                outerRadius={40}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {sourceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                    {sourceData.map((item) => (
                        <div key={item.name} className="flex items-center text-xs">
                            <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                            <span className="text-slate-600 dark:text-slate-300 w-20">{item.name}</span>
                            <span className="font-bold text-slate-800 dark:text-slate-100">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* DB Utilization */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Database Utilization Rate</h4>
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">68%</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded">
                        <TrendingUp size={12} className="mr-1" /> +12%
                    </span>
                </div>
                <p className="text-xs text-slate-400">Hires rediscovered from internal DB</p>
            </div>
        </div>
    </div>
  );
};

const QualitySegmentationSection = () => {
    const data = [
        { name: 'Good (80%+)', value: 18, color: '#10b981' },
        { name: 'Okay (60-79%)', value: 42, color: '#d97706' },
        { name: 'Bad (<60%)', value: 12, color: '#ef4444' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <CheckCircle size={18} className="text-slate-400" />
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase">Quality Segmentation (Skill-Based)</h3>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barSize={40}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 12, fill: '#94a3b8' }} 
                                dy={10} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 12, fill: '#94a3b8' }} 
                            />
                            <Tooltip 
                                cursor={{ fill: 'transparent' }}
                                content={<CustomTooltip />}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 shadow-sm p-6 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4 text-indigo-600 dark:text-indigo-400">
                    <CheckCircle size={32} />
                </div>
                <span className="block text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">18</span>
                <span className="text-sm font-bold text-indigo-800 dark:text-indigo-200">Qualified Candidates</span>
                <span className="text-xs text-indigo-600/70 dark:text-indigo-300/70 mt-1">Interview Ready</span>
            </div>
        </div>
    );
};

const PipelineHealthSection = () => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
                <Database size={18} className="text-slate-400" />
                <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase">Pipeline Health & Drip Flow</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">Yield Ratio (Conversion)</h4>
                    <div className="flex w-full h-16 rounded-lg overflow-hidden font-bold text-xs text-center text-slate-700 dark:text-slate-800 shadow-sm">
                        <div className="bg-slate-200 dark:bg-slate-600 flex items-center justify-center flex-1 relative group hover:flex-[1.2] transition-all cursor-default">
                            <span>App (100%)</span>
                            <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/20 skew-x-[-12deg] translate-x-2"></div>
                        </div>
                        <div className="bg-blue-200 dark:bg-blue-400 flex items-center justify-center flex-[0.65] relative group hover:flex-[0.8] transition-all cursor-default">
                            <span>Screen (65%)</span>
                            <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/20 skew-x-[-12deg] translate-x-2"></div>
                        </div>
                        <div className="bg-indigo-200 dark:bg-indigo-400 flex items-center justify-center flex-[0.4] relative group hover:flex-[0.6] transition-all cursor-default">
                            <span>Intvw (40%)</span>
                            <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/20 skew-x-[-12deg] translate-x-2"></div>
                        </div>
                        <div className="bg-emerald-200 dark:bg-emerald-400 flex items-center justify-center flex-[0.15] hover:flex-[0.3] transition-all cursor-default">
                            <span>Offer (10%)</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                        <span className="text-sm text-slate-600 dark:text-slate-400">App Completion Rate</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">82%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Submit-to-Interview</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">1 : 1.5</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Avg Time per Stage</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">2.4 Days</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const IntelligenceOverview = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Top Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-80">
            <PanelMembersWidget members={PANEL_MEMBERS} />
            <RemindersWidget />
            <TeamNotesWidget />
        </div>

        {/* Campaign Performance Header */}
        <div className="flex items-center gap-2 pt-4">
            <BarChartIcon size={20} className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">Campaign Performance Metrics</h3>
            <select className="ml-auto text-xs border border-slate-200 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 outline-none cursor-pointer">
                <option>Last 30 Days</option>
            </select>
        </div>

        {/* Sourcing Efficiency */}
        <SourcingEfficiencySection />

        {/* Quality Segmentation */}
        <QualitySegmentationSection />

        {/* Pipeline Health */}
        <PipelineHealthSection />
    </div>
  );
};
