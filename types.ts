
import React from 'react';

export type ViewMode = 'SEARCH' | 'FOLDERS' | 'TAGS' | 'SHARED' | 'FAVORITES' | 'DUPLICATES' | 'LOCAL' | 'CANDIDATE' | 'NEW_APPLIES' | 'OPEN_APPLIES' | 'NEW_LOCAL' | 'INTERVIEW_STATUS';

// --- ACCESS CONTROL TYPES ---
export type AccessLevel = 'PRIVATE' | 'CLIENT' | 'COMPANY'; // User, Client, Company
export type PermissionType = 'VIEW' | 'EDIT';

export interface ShareRule {
  entityId: string; // User ID
  entityName: string;
  entityType: 'USER'; // Can be expanded to 'TEAM' later
  avatar?: string;
  role?: string;
  permission: PermissionType;
}

export interface AccessSettings {
  level: AccessLevel;
  clientId?: string; // If level is CLIENT
  ownerId: string; // The creator (always has Edit access)
  sharedWith: ShareRule[];
}
// ---------------------------

export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  location: string;
  desc: string;
}

export interface Education {
  id: number;
  degree: string;
  school: string;
  year: string;
}

export interface ActivityLog {
  id: number;
  type: string;
  title: string;
  author: string;
  time: string;
  dateGroup: string;
  icon: React.FC<any>;
  color: string;
  description?: string;
}

export interface QuestionOption {
  text: string;
  responses: number;
}

export interface Question {
  id: number;
  questionText: string;
  questionType: string;
  responseType: string;
  options: QuestionOption[];
  responses: number | null;
  q?: string; // Legacy support if needed
  answer?: string | string[] | { name: string; size: string }; // Legacy support
  qType?: string; // Legacy
}

export interface Round {
  id: number;
  name: string;
  type: string;
  status: string;
  date?: string;
  description?: string;
  turnaround?: string;
  questions?: any[];
  mode?: string;
  templateAttached?: boolean;
}

export interface UserAvatar {
  initials: string;
  color: string; // Tailwind class like 'bg-red-200 text-red-800'
  name: string;
}

export interface PanelMember {
  id: number;
  name: string;
  role: string; // e.g., "QA Team Admin (Product Admin)"
  subRole?: string; // e.g., "Owner", "Recruiter"
  initials: string;
  color: string;
}

export interface CampaignActivity {
  id: number;
  date: string; // e.g., "Friday, 26 December 2025"
  items: {
    id: number;
    title: string; // e.g., "Vishnu Priya Linked to campaign..."
    subtitle: string; // e.g., "Profile Linked"
    author: string;
    time: string;
    type: 'link' | 'upload' | 'other'; // determines icon
  }[];
}

export interface Campaign {
  id: number;
  name: string;
  role: string;
  jobID: string;
  company?: string;
  location?: string;
  applied?: string;
  feedback?: string;
  status: 'Active' | 'Closed' | 'Archived';
  date: string; // Created Date
  updatedDate: string;
  daysLeft: number;
  candidates: number; // Applied/Active candidates
  profilesCount: number; // Total profiles associated
  owner: UserAvatar;
  members: UserAvatar[];
  isNew?: boolean;
  isFavorite?: boolean;
  rounds: Round[];
  type?: string; // e.g. Direct Hire
  daysOpen?: number;
  // Access Control Integration
  access?: AccessSettings;
}

export interface Tag {
  id: number;
  name: string;
  description?: string;
  profilesCount: number;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  access: AccessSettings;
}

export interface RecommendedJob {
  id: number;
  name: string;
  jobID: string;
  location: string;
  company: string;
}

export interface SimilarProfile {
  id: number;
  name: string;
  location: string;
  role: string;
  score: number;
}

export interface Interview {
  id: number;
  name: string;
  author: string;
  lastUpdated: string;
  status: string;
  type: string;
  mode: string;
  templateAttached: boolean;
  questions?: any[];
}

export interface Candidate {
  id: string | number;
  name: string;
  role: string;
  type?: string;
  status: string;
  availability?: string;
  channel?: string;
  location?: string;
  tags?: string[];
  contact?: {
    email: string;
    phone: string;
    altPhone: string;
  };
  summary?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  activities?: ActivityLog[];
  standaloneInterviews?: Interview[];
  campaigns?: Campaign[];
  recommended?: RecommendedJob[];
  similar?: SimilarProfile[];
  avatar?: string;
  matchScore?: number;
  stage?: string; // For campaign view
}

export interface SearchState {
  view: 'initial' | 'results';
  inputValue: string;
  activeFilters: string[];
  searchKeywords: string[];
  advancedParams: any;
  chatMessages: any[];
}

export interface EngageNode {
  id: string;
  type: string;
  title: string;
  x: number;
  y: number;
  data: {
    desc: string;
    meetType?: string[]; // e.g. ['Video'], ['In-Person', 'Phone']
    stats?: {
      scheduled?: number;
      viewed?: number;
      responded?: number;
      booked?: number;
    };
    config?: any;
    label?: string;
  };
}

export interface EngageEdge {
  from: string;
  to: string;
  label?: string;
  start?: { x: number, y: number };
  end?: { x: number, y: number };
}

export interface ClientData {
  _id: string;
  clientName: string;
  clientNameAlias?: string;
  clientCode: string;
  clientType: string;
  country: string;
  status: string;
  companyID?: string;
  clientURL?: string;
  clientLogo?: string;
  language?: string;
  countryCode?: string;
  enable?: boolean;
  description?: string;
  settings?: any;
  locations?: any[];
  ClientUsersList?: any[];
  createdAt?: string;
  updatedAt?: string;
}
