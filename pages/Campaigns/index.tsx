
import React, { useState, useEffect } from 'react';
import { ActiveCampaigns } from './ActiveCampaigns';
import { ClosedCampaigns } from './ClosedCampaigns';
import { ArchivedCampaigns } from './ArchivedCampaigns';
import { CampaignStats } from './components/CampaignStats';
import { campaignService } from '../../services/api';
import { CampaignCreationModal } from '../../components/Campaign/CampaignCreationModal';

export const Campaigns = ({ onNavigateToCampaign, initialTab }: any) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'Active');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
          onCreateCampaign={() => setIsCreateModalOpen(true)}
        />
      )}
      {activeTab === 'Closed' && <ClosedCampaigns onNavigate={onNavigateToCampaign} onTabChange={setActiveTab} />}
      {activeTab === 'Archived' && <ArchivedCampaigns onNavigate={onNavigateToCampaign} onTabChange={setActiveTab} />}

      <CampaignCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
