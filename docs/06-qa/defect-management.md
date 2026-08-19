# FinPay Defect Management

## 1. Purpose

This document defines the process for identifying, recording, prioritizing,
tracking, resolving, and verifying defects in the FinPay payment platform.

## 2. Defect Severity

| Severity | Description |
|---|---|
| Critical | Causes major system failure, security compromise, or financial data corruption |
| High | Prevents an important business function from operating correctly |
| Medium | Affects functionality but has an available workaround |
| Low | Minor issue with limited functional impact |

## 3. Defect Priority

| Priority | Description |
|---|---|
| P1 | Immediate resolution required |
| P2 | High priority and should be resolved before release |
| P3 | Normal priority |
| P4 | Low priority or future improvement |

## 4. Defect Lifecycle

1. Identify defect.
2. Record defect.
3. Assign severity and priority.
4. Investigate and reproduce.
5. Assign to developer.
6. Implement fix.
7. Retest the fix.
8. Perform regression testing.
9. Close the defect.

## 5. Defect Information

Each defect should contain:

- Defect ID
- Title
- Description
- Environment
- Steps to reproduce
- Expected result
- Actual result
- Severity
- Priority
- Evidence
- Assigned owner
- Status
- Resolution

## 6. Defect Statuses

- New
- Confirmed
- Assigned
- In Progress
- Fixed
- Retest
- Reopened
- Closed
- Deferred
- Rejected

## 7. Release Rule

Critical and High severity defects should be resolved and verified before
production release unless formally accepted as release risks.

## 8. Evidence

Defect evidence may include:

- Screenshots
- API responses
- Application logs
- Database queries
- Test results
- Browser console output

Sensitive credentials, passwords, and JWT tokens must not be included.
