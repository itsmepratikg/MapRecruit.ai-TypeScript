
import React from 'react';
import { AttachPeople } from './AttachPeople';
import { AttachedPeople } from './AttachedPeople';
import { Integrations } from './Integrations';
import { JobDescription } from './JobDescription';

export const SourceAIWrapper = ({ activeView = 'ATTACH' }: { activeView?: string }) => {
  return (
    <div className="flex h-full bg-slate-50/30 dark:bg-slate-900/30">
       <div className="flex-1 overflow-hidden relative bg-white dark:bg-slate-900 transition-colors">
          {activeView === 'ATTACH' && <AttachPeople />}
          {activeView === 'PROFILES' && <AttachedPeople />}
          {activeView === 'INTEGRATIONS' && <Integrations />}
          {activeView === 'JD' && <JobDescription />}
       </div>
    </div>
  );
};
