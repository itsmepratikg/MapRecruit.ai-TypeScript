
import React from 'react';
import { WorkflowBuilder } from './WorkflowBuilder';
import { InterviewPanel } from './InterviewPanel';
import { CandidateList } from './CandidateList';

export const EngageAIWrapper = ({ activeView = 'BUILDER' }: { activeView?: string }) => {
    if (activeView === 'ROOM') return <InterviewPanel />;
    if (activeView === 'TRACKING') return <CandidateList />;
    
    return <WorkflowBuilder />;
};
