# FinPay QA Coverage Gap Register

## 1. Purpose

This register identifies requirements and quality areas where test
coverage is missing, incomplete, planned or awaiting execution.

It complements the Requirements Traceability Matrix (RTM). It does
not replace test cases or execution evidence.

## 2. Status Definitions

- OPEN: required coverage is missing or incomplete.
- PLANNED: a test scenario has been documented but not executed.
- IN PROGRESS: implementation or verification is underway.
- BLOCKED: verification depends on an unresolved prerequisite.
- CLOSED: required coverage and evidence have been reviewed.

## 3. Coverage Gaps

| Gap ID | Area | Current coverage | Required action | Priority | Status |
|---|---|---|---|---|---|
| GAP-001 | OTP verification | SEC-OTP-001–003 and UAT-015–016 documented | Implement and execute OTP lifecycle, expiry, retry and rate-limit tests | High | PLANNED |
| GAP-002 | Transaction PIN | SEC-PIN-001–004 and UAT-017–020 documented | Implement and execute PIN setup, verification, lockout and recovery tests | Critical | PLANNED |
| GAP-003 | M-Pesa funding | INT-009–012 and UAT-021–024 documented | Complete sandbox initiation, callback, failure and duplicate-event integration tests | Critical | PLANNED |
| GAP-004 | Ledger integrity | INT-008 and UAT-031 documented | Verify double-entry posting, atomicity, reversals and concurrent transaction behaviour | Critical | PLANNED |
| GAP-005 | Reconciliation | INT-016 and UAT-030 documented | Implement reconciliation fixtures, exception handling and reviewer workflow tests | Critical | PLANNED |
| GAP-006 | Withdrawals and payouts | Existing internal withdrawal tests; provider payout coverage absent | Define payout provider lifecycle, settlement and failure tests | High | OPEN |
| GAP-007 | Notifications | INT-015 and UAT-027 documented | Verify delivery, retries, preferences and duplicate suppression | Medium | PLANNED |
| GAP-008 | Staff RBAC | SEC-ACCESS-003, INT-017 and UAT-029 documented | Complete role-permission matrix and test each privileged boundary | High | PLANNED |
| GAP-009 | Android acceptance | INT-014 and UAT-032 documented | Execute device, authentication, network and transaction workflow tests | High | PLANNED |
| GAP-010 | Web acceptance | INT-013 and UAT-033 documented | Execute browser, accessibility, responsive and workflow tests | High | PLANNED |
| GAP-011 | Performance | PERF-001–012 documented | Execute load, stress, endurance and recovery tests; record measured results | High | PLANNED |
| GAP-012 | Scalability | Performance suite includes load and stress scenarios | Define concurrency and throughput targets and test horizontal scaling | High | OPEN |
| GAP-013 | Disaster recovery | Recovery requirements documented at strategy level | Verify backup restoration, recovery objectives and data consistency | Critical | OPEN |
| GAP-014 | API contract coverage | API-TC-001–021 and master API cases | Map each target API operation to contract and negative tests | High | IN PROGRESS |
| GAP-015 | UAT acceptance | UAT-001–035 documented | Execute release-scope scenarios and obtain authorised approval | Critical | PLANNED |
| GAP-016 | Integration suite | INT-001–003 historical PASS; INT-004 incomplete record | Verify INT-004 and execute target-state integration cases | High | IN PROGRESS |
| GAP-017 | Audit and support | UAT-028 and UAT-035 documented | Define support-case lifecycle, audit event requirements and access tests | High | PLANNED |
| GAP-018 | Production security readiness | Security cases documented but full execution not evidenced | Complete security assessment, remediate findings and obtain review approval | Critical | PLANNED |

## 4. Release-Critical Open Areas

The following areas must be addressed before any production financial
release that depends on them:

- Secure customer identity and transaction authorisation.
- Verified payment-provider outcomes.
- Idempotent financial posting.
- Ledger balancing and transaction atomicity.
- Reconciliation and exception management.
- Staff access controls and auditability.
- Security assessment and remediation.
- Backup restoration and recovery verification.
- Required provider, legal and regulatory approvals.

The exact release gate depends on the approved release scope.

## 5. Evidence and Closure Rules

A gap may be marked CLOSED only when:

1. The required functionality or control is available in the relevant
   environment.
2. The linked test cases have been executed.
3. Results and evidence have been reviewed.
4. Related defects are resolved or formally accepted.
5. The RTM and relevant QA documents have been updated.

A planned test case alone is not sufficient evidence to close a gap.

## 6. Review

This register should be reviewed at each QA milestone and before
release approval.

**Overall status:** Open; target-state verification remains in progress.
