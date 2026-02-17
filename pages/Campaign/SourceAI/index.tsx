
import React from 'react';
import { AttachPeople } from './AttachPeople';
import { AttachedPeople } from './AttachedPeople';
import { Integrations } from './Integrations';
import { JobDescription } from './JobDescription';

export const SourceAIWrapper = ({ activeView = 'ATTACH', campaign }: { activeView?: string, campaign?: any }) => {
  return (
    <div className="flex h-full bg-slate-50/30 dark:bg-slate-900/30">
      <div className="flex-1 overflow-hidden relative bg-white dark:bg-slate-900 transition-colors">
        {activeView === 'ATTACH' && <AttachPeople />}
        {activeView === 'PROFILES' && <AttachedPeople campaign={campaign} />}
        {activeView === 'INTEGRATIONS' && <Integrations />}
        {activeView === 'JD' && <JobDescription />}
        {activeView === 'TEMPLATES' && <div className="p-10 text-center text-slate-500">Email Templates Placeholder</div>}
        {activeView === 'ANALYTICS' && <div className="p-10 text-center text-slate-500">Analytics Placeholder</div>}
      </div>
    </div>
  );
};
