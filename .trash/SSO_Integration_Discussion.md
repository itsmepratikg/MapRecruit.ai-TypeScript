# Discussion: SSO Integration & UserDB Synchronization

## 🎯 High-Level Goal
Enable multi-modal authentication (Email/Password, Passkeys, Google SSO, Microsoft SSO) while ensuring all authenticated users resolve to a valid record in the `UserDB` (MongoDB `users` collection).

## 🚀 Workflow & Policy (Invite Only)

### 1. Unified Authentication Check
Regardless of the login method (Password, Passkey, SSO), the backend will first verify the user's existence and status in `UserDB`:
- **Identity Matching**: Map the provider identity (Email) to the `UserDB` record.
- **Status Check**: Ensure the user record is `active: true`.

### 2. Error States & Actions
| Scenario | Outcome | Action |
| :--- | :--- | :--- |
| **User NOT in DB** | Access Denied | Show Toast: "Account not found. Please contact your support team." |
| **User is Inactive** | Access Denied | Redirect/Open Support Request Page to resolve account status. |
| **Auth Failure (Valid User)** | Access Denied | Redirect/Open Support Request Page. |

## 🛠️ Implementation Tasks

### Frontend
- **Support Redirection**: Implement logic to navigate to `/support` (or similar) when a valid but inactive/blocked user attempts login.
- **SSO Backend Sync**: Ensure the frontend sends SSO tokens to the backend for verification against `UserDB` instead of auto-logging in.

### Backend
- **Strict Lookup**: The SSO verify endpoint must return a `404` (Not Found) or `403` (Inactive) based on the database check, not just the provider's token validity.
- **Provisioning**: ❌ Disabled. No user records will be created during the login flow.

---

## ✅ Decisions Reached
- **Provisioning**: None (Invite-only).
- **Linking**: Automated by email match.
- **Support**: Integrated directly into the auth failure UX.
