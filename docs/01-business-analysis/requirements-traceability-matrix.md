# FinPay Requirements Traceability Matrix (RTM)

**Document version:** 1.1  
**Document status:** Target-state baseline  
**Project:** FinPay  
**Related documents:**
- `business-requirements.md`
- `../02-product-design/product-specification.md`
- `../03-system-architecture/system-architecture.md`
- `../04-data-design/data-model.md`
- `../05-payment-system/payment-system.md`
- `../06-api/api-specification.md`
- `../06-qa/test-cases.md`
- `../06-qa/api-test-cases.md`
- `../06-qa/integration-test-cases.md`
- `../06-qa/security-test-cases.md`
- `../06-qa/performance-test-cases.md`
- `../06-qa/uat.md`
- `../06-qa/coverage-gap-register.md`

## 1. Purpose

This matrix traces FinPay business and non-functional requirements
to design artefacts and verification scenarios.

It covers the intended FinPay product, not only the functionality
implemented in the current development baseline.

A requirement can be documented while its implementation or testing
is still pending. Design references and planned test cases do not
constitute implementation or acceptance evidence.

## 2. Status Definitions

| Status | Meaning |
|---|---|
| Planned | Requirement is approved or included in the target baseline but implementation or verification is not established |
| In Progress | Implementation or verification is underway |
| Implemented | Implementation evidence has been reviewed |
| Tested | Relevant tests have passed with recorded evidence |
| Accepted | Authorised business acceptance has been recorded |
| Deferred | Requirement is intentionally postponed with documented rationale |

Status changes require evidence and review. A PASS in a narrow
historical test does not automatically mark the entire requirement
as Tested or Accepted.

## 3. Functional Requirements Traceability

| ID | Requirement | Design reference | Verification references | Current status |
|---|---|---|---|---|
| FR-001 | Customer registration | `../02-product-design/product-specification.md`; `../04-data-design/data-model.md` | USER-001–004; API-TC-005; INT-005; UAT-001 | Planned |
| FR-002 | Contact verification using OTP | `../02-product-design/product-specification.md`; `../07-security/security-and-compliance.md` | SEC-OTP-001–003; UAT-015–016 | Planned |
| FR-003 | Secure password protection | `../07-security/security-and-compliance.md` | SEC-001; SEC-AUTH-006; AUTH-002; API-TC-002 | Planned |
| FR-004 | Customer authentication and logout | `../06-api/api-specification.md`; `../07-security/security-and-compliance.md` | AUTH-001–007; API-TC-001–004; API-TC-019–021; INT-004; INT-006; UAT-002–003; UAT-005 | Planned |
| FR-005 | Transaction PIN setup, verification and reset | `../07-security/security-and-compliance.md`; `../02-product-design/product-specification.md` | SEC-PIN-001; SEC-PIN-002; SEC-PIN-004; UAT-017–018; UAT-020 | Planned |
| FR-006 | PIN retry limits and lockout | `../07-security/security-and-compliance.md` | SEC-PIN-003; UAT-019 | Planned |
| FR-007 | Customer account and balance view | `../04-data-design/data-model.md`; `../02-product-design/product-specification.md` | ACC-001–004; API-TC-006; INT-003; INT-007; UAT-004 | Planned |
| FR-008 | Account funding through approved payment channels | `../05-payment-system/payment-system.md` | TXN-001–004; API-TC-008–010; INT-009; UAT-006; UAT-021–022 | Planned |
| FR-009 | Asynchronous payment lifecycle and status | `../05-payment-system/payment-system.md` | INT-009–012; SEC-PAY-001–004; UAT-021–025 | Planned |
| FR-010 | Verified funding credit and financial posting | `../05-payment-system/payment-system.md`; `../04-data-design/data-model.md` | SEC-PAY-001; SEC-PAY-003; INT-010–012; UAT-022–024; UAT-031 | Planned |
| FR-011 | Internal customer transfers | `../05-payment-system/payment-system.md`; `../04-data-design/data-model.md` | TXN-008–011; API-TC-014–016; INT-008; UAT-009–010; UAT-031 | Planned |
| FR-012 | Transfer eligibility, ownership and limits | `../01-business-analysis/business-requirements.md`; `../07-security/security-and-compliance.md` | ACC-003; TXN-010–011; SEC-ACCESS-001–004; SEC-PAY-004; UAT-010; UAT-012 | Planned |
| FR-013 | Duplicate transaction and callback prevention | `../05-payment-system/payment-system.md` | SEC-PAY-002; SEC-PAY-004; INT-011; UAT-024 | Planned |
| FR-014 | Withdrawals and external payouts | `../05-payment-system/payment-system.md` | TXN-005–007; API-TC-011–013; UAT-007–008; provider payout tests not yet defined | Planned |
| FR-015 | Transaction history and receipts | `../06-api/api-specification.md`; `../02-product-design/product-specification.md` | TXN-012–013; API-TC-017–018; UAT-014; UAT-026 | Planned |
| FR-016 | Customer notifications | `../11-user-guides/user-and-support-guide.md`; `../03-system-architecture/system-architecture.md` | INT-015; UAT-027; delivery and preference tests to be expanded | Planned |
| FR-017 | Operations and reconciliation | `../05-payment-system/payment-system.md`; `../03-system-architecture/system-architecture.md` | INT-016; UAT-030; reconciliation exception tests to be expanded | Planned |
| FR-018 | Auditable financial and security events | `../07-security/security-and-compliance.md`; `../05-payment-system/payment-system.md` | SEC-DATA-001; INT-016; INT-017; UAT-035; audit completeness tests to be expanded | Planned |
| FR-019 | Role-based access control | `../07-security/security-and-compliance.md` | SEC-ACCESS-002–004; INT-017; UAT-029 | Planned |
| FR-020 | Web and Android customer applications | `../02-product-design/product-specification.md`; `../03-system-architecture/system-architecture.md` | REG-003; PERF-009; INT-013–014; UAT-013; UAT-032–033; full client compatibility tests required | Planned |
| FR-021 | Customer support workflows | `../11-user-guides/user-and-support-guide.md` | UAT-028; support case lifecycle and access tests to be added | Planned |
| FR-022 | Configurable transaction limits and risk controls | `../05-payment-system/payment-system.md`; `../07-security/security-and-compliance.md` | SEC-PAY-003–004; SEC-PIN-003; limit boundary and risk-rule tests to be added | Planned |

### Functional traceability notes

1. Existing master test cases and API cases cover selected development
   workflows. Their historical results do not establish full target-state
   requirement acceptance.
2. Generic deposit tests do not prove M-Pesa initiation, callback
   verification, provider settlement or exactly-once posting.
3. Existing withdrawal tests do not prove an external payout provider
   lifecycle.
4. OTP and PIN cases are newly documented and have not been executed.
5. Android and web target workflows require release-specific client
   verification.
6. Requirements remain Planned until implementation and evidence are
   reviewed.

## 4. Non-Functional Requirements Traceability

| ID | Requirement | Verification references | Additional evidence required | Current status |
|---|---|---|---|---|
| NFR-001 | Security | SEC-001–004; SEC-AUTH-001–007; SEC-ACCESS-001–004; SEC-INPUT-001–003; SEC-PAY-001–004; SEC-DATA-001–003; SEC-CLIENT-001–002; SEC-INFRA-001–003; SEC-OTP-001–003; SEC-PIN-001–004 | Security assessment, remediation and release review | Planned |
| NFR-002 | Privacy and data protection | SEC-DATA-001–003; SEC-CLIENT-001–002 | Privacy review, retention and data-subject process verification | Planned |
| NFR-003 | Financial integrity | DB-001–003; SEC-PAY-002–004; INT-008–012; UAT-014; UAT-022–024; UAT-031 | Ledger balancing, atomicity, reversal and reconciliation evidence | Planned |
| NFR-004 | Availability and reliability | PERF-007; PERF-010; PERF-012; INT-012 | Availability monitoring, dependency failure and recovery evidence | Planned |
| NFR-005 | Performance | PERF-001–003; PERF-006–008; PERF-011–012 | Measured results against approved targets | Planned |
| NFR-006 | Scalability | PERF-004–005; PERF-011–012 | Defined capacity model, horizontal scaling and repeatable load evidence | Planned |
| NFR-007 | Usability and accessibility | UAT-025–028; UAT-032–034 | Usability review and accessibility evaluation | Planned |
| NFR-008 | Compatibility | INT-013–014; UAT-032–033; PERF-009 | Supported browser and Android device matrix results | Planned |
| NFR-009 | Maintainability | REG-001–003; build and static analysis records | Code review, dependency and maintainability assessment | Planned |
| NFR-010 | Observability | SEC-DATA-001; INT-015–017 | Log, metric, trace, alert and incident-response verification | Planned |
| NFR-011 | Recoverability | PERF-010; INT-012 | Backup restoration, recovery objectives and data consistency tests | Planned |
| NFR-012 | Auditability | SEC-DATA-001; INT-016–017; UAT-035 | Audit completeness, access review, retention and tamper-resistance evidence | Planned |

## 5. Test Suite Reference Catalogue

| Suite | Identifier range | Purpose |
|---|---|---|
| Master functional suite | AUTH-001–007 | Authentication |
| Master functional suite | USER-001–004 | User registration |
| Master functional suite | ACC-001–004 | Account operations |
| Master functional suite | TXN-001–013 | Transaction operations |
| Master validation suite | VAL-001–003 | Input validation |
| Master API suite | API-001–003 | General API access |
| Master database suite | DB-001–003 | Database consistency |
| Master security suite | SEC-001–004 | Baseline security |
| Master regression suite | REG-001–003 | Regression checks |
| Dedicated API suite | API-TC-001–021 | API functional and authentication checks |
| Integration suite | INT-001–018 | Component and provider integration |
| Security suite | SEC-AUTH, SEC-ACCESS, SEC-INPUT, SEC-PAY, SEC-DATA, SEC-CLIENT, SEC-INFRA, SEC-OTP, SEC-PIN | Security verification |
| Performance suite | PERF-001–012 | Performance and load |
| UAT suite | UAT-001–035 | Business acceptance |

A test ID is a reference to a scenario, not proof that it has passed.

## 6. Evidence Register

Evidence should be maintained with:

- Requirement ID
- Test case ID
- Build or release version
- Environment
- Execution date
- Actual result
- Test status
- Evidence reference
- Defect reference
- Reviewer or approver

Sensitive credentials, passwords, OTPs, PINs, JWTs and production
secrets must not be included in evidence.

Historical execution evidence remains in the relevant QA documents.
New tests remain Not Executed or Planned until actual execution is
recorded.

## 7. Coverage Gap Management

The QA coverage gap register is maintained at:

`../06-qa/coverage-gap-register.md`

It records missing scenarios, planned verification, priorities,
dependencies and closure evidence.

A requirement must not be marked Tested or Accepted solely because
a design document or test case exists.

## 8. Change Control

Changes to requirements must be reflected in:

1. Business requirements.
2. Product specification and architecture where relevant.
3. API, data and payment documentation where relevant.
4. Test cases and UAT scenarios.
5. This traceability matrix.
6. The QA coverage gap register.

Changes to status must include evidence and reviewer details.

## 9. Overall Traceability Status

**Target-state requirement coverage:** Documented.

**Implementation verification:** In progress.

**Full target-state test execution:** Pending.

**Business acceptance:** Pending.

**Production release approval:** Pending.
