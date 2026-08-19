# FinPay API Test Cases

## 1. Purpose

This document defines API-level test cases for the FinPay payment platform.

Testing covers authentication, authorization, account management, transactions,
validation, security, error handling, and database consistency.

## 2. API Base URL

    http://localhost:8080/api

## 3. Authentication Test Cases

### API-001 — Valid Login

**Method:** POST
**Endpoint:** `/auth/login`
**Priority:** High

**Test Data:**

    {
      "email": "authorization.test@finpay.test",
      "password": "FinPayTest@123"
    }

**Expected Result:**
- HTTP 200 OK
- JWT token is returned.
- Token contains the authenticated user's email.

**Actual Result:** HTTP 200 OK with JWT token.

**Status:** PASS

### API-002 — Invalid Password

**Method:** POST
**Endpoint:** `/auth/login`

**Expected Result:**
- HTTP 401 Unauthorized
- No JWT token returned.
- Generic authentication error returned.

**Status:** PASS

### API-003 — Invalid Email

**Method:** POST
**Endpoint:** `/auth/login`

**Expected Result:**
- HTTP 401 Unauthorized
- No JWT token returned.

**Status:** PASS

### API-004 — Missing Credentials

**Method:** POST
**Endpoint:** `/auth/login`

**Expected Result:**
- Authentication request is rejected.
- JWT is not issued.

**Status:** PASS

## 4. Account API Test Cases

### API-005 — Create Account

**Method:** POST
**Endpoint:** `/accounts`

**Expected Result:**
- Account is created for the authenticated user.
- Account status is ACTIVE.
- Initial balance is zero.
- Account is associated with the correct user.

**Status:** PASS

### API-006 — Retrieve Own Account

**Method:** GET
**Endpoint:** `/accounts/{id}`

**Expected Result:**
- Authenticated owner can retrieve their account.
- Correct account information is returned.

**Status:** PASS

### API-007 — Unauthorized Account Access

**Method:** GET
**Endpoint:** `/accounts/{id}`

**Expected Result:**
- User cannot access another user's account.
- Request is rejected.

**Status:** PASS

## 5. Deposit API Test Cases

### API-008 — Successful Deposit

**Method:** POST
**Endpoint:** `/transactions/deposit`

**Expected Result:**
- HTTP 200 OK
- Transaction type is DEPOSIT.
- Transaction status is COMPLETED.
- Account balance increases correctly.
- Transaction reference is generated.

**Status:** PASS

### API-009 — Zero Deposit

**Method:** POST
**Endpoint:** `/transactions/deposit`

**Expected Result:**
- Request is rejected.
- Balance remains unchanged.
- No successful transaction is created.

**Status:** PASS

### API-010 — Negative Deposit

**Method:** POST
**Endpoint:** `/transactions/deposit`

**Expected Result:**
- Request is rejected.
- Balance remains unchanged.

**Status:** PASS

## 6. Withdrawal API Test Cases

### API-011 — Successful Withdrawal

**Method:** POST
**Endpoint:** `/transactions/withdraw`

**Expected Result:**
- HTTP 200 OK
- Transaction type is WITHDRAWAL.
- Transaction status is COMPLETED.
- Account balance decreases correctly.

**Status:** PASS

### API-012 — Insufficient Balance

**Method:** POST
**Endpoint:** `/transactions/withdraw`

**Expected Result:**
- Withdrawal is rejected.
- Balance cannot become negative.
- Transaction is not completed.

**Status:** PASS

### API-013 — Unauthorized Withdrawal

**Method:** POST
**Endpoint:** `/transactions/withdraw`

**Expected Result:**
- User cannot withdraw from another user's account.
- Request is rejected.

**Status:** PASS

## 7. Transfer API Test Cases

### API-014 — Successful Transfer

**Method:** POST
**Endpoint:** `/transactions/transfer`

**Expected Result:**
- Source account is debited.
- Destination account is credited.
- Transfer transaction is recorded.
- Transaction status is COMPLETED.

**Status:** PASS

### API-015 — Insufficient Transfer Balance

**Method:** POST
**Endpoint:** `/transactions/transfer`

**Expected Result:**
- Transfer is rejected.
- Source balance remains unchanged.
- Destination balance remains unchanged.

**Status:** PASS

### API-016 — Non-existent Destination Account

**Method:** POST
**Endpoint:** `/transactions/transfer`

**Expected Result:**
- Transfer is rejected.
- No account balance is changed.

**Status:** PASS

## 8. Transaction History

### API-017 — Retrieve Account Transactions

**Method:** GET
**Endpoint:** `/transactions/account/{accountId}`

**Expected Result:**
- Authenticated owner can retrieve transaction history.
- Returned transactions belong to the requested account.

**Status:** PASS

### API-018 — Unauthorized Transaction History

**Method:** GET
**Endpoint:** `/transactions/account/{accountId}`

**Expected Result:**
- User cannot access another user's transaction history.

**Status:** PASS

## 9. JWT Security

### API-019 — Missing JWT

**Expected Result:**
- Protected endpoint rejects the request.
- HTTP 401 Unauthorized.

**Status:** PASS

### API-020 — Invalid JWT

**Expected Result:**
- Protected endpoint rejects the request.
- Protected data is not returned.

**Status:** PASS

### API-021 — Valid JWT

**Expected Result:**
- Protected endpoint accepts the request.
- Authenticated user's identity is available.

**Status:** PASS

## 10. Database Verification

The FinPay transactions table contains:

    id
    amount
    completed_at
    created_at
    currency
    description
    reference
    status
    type
    destination_account_id
    source_account_id

Transaction types:

    DEPOSIT
    WITHDRAWAL
    TRANSFER

Transaction statuses:

    PENDING
    COMPLETED
    FAILED

Account relationships use:

    source_account_id
    destination_account_id

Both reference accounts(id).

### Transaction Verification

    SELECT id,
           source_account_id,
           destination_account_id,
           type,
           amount,
           status,
           description,
           reference
    FROM transactions
    ORDER BY id DESC
    LIMIT 10;

### Account Balance Verification

    SELECT id,
           balance,
           currency,
           status
    FROM accounts
    ORDER BY id;

### Password Storage Verification

    SELECT id,
           email,
           LEFT(password, 7) AS hash_prefix
    FROM users;

Newly created users must have BCrypt password hashes beginning with:

    $2a$10$

Plain-text passwords must not be stored.

## 11. API Test Summary

| Category | Result |
|---|---|
| Authentication | PASS |
| JWT Authentication | PASS |
| Account Management | PASS |
| Deposits | PASS |
| Withdrawals | PASS |
| Transfers | PASS |
| Transaction History | PASS |
| Authorization | PASS |
| Validation | PASS |
| Database Verification | PASS |
| Error Handling | PASS |

## 12. Exit Criteria

API testing is considered complete when:

- Authentication succeeds with valid credentials.
- Invalid credentials are rejected.
- JWT authentication protects secured endpoints.
- Account ownership is enforced.
- Deposits update balances correctly.
- Withdrawals enforce available balance.
- Transfers update both accounts correctly.
- Transaction history is accessible only to authorized users.
- Database records remain consistent.
- Passwords are stored using BCrypt.
- git diff --check reports no errors.

## 13. Current API Evidence

A successful login was verified against the running FinPay API:

    POST /api/auth/login
    HTTP/1.1 200

A JWT token was returned for:

    authorization.test@finpay.test

This confirms the authentication flow is currently operational.
