# FinPay Master Test Cases

## 1. Document Information

| Item | Details |
|---|---|
| Project | FinPay |
| Document | Master Test Cases |
| Version | 1.0 |
| Status | Draft |
| Test Scope | Functional, Validation, Security, Database and Integration |

---

## 2. Test Case Format

Each test case contains:

- Test Case ID
- Module
- Scenario
- Preconditions
- Test Data
- Steps
- Expected Result
- Actual Result
- Status
- Priority
- Severity

---

# 3. Authentication Test Cases

## AUTH-001 — Successful Login

| Field | Details |
|---|---|
| Module | Authentication |
| Scenario | Login with valid credentials |
| Preconditions | Registered active user exists |
| Test Data | Valid email and password |
| Steps | 1. Send POST request to `/api/auth/login` with valid credentials |
| Expected Result | HTTP 200 is returned and a JWT token is generated |
| Actual Result | To be recorded during formal execution |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

## AUTH-002 — Invalid Password

| Field | Details |
|---|---|
| Module | Authentication |
| Scenario | Login with an incorrect password |
| Preconditions | Registered user exists |
| Test Data | Valid email + incorrect password |
| Steps | 1. Submit login request |
| Expected Result | HTTP 401 is returned and authentication fails |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | High |

---

## AUTH-003 — Invalid Email

| Field | Details |
|---|---|
| Module | Authentication |
| Scenario | Login using an unregistered email |
| Preconditions | Email does not exist |
| Test Data | Unknown email + password |
| Steps | 1. Submit login request |
| Expected Result | HTTP 401 is returned |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | High |

---

## AUTH-004 — Missing Email

| Field | Details |
|---|---|
| Module | Authentication |
| Scenario | Login without an email |
| Preconditions | API available |
| Test Data | Missing email |
| Steps | 1. Submit login request without email |
| Expected Result | Request is rejected with an appropriate validation/error response |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P1 |
| Severity | Medium |

---

## AUTH-005 — Missing Password

| Field | Details |
|---|---|
| Module | Authentication |
| Scenario | Login without a password |
| Preconditions | API available |
| Test Data | Missing password |
| Steps | 1. Submit login request without password |
| Expected Result | Request is rejected |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P1 |
| Severity | Medium |

---

## AUTH-006 — JWT Required for Protected Endpoint

| Field | Details |
|---|---|
| Module | Authentication |
| Scenario | Access protected endpoint without JWT |
| Preconditions | Protected API endpoint exists |
| Test Data | No Authorization header |
| Steps | 1. Send request without token |
| Expected Result | Access is denied |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

## AUTH-007 — Invalid JWT

| Field | Details |
|---|---|
| Module | Authentication |
| Scenario | Access protected endpoint with invalid JWT |
| Preconditions | Protected endpoint exists |
| Test Data | Invalid/tampered JWT |
| Steps | 1. Send request using invalid token |
| Expected Result | Request is rejected |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

# 4. User Registration Test Cases

## USER-001 — Successful Registration

| Field | Details |
|---|---|
| Module | User Management |
| Scenario | Register a new user |
| Preconditions | Email and phone number do not already exist |
| Test Data | Valid registration data |
| Steps | 1. Submit POST `/api/users/register` |
| Expected Result | User is created successfully |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P1 |
| Severity | High |

---

## USER-002 — Duplicate Email

| Field | Details |
|---|---|
| Module | User Management |
| Scenario | Register using an existing email |
| Preconditions | Email already exists |
| Test Data | Existing email |
| Steps | 1. Submit registration request |
| Expected Result | Registration is rejected |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P1 |
| Severity | High |

---

## USER-003 — Duplicate Phone Number

| Field | Details |
|---|---|
| Module | User Management |
| Scenario | Register using an existing phone number |
| Preconditions | Phone number already exists |
| Test Data | Existing phone |
| Steps | 1. Submit registration request |
| Expected Result | Registration is rejected |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P1 |
| Severity | High |

---

## USER-004 — Invalid Email

| Field | Details |
|---|---|
| Module | User Management |
| Scenario | Register using invalid email |
| Preconditions | API available |
| Test Data | Invalid email format |
| Steps | 1. Submit registration |
| Expected Result | Validation failure |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P1 |
| Severity | Medium |

---

# 5. Account Management Test Cases

## ACC-001 — Create Account

| Field | Details |
|---|---|
| Module | Account Management |
| Scenario | Create account for authenticated user |
| Preconditions | Valid authenticated user |
| Test Data | Valid user ID |
| Steps | 1. Authenticate 2. Submit account creation request |
| Expected Result | Account is created and associated with the authenticated user |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

## ACC-002 — Retrieve Own Account

| Field | Details |
|---|---|
| Module | Account Management |
| Scenario | Retrieve authenticated user's account |
| Preconditions | Valid JWT and existing account |
| Test Data | Valid JWT |
| Steps | 1. Send authenticated account request |
| Expected Result | User's account information is returned |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | High |

---

## ACC-003 — Access Another User's Account

| Field | Details |
|---|---|
| Module | Account Security |
| Scenario | Attempt to access another user's account |
| Preconditions | Two users with separate accounts |
| Test Data | User A JWT + User B account |
| Steps | 1. Authenticate as User A 2. Request User B account |
| Expected Result | Access is denied |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

## ACC-004 — Verify Initial Balance

| Field | Details |
|---|---|
| Module | Account Management |
| Scenario | Verify account balance after creation |
| Preconditions | Account created |
| Test Data | New account |
| Steps | 1. Retrieve account |
| Expected Result | Account balance is initialized correctly |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P1 |
| Severity | High |

---

# 6. Deposit Test Cases

## TXN-001 — Successful Deposit

| Field | Details |
|---|---|
| Module | Transactions |
| Scenario | Deposit valid amount |
| Preconditions | Authenticated account |
| Test Data | Positive amount |
| Steps | 1. Submit deposit request |
| Expected Result | Deposit completes and account balance increases |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

## TXN-002 — Zero Deposit

| Field | Details |
|---|---|
| Module | Transactions |
| Scenario | Attempt deposit of zero |
| Preconditions | Authenticated account |
| Test Data | Amount = 0 |
| Steps | 1. Submit deposit |
| Expected Result | Request is rejected |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P1 |
| Severity | Medium |

---

## TXN-003 — Negative Deposit

| Field | Details |
|---|---|
| Module | Transactions |
| Scenario | Attempt negative deposit |
| Preconditions | Authenticated account |
| Test Data | Negative amount |
| Steps | 1. Submit deposit |
| Expected Result | Request is rejected |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | High |

---

## TXN-004 — Unauthorized Deposit

| Field | Details |
|---|---|
| Module | Transaction Security |
| Scenario | Deposit into another user's account |
| Preconditions | Two users with accounts |
| Test Data | User A JWT + User B account |
| Steps | 1. Authenticate as User A 2. Submit deposit for User B |
| Expected Result | Transaction is rejected |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

# 7. Withdrawal Test Cases

## TXN-005 — Successful Withdrawal

| Field | Details |
|---|---|
| Module | Transactions |
| Scenario | Withdraw amount within available balance |
| Preconditions | Authenticated account with sufficient balance |
| Test Data | Valid positive amount |
| Steps | 1. Submit withdrawal |
| Expected Result | Withdrawal completes and balance decreases |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

## TXN-006 — Insufficient Balance

| Field | Details |
|---|---|
| Module | Transactions |
| Scenario | Withdraw more than available balance |
| Preconditions | Account has insufficient funds |
| Test Data | Amount greater than balance |
| Steps | 1. Submit withdrawal |
| Expected Result | Transaction fails and balance remains unchanged |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

## TXN-007 — Negative Withdrawal

| Field | Details |
|---|---|
| Module | Transactions |
| Scenario | Attempt negative withdrawal |
| Preconditions | Authenticated account |
| Test Data | Negative amount |
| Steps | 1. Submit withdrawal |
| Expected Result | Request is rejected |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | High |

---

# 8. Transfer Test Cases

## TXN-008 — Successful Transfer

| Field | Details |
|---|---|
| Module | Transfers |
| Scenario | Transfer funds to another account |
| Preconditions | Authenticated source account with sufficient balance |
| Test Data | Valid destination account and amount |
| Steps | 1. Submit transfer |
| Expected Result | Transfer completes, source balance decreases and destination balance increases |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

## TXN-009 — Transfer to Non-existent Account

| Field | Details |
|---|---|
| Module | Transfers |
| Scenario | Transfer to invalid destination |
| Preconditions | Authenticated source account |
| Test Data | Invalid account ID |
| Steps | 1. Submit transfer |
| Expected Result | Transfer fails and source balance remains unchanged |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | High |

---

## TXN-010 — Transfer with Insufficient Balance

| Field | Details |
|---|---|
| Module | Transfers |
| Scenario | Transfer amount greater than source balance |
| Preconditions | Source account has insufficient funds |
| Test Data | Amount greater than balance |
| Steps | 1. Submit transfer |
| Expected Result | Transfer fails and balances remain unchanged |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

## TXN-011 — Transfer to Same Account

| Field | Details |
|---|---|
| Module | Transfers |
| Scenario | Transfer funds to the same account |
| Preconditions | Authenticated account |
| Test Data | Source and destination IDs identical |
| Steps | 1. Submit transfer |
| Expected Result | Request is rejected |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P1 |
| Severity | Medium |

---

# 9. Transaction History Test Cases

## TXN-012 — Retrieve Transaction History

| Field | Details |
|---|---|
| Module | Transaction History |
| Scenario | Retrieve authenticated user's transactions |
| Preconditions | Authenticated user with transactions |
| Test Data | Valid account ID |
| Steps | 1. Request transaction history |
| Expected Result | User's transaction history is returned |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P1 |
| Severity | High |

---

## TXN-013 — Transaction History Authorization

| Field | Details |
|---|---|
| Module | Transaction Security |
| Scenario | Access another user's transaction history |
| Preconditions | Two users with accounts |
| Test Data | User A JWT + User B account ID |
| Steps | 1. Authenticate as User A 2. Request User B history |
| Expected Result | Access is denied |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

# 10. Validation Test Cases

## VAL-001 — Missing Required Field

| Field | Details |
|---|---|
| Module | Validation |
| Scenario | Submit request with missing required field |
| Preconditions | Endpoint available |
| Test Data | Missing required property |
| Steps | 1. Submit request |
| Expected Result | Validation error is returned |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P1 |
| Severity | Medium |

---

## VAL-002 — Invalid Amount Format

| Field | Details |
|---|---|
| Module | Validation |
| Scenario | Submit non-numeric transaction amount |
| Preconditions | Transaction endpoint available |
| Test Data | Invalid amount |
| Steps | 1. Submit transaction |
| Expected Result | Request is rejected |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P1 |
| Severity | Medium |

---

## VAL-003 — Invalid Account ID

| Field | Details |
|---|---|
| Module | Validation |
| Scenario | Submit invalid account identifier |
| Preconditions | Authenticated user |
| Test Data | Invalid account ID |
| Steps | 1. Submit request |
| Expected Result | Request fails without corrupting data |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P1 |
| Severity | High |

---

# 11. API Error Handling Test Cases

## API-001 — Unauthorized Request

| Field | Details |
|---|---|
| Module | API Error Handling |
| Scenario | Access protected endpoint without authentication |
| Preconditions | Protected endpoint |
| Test Data | No JWT |
| Steps | 1. Send request |
| Expected Result | HTTP 401 returned |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

## API-002 — Forbidden Request

| Field | Details |
|---|---|
| Module | API Error Handling |
| Scenario | Authenticated user attempts unauthorized operation |
| Preconditions | Valid JWT |
| Test Data | Resource belonging to another user |
| Steps | 1. Send request |
| Expected Result | Access is denied |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

## API-003 — Resource Not Found

| Field | Details |
|---|---|
| Module | API Error Handling |
| Scenario | Request non-existent resource |
| Preconditions | API available |
| Test Data | Invalid resource ID |
| Steps | 1. Send request |
| Expected Result | Appropriate not-found response |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P1 |
| Severity | Medium |

---

# 12. Database Consistency Test Cases

## DB-001 — Deposit Balance Consistency

| Field | Details |
|---|---|
| Module | Database |
| Scenario | Verify balance after deposit |
| Preconditions | Account exists |
| Test Data | Known starting balance and deposit amount |
| Steps | 1. Record initial balance 2. Perform deposit 3. Query account |
| Expected Result | New balance equals initial balance plus deposit |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

## DB-002 — Withdrawal Balance Consistency

| Field | Details |
|---|---|
| Module | Database |
| Scenario | Verify balance after withdrawal |
| Preconditions | Account has sufficient funds |
| Test Data | Known balance and withdrawal amount |
| Steps | 1. Record balance 2. Withdraw 3. Query account |
| Expected Result | New balance equals initial balance minus withdrawal |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

## DB-003 — Failed Transaction Consistency

| Field | Details |
|---|---|
| Module | Database |
| Scenario | Verify failed transaction does not corrupt balance |
| Preconditions | Transaction designed to fail |
| Test Data | Insufficient balance |
| Steps | 1. Record balance 2. Submit invalid transaction 3. Query account |
| Expected Result | Balance remains unchanged |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

# 13. Security Test Cases

## SEC-001 — Password Not Stored in Plain Text

| Field | Details |
|---|---|
| Module | Security |
| Scenario | Verify password storage |
| Preconditions | User registered |
| Test Data | Valid password |
| Steps | 1. Query user database record |
| Expected Result | Password is stored as a BCrypt hash |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

## SEC-002 — SQL Injection Attempt

| Field | Details |
|---|---|
| Module | Security |
| Scenario | Attempt SQL injection through user-controlled input |
| Preconditions | API available |
| Test Data | SQL injection payload |
| Steps | 1. Submit malicious input |
| Expected Result | Input does not execute SQL or bypass authentication |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

## SEC-003 — Cross-Account Authorization

| Field | Details |
|---|---|
| Module | Security |
| Scenario | Attempt to access another user's financial data |
| Preconditions | Two authenticated users |
| Test Data | User A token + User B resource |
| Steps | 1. Authenticate as User A 2. Request User B data |
| Expected Result | Access denied |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

## SEC-004 — Tampered JWT

| Field | Details |
|---|---|
| Module | Security |
| Scenario | Modify JWT payload/signature |
| Preconditions | Valid JWT exists |
| Test Data | Modified JWT |
| Steps | 1. Modify token 2. Send request |
| Expected Result | Token rejected |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

# 14. Regression Test Cases

## REG-001 — Authentication Regression

| Field | Details |
|---|---|
| Module | Regression |
| Scenario | Verify login after application changes |
| Preconditions | Valid test user |
| Test Data | Valid credentials |
| Steps | 1. Login |
| Expected Result | Login succeeds and JWT is returned |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

## REG-002 — Transaction Regression

| Field | Details |
|---|---|
| Module | Regression |
| Scenario | Verify transactions after application changes |
| Preconditions | Authenticated account |
| Test Data | Valid transaction |
| Steps | 1. Perform transaction |
| Expected Result | Transaction succeeds and balance updates correctly |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | Critical |

---

## REG-003 — Frontend Regression

| Field | Details |
|---|---|
| Module | Frontend |
| Scenario | Verify frontend production build |
| Preconditions | Frontend dependencies installed |
| Test Data | Application source |
| Steps | 1. Run `npm run build` |
| Expected Result | Vite production build succeeds |
| Actual Result | To be recorded |
| Status | Not Executed |
| Priority | P0 |
| Severity | High |

---

# 15. Test Execution Status

The following status values will be used:

| Status | Meaning |
|---|---|
| Not Executed | Test has not been performed |
| Pass | Expected result achieved |
| Fail | Expected result not achieved |
| Blocked | Test cannot currently be executed |
| Retest | Fix requires verification |

---

# 16. Test Completion

The master test cases will be considered complete when:

- All planned cases have been executed.
- Critical test cases pass.
- Security-critical tests pass.
- Transaction integrity tests pass.
- Regression tests pass.
- Defects are documented.
- Failed tests have been investigated.
- Evidence has been collected.

---

# 17. Test Evidence

Evidence may include:

- curl request/response output
- Browser screenshots
- PostgreSQL queries
- Application logs
- Maven test results
- Frontend build results
- Security test output
- Performance results

Sensitive credentials and authentication tokens must not be committed to the repository.
