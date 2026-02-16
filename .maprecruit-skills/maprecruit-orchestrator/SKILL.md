---
name: maprecruit-orchestrator
description: Master coordinator for MapRecruit.ai development. Dynamically activates and follows relevant skills in /.maprecruit-skills/ (Safety, Validation, AI/Architecture, RBAC, Design, etc.) based on the current task. Always call this at the start of any MapRecruit task.
---

# MapRecruit Orchestrator

This skill acts as the central intelligence hub for MapRecruit.ai development. It automatically routes the agent to the specific guidelines and best practices required for the task at hand.

## When to use this skill

- This skill is triggered automatically for ANY task related to the MapRecruit.ai-TypeScript codebase.
- Use this as the main decision-making hub to determine which specific sub-skills are needed.

## How to use it

### 1. Contextual Activation
Whenever a task is started, immediately check the `/.maprecruit-skills/` directory and identify which guidelines are relevant:
- **UI/Feature Changes**: Refer to `brand-identity` and `frontend-excellence`.
- **Backend/API Work**: Refer to `api-architecture` and `system-architect`.
- **Security/Auth**: Refer to `rbac-and-privacy` and `coding-safety`.
- **Form/Data Handling**: Refer to `code-validation` and `coding-safety`.
- **Verification/PRs**: Refer to `testing-strategy` and `execution-master`.

### 2. Execution Flow
- **Plan**: Use `execution-master` to structure the work and `system-architect` for high-level design.
- **Implement**: Follow the specific guidelines from the relevant skills (e.g., `brand-identity`, `react-patterns`).
- **Verify**: Use `testing-strategy` for multi-viewport audits and Dark Mode checks.

### 3. Safety First
- Always consult `coding-safety` when dealing with destructive actions or asynchronous state updates to ensure optional chaining and confirmation patterns are applied.

### 4. Documentation Requirements

#### A. Test Documentation (`.trash/Test Cases/`)
For any feature implementation or bug fix, create comprehensive test documentation in `.trash/Test Cases/` with the following types:

**Test Case Structure:**
```
.trash/Test Cases/
├── [FEATURE-NAME]/
│   ├── acceptance-testing.md
│   ├── exhaustive-testing.md
│   ├── feature-logs.md
│   ├── functional-testing.md
│   ├── integration-testing.md
│   ├── manual-testing.md
│   ├── non-functional-testing.md
│   └── unit-testing.md
```

**Test Types to Document:**

1. **Acceptance Testing** (`acceptance-testing.md`)
   - User acceptance criteria
   - Business requirements validation
   - Stakeholder sign-off checklist

2. **Exhaustive Testing** (`exhaustive-testing.md`)
   - Edge cases and boundary conditions
   - Stress testing scenarios
   - Performance under extreme loads

3. **Feature Logs** (`feature-logs.md`)
   - Implementation timeline
   - Changes made per commit
   - Issues encountered and resolutions

4. **Functional Testing** (`functional-testing.md`)
   - Feature-specific test cases
   - Input/output validation
   - Expected vs actual behavior

5. **Integration Testing** (`integration-testing.md`)
   - API endpoint testing
   - Component interaction tests
   - Third-party service integration

6. **Manual Testing** (`manual-testing.md`)
   - Step-by-step manual test procedures
   - UI/UX validation checklist
   - Cross-browser compatibility tests

7. **Non-Functional Testing** (`non-functional-testing.md`)
   - Performance benchmarks
   - Security audit results
   - Accessibility compliance (WCAG)

8. **Unit Testing** (`unit-testing.md`)
   - Component-level test cases
   - Function/method test coverage
   - Mock data and test fixtures

**Template for Each Test Document:**
```markdown
# [Test Type] - [Feature Name]

**Date:** YYYY-MM-DD
**Author:** [Developer Name]
**Status:** ✅ Pass / ❌ Fail / ⏳ In Progress

## Test Objectives
- [Objective 1]
- [Objective 2]

## Test Cases

### TC-001: [Test Case Name]
- **Description:** [What is being tested]
- **Preconditions:** [Setup required]
- **Steps:**
  1. [Step 1]
  2. [Step 2]
- **Expected Result:** [What should happen]
- **Actual Result:** [What actually happened]
- **Status:** ✅ Pass / ❌ Fail
- **Notes:** [Additional observations]

## Summary
- **Total Tests:** X
- **Passed:** X
- **Failed:** X
- **Coverage:** X%

## Issues Found
1. [Issue 1 - Link to GitHub issue if applicable]
2. [Issue 2]
```

#### B. PRD Updates (`.trash/PRD/`)
Always maintain an up-to-date Product Requirements Document. **APPEND** new information rather than replacing existing content.

**PRD Structure:**
```
.trash/PRD/
├── maprecruit-prd.md (Main PRD)
├── feature-specifications/
│   ├── [feature-name]-spec.md
│   └── ...
└── changelog.md
```

**When to Update PRD:**
- New feature implementation
- Significant architectural changes
- API endpoint additions/modifications
- UI/UX improvements
- Security enhancements

**PRD Update Template:**
```markdown
---
## Update: [Feature/Change Name]
**Date:** YYYY-MM-DD
**Version:** X.Y.Z
**Author:** [Developer Name]

### Overview
[Brief description of the change]

### Motivation
[Why this change was needed]

### Implementation Details
- [Detail 1]
- [Detail 2]

### Impact
- **Frontend:** [Changes to UI/UX]
- **Backend:** [API/Database changes]
- **Security:** [Security implications]

### Dependencies
- [Dependency 1]
- [Dependency 2]

### Testing
- [Link to test documentation]

---
```

#### C. Schema & Architecture Documentation (`.trash/Documentation/`)
Document all database schemas, API structures, and architectural diagrams.

**Documentation Structure:**
```
.trash/Documentation/
├── schemas/
│   ├── database-schema.md
│   ├── api-contracts.md
│   └── data-models.md
├── architecture/
│   ├── system-architecture.md
│   ├── component-diagrams.md
│   └── data-flow-diagrams.md
└── graphs/
    ├── [feature]-flow.mermaid
    └── [component]-diagram.mermaid
```

**Schema Documentation Template:**
```markdown
# [Schema Name]

**Last Updated:** YYYY-MM-DD
**Version:** X.Y.Z

## Overview
[Description of the schema/structure]

## Schema Definition

### MongoDB Collection: [CollectionName]
\`\`\`json
{
  "_id": "ObjectId",
  "fieldName": "String",
  "nestedObject": {
    "subField": "Number"
  },
  "arrayField": ["String"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
\`\`\`

### Indexes
- `fieldName`: Unique, Ascending
- `createdAt`: Descending

### Relationships
- **References:** [Other collections this references]
- **Referenced By:** [Collections that reference this]

## API Endpoints

### GET /api/[resource]
**Description:** [What this endpoint does]
**Auth Required:** Yes/No
**Permissions:** [Required permissions]

**Request:**
\`\`\`json
{
  "param1": "value"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {}
}
\`\`\`

## Diagrams

\`\`\`mermaid
graph TD
    A[Component A] --> B[Component B]
    B --> C[Database]
\`\`\`

## Change Log
- **YYYY-MM-DD:** [Change description]
```

### 5. Cleanup & Maintenance
- **Post-Task**: At the end of every task or verification phase, invoke `workspace-cleanup` to archive temporary test scripts (`test_*.js`, `*.log`) to `.trash`.
- **Documentation**: Ensure all test cases, PRD updates, and schema documentation are created/updated before marking a task as complete.
- **Version Control**: Commit documentation changes separately with clear commit messages (e.g., "docs: Add test cases for profile preview feature").

### 6. Documentation Checklist
Before completing any task, verify:
- [ ] Test documentation created in `.trash/Test Cases/[FEATURE-NAME]/`
- [ ] PRD updated (appended) in `.trash/PRD/maprecruit-prd.md`
- [ ] Schema/API documentation updated in `.trash/Documentation/`
- [ ] Mermaid diagrams created for complex flows
- [ ] All documentation committed to version control
