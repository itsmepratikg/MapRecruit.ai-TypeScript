# Changelog - Passkey Authentication & UI Fixes
**Date:** 2026-01-20

## 🚀 New Features
- **Userless Login (Resident Keys):** 
  - Implemented support for "Discoverable Credentials". Users can now log in via Passkey without typing their email address first.
  - Backend `getAuthenticationOptions` now supports requests with empty emails.
  - Backend `verifyLogin` now discovers the user by searching for the `credentialID` across all user records.
- **Login Tracking:** 
  - Passkey logins now correctly increment the `loginCount` and update `lastLoginAt` / `lastActiveAt` timestamps in the database, matching standard login behavior.

## 🐛 Bug Fixes
- **Registration Error ("Cannot destructure property 'id'"):** 
  - Fixed an issue in `verifyRegistration` where the `@simplewebauthn` library response structure was mismatched ( `body` vs `response`).
- **Registration ID Mismatch ("First argument must be..."):** 
  - Corrected the extraction of `credentialID` and `publicKey` from `registrationInfo`, handling both string and Buffer types correctly.
- **Login Options Error ("input.replace is not a function"):** 
  - Fixed a crash in `getAuthenticationOptions` by ensuring `credentialID` is passed as a Base64URL string (not a Buffer) to the library.
- **Verification Error ("Cannot read properties of undefined (reading 'counter')"):** 
  - Fixed a critical naming error in `verifyLogin`. Changed `authenticator` to `credential` in the `verifyAuthenticationResponse` call to match library expectations.
  - Added a default value (`|| 0`) for the passkey counter to handle legacy or migrated keys safely.
- **UI Synchronization:** 
  - Fixed the Passkey Toggle in `AuthSync.tsx` to rely on the *real* User Profile state instead of local storage, ensuring it only shows "Enabled" if a key actually exists in the DB.
  - Added `refetchProfile` logic to `PasskeySettings.tsx` to immediately update the UI after a successful registration.

## 💅 UX Improvements
- **Navigation Cleanup:** 
  - Updated `App.tsx` to force a redirect to `/dashboard` upon successful login.
  - Updated `App.tsx` to redirect to `/` (Root) upon logout, clearing deep links from the URL bar.
- **Passkey Toggle Logic:** The toggle is now properly disabled/enabled based on real-time feedback from the server.
