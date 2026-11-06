# FinPay Integration Test Cases

## 1. Purpose

This document defines integration tests for interactions between FinPay
application components, persistence, payment providers, client
applications and operational services.

It distinguishes historical execution evidence from target-state tests.
A defined test case is not proof that the integration has been implemented
or successfully tested.

## 2. Integration Scope

The suite covers:

- Backend and PostgreSQL persistence.
- User registration, authentication and account retrieval.
- Ledger-backed internal transfers.
- M-Pesa sandbox payment initiation and callback processing.
- Duplicate and failed payment event handling.
- Web and Android client-to-API integration.
- Notification delivery.
- Reconciliation and staff/audit controls.
- Background job and retry behaviour.

Provider integrations must use approved sandbox environments unless
a separately authorised test environment is documented.

## 3. Test Environment

Record the following for each execution:

| Item | Required record |
|---|---|
| Application build | Version or Git commit |
| Backend | Environment and deployed version |
| Database | PostgreSQL version and test database |
| Payment provider | Sandbox/provider simulator |
| Web client | Browser and build version |
| Android client | Device/emulator and app version |
| Test data | Synthetic account/customer identifiers |
| Execution | Date, tester and evidence reference |

Do not include real credentials, passwords, OTPs, PINs, JWTs or provider
secrets in test evidence.

## 4. Test Case Format and Status

Each test records its integration area, scenario, preconditions, steps,
expected result and execution status.

- **PASS:** executed and expected result observed with evidence.
- **FAIL:** executed and expected result not observed.
- **NOT EXECUTED:** no execution evidence recorded.
- **PLANNED:** documented for future implementation or verification.
- **BLOCKED:** execution cannot proceed because a prerequisite is absent.

Historical results are retained only where the original record supports
them. Target-state cases must not be marked PASS without evidence.

## 5. Historical Database Integration Tests

### INT-001 — Backend connects to PostgreSQL

**Integration Area:** Spring Boot application / PostgreSQL

**Scenario:** Verify that the backend can establish a database connection.

**Expected Result:**
- The application establishes a connection to the configured database.
- Database connectivity is available to application components.
- Connection failures are reported without exposing credentials.

**Historical Status:** PASS

**Evidence:** Historical QA record.

### INT-002 — User repository retrieves database user

**Integration Area:** UserRepository / PostgreSQL

**Scenario:** Verify that a persisted user can be retrieved through the repository.

**Expected Result:**
- The expected test user is retrieved.
- Persisted user fields are mapped correctly.
- The plaintext password is not retrieved from storage.

**Historical Status:** PASS

**Evidence:** Historical QA record.

### INT-003 — Account repository retrieves account

**Integration Area:** AccountRepository / PostgreSQL

**Scenario:** Verify that a persisted account can be retrieved through the repository.

**Expected Result:**
- The correct account is returned.
- Account balance and status are mapped correctly.

**Historical Status:** PASS

**Evidence:** Historical QA record.

## 6. Historical Authentication Integration Test

### INT-004 — Login integrates with database user

**Integration Area:** AuthController / AuthenticationProvider / PostgreSQL

**Scenario:** Verify the complete login integration using a persisted test user.

**Expected Result:**
- The authentication process retrieves the persisted user.
- Password verification uses the stored password hash.
- Successful authentication produces the configured authentication result.
- Invalid credentials are rejected.

**Historical Status:** Not recorded

**Actual Result:** Not recorded

**Evidence:** Pending verification of the original execution record.

**Note:** The earlier document contained an incomplete test-data block.
No PASS result is inferred from that incomplete record.

## 7. Target-State Application Integration Tests

The following cases are planned. They require implementation and
execution evidence before they can be treated as completed tests.

### INT-005 — User registration persists customer data

**Integration Area:** Registration API / User service / UserRepository / PostgreSQL

**Scenario:** Verify that a valid registration request creates a persistent customer record.

**Preconditions:**
- Test environment is available.
- A unique synthetic email and phone number are available.

**Steps:**
1. Submit a valid registration request.
2. Inspect the API response.
3. Retrieve the customer through an authorised test method.
4. Verify the persisted record.

**Expected Result:**
- Registration is accepted according to the onboarding rules.
- The customer record is persisted once.
- Sensitive credentials are not returned or stored in plaintext.
- Duplicate registration is handled according to the API contract.

**Actual Result:** Not recorded

**Status:** Not Executed

### INT-006 — Authentication integrates with token issuance

**Integration Area:** Authentication service / UserRepository / JWT service

**Scenario:** Verify that successful credential verification integrates with token issuance and protected API access.

**Steps:**
1. Authenticate using a valid synthetic customer.
2. Obtain the authentication response.
3. Call an authorised protected endpoint using the returned token.
4. Repeat with an invalid or expired token.

**Expected Result:**
- Valid credentials produce the configured authentication response.
- A valid token permits authorised access.
- Invalid or expired tokens are rejected.
- Token claims and subject identity are validated by the backend.

**Actual Result:** Not recorded

**Status:** Not Executed

### INT-007 — Account service integrates with customer identity

**Integration Area:** Account service / User service / AccountRepository

**Scenario:** Verify that account retrieval returns the account associated with the authenticated customer.

**Steps:**
1. Authenticate as a synthetic customer.
2. Request the customer's account.
3. Verify account ownership and returned account fields.
4. Attempt to retrieve another customer's account.

**Expected Result:**
- The correct customer account is returned.
- Account ownership is enforced.
- Another customer's account is not disclosed.
- Account status and balance are mapped correctly.

**Actual Result:** Not recorded

**Status:** Not Executed

### INT-008 — Internal transfer integrates with ledger posting

**Integration Area:** Transaction service / Ledger / Account service / PostgreSQL

**Scenario:** Verify that a valid internal transfer produces consistent financial postings.

**Steps:**
1. Prepare two synthetic customer accounts.
2. Submit a valid transfer request.
3. Inspect the transaction record and ledger entries.
4. Compare the source and destination account effects.

**Expected Result:**
- The transfer is authorised and validated.
- Debit and credit postings are created consistently.
- The ledger entries balance.
- The transaction and financial postings commit atomically.
- A failed transfer does not leave partial financial postings.

**Actual Result:** Not recorded

**Status:** Not Executed

### INT-009 — M-Pesa funding request integrates with payment provider

**Integration Area:** Payment orchestration / M-Pesa sandbox adapter

**Scenario:** Verify that a valid funding request is sent to the configured provider sandbox.

**Steps:**
1. Configure sandbox credentials through the approved secret mechanism.
2. Submit a valid funding request using a synthetic customer.
3. Inspect the provider request and response using redacted evidence.
4. Inspect the local payment state.

**Expected Result:**
- The request uses the configured sandbox integration.
- Amount, currency and customer reference are validated.
- Provider credentials are not exposed.
- The local payment is assigned a traceable reference and appropriate pending state.
- No settled balance is credited merely because a request was initiated.

**Actual Result:** Not recorded

**Status:** Not Executed

### INT-010 — Successful provider callback updates payment state

**Integration Area:** M-Pesa callback endpoint / Payment service / Transaction service

**Scenario:** Verify that a valid successful provider callback is processed.

**Steps:**
1. Create a sandbox funding request.
2. Submit a valid simulated success callback.
3. Inspect the payment state and related transaction.
4. Verify the resulting ledger and balance effects.

**Expected Result:**
- Callback authenticity is verified according to the provider integration.
- The payment transitions to the appropriate successful state.
- Financial posting occurs only after the required verification.
- The posting is traceable to the provider reference.
- The callback response follows the provider contract.

**Actual Result:** Not recorded

**Status:** Not Executed

### INT-011 — Duplicate provider callback does not duplicate financial posting

**Integration Area:** Callback handler / Idempotency control / Ledger

**Scenario:** Verify that repeated delivery of the same provider event does not credit an account more than once.

**Steps:**
1. Submit a valid successful sandbox callback.
2. Submit the same callback again.
3. Inspect payment records and ledger entries.
4. Compare account balances before and after the repeated callback.

**Expected Result:**
- The repeated event is recognised.
- Only one financial posting is made.
- The account is not credited twice.
- Duplicate processing is safely recorded or acknowledged.

**Actual Result:** Not recorded

**Status:** Not Executed

### INT-012 — Failed or timed-out provider request is handled safely

**Integration Area:** Payment adapter / Payment service / Reconciliation

**Scenario:** Verify that provider failures and uncertain outcomes do not create false successful payments.

**Steps:**
1. Simulate a provider rejection or timeout.
2. Inspect the local payment state.
3. Retry or query the provider outcome using the documented process.
4. Inspect ledger postings and reconciliation state.

**Expected Result:**
- A failed payment is not marked successful.
- An uncertain outcome is not treated as confirmed failure or success without verification.
- No duplicate financial posting occurs during retry.
- The event is available for investigation or reconciliation.
- Customer-facing status is consistent with the verified payment state.

**Actual Result:** Not recorded

**Status:** Not Executed

### INT-013 — Web client integrates with backend API

**Integration Area:** React web application / Spring Boot API

**Scenario:** Verify that the web application uses the backend API for authenticated customer workflows.

**Steps:**
1. Start the web application and backend in the test environment.
2. Authenticate using a synthetic customer.
3. Load the customer's account and transaction views.
4. Submit a permitted test operation.
5. Inspect error handling for an unavailable API.

**Expected Result:**
- The web client communicates with the configured API.
- Authenticated requests carry the expected authentication context.
- Customer data shown belongs to the authenticated customer.
- API errors are handled without exposing secrets or internal stack traces.

**Actual Result:** Not recorded

**Status:** Not Executed

### INT-014 — Android client integrates with backend API

**Integration Area:** Kotlin Android application / Retrofit or configured HTTP client / Spring Boot API

**Scenario:** Verify that the Android application integrates with authenticated backend services.

**Steps:**
1. Launch the Android test build.
2. Authenticate using a synthetic customer.
3. Retrieve account and transaction information.
4. Simulate a network interruption.
5. Restore connectivity and repeat the request.

**Expected Result:**
- The Android client communicates with the configured API.
- Authenticated requests are authorised by the backend.
- Sensitive credentials are not exposed in logs.
- Network failures are handled safely.
- Retried operations do not create duplicate financial transactions.

**Actual Result:** Not recorded

**Status:** Not Executed

### INT-015 — Notification service integrates with transaction events

**Integration Area:** Transaction events / Notification service / Email or SMS provider

**Scenario:** Verify that relevant transaction events trigger configured customer notifications.

**Steps:**
1. Perform a synthetic transaction that should trigger a notification.
2. Inspect the generated notification event.
3. Verify provider delivery or sandbox acceptance.
4. Repeat event delivery where retry behaviour is supported.

**Expected Result:**
- The correct notification is generated for the correct customer.
- Notification content follows the approved template.
- Sensitive authentication or payment secrets are not included.
- Retry behaviour does not cause uncontrolled duplicate notifications.
- Delivery outcome is recorded where supported.

**Actual Result:** Not recorded

**Status:** Not Executed

### INT-016 — Reconciliation service integrates with provider records

**Integration Area:** Payment records / Provider statement or sandbox report / Reconciliation service

**Scenario:** Verify that internal payment records can be compared with provider records.

**Steps:**
1. Prepare synthetic successful, failed and unmatched payment records.
2. Import or retrieve a test provider report.
3. Run the reconciliation process.
4. Inspect matched items and exceptions.

**Expected Result:**
- Matching records are identified using approved references and values.
- Unmatched or inconsistent records are flagged.
- Reconciliation does not silently alter financial records.
- Exceptions are traceable and available for authorised review.

**Actual Result:** Not recorded

**Status:** Not Executed

### INT-017 — Staff access integrates with role and audit controls

**Integration Area:** Staff authentication / Role-based access control / Audit service

**Scenario:** Verify that privileged operations enforce staff permissions and produce audit records.

**Steps:**
1. Authenticate test staff accounts with different assigned roles.
2. Attempt operations permitted and denied for each role.
3. Inspect the resulting audit records.
4. Attempt to access a customer-only or restricted resource.

**Expected Result:**
- Each role can perform only its authorised operations.
- Denied operations do not modify protected data.
- Sensitive customer credentials and PINs are not exposed.
- Privileged actions create attributable audit records.

**Actual Result:** Not recorded

**Status:** Not Executed

### INT-018 — Background processing integrates with retry and failure handling

**Integration Area:** Background job or event processor / Database / External service adapter

**Scenario:** Verify that asynchronous work can recover from transient failures without duplicating business effects.

**Steps:**
1. Submit a test event or job through the configured processing mechanism.
2. Simulate a transient processing failure.
3. Restore the dependency and allow the configured retry process.
4. Inspect job state, processing attempts and business records.

**Expected Result:**
- Processing state is traceable.
- Transient failures follow the configured retry policy.
- Repeated processing does not duplicate financial postings or other non-idempotent effects.
- Permanently failed work is visible for investigation.
- Sensitive data is not exposed in job logs.

**Actual Result:** Not recorded

**Status:** Not Executed

## 8. Integration Execution Summary

| Test Case ID | Area | Historical / Current Status |
|---|---|---|
| INT-001 | Backend to PostgreSQL | Historical PASS |
| INT-002 | User repository to PostgreSQL | Historical PASS |
| INT-003 | Account repository to PostgreSQL | Historical PASS |
| INT-004 | Login and database user | Not recorded |
| INT-005–INT-018 | Target-state integrations | Not Executed |

**Total defined integration cases:** 18

**Historically recorded PASS:** 3

**Not recorded:** 1

**Target-state cases not executed:** 14

## 9. Integration Exit Criteria

Integration verification is complete for a release scope only when:

- Required component and provider integrations are available.
- Positive and negative integration paths have been tested.
- Payment callback authenticity and idempotency are verified.
- Financial posting and transaction atomicity are verified.
- Client-to-API workflows are verified for the supported platforms.
- Retry, timeout and failure behaviour is verified.
- Relevant defects are resolved or formally accepted.
- Execution evidence is retained and reviewed.

A planned integration case is not evidence of implementation or successful execution.
