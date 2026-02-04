# RBAC Security Test Cases

## Test Suite 1: Multitenancy Isolation
| ID | Procedure | Expected Result |
|---|---|---|
| T1.1 | Login to `alpha.maprecruit.ai`. Try to access `beta.maprecruit.ai/campaign/123` | Redirected to Login or 403 Forbidden. |
| T1.2 | Use `?company_id=VALID_ID` on localhost | UI reflects Company name and data associated with that ID. |
| T1.3 | Use `?company_id=INVALID_ID` on localhost | Backend returns 404 or Error Modal appears. |

## Test Suite 2: Granular UI Control (Safe Keeper)
| ID | Procedure | Expected Result |
|---|---|---|
| T2.1 | Assign "Recruiter" role (No Settings access). Navigate to `/settings`. | AccessGuard or Router should block access or redirect to Dashboard. |
| T2.2 | Assign "View-Only Settings" role. Open Company Information. | Input fields are disabled; "Save Changes" button is hidden; Amber warning banner is visible. |
| T2.3 | Grant "Create User" but deny "Delete User". | "Add User" button is visible; "Trash" icon is hidden in user list. |

## Test Suite 3: Admin & Switcher
| ID | Procedure | Expected Result |
|---|---|---|
| T3.1 | As "Product Admin", use Sidebar Switcher to select "Company B". | Browser reloads; Sidebar "Active Client" list updates to Company B's clients only. |
| T3.2 | As "Standard User", check for Switcher icon. | Switcher icon is NOT visible in the Sidebar. |

## Test Suite 4: Safety & Support
| ID | Procedure | Expected Result |
|---|---|---|
| T4.1 | Manually clear `clientID` array in User DB. | Dashboard unmounts; "Restricted Access" screen appears. |
| T4.2 | Click "Request Support" from lockout screen. | Screenshot is taken; Modal opens with TinyMCE editor; screenshot is previewed. |
