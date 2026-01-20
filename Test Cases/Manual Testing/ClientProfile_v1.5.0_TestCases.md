# Client Profile & Settings Manual Test Cases (v1.5.0)

**Date:** 2026-01-20
**Version:** 1.5.0
**Module:** Settings > Clients

## Overview
These test cases cover the newly implemented Client Profile Editor, including deep linking, sub-page navigation, visual validation for configurations, and system-wide URL standardization.

## Test Scenarios

### 1. Navigation & Routing
| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| TC-001 | Access Client List (Legacy Redirect) | 1. Navigate to URL `/settings/CLIENTS`.<br>2. Observe URL change. | URL should automatically redirect/rewrite to `/settings/clients`. | |
| TC-002 | Access Client List (Direct) | 1. Click "Settings" in sidebar.<br>2. Click "Clients" from the Settings menu. | URL should be `/settings/clients` (lowercase). Client list page loads. | |
| TC-003 | Open Client Profile Editor | 1. From Client List, click "Edit" (pencil icon) on any client row. | 1. URL changes to `/settings/clientprofile/clientinformation/<clientId>`.<br>2. Client Profile Sidebar appears.<br>3. "Client Information" tab is active. | |
| TC-004 | Sidebar Navigation | 1. Click "Settings" tab in the Client Profile Sidebar. | 1. URL changes to `/settings/clientprofile/clientsettings/<clientId>`.<br>2. Main view updates to Client Settings. | |
| TC-005 | Deep Linking | 1. Paste URL `/settings/clientprofile/clientsettings/<valid_id>` into a new tab. | Page loads directly to the Client Settings tab for that specific client. | |

### 2. Client Information Tab
| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| TC-006 | View Mode Display | 1. Open Client Information tab. | All fields (Name, Alias, Code, etc.) are visible but **disabled** (read-only). Icons are correctly positioned without overlap. | |
| TC-007 | Edit Mode Toggle | 1. Click "Edit Details" button. | 1. Fields become enabled (editable).<br>2. Button changes to "Save Changes".<br>3. "Change" overlay appears on Client Logo on hover. | |
| TC-008 | Data Entry | 1. In Edit Mode, modify "Client Name" and "Description".<br>2. Type in "Mobile" field. | Input fields accept text. No console warnings about uncontrolled inputs. | |
| TC-009 | Save Changes | 1. Click "Save Changes". | 1. Toast notification "Client information saved successfully" appears.<br>2. Fields return to read-only mode.<br>3. Updated values are potentially persisted (mock or API). | |

### 3. Client Settings Tab (Configuration)
| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| TC-010 | JD Completeness - Correct Sum | 1. Open Client Settings tab.<br>2. Click "Edit Configuration".<br>3. Set weights: Job Title=25, Skills=25, JD=25, Location=25, others=0. | 1. "Total: 100%" badge appears in Green.<br>2. Success message "Total weightage is correctly set..." is visible. | |
| TC-011 | JD Completeness - Incorrect Sum | 1. Change "Skills" weight to 30 (Total = 105%). | 1. "Total: 105%" badge appears in Red (pulsing).<br>2. Error message "Invalid Configuration... Total weightage must equal exactly 100%" appears. | |
| TC-012 | Save Prevention | 1. Ensure Total weight is NOT 100%.<br>2. Click "Save Configuration". | 1. Save is blocked.<br>2. Error toast "Total JD Completeness weightage must equal 100%" appears.<br>3. Edit mode remains active. | |
| TC-013 | Save Success | 1. Ensure Total weight IS 100%.<br>2. Click "Save Configuration". | 1. Save is successful.<br>2. Success toast appears.<br>3. Mode switches to read-only. | |
| TC-014 | Dark Mode UI | 1. Switch application to Dark Mode.<br>2. Observe "Total" badge in Client Settings. | Badge background should be semi-transparent (e.g., darker emerald/red), text should be legible and not too neon/stark. | |

### 4. General UI/UX
| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| TC-015 | Input Field Styling | 1. Observe input fields with icons (e.g., Dates, Link, Email) in both Read/Edit modes. | Text should not overlap with the icon. Padding should remain consistent. | |
| TC-016 | Sidebar Back Button | 1. In Client Profile, click the top "Back" arrow in the sidebar. | Application navigates back to `/settings/clients` list view. | |

