# Role Definition & Schema Mapping Analysis

This document analyzes the differences between the four primary role types and details the transformation logic for the "Safe Keeper" RBAC system.

## 1. Role Delta Analysis

| Feature Area | Product Admin (R1) | Client Admin (R2) | TAC / Area Mgr (R3) | Recruiter (R4) |
| :--- | :--- | :--- | :--- | :--- |
| **Override Flag** | `true` | `false` | `false` | `false` |
| **User Management** | Full (Create/Del) | Full (Create/Del) | Full (Create/Del) | **None** (Read-Only) |
| **Company Info** | Full | Full | Full | Full |
| **Themes/Preferences** | Full | Disabled | Disabled | Disabled |
| **Automation/EngageAI** | Full | Full | Partial (No Announce) | **None** (Read-Only) |
| **Metrics** | Full (Client Level) | Full (Client Level) | Full (Client Level) | **Visible only** |

## 2. Transformation Logic (Role Document -> UI State)

To implement the "Safe Keeper" system, we will map the deeply nested nodes using a dotted path notation (e.g., `settings.users.createUser`).

### A. The "Editable" Heuristic
Since the current JSONs do not have an `editable` flag, we will initialize the system with the following logic:
1.  If `createUser`, `updateUser`, `removeUser`, `createClient`, etc., are present, they define the `editable` state for that sub-module.
2.  If only `enabled` and `visible` exist, `editable` defaults to `enabled`.

### B. Path Mapping Table
| Target Module | Visibility Path | Access Path | Editability Path |
| :--- | :--- | :--- | :--- |
| **User List** | `settings.users.visible` | `settings.users.enabled` | `settings.users.createUser` \|\| `updateUser` |
| **Company Profile** | `settings.companyInfo.visible` | `settings.companyInfo.enabled` | `settings.companyInfo.editable` (New) |
| **Campaigns** | `campaigns.visible` | `campaigns.enabled` | `campaigns.createCampaign` |
| **Metrics** | `metrics.visible` | `metrics.enabled` | `metrics.editable` (New) |

## 3. Handling Flexibility (Keys & Defaults)
- **Missing Keys**: If a key is missing in the User's role document, systems MUST default to `false` (Safe-by-Default).
- **Dynamic Nodes**: The UI built at `/settings/roles` should allow adding new keys to the `accessibilitySettings` object, which the backend will persist to the `roles` collection.

## 4. Hierarchy Enforcement
- **CompanyID Check**: A Role object only applies to users within the same `CompanyID`.
- **Inheritance**: (Future) Roles could eventually inherit from "Global Templates" (Product Admin).
