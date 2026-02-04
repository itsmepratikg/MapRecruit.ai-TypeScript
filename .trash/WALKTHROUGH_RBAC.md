# RBAC System Walkthrough: "The Safe Keeper"

## Overview
The "Safe Keeper" RBAC system is designed for a multi-tenant, enterprise SaaS architecture. It provides isolation between companies, granular control within companies, and a "Total Lockout" safety net.

## 1. How Permissions Flow
1.  **Authentication**: When a user logs in, the backend hydrates their profile. 
2.  **Role Hydration**: The user's `roleID` is resolved to a document in the `roles` collection.
3.  **Accessibility Settings**: This document contains a JSON object called `accessibilitySettings`.
4.  **UI Enforcement**: The `usePermissions` hook reads this JSON. The `SafeKeeper` component uses this hook to disable or hide UI elements.

## 2. Multi-Tenancy Logic (Sub-Domain)
- The app uses a **Tenancy Resolver**.
- On `alpha.maprecruit.ai`, the backend looks up a company with the sub-domain `alpha`.
- All database queries (`Campaigns`, `Profiles`, `Users`) are automatically filtered by this `companyID`. 
- **Developer Mode**: On localhost, use `?company_id=[ID]` to simulate a specific company environment.

## 3. Product Admin Features
- **Global Switcher**: Located in the sidebar footer. Allows Product Admins to jump between any company environment in the system.
- **Franchise Hub**: Allows admins to group multiple clients (Branches/Vendors) under a single Franchise banner for reporting.
- **Centralized Roles**: A single Role document can be assigned to multiple `companyID`s, allowing for system-wide standard roles (like "Standard Recruiter").

## 4. The Lockout Guard
If a user is authenticated but has no active client IDs assigned to them (or their company is suspended), the `AccessGuard` unmounts the dashboard and shows the **Support Protocol** screen. This prevents unauthorized "ghost" access.

## 5. Support Protocol
Users can trigger a support request. The system:
1.  Captures the current URL.
2.  Captures the User ID.
3.  Uses `html2canvas` to take a literal screenshot of whatever the user is currently seeing.
4.  Attaches all of this to the support ticket for rapid debugging.
