# FinPay QA Test Plan

## 1. Purpose

This test plan defines the testing activities required to verify the functionality, security, reliability, and quality of the FinPay payment platform.

## 2. Test Objectives

- Verify functional requirements.
- Verify API behavior.
- Verify authentication and authorization.
- Verify account and transaction processing.
- Verify database consistency.
- Verify security controls.
- Verify frontend and backend integration.
- Identify and track defects.
- Prevent regressions after changes.

## 3. Features Under Test

### Authentication
- User login
- Valid credentials
- Invalid credentials
- JWT generation
- JWT validation
- Unauthorized requests

### User Management
- User registration
- Input validation
- Password validation
- Duplicate email handling

### Account Management
- Account creation
- Account ownership
- Account authorization
- Account balance retrieval
- Account status validation

### Transactions
- Deposits
- Withdrawals
- Transfers
- Transaction validation
- Insufficient balance handling
- Transaction status
- Transaction references
- Transaction ownership

### Security
- Password hashing
- JWT authentication
- Authorization
- Input validation
- SQL injection protection
- XSS considerations
- CSRF considerations
- Sensitive-data protection

## 4. Testing Levels

### Unit Testing
Individual application components are tested independently.

### Integration Testing
Interaction between application components, security, database, and APIs is tested.

### System Testing
The complete FinPay application is tested as an integrated system.

### User Acceptance Testing
Business-level workflows are validated against expected user requirements.

## 5. Testing Types

| Testing Type | Purpose |
|---|---|
| Functional | Verify business functionality |
| API | Verify REST endpoints |
| Integration | Verify component interaction |
| Security | Verify security controls |
| Database | Verify data integrity |
| Regression | Detect unintended changes |
| Performance | Evaluate system behavior under load |
| UAT | Validate business acceptance |

## 6. Test Environment

- Backend: Java, Spring Boot, Maven, Spring Security, JWT, Hibernate/JPA
- Database: PostgreSQL 17 running through Docker
- Frontend: React, Vite, JavaScript, npm
- API testing: curl and Postman where applicable

## 7. Test Data

- Valid user accounts
- Invalid credentials
- Valid JWT tokens
- Invalid JWT tokens
- Active accounts
- Accounts with insufficient balances
- Valid transaction amounts
- Invalid transaction amounts
- Unauthorized account IDs

Test data must not contain real customer financial information.

## 8. Test Execution Order

1. Environment verification
2. Backend build and unit tests
3. Database verification
4. API functional tests
5. Security tests
6. Integration tests
7. Regression tests
8. Performance tests
9. Frontend build verification
10. User acceptance testing

## 9. Entry Criteria

- Required functionality has been implemented.
- Application builds successfully.
- Database is available.
- Required services are running.
- Test data is available.
- Test cases are prepared.

## 10. Exit Criteria

- Required test cases have been executed.
- Critical defects are resolved.
- High-severity defects are resolved or formally accepted.
- Regression testing passes.
- Security testing is completed.
- Backend tests pass.
- Frontend build succeeds.
- No blocking defects remain.

## 11. Defect Handling

Every confirmed defect should contain:

- Defect ID
- Description
- Steps to reproduce
- Expected result
- Actual result
- Severity
- Priority
- Status
- Evidence

Defect lifecycle:

New → Assigned → In Progress → Fixed → Retest → Closed

If a retest fails:

Retest → Reopened → In Progress

## 12. Test Evidence

Evidence may include:

- Terminal output
- API responses
- PostgreSQL queries
- Application logs
- Screenshots
- Maven test results
- Frontend build results
- Security test results
- Performance results
- Defect reports

## 13. Current FinPay Baseline

- Backend Maven tests complete successfully.
- Frontend Vite production build completes successfully.
- PostgreSQL 17 is running through Docker.
- JWT authentication has been verified through the login API.

## 14. Risks

- Incorrect or inconsistent test data.
- Database state affecting test results.
- Expired JWT tokens.
- Environment configuration differences.
- Changes to transaction logic causing regressions.
- Security configuration changes affecting existing functionality.
