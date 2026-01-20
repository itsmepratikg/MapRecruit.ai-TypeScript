
# Change Log

All notable changes to the **MapRecruit ATS Dashboard** project will be documented in this file.

## [1.5.0] - 2026-01-20

### Client Profile Management Improvements
- **Client Profile Editor**: Implemented a comprehensive, multi-tabbed editor for Client Profiles, mirroring the User Profile experience.
    - **Nested Routing**: Defined `/settings/clientprofile/:tab/:clientId` structure for deep linking to specific sections.
    - **Sub-pages**:
        - `ClientInformation`: Edit basic details, logo, contact info, and regional settings.
        - `ClientSettings`: Configure advanced settings like Search Access, Job Seeker defaults, and Weekly Schedule.
        - Placeholders added for `Users`, `Custom Fields`, and `Screening Rounds`.
    - **Form Validation**: Added strict validation for "JD Completeness Criteria" to ensure weights sum to exactly 100%.
    - **Real-time Feedback**: Implemented dynamic visual cues (Green/Red badges) for validation states.
    - **UI Enhancements**: Fixed icon/text overlap issues in input fields and refined badge styling for Dark Mode.

### Schema & Data Handling
- **Rich Client Schema**: upgraded `ClientSchema` to support JSX rendering for Logos, Badges, and Status indicators in data tables.
- **Dynamic Fetching**: Updated `useUserProfile` hooks to fetch client data dynamically from the service layer instead of static mock files.
- **Improved Filtering**: Added search and filtering capabilities to the Sidebar Client Flyout menu.

### System-Wide Refactoring
- **Lowercase URL Standardization**: Refactored the entire Settings module routing to strictly enforce lowercase URLs (e.g., `/settings/clients` instead of `/settings/CLIENTS`) for consistency and SEO best practices.
- **Bug Fixes**:
    - Resolved `CalendarDays` icon import errors.
    - Fixed React warnings regarding uncontrolled input components.

## [1.4.0] - 2026-01-19

### Campaign Management & MongoDB Integration
- **Live Data Transition**: Shifted the Campaigns module from mock data to live MongoDB integration using `campaignService`.
- **Sidebar Connectivity**: Updated `Flyouts.tsx` to fetch and group campaigns by client dynamically from the database.
- **Strict Status Filtering**: Implemented robust backend-synced filtering to ensure only "Active" campaigns are displayed in designated sections.
- **UI Consolidation**: Extracted `HoverMenu` into a shared component used across `Flyouts.tsx`, `SchemaCampaignList.tsx`, and `CampaignTable.tsx`.
- **Performance & Reliability**:
  - Implemented loading states for better UX during data fetching.
  - Added robust fallback to mock data in case of API failure.
  - Resolved `net::ERR_CONNECTION_REFUSED` and `ReferenceError` issues.
  - Fixed navigation bugs related to MongoDB ObjectID vs string ID mapping.

## [1.3.0] - 2025-05-22

### Architecture & Scaffolding
- **Module Expansion**: Established folder structure and entry points for 9 major system areas to support future development.
  - **Calendar**: Added views for My Events, Candidate Availability, Upcoming Events, and a Reminder system (Upcoming/Past).
  - **Create Hub**: Centralized creation center for Profiles, Campaigns, Folders, Templates, and Tags (Application/Profile).
  - **Communication**: Added dedicated modules for Messages, Chatbot Configuration, and TalentChat (Unified Inbox).
  - **Notes**: Contextual note-taking system separated by User, Candidate, and Campaign contexts.
  - **Synchronizations**: Configuration hubs for SSO, Calendar, Chat, and Drive integrations.
  - **Utilities**: Added Notifications center and Previous History logs.
- **UI Components**:
  - Implemented reusable `PlaceholderPage` component for consistent "Under Construction" states.
  - Created tabbed navigation wrappers for `Calendar`, `Notes`, `Create`, and `Synchronizations` modules.

## [1.2.0] - 2025-05-21

### Advanced Features & Analytics

#### Campaign Intelligence
- **Network Flow Analysis**: Implemented complex Sankey diagrams using D3.js to visualize candidate drop-off rates across Announcement, Screening, and Interview stages.
- **Interactive Analytics**: Added drill-down capabilities to workflow nodes to view conversion metrics (Sent -> Viewed -> Responded).

#### Account Management
- **Calendar Settings**: 
  - Comprehensive availability configuration including Work Days, Custom Time Slots, and Global Breaks.
  - Holiday management system with type categorization (Holiday, Medical, Personal).
  - Schedule copying utility to replicate hours across multiple days.
- **Communication Preferences**:
  - Integrated **Rich Text Editor** for Email Signatures with HTML tag support.
  - Added configuration for default Sender IDs (Email & SMS) and Auto-Reply logic.

#### Campaign Execution
- **Interview Panel**: Added a split-view "Live Interview" mode featuring:
  - Candidate Resume PDF viewer placeholder.
  - Interactive Scorecard with weighted criteria.
  - Real-time feedback logging.

## [1.1.0] - 2025-05-21

### Major Refactor & New Modules

#### Modular Architecture
- **Campaign Module**: Refactored `CampaignDashboard` into a modular directory structure (`pages/Campaign/`) separating Intelligence, Source AI, Match AI, and Engage AI into dedicated sub-pages.
- **My Account**: Introduced a dedicated User Account management section (`pages/MyAccount`) allowing users to view and edit personal details.

#### New Features
- **Profile Management**: 
  - Added `BasicDetails` component with Edit/Save functionality.
  - Implemented Avatar upload simulation with zoom controls.
  - Added `useUserProfile` hook for centralized user state management with event-driven updates to the Sidebar.
- **Workflow Builder Enhancements**:
  - Added Auto-Layout algorithms (Horizontal/Vertical) for complex graphs.
  - Introduced "Automation Configuration" modal for transition logic.
  - Added undo/redo history stack for workflow editing.
- **Settings**:
  - Added "ReachOut Layouts" configuration page for visual density preferences.
- **Theming**:
  - Enhanced Theme Modal with RGB/Hex pickers and live preview.

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
