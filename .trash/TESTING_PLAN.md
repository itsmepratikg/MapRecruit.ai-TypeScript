
# Testing Plan - Post-Stabilization (Phase 5)

## 1. Workflow Builder (Engage AI)
**Objective**: Verify that the workflow builder loads without crashing and saves correctly.
- [ ] **TC-001**: Navigate to **Campaigns > Engage AI**.
- [ ] **TC-002**: Verify that the default workflow graph loads (no "500 Internal Server Error" toast).
- [ ] **TC-003**: Click on a node (e.g., "Screening") and verify the side panel opens.
- [ ] **TC-004**: Click "Save Workflow". Refresh the page and confirm changes persist (or default view loads if using mock data fallback).

## 2. Campaign Dashboard
**Objective**: Verify header rendering and data stability.
- [ ] **TC-005**: Open any Campaign details page.
- [ ] **TC-006**: Check the **Campaign Header**. Verify member avatars (circles) render correctly without crashing the page.
- [ ] **TC-007**: Scroll down the page and verify the header collapses/sticks to the top correctly.

## 3. Candidate Search (Source AI)
**Objective**: Verify filters and imports are working.
- [ ] **TC-008**: Navigate to **Campaigns > Source AI > Attach > Search**.
- [ ] **TC-009**: Verify "Quick Filters" (e.g., "Immediate Start", "Atlanta Only") appear and are clickable.
- [ ] **TC-010**: Click on a "Quick Filter". Verify that the search results update (or at least the filter tag appears).

## 4. Profile Access (Data Patch Verification)
**Objective**: Verify access to specific patched profiles.
- [ ] **TC-011**: Navigate to Profile ID: `69774e95cf3020c9148d7622` (via URL: `/profiles/view/69774e95cf3020c9148d7622`).
- [ ] **TC-012**: Verify that the profile loads successfully and does not show a "403 Forbidden" or "404 Not Found" error (confirming the `companyID` patch worked).

## 5. System Health
- [ ] **TC-013**: Check the **Browser Console** (F12). Confirm there are no red errors (ignore harmless yellow warnings).
- [ ] **TC-014**: Navigate between main tabs (Dashboard, campaigns, Profiles) to ensure no navigation loops occur.
