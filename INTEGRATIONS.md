# Workspace Integrations Strategy

This document outlines the objectives and technical requirements for integrating Google Workspace and Microsoft Office 365 into the MapRecruit ecosystem.

## Core Objectives

### 1. Unified Communications (Google Chat / MS Teams)
- **Goal**: Enable the platform to send real-time notifications directly to user workspaces.
- **Support Chat**: Evolve notification logic to allow two-way communication between the MapRecruit support team and end-users directly within their workspace chat.

### 2. File Management (Google Drive / OneDrive)
- **Resume Sourcing**: Allow users to browse their cloud storage and directly pull resumes/documents into the MapRecruit parsing engine.
- **Workflow**: 
    - User selects "Import from Drive".
    - OAuth permission `drive.file` / `drive.readonly` used to fetch file metadata.
    - File content streamed to backend for parsing and profile creation.

### 3. Calendar Synchronization (Google Calendar / Outlook)
- **Event Harmony**: Automatically sync interview schedules and reminders between MapRecruit and the user's personal/work calendar.
- **Implementation**: 
    - Webhook-based synchronization to detect external changes.
    - Background workers to push MapRecruit events to the cloud calendar.

### 4. Identity & SSO (People API / Microsoft Graph)
- **Seamless Access**: Use Google People API and Microsoft Graph to provide Single Sign-On (SSO) and enrich user profiles with organizational details.

---

## Technical Configuration

### Redirect URIs
- **Development**: `http://localhost:3000/auth/google/callback`
- **Production**: `https://your-app-domain.com/auth/google/callback`

### Required Scopes (Google)
- `openid`, `email`, `profile`: Basic Identity.
- `https://www.googleapis.com/auth/chat.spaces`: Workspace discovery.
- `https://www.googleapis.com/auth/chat.messages`: Sending notifications.
- `https://www.googleapis.com/auth/drive.file`: Accessing resumes for parsing.
- `https://www.googleapis.com/auth/calendar.events`: Bi-directional scheduling.

### Credentials
Stored securely in environment variables:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_PICKER_API_KEY`
