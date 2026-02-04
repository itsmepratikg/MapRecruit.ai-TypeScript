# Test Cases: Passkey Authentication System

## 🧪 Test Suite: Passkey Registration & Login (Resident Key Support)

### TC001: Passkey Registration (Standard)
**Pre-condition:** User is logged in via Password. Passkey Toggle is OFF.
**Steps:**
1. Navigate to **My Account** -> **Password & Authentication**.
2. Toggle **Enable Passkey** -> ON.
3. In the modal, click **Add Passkey**.
4. Complete the OS/Browser prompt (Face ID, Touch ID, Windows Hello).
**Expected Result:**
- Success checkmark appears with "Passkey registered successfully!".
- UI immediately updates to show "Registered" (Green Tag).
- Toggle on the main page stays **ON**.

### TC002: Passkey Login (With Email)
**Pre-condition:** User is logged out. Passkey is registered.
**Steps:**
1. Navigate to Login Page.
2. Enter valid Email Address.
3. Click **Sign in via Passkey**.
4. Complete OS prompt.
**Expected Result:**
- User is authenticated successfully.
- User is redirected to `/dashboard`.
- **Database:** `loginCount` increments by 1.

### TC003: Userless Login (Resident Key / Empty Email)
**Pre-condition:** User is logged out. A **Resident Key** (Created after 2026-01-20 fix) exists.
**Steps:**
1. Navigate to Login Page.
2. Leave Email Field **EMPTY**.
3. Click **Sign in via Passkey**.
4. Select the Passkey from the OS/Browser list.
**Expected Result:**
- System identifies the user automatically.
- User is authenticated successfully.
- User is redirected to `/dashboard`.

### TC004: Passkey Toggle State Sync
**Pre-condition:** User has NO passkeys registered.
**Steps:**
1. Navigate to **My Account** -> **Password & Authentication**.
2. Observe Toggle.
3. Toggle ON -> Open Modal -> Cancel/Close without adding.
**Expected Result:**
- Toggle should revert to **OFF** automatically (because no key was actually added).

### TC005: Navigation & Logout Cleanup
**Steps:**
1. Log in.
2. Navigate to a deep link (e.g., `/campaigns/active`).
3. Click **Logout**.
**Expected Result:**
- URL changes to `/`.
- Login screen appears.
- (Verify Login again) -> Application redirects strictly to `/dashboard`, NOT the previous deep link.

### TC006: Server Error Resilience (Counter Fix)
**Pre-condition:** User has a legacy passkey (or manually edited DB entry) with `counter` field missing/null.
**Steps:**
1. Attempt Login via Passkey.
**Expected Result:**
- Login succeeds (Counter defaults to 0).
- No "Cannot read properties of undefined" error in console/network.
