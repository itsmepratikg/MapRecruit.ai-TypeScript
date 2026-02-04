# RBAC "Safe Keeper" Implementation Master Sheet

This document serves as the single source of truth for the RBAC implementation. It includes the progress checklist, documentation reference points, and validation categories.

## 1. Core Infrastructure Checklist
- [x] **Universal Role Schema**: Implementation of `roles` collection with `accessibilitySettings`.
- [x] **Multi-Tenant Resolver**: Backend middleware to derive Company Context from sub-domain/params.
- [x] **Access Guard**: Root-level UI component to block users with zero active clients.
- [x] **Support Hub**: Context-aware support request modal with automated html2canvas screenshots.
- [x] **usePermissions Hook**: Granular permission checker for UI components.
- [x] **SafeKeeper HOC**: Component to enforce read-only/hidden modes on forms.

## 2. Management Interfaces
- [x] **Franchise Management**: CRUD for grouping clients.
- [x] **Admin Company Switcher**: Global maintenance tool for Product Admins.
- [x] **Role Context Editor**: Tool to assign role templates to multiple company tenants.

## 3. Data Integrity & Migration (Seeding Required)
- [ ] **Role Template Seeding**: Populate default "Standard" and "Admin" role structures.
- [ ] **User Role Association**: Link existing users to matching Role Documents.
- [ ] **Company Profile Sync**: Ensure all company documents have valid naming for the Switcher.
- [ ] **Franchise Sample Data**: Create valid relationships between Franchises and Clients.

## 4. Documentation & Reference Points
- [ ] **Technical Walkthrough**: [WALKTHROUGH_RBAC.md](./WALKTHROUGH_RBAC.md)
- [ ] **System Changelog**: [CHANGELOG_RBAC.md](./CHANGELOG_RBAC.md)
- [ ] **Validation Test Cases**: [TEST_CASES_RBAC.md](./TEST_CASES_RBAC.md)
- [ ] **Provisioning Script**: [seed_rbac.js](./backend/seed_rbac.js)

---

## 5. Security Validation Categories (For Testing)
### A. Tenant Isolation
- [ ] Verify User A cannot see Campaign from Company B via direct ID URL.
- [ ] Verify Sub-domain `alpha.maprecruit.ai` correctly loads `Alpha Corp` settings.
- [ ] Verify Localhost `?company_id=...` override works for developers.

### B. Granular RBAC
- [ ] Verify "View-Only" role captures the `<SafeKeeper />` warning banner.
- [ ] Verify "Save" buttons are hidden when `SafeKeeper.Action` is active.
- [ ] Verify unassigned roles do not appear in the "Assign Role" dropdown for a specific company.

### C. Total Lockout
- [ ] Verify a user with `clientID: []` is immediately redirected to the locked support screen.
- [ ] Verify the support request includes a screenshot of the lockout screen.

---
*Created by Antigravity AI on 2026-01-22*
