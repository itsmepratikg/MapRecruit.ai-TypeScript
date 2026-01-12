
import React, { useState } from 'react';
import { SSO } from './SSO';
import { CalendarSync } from './Calendar';
import { ChatSync } from './Chat';
import { DriveSync } from './Drive';
import { MFA } from './MFA';
import { RefreshCw } from '../../components/Icons';

export const SynchronizationsModule = () => {
  const [activeTab, setActiveTab] = useState('SSO');

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
       <div className="flex items-center gap-4 p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0 overflow-x-auto custom-scrollbar">
          <div className="flex items-center gap-2 mr-4 text-slate-800 dark:text-slate-100 font-bold">
             <RefreshCw size={20} className="text-blue-500" />
             <span>Syncs</span>
          </div>
          <button onClick={() => setActiveTab('SSO')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'SSO' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>SSO</button>
          <button onClick={() => setActiveTab('MFA')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'MFA' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>MFA</button>
          <button onClick={() => setActiveTab('CALENDAR')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'CALENDAR' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>Calendar</button>
          <button onClick={() => setActiveTab('CHAT')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'CHAT' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>Chat</button>
          <button onClick={() => setActiveTab('DRIVE')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'DRIVE' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>Drive</button>
       </div>
       <div className="flex-1 overflow-hidden">
          {activeTab === 'SSO' && <SSO />}
          {activeTab === 'MFA' && <MFA />}
          {activeTab === 'CALENDAR' && <CalendarSync />}
          {activeTab === 'CHAT' && <ChatSync />}
          {activeTab === 'DRIVE' && <DriveSync />}
       </div>
    </div>
  );
};
