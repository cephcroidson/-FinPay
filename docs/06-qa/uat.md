# FinPay User Acceptance Testing (UAT)

## 1. Purpose

This document defines User Acceptance Testing for the FinPay payment
platform.

UAT verifies that release-scope functionality meets approved business
requirements and user expectations. It is performed in a controlled
non-production environment using synthetic test data.

A scenario in this document is a planned acceptance check until
execution evidence and an authorised decision are recorded.

## 2. UAT Scope

UAT covers the target customer and operational workflows:

- Customer registration and contact verification
- Login and authentication
- Transaction PIN controls
- Account creation and account access
- Account balance and transaction history
- Internal deposits, withdrawals and transfers
- M-Pesa funding lifecycle
- Payment status and callback outcomes
- Transaction receipts and notifications
- Customer support workflows
- Staff roles and access restrictions
- Reconciliation and financial records
- Web and Android client workflows
- Error handling and security expectations

Only features included in the approved release scope are subject to
release acceptance. Future or deferred capabilities must be identified
as exclusions rather than silently treated as accepted.

## 3. UAT Preconditions

- The release candidate is deployed to the designated UAT environment.
- Backend, database and required client applications are available.
- Test users and accounts are synthetic.
- Test accounts have appropriate test balances.
- M-Pesa sandbox access is configured if payment UAT is in scope.
- Test notifications use controlled destinations.
- Test cases and expected results are approved.
- Known defects and environment limitations are documented.
- UAT participants understand that sandbox activity is not real settlement.

## 4. Original UAT Scenarios

These 14 scenarios are retained from the earlier UAT baseline.

| ID | Scenario | Expected Result | Status |
|---|---|---|---|
| UAT-001 | Register a valid user | User is successfully registered | Not Executed in this expanded baseline |
| UAT-002 | Login with valid credentials | Authentication token is returned | Not Executed in this expanded baseline |
| UAT-003 | Login with invalid password | Request is rejected | Not Executed in this expanded baseline |
| UAT-004 | Create an account | Account is created successfully | Not Executed in this expanded baseline |
| UAT-005 | Access protected endpoint without JWT | Request is rejected | Not Executed in this expanded baseline |
| UAT-006 | Deposit funds | Account balance increases after an authorised posting | Not Executed in this expanded baseline |
| UAT-007 | Withdraw available funds | Account balance decreases after successful processing | Not Executed in this expanded baseline |
| UAT-008 | Withdraw insufficient funds | Transaction is rejected without an unintended debit | Not Executed in this expanded baseline |
| UAT-009 | Transfer between accounts | Source and destination reflect the valid transfer | Not Executed in this expanded baseline |
| UAT-010 | Transfer insufficient funds | Transfer is rejected without partial posting | Not Executed in this expanded baseline |
| UAT-011 | Submit invalid transaction data | Validation error is returned | Not Executed in this expanded baseline |
| UAT-012 | Access another user's protected resource | Access is denied | Not Executed in this expanded baseline |
| UAT-013 | Verify frontend build | Production build completes successfully | Not Executed in this expanded baseline |
| UAT-014 | Verify transaction records | Database reflects the correct transaction state | Not Executed in this expanded baseline |

The original document recorded a pending overall UAT result. The
expanded baseline does not convert those scenarios into new PASS
results. Historical execution evidence remains in the QA test plan
and related execution records.

## 5. Additional Target-State UAT Scenarios

| ID | Scenario | Expected Result | Status |
|---|---|---|---|
| UAT-015 | Verify a registered contact using a valid OTP | Contact is verified and OTP cannot be reused | Planned |
| UAT-016 | Submit an expired or incorrect OTP | Verification is rejected and contact remains unverified | Planned |
| UAT-017 | Set a transaction PIN | PIN is established through the approved secure flow | Planned |
| UAT-018 | Authorise a transaction with an incorrect PIN | Transaction is rejected and no financial posting occurs | Planned |
| UAT-019 | Exceed the permitted PIN attempts | PIN verification is restricted according to policy | Planned |
| UAT-020 | Recover a forgotten transaction PIN | Recovery requires approved identity verification | Planned |
| UAT-021 | Initiate M-Pesa sandbox funding | Payment instruction is created and shown as pending | Planned |
| UAT-022 | Complete a successful sandbox funding callback | Verified payment is posted once to the correct account | Planned |
| UAT-023 | Receive a failed or timed-out payment result | Payment is shown as failed or pending according to verified state; no false credit occurs | Planned |
| UAT-024 | Receive a duplicate payment callback | Duplicate event does not create another financial posting | Planned |
| UAT-025 | View a pending transaction | UI clearly distinguishes pending from completed | Planned |
| UAT-026 | View transaction receipt and history | Correct reference, amount, currency, date and status are displayed | Planned |
| UAT-027 | Receive a transaction notification | Correct notification is generated without exposing sensitive data | Planned |
| UAT-028 | Access a support workflow as a customer | Customer can submit and view permitted support information | Planned |
| UAT-029 | Attempt a restricted staff operation | User without the required role is denied | Planned |
| UAT-030 | Review a reconciliation exception | Authorised operations user can inspect and track the exception | Planned |
| UAT-031 | Verify a ledger-backed transfer | Debit and credit entries balance and match the transfer | Planned |
| UAT-032 | Use the Android application for an authenticated account workflow | Android displays the correct backend-confirmed account data | Planned |
| UAT-033 | Use the web application for an authenticated account workflow | Web displays the correct backend-confirmed account data | Planned |
| UAT-034 | Experience a temporary network or provider failure | User sees a safe state and can recover without duplicate financial action | Planned |
| UAT-035 | Review an audit-sensitive staff action | Action is recorded with actor, time and action details | Planned |

## 6. Acceptance Criteria

The release may be accepted only when:

- All mandatory UAT scenarios for the approved release scope have been
  executed.
- Critical business workflows behave as specified.
- Authentication and authorisation controls work correctly.
- Customer data is isolated by ownership and role.
- Financial transactions are consistent and auditable.
- Payment status reflects verified provider outcomes.
- Duplicate events do not cause duplicate financial postings.
- Invalid transactions are rejected safely.
- Relevant web and Android workflows pass.
- No unresolved Critical defects remain.
- High-severity defects are resolved or formally accepted.
- Required security and operational checks are complete.
- UAT evidence is reviewed and approval is recorded.

## 7. UAT Execution Record

For every executed scenario, record:

- Scenario ID
- Build or release candidate
- Environment
- Tester or business representative
- Execution date
- Preconditions and test data reference
- Actual result
- PASS / FAIL / BLOCKED / NOT EXECUTED
- Defect reference, if applicable
- Evidence location
- Reviewer or approver

Do not place passwords, PINs, OTP values, JWTs or production secrets
in this document or its evidence attachments.

## 8. UAT Evidence

Evidence may include:

- API request and response records
- Browser and Android screenshots
- Synthetic database verification queries
- Application logs with secrets redacted
- Payment sandbox request and callback references
- Ledger and reconciliation reports
- Defect reports
- Build and deployment records
- Signed or formally recorded acceptance

## 9. UAT Result and Approval

**Overall UAT status:** Pending execution.

**Business acceptance:** Pending.

**Open defects review:** Pending.

**Release decision:** Pending.

**Approver:** To be assigned by the project.

**Approval date:** Pending.

No production release approval is implied by this document.
