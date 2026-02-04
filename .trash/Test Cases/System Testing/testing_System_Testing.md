
# System Test Cases (E2E)
**Module:** Full Application Flow
**Date:** 2025-05-20

## 1. End-to-End Recruitment Flow

| ID | Scenario | Steps | Success Criteria |
|----|----------|-------|------------------|
| ST-01 | Sourcing to Engagement | 1. **Login**: (Simulated) Access Home Dashboard.<br>2. **Campaign**: Navigate to Campaigns, select "Cherry Picker".<br>3. **Source**: Go to Source AI > Attach People. Search for "Warehouse". Add a candidate.<br>4. **Match**: Go to Match AI. Verify candidate appears with calculated match score.<br>5. **Engage**: Go to Engage AI. Create a new "Interview" node in workflow.<br>6. **Exit**: Return to Dashboard. | User completes full flow without errors. Data persists across views. UI remains consistent. |

## 2. Profile Creation Flow

| ID | Scenario | Steps | Success Criteria |
|----|----------|-------|------------------|
| ST-02 | Manual Profile Entry | 1. Click "Create" in Sidebar Footer.<br>2. Select "Manual Entry".<br>3. Fill Name, Email, Title.<br>4. Click "Create Profile". | Modal closes. Toast Success appears. (Future: New profile appears in search list). |

## 3. Personalization Flow

| ID | Scenario | Steps | Success Criteria |
|----|----------|-------|------------------|
| ST-03 | User Account Setup | 1. Open User Menu > My Account.<br>2. Update Avatar and Job Title.<br>3. Go to Appearance > Dashboard Layout.<br>4. Move widgets and Save.<br>5. Refresh Page. | Avatar updates globally. Custom dashboard layout loads correctly after refresh. |

## 4. Admin Configuration Flow (New)

| ID | Scenario | Steps | Success Criteria |
|----|----------|-------|------------------|
| ST-04 | Recruiter Setup | 1. **Calendar**: Set working hours (9-5), add Lunch break (12-1), set Timezone.<br>2. **Comm**: Set Email Signature using Rich Text.<br>3. **Verify**: Navigate to Engage AI > Node Config > Template Preview. | Calendar settings saved without error. Signature persists. Workflow templates render correctly. |

## 5. System Setup Flow (v1.3.0)

| ID | Scenario | Steps | Success Criteria |
|----|----------|-------|------------------|
| ST-05 | New Environment Init | 1. **Sync**: Configure SSO placeholder.<br>2. **Sync**: Check Calendar Sync status.<br>3. **Create**: Define "Profile Tags".<br>4. **Create**: Define "Application Tags".<br>5. **Notes**: Check "User Notes" are empty. | All new placeholder modules load correctly without crashing. Tab navigation works in all new modules. |
