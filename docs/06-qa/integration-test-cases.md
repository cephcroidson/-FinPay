# FinPay Integration Test Cases

## 1. Purpose

This document defines integration-level test cases for the FinPay payment
platform.

Integration testing verifies that the major FinPay components communicate
correctly and that data flows correctly between the application, security
layer, database, APIs, and frontend.

## 2. Integration Scope

The following integrations are covered:

- Spring Boot application and PostgreSQL
- Controller and service layers
- Service and repository layers
- User service and password encoder
- Spring Security and authentication provider
- Authentication provider and PostgreSQL
- JWT service and authentication controller
- JWT authentication filter and protected endpoints
- Account service and database
- Transaction service and database
- Transaction service and account balances
- REST API and frontend
- Docker PostgreSQL and backend application

## 3. Test Environment

| Component | Environment |
|---|---|
| Backend | Spring Boot |
| Language | Java 25 |
| Database | PostgreSQL 17.10 |
| Database Name | finpay |
| Database Port | 5434 |
| Backend Port | 8080 |
| Frontend | React + Vite |
| Authentication | JWT |
| Password Encoding | BCrypt |
| Database Runtime | Docker |

## 4. Test Case Format

Each integration test contains:

- Test Case ID
- Integration Area
- Scenario
- Preconditions
- Test Data
- Steps
- Expected Result
- Actual Result
- Status
- Priority

---

# 5. Database Integration Tests

## INT-001 — Backend connects to PostgreSQL

**Integration Area:** Spring Boot / PostgreSQL

**Scenario:** Verify that the backend can establish a database connection.

**Preconditions:**

- PostgreSQL container is running.
- FinPay database exists.
- Database credentials are configured.

**Steps:**

1. Start PostgreSQL.
2. Start the FinPay backend.
3. Monitor application startup logs.
4. Verify the datasource connection.

**Expected Result:**

- Hikari connection pool starts successfully.
- PostgreSQL connection is established.
- Application starts without a database connection error.

**Status:** PASS

**Priority:** High

## INT-002 — User repository retrieves database user

**Integration Area:** UserRepository / PostgreSQL

**Scenario:** Verify that a user stored in PostgreSQL can be retrieved by
the application.

**Preconditions:**

- A valid user exists in PostgreSQL.

**Steps:**

1. Submit a login request.
2. Authentication invokes the user lookup.
3. UserRepository queries PostgreSQL.
4. User details are returned.

**Expected Result:**

- Correct user is retrieved.
- Stored password hash is available to authentication.

**Status:** PASS

**Priority:** High

## INT-003 — Account repository retrieves account

**Integration Area:** AccountRepository / PostgreSQL

**Scenario:** Verify that account data can be retrieved from PostgreSQL.

**Steps:**

1. Request an existing account.
2. Application queries AccountRepository.
3. Repository retrieves the account.

**Expected Result:**

- Correct account is returned.
- Account balance and status are correctly mapped.

**Status:** PASS

**Priority:** High

---

# 6. Authentication Integration Tests

## INT-004 — Login integrates with database user

**Integration Area:** AuthController / AuthenticationProvider / PostgreSQL

**Scenario:** Verify the complete login integration.

**Preconditions:**

- Backend is running.
- User exists in PostgreSQL.
- User has a valid BCrypt password hash.

**Test Data:**

```text
Email: authorization.test@finpay.test
Password: FinPayTest@123
