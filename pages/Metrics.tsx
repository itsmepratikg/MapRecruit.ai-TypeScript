import React from 'react';
import { BarChart2 } from 'lucide-react';

export const Metrics = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8">
      <div className="bg-slate-100 p-6 rounded-full mb-4">
        <BarChart2 size={48} />
      </div>
      <h2 className="text-2xl font-bold text-slate-700 mb-2">Metrics Dashboard</h2>
      <p>Analytics and reports will be displayed here.</p>
    </div>
  );
};
