
import { 
  FileText, Settings, Link, Mail, Video, MessageSquare, HelpCircle, Megaphone, GitBranch, ListChecks, CheckCircle2, Pilcrow, MoveRight, Film, MapPin, Map, MinusCircle, Briefcase, Users, UserCheck
} from './components/Icons';
import { Candidate, EngageNode, EngageEdge, Question, Campaign, PanelMember, CampaignActivity, Tag } from './types';

// --- NEW USER ACCOUNT JSON STRUCTURE ---
export const DEFAULT_USER_ACCOUNT = {
  id: "usr_123",
  name: "Pratik",
  preferences: {
    theme: "system", // 'light', 'dark', or 'system'
    language: "English (US)",
    dashboardConfig: {
      rowHeight: 30,
      margin: 15,
      layouts: {
        desktop: [
  {
    "id": "welcome",
    "x": 0,
    "y": 0,
    "w": 4,
    "h": 10,
    "visible": true
  },
  {
    "id": "active_campaigns",
    "x": 4,
    "y": 0,
    "w": 2,
    "h": 4,
    "visible": true
  },
  {
    "id": "closed_campaigns",
    "x": 6,
    "y": 0,
    "w": 2,
    "h": 4,
    "visible": true
  },
  {
    "id": "active_profiles",
    "x": 8,
    "y": 0,
    "w": 2,
    "h": 4,
    "visible": true
  },
  {
    "id": "shortlisted",
    "x": 10,
    "y": 0,
    "w": 2,
    "h": 4,
    "visible": true
  },
  {
    "id": "alerts",
    "x": 4,
    "y": 5,
    "w": 8,
    "h": 5,
    "visible": true
  },
  {
    "id": "trend_graph",
    "x": 0,
    "y": 11,
    "w": 6,
    "h": 12,
    "visible": true
  },
  {
    "id": "source_distribution",
    "x": 6,
    "y": 11,
    "w": 6,
    "h": 12,
    "visible": true
  },
  {
    "id": "upcoming_interviews",
    "x": 0,
    "y": 24,
    "w": 6,
    "h": 10,
    "visible": true
  },
  {
    "id": "email_delivery",
    "x": 6,
    "y": 24,
    "w": 6,
    "h": 10,
    "visible": true
  },
  {
    "id": "portal_reports",
    "x": 6,
    "y": 35,
    "w": 6,
    "h": 10,
    "visible": true
  },
  {
    "id": "pre_screening",
    "x": 0,
    "y": 35,
    "w": 6,
    "h": 10,
    "visible": true
  }
],
        tablet: [
          { id: "welcome", x: 0, y: 0, w: 12, h: 6, visible: true },
          { id: "active_campaigns", x: 0, y: 6, w: 6, h: 4, visible: true },
          { id: "closed_campaigns", x: 6, y: 6, w: 6, h: 4, visible: true },
          { id: "active_profiles", x: 0, y: 10, w: 6, h: 4, visible: true },
          { id: "shortlisted", x: 6, y: 10, w: 6, h: 4, visible: true },
          { id: "alerts", x: 0, y: 14, w: 12, h: 4, visible: true },
          { id: "trend_graph", x: 0, y: 18, w: 12, h: 12, visible: true },
          { id: "source_distribution", x: 0, y: 30, w: 12, h: 12, visible: true },
          { id: "upcoming_interviews", x: 0, y: 42, w: 6, h: 8, visible: true },
          { id: "email_delivery", x: 6, y: 42, w: 6, h: 8, visible: true },
          { id: "portal_reports", x: 0, y: 50, w: 6, h: 8, visible: true },
          { id: "pre_screening", x: 0, y: 58, w: 12, h: 8, visible: true }
        ],
        mobile: [
          { id: "welcome", x: 0, y: 0, w: 12, h: 8, visible: true },
          { id: "active_campaigns", x: 0, y: 8, w: 12, h: 4, visible: true },
          { id: "closed_campaigns", x: 0, y: 12, w: 12, h: 4, visible: true },
          { id: "active_profiles", x: 0, y: 16, w: 12, h: 4, visible: true },
          { id: "shortlisted", x: 0, y: 20, w: 12, h: 4, visible: true },
          { id: "alerts", x: 0, y: 24, w: 12, h: 4, visible: true },
          { id: "trend_graph", x: 0, y: 28, w: 12, h: 12, visible: true },
          { id: "source_distribution", x: 0, y: 40, w: 12, h: 12, visible: true },
          { id: "upcoming_interviews", x: 0, y: 52, w: 12, h: 8, visible: true },
          { id: "email_delivery", x: 0, y: 60, w: 12, h: 8, visible: true },
          { id: "portal_reports", x: 0, y: 68, w: 12, h: 8, visible: true },
          { id: "pre_screening", x: 0, y: 76, w: 12, h: 8, visible: true }
        ]
      }
    }
  }
};

export const MOCK_USERS_LIST = [
  { id: 'usr_101', name: 'Sarah Jenkins', role: 'Recruiter', email: 'sarah.j@maprecruit.ai', avatar: null, initials: 'SJ', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'usr_102', name: 'Mike Ross', role: 'Hiring Manager', email: 'mike.ross@maprecruit.ai', avatar: null, initials: 'MR', color: 'bg-blue-100 text-blue-700' },
  { id: 'usr_103', name: 'David Chen', role: 'Sourcing Lead', email: 'david.chen@maprecruit.ai', avatar: null, initials: 'DC', color: 'bg-purple-100 text-purple-700' },
  { id: 'usr_104', name: 'Aleisa Hodgens', role: 'Admin', email: 'aleisa.h@maprecruit.ai', avatar: null, initials: 'AH', color: 'bg-orange-100 text-orange-700' },
  { id: 'usr_105', name: 'Vinay Kashyap', role: 'Admin', email: 'vinay.k@maprecruit.ai', avatar: null, initials: 'VK', color: 'bg-amber-100 text-amber-700' },
  { id: 'usr_123', name: 'Pratik Gaurav', role: 'Product Admin', email: 'pratik.gaurav@maprecruit.ai', avatar: null, initials: 'PG', color: 'bg-emerald-100 text-emerald-700' }, // Current User match
];

// --- CAMPAIGN SIDEBAR STRUCTURE DATA ---
export const SIDEBAR_CAMPAIGN_DATA = {
  activeCount: 40,
  closedCount: 32,
  archivedCount: 17,
  clients: [
    {
      name: "Amazon Warehouse Operations",
      campaigns: [
        { id: 1002, name: "Warehouse Associate - Voice Bot", jobId: "002002" },
        { id: 1003, name: "Cherry Picker Lift Driver", jobId: "40000612" },
        { id: 1004, name: "Manager of Accounting", jobId: "40000619" },
        { id: 1005, name: "Manager of Accounting", jobId: "40000624" },
        { id: 1006, name: "Manager of Accounting", jobId: "40000632" },
        { id: 1007, name: "Manager of Accounting", jobId: "40000623" },
        { id: 1008, name: "Cherry Picker Lift Driver", jobId: "40000633" },
        { id: 1009, name: "java developer", jobId: "12682953" },
        { id: 1010, name: "Cherry Picker Lift Driver", jobId: "40000618" },
        { id: 1011, name: "Hyperdrive Alignment Specialist", jobId: "40000194" }
      ]
    },
    {
      name: "Google Staffing Services",
      campaigns: [
        { id: 1012, name: "Warehouse Associate - Voice Bot", jobId: "002001" },
        { id: 1013, name: "Cherry Picker Lift Driver", jobId: "40000611" },
        { id: 1014, name: "Manager of Accounting", jobId: "40000620" },
        { id: 1015, name: "Manager of Accounting", jobId: "40000625" },
        { id: 1016, name: "Manager of Accounting", jobId: "40000635" },
        { id: 1017, name: "Manager of Accounting", jobId: "40000626" },
        { id: 1018, name: "Cherry Picker Lift Driver", jobId: "40000634" },
        { id: 1019, name: "java developer", jobId: "12682957" },
        { id: 1020, name: "Cherry Picker Lift Driver", jobId: "40000616" },
        { id: 1021, name: "Hyperdrive Alignment Specialist", jobId: "40000193" }
      ]
    },
    {
      name: "Microsoft HR Tech",
      campaigns: [
        { id: 1022, name: "Warehouse Associate - Voice Bot", jobId: "002003" },
        { id: 1023, name: "Cherry Picker Lift Driver", jobId: "40000613" },
        { id: 1024, name: "Manager of Accounting", jobId: "40000627" },
        { id: 1025, name: "Manager of Accounting", jobId: "40000628" },
        { id: 1026, name: "Manager of Accounting", jobId: "40000639" },
        { id: 1027, name: "Manager of Accounting", jobId: "40000629" },
        { id: 1028, name: "Cherry Picker Lift Driver", jobId: "40000636" },
        { id: 1029, name: "java developer", jobId: "12682958" },
        { id: 1030, name: "Cherry Picker Lift Driver", jobId: "40000637" },
        { id: 1031, name: "Hyperdrive Alignment Specialist", jobId: "40000196" }
      ]
    },
    {
      name: "TRC Talent Solutions",
      campaigns: [
        { id: 1, name: "Warehouse Associate - Voice Bot", jobId: "002000" },
        { id: 2, name: "Cherry Picker Lift Driver", jobId: "40000610" },
        { id: 3, name: "Manager of Accounting", jobId: "40000617" },
        { id: 4, name: "Manager of Accounting", jobId: "40000622" },
        { id: 5, name: "Manager of Accounting", jobId: "40000630" },
        { id: 6, name: "Manager of Accounting", jobId: "40000621" },
        { id: 7, name: "Cherry Picker Lift Driver", jobId: "40000631" },
        { id: 8, name: "java developer", jobId: "12682951" },
        { id: 9, name: "Cherry Picker Lift Driver", jobId: "40000615" },
        { id: 10, name: "Hyperdrive Alignment Specialist", jobId: "40000192" }
      ]
    }
  ]
};

export const MOCK_TAGS: Tag[] = [
  {
    id: 1,
    name: "Java Developer",
    description: "Candidates with strong Java backend experience",
    profilesCount: 120,
    createdDate: "2024-03-15",
    updatedDate: "2024-05-20",
    createdBy: "Pratik Gaurav",
    access: { level: 'COMPANY', ownerId: 'usr_123', sharedWith: [] }
  },
  {
    id: 2,
    name: "Immediate Joiner",
    description: "Candidates available to join within 15 days",
    profilesCount: 85,
    createdDate: "2024-02-10",
    updatedDate: "2024-05-18",
    createdBy: "Sarah Jenkins",
    access: { 
      level: 'PRIVATE', 
      ownerId: 'usr_101', 
      sharedWith: [
        { entityId: 'usr_123', entityName: 'Pratik Gaurav', entityType: 'USER', permission: 'VIEW', role: 'Product Admin', avatar: 'PG' }
      ] 
    }
  },
  {
    id: 3,
    name: "Warehouse Ops",
    description: "Experience in warehouse operations and logistics",
    profilesCount: 210,
    createdDate: "2024-01-05",
    updatedDate: "2024-04-22",
    createdBy: "Mike Ross",
    access: { level: 'CLIENT', clientId: 'Amazon', ownerId: 'usr_102', sharedWith: [] }
  },
  {
    id: 4,
    name: "React Frontend",
    description: "React.js, Redux, and modern frontend stack",
    profilesCount: 95,
    createdDate: "2024-04-01",
    updatedDate: "2024-05-21",
    createdBy: "Pratik Gaurav",
    access: { level: 'PRIVATE', ownerId: 'usr_123', sharedWith: [] }
  },
  {
    id: 5,
    name: "Certified Scrum Master",
    description: "CSM certification required",
    profilesCount: 45,
    createdDate: "2023-11-20",
    updatedDate: "2024-03-10",
    createdBy: "David Chen",
    access: { level: 'COMPANY', ownerId: 'usr_103', sharedWith: [] }
  },
  {
    id: 6,
    name: "Remote Only",
    description: "Candidates looking for remote opportunities",
    profilesCount: 150,
    createdDate: "2024-01-15",
    updatedDate: "2024-05-01",
    createdBy: "Sarah Jenkins",
    access: { 
        level: 'PRIVATE', 
        ownerId: 'usr_101', 
        sharedWith: [
            { entityId: 'usr_123', entityName: 'Pratik Gaurav', entityType: 'USER', permission: 'EDIT', role: 'Product Admin', avatar: 'PG' },
            { entityId: 'usr_102', entityName: 'Mike Ross', entityType: 'USER', permission: 'VIEW', role: 'Hiring Manager', avatar: 'MR' }
        ] 
    }
  }
];

export const PANEL_MEMBERS: PanelMember[] = [
  { id: 1, name: "QA Team Admin (Product Admin)", role: "QA Team Admin (Product Admin)", subRole: "Owner", initials: "QT", color: "bg-red-800 text-white" },
  { id: 2, name: "QA Team Admin (Product Admin)", role: "QA Team Admin (Product Admin)", subRole: "Recruiter", initials: "QT", color: "bg-red-800 text-white" },
  { id: 3, name: "Vinay Kashyap (Admin)", role: "Vinay Kashyap (Admin)", subRole: "Recruiter", initials: "VK", color: "bg-amber-700 text-white" },
  { id: 4, name: "Aleisa Hodgens (Admin)", role: "Aleisa Hodgens (Admin)", subRole: "Recruiter", initials: "AH", color: "bg-orange-700 text-white" },
  { id: 5, name: "Jaycee Smith (Recruiter)", role: "Jaycee Smith (Recruiter)", subRole: "Recruiter", initials: "JS", color: "bg-yellow-600 text-white" }
];

export const CAMPAIGN_ACTIVITIES: CampaignActivity[] = [
  {
    id: 1,
    date: "Friday, 26 December 2025",
    items: [
      { id: 101, title: "Vishnu Priya Linked to campaign software developer", subtitle: "Profile Linked", author: "QA Team Admin", time: "02:51 PM", type: 'link' }
    ]
  },
  {
    id: 2,
    date: "Thursday, 25 December 2025",
    items: [
      { id: 201, title: "Manish Rajpal Linked to campaign software developer", subtitle: "Profile Linked", author: "QA Team Admin", time: "10:58 AM", type: 'link' },
      { id: 202, title: "Manish Rajpal's profile uploaded to campaign software developer", subtitle: "Profile Uploaded", author: "QA Team Admin", time: "10:58 AM", type: 'upload' }
    ]
  },
  {
    id: 3,
    date: "Wednesday, 24 December 2025",
    items: [
      { id: 301, title: "madhusudhan rao Linked to campaign software developer", subtitle: "Profile Linked", author: "QA Team Admin", time: "04:51 PM", type: 'link' },
      { id: 302, title: "madhusudhan rao's profile uploaded to campaign software developer", subtitle: "Profile Uploaded", author: "QA Team Admin", time: "04:51 PM", type: 'upload' },
      { id: 303, title: "madhusudhan rao Linked to campaign software developer", subtitle: "Profile Linked", author: "QA Team Admin", time: "04:33 PM", type: 'link' },
      { id: 304, title: "madhusudhan rao's profile uploaded to campaign software developer", subtitle: "Profile Uploaded", author: "QA Team Admin", time: "04:33 PM", type: 'upload' },
      { id: 305, title: "madhusudhan rao Linked to campaign software developer", subtitle: "Profile Linked", author: "QA Team Admin", time: "03:25 PM", type: 'link' },
      { id: 306, title: "madhusudhan rao's profile uploaded to campaign software developer", subtitle: "Profile Uploaded", author: "QA Team Admin", time: "03:25 PM", type: 'upload' },
      { id: 307, title: "suresh ragavapudi Linked to campaign software developer", subtitle: "Profile Linked", author: "QA Team Admin", time: "03:23 PM", type: 'link' }
    ]
  }
];

export const CANDIDATE: Candidate = {
  id: '1',
  name: "Testy McTesterson",
  role: "Senior Performance Manager",
  type: "Employee",
  status: "Active",
  availability: "On Assignment",
  channel: "Form",
  location: "547 Pharr Rd NE, Atlanta, GA, 30309, USA",
  tags: ["High Volume", "Management", "Operations"],
  contact: {
    email: "bryan.trctest@yahoo.com",
    phone: "706-224-2011",
    altPhone: "N/A"
  },
  summary: "Senior Performance Manager with over 10 years of experience in staffing, operations, and retail management. Proven ability to manage headcount, recruitment, and employee engagement. Expert in P&L management and compliance protocols.",
  skills: ["Staffing Management", "Recruitment", "Operations", "Employee Engagement", "P&L Management", "Training", "Compliance", "Budgeting", "Team Leadership"],
  experience: [
    {
      id: 1,
      role: "Senior Performance Manager",
      company: "TRC STAFFING SERVICES, INC.",
      period: "Jan 2014 - Present",
      location: "Lilburn, GA",
      desc: "Responsible for overall headcount and maintaining staffing needs for major distributor of contact lenses. Source, select, interview and hire candidates. Perform all required pre-employment screenings."
    },
    {
      id: 2,
      role: "Operations Manager / Hiring Manager",
      company: "ACADEMY SPORTS + OUTDOORS",
      period: "May 2012 - Dec 2013",
      location: "Lilburn, GA",
      desc: "Coach, teach and train associates in product knowledge. Maintain accurate reporting of monthly P&L."
    }
  ],
  education: [
    { id: 1, degree: "Bachelor of Science", school: "GEORGIA SOUTHERN UNIVERSITY", year: "1999" }
  ],
  activities: [
    { id: 1, type: "Resume Uploaded", title: "Resume Uploaded to Profile", author: "Bryan Campbell", time: "06:04 PM", dateGroup: "Today", icon: FileText, color: "bg-blue-100 text-blue-600" },
    { id: 2, type: "Profile Edited", title: "Profile Edited by Bot", author: "Bot", time: "12:57 AM", dateGroup: "Yesterday", icon: Settings, color: "bg-green-100 text-green-600" },
    { id: 3, type: "Profile Unlinked", title: "Profile Unlinked from Last Mile", author: "Bryan Campbell", time: "08:46 PM", dateGroup: "November 12, 2025", icon: Link, color: "bg-red-100 text-red-600" },
  ],
  standaloneInterviews: [
    { id: 501, name: "Phone Call Interview", author: "Pratik", lastUpdated: "12/04/2025 12:39 PM", status: "Pending", type: "Interview", mode: "Phone", templateAttached: false },
    { id: 502, name: "Technical Video Call", author: "Sarah Jenkins", lastUpdated: "11/20/2025 09:15 AM", status: "Scheduled", type: "Interview", mode: "Video", templateAttached: true },
    { id: 503, name: "Culture Fit Round", author: "Mike Ross", lastUpdated: "10/15/2025 04:45 PM", status: "Completed", type: "Interview", mode: "In-Person", templateAttached: true },
    { id: 504, name: "Initial Screening", author: "System Bot", lastUpdated: "09/01/2025 10:00 AM", status: "Completed", type: "Assessment", mode: "Online", templateAttached: true, questions: [ { q: "Willing to relocate?", answer: "Yes" } ] }
  ],
  campaigns: [], // Populated dynamically in UI or separate list
  recommended: [
    { id: 1, name: "1st shift Forklift Operator", jobID: "40000008", location: "Athens, GA 30606, USA", company: "018 - ALCON" },
    { id: 2, name: "cherry picker", jobID: "562363", location: "Atlanta, GA", company: "TRC Talent Solutions" },
  ],
  similar: [
    { id: 1, name: "Bryan Testseventyfive", location: "Good Hope, GA", role: "Performance Manager", score: 98 },
    { id: 2, name: "Bryan Testseventyfour", location: "Good Hope, GA", role: "Performance Manager", score: 95 }
  ]
};

export const MOCK_PROFILES = [
  { id: 1, name: "Deanthony Quarterman", title: "Warehouse Supervisor", location: "Atlanta, GA", skills: ["Forklift Certified", "Inventory Management", "OSHA Safety", "Team Leadership"], experience: "7.3 Years", status: "Active", matchScore: 98, availability: "Immediate", avatar: "DQ" },
  { id: 2, name: "Shantrice Little", title: "Logistics Coordinator", location: "Atlanta, GA", skills: ["Shipping & Receiving", "Data Entry", "SAP", "Customer Service"], experience: "5.1 Years", status: "Active", matchScore: 92, availability: "2 Weeks", avatar: "SL" },
  { id: 3, name: "Marcus Johnson", title: "Forklift Operator", location: "Marietta, GA", skills: ["Forklift Certified", "Heavy Lifting", "Loading/Unloading"], experience: "3.5 Years", status: "Passive", matchScore: 88, availability: "Immediate", avatar: "MJ" },
  { id: 4, name: "Sarah Connors", title: "Operations Manager", location: "Atlanta, GA", skills: ["Process Improvement", "Six Sigma", "Team Building", "Budgeting"], experience: "12.0 Years", status: "Active", matchScore: 85, availability: "1 Month", avatar: "SC" },
  { id: 5, name: "David Chen", title: "Warehouse Associate", location: "Decatur, GA", skills: ["Packing", "Labeling", "Inventory count"], experience: "1.5 Years", status: "Active", matchScore: 78, availability: "Immediate", avatar: "DC" },
  { id: 6, name: "Michael Ross", title: "Forklift Operator", location: "Smyrna, GA", skills: ["Forklift Certified", "OSHA Safety"], experience: "4 Years", status: "Active", matchScore: 82, availability: "Immediate", avatar: "MR" },
  { id: 7, name: "Jennifer Wu", title: "Logistics Coordinator", location: "Alpharetta, GA", skills: ["SAP", "Data Entry", "Shipping & Receiving"], experience: "6 Years", status: "Pending Applicant", matchScore: 89, availability: "2 Weeks", avatar: "JW" }
];

export const RECENT_SEARCHES = [
  { id: 1, terms: ["warehouse", "warehouse helper"], date: "4 Days Ago" },
  { id: 2, terms: ["forklift operator"], date: "1 Week Ago" },
  { id: 3, terms: ["40000233"], date: "2 Weeks Ago" },
  { id: 4, terms: ["testing", "PC Tech"], date: "1 Month Ago" }
];

export const SAVED_SEARCHES = [
  { id: 1, name: "@$%^&*!@%%$^%", tags: ["Lift Engineer"], shared: true, date: "Oct 12, 2025" },
  { id: 2, name: "12345654543245", tags: ["Data Analysts"], shared: false, date: "Sep 20, 2025" },
  { id: 3, name: "abcsddd", tags: ["Data Analysts"], shared: false, date: "Aug 15, 2025" }
];

export const RECENT_VISITS = [
  { id: 1, name: "Dennis Soils", role: "Warehouse Lead", time: "4 days ago" },
  { id: 2, name: "Freddie McIlwain", role: "Driver", time: "4 days ago" },
  { id: 3, name: "Testy McTesterson", role: "QA", time: "4 days ago" },
  { id: 4, name: "Pratik Gaurav", role: "Developer", time: "4 days ago" },
  { id: 5, name: "Temp Profile", role: "Worker", time: "4 days ago" }
];

// Helper to create campaign
const createCampaign = (id: number, name: string, jobID: string, status: 'Active' | 'Closed' | 'Archived', ownerInitials: string, ownerColor: string, isNew = false, isFavorite = false, profiles = 0, date = "12/26/2025", type = "Direct Hire", location = "Hyderabad (+1)") => ({
  id, name, role: "Role", jobID, status, date, updatedDate: date, daysLeft: status === 'Active' ? Math.floor(Math.random() * 30) : 0, candidates: Math.floor(Math.random() * 20), profilesCount: profiles, isNew, isFavorite,
  owner: { initials: ownerInitials, color: ownerColor, name: "User" },
  members: [{ initials: "VK", color: "bg-blue-100 text-blue-800", name: "Vinod" }, { initials: "AH", color: "bg-orange-100 text-orange-800", name: "Alex" }],
  rounds: [],
  type,
  location
});

const ACTIVE_CAMPAIGNS: Campaign[] = [
  createCampaign(1, "Warehouse Associate - Voice Bot", "002000", "Active", "BN", "bg-purple-200 text-purple-800", false, false, 72, "12/23/2025"),
  createCampaign(2, "Cherry Picker Lift Driver", "40000610", "Active", "JS", "bg-slate-700 text-white", true, false, 4, "12/19/2025"),
  createCampaign(3, "Manager of Accounting", "40000617", "Active", "JS", "bg-slate-700 text-white", true, false, 0, "12/19/2025"),
  createCampaign(4, "Manager of Accounting", "40000622", "Active", "JS", "bg-slate-700 text-white", true, false, 0, "12/19/2025"),
  createCampaign(5, "Manager of Accounting", "40000630", "Active", "JS", "bg-slate-700 text-white", true, false, 0, "12/19/2025"),
  createCampaign(6, "Manager of Accounting", "40000621", "Active", "JS", "bg-slate-700 text-white", true, false, 0, "12/19/2025"),
  createCampaign(7, "Cherry Picker Lift Driver", "40000631", "Active", "JS", "bg-slate-700 text-white", true, false, 0, "12/19/2025"),
  createCampaign(8, "java developer", "12682951", "Active", "SG", "bg-orange-200 text-orange-800", true, true, 5, "12/19/2025"),
  createCampaign(9, "Cherry Picker Lift Driver", "40000615", "Active", "JS", "bg-slate-700 text-white", true, false, 1, "12/04/2025"),
  createCampaign(10, "Hyperdrive Alignment Specialist", "40000192", "Active", "JS", "bg-slate-700 text-white", false, false, 0, "12/04/2025"),
];

const CLOSED_CAMPAIGNS: Campaign[] = Array.from({ length: 32 }).map((_, i) => 
  createCampaign(100 + i, i % 2 === 0 ? "Cherry Picker Lift Driver" : "Manager of Accounting", `40000${640 + i}`, "Closed", "VK", "bg-orange-200 text-orange-800", false, i % 5 === 0, Math.floor(Math.random() * 10), "08/15/2025")
);

const ARCHIVED_CAMPAIGNS: Campaign[] = Array.from({ length: 17 }).map((_, i) => 
  createCampaign(
    200 + i, 
    i % 3 === 0 ? "Machine Operator" : (i % 2 === 0 ? "Cherry Picker Lift Driver" : "Manager of Accounting"), 
    `40000${400 + i}`, 
    "Archived", 
    "AJ", 
    "bg-red-200 text-red-800", 
    i < 5, 
    false, 
    Math.floor(Math.random() * 5), 
    "05/29/2025"
  )
);

export const GLOBAL_CAMPAIGNS = [...ACTIVE_CAMPAIGNS, ...CLOSED_CAMPAIGNS, ...ARCHIVED_CAMPAIGNS];

export const NODE_TYPES: any = {
  ANNOUNCEMENT: { color: "bg-purple-100 border-purple-300 text-purple-700", icon: Mail, label: "Announcement" },
  SCREENING: { color: "bg-blue-100 border-blue-300 text-blue-700", icon: FileText, label: "Screening" },
  INTERVIEW: { color: "bg-orange-100 border-orange-300 text-orange-700", icon: Video, label: "Interview" },
  SURVEY: { color: "bg-teal-100 border-teal-300 text-teal-700", icon: MessageSquare, label: "Survey" },
};

export const INITIAL_NODES: EngageNode[] = [
  { 
    id: '1', 
    type: 'ANNOUNCEMENT', 
    title: 'Welcome Email', 
    x: 50, y: 300, 
    data: { 
      desc: "Automated greeting",
      stats: { scheduled: 120, viewed: 45 }
    } 
  },
  { 
    id: '2', 
    type: 'SCREENING', 
    title: 'Gen. Screening', 
    x: 350, y: 300, 
    data: { 
      desc: "Basic qualifications",
      stats: { scheduled: 80, responded: 65 }
    } 
  },
  { 
    id: '3', 
    type: 'SCREENING', 
    title: 'Skill Check', 
    x: 650, y: 300, 
    data: { 
        desc: "Branch by Tech Stack",
        stats: { scheduled: 80, responded: 75 }
    } 
  },
  { 
    id: '4a', 
    type: 'SCREENING', 
    title: 'React Quiz', 
    x: 950, y: 100, 
    data: { 
      desc: "Component lifecycle",
      stats: { scheduled: 25, responded: 20 }
    } 
  },
  { 
    id: '4b', 
    type: 'SURVEY', 
    title: 'Feedback Survey', 
    x: 950, y: 300, 
    data: { 
      desc: "Candidate Experience",
      stats: { scheduled: 30, responded: 12 }
    } 
  },
  { 
    id: '4c', 
    type: 'SCREENING', 
    title: 'Vue.js Quiz', 
    x: 950, y: 500, 
    data: { 
      desc: "Vuex & Directives",
      stats: { scheduled: 15, responded: 14 }
    } 
  },
  { 
    id: '5a', 
    type: 'INTERVIEW', 
    title: 'Modern FE Interview', 
    x: 1300, y: 150, 
    data: { 
      desc: "React & Vue Candidates",
      meetType: ['Video'],
      stats: { scheduled: 15, booked: 10 }
    } 
  },
  { 
    id: '5b', 
    type: 'INTERVIEW', 
    title: 'Enterprise FE Interview', 
    x: 1300, y: 400, 
    data: { 
      desc: "Angular Candidates",
      meetType: ['In-Person'],
      stats: { scheduled: 5, booked: 2 }
    } 
  },
];

export const INITIAL_EDGES: EngageEdge[] = [
  { from: '1', to: '2' },
  { from: '2', to: '3' },
  { from: '3', to: '4a', label: 'React' },
  { from: '3', to: '4b', label: 'Angular' },
  { from: '3', to: '4c', label: 'Vue.js' },
  { from: '4a', to: '5a' },
  { from: '4c', to: '5a' },
  { from: '4b', to: '5b' },
];

export const MOCK_QUESTIONS_DATA: Question[] = [
  {
      id: 1,
      questionText: "Which of the following are valid Python data types?",
      questionType: "Standard",
      responseType: "Multiple Correct",
      options: [
          { text: "List", responses: 45 },
          { text: "Dictionary", responses: 42 },
          { text: "Tuple", responses: 38 },
          { text: "Class", responses: 15 }
      ],
      responses: 140
  },
  {
      id: 4,
      questionText: "What is the capital of France?",
      questionType: "Standard",
      responseType: "Single Correct",
      options: [
          { text: "Berlin", responses: 2 },
          { text: "Madrid", responses: 5 },
          { text: "Paris", responses: 58 },
          { text: "Rome", responses: 1 }
      ],
      responses: 66
  },
  {
      id: 6,
      questionText: "Select the name you have listened to in Audio",
      questionType: "Flowchart",
      responseType: "Branching Logic",
      options: [],
      responses: 15
  },
  {
      id: 9,
      questionText: "Provide the Video response for this GIF",
      questionType: "Standard",
      responseType: "GIF",
      options: [],
      responses: 7
  },
  {
      id: 3,
      questionText: "Please upload a short video introducing yourself.",
      questionType: "Standard",
      responseType: "Video",
      options: [],
      responses: 3
  },
  {
      id: 10,
      questionText: "What is your current work location?",
      questionType: "Standard",
      responseType: "Single Location",
      options: [],
      responses: 65
  },
  {
      id: 5,
      questionText: "Welcome to the assessment! Click 'Continue'.",
      questionType: "Announcement",
      responseType: "None",
      options: [],
      responses: null
  },
];

export const MOCK_CANDIDATES_CAMPAIGN: Candidate[] = [
  { id: 1, name: "Sarah Jenkins", role: "Frontend Developer (React)", stage: "Interview (3a)", status: "Pending", avatar: "SJ", campaigns: [], recommended: [], similar: [], tags: [], contact: { email: '', phone: '', altPhone: '' }, summary: '', skills: [], experience: [], education: [], activities: [] },
  { id: 2, name: "David Chen", role: "Frontend Developer (Angular)", stage: "Screening (2b)", status: "Completed", avatar: "DC", campaigns: [], recommended: [], similar: [], tags: [], contact: { email: '', phone: '', altPhone: '' }, summary: '', skills: [], experience: [], education: [], activities: [] },
  { id: 3, name: "Maria Garcia", role: "Fullstack (Vue.js)", stage: "Screening (2c)", status: "In Progress", avatar: "MG", campaigns: [], recommended: [], similar: [], tags: [], contact: { email: '', phone: '', altPhone: '' }, summary: '', skills: [], experience: [], education: [], activities: [] },
];

export const INTERVIEW_TEMPLATES = [
  { id: 1, title: "Phone Call Interview", created: "11/29/2022", author: "Pratik", access: "Company" },
  { id: 2, title: "Basic Interview Questions", created: "04/02/2024", author: "Pratik", access: "Company" },
  { id: 3, title: "Technical Screening - L1", created: "01/15/2025", author: "System", access: "Public" }
];

export const QUICK_FILTERS = [
  { label: "⚡ Immediate Start", value: "Immediate" }, 
  { label: "📍 Atlanta Only", value: "Atlanta, GA" }, 
  { label: "🏗️ Forklift Certified", value: "Forklift Certified" }, 
  { label: "⭐ Top Rated", value: "High Match (>90%)" }, 
  { label: "👔 Supervisors", value: "Warehouse Supervisor" } 
];

export const SIDEBAR_FILTERS = [
  { id: 'location', label: 'Locations', options: ['Atlanta, GA', 'Marietta, GA', 'Decatur, GA', 'Alpharetta, GA', 'Smyrna, GA'] },
  { id: 'title', label: 'Job Title', options: ['Warehouse Supervisor', 'Forklift Operator', 'Logistics Coordinator', 'Operations Manager', 'Warehouse Associate'] },
  { id: 'skills', label: 'Skills & Certs', options: ["Forklift Certified", "SAP", "Inventory Management", "Team Leadership", "OSHA Safety", "Data Entry"] },
  { id: 'status', label: 'Status', options: ['Active', 'Passive', 'Pending Applicant', 'Do Not Contact'] },
  { id: 'availability', label: 'Availability', options: ['Immediate', '2 Weeks', '1 Month'] },
  { id: 'match', label: 'Match Quality', options: ['High Match (>90%)'] }
];

export const FOLDERS_LIST = [
  { 
    id: 1, 
    name: "Java Developers", 
    createdDate: "2024-01-15", 
    totalProfiles: 150, 
    addedLast30: 12, 
    noActivity30: 45,
    pending: 40,
    applicants: 60,
    employees: 30,
    onAssignment: 25,
    notOnAssignment: 5,
    type: "Tech"
  },
  { 
    id: 2, 
    name: "Warehouse Leads", 
    createdDate: "2024-02-10", 
    totalProfiles: 85, 
    addedLast30: 5, 
    noActivity30: 10,
    pending: 20,
    applicants: 35,
    employees: 25,
    onAssignment: 20,
    notOnAssignment: 5,
    type: "Operations"
  },
  { 
    id: 3, 
    name: "Sales Representatives", 
    createdDate: "2024-03-05", 
    totalProfiles: 210, 
    addedLast30: 30, 
    noActivity30: 80,
    pending: 100,
    applicants: 80,
    employees: 10,
    onAssignment: 10,
    notOnAssignment: 0,
    type: "Sales"
  },
  { 
    id: 4, 
    name: "Q2 Interns", 
    createdDate: "2024-04-01", 
    totalProfiles: 300, 
    addedLast30: 150, 
    noActivity30: 0,
    pending: 250,
    applicants: 50,
    employees: 0,
    onAssignment: 0,
    notOnAssignment: 0,
    type: "General"
  },
  { 
    id: 5, 
    name: "Executive Search", 
    createdDate: "2023-11-20", 
    totalProfiles: 15, 
    addedLast30: 1, 
    noActivity30: 5,
    pending: 5,
    applicants: 8,
    employees: 1,
    onAssignment: 1,
    notOnAssignment: 0,
    type: "Executive"
  }
];

// --- DYNAMIC FULL PROFILE DATA ---
export const FULL_PROFILE_DATA = {
    "resumeDetails": {
        "_id": "690983bcb7f941d7bdaf0a27",
        "companyID": "6112806bc9147f673d28c6eb",
        "sharedUserID": [],
        "favouriteUserID": [],
        "articleID": [
            "63d760a9aec60c5e1494a9ea"
        ],
        "campaignID": [
            "69292315e875b71058253412",
            "62c5a8c7250281f99ac58215",
            "6915cf8c26bd5d74fe99dc7b",
            "6931992db394b307b3b087df",
            "6904a1b1fc63a531b40f27ba",
            "692922fc67d80b239e4e3ab0",
            "68f7cdae322c76d7b59f221a",
            "667d30e5004ab28fd4bd3af4",
            "690b60b2ee0e3af66c119ac3",
            "693155d5f2242275bd7148e3",
            "678802b344b68e1a8c7a40eb",
            "69453921710bafba20237de6",
            "693696b395bfcea522303666"
        ],
        "attachedCampaigns": [],
        "sharedArticleID": [],
        "status": "SUCCESS",
        "personnelStatus": "Pending Applicant",
        "employmentStatus": "Active",
        "availability": "Available",
        "tagID": [],
        "active": true,
        "resume": {
            "profile": {
                "fullName": "Pratik Gaurav",
                "firstName": "Pratik",
                "middleName": "",
                "lastName": "Gaurav",
                "nickName": "",
                "nameSuffix": "",
                "emails": [
                    {
                        "text": "pratik.gaurav@maprecruit.ai",
                        "email": "pratik.gaurav@maprecruit.ai",
                        "type": "Personal",
                        "preferred": "Primary",
                        "confidenceScore": 1,
                        "valid": true,
                        "verified": false,
                        "subscribeStatus": "Opt-in"
                    }
                ],
                "phones": [
                    {
                        "text": "+917004029399",
                        "phoneNumberOnly": "7004029399",
                        "internationalPhoneCode": "+91",
                        "nationalPhoneCode": "",
                        "country": "INDIA",
                        "countryCode": "IN",
                        "type": "Mobile",
                        "preferred": "Primary",
                        "DNDStatus": "",
                        "confidenceScore": 1,
                        "valid": true,
                        "verified": false,
                        "subscribeStatus": "Opt-in",
                        "ontology": true
                    }
                ],
                "websites": [],
                "skypeID": "",
                "locations": [
                    {
                        "text": "san diego,california,united states of america,92101",
                        "tier": "",
                        "address": "",
                        "addressType": "present",
                        "area": "",
                        "city": "san diego",
                        "district": "",
                        "state": "california",
                        "stateCode": "CA",
                        "country": "united states of america",
                        "countryCode": "US",
                        "postalCode": "92101",
                        "pin": {
                            "lat": 32.717421,
                            "lon": -117.162771
                        },
                        "cityCanonical": "san diego",
                        "districtCanonical": "",
                        "stateCanonical": "california",
                        "countryCanonical": "united states of america",
                        "foundInResume": true,
                        "confidenceScore": 1,
                        "ontology": true
                    }
                ],
                "gender": { "text": "", "label": "", "found": false },
                "ethnicity": "",
                "veteranStatus": "",
                "languagesKnown": [],
                "age": { "text": "", "inYears": 0, "found": false, "confidenceScore": 1 },
                "dob": { "text": "", "standard": "", "month": "", "date": "", "year": "", "confidenceScore": 1 },
                "nationality": { "text": "", "label": "", "nationalityCanonical": "", "ethnicity": "", "country": "", "countryCode": "" },
                "maritalStatus": "",
                "fatherName": "",
                "motherName": "",
                "spouseName": "",
                "passport": { "passportNumber": "", "country": "", "countryCode": "", "expiryDate": { "text": "", "standard": "", "date": "", "month": "", "year": "" } },
                "profileImage": { "content": "", "fileName": "" }
            },
            "professionalSummary": {
                "objective": "",
                "summary": "Skilled Software Engineer with 3 years of hands-on experience in automation and manual testing. Proficient in Selenium, TestNG, and Rest Assured with a strong track record of reducing manual testing efforts and enhancing software quality. Experienced in\nAPI, ETL, web application, and Database testing techniques. Worked on waterfall and agile methodologies across various teams and clients to deliver reliable software solutions.",
                "noticePeriod": { "text": "", "days": 0, "negotiable": false },
                "workPermit": { "text": "", "type": "", "status": "Unknown", "country": "", "countryCode": "" },
                "currentSalary": { "text": "", "period": "Per Hour", "currency": "", "value": 0, "country": "", "countryCode": "", "minvalue": "" },
                "expectedSalary": { "text": "", "period": "Per Hour", "currency": "", "minvalue": 0, "maxvalue": 0, "negotiable": false },
                "preferredLocations": [],
                "desiredWorkSchedule": [],
                "availableDate": { "text": "", "standard": "", "year": "", "month": "","date": "" },
                "yearsOfExperience": { "text": "0.0", "derivedYears": 6.75, "mentionedYears": 6.75, "finalYears": 6.75, "confidenceScore": 1 },
                "currentRole": { "jobTitle": "Instructional Student Assistant", "entityID": "", "jobProfile": "", "jobLevel": "", "jobType": "", "jobCategory": "", "jobTitleCanonical": [ "instructional student assistant" ], "canonicalID": [ "688cd2d2f4b6d9e7b4c3ffdb" ], "confidenceScore": 1 },
                "currentCompany": { "company": "San Diego", "companyCanonical": "san diego", "confidenceScore": 1 },
                "preferredRoles": [],
                "currentlyWorking": true,
                "gapYears": { "experienceGapYears": 0, "recentExperienceGap": 0, "longestExperienceGapYears": 0, "educationExperienceGapYears": 0 },
                "avgExperiencePerCompany": 0
            },
            "professionalQualification": {
                "education": [
                    {
                        "campus": { "text": "San Diego State University", "redFlag": false, "canonical": "san diego state university", "type": "Unknown", "confidenceScore": 1 },
                        "university": { "text": "san diego state university", "canonical": "san diego state university", "type": "University", "confidenceScore": 1 },
                        "degree": { "text": "Master of Science", "canonical": "master of science", "similar": [], "type": "", "level": "pg", "confidenceScore": 1, "entityID": "5bbb58d1ef29be4f56d0b152", "canonicalID": "", "ontology": true },
                        "major": [ { "text": "Computer Science | Design, Machine Learning", "entityID": "", "canonical": [ "machine learning" ], "canonicalID": [], "similar": [], "confidenceScore": 1, "ontology": true } ],
                        "minor": [],
                        "merit": { "percentage": 38.8, "GPA": "3.88", "GPAOutOf": 10 },
                        "currentStatus": "Passed",
                        "startDate": { "text": "2022-08-01", "standard": "2022-08-01", "year": "2022", "month": "08", "date": "01", "ontology": true },
                        "endDate": { "text": "2024-05-01", "standard": "2024-05-01", "year": "2024", "month": "05", "date": "01", "ontology": true },
                        "duration": { "text": "1 years 9 months", "inYears": 1.8, "years": 1, "months": 9, "days": 0 },
                        "location": { "text": "SanDiego,CA,USA", "tier": "", "address": "San Diego, CA, USA", "area": "", "city": "", "district": "", "state": "USA", "stateCode": "", "country": "", "countryCode": "", "postalCode": "", "pin": { "lat": "", "lon": "" }, "cityCanonical": "", "districtCanonical": "", "stateCanonical": "", "countryCanonical": "", "latitude": "", "longitude": "", "ontology": false }
                    },
                    {
                        "campus": { "text": "", "redFlag": false, "canonical": "", "type": "Unknown", "confidenceScore": 1 },
                        "university": { "text": "", "canonical": "", "type": "University", "confidenceScore": 1 },
                        "degree": { "text": "Bachelor of Technology", "canonical": "bachelor of technology", "similar": [], "type": "", "level": "ug", "confidenceScore": 1, "entityID": "5bbb58e2ef29be4f56d0bfe6", "canonicalID": "", "ontology": true },
                        "major": [ { "text": "Computer Science & Engineering | Mining", "entityID": "", "canonical": [ "mining" ], "canonicalID": [], "similar": [], "confidenceScore": 1, "ontology": true } ],
                        "minor": [],
                        "merit": { "percentage": 31.1, "GPA": "3.11", "GPAOutOf": 10 },
                        "currentStatus": "Passed",
                        "startDate": { "text": "2014-07-01", "standard": "2014-07-01", "year": "2014", "month": "07", "date": "01", "ontology": true },
                        "endDate": { "text": "2018-05-01", "standard": "2018-05-01", "year": "2018", "month": "05", "date": "01", "ontology": true },
                        "duration": { "text": "3 years 10 months", "inYears": 3.8, "years": 3, "months": 10, "days": 0 },
                        "location": { "text": "hyderabad,telangana,Hyderabad,India,india", "tier": "", "address": "Hyderabad, India", "area": "", "city": "hyderabad", "district": "", "state": "telangana", "stateCode": "TG", "country": "india", "countryCode": "IN", "postalCode": [], "pin": { "lat": 17.361608, "lon": 78.474629 }, "cityCanonical": "hyderabad", "districtCanonical": "", "stateCanonical": "telangana", "countryCanonical": "india", "latitude": "", "longitude": "", "addressType": "others", "ontology": true, "confidenceScore": 1 }
                    },
                    {
                        "campus": { "canonical": "keiser university", "confidenceScore": 1, "redFlag": false, "text": "Keiser University", "type": "Unknown" },
                        "currentStatus": "Studying",
                        "degree": { "canonical": "associate's degree", "canonicalID": "", "confidenceScore": 1, "entityID": "", "level": "ug", "similar": [], "text": "Associate Degree", "type": "" },
                        "duration": { "days": 0, "inYears": 0, "months": 0, "text": "", "years": 0 },
                        "endDate": { "date": "", "month": "", "standard": "", "text": "Present", "year": "" },
                        "location": { "address": "", "area": "", "city": "", "cityCanonical": "", "country": "", "countryCanonical": "", "countryCode": "", "district": "", "districtCanonical": "", "latitude": "", "longitude": "", "pin": { "lat": "", "lon": "" }, "postalCode": "", "state": "", "stateCanonical": "", "stateCode": "", "text": "", "tier": "" },
                        "major": [ { "canonical": [ "engineering" ], "canonicalID": [], "confidenceScore": 1, "entityID": "", "similar": [], "text": "Engineering" } ],
                        "merit": { "GPA": 0, "GPAOutOf": 10, "percentage": 0 },
                        "minor": [],
                        "startDate": { "date": "1", "month": "8", "standard": "2021-08-01", "text": "2021-08-01", "year": "2021" },
                        "university": { "canonical": "", "confidenceScore": 1, "text": "keiser university", "type": "University" }
                    }
                ],
                "skills": [
                    { "text": "Leadership" }, { "text": "Conflict management" }, { "text": "Communication skills" }, { "text": "Microsoft Office" }, { "text": "Shipping & Receiving" }, { "text": "Shipping" }, { "text": "Operating Systems" }, { "text": "Warehouse Experience" }, { "text": "Forklift" }, { "text": "Order Picking" }, { "text": "Picking" }, { "text": "Warehouse Management" }, { "text": "Computer skills" }, { "text": "Computer" }, { "text": "Customer service" }, { "text": "Organizational skills" }, { "text": "Documentation" }, { "text": "Phone etiquette" }, { "text": "Pallet Jack" }, { "text": "Pallet" }, { "text": "effectively communicating" }, { "text": "assisting employees" }, { "text": "professional manner" }, { "text": "teach others" }, { "text": "Problem solving" }, { "text": "high energy" }, { "text": "enthusiastic" }, { "text": "communicating" }, { "text": "attention to detail" }, { "text": "customer orders" }, { "text": "clean" }, { "text": "handheld scanners" }, { "text": "safety procedures" }, { "text": "machine equipment" }, { "text": "working with a team" }, { "text": "exceeding expectations" }, { "text": "Service / Sales" }, { "text": "Sales" }, { "text": "online sales" }, { "text": "keep track of inventory" }, { "text": "shopping experience" }, { "text": "answering questions" }, { "text": "answering inbound calls" }, { "text": "inbound" }, { "text": "inbound calls" }, { "text": "providing customers" }, { "text": "resolving customer issues" }, { "text": "delivering results" }, { "text": "customer issues" }, { "text": "Warehouse" },
                    { "text": "automation" }, { "text": "manual testing" }, { "text": "Selenium" }, { "text": "TestNG" }, { "text": "Rest Assured" }, { "text": "software quality" }, { "text": "API" }, { "text": "ETL" }, { "text": "web application" }, { "text": "Database testing" }, { "text": "testing techniques" }, { "text": "waterfall" }, { "text": "agile methodologies" }, { "text": "software solutions" }, { "text": "testing" }, { "text": "Core Java" }, { "text": "HTML5" }, { "text": "CSS3" }, { "text": "jQuery" }, { "text": "MySQL" }, { "text": "MongoDB" }, { "text": "Python" }, { "text": "JavaScript" }, { "text": "ReactJS" }, { "text": "NodeJS" }, { "text": "SOAPUI" }, { "text": "Postman" }, { "text": "Agile" }, { "text": "Workbench" }, { "text": "Eclipse" }, { "text": "Brackets" }, { "text": "Tableau" }, { "text": "Git" }, { "text": "GitHub" }, { "text": "JIRA" }, { "text": "ML" }, { "text": "Data Analysis" }, { "text": "NumPy" }, { "text": "Pandas" }, { "text": "SciPy" }, { "text": "Scikit - learn" }, { "text": "Matplotlib" }, { "text": "Plotly" }, { "text": "Seaborn" }, { "text": "Analysis" }, { "text": "Scikit" }, { "text": "Data Science" }, { "text": "Wireless Networks" }, { "text": "lecture" }, { "text": "grading" }, { "text": "coding" }, { "text": "project proposals" }, { "text": "assist students" }, { "text": "canvas" }, { "text": "STLC" }, { "text": "SDLC" }, { "text": "ETL testing" }, { "text": "JIRA , Agile" }, { "text": "Java" }, { "text": "POM" }, { "text": "automation framework" }, { "text": "regression" }, { "text": "Selenium WebDriver" }, { "text": "web pages" }, { "text": "XPath" }, { "text": "WebDriver" }, { "text": "debugging" }, { "text": "QA" }, { "text": "generated reports" }, { "text": "ensured successful delivery" }, { "text": "RESTful services" }, { "text": "XML" }, { "text": "JSON" }, { "text": "RESTful" }, { "text": "offshore" }, { "text": "QA validation" }, { "text": "database migration" }, { "text": "SQL" }, { "text": "Azure" }, { "text": "Data Mart" }, { "text": "migration" }, { "text": "SQL queries" }, { "text": "Python scripts" }, { "text": "Azure Data Lake" }, { "text": "Data Lake" }, { "text": "Insurance" }, { "text": "test cases" }, { "text": "Sanity" }, { "text": "Integration" }, { "text": "user experience" }, { "text": "user stories" }, { "text": "WebMethods" }, { "text": "MuleSoft" }, { "text": "data integrity" }, { "text": "knowledge - sharing" }, { "text": "Insurance concepts" }, { "text": "XGBoost" }, { "text": "regression models" }, { "text": "algorithms" }, { "text": "training" }, { "text": "testing data" }, { "text": "Random Forest" }, { "text": "Support Vector Machine" }, { "text": "Logistic Regression" }, { "text": "Inventory Management System" }, { "text": "MERN Stack" }, { "text": "HTML" }, { "text": "Inventory Management" }, { "text": "Management System" }, { "text": "MERN" }, { "text": "web development framework" }, { "text": "development framework" }, { "text": "backend" }, { "text": "logic" }, { "text": "cluster" }, { "text": "RESTful API" }, { "text": "warehouse operation" }, { "text": "safety protocols " }, { "text": "ability to lift" }
                ],
                "licences": []
            },
            "professionalExperience": [
                {
                    "company": { "canonical": [], "canonicalDetails": [], "confidenceScore": 1, "redFlag": false, "text": "Animal Supply Company" },
                    "currentStatus": "Working",
                    "description": "The responsibilities that the position of warehouse lead required, consisted of the supervision of other employees which entailed keeping track of schedules, effectively communicating and assisting employees and management to meet the demands of the company and being able to address concerns and conflict in an appropriate, professional manner. This role requires one to not only be good at the job but to know how to add value and teach others to be just as good . Problem solving and conflict resolution with high energy combined with the ability to be interactive and enthusiastic are key qualities to have in assuming the position.\nGeneral Warehouse",
                    "duration": { "days": 28, "inYears": 4, "months": 11, "text": "3 years 11 months 28 days", "years": 3 },
                    "endDate": { "date": "29", "month": "12", "standard": "", "text": "Present", "year": "2025" },
                    "jobTitle": { "confidenceScore": 1, "entityID": "5bc70e185e801c57a520d445", "jobCategory": "", "jobTitles": [], "jobType": "Premanent", "text": "Warehouse Lead" },
                    "location": { "address": "Duluth, GA", "area": "", "city": "", "cityCanonical": "", "country": "", "countryCanonical": "", "countryCode": "", "district": "", "districtCanonical": "", "pin": { "lat": "", "lon": "" }, "postalCode": "", "state": "", "stateCanonical": "", "stateCode": "", "text": "Duluth, GA", "tier": "" },
                    "previousGapYears": { "days": 0, "inYears": 0, "months": 0, "years": 0 },
                    "projects": [],
                    "reasonForLeave": "",
                    "skills": [],
                    "startDate": { "date": "1", "month": "1", "standard": "2022-01-01", "text": "2022-01-01", "year": "2022" },
                    "supervisor": { "confidenceScore": 1, "jobTitles": [], "name": "", "text": "" },
                    "workSchedule": ""
                },
                {
                    "company": { "canonical": [], "canonicalDetails": [], "confidenceScore": 1, "redFlag": false, "text": "Animal Supply Co. - Suwannee, GA" },
                    "currentStatus": "Working",
                    "description": "This role requires attention to detail and the ability to learn instantaneously how to pick items for customer orders and pack them while following proper warehouse procedures. Tasks often come with different variations such as preserving a clean and orderly workspace, using handheld scanners and computerized operating systems that coincide with inventory, practicing safety procedures, operating machine equipment and working with a team to meet performance standards and productivity goals.",
                    "duration": { "days": 28, "inYears": 4.7, "months": 7, "text": "4 years 7 months 28 days", "years": 4 },
                    "endDate": { "date": "29", "month": "12", "standard": "", "text": "Present", "year": "2025" },
                    "jobTitle": { "confidenceScore": 1, "entityID": "", "jobCategory": "", "jobTitles": [], "jobType": "Premanent", "text": "Seasonal Customer Service / Sales" },
                    "location": { "address": "prosperity", "area": "", "city": "", "cityCanonical": "", "country": "", "countryCanonical": "", "countryCode": "", "district": "", "districtCanonical": "", "pin": { "lat": "", "lon": "" }, "postalCode": "", "state": "", "stateCanonical": "", "stateCode": "", "text": "prosperity", "tier": "" },
                    "previousGapYears": { "days": 0, "inYears": 0, "months": 0, "years": 0 },
                    "projects": [],
                    "reasonForLeave": "",
                    "skills": [],
                    "startDate": { "date": "1", "month": "5", "standard": "2021-05-01", "text": "2021-05-01", "year": "2021" },
                    "supervisor": { "confidenceScore": 1, "jobTitles": [], "name": "", "text": "" },
                    "workSchedule": ""
                },
                {
                    "company": { "canonical": [], "canonicalDetails": [], "confidenceScore": 1, "redFlag": false, "text": "PureBlanding" },
                    "currentStatus": "Worked",
                    "description": "The primary obligations of the job were to assist with online sales. It was important to keep track of inventory and sale performances. To sustain a positive online shopping experience for customer, providing help with any complications and answering questions in a timely, adequate manner were vital.",
                    "duration": { "days": 0, "inYears": 0.5, "months": 6, "text": "6 months", "years": 0 },
                    "endDate": { "date": "1", "month": "12", "standard": "2020-12-01", "text": "2020-12-01", "year": "2020" },
                    "jobTitle": { "confidenceScore": 1, "entityID": "", "jobCategory": "", "jobTitles": [], "jobType": "Premanent", "text": "N/A" },
                    "location": { "address": "Irvington, NJ", "area": "", "city": "", "cityCanonical": "", "country": "", "countryCanonical": "", "countryCode": "", "district": "", "districtCanonical": "", "pin": { "lat": "", "lon": "" }, "postalCode": "", "state": "", "stateCanonical": "", "stateCode": "", "text": "Irvington, NJ", "tier": "" },
                    "previousGapYears": { "days": 0, "inYears": 0, "months": 0, "years": 0 },
                    "projects": [],
                    "reasonForLeave": "",
                    "skills": [],
                    "startDate": { "date": "1", "month": "6", "standard": "2020-06-01", "text": "2020-06-01", "year": "2020" },
                    "supervisor": { "confidenceScore": 1, "jobTitles": [], "name": "", "text": "" },
                    "workSchedule": ""
                },
                {
                    "company": { "canonical": [], "canonicalDetails": [], "confidenceScore": 1, "redFlag": false, "text": "Amazon.com requires discipline and enthusiasm" },
                    "currentStatus": "Worked",
                    "description": "Amazon.com - Remote\nThe work from home customer service associate position with Amazon.com requires discipline and enthusiasm to give customers the best online shopping experience. There was an ongoing commitment to answering inbound calls dealing with sales, customer account fixes, and processing returns and refunds all while practicing 100% customer. Successfully doing so, the ability to maintain performance rates of\n96% and above came effortlessly.\nCashier/ Customer Service",
                    "duration": { "days": 0, "inYears": 0.5, "months": 6, "text": "6 months", "years": 0 },
                    "endDate": { "date": "1", "month": "6", "standard": "2020-06-01", "text": "2020-06-01", "year": "2020" },
                    "jobTitle": { "confidenceScore": 1, "entityID": "5bc70dde5e801c57a520be8c", "jobCategory": "", "jobTitles": [], "jobType": "Premanent", "text": "Customer Service Associate" },
                    "location": { "address": "", "area": "", "city": "", "cityCanonical": "", "country": "", "countryCanonical": "", "countryCode": "", "district": "", "districtCanonical": "", "pin": { "lat": "", "lon": "" }, "postalCode": "", "state": "", "stateCanonical": "", "stateCode": "", "text": "N/A", "tier": "" },
                    "previousGapYears": { "days": 0, "inYears": 0, "months": 0, "years": 0 },
                    "projects": [],
                    "reasonForLeave": "",
                    "skills": [],
                    "startDate": { "date": "1", "month": "12", "standard": "2019-12-01", "text": "2019-12-01", "year": "2019" },
                    "supervisor": { "confidenceScore": 1, "jobTitles": [], "name": "", "text": "" },
                    "workSchedule": ""
                },
                {
                    "company": { "canonical": [], "canonicalDetails": [], "confidenceScore": 1, "redFlag": false, "text": "Walmart" },
                    "currentStatus": "Worked",
                    "description": "As a cashier the main duties performed on a day-to-day basis were providing customers with expeditious, friendly, and efficient shopping experience. Regulating transactions, resolving customer issues and delivering results, as well as maintaining a safe and well put together workstation contributed to the responsibilities of the job title.",
                    "duration": { "days": 0, "inYears": 1.1, "months": 1, "text": "1 years 1 months", "years": 1 },
                    "endDate": { "date": "1", "month": "11", "standard": "2019-11-01", "text": "2019-11-01", "year": "2019" },
                    "jobTitle": { "confidenceScore": 1, "entityID": "", "jobCategory": "", "jobTitles": [], "jobType": "Premanent", "text": "N/A" },
                    "location": { "address": "Loganville, GA", "area": "", "city": "", "cityCanonical": "", "country": "", "countryCanonical": "", "countryCode": "", "district": "", "districtCanonical": "", "pin": { "lat": "", "lon": "" }, "postalCode": "", "state": "", "stateCanonical": "", "stateCode": "", "text": "Loganville, GA", "tier": "" },
                    "previousGapYears": { "days": 0, "inYears": 0, "months": 0, "years": 0 },
                    "projects": [],
                    "reasonForLeave": "",
                    "skills": [],
                    "startDate": { "date": "1", "month": "10", "standard": "2018-10-01", "text": "2018-10-01", "year": "2018" },
                    "supervisor": { "confidenceScore": 1, "jobTitles": [], "name": "", "text": "" },
                    "workSchedule": ""
                },
                {
                    "company": { "text": "TRC Staffing", "redFlag": false, "canonical": "trc staffing", "canonicalDetails": [], "confidenceScore": 1 },
                    "jobTitle": { "text": "warehouse operator", "jobType": "Premanent", "jobCategory": "", "jobTitles": [ { "jobTitle": "warehouse operator", "canonical": [ "warehouse operator" ], "canonicalID": [ "5bc70e0c5e801c57a520d090" ], "canonicalDetails": [], "relations": [] } ], "confidenceScore": 1 },
                    "workSchedule": "",
                    "startDate": { "text": "N/A", "standard": "", "year": "", "month": "", "date": "" },
                    "endDate": { "text": "", "standard": "", "year": "", "month": "", "date": "" },
                    "duration": { "text": "", "inYears": 0, "years": 0, "months": 0, "days": 0 },
                    "projects": [],
                    "currentStatus": "Worked",
                    "location": { "text": "N/A", "tier": "", "address": "", "area": "", "city": "", "district": "", "state": "", "stateCode": "", "country": "", "countryCode": "", "postalCode": "", "pin": { "lat": "", "lon": "" }, "cityCanonical": "", "districtCanonical": "", "stateCanonical": "", "countryCanonical": "" },
                    "description": "• Operated warehouse equipment including forklifts, pallet jacks, and hand trucks to efficiently move and organize inventory.\n• Performed regular inventory checks to ensure accurate stock levels and timely identification of discrepancies.\n• Trained new staff on best practices for warehouse operations, enhancing team efficiency and safety compliance.\n• Utilized warehouse management software to track inventory movement and generate reports for management.\n",
                    "skills": [],
                    "supervisor": { "text": "", "jobTitles": [], "name": "", "confidenceScore": 1 },
                    "previousGapYears": { "years": 0, "months": 0, "days": 0, "inYears": 0 },
                    "reasonForLeave": ""
                }
            ],
            "otherInformation": {
                "references": [],
                "sectionsText": {
                    "personal_details": "Pratik Gaurav\n+91 - 7004029399 pratik.gaurav@maprecruit.ai",
                    "summary": "",
                    "education": "",
                    "experience": "",
                    "certification": "",
                    "others": "",
                    "unknown": ""
                },
                "contextual_derived_skills": [],
                "militaryHistory": [],
                "accomplishments": [],
                "bufferEntities": [],
                "contextualSkills": [],
                "extracurricularActivities": [],
                "declaration": "",
                "curriculumVitae": "",
                "publications": [],
                "additionalInformation": "",
                "fullText": "\nPratik Gaurav\n+91-7004029399 pratik.gaurav@maprecruit.ai",
                "profileSummary": "",
                "industryScores": {
                    "accounting_finance": 15.0851,
                    "administrative_management": 65.3146,
                    "agriculture_horticulture": 0.0398,
                    "airport_aviation": 0.0077,
                    "arts_media": 0.1049,
                    "banking_insurance": 1.4369,
                    "education_training": 0.0101,
                    "energy_mining": 0.0305,
                    "engineering_manufacturing": 1.845,
                    "general_services": 1.4755,
                    "healthcare_medical": 0.1127,
                    "hospitality_tourism": 0.1829,
                    "information_technology": 0.3956,
                    "legal_law": 0.1277,
                    "logistics_warehouse": 8.9419,
                    "pharma_drugs": 0.7331,
                    "sales_marketing": 0.4072,
                    "sports_club": 0.0063,
                    "staffing_hr": 0.4117,
                    "support_service": 3.3307
                },
                "textBySections": [],
                "unusedLines": [],
                "industry": [
                    { "industry_label": "Accounting and Finance", "industry_name": "accounting_finance", "score": 15.0851, "percentage": 18.76 },
                    { "industry_label": "Administration", "industry_name": "administrative_management", "score": 65.3146, "percentage": 81.24 }
                ]
            },
            "metaData": {
                "originalFileName": "",
                "fileExtension": "",
                "timeTaken": 0.05993,
                "version": "6.0.0",
                "wordsCount": 6,
                "linesCount": 3,
                "languageCode": "sl",
                "tablesCount": 0
            },
            "customData": {}
        }
    }
};
