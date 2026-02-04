# Manual Test Cases
**Module:** UI/Interaction
**Date:** 2025-05-20

## 1. Visual Verification

| ID | Element | Action | Check |
|----|---------|--------|-------|
| MT-01 | Sidebar Hover | Hover over "Switch Client" | Tooltip/Popover menu appears smoothly. |
| MT-02 | Profile Card | Hover over Card | "View" button container slides up or opacity changes (as per CSS). |
| MT-03 | Dark Mode | Toggle Dark Mode | Verify text readability on all pages (Dashboard, Settings, Modals). |

## 2. Drag and Drop

| ID | Feature | Action | Check |
|----|---------|--------|-------|
| MT-04 | Dashboard Widgets | Enter Edit Mode -> Drag "Active Campaigns" to row 2 | Widget snaps to grid. Other widgets displace correctly. |
| MT-05 | Workflow Builder | Drag "Welcome Email" node | Node follows mouse cursor. Connections (Bezier curves) update in real-time. |
