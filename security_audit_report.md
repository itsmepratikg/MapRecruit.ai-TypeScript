# [Security Audit] Code Scanning Alerts (SonarQube)

This report summarizes the **240** alerts fetched from GitHub Code Scanning.

## Alerts by Tool
- **CodeQL**: 178
- **nodejsscan**: 62

## Severity Breakdown
- **ERROR**: 97
- **WARNING**: 143

## Top Findings by Rule
- **js/missing-rate-limiting**: 121 occurrences (Missing rate limiting)
- **node_nosqli_injection**: 46 occurrences (NodeNosqliInjection)
- **js/sql-injection**: 27 occurrences (Database query built from user-controlled sources)
- **js/log-injection**: 16 occurrences (Log injection)
- **node_username**: 11 occurrences (NodeUsername)
- **generic_error_disclosure**: 4 occurrences (GenericErrorDisclosure)
- **js/remote-property-injection**: 4 occurrences (Remote property injection)
- **js/clear-text-logging**: 3 occurrences (Clear-text logging of sensitive information)
- **js/user-controlled-bypass**: 3 occurrences (User-controlled bypass of security check)
- **node_password**: 1 occurrences (NodePassword)

## Files with Most Issues
- `backend/routes/userRoutes.js`: 27
- `backend/routes/campaignRoutes.js`: 22
- `backend/routes/profileRoutes.js`: 19
- `backend/routes/authRoutes.js`: 19
- `backend/controllers/passkeyController.js`: 11
- `backend/controllers/authController.js`: 11
- `backend/controllers/userController.js`: 10
- `backend/controllers/campaignController.js`: 9
- `backend/routes/companyRoutes.js`: 9
- `backend/controllers/interviewController.js`: 8
