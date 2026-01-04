
import React from 'react';
import { 
  WelcomeHeader, MetricCard, AlertsWidget, TrendGraph, 
  SourceDistributionChart, EmailDeliveryReport, PreScreeningProgress, EmptyWidget 
} from '../components/DashboardWidgets';
import { Briefcase, Users, UserCheck, UserX, ChevronDown } from 'lucide-react';

export const Home = () => {
  return (
    <div className="p-4 lg:p-6 bg-slate-50/50 min-h-full overflow-y-auto">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Row 1: Welcome & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[280px]">
           <div className="lg:col-span-4 h-full">
              <WelcomeHeader />
           </div>
           <div className="lg:col-span-8 grid grid-rows-2 gap-6 h-full">
              {/* Metrics Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 h-full">
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
              {/* Alerts Row */}
              <div className="h-full">
                 <AlertsWidget />
              </div>
           </div>
        </div>

        {/* Row 2: Trends & Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[350px]">
           <TrendGraph />
           <SourceDistributionChart />
        </div>

        {/* Row 3: Upcoming, Email, Portal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[300px]">
           <EmptyWidget 
              title="Upcoming Interviews" 
              sub={
                 <div className="flex gap-2">
                    <select className="text-[10px] border rounded px-1"><option>Interviews</option></select>
                    <div className="flex bg-gray-100 rounded"><button className="px-2 text-[10px]">Previous</button><button className="px-2 text-[10px] bg-white shadow-sm">Upcoming</button></div>
                 </div>
              } 
           />
           <EmailDeliveryReport />
           <EmptyWidget 
              title="Portal Sourcing Reports" 
              sub={<select className="text-[10px] border rounded px-1"><option>Last 7 days</option></select>} 
           />
        </div>

        {/* Row 4: Pre-Screening Flow */}
        <div className="h-[300px]">
           <PreScreeningProgress />
        </div>

      </div>
    </div>
  );
};
