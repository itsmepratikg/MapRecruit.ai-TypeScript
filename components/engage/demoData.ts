
import { EngageNode, EngageEdge } from '../../types';

// Coordinates calibrated for: Card Center Y = 380.
// Card Y = 300. Start Y = 348. Bubble Y = 360.
// Horizontal Spacing: Card (280) + Gap (80) + Bubble (40) + Gap (80) = Next Card.
export const INITIAL_NODES_GRAPH: EngageNode[] = [
  // 1. Start & Welcome 
  { 
    id: 'start', type: 'START', title: 'Start Workflow', x: 50, y: 348, 
    data: { desc: "Candidate Applied", config: { enabled: true } } 
  },
  { 
    id: '1', type: 'ANNOUNCEMENT', title: 'Welcome Email', x: 400, y: 300, 
    data: { desc: "Automated greeting", stats: { scheduled: 120, viewed: 45 } } 
  },
  
  // 2. Gateway to Screening (Automated)
  {
    id: 'c1', type: 'CRITERIA', title: 'Default', x: 780, y: 360,
    data: { desc: "Always Run", config: { enabled: true }, label: "Default" } 
  },
  { 
    id: '2', type: 'SCREENING', title: 'Basic Screening', x: 920, y: 300, 
    data: { desc: "Basic qualifications", stats: { scheduled: 80, responded: 65 } } 
  },

  // 3. Gateway to Skill Check
  {
    id: 'c2', type: 'CRITERIA', title: 'Add Logic', x: 1300, y: 360,
    data: { desc: "Configure", config: { enabled: false } } // Grey/Plus
  },
  { 
    id: '3', type: 'SCREENING', title: 'Skill Check', x: 1440, y: 300, 
    data: { desc: "Branch by Tech Stack", stats: { scheduled: 75, responded: 70 } } 
  },

  // 4. Split Branches
  // React Branch
  {
    id: 'c_react', type: 'CRITERIA', title: 'React', x: 1820, y: 160,
    data: { desc: "Skill == React", config: { enabled: true }, label: "React" } 
  },
  { 
    id: '4a', type: 'SCREENING', title: 'React Quiz', x: 1960, y: 100, 
    data: { desc: "Component lifecycle", stats: { scheduled: 25, responded: 20 } } 
  },

  // Angular Branch
  {
    id: 'c_angular', type: 'CRITERIA', title: 'Angular', x: 1820, y: 360,
    data: { desc: "Skill == Angular", config: { enabled: true }, label: "Angular" } 
  },
  { 
    id: '4b', type: 'SURVEY', title: 'Feedback Survey', x: 1960, y: 300, 
    data: { desc: "Candidate Experience", stats: { scheduled: 30, responded: 12 } } 
  },

  // Vue Branch
  {
    id: 'c_vue', type: 'CRITERIA', title: 'Vue.js', x: 1820, y: 560,
    data: { desc: "Skill == Vue.js", config: { enabled: true }, label: "Vue.js" } 
  },
  { 
    id: '4c', type: 'SCREENING', title: 'Vue.js Quiz', x: 1960, y: 500, 
    data: { desc: "Vuex & Directives", stats: { scheduled: 15, responded: 14 } } 
  },

  // 5. Connectors to Interviews (Added Automation Bubbles)
  {
    id: 'c_4a_5a', type: 'CRITERIA', title: 'Pass', x: 2340, y: 160,
    data: { desc: "Score > 70", config: { enabled: false } } 
  },
  {
    id: 'c_4c_5a', type: 'CRITERIA', title: 'Pass', x: 2340, y: 360, 
    data: { desc: "Score > 70", config: { enabled: false } } 
  },
  {
    id: 'c_4b_5b', type: 'CRITERIA', title: 'Complete', x: 2340, y: 460, 
    data: { desc: "Completed", config: { enabled: false } } 
  },

  // 6. Interviews
  { 
    id: '5a', type: 'INTERVIEW', title: 'Modern FE Interview', x: 2480, y: 250, 
    data: { desc: "React & Vue Candidates", meetType: ['Video'], stats: { scheduled: 15, booked: 10 } } 
  },
  { 
    id: '5b', type: 'INTERVIEW', title: 'Enterprise FE Interview', x: 2480, y: 450, 
    data: { desc: "Angular Candidates", meetType: ['In-Person'], stats: { scheduled: 5, booked: 2 } } 
  },
];

export const INITIAL_EDGES_GRAPH: EngageEdge[] = [
  { from: 'start', to: '1' },
  { from: '1', to: 'c1' },
  { from: 'c1', to: '2' },
  { from: '2', to: 'c2' },
  { from: 'c2', to: '3' },
  { from: '3', to: 'c_react' },
  { from: 'c_react', to: '4a' },
  { from: '3', to: 'c_angular' },
  { from: 'c_angular', to: '4b' },
  { from: '3', to: 'c_vue' },
  { from: 'c_vue', to: '4c' },
  // Routes through new criteria bubbles
  { from: '4a', to: 'c_4a_5a' },
  { from: 'c_4a_5a', to: '5a' },
  { from: '4c', to: 'c_4c_5a' },
  { from: 'c_4c_5a', to: '5a' },
  { from: '4b', to: 'c_4b_5b' },
  { from: 'c_4b_5b', to: '5b' },
];
