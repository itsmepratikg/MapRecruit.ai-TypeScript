# RBAC System Changelog

## [1.0.0] - 2026-01-22

### Added
- **Backend Components**:
    - `Role` and `Franchise` models (Mongoose).
    - `tenantMiddleware` for sub-domain and query-param company resolution.
    - Updated `authController` with Role management and Impersonation.
    - Updated `companyController` with Franchise CRUD and Company Listing.
- **Frontend Security**:
    - `AccessGuard.tsx`: Root-level lockout component.
    - `SafeKeeper.tsx`: Form and Action protection component.
    - `SupportRequestModal.tsx`: Rich-text support hub with screenshot capability.
    - `usePermissions.ts`: Central hook for granular UI control.
- **UI Components**:
    - `Franchise.tsx`: Settings page for franchise management.
    - `CompanySwitcherContent`: Admin tool for switching company context.
    - Modified `SidebarFooter` to include Admin and Support actions.
    - Modified `RolesPermissions` to support live backend sync and multi-tenant assignment.

### Changed
- Refactored `App.tsx` return tree to be wrapped in a security perimeter (`AccessGuard` and `ImpersonationProvider`).
- Updated `useUserProfile.ts` hook to poll `/auth/me` with ETag support for live permission updates.
- Deprecated string-based user roles in favor of `roleID` object mapping.

### Fixed
- Fixed context leakage where users could theoretically access cross-company documents via direct URL.
- Fixed inconsistent client grouping in the sidebar by introducing the `Franchise` model logic.
