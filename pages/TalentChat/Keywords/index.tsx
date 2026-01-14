
import React, { useState } from 'react';
import { AutoPilot } from './AutoPilot';
import { CannedResponses } from './CannedResponses';

export const KeywordsWrapper = () => {
  const [activeTab, setActiveTab] = useState<'AUTOPILOT' | 'CANNED'>('AUTOPILOT');

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
      <div className="flex justify-center p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
        <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
            <button 
                onClick={() => setActiveTab('AUTOPILOT')} 
                className={`px-6 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'AUTOPILOT' ? 'bg-white dark:bg-slate-600 shadow text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
                Auto-Pilot Rules
            </button>
            <button 
                onClick={() => setActiveTab('CANNED')} 
                className={`px-6 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'CANNED' ? 'bg-white dark:bg-slate-600 shadow text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
                Pre-Curated Responses
            </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {activeTab === 'AUTOPILOT' ? <AutoPilot /> : <CannedResponses />}
      </div>
    </div>
  );
};
