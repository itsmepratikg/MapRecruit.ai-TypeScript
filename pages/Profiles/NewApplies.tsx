import React, { useState } from 'react';
import { Clock, Sparkles } from '../../components/Icons';
import { TalentAssistantSidePanel } from './components/TalentAssistantSidePanel';
import { SchemaProfileList } from './components/SchemaProfileList';

export const NewApplies = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Clock size={20} className="text-emerald-500" />
            New Applies
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${isChatOpen ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-200 dark:hover:bg-slate-600'}`}
            >
              <Sparkles size={16} />
              <span className="hidden sm:inline">Assistant</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="h-full">
            <SchemaProfileList
              filterType="NewApplies"
              onNavigateToProfile={(profile: any) => console.log('Navigate to profile:', profile._id)}
            />
          </div>
        </div>
      </div>

      {/* Talent Assistant Sidebar */}
      <TalentAssistantSidePanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialMessage="I'm showing you candidates who applied in the last 7 days. How can I help you filter them further?"
      />
    </div>
  );
};
