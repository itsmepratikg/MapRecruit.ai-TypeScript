
# Functional Test Cases
**Module:** User Workflows
**Date:** 2025-05-20

## 1. Talent Search

| ID | Flow | Steps | Expected Result |
|----|------|-------|-----------------|
| FT-01 | Basic Keyword Search | 1. Navigate to Profiles<br>2. Enter "Manager" in search bar<br>3. Press Enter | List updates to show only candidates with "Manager" in title/skills. |
| FT-02 | Quick Filter Toggle | 1. Click "Atlanta Only" chip | Filter is active (green). List filters by Location="Atlanta, GA". |
| FT-03 | Advanced Search Modal | 1. Click "Advanced Search"<br>2. Enter "5" in Experience From<br>3. Click Search | Modal closes. Engine filters candidates with >5 years exp. |

## 2. Campaign Management

| ID | Flow | Steps | Expected Result |
|----|------|-------|-----------------|
| FT-04 | View Campaign Details | 1. Click Campaigns nav<br>2. Click a Campaign Row | Navigates to Campaign Dashboard. URL/State updates. |
| FT-05 | Switch Campaign Tabs | 1. Open Campaign<br>2. Click "Engage AI" | View changes to Workflow Builder. |
| FT-06 | Favorite Campaign | 1. Click Heart icon on Campaign row | Icon turns red. Toast notification appears. |
| FT-11 | Configure Automation | 1. Open Engage AI Workflow<br>2. Click a Criteria node<br>3. Toggle "Enable Automation" | Node icon changes. Visual indicator updates. History stack records change. |

## 3. Settings & Account

| ID | Flow | Steps | Expected Result |
|----|------|-------|-----------------|
| FT-07 | Theme Switch | 1. Open User Menu<br>2. Click "Themes"<br>3. Select "Blue" | App primary color variables update to Blue palette immediately. |
| FT-08 | Dark Mode Toggle | 1. Click Moon icon in Sidebar | App background changes to dark slate, text becomes light. |
| FT-09 | Edit Basic Details | 1. Navigate to My Account > Basic Details<br>2. Click Edit<br>3. Change Phone Number<br>4. Click Save | Form exits edit mode. Toast appears. New number persists. |
| FT-10 | Select Layout | 1. Navigate to Settings > ReachOut Layouts<br>2. Click "Compact" | Selection highlights. (Future: Dashboard density changes). |

## 4. Advanced Settings (New)

| ID | Flow | Steps | Expected Result |
|----|------|-------|-----------------|
| FT-12 | Add Holiday | 1. My Account > Calendar<br>2. Enter Name & Date<br>3. Click Add Date | New holiday appears in the list below. |
| FT-13 | Copy Schedule | 1. My Account > Calendar<br>2. Click "Copy to..." on Monday<br>3. Select "Tue, Wed"<br>4. Confirm | Tuesday and Wednesday slots update to match Monday. |
| FT-14 | Update Signature | 1. My Account > Communication<br>2. Edit Rich Text<br>3. Click Bold icon | Text reflects bold formatting. |
| FT-15 | Network Analytics | 1. Engage AI > Click Analytics Icon on Node | Network Graph Modal opens showing Sankey diagram. |

## 5. New Modules (v1.3.0)

| ID | Flow | Steps | Expected Result |
|----|------|-------|-----------------|
| FT-16 | Create Profile | 1. Navigate to **Create** module.<br>2. Verify "Profile" tab is active.<br>3. Check Placeholder content. | "Create Profile" placeholder view is displayed correctly. |
| FT-17 | Tag Management | 1. Navigate to **Create** module.<br>2. Click "Tags" tab.<br>3. Switch between "Application Tags" and "Profile Tags" sub-tabs. | Content area updates to show respective tag management placeholders. |
| FT-18 | Calendar Views | 1. Navigate to **Calendar** module.<br>2. Click "Reminders".<br>3. Click "Past (24h)". | View switches from Upcoming to Past reminders placeholder. |
| FT-19 | Sync Navigation | 1. Navigate to **Synchronizations** module.<br>2. Click "Chat". | View updates to Chat Integration placeholder. |
