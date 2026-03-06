
import {
  Building2, Shield, User, Briefcase, Palette, FileText, Tag,
  MessageSquare, Lock, Search, CreditCard, Mail, GitBranch,
  ClipboardList, Database, SlidersHorizontal
} from '../../components/Icons';

export const SETTINGS_CONTENT: Record<string, { title: string, desc: string, icon: any }> = {
  COMPANY_INFO: { title: "Company Information", desc: "Manage your company profile, logos, address details, and regional settings.", icon: Building2 },
  ROLES: { title: "Roles & Permissions", desc: "Configure access levels, define user roles, and manage permissions for your team members.", icon: Shield },
  USERS: { title: "User Management", desc: "Add, remove, or update user accounts and assign roles to your team members.", icon: User },
  FRANCHISE: { title: "Franchise Management", desc: "Organize clients into franchises for centralized management and reporting.", icon: GitBranch },
  CLIENTS: { title: "Client Management", desc: "Manage client profiles, billing details, and specific configurations for different accounts.", icon: Briefcase },
  THEMES: { title: "Theme Customization", desc: "Customize the look and feel of the application to match your brand identity.", icon: Palette },
  CUSTOM_FIELD: { title: "Custom Fields", desc: "Define custom data fields for candidates, jobs, and applications to track specific metrics.", icon: FileText },
  PROFILE_TAGS: { title: "Profile Tags", desc: "Create and manage tags for categorizing candidate profiles at the company level.", icon: Tag },
  APP_TAGS: { title: "Application Tags", desc: "Manage tags specifically for job application stages and tracking.", icon: Tag },
  TEAMS: { title: "Team Structure", desc: "Organize users into teams and departments for better collaboration and reporting.", icon: User },
  COMMUNICATION: { title: "Communication Settings", desc: "Configure email servers, SMS gateways, and default communication preferences.", icon: MessageSquare },
  AUTHENTICATION: { title: "Authentication & Security", desc: "Manage SSO, 2FA, password policies, and other security settings.", icon: Lock },
  SOURCE_AI: { title: "Source AI Configuration", desc: "Tune your sourcing algorithms, manage job board integrations, and search parameters.", icon: Search },
  API_CREDITS: { title: "API Usage & Credits", desc: "Monitor your API consumption, purchase credits, and view usage history.", icon: CreditCard },
  COMM_TEMPLATES: { title: "Communication Templates", desc: "Create and edit email and SMS templates for automated and manual outreach.", icon: Mail },
  ENGAGE_WORKFLOW: { title: "EngageAI Workflows", desc: "Design and manage automated engagement workflows and candidate journeys.", icon: GitBranch },
  QUESTIONNAIRE: { title: "Questionnaire Builder", desc: "Create screening questionnaires and assessment forms for candidates.", icon: ClipboardList },
  PROFILE_SOURCES: { title: "Profile Sources", desc: "Manage external profile sources and configure data import settings.", icon: Database },
  MRI_PREFERENCE: { title: "MRI Preferences", desc: "Configure MapRecruit Intelligence preferences and scoring weights.", icon: SlidersHorizontal },
  WORKSPACE_CONFIG: { title: "Workspace Configuration", desc: "Manage integration architecture (Single vs Multi-tenant) and test API permissions.", icon: Shield },
};
