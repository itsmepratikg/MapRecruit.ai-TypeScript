# Roadmap: Phased RBAC Implementation ("Safe Keeper")

This document outlines the step-by-step technical execution of the RBAC system, prioritized by system criticality.

---

## Phase 1: Data Integrity & Foundation (Critical)
*Goal: Establish the database structures that will enforce security across the app.*

1.  **Centralized Role Schema**:
    *   Initialize the `roles` collection.
    *   Include `currentCompanyID` and `companyID[]` for multi-tenant isolation.
    *   Embed the granular `accessibilitySettings` structure found in Role JSONs.
2.  **User-Role Association**:
    *   Migration: Add `roleID` (ObjectId) to User documents.
    *   Cleanup: Deprecate old string-based role fields.
3.  **Franchise Module**:
    *   Create the `franchises` collection (`franchiseName`, `clientIDs[]`).
    *   Update Client schema to include `franchiseID`.

## Phase 2: Security Guards & Multi-Tenancy (High)
*Goal: Ensure users are strictly isolated by sub-domain and company boundaries.*

1.  **Sub-Domain Resolver**:
    *   Implement backend middleware to derive `CompanyID` from the incoming request host.
    *   **Local DEV Support**: Add a fallback for `localhost` / `127.0.0.1`. If no sub-domain is detected, allow simulation via query parameter (e.g., `?company_id=...`) or a `Config.DEVELOPMENT_TENANT_ID` environment variable.
    *   Validate URL-subdomain against the Company document registry.
2.  **Cross-Tenant Shields**:
    *   **404 Guard**: Intercept document requests (Campaigns/Profiles). If the document's `companyID` ≠ caller's `currentCompanyID`, return a 404 status.
    *   **Client Switcher**: Implement the popup logic for inter-client navigation within the same company. Force a hard refresh (`window.location.reload`) on switch and update role context.
3.  **Role Filtering**:
    *   Update authentication logic to only load roles where the user's `CompanyID` is present in the role's `companyID[]` array.

## Phase 4: Total Lockout & Support Protocol (Medium)
*Goal: Handle edge cases where users have no permissions or need help.*

1.  **Global Lockout Logic**:
    *   Implement a root-level guard. If `User.clientID[]` is empty or all are disabled, unmount the entire dashboard.
2.  **Support Request Feature**:
    *   Develop the Support Dialog (using TinyMCE).
    *   Automate context gathering: Pre-fill User ID and Current URL.
    *   Automate screenshot capture: Use a library (e.g., `html2canvas`) to snap the UI and embed it into the email body automatically.

## Phase 5: Setting the Settings (Standard)
*Goal: Build the interfaces for Managing the new structures.*

1.  **Franchise Settings Page**: New CRUD interface for Franchise management.
2.  **Product Admin Switcher**: The "Company Switcher" interface for global maintenance.
3.  **Role Context Management**: UI for the "Central Collection" of roles—allowing an admin to assign a single role template to multiple companies.

## Phase 6: UI Propagation & "Safe Keeper" Mode (Optimization)
*Goal: Distribute permissions across all existing modules.*

1.  **`usePermissions` Hook**: A React hook for checking visibility/editability at the component level.
2.  **Safe Keeper Form Mode**:
    *   Create a wrapper for standard forms that automatically toggles all inputs to `disabled={!canEdit}`.
    *   Ensure "Save" and "Delete" actions are hidden or rendered as "Permission Required" tooltips.

---
**Next Step**: Review this Roadmap and verify priorities before starting Phase 1 (Backend Roles).
