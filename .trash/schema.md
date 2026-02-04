# Standardized Database Schemas (Multi-Tenant)

This document serves as the technical reference for the standardized Mongoose schemas in the MapRecruit backend.

## 1. User Schema (`usersDB`)
Maps to `backend/models/User.js`.

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | `ObjectId` | Unique User Identifier |
| `email` | `String` | Unique login email |
| `role` | `String` | Role display name (e.g., "Product Admin") |
| `roleID` | `ObjectId` | Reference to `Role` |
| `companyID` | `ObjectId` | Primary authorized Company |
| `AccessibleCompanyID` | `[ObjectId]` | List of all authorized Companies |
| `clientID` | `[ObjectId]` | List of all authorized Clients |
| `activeClientID` | `ObjectId` | Currently selected Client context |
| `currentCompanyID` | `ObjectId` | Currently selected Company context |

## 2. Company Schema (`companiesDB`)
Maps to `backend/models/Company.js`.

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | `ObjectId` | Unique Company Identifier |
| `companyProfile` | `Mixed` | Name, Logo, Domains, etc. |
| `productSettings` | `Mixed` | Includes `franchise` (Boolean) toggle |
| `status` | `String` | e.g., "Active" |

## 3. Client Schema (`clientsdb`)
Maps to `backend/models/Client.js`.

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | `ObjectId` | Unique Client Identifier |
| `clientName` | `String` | **Primary Identity Key** |
| `companyID` | `ObjectId` | Parent Company reference |
| `franchiseID` | `ObjectId` | Reference to Parent Franchise (if applicable) |
| `enable` | `Boolean` | Status flag |

## 4. Role Schema (`roles`)
Maps to `backend/models/Role.js`.

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | `ObjectId` | Unique Role Identifier |
| `roleName` | `String` | Descriptive name |
| `companyID` | `[ObjectId]` | List of Companies where this role is valid |
| `accessibilitySettings` | `Mixed` | Granular permission gates |

## 5. Franchise Schema (`franchises`)
Maps to `backend/models/Franchise.js`.

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | `ObjectId` | Unique Franchise Identifier |
| `franchiseName` | `String` | Descriptive name |
| `companyID` | `ObjectId` | Parent Company reference |
| `clientIDs` | `[ObjectId]` | List of Clients belongs to this Franchise |
| `active` | `Boolean` | Status flag |

---
*Created by Antigravity AI - Standardized for Multi-Tenancy*
