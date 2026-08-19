# FinPay Security Test Cases

## 1. Purpose

This document defines security-focused test cases for the FinPay payment
platform.

Testing covers authentication, authorization, password security, JWT
security, input validation, injection protection, sensitive-data protection,
security headers, and access control.

## 2. Security Testing Scope

- Authentication
- Authorization
- JWT validation
- Password hashing
- Password policy
- Input validation
- SQL injection prevention
- XSS protection
- CSRF considerations
- Unauthorized access
- Account ownership checks
- Sensitive-data protection
- Security headers
- Error-message security
- Token expiration
- Invalid token handling
- Brute-force/rate-limiting considerations
- Database security

## 3. Test Case Format

Each test case contains:

- Test Case ID
- Security Area
- Scenario
- Preconditions
- Test Data
- Steps
- Expected Result
- Actual Result
- Status
- Severity

---

## 4. Authentication Security

### SEC-AUTH-001 — Valid Login

**Scenario:** Verify that a valid user can authenticate.

**Preconditions:**

- Backend is running.
- User exists in PostgreSQL.
- User has a valid BCrypt password hash.

**Test Data:**

```text
Email: authorization.test@finpay.test
Password: FinPayTest@123
