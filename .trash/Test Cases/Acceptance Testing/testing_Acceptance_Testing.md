
# Acceptance Test Cases (UAT)
**Module:** Business Logic & User Acceptance
**Date:** 2025-05-21

## 1. Candidate Sourcing & Attachment

| ID | Scenario | User Role | Steps | Acceptance Criteria |
|----|----------|-----------|-------|---------------------|
| UAT-01 | Attach Candidate from Source AI | Recruiter | 1. Navigate to **Campaign > Source AI**.<br>2. Search for "Java Developer".<br>3. Select a candidate card.<br>4. Click **"Add to Campaign"**. | Toast message confirms addition. Candidate appears in "Attached Profiles" tab with correct status. |

## 2. Engagement Workflow Execution

| ID | Scenario | User Role | Steps | Acceptance Criteria |
|----|----------|-----------|-------|---------------------|
| UAT-02 | Create Interview Workflow | Admin | 1. Go to **Engage AI**.<br>2. Drag "Screening" node to canvas.<br>3. Connect "Start" to "Screening".<br>4. Save Workflow. | Workflow saves without validation errors. Nodes retain positions upon reload. History stack allows undo/redo. |

## 3. Match Analysis Verification

| ID | Scenario | User Role | Steps | Acceptance Criteria |
|----|----------|-----------|-------|---------------------|
| UAT-03 | Verify Match Score | Hiring Manager | 1. Open **Match AI**.<br>2. Select top candidate.<br>3. Review "Skills Match" section. | Score calculation aligns with Job Description requirements. Missing skills are accurately highlighted in red. |

## 4. Personalization

| ID | Scenario | User Role | Steps | Acceptance Criteria |
|----|----------|-----------|-------|---------------------|
| UAT-04 | Custom Dashboard Layout | User | 1. Go to **My Account > Appearance**.<br>2. Drag "Email Delivery" widget to top row.<br>3. Click **Save Layout**.<br>4. Return to Dashboard. | Dashboard reflects the new layout arrangement. Layout persists after page refresh. |
