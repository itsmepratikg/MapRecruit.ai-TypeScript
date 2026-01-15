import { StepType } from '@reactour/tour';

export const DASHBOARD_STEPS: StepType[] = [
    {
        selector: 'body',
        content: 'Welcome to MapRecruit! Let\'s take a quick tour to get you familiar with the platform. This guide will walk you through the key features.',
        position: 'center',
    },
    {
        selector: '[data-tour="sidebar-container"]',
        content: 'Primary Navigation: Access all main modules from here: Dashboard, Profiles, Campaigns, and more.',
        position: 'right',
    },
    {
        selector: '[data-tour="global-search-trigger"]',
        content: 'Global Search: Press Cmd+K or click here to search for candidates, campaigns, or settings instantly from anywhere.',
        position: 'bottom',
    },
    {
        selector: '[data-tour="nav-create-trigger"]',
        content: 'Quick Actions: Instantly create a new Profile, Campaign, or Folder from here.',
        position: 'right',
    },
    {
        selector: '[data-tour="nav-client-switcher"]',
        content: 'Client Switcher: Working with multiple clients? Toggle between them here.',
        position: 'right',
    },
    {
        selector: '[data-tour="nav-my-account"]',
        content: 'My Account & Notifications: Access your profile settings, view notifications, and check your activity history.',
        position: 'right',
    },
    {
        selector: '[data-tour="dashboard-widgets"]',
        content: 'Quick Insights: Your dashboard gives you a bird\'s-eye view of your recruitment pipeline.',
        position: 'top',
    },
    {
        selector: '[data-tour="widget-active-campaigns"]',
        content: 'Active Campaigns: Monitor your ongoing recruitment drives.',
        position: 'left',
    },
    {
        selector: '[data-tour="widget-upcoming-interviews"]',
        content: 'Reminders: Keep track of your upcoming interviews and tasks.',
        position: 'left',
    }
];

export const PROFILES_STEPS: StepType[] = [
    {
        selector: '[data-tour="profiles-menu"]',
        content: 'Profiles Navigation: Use this menu to access distinct profile views.',
        position: 'right',
    },
    {
        selector: '[data-tour="profiles-search-bar"]',
        content: 'Contextual Search: Use Boolean logic, keywords, or filters to find the perfect candidate.',
        position: 'bottom',
    },
    {
        selector: '[data-tour="candidate-card-first"]',
        content: 'Candidate Card: Get a quick snapshot of a candidate\'s skills and match score. Click to view full details.',
        position: 'right',
    },
    {
        selector: '[data-tour="nav-profile-new"]',
        content: 'New Profiles: View recently added local profiles.',
        position: 'right',
    },
    {
        selector: '[data-tour="nav-profile-duplicates"]',
        content: 'Duplicate Management: Review and merge duplicate candidate records.',
        position: 'right',
    },
    {
        selector: '[data-tour="nav-profile-folders"]',
        content: 'Folders: Organize candidates into folders. You can link these folders to specific campaigns.',
        position: 'right',
    },
    {
        selector: '[data-tour="nav-profile-new-applies"]',
        content: 'New Applies: Review fresh applications for your jobs.',
        position: 'right',
    },
    {
        selector: '[data-tour="nav-profile-open-applies"]',
        content: 'Open Applies: Track and manage ongoing applications.',
        position: 'right',
    },
];

export const CAMPAIGNS_STEPS: StepType[] = [
    {
        selector: '[data-tour="campaign-view-switcher"]',
        content: 'Campaign Views: Switch between Active, Closed, and Archived campaigns here to manage your lists.',
        position: 'bottom',
    },
    {
        selector: '[data-tour="campaigns-list"]',
        content: 'Campaigns List: A comprehensive view of all your campaigns.',
        position: 'left',
    },
    {
        selector: '[data-tour="campaign-filters"]',
        content: 'Filters: Filter campaigns by Favorites, Created by Me, and more.',
        position: 'bottom',
    },
    {
        selector: '[data-tour="campaign-row-first"]',
        content: 'Campaign Intelligence: Click a row to access Intelligence, Source AI, and Engage AI features.',
        position: 'top',
    },
];

export const SETTINGS_STEPS: StepType[] = [
    {
        selector: '[data-tour="nav-settings-users"]',
        content: 'User Management: Create new users, deactivate accounts, and manage roles.',
        position: 'right',
    },
    {
        selector: '[data-tour="nav-settings-clients"]',
        content: 'Client Management: Create new clients and configure client-specific settings.',
        position: 'right',
    },
    {
        selector: '[data-tour="nav-settings-company"]',
        content: 'Company Settings: Configure global organization settings.',
        position: 'right',
    }
];

export const TALENT_CHAT_STEPS: StepType[] = [
    {
        selector: '[data-tour="talent-chat-list"]',
        content: 'Conversations: All your active chats with candidates are listed here.',
        position: 'right',
    },
    {
        selector: '[data-tour="talent-chat-thread"]',
        content: 'Message Area: Send texts, emails, or schedule interviews directly from this window.',
        position: 'left',
    },
];
