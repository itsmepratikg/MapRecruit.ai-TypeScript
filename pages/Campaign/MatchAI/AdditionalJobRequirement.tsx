
import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { TrendingUp } from '../../../components/Icons';

const SKILL_DATA = [
  { subject: 'Technical', A: 120, B: 110, fullMark: 150 },
  { subject: 'Experience', A: 98, B: 130, fullMark: 150 },
  { subject: 'Education', A: 86, B: 130, fullMark: 150 },
  { subject: 'Culture', A: 99, B: 100, fullMark: 150 },
  { subject: 'Longevity', A: 85, B: 90, fullMark: 150 },
  { subject: 'Location', A: 65, B: 85, fullMark: 150 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 shadow-xl rounded-lg outline-none min-w-[150px]">
        {label && <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 pb-2 border-b border-slate-100 dark:border-slate-700">{label}</p>}
        <div className="space-y-1.5 pt-1">
            {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.stroke || entry.fill }}></div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium capitalize">{entry.name}</span>
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200">{entry.value}</span>
            </div>
            ))}
        </div>
      </div>
    );
  }
  return null;
};

export const AdditionalJobRequirement = ({ candidateName }: { candidateName: string }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-600 dark:text-blue-400" /> Attribute Comparison
        </h3>
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SKILL_DATA}>
                    <PolarGrid stroke="#e2e8f0" strokeOpacity={0.5} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                    <Radar
                        name={candidateName}
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
                    <Tooltip content={<CustomTooltip />} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-2 text-xs">
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-indigo-500/30 border border-indigo-500"></span>
                <span className="text-slate-600 dark:text-slate-300">{candidateName}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-transparent border-2 border-dashed border-slate-400"></span>
                <span className="text-slate-600 dark:text-slate-300">Job Profile</span>
            </div>
        </div>
    </div>
);
