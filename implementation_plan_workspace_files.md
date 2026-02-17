# Implementation Plan: Workspace File Integration (Google Drive, OneDrive, SharePoint)

## 1. Overview
The goal is to enable users to import resumes/profiles directly from their connected cloud storage (Google Drive, Microsoft OneDrive, and SharePoint). The system will use native file pickers for selection and the backend will securely download these files for parsing and profile creation.

## 2. Frontend Implementation

### 2.1 UI Updates (`CreateProfileModal.tsx`)
- **Combined/New Buttons**: Add a "OneDrive / SharePoint" button alongside the existing "Google Drive" button.
- **Access Control logic**:
    - Before opening any picker, check if the corresponding workspace is connected via `integrationService.getStatus()`.
    - If not connected, show a high-visibility alert (using a modal or toast) instructing the user to sign in to their Workspace first.
- **Native Picker Integration**:
    - **Google Drive**: Use Google Picker API (already partially implemented).
    - **OneDrive/SharePoint**: Integrate **Microsoft File Picker v8 SDK**. This opens a secure popup for file selection from OneDrive or SharePoint Document Libraries.

### 2.2 Integration Service Updates (`services/integrationService.ts`)
- Implement `getMicrosoftPickerToken()` to fetch the Graph API access token.
- Implement `fetchMicrosoftFile(resourceId: string, siteId?: string)` to trigger the backend download from OneDrive/SharePoint.
- Implement `connectMicrosoft()` to handle the OAuth redirect for Outlook/Office 365.

### 2.3 Microsoft File Picker v8 SDK Setup
- Load the script: `https://js.live.net/v7.2/OneDrive.js` (or newer v8 equivalent).
- Configuration items: `clientId`, `action: 'download'`, `multiSelect: false`, `advanced: { endpointHint: 'path/to/tenant' }`.

## 3. Backend Implementation

### 3.1 Routing (`routes/integrationRoutes.js`)
- Add routes:
    - `POST /microsoft/callback`: Handle Microsoft OAuth callback.
    - `GET /tokens/microsoft`: Get/refresh Graph API tokens.
    - `POST /microsoft/drive/fetch`: Initiate file transfer from OneDrive/SharePoint.

### 3.2 Controller Logic (`controllers/integrationController.js`)
- **Microsoft Authentication**:
    - Use MSAL (Microsoft Authentication Library) or direct Fetch to exchange code for tokens.
    - Store `access_token`, `refresh_token`, and `expiry_date` in the User model.
- **File Transfer (SharePoint/OneDrive)**:
    - Small Files (< 4MB): Direct GET to `https://graph.microsoft.com/v1.0/sites/{site-id}/drive/items/{item-id}/content`.
    - Large Files: Request the `@microsoft.graph.downloadUrl` and stream the file to the server.
- **File Transfer (Google Drive)**:
    - Use `https://www.googleapis.com/drive/v3/files/{fileId}?alt=media`.

### 3.3 Server-Side File Processing
- Download the file into a temporary buffer/storage.
- Pass the file buffer to the Resume Parsing engine (currently simulated).
- Cleanup temporary files after parsing.

## 4. Security
- **Scoped Permissions**: Use `Files.Read` for OneDrive and `Sites.Read.All` for SharePoint.
- **Token Management**: Ensure refresh tokens are handled securely to maintain connectivity without frequent re-auth.
- **Validation**: Verify that the selected file type is supported (PDF, DOCX) before attempting to download.

## 5. Next Steps
1.  **Phase 1**: Update `CreateProfileModal` UI and add the connection check alert.
2.  **Phase 2**: Implement Microsoft OAuth flow in backend/frontend.
3.  **Phase 3**: Integrate Microsoft File Picker v8 on the frontend.
4.  **Phase 4**: Implement backend download and parsing logic for both Google and Microsoft.
