# Functional Test Cases
**Module:** User Workflows
**Date:** 2025-05-20

## 1. Talent Search

| ID | Flow | Steps | Expected Result |
|----|------|-------|-----------------|
| FT-01 | Basic Keyword Search | 1. Navigate to Profiles<br>2. Enter "Manager" in search bar<br>3. Press Enter | List updates to show only candidates with "Manager" in title/skills. |
| FT-02 | Quick Filter Toggle | 1. Click "Atlanta Only" chip | Filter is active (green). List filters by Location="Atlanta, GA". |
| FT-03 | Advanced Search Modal | 1. Click "Advanced Search"<br>2. Enter "5" in Experience From<br>3. Click Search | Modal closes. Engine filters candidates with >5 years exp. |

## 2. Campaign Management

| ID | Flow | Steps | Expected Result |
|----|------|-------|-----------------|
| FT-04 | View Campaign Details | 1. Click Campaigns nav<br>2. Click a Campaign Row | Navigates to Campaign Dashboard. URL/State updates. |
| FT-05 | Switch Campaign Tabs | 1. Open Campaign<br>2. Click "Engage AI" | View changes to Workflow Builder. |
| FT-06 | Favorite Campaign | 1. Click Heart icon on Campaign row | Icon turns red. Toast notification appears. |

## 3. Settings

| ID | Flow | Steps | Expected Result |
|----|------|-------|-----------------|
| FT-07 | Theme Switch | 1. Open User Menu<br>2. Click "Themes"<br>3. Select "Blue" | App primary color variables update to Blue palette immediately. |
| FT-08 | Dark Mode Toggle | 1. Click Moon icon in Sidebar | App background changes to dark slate, text becomes light. |
