
import React, { useState } from 'react';
import { IntelligenceOverview } from './Overview';
import { ActivityLog } from './ActivityLog';

export const Intelligence = () => {
  const [view, setView] = useState<'OVERVIEW' | 'ACTIVITY'>('OVERVIEW');

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex gap-6 border-b border-slate-200 dark:border-slate-700 mb-6 shrink-0">
          <button 
            onClick={() => setView('OVERVIEW')}
            className={`pb-3 text-sm font-bold transition-colors border-b-2 ${view === 'OVERVIEW' ? 'border-green-600 text-green-700 dark:text-green-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
              Overview
          </button>
          <button 
            onClick={() => setView('ACTIVITY')}
            className={`pb-3 text-sm font-bold transition-colors border-b-2 ${view === 'ACTIVITY' ? 'border-green-600 text-green-700 dark:text-green-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
              Activity Log
          </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {view === 'OVERVIEW' ? <IntelligenceOverview /> : <ActivityLog />}
      </div>
    </div>
  );
};
