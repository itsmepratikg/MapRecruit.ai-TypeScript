import React from 'react';
import { SchemaCampaignList } from './components/SchemaCampaignList';

export const ArchivedCampaigns = ({ onNavigate, onTabChange, onCreateCampaign }: any) => {
  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto min-h-screen">
      <SchemaCampaignList
        status="Archived"
        onNavigateToCampaign={onNavigate}
        onTabChange={onTabChange}
        onCreateCampaign={onCreateCampaign}
      />
    </div>
  );
};
