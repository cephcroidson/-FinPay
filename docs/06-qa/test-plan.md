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

---

# 15. Stage 30.2 API QA Execution Results

## Execution Date

2026-08-19

## Environment

- Backend: FinPay Spring Boot API
- Java: 25
- Database: PostgreSQL 17.10
- Database port: 5434
- API port: 8080
- Authentication: JWT
- Password hashing: BCrypt

## Execution Summary

Stage 30.2 API QA execution was completed against the running FinPay
application.

The following areas were verified:

- JWT authentication
- Protected endpoint access
- Account ownership authorization
- Transaction authorization
- Deposits
- Withdrawals
- Transfers
- Insufficient balance handling
- Input validation
- Invalid account handling
- Malformed JSON handling
- Invalid credentials
- Invalid JWT handling
- Database transaction persistence
- Account balance integrity

## Results

| Test Area | Expected | Actual | Result |
|---|---|---|---|
| Valid login | 200 | 200 | PASS |
| Missing authentication | 401 | 401 | PASS |
| Invalid JWT | 401 | 401 | PASS |
| Empty Bearer token | 401 | 401 | PASS |
| Invalid password | 401 | 401 | PASS |
| Invalid email | 401 | 401 | PASS |
| Authorized account lookup | 200 | 200 | PASS |
| Unauthorized account access | 403 | 403 | PASS |
| Unauthorized source account | 4xx / rejected | 404 | PASS |
| Valid deposit | 201 | 201 | PASS |
| Valid withdrawal | 201 | 201 | PASS |
| Valid transfer | 201 | 201 | PASS |
| Insufficient balance | 400 | 400 | PASS |
| Zero amount | 400 | 400 | PASS |
| Negative amount | 400 | 400 | PASS |
| Missing amount | 400 | 400 | PASS |
| Invalid account | 404 | 404 | PASS |
| Malformed JSON | 400 | 400 | PASS |
| Database persistence | Transaction recorded | Verified | PASS |
| Balance integrity | No unexpected changes | Verified | PASS |

## Database Verification

Account 7 was used for authenticated transaction testing.

The account balance was:

```text
Before transaction tests: 50.0000 KES
After deposit of 25 KES:  75.0000 KES
After withdrawal of 10 KES: 65.0000 KES
After transfer of 5 KES: 60.0000 KES
Final verified balance: 60.0000 KES
