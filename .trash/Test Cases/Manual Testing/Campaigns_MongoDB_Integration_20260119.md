# Test Cases: MongoDB Campaign Integration & UI Refactoring (2026-01-19)

## 1. Sidebar Campaign Integration
| ID | Test Scenario | Expected Result |
|----|---------------|-----------------|
| TC-SIB-01 | Sidebar data source | Sidebar should call `campaignService.getAll()` instead of using mock `SIDEBAR_CAMPAIGN_DATA`. |
| TC-SIB-02 | Client Grouping | Campaigns should be grouped by `migrationMeta.clientName`. If missing, grouped under "General". |
| TC-SIB-03 | Active Count | The "Active Campaigns" badge should reflect the count of campaigns with `status === 'Active'`. |
| TC-SIB-04 | Navigation | Clicking a campaign in the sidebar should navigate to `/campaigns/:mongo_id`. |
| TC-SIB-05 | Loading State | A "Loading..." indicator should appear while fetching data. |

## 2. Status Filtering & Data Accuracy
| ID | Test Scenario | Expected Result |
|----|---------------|-----------------|
| TC-FLT-01 | Strict Active Filter | Only campaigns with `status: 'Active'` (or boolean `true`) should appear in "Active" tab. |
| TC-FLT-02 | Campaign Visibility | The "Warehouse Associate - Voice Bot" campaign should be visible if its `status` is "Active". |
| TC-FLT-03 | Data Persistence | Changes in MongoDB status should be reflected in the UI after a refresh. |

## 3. UI Components & Shared Logic
| ID | Test Scenario | Expected Result |
|----|---------------|-----------------|
| TC-UI-01 | Shared HoverMenu | The HoverMenu should function identically in Sidebar, SchemaCampaignList, and CampaignTable. |
| TC-UI-02 | Submenu Hover | Hovering over "Source AI" or "Engage AI" should reveal submenus without clipping. |
| TC-UI-03 | Quick Actions | Clicking "Intelligence" in HoverMenu should navigate to the campaign dashboard. |

## 4. Resilience & Error Handling
| ID | Test Scenario | Expected Result |
|----|---------------|-----------------|
| TC-ERR-01 | Backend Down Fallback | If the backend is unreachable (`ERR_CONNECTION_REFUSED`), the app should log a warning and fallback to `GLOBAL_CAMPAIGNS`. |
| TC-ERR-02 | Missing Import Fix | Navigation and sidebar should no longer throw `ReferenceError` for missing hooks/services. |
