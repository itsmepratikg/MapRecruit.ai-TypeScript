# Implementation Plan: Enforce UserDB Auth & Remove Static Data

## 🎯 Objective
Transition the application from mock-heavy static data (`data.ts`) to a fully dynamic, database-driven system. Specifically, enforce `UserDB`-only authentication and ensure all UI components fetch data from MongoDB via the backend API.

---

## ✅ Completed Tasks

### 1. Unified Authentication
- **UserDB Foundation**: Configured authentication to resolve all users through `UserDB`.
- **SSO Restoration**: Restored Google and Microsoft SSO buttons and underlying logic in `pages/Login/index.tsx`.
- **SSO Synchronization**: Initiated planning for syncing SSO-authenticated users with `UserDB` records (see `SSO_Integration_Discussion.md`).
- **Preference Decoupling**: Refactored `useUserPreferences.ts` to use a local default constant and database-stored settings, removing the import from `data.ts`.

### 2. Live Dashboard Metrics
- **Dynamic Stats API**: Implemented `/api/profiles/stats` and `/api/profiles/folder-metrics` in the backend.
- **Frontend Integration**: Updated `Home.tsx` and `DashboardWidgets.tsx` to fetch real-time profile and campaign counts.

---

## 🛠️ Upcoming Phases

### Phase 1: Profiles & Folders Migration
*   **Goal**: Replace all mock profile listings and folder statistics with database records.
*   **Tasks**:
    - [ ] Create `GET /api/profiles/folders` to fetch custom user folders.
    - [ ] Update `pages/Profiles.tsx` to remove `FOLDERS_LIST` and `MOCK_PROFILES`.
    - [ ] Implement pagination for profile listings to handle real database loads.
    - [ ] Integrate the `personnelStatus` and `employmentStatus` filters directly with MongoDB queries.

### Phase 2: Global Search & Access Control
*   **Goal**: Ensure search results reflect the actual contents of `candidatesDB`.
*   **Tasks**:
    - [ ] Update `components/GlobalSearch.tsx` to call a centralized search API.
    - [ ] Ensure search results respect Tenant Isolation (Company/Client boundaries).
    - [ ] Audit `components/AccessControlModal.tsx` to use permissions from the `Role` model instead of hardcoded levels.

### Phase 3: Campaign & Interview Flows
*   **Goal**: Dynamize deep-linked data for recruitment workflows.
*   **Tasks**:
    - [ ] Transition `pages/Campaign/CampaignExternalRoutes.tsx` to resolve campaign IDs via the backend only.
    - [ ] Map all interview statuses (Rating, Feedback, Status) to the `interviewsDB` collection.
    - [ ] Remove hardcoded "Sample Campaigns" from all sidebar and dropdown menus.

### Phase 4: Final Decommissioning
*   **Goal**: Clean up the codebase and remove legacy artifacts.
*   **Tasks**:
    - [ ] Verify no components import anything from `data.ts`.
    - [ ] Delete `data.ts` and `SchemaData/pratikResume.json`.
    - [ ] Perform a full system regression test to ensure data integrity.

---

## 📈 Success Metrics
- 0 imports of `data.ts` across the entire repository.
- 100% of visible dashboard data matches MongoDB counts.
- Login failure for any user not present in `usersDB`.
