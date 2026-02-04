# ChangeLOG - Multi-Tenant Schema Standardization

All changes below were implemented to align the database with the multi-tenant architecture (Scenario A: Hierarchical vs Scenario B: Flat).


## [Security Fixes] - 2026-01-29
### Security
- **NoSQL Injection**: Secured `authController`, `userController`, `campaignController`, and `profileController` by sanitizing inputs (CWE-943).
- **Information Disclosure**: Removed stack traces from 500 error responses in `userController` (CWE-209).
- **Hardcoded Credentials**: Replaced hardcoded credentials in test and debug scripts with environment variables (CWE-798).
- **Verification**: Added `verify_fixes.js` for testing login vulnerabilities.

## [v2.0.0] - 2026-01-27

### Added
- **Multi-Company Access**: Implemented `AccessibleCompanyID` array in `usersDB` to support cross-tenant authenticated switching.
- **Hierarchical Support (Spherion)**: Created/Standardized Spherion Company (`6181...`), Client (`693c...`), and Franchise (`693c...`) with proper parent-child linkages.
- **Flat Structure Support (TRC)**: Standardized TRC Company (`6112...`) and Client (`6112...`) with `productSettings.franchise: false`.
- **Franchise = Owning Entity**: Formally established the equivalence of Franchise and Owning Entity in the data model.

### Changed
- **ID Type Standardization**: Converted all ID strings (`companyID`, `clientID`, `franchiseID`, `roleID`) across `usersDB`, `clientsdb`, `franchises`, and `roles` to strict MongoDB **`ObjectId`**.
- **Field Normalization**: Renamed `clients` to **`clientID`** (Array of ObjectIDs) in the User collection.
- **Role Scoping**: Updated the "Product Admin" role to include a `companyID` array, linking permissions strictly to authorized tenants.
- **Client Naming**: Set `clientName` as the immutable source of truth for client identity (distinguishing from Product name).

### UI & Alignment (Sidebar Footer)
- **Bottom-Up Anchoring**: Re-engineered flyout positioning to anchor from the bottom, preventing viewport overflow in the sidebar footer.
- **Ultra-Stable Hover**: Widened the mouse-hover bridge to 24px and removed shifting animations for seamless menu transitions.
- **Dynamic Auto-Height**: Optimized flyouts to adapt their height to content, removing unnecessary vertical expansion.
- **Candidate Profile Polish**: Enhanced header with mesh gradients and contextual branch-level badges.

### Security & Access Control
- **Scope Validation**: Integrated a mandatory rule to fetch current company/client context dynamically from MongoDB for every session validation.
- **Access Scoping**: Validated cross-tenant visibility based on `AccessibleCompanyID` and `clientID` arrays.
- **Database Standardization**: Completed the migration of `InterviewsDB` and `owningentities` to strict `ObjectId` blueprint.

---
*Created by Antigravity AI*
