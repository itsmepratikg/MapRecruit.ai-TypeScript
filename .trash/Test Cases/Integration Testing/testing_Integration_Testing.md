
# Integration Test Cases
**Module:** Module Interactions
**Date:** 2025-05-20

## 1. Search & Profile Integration

| ID | Scenario | Pre-Condition | Steps | Expected Result |
|----|----------|---------------|-------|-----------------|
| IT-01 | Navigate to Profile from Search | Search Results populated | 1. Click "View" on a Profile Card | `selectedCandidateId` state updates. `CandidateProfile` component renders with correct ID data. |
| IT-02 | Back Navigation | Viewing Profile | 1. Click "Back to Search" | View returns to `Profiles` list. Previous search state/filters are preserved. |

## 2. Campaign & Sub-modules

| ID | Scenario | Pre-Condition | Steps | Expected Result |
|----|----------|---------------|-------|-----------------|
| IT-03 | Engage AI Workflow Data | Campaign Selected | 1. Navigate to Engage AI<br>2. Modify Workflow nodes | Changes persist in memory when switching tabs (e.g., to Match AI and back). |
| IT-04 | Source AI to Campaign | In Source AI Search | 1. Click "Add to Campaign" on candidate | Toast success message. (Future: Candidate appears in Attached Profiles list). |

## 3. Dashboard Widgets

| ID | Scenario | Pre-Condition | Steps | Expected Result |
|----|----------|---------------|-------|-----------------|
| IT-05 | GridStack Layout | Dashboard Loaded | 1. Click "Edit Dashboard"<br>2. Resize Widget 1 | Other widgets reflow correctly. Layout state is saved on "Save Layout". |

## 4. User State Integration

| ID | Scenario | Pre-Condition | Steps | Expected Result |
|----|----------|---------------|-------|-----------------|
| IT-06 | Profile to Sidebar Sync | Editing My Account | 1. Update First Name in Basic Details<br>2. Click Save | Sidebar User Avatar/Name updates immediately without reload. |
| IT-07 | Theme Persistence | Dashboard | 1. Change Theme in Modal<br>2. Refresh Page | Theme choice persists (read from LocalStorage). |

## 5. Analytics Integration (New)

| ID | Scenario | Pre-Condition | Steps | Expected Result |
|----|----------|---------------|-------|-----------------|
| IT-08 | Workflow to Graph | In Workflow Builder | 1. Click 'Network' icon on an 'Interview' node | Modal opens with `initialRoundType='Interview'`. Sankey displays Interview-specific mock data. |
| IT-09 | Calendar to Timezone | In Calendar Settings | 1. Change Timezone dropdown | `config` state updates. (Future: System timestamps convert to this zone). |

## 6. Routing Integration (v1.3.0)

| ID | Scenario | Pre-Condition | Steps | Expected Result |
|----|----------|---------------|-------|-----------------|
| IT-10 | Sidebar to Create Module | Dashboard | 1. (Hypothetical) Click "Create" Link in Sidebar | `CreateModule` loads with default "Profile" tab active. |
| IT-11 | Sidebar to Sync Module | Dashboard | 1. (Hypothetical) Click "Sync" Link in Sidebar | `SynchronizationsModule` loads with default "SSO" tab active. |
