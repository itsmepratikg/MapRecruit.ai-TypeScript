# Interview Schema Mapping

This document maps out the keys and properties found in the interview JSON data located in `SchemaData/Interviews`.

## Collection: `interviews`

### Primary Fields

| Key Path | Data Type | Description / Example Values |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique identifier for the interview record. |
| `resumeID` | ObjectId | Reference to the resume collection. |
| `campaignID` | ObjectId | Reference to the campaign collection. |
| `companyID` | ObjectId | Reference to the company collection. |
| `clientID` | ObjectId | Reference to the client collection. |
| `userID` | ObjectId | Reference to the user (recruiter) who initiated/linked the interview. |
| `createdAt` | DateTime | Timestamp of creation. |
| `updatedAt` | DateTime | Timestamp of the last update. |
| `linked` | Boolean | Indicates if the candidate is linked to the campaign. |
| `status` | String | "Not Initiated", "Initiated", "Completed", etc. |
| `offerStatus` | String | Status of the job offer. |
| `active` | Boolean | Record availability status. |
| `applicationType`| String | "Applied", "Sourced", etc. |
| `linkedBy` | String | "Recruiter", "System", etc. |

### Feedback (`feedBack`)
*Note: Both `feedBack` and `feedback` (casing) were found in the analysis, suggesting potential inconsistency in the source data.*

| Key Path | Data Type | Description |
| :--- | :--- | :--- |
| `feedBack.rating` | Number | Overall rating given to the candidate (0-5). |
| `feedBack.comment` | String | Written feedback. |
| `feedBack.status` | String | Feedback status (e.g., "Shortlisted", "Rejected"). |
| `feedBack.shortlisted`| Boolean | Shortlist flag. |
| `feedBack.rejected` | Boolean | Rejection flag. |
| `feedBack.reviewed` | Boolean | If the profile was reviewed. |
| `feedBack.reviewedBy` | ObjectId | User who performed the review. |
| `feedBack.reviewedAt` | DateTime | When the review happened. |

### Campaign Snapshot (`campaign`)

| Key Path | Data Type | Description |
| :--- | :--- | :--- |
| `campaign.title` | String | The job title. |
| `campaign.passcode` | String | Campaign access code. |
| `campaign.locations` | Array | List of job locations. |

### Profile Snapshot (`profile`)

| Key Path | Data Type | Description |
| :--- | :--- | :--- |
| `profile.fullName` | String | Candidate's full name. |
| `profile.emails` | Array | List of email objects (type, preferred, valid, etc.). |
| `profile.phones` | Array | List of phone objects. |
| `profile.locations` | Array | Candidate's locations. |

### Sourcing Information (`sourceAI`)

| Key Path | Data Type | Description |
| :--- | :--- | :--- |
| `sourceAI.applicationChannel` | String | e.g., "Careers", "Profile Search", "Upload". |
| `sourceAI.applicationSource` | String | e.g., "TRC Website", "Passive Sourcing". |
| `sourceAI.linkedAt` | DateTime | When the profile was linked to the campaign. |
| `sourceAI.applicationChannelRefID` | ObjectId | Reference to the search or channel source. |

### Screening Rounds (`screeningRounds[]`)

| Key Path | Data Type | Description |
| :--- | :--- | :--- |
| `roundName` | String | Name of the round (e.g., "Assessment (1)"). |
| `roundType` | String | "Assessment", "Interview", etc. |
| `roundNumber` | Number | Sequence number. |
| `status` | String | "Completed", "Pending", etc. |
| `scheduled` | Boolean | If the round is scheduled. |
| `questions` | Array | List of question objects with responses. |
| `questions[]._id` | String | Question ID. |
| `questions[].question` | Object | The question text and media. |
| `questions[].response` | Object | The candidate's response. |
| `questions[].feedBack` | Object | Feedback specifically for this question. |

### MapRecruit Intelligence (`MRI`)

| Key Path | Data Type | Description |
| :--- | :--- | :--- |
| `MRI.score` | Number | Overall match score. |
| `MRI.actual_mri_score`| Number | The raw calculated score. |
| `MRI.experience` | Object | Match details for skills and job titles. |
| `MRI.education` | Object | Match details for degrees and majors. |
| `MRI.location` | Object | Distance-based match score. |
| `MRI.industry` | Object | Industry relevance score. |

### Metadata (`metaData`)

| Key Path | Data Type | Description |
| :--- | :--- | :--- |
| `metaData.mriCalculated` | Boolean | Whether MRI scores have been generated. |
| `metaData.process_steps` | Object | Logging of internal processing times and entity counts. |

## UI Component Mappings: Linked Campaigns View

This table links the visual elements seen in the candidate profile's "Linked Campaigns" tab (as seen in the screenshots) to the underlying fields in the `Interview` document.

| UI Element Name | Data Segment | Field Mapping | Example Value |
| :--- | :--- | :--- | :--- |
| **Score** | Primary Header | `MRI.actual_mri_score` | `0` (circle) |
| **Campaign Name** | Primary Header | `campaign.title` | `Loader / Unloader` |
| **Job ID** | Primary Header | `campaign.passcode` | `873789` |
| **Linked Date** | Primary Header | `sourceAI.linkedAt` / `createdAt` | `11/02/2022` |
| **Campaign Status** | Primary Header | `status` | `Closed` / `Active` |
| **Role / Position** | Expanded Content | `MRI.experience.jobTitle.jobTitle` | `Forklift Op` |
| **Company** | Expanded Content | `campaign.company` or `companyID` | `018 - ALCON` |
| **Location** | Expanded Content | `campaign.locations[0].text` | `duluth, georgia, 3009...` |
| **Applied Status** | Expanded Content | `applicationType` | `No` (Sourced) |
| **Feedback Status** | Expanded Content | `feedBack.status` or `feedBack.comment` | `Pending` |
| **View Job Details** | Action | Router link using `campaignID` | - |
| **Unlink Campaign** | Action | Trigger `deleteInterview` API call | - |

## Notes
...
