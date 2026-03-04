
import React, { useState, useEffect } from 'react';
import { ActiveCampaigns } from './ActiveCampaigns';
import { ClosedCampaigns } from './ClosedCampaigns';
import { ArchivedCampaigns } from './ArchivedCampaigns';
import { CampaignStats } from './components/CampaignStats';
import { campaignService } from '../../services/api';
export const Campaigns = ({ onNavigateToCampaign, initialTab, onCreateCampaign }: any) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'Active');

  useEffect(() => {
    if (initialTab && ['Active', 'Closed', 'Archived'].includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 dark:bg-slate-900 transition-colors custom-scrollbar">
      {activeTab === 'Active' && (
        <ActiveCampaigns
          onNavigate={onNavigateToCampaign}
          onTabChange={setActiveTab}
          onCreateCampaign={onCreateCampaign}
        />
      )}
      {activeTab === 'Closed' && (
        <ClosedCampaigns
          onNavigate={onNavigateToCampaign}
          onTabChange={setActiveTab}
          onCreateCampaign={onCreateCampaign}
        />
      )}
      {activeTab === 'Archived' && (
        <ArchivedCampaigns
          onNavigate={onNavigateToCampaign}
          onTabChange={setActiveTab}
          onCreateCampaign={onCreateCampaign}
        />
      )}
    </div>
  );
};
