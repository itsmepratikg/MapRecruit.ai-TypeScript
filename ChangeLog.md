# Change Log

All notable changes to the **MapRecruit ATS Dashboard** project will be documented in this file.

## [1.0.0] - 2025-05-20

### Initial Release

#### Core Features
- **Comprehensive Dashboard**: Implemented a customizable home dashboard using `GridStack.js` for draggable widgets, including Trend Graphs, Source Distribution charts, and real-time metric cards.
- **Navigation Structure**: Added a responsive sidebar with collapsible states and mobile overlay support.

#### Module: Campaigns
- **Intelligence Hub**: Added Overview widgets for Team Notes, Reminders, and Panel Members. Included Sourcing Efficiency and Pipeline Health charts.
- **Source AI**:
  - Integrated `TalentSearchEngine` for finding candidates to attach to campaigns.
  - Added "Attached Profiles" table view.
  - Created placeholders for Integrations and Job Description management.
- **Match AI**:
  - Implemented Candidate Ranking list with visual match scores.
  - Added "Match Summary" with skills gap analysis.
  - Integrated Radar Charts for attribute comparison vs job requirements.
- **Engage AI**:
  - Developed a visual **Workflow Builder** for designing recruitment flows (Announcements, Screening, Interviews).
  - Added Node Configuration modals for setting up automation rules and templates.
  - Implemented **Interview Panel** for scoring candidates during live interviews.

#### Module: Talent Search
- **Advanced Search**: Built a modal for granular filtering (Location radius, boolean search, pay rates).
- **AI Assistant**: Integrated a chat interface in the search sidebar to refine results via natural language.
- **Profile View**: Created a detailed candidate profile view showing Resume, Activity Logs, and linked Campaigns.

#### UI/UX & System
- **Theming**: Implemented a global Theme Switcher (Emerald, Blue, Purple, etc.) and full **Dark Mode** support using Tailwind CSS.
- **Responsive Design**: Ensured full compatibility with Desktop, Tablet, and Mobile viewports.
- **Mock Data**: Populated the application with extensive mock data for candidates, campaigns, and metrics to demonstrate full functionality.

#### Testing
- Added comprehensive test case documentation structure under `Test Cases/` covering Unit, Functional, Integration, and System testing.
