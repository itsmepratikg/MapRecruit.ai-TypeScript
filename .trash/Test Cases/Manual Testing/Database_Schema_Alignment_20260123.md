# Test Cases: Database Schema Alignment & Persistence

This document outlines the test cases for verifying the alignment of the database schema with the UI and the implementation of persistent user context and dynamic branding.

## 1. Authentication & Context Switching

### TC-1.1: Multi-Company Selection Persistence
- **Prerequisite**: User has access to at least two companies (e.g., TRC and Spherion).
- **Steps**:
    1. Log in to the application.
    2. Switch to "TRC" company.
    3. Select a specific client for TRC.
    4. Switch to "Spherion" company.
    5. Switch back to "TRC" company.
- **Expected Result**: The application should automatically restore the client previously selected for "TRC" (verifying `lastActiveClients` persistence).

### TC-1.2: Strict Client Filtering
- **Prerequisite**: User belongs to multiple companies but some clients specifically belong to only one.
- **Steps**:
    1. Log in and switch to Company A.
    2. Open the Client Selector.
    3. Verify only clients belonging to Company A are visible.
    4. Manually try to access a URL with Company A's ID but a Client ID from Company B (if possible via URL).
- **Expected Result**: Backend should reject or filter out non-matching clients, and the UI should only show contextually valid clients.

### TC-1.3: Product Admin Bypass
- **Prerequisite**: User has `productAdmin: true` in their database record.
- **Steps**:
    1. Log in as a Product Admin.
    2. Attempt to switch to a company where the user might not have explicit "User-Company" mapping (if applicable).
- **Expected Result**: AccessGuard should allow access based on the `productAdmin` flag.

## 2. Dynamic Branding & UI

### TC-2.1: Primary Company Branding
- **Prerequisite**: Company record has `companyLogo`, `companyMinifiedLogo`, and `themeVariables.mainColor` defined.
- **Steps**:
    1. Switch to the branded company.
    2. Verify the Header Logo matches `companyLogo`.
    3. Verify the Favicon/Sidebar Mini Logo matches `companyMinifiedLogo`.
    4. Verify the primary theme color (buttons, active states) matches `mainColor`.
- **Expected Result**: UI looks consistent with the company's branding assets.

### TC-2.2: Fallback Branding (Initials)
- **Prerequisite**: Company record has NO logo assets.
- **Steps**:
    1. Switch to a company without logos.
- **Expected Result**:
    - Header shows company initials (e.g., "TR" for TRC).
    - Background color is the fallback Blue (`bg-blue-600` / `#3b82f6`).
    - Sidebar shows a minified version of the initials fallback.

### TC-2.3: Theme Variable Injection
- **Steps**:
    1. Inspect the `:root` or document style of the app.
    2. Verify `--primary-color` and associated variables are updated when switching companies.

## 3. Franchise Model Integration

### TC-3.1: Franchise Preview in Settings
- **Prerequisite**: Company is marked as `franchise: true` and has linked `franchiseID` ObjectIDs.
- **Steps**:
    1. Navigate to **Settings > Company Info**.
    2. Verify the "Franchise Information" section is visible.
    3. Verify that the names of the associated franchises are correctly populated from the `franchises` collection.

### TC-3.2: Franchise Flag Toggle
- **Steps**:
    1. Change a company's `franchise` flag to `false`.
    2. Refresh the Settings page.
- **Expected Result**: The Franchise Preview section should disappear.

## 4. Migration & Initialization

### TC-4.1: User currentCompanyID Initialization
- **Steps**:
    1. Check any user record in the database.
- **Expected Result**: `currentCompanyID` should be populated (initialized to `companyID` if it was null).
