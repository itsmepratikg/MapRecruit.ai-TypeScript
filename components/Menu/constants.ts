
import {
  User, FileText, Activity, MessageCircle, Briefcase, FolderOpen, Video, ThumbsUp, Copy,
  MessageSquare, SlidersHorizontal, Calendar, Shield, Lock, Bell, Clock, Settings,
  Building2, Search, GitBranch, ClipboardList, Tag, Database, Mail, CreditCard, Palette, Layout,
  Key, BarChart2
} from '../Icons';

// Categorized Profile Tabs
export const PROFILE_CATEGORIES = [
  {
    id: 'GENERAL',
    label: 'General',
    items: [
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'resume', label: 'Resume', icon: FileText },
      { id: 'activity', label: 'Activity', icon: Activity },
    ]
  },
  {
    id: 'MATCHING',
    label: 'Matching',
    items: [
      { id: 'recommended', label: 'Recommended', icon: ThumbsUp },
      { id: 'similar', label: 'Similar', icon: Copy },
    ]
  },
  {
    id: 'SYSTEM',
    label: 'System & Tools',
    items: [
      { id: 'chat', label: 'Chat', icon: MessageCircle },
      { id: 'campaigns', label: 'Campaigns', icon: Briefcase },
      { id: 'folders', label: 'Folders', icon: FolderOpen },
      { id: 'interviews', label: 'Interviews', icon: Video },
    ]
  }
];

// Flat list for routes/compatibility if needed
export const PROFILE_TABS = PROFILE_CATEGORIES.flatMap(cat => cat.items);

export const USER_MANAGEMENT_MENU = [
  { id: 'BASIC_DETAILS', label: 'Basic Details', icon: User },
  { id: 'COMM_PREFS', label: 'Communication', icon: MessageSquare },
  { id: 'USER_PREFS', label: 'Appearance', icon: SlidersHorizontal },
  { id: 'CALENDAR', label: 'Calendar', icon: Calendar },
  { id: 'ROLES_PERMISSIONS', label: 'Roles & Permissions', icon: Shield },
  { id: 'AUTH_SYNC', label: 'Password & Auth', icon: Lock },
  { id: 'USER_NOTIFICATIONS', label: 'Notifications', icon: Bell },
  { id: 'LAST_LOGIN', label: 'Login History', icon: Clock },
  { id: 'SETTINGS', label: 'Settings', icon: Settings },
  { id: 'ACTIVITIES', label: 'Activities', icon: Activity },
];

export const SETTINGS_CATEGORIES = [
  {
    id: 'ORGANIZATION',
    label: 'Organization',
    items: [
      { id: 'COMPANY_INFO', label: 'Company Info', icon: Building2 },
      { id: 'ROLES', label: 'Roles', icon: Shield },
      { id: 'ROLE_HIERARCHY', label: 'Role Hierarchy', icon: GitBranch },
      { id: 'USERS', label: 'Users', icon: Users },
      { id: 'CLIENTS', label: 'Clients', icon: Briefcase },
      { id: 'TEAMS', label: 'Teams', icon: Users },
    ]
  },
  {
    id: 'AI_AUTOMATION',
    label: 'AI & Automation',
    items: [
      { id: 'SOURCE_AI', label: 'Source AI', icon: Search },
      { id: 'ENGAGE_WORKFLOW', label: 'EngageAI Workflow', icon: GitBranch },
      { id: 'QUESTIONNAIRE', label: 'Questionnaire', icon: ClipboardList },
      { id: 'MRI_PREFERENCE', label: 'MRI Preference', icon: SlidersHorizontal },
    ]
  },
  {
    id: 'SYSTEM_CONFIG',
    label: 'System & Data',
    items: [
      { id: 'CUSTOM_FIELD', label: 'Custom Field', icon: FileText },
      { id: 'TAGS', label: 'Tags', icon: Tag },
      { id: 'PROFILE_SOURCES', label: 'Profile Sources', icon: Database },
      { id: 'COMMUNICATION', label: 'Communication', icon: MessageSquare },
      { id: 'COMM_TEMPLATES', label: 'Comm Templates', icon: Mail },
      { id: 'AUTHENTICATION', label: 'Authentication', icon: Lock },
      { id: 'API_CREDITS', label: 'API Credits', icon: CreditCard },
    ]
  },
  {
    id: 'APPEARANCE',
    label: 'Appearance',
    items: [
      { id: 'THEMES', label: 'Themes', icon: Palette },
      { id: 'REACHOUT_LAYOUTS', label: 'ReachOut Layouts', icon: Layout },
    ]
  }
];

export const MY_ACCOUNT_MENU = [
  { id: 'BASIC_DETAILS', label: 'Basic Details', icon: User },
  { id: 'COMM_PREFS', label: 'Communication', icon: MessageSquare },
  { id: 'USER_PREFS', label: 'Appearance', icon: SlidersHorizontal },
  { id: 'CALENDAR', label: 'Calendar', icon: Calendar },
  { id: 'ROLES_PERMISSIONS', label: 'Roles & Permissions', icon: Shield },
  { id: 'AUTH_SYNC', label: 'Password & Authentication', icon: Lock },
  { id: 'USER_NOTIFICATIONS', label: 'User Notifications', icon: Bell },
  { id: 'LAST_LOGIN', label: 'Last Login Sessions', icon: Clock },
];

export const PROFILES_CATEGORIES = [
  {
    id: 'SOURCE',
    label: 'Search & Source',
    items: [
      { id: 'SEARCH', label: 'Search Profiles', icon: Search },
      { id: 'NEW_LOCAL', label: 'New Local Profiles', icon: MapPin },
      { id: 'LOCAL', label: 'Local Profiles', icon: MapPin },
    ]
  },
  {
    id: 'APPLICATIONS',
    label: 'Applications',
    items: [
      { id: 'NEW_APPLIES', label: 'New Applies', icon: Clock },
      { id: 'OPEN_APPLIES', label: 'Open Applies', icon: FolderOpen },
      { id: 'INTERVIEW_STATUS', label: 'Interview Status', icon: Target },
    ]
  },
  {
    id: 'ORGANIZATION',
    label: 'Organization',
    items: [
      { id: 'FOLDERS', label: 'Folder Metrics', icon: BarChart2 },
      { id: 'TAGS', label: 'Tags', icon: Tag },
      { id: 'DUPLICATES', label: 'Duplicate Profiles', icon: Copy },
    ]
  },
  {
    id: 'COLLAB',
    label: 'Collaboration',
    items: [
      { id: 'SHARED', label: 'Shared Profiles', icon: Share2 },
      { id: 'FAVORITES', label: 'Favorite Profiles', icon: Heart },
    ]
  }
];

export const TALENT_CHAT_MENU = [
  { id: 'CONVERSATIONS', label: 'Conversations', icon: MessageSquare },
  { id: 'KEYWORDS', label: 'Keywords', icon: Key },
  { id: 'SCHEDULES', label: 'Schedules', icon: Calendar },
  { id: 'ANALYTICS', label: 'Analytics', icon: BarChart2 },
];

// Helper Imports for Icons used above but not directly in arrays (to satisfy TS)
import { Users, MapPin, Target, Share2, Heart } from '../Icons';

export const PROFILE_VIEW_PATH_MAP: Record<string, string> = {
  'SEARCH': 'Search',
  'FOLDERS': 'Folders',
  'TAGS': 'Tags',
  'SHARED': 'Shared',
  'FAVORITES': 'Favorites',
  'DUPLICATES': 'Duplicates',
  'LOCAL': 'Local',
  'NEW_APPLIES': 'NewApplies',
  'OPEN_APPLIES': 'OpenApplies',
  'NEW_LOCAL': 'NewLocal',
  'INTERVIEW_STATUS': 'InterviewStatus',
};

export const getProfileViewPath = (id: string) => PROFILE_VIEW_PATH_MAP[id] || id;

export const getProfileViewIdFromPath = (path: string) => {
  return Object.keys(PROFILE_VIEW_PATH_MAP).find(key => PROFILE_VIEW_PATH_MAP[key] === path) || path;
};
