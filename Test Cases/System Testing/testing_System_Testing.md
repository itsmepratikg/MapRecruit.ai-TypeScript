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
