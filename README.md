# MapRecruit.ai - TypeScript Implementation

## Overview
This repository contains the TypeScript implementation of the MapRecruit.ai platform, featuring a dynamic custom field system that allows for client-specific metadata integration across Candidate Profiles, Campaigns, and Interviews.

## Project Architecture

```mermaid
graph TD
    %% Frontend Context
    subgraph Frontend ["React Frontend (Vite)"]
        P_P[Profile Page]
        C_P[Campaign Page]
        AD[Additional Details Sub-page]
        CFR[CustomFieldRenderer]
        
        P_P --> AD
        C_P --> AD
        AD --> CFR
    end

    %% Backend Architecture
    subgraph Backend ["Express Backend (Node.js)"]
        API[API Endpoints]
        CFC[CustomFieldController]
        MS[Mongoose Models]
        
        CFR -- "REST Request" --> API
        API --> CFC
        CFC --> MS
    end

    %% Data Layer
    subgraph Data ["MongoDB (MRv5)"]
        Meta[(Metadata)]
        Values[(Entity Data)]
        
        MS --> Meta
        MS --> Values
        
        subgraph Meta
            S[customSections]
            F[customFields]
        end
        
        subgraph Values
            R[resumes / candidates]
            C[campaigns]
            I[interviews]
        end
    end

    %% Logic flow
    Values -- "Dynamic Schema Reference" --> Meta
```

## Key Features
- **Dynamic Field Configuration**: Custom sections and fields are loaded from MongoDB metadata.
- **Complex UI Renderers**: Supports various field types including Dependent Dropdowns, List Selections, and File Uploads.
- **Normalized Data Structure**: Custom data is stored in the entity collections (e.g., `resumes`) under the `customData` field for performance and consistency.
- **Responsive Navigation**: Integration of "Additional Details" sub-pages for various platform roles.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, TypeScript.
- **Backend**: Node.js, Express, Mongoose.
- **Database**: MongoDB Atlas.
- **Tooling**: GitHub Actions (CI/CD), MCP (Model Context Protocol).
