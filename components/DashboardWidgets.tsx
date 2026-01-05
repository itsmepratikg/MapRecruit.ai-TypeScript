
import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Users, UserCheck, UserX, AlertCircle, Calendar, 
  MoreHorizontal, Download, Share2, Search, Filter, X, CheckCircle,
  Eye, Check
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar 
} from 'recharts';

// --- MOCK DATA ---

const TREND_DATA = [
  { name: 'Dec 20', profiles: 280, applies: 240 },
  { name: 'Dec 21', profiles: 480, applies: 230 },
  { name: 'Dec 22', profiles: 580, applies: 490 },
  { name: 'Dec 23', profiles: 450, applies: 380 },
  { name: 'Dec 24', profiles: 817, applies: 268 },
  { name: 'Dec 25', profiles: 180, applies: 160 },
  { name: 'Dec 26', profiles: 120, applies: 110 },
];

const SOURCE_DATA = [
  { name: 'LinkedIn', value: 35, color: '#82ca9d' },
  { name: 'ZipRecruiter', value: 25, color: '#ffc658' },
  { name: 'Indeed', value: 14, color: '#ff8042' },
  { name: 'Dice', value: 17, color: '#8884d8' },
  { name: 'Other', value: 9, color: '#a4de6c' },
];

const EMAIL_DATA = [
  { name: 'Dec 20', opened: 0, bounced: 0 },
  { name: 'Dec 21', opened: 0, bounced: 0 },
  { name: 'Dec 22', opened: 0, bounced: 0 },
  { name: 'Dec 23', opened: 0, bounced: 0 },
  { name: 'Dec 24', opened: 0, bounced: 0 },
  { name: 'Dec 25', opened: 0, bounced: 0 },
  { name: 'Dec 26', opened: 0, bounced: 0 },
];

// --- HELPER COMPONENTS ---

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
                <span className="font-bold text-slate-700 dark:text-slate-200">{entry.value}</span>
            </div>
            ))}
        </div>
      </div>
    );
  }
  return null;
};

// --- WIDGET COMPONENTS ---

export const WelcomeHeader = () => {
  const [timeData, setTimeData] = useState({ 
    greeting: 'Good Evening', 
    lastLogin: '', 
    bgGradient: 'from-indigo-900 to-indigo-800' 
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      let greeting = 'Good Evening';
      let bgGradient = 'from-indigo-900 to-indigo-800'; // Default Evening/Night
      
      if (hour >= 5 && hour < 12) {
        greeting = 'Good Morning';
        bgGradient = 'from-emerald-500 to-teal-600'; // Morning Colors
      } else if (hour >= 12 && hour < 18) {
        greeting = 'Good Afternoon';
        bgGradient = 'from-blue-600 to-yellow-500'; // Afternoon Colors
      }

      const lastLogin = now.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      setTimeData({ greeting, lastLogin, bgGradient });
    };

    updateTime();
    const timer = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`bg-gradient-to-br ${timeData.bgGradient} rounded-xl p-6 text-white flex flex-col h-full relative overflow-hidden shadow-lg border border-white/10 dark:border-slate-600 transition-colors duration-1000`}>
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
      
      <div className="z-10 flex-1">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold tracking-tight">{timeData.greeting}, Pratik</h2>
          <span className="text-[10px] text-white/80 bg-black/20 px-2 py-1 rounded border border-white/10 whitespace-nowrap">
            Last Login: {timeData.lastLogin}
          </span>
        </div>
        <p className="text-white/80 text-xs mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
          You have 0 new notifications
        </p>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-white p-0.5 shadow-lg ring-2 ring-white/20">
             <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" className="w-full h-full object-cover rounded-lg" alt="User" />
          </div>
          <div>
             <p className="font-bold text-base">Pratik</p>
             <p className="text-xs text-white/70 font-medium">Product Admin</p>
             <div className="flex items-center gap-1.5 mt-2 text-xs text-white/90 bg-white/10 px-3 py-1 rounded-full w-fit border border-white/10 backdrop-blur-sm">
               <Briefcase size={12} /> 
               <span>TRC Talent Solutions</span>
             </div>
          </div>
        </div>
      </div>
      
      {/* Stats Footer */}
      <div className="z-10 mt-auto pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
          <div className="text-left group cursor-pointer hover:bg-white/10 rounded p-2 transition-colors -ml-2">
              <span className="block text-3xl font-bold text-white group-hover:text-green-300 transition-colors">1</span>
              <span className="text-[10px] text-white/60 uppercase tracking-wider font-semibold group-hover:text-white">New Campaigns</span>
          </div>
          <div className="text-left border-l border-white/10 pl-4 group cursor-pointer hover:bg-white/10 rounded p-2 transition-colors">
              <span className="block text-3xl font-bold text-white group-hover:text-blue-300 transition-colors">0</span>
              <span className="text-[10px] text-white/60 uppercase tracking-wider font-semibold group-hover:text-white">Upcoming Interviews</span>
          </div>
      </div>
    </div>
  );
};

export const MetricCard = ({ title, value, subValue, icon: Icon, colorClass, iconBg }: any) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-all h-full">
     <div>
        <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
        <div className="text-[10px] text-gray-400 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">{title}</div>
     </div>
     <div className={`p-3 rounded-xl ${iconBg} dark:bg-opacity-20`}>
        <Icon size={24} className={colorClass} />
     </div>
  </div>
);

export const AlertsWidget = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 shadow-sm flex items-center justify-between h-full min-h-[100px]">
     <div className="flex items-center gap-6 flex-1 justify-center border-r border-gray-100 dark:border-slate-700 pr-6">
        <img src="https://cdni.iconscout.com/illustration/premium/thumb/business-failure-illustration-download-in-svg-png-gif-file-formats--bankruptcy-market-crash-pack-people-illustrations-3791244.png" className="w-16 h-16 object-contain opacity-80" alt="Alert" />
        <div className="text-center">
           <span className="block text-3xl font-bold text-red-500">0</span>
           <span className="text-xs text-gray-500 dark:text-slate-400">Campaigns have high Opt-Out percentage</span>
        </div>
     </div>
     <div className="flex items-center gap-6 flex-1 justify-center pl-6 relative">
        <div className="text-center">
           <span className="block text-3xl font-bold text-red-500">0</span>
           <span className="text-xs text-gray-500 dark:text-slate-400 block max-w-[150px] mx-auto">Have unsubscribed or not reachable in the last 24 hours</span>
        </div>
        <div className="absolute top-0 right-0 flex flex-col gap-1">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-50"></div>
           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-20"></div>
        </div>
     </div>
  </div>
);

// New Grouped Widget for GridStack Convenience
export const MetricsOverviewWidget = () => (
    <div className="flex flex-col gap-6 h-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            <MetricCard 
                title="Active Campaigns" 
                value="4" 
                icon={Briefcase} 
                colorClass="text-green-600" 
                iconBg="bg-green-50" 
            />
            <MetricCard 
                title="Closed Campaigns" 
                value="71" 
                icon={Briefcase} 
                colorClass="text-red-500" 
                iconBg="bg-red-50" 
            />
            <MetricCard 
                title="Active Profiles" 
                value="11k" 
                icon={Users} 
                colorClass="text-blue-600" 
                iconBg="bg-blue-50" 
            />
            <MetricCard 
                title="Shortlisted" 
                value="9" 
                icon={UserCheck} 
                colorClass="text-emerald-600" 
                iconBg="bg-emerald-50" 
            />
        </div>
        <div className="flex-1">
            <AlertsWidget />
        </div>
    </div>
);

export const TrendGraph = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm h-full flex flex-col">
     <div className="flex justify-between items-start mb-6">
        <div>
           <h3 className="text-gray-800 dark:text-slate-100 font-bold text-base">Profiles / Applies Trends</h3>
           <p className="text-xs text-gray-400 dark:text-slate-400">1,000</p>
        </div>
        <select className="text-xs border border-gray-200 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-600 dark:text-slate-200 outline-none">
           <option>Last 7 days</option>
        </select>
     </div>
     <div className="flex-1 flex gap-4">
        <div className="flex-1 min-h-[200px]">
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND_DATA}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                 <Tooltip content={<CustomTooltip />} />
                 <Line type="monotone" dataKey="profiles" stroke="#6366f1" strokeWidth={2} dot={{r: 3, fill: '#6366f1', strokeWidth: 0}} activeDot={{r: 6}} />
                 <Line type="monotone" dataKey="applies" stroke="#82ca9d" strokeWidth={2} dot={{r: 3, fill: '#82ca9d', strokeWidth: 0}} />
              </LineChart>
           </ResponsiveContainer>
        </div>
        <div className="w-32 flex flex-col justify-center gap-6 text-right border-l border-gray-50 dark:border-slate-700 pl-4">
           <div>
              <div className="flex items-center justify-end gap-1 text-red-500 text-xs font-bold mb-1">
                 <span>↓ 87%</span>
                 <span className="text-2xl text-gray-700 dark:text-slate-200">2,922</span>
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">New Profiles</p>
           </div>
           <div>
              <div className="flex items-center justify-end gap-1 text-red-500 text-xs font-bold mb-1">
                 <span>↓ 41%</span>
                 <span className="text-2xl text-gray-700 dark:text-slate-200">1,874</span>
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">New Applies</p>
           </div>
           <div>
              <div className="flex items-center justify-end gap-1 text-red-500 text-xs font-bold mb-1">
                 <span>↓ 100%</span>
                 <span className="text-2xl text-gray-700 dark:text-slate-200">0</span>
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">New Campaigns</p>
           </div>
        </div>
     </div>
  </div>
);

export const SourceDistributionChart = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm h-full flex flex-col">
     <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-800 dark:text-slate-100 font-bold text-base">New Profile Source Distribution</h3>
        <div className="flex gap-2">
           <select className="text-xs border border-gray-200 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-600 dark:text-slate-200 outline-none">
              <option>Last 7 days</option>
           </select>
           <div className="flex bg-gray-100 dark:bg-slate-700 rounded p-0.5">
              <button className="px-2 py-0.5 text-[10px] bg-white dark:bg-slate-600 shadow-sm rounded text-gray-700 dark:text-slate-200 font-medium">Profiles</button>
              <button className="px-2 py-0.5 text-[10px] text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300">Applies</button>
           </div>
        </div>
     </div>
     <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
           <PieChart>
              <Pie
                 data={SOURCE_DATA}
                 cx="50%"
                 cy="50%"
                 innerRadius={60}
                 outerRadius={80}
                 paddingAngle={2}
                 dataKey="value"
              >
                 {SOURCE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                 ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                 layout="vertical" 
                 verticalAlign="middle" 
                 align="right"
                 iconType="circle"
                 iconSize={8}
                 wrapperStyle={{fontSize: '11px', color: '#64748b'}}
              />
           </PieChart>
        </ResponsiveContainer>
     </div>
  </div>
);

export const EmptyWidget = ({ title, sub }: any) => (
   <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm h-full flex flex-col relative overflow-hidden group">
      <div className="flex justify-between items-center mb-6 z-10 relative">
         <h3 className="text-gray-800 dark:text-slate-100 font-bold text-sm flex items-center gap-2">
            {title}
            {title === 'Upcoming Interviews' && <span className="text-red-500 text-xs cursor-pointer">x</span>}
         </h3>
         {sub && sub}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 min-h-[150px]">
         <div className="w-16 h-16 mb-2 opacity-50">
            {title.includes('Portal') ? (
               <div className="relative">
                  <span className="text-4xl">💤</span>
               </div>
            ) : (
               <span className="text-gray-300 dark:text-slate-600 text-4xl">📭</span>
            )}
         </div>
         <p className="text-xs text-gray-400">{title.includes('Interviews') ? 'No Upcoming Interviews' : 'No Data Found'}</p>
      </div>
      {title.includes('Portal') && (
         <div className="border-t border-gray-100 dark:border-slate-700 pt-4 mt-auto flex justify-between text-[10px] text-gray-500 dark:text-slate-400 w-full z-10">
            <div className="text-center"><span className="block text-blue-600 font-bold text-lg">0</span> Searches</div>
            <div className="text-center"><span className="block text-blue-600 font-bold text-lg">0</span> Downloads</div>
            <div className="text-center"><span className="block text-blue-600 font-bold text-lg">0</span> Contacted</div>
            <div className="text-center"><span className="block text-green-600 font-bold text-lg">0</span> Interested</div>
         </div>
      )}
   </div>
);

export const EmailDeliveryReport = () => (
   <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
         <h3 className="text-gray-800 dark:text-slate-100 font-bold text-sm">Mass Email Delivery Report</h3>
         <select className="text-xs border border-gray-200 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-gray-600 dark:text-slate-200 outline-none">
            <option>Last 7 days</option>
         </select>
      </div>
      <div className="flex-1 flex gap-4 min-h-[150px]">
         <div className="w-32 flex flex-col justify-center gap-4 border-r border-gray-50 dark:border-slate-700 pr-4">
            <div className="text-center">
               <span className="block text-xl font-bold text-blue-600">0</span>
               <span className="text-[10px] text-gray-400">Total Mails</span>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-center">
               <div><span className="block font-bold text-green-600">0</span><span className="text-[9px] text-gray-400">Delivered</span></div>
               <div><span className="block font-bold text-red-500">0%</span><span className="text-[9px] text-gray-400">Bounced</span></div>
               <div><span className="block font-bold text-green-600">0</span><span className="text-[9px] text-gray-400">Viewed</span></div>
               <div><span className="block font-bold text-red-500">0%</span><span className="text-[9px] text-gray-400">Opt-out</span></div>
            </div>
            <div className="text-center">
               <span className="block font-bold text-green-600">0</span>
               <span className="text-[10px] text-gray-400">Replied</span>
            </div>
         </div>
         <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={EMAIL_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94a3b8'}} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="opened" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="bounced" fill="#ff8042" radius={[4, 4, 0, 0]} />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>
   </div>
);

export const PreScreeningProgress = () => (
   <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm h-full relative overflow-hidden">
      <div className="flex justify-between items-center mb-8">
         <h3 className="text-gray-800 dark:text-slate-100 font-bold text-sm flex items-center gap-2">
            <AlertCircle size={14} className="text-gray-400"/> Pre-Screening Progress Report
         </h3>
         <div className="flex bg-gray-100 dark:bg-slate-700 rounded p-0.5">
            <button className="px-3 py-1 text-[10px] bg-white dark:bg-slate-600 shadow-sm rounded text-gray-700 dark:text-slate-200 font-medium">Pre-Screening</button>
            <button className="px-3 py-1 text-[10px] text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300">Interview</button>
         </div>
      </div>
      
      {/* Funnel Visualization */}
      <div className="relative h-[250px] flex items-center justify-between px-10">
         {/* Node 1 */}
         <div className="relative z-10 flex flex-col items-center">
            <span className="text-lg font-bold text-blue-600">23k</span>
            <span className="text-[9px] text-blue-400 mb-1">Total Profiles</span>
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shadow-sm border-2 border-white dark:border-slate-600"><Users size={14}/></div>
         </div>

         {/* Edges */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{overflow: 'visible'}}>
            <path d="M 80 125 C 150 125, 150 50, 220 50" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 2" />
            <path d="M 80 125 C 150 125, 150 200, 220 200" fill="none" stroke="#ef4444" strokeWidth="1" />
            <path d="M 250 50 L 350 50" fill="none" stroke="#22c55e" strokeWidth="1" />
            <path d="M 250 50 C 280 50, 280 200, 350 200" fill="none" stroke="#ef4444" strokeWidth="1" />
         </svg>

         {/* Top Branch */}
         <div className="flex flex-col gap-10">
             <div className="flex gap-16">
                <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-green-600">9</span>
                    <span className="text-[8px] text-gray-400 mb-1">Comm...</span>
                    <div className="w-6 h-6 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 flex items-center justify-center border border-green-200 dark:border-green-800"><Share2 size={10}/></div>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-green-600">4</span>
                    <span className="text-[8px] text-gray-400 mb-1">Delivered</span>
                    <div className="w-6 h-6 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 flex items-center justify-center border border-green-200 dark:border-green-800"><Check size={10}/></div>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-green-600">4</span>
                    <span className="text-[8px] text-gray-400 mb-1">Viewed</span>
                    <div className="w-6 h-6 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 flex items-center justify-center border border-green-200 dark:border-green-800"><Eye size={10}/></div>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-green-600">2</span>
                    <span className="text-[8px] text-gray-400 mb-1">Completed</span>
                    <div className="w-6 h-6 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 flex items-center justify-center border border-green-200 dark:border-green-800"><CheckCircle size={10}/></div>
                </div>
             </div>
             
             {/* Bottom Branch (Dropoffs) */}
             <div className="flex gap-16 mt-10">
                <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-red-50 dark:bg-red-900/30 text-red-500 flex items-center justify-center border border-red-200 dark:border-red-800 mb-1"><AlertCircle size={10}/></div>
                    <span className="text-xs font-bold text-red-500">2,695</span>
                    <span className="text-[8px] text-gray-400">Not Reachable</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-red-50 dark:bg-red-900/30 text-red-500 flex items-center justify-center border border-red-200 dark:border-red-800 mb-1"><X size={10}/></div>
                    <span className="text-xs font-bold text-red-500">0</span>
                    <span className="text-[8px] text-gray-400">Bounced</span>
                </div>
             </div>
         </div>
      </div>
   </div>
);

export const SourcingEfficiencyWidget = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm h-full flex flex-col">
     <h3 className="text-gray-800 dark:text-slate-100 font-bold text-base mb-4">Sourcing Efficiency</h3>
     <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
           <BarChart data={[
               { name: 'LinkedIn', value: 85 },
               { name: 'Indeed', value: 65 },
               { name: 'Internal', value: 45 },
               { name: 'Referral', value: 30 },
           ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
           </BarChart>
        </ResponsiveContainer>
     </div>
  </div>
);

export const QualitySegmentationWidget = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm h-full flex flex-col">
     <h3 className="text-gray-800 dark:text-slate-100 font-bold text-base mb-4">Candidate Quality</h3>
     <div className="flex-1 min-h-[200px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
           <PieChart>
              <Pie
                 data={[
                     { name: 'High Match', value: 45, color: '#10b981' },
                     { name: 'Medium Match', value: 35, color: '#f59e0b' },
                     { name: 'Low Match', value: 20, color: '#ef4444' },
                 ]}
                 cx="50%"
                 cy="50%"
                 innerRadius={60}
                 outerRadius={80}
                 paddingAngle={2}
                 dataKey="value"
              >
                 {[
                     { name: 'High Match', value: 45, color: '#10b981' },
                     { name: 'Medium Match', value: 35, color: '#f59e0b' },
                     { name: 'Low Match', value: 20, color: '#ef4444' },
                 ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                 ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
           </PieChart>
        </ResponsiveContainer>
     </div>
  </div>
);

export const PipelineHealthWidget = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm h-full flex flex-col">
     <h3 className="text-gray-800 dark:text-slate-100 font-bold text-base mb-4">Pipeline Health</h3>
     <div className="space-y-4">
        {[
            { label: 'Sourcing', value: 100, total: 100, color: 'bg-blue-500' },
            { label: 'Screening', value: 65, total: 100, color: 'bg-indigo-500' },
            { label: 'Interview', value: 30, total: 100, color: 'bg-purple-500' },
            { label: 'Offer', value: 10, total: 100, color: 'bg-emerald-500' },
        ].map((stage, idx) => (
            <div key={idx}>
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{stage.label}</span>
                    <span className="text-slate-500 dark:text-slate-400">{stage.value}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                    <div className={`h-2 rounded-full ${stage.color}`} style={{ width: `${stage.value}%` }}></div>
                </div>
            </div>
        ))}
     </div>
  </div>
);
