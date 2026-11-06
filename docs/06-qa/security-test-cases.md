# FinPay Security Test Cases

## 1. Purpose

This document defines the security test cases for the FinPay financial
platform.

The objective is to verify that customer accounts, authentication
credentials, financial records, payment operations, APIs and administrative
functions are protected against unauthorized access and common security
threats.

These cases describe the intended security verification programme.
A documented test case is not evidence that the test has passed.

## 2. Security Testing Scope

Security testing covers:

- Customer registration and authentication
- Password hashing and credential protection
- OTP verification and abuse prevention
- Transaction PIN protection
- JWT validation, expiration and revocation
- Role-based access control
- Customer account ownership
- API authorization
- Input validation and injection protection
- Sensitive financial information
- Payment callback authenticity
- Duplicate and replayed payment requests
- Session and token security
- Security headers and transport security
- Staff and administrative access
- Audit logging
- Database and infrastructure security
- Dependency and configuration security

## 3. Test Case Format

Each test case records:

- Test Case ID
- Security category
- Scenario
- Preconditions
- Test data
- Execution steps
- Expected result
- Actual result
- Status
- Severity
- Evidence reference

## 4. Status Definitions

| Status | Meaning |
|---|---|
| Not Executed | Test has not been performed |
| Pass | Expected security control was verified |
| Fail | Security control did not behave as expected |
| Blocked | Test cannot proceed because of a dependency |
| Retest | A fix has been applied and requires verification |

Severity:

- Critical: Potential compromise of financial integrity or widespread
  unauthorized access.
- High: Significant unauthorized access or sensitive data exposure.
- Medium: Limited security weakness requiring remediation.
- Low: Minor weakness or hardening recommendation.

---

## 5. Authentication Security

### SEC-AUTH-001 — Valid Login

**Scenario:** Verify authentication using valid credentials.

**Preconditions:**

- Backend is available.
- Customer account exists.
- Password is stored as an approved adaptive password hash.

**Steps:**

1. Submit valid login credentials.
2. Observe the API response.
3. Inspect the resulting authentication session.

**Expected Result:**

- Authentication succeeds.
- A valid, appropriately scoped authentication token or session is issued.
- Passwords and other credentials are not returned.
- Authentication activity is logged without recording secrets.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** High.

### SEC-AUTH-002 — Invalid Password

**Scenario:** Verify that an incorrect password is rejected.

**Preconditions:** A registered customer account exists.

**Steps:**

1. Submit the correct email and an incorrect password.
2. Observe the response.
3. Attempt to access an authenticated endpoint.

**Expected Result:**

- Authentication is rejected.
- No authenticated session is issued.
- The response does not disclose whether a password or account detail
  specifically caused the failure.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** High.

### SEC-AUTH-003 — Unknown Account Login

**Scenario:** Verify login attempts using an unregistered email address.

**Steps:**

1. Submit credentials for a non-existent account.
2. Observe the response.
3. Compare the response with an incorrect-password response.

**Expected Result:**

- Authentication is rejected.
- Responses do not unnecessarily reveal registered account information.
- No session is issued.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** Medium.

### SEC-AUTH-004 — Expired JWT

**Scenario:** Verify that expired authentication tokens are rejected.

**Preconditions:** An expired test token is available.

**Steps:**

1. Submit a request to a protected endpoint using the expired token.
2. Observe the API response.

**Expected Result:**

- The request is rejected.
- No protected resource is returned.
- The response does not expose sensitive token validation details.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** High.

### SEC-AUTH-005 — Tampered JWT

**Scenario:** Verify that a modified or incorrectly signed JWT is rejected.

**Steps:**

1. Modify the signature or claims of a test token.
2. Submit it to a protected endpoint.
3. Observe the response.

**Expected Result:**

- Token validation fails.
- No authenticated access is granted.
- Security-relevant activity is recorded.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** Critical.

### SEC-AUTH-006 — Password Hash Protection

**Scenario:** Verify that customer passwords are not stored in plaintext.

**Steps:**

1. Register a test customer.
2. Inspect the stored password field using an authorized test database
   connection.
3. Compare the stored value with the submitted password.

**Expected Result:**

- Passwords are stored using an approved adaptive password hashing
  algorithm.
- Plaintext passwords are never stored.
- Passwords are excluded from API responses and application logs.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** Critical.

### SEC-AUTH-007 — Authentication Rate Limiting

**Scenario:** Verify protection against repeated authentication attempts.

**Steps:**

1. Perform repeated failed login attempts against a controlled test account.
2. Observe throttling, delay or temporary restriction behaviour.
3. Verify that legitimate users can recover through the approved process.

**Expected Result:**

- Configured rate limits or abuse controls are enforced.
- Repeated attempts do not allow unlimited password guessing.
- Legitimate recovery remains possible.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** High.

---

## 6. Authorization and Access Control

### SEC-ACCESS-001 — Cross-Customer Account Access

**Scenario:** Verify that one customer cannot access another customer's
account information.

**Preconditions:** Two separate test customers and accounts exist.

**Steps:**

1. Authenticate as Customer A.
2. Attempt to retrieve Customer B's account using its identifier.
3. Attempt to access Customer B's account history.

**Expected Result:**

- Unauthorized access is denied.
- No account information belonging to Customer B is disclosed.
- Authorization is enforced by the backend.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** Critical.

### SEC-ACCESS-002 — Customer Privilege Escalation

**Scenario:** Verify that a customer cannot grant themselves staff or
administrative privileges.

**Steps:**

1. Authenticate as a normal customer.
2. Submit a request attempting to change the account role.
3. Attempt to access a restricted administrative endpoint.

**Expected Result:**

- Customers cannot modify privileged roles.
- Administrative endpoints reject unauthorized customers.
- Role assignment is controlled by an authorized administrative process.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** Critical.

### SEC-ACCESS-003 — Staff Role Separation

**Scenario:** Verify that staff permissions follow assigned roles.

**Steps:**

1. Authenticate using separate support, operations and finance test users.
2. Attempt actions allowed and disallowed for each role.
3. Compare the responses against the approved role-permission matrix.

**Expected Result:**

- Each staff role receives only its authorized permissions.
- Privileged actions require the appropriate authorization.
- Unauthorized actions are denied and auditable.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** Critical.

### SEC-ACCESS-004 — Object-Level API Authorization

**Scenario:** Verify authorization on customer-owned resources.

**Steps:**

1. Authenticate as a customer.
2. Modify resource identifiers in requests for accounts, transactions,
   receipts and profile records.
3. Attempt to access resources belonging to another customer.

**Expected Result:**

- Backend ownership checks prevent unauthorized access.
- Hiding identifiers in the frontend is not treated as an authorization
  control.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** Critical.

---

## 7. Input and Application Security

### SEC-INPUT-001 — SQL Injection Protection

**Scenario:** Verify that malicious SQL input cannot alter database queries.

**Steps:**

1. Submit controlled SQL injection test strings to applicable input fields.
2. Exercise authentication, search and transaction-related endpoints.
3. Inspect responses and database effects.

**Expected Result:**

- Inputs are safely handled.
- Parameterized queries or equivalent safe data-access mechanisms are used.
- No unauthorized data access or database modification occurs.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** Critical.

### SEC-INPUT-002 — Cross-Site Scripting Protection

**Scenario:** Verify protection against stored and reflected XSS.

**Steps:**

1. Submit harmless test payloads into fields that may display user content.
2. Retrieve the affected content through the web interface.
3. Observe whether scripts execute.

**Expected Result:**

- Untrusted content is safely encoded or sanitized.
- User input cannot execute arbitrary scripts in another user's session.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** High.

### SEC-INPUT-003 — Server-Side Validation

**Scenario:** Verify that invalid financial input cannot bypass validation.

**Steps:**

1. Submit negative, zero, excessive and malformed monetary values.
2. Attempt invalid currencies and unsupported transaction types.
3. Observe validation and transaction records.

**Expected Result:**

- Backend validation rejects invalid requests.
- No unauthorized financial posting occurs.
- Monetary values use precise decimal representations.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** Critical.

---

## 8. Payment and Financial Security

### SEC-PAY-001 — Unverified Payment Callback

**Scenario:** Verify that an unauthenticated or invalid payment callback
cannot credit a customer account.

**Preconditions:** Payment provider sandbox or controlled callback simulator.

**Steps:**

1. Submit a callback with an invalid signature or failed authenticity check.
2. Include a plausible transaction reference and amount.
3. Inspect the payment and ledger records.

**Expected Result:**

- The callback is rejected or quarantined.
- No customer balance is credited.
- The event is recorded for investigation.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** Critical.

### SEC-PAY-002 — Duplicate Payment Callback

**Scenario:** Verify idempotent handling of repeated payment notifications.

**Steps:**

1. Submit a valid sandbox payment callback.
2. Resubmit the same callback multiple times.
3. Inspect the resulting financial postings.

**Expected Result:**

- The payment is processed at most once financially.
- Duplicate callbacks do not create additional credits.
- Duplicate events are identifiable in the processing records.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** Critical.

### SEC-PAY-003 — Payment Amount and Currency Validation

**Scenario:** Verify that callback amounts and currencies are validated.

**Steps:**

1. Initiate a controlled sandbox payment.
2. Submit callbacks with altered amounts or currencies.
3. Inspect payment status and ledger postings.

**Expected Result:**

- Callback values are compared with the original payment instruction.
- Mismatched amounts or currencies are rejected or quarantined.
- No incorrect financial credit is posted.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** Critical.

### SEC-PAY-004 — Concurrent Transaction Integrity

**Scenario:** Verify that concurrent requests cannot cause unauthorized
financial changes.

**Steps:**

1. Prepare a controlled test account with a known balance.
2. Submit concurrent transactions that collectively exceed available funds.
3. Inspect transaction states and ledger entries.

**Expected Result:**

- Balance and transaction integrity are preserved.
- Concurrent requests cannot spend the same funds twice.
- Each accepted financial transaction has consistent postings.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** Critical.

---

## 9. Sensitive Data and Session Security

### SEC-DATA-001 — Sensitive Information in Logs

**Scenario:** Verify that sensitive information is excluded from logs.

**Steps:**

1. Perform test registration, login, payment and PIN-related operations.
2. Inspect application and audit logs.
3. Search for passwords, OTP values, PINs, full tokens and payment secrets.

**Expected Result:**

- Secrets are not recorded in plaintext.
- Logs use appropriate masking and data minimization.
- Operational records remain useful without exposing credentials.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** High.

### SEC-DATA-002 — Sensitive Information in API Responses

**Scenario:** Verify that protected fields are not exposed through APIs.

**Steps:**

1. Retrieve customer profile and account information.
2. Inspect JSON responses for sensitive fields.
3. Attempt to retrieve password hashes, PIN hashes and internal secrets.

**Expected Result:**

- Sensitive credential material is never returned.
- API responses expose only fields required by the authorized operation.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** Critical.

### SEC-DATA-003 — Transport Encryption

**Scenario:** Verify secure communication between clients and backend services.

**Steps:**

1. Inspect deployed endpoint transport configuration.
2. Attempt to access protected services through insecure HTTP.
3. Inspect TLS certificate and configuration.

**Expected Result:**

- Production-facing communication uses HTTPS with appropriate TLS.
- Insecure access is redirected or rejected according to deployment policy.
- Secrets are not transmitted through insecure channels.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** High.

---

## 10. Mobile and Web Security

### SEC-CLIENT-001 — Mobile Credential Storage

**Scenario:** Verify secure handling of authentication credentials in Android.

**Steps:**

1. Authenticate using a controlled Android test account.
2. Inspect application storage and logs using authorized test tooling.
3. Review token storage and logout behaviour.

**Expected Result:**

- Sensitive credentials are not stored in plaintext.
- Appropriate Android secure-storage mechanisms are used.
- Logout removes or invalidates locally held authentication material.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** High.

### SEC-CLIENT-002 — Web Session Protection

**Scenario:** Verify browser-side authentication and session protections.

**Steps:**

1. Authenticate through the web application.
2. Inspect token/session storage and browser behaviour.
3. Test logout, session expiry and unauthorized navigation.

**Expected Result:**

- Authentication material is handled according to the approved web security
  design.
- Logout and expiry prevent continued protected access.
- Frontend route protection is backed by backend authorization.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** High.

---

## 11. Infrastructure and Configuration Security

### SEC-INFRA-001 — Secret Management

**Scenario:** Verify that deployment secrets are not committed to source
control.

**Steps:**

1. Inspect tracked files and deployment configuration.
2. Search for credentials, API keys, signing keys and database passwords.
3. Review environment and secret-manager configuration.

**Expected Result:**

- Real secrets are not committed to Git.
- Secret values are injected through approved configuration mechanisms.
- Example environment files contain placeholders only.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** Critical.

### SEC-INFRA-002 — Security Headers

**Scenario:** Verify security headers on web responses.

**Steps:**

1. Inspect relevant production web and API responses.
2. Verify configured headers against the approved security baseline.

**Expected Result:**

- Appropriate security headers are configured.
- Browser protections are consistent with the deployment architecture.
- CORS policy permits only approved origins.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** Medium.

### SEC-INFRA-003 — Dependency Vulnerability Review

**Scenario:** Verify that application dependencies are reviewed for known
vulnerabilities.

**Steps:**

1. Run approved dependency scanning tools.
2. Review backend, frontend and Android dependency reports.
3. Record findings and remediation decisions.

**Expected Result:**

- Vulnerabilities are identified and assessed.
- Critical and high-risk findings are resolved or formally accepted with
  documented mitigation before release.

**Actual Result:** Not recorded.

**Status:** Not Executed.

**Severity:** High.

---

## 12. Additional Target-State Security Tests

The following cases extend the existing security suite to cover OTP
verification and transaction PIN controls. They are planned tests and
must not be interpreted as completed execution evidence.

### SEC-OTP-001 — OTP verification accepts a valid, unexpired code

**Category:** Identity verification

**Scenario:** Verify that a valid OTP can complete the intended contact-verification step.

**Preconditions:**
- OTP delivery is configured in a test environment.
- A synthetic customer is registered or undergoing registration.
- A test OTP can be retrieved through a controlled test mechanism.

**Steps:**
1. Request an OTP for the synthetic customer.
2. Retrieve the test OTP through the approved test channel.
3. Submit the correct OTP before expiry.
4. Inspect the verification state.

**Expected Result:**
- The correct OTP is accepted once.
- The intended contact point is marked verified.
- The OTP cannot be reused.
- The OTP value is not exposed in application logs.

**Actual Result:** Not recorded

**Status:** Not Executed

**Severity:** High

### SEC-OTP-002 — Expired and incorrect OTP values are rejected

**Category:** Identity verification

**Scenario:** Verify that expired and incorrect OTP values cannot verify a contact point.

**Steps:**
1. Request an OTP.
2. Submit an incorrect value.
3. Submit the correct value after its expiry period.
4. Inspect the verification state.

**Expected Result:**
- Incorrect OTP values are rejected.
- Expired OTP values are rejected.
- The contact point remains unverified.
- Responses do not disclose the expected OTP.

**Actual Result:** Not recorded

**Status:** Not Executed

**Severity:** High

### SEC-OTP-003 — OTP request and verification attempts are rate limited

**Category:** Abuse prevention

**Scenario:** Verify that OTP requests and verification attempts are protected against automated abuse.

**Steps:**
1. Generate repeated OTP requests for a test identity.
2. Submit repeated invalid verification attempts.
3. Repeat from the same source within the configured rate-limit window.
4. Inspect throttling, lockout and audit behaviour.

**Expected Result:**
- Configured request and verification limits are enforced.
- Abuse does not permit unlimited OTP delivery or guessing.
- Temporary restrictions are applied according to policy.
- Security events are recorded without exposing OTP values.

**Actual Result:** Not recorded

**Status:** Not Executed

**Severity:** High

### SEC-PIN-001 — Transaction PIN is stored using secure hashing

**Category:** Transaction authorisation

**Scenario:** Verify that transaction PIN data is never stored or exposed in plaintext.

**Preconditions:**
- Transaction PIN setup is available in the test environment.
- A synthetic customer is available.

**Steps:**
1. Set a test transaction PIN.
2. Inspect the persisted credential representation using an authorised test method.
3. Inspect API responses and application logs.

**Expected Result:**
- The PIN is stored using an approved adaptive one-way password hashing mechanism.
- The plaintext PIN is not returned by APIs.
- The plaintext PIN is not written to logs.
- PIN material is not included in source control or test reports.

**Actual Result:** Not recorded

**Status:** Not Executed

**Severity:** Critical

### SEC-PIN-002 — Incorrect transaction PIN is rejected

**Category:** Transaction authorisation

**Scenario:** Verify that a transaction cannot proceed with an incorrect PIN.

**Steps:**
1. Set a test PIN for a synthetic customer.
2. Initiate a transaction requiring PIN authorisation.
3. Submit an incorrect PIN.
4. Inspect the transaction and account state.

**Expected Result:**
- The incorrect PIN is rejected.
- The protected transaction is not executed.
- No financial posting occurs.
- The failure is handled without revealing the correct PIN.

**Actual Result:** Not recorded

**Status:** Not Executed

**Severity:** Critical

### SEC-PIN-003 — Repeated incorrect PIN attempts trigger configured lockout

**Category:** Transaction authorisation / Abuse prevention

**Scenario:** Verify that repeated PIN guessing is restricted.

**Steps:**
1. Initiate a protected test transaction.
2. Submit incorrect PIN values up to and beyond the configured attempt threshold.
3. Attempt another protected operation.
4. Inspect lockout and audit behaviour.

**Expected Result:**
- The configured attempt threshold is enforced.
- Further PIN verification is blocked or restricted according to policy.
- The customer receives a safe, non-revealing response.
- Lockout and recovery events are auditable.
- No protected transaction is executed after failed authorisation.

**Actual Result:** Not recorded

**Status:** Not Executed

**Severity:** Critical

### SEC-PIN-004 — PIN reset requires verified identity and secure recovery

**Category:** Transaction authorisation / Account recovery

**Scenario:** Verify that a customer cannot reset a transaction PIN through an unauthorised recovery path.

**Steps:**
1. Start PIN recovery for a synthetic customer.
2. Attempt recovery without completing required identity verification.
3. Complete the approved verification process.
4. Set a new test PIN.
5. Verify the old PIN is no longer accepted.

**Expected Result:**
- Recovery is denied before required verification.
- A verified recovery process permits a new PIN to be set.
- The old PIN cannot authorise transactions after successful reset.
- Recovery events are recorded.
- PIN values are never exposed in logs or responses.

**Actual Result:** Not recorded

**Status:** Not Executed

**Severity:** Critical

## 13. Security Test Execution Record

The original 26 security cases and the seven additional OTP/PIN cases
are defined below. All cases in this expanded suite remain Not Executed
unless an execution record with evidence is added.

| Test Case ID | Category | Count | Status | Evidence |
|---|---|---:|---|---|
| SEC-AUTH-001 to SEC-AUTH-007 | Authentication | 7 | Not Executed | Pending |
| SEC-ACCESS-001 to SEC-ACCESS-004 | Authorization | 4 | Not Executed | Pending |
| SEC-INPUT-001 to SEC-INPUT-003 | Input security | 3 | Not Executed | Pending |
| SEC-PAY-001 to SEC-PAY-004 | Payment security | 4 | Not Executed | Pending |
| SEC-DATA-001 to SEC-DATA-003 | Data protection | 3 | Not Executed | Pending |
| SEC-CLIENT-001 to SEC-CLIENT-002 | Client security | 2 | Not Executed | Pending |
| SEC-INFRA-001 to SEC-INFRA-003 | Infrastructure | 3 | Not Executed | Pending |
| SEC-OTP-001 to SEC-OTP-003 | OTP verification and abuse prevention | 3 | Not Executed | Pending |
| SEC-PIN-001 to SEC-PIN-004 | Transaction PIN and recovery | 4 | Not Executed | Pending |
| **Total** | **All security categories** | **33** | **Not Executed** | **Pending** |

## 14. Security Exit Criteria

Security verification is complete only when:

- Authentication and authorization controls are tested.
- Customer ownership checks are verified.
- Passwords and PINs are protected.
- Token validation and expiry are verified.
- Payment callback authenticity and idempotency are tested.
- Sensitive information is protected in transit, storage and logs.
- Critical and high-severity findings are resolved or formally accepted.
- Security evidence is retained.
- Regression testing confirms that security fixes do not break core flows.

## 15. Security Release Considerations

Passing these test cases does not independently establish regulatory
compliance or production approval.

Production financial services require appropriate legal, regulatory,
provider, privacy and independent security reviews.

No test case should be marked Pass without execution evidence.

---