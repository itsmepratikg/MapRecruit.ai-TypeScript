
import { 
  FileText, Settings, Link, Mail, Video, MessageSquare, HelpCircle, Megaphone, GitBranch, ListChecks, CheckCircle2, Pilcrow, MoveRight, Film, MapPin, Map, MinusCircle
} from 'lucide-react';
import { Candidate, EngageNode, EngageEdge, Question, Campaign, PanelMember, CampaignActivity } from './types';

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
  createCampaign(200 + i, i % 3 === 0 ? "Machine Operator" : (i % 2 === 0 ? "Cherry Picker Lift Driver" : "Manager of Accounting"), `40000${400 + i}`, "Archived", "AJ", "bg-red-200 text-red-800", i < 5, false, Math.floor(Math.random() * 5), "05/29/2025")
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
