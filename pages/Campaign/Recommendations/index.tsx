
import React from 'react';
import { RecommendedProfiles } from './RecommendedProfiles';
import { OtherRecommendations } from './OtherRecommendations';

export const Recommendations = ({ activeView = 'PROFILES' }: { activeView?: string }) => {
  return (
    <div className="h-full bg-slate-50/50 dark:bg-slate-900/50">
       {activeView === 'PROFILES' ? <RecommendedProfiles /> : <OtherRecommendations />}
    </div>
  );
};
