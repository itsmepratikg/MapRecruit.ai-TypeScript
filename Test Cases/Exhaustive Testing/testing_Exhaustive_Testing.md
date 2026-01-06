# Exhaustive Test Cases
**Module:** Edge Cases
**Date:** 2025-05-20

## 1. Input Validation

| ID | Field | Input | Expected Result |
|----|-------|-------|-----------------|
| ET-01 | Search Bar | 200+ characters string | Input handles overflow gracefully. Search execution truncates or handles string. |
| ET-02 | Search Bar | Special chars `!@#$%^&*()` | Engine does not crash. Returns no results or literal matches. |
| ET-03 | Create Profile Email | `invalid-email` | HTML5 validation error or "Save" disabled. |

## 2. Boundary Analysis

| ID | Feature | Boundary | Expected Result |
|----|---------|----------|-----------------|
| ET-04 | Workflow Nodes | 0 Nodes | Canvas shows Empty State or Start Node only. Validation prevents Save. |
| ET-05 | Workflow Nodes | 100 Nodes | Canvas renders. Performance check (lag). |
| ET-06 | Campaign Days Left | 0 Days | Status Badge turns Red or indicates "Ended". |
| ET-07 | Campaign Days Left | -1 Days | Logic handles negative date (treats as 0 or Overdue). |
