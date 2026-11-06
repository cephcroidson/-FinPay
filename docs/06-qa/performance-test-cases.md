# FinPay Performance Test Cases

## 1. Purpose

This document defines the performance testing programme for FinPay.

The objective is to evaluate response time, throughput, concurrent
transactions, database behaviour, resource utilization and system stability.

Testing applies to the intended FinPay web, Android and backend platform.

A performance target is a measurable objective, not evidence of achieved
performance.

## 2. Performance Testing Scope

- Authentication response time
- Account and balance API response time
- Transaction API response time
- Payment initiation and callback processing
- Database query performance
- Concurrent customer activity
- Concurrent financial transactions
- Throughput and error rate
- CPU, memory and database resource utilization
- Frontend production build
- Mobile API responsiveness
- Load, stress and endurance behaviour
- Recovery following excessive load
- Data integrity under concurrency

## 3. Performance Objectives

The following are initial development-environment targets.

| Metric | Initial target |
|---|---|
| Authentication API response | Under 1 second |
| Account API response | Under 1 second |
| Transaction API response | Under 2 seconds |
| Error rate under normal load | Below 1% |
| Database availability during test | At least 99% |
| Frontend production build | Successful |
| Recovery after load | No financial data corruption |

Response-time targets should be evaluated using percentiles, not only
average response time.

Where practical, record:

- p50 response time
- p95 response time
- p99 response time
- Requests per second
- Successful and failed requests
- CPU and memory utilization
- Database connection utilization

Targets must be reviewed after baseline measurements.

## 4. Test Environment

### 4.1 Intended Technology Environment

**Backend**

- Java 25
- Spring Boot
- Maven
- Spring Security
- Spring Data JPA

**Database**

- Supabase-hosted PostgreSQL
- PostgreSQL-compatible SQL
- Database connection pooling

**Web**

- React
- TypeScript
- Vite
- Tailwind CSS

**Mobile**

- Kotlin
- Android
- Jetpack Compose

**Infrastructure**

- Docker
- CI/CD pipeline
- Monitoring and application logs
- Approved performance-testing tools

### 4.2 Environment Requirements

Performance tests should document:

- Test environment and deployment version
- Backend instance count and resource limits
- Database plan and connection limits
- Network conditions
- Test dataset size
- Test tool and version
- Number of virtual users
- Test duration
- Warm-up period
- Measurement period
- Date and time of execution

Development, staging and production performance results must not be
presented as interchangeable.

## 5. Performance Test Case Format

Each test case must record:

- Test Case ID
- Scenario
- Preconditions
- Workload and test data
- Execution steps
- Expected result
- Actual result
- Measurements
- Status
- Evidence reference

## 6. Test Cases

### PERF-001 — Authentication Response Time

**Objective:** Measure authentication API response time.

**Preconditions:**

- Backend is running.
- A controlled set of test accounts exists.
- Test environment is stable.

**Workload:**

- Execute repeated valid and invalid authentication requests.
- Record p50, p95 and p99 response times.

**Steps:**

1. Warm up the API.
2. Submit authentication requests.
3. Record response time and error rate.
4. Repeat under the agreed normal test workload.

**Expected Result:**

- Authentication response time meets the initial target of under
  one second under the defined development workload.
- Invalid credentials are rejected.
- No authentication data is leaked.

**Actual Result:** Not recorded.

**Status:** Not Executed.

### PERF-002 — Account API Response Time

**Objective:** Measure account retrieval performance.

**Workload:**

- Repeated account and balance retrieval requests.
- Multiple authenticated test users.

**Steps:**

1. Prepare accounts with representative test data.
2. Submit account retrieval requests.
3. Record latency and error rate.
4. Compare results at different concurrency levels.

**Expected Result:**

- Response time meets the initial target of under one second under the
  defined development workload.
- Account ownership remains enforced.
- Account data remains accurate.

**Actual Result:** Not recorded.

**Status:** Not Executed.

### PERF-003 — Transaction API Response Time

**Objective:** Measure transaction creation and retrieval performance.

**Workload:**

- Controlled deposits, withdrawals and transfers.
- Transaction history retrieval.
- Multiple test accounts.

**Steps:**

1. Prepare test accounts with known balances.
2. Execute the defined transaction workload.
3. Record response times and transaction outcomes.
4. Verify financial records after execution.

**Expected Result:**

- Transaction API response time meets the initial target of under
  two seconds for the defined development workload.
- No accepted transaction is silently lost.
- Financial balances and ledger records remain consistent.

**Actual Result:** Not recorded.

**Status:** Not Executed.

### PERF-004 — Concurrent Customer Load

**Objective:** Evaluate system behaviour when multiple customers use FinPay
at the same time.

**Workload:**

- Define an initial virtual-user profile.
- Gradually increase concurrent users.
- Include authentication, account retrieval and transaction history.

**Steps:**

1. Establish a baseline with low concurrency.
2. Increase the number of virtual users in controlled stages.
3. Measure response times and error rates.
4. Identify resource bottlenecks.

**Expected Result:**

- The platform remains stable at the agreed test load.
- Error rates and response times are recorded.
- No customer receives another customer's information.

**Actual Result:** Not recorded.

**Status:** Not Executed.

### PERF-005 — Concurrent Transaction Processing

**Objective:** Verify transaction processing under concurrent financial
requests.

**Workload:**

- Multiple simultaneous transactions.
- Controlled test balances.
- Competing transactions against shared accounts.

**Steps:**

1. Prepare accounts with known starting balances.
2. Submit concurrent transaction requests.
3. Record accepted, rejected and pending transactions.
4. Reconcile balances and ledger postings.

**Expected Result:**

- Financial consistency is preserved.
- Concurrent transactions cannot create unauthorized negative balances.
- Duplicate requests do not create duplicate financial postings.
- Every accepted transaction is traceable.

**Actual Result:** Not recorded.

**Status:** Not Executed.

### PERF-006 — Database Query Performance

**Objective:** Evaluate database response and resource utilization.

**Workload:**

- Account retrieval.
- Transaction history.
- Customer lookup.
- Ledger and reconciliation queries.

**Steps:**

1. Prepare a representative test dataset.
2. Execute queries at controlled concurrency.
3. Capture query execution times and database resource usage.
4. Identify slow queries and missing indexes.

**Expected Result:**

- Queries remain within agreed performance thresholds.
- Database connections remain within configured limits.
- No data corruption or inconsistent query results occur.

**Actual Result:** Not recorded.

**Status:** Not Executed.

### PERF-007 — Error Rate Under Normal Load

**Objective:** Measure failed requests during expected development workloads.

**Steps:**

1. Define the expected request mix.
2. Execute the workload for the agreed measurement period.
3. Record successful responses, client errors and server errors.
4. Calculate the error rate.

**Expected Result:**

- Error rate remains below the initial development target of 1%.
- Expected validation errors are distinguished from unexpected server
  failures.
- No financial data corruption occurs.

**Actual Result:** Not recorded.

**Status:** Not Executed.

### PERF-008 — Payment Processing Performance

**Objective:** Evaluate payment initiation and callback handling.

**Preconditions:**

- Payment provider sandbox or simulator is available.

**Steps:**

1. Submit controlled payment initiation requests.
2. Measure initiation response times.
3. Submit valid and duplicate callbacks.
4. Measure callback processing and final state visibility.
5. Verify ledger consistency.

**Expected Result:**

- Payment requests are processed according to the defined asynchronous
  payment lifecycle.
- Callback processing is reliable and idempotent.
- Provider confirmation is not confused with final settlement.
- Financial postings remain consistent.

**Actual Result:** Not recorded.

**Status:** Not Executed.

### PERF-009 — Frontend Production Build

**Objective:** Verify frontend build reliability and measure build time.

**Steps:**

1. Install dependencies using the approved lockfile.
2. Execute the production build.
3. Record build duration and generated artifact size.
4. Inspect build warnings and errors.

**Expected Result:**

- Production build completes successfully.
- No unresolved build errors exist.
- Build output is suitable for the intended deployment environment.

**Actual Result:** Not recorded.

**Status:** Not Executed.

### PERF-010 — Recovery After Load

**Objective:** Verify system recovery following a controlled load test.

**Steps:**

1. Execute an agreed load profile.
2. Stop the load generator.
3. Monitor API and database recovery.
4. Retrieve accounts and transaction records.
5. Reconcile test balances and financial postings.

**Expected Result:**

- The application returns to normal operating behaviour.
- No financial records are lost or duplicated.
- No unexplained balance differences occur.
- Recovery observations are documented.

**Actual Result:** Not recorded.

**Status:** Not Executed.

### PERF-011 — Stress Testing

**Objective:** Identify the operating limits and failure behaviour of the
platform.

**Steps:**

1. Begin with the established baseline workload.
2. Increase load beyond normal expected levels in controlled stages.
3. Monitor response times, errors and resource consumption.
4. Stop the test if predefined safety thresholds are reached.
5. Verify recovery and financial consistency.

**Expected Result:**

- Capacity limits and bottlenecks are identified.
- Failure behaviour is controlled and observable.
- The system does not silently corrupt financial records.

**Actual Result:** Not recorded.

**Status:** Not Executed.

### PERF-012 — Endurance Testing

**Objective:** Evaluate stability during sustained activity.

**Steps:**

1. Define a representative sustained workload.
2. Execute it for an agreed duration.
3. Monitor memory, CPU, database connections and error rates.
4. Inspect financial records and application health.

**Expected Result:**

- No progressive resource exhaustion occurs during the test.
- No unexplained transaction failures or data corruption occur.
- Resource trends and operational observations are recorded.

**Actual Result:** Not recorded.

**Status:** Not Executed.

## 7. Capacity Planning

FinPay is intended to support future growth beyond its initial development
workload.

Capacity planning must consider:

- Concurrent authenticated users
- Requests per second
- Transactions per second
- Peak payment periods
- Callback volume
- Database connections
- Background processing capacity
- Storage growth
- Network throughput
- Horizontal API scaling
- Database performance and connection limits

A future capacity objective of approximately 100,000 user flows must be
translated into measurable workload assumptions.

The term "100,000 flows" must be defined before testing. It could refer to
registered users, daily sessions, concurrent sessions or transaction
workflows. These are different capacity measures.

No 100,000-user or transaction-capacity claim may be made without a
documented workload model and repeatable test evidence.

## 8. Test Execution Record

| Test Case ID | Performance Area | Status | Evidence |
|---|---|---|---|
| PERF-001 | Authentication | Not Executed | Pending |
| PERF-002 | Account API | Not Executed | Pending |
| PERF-003 | Transaction API | Not Executed | Pending |
| PERF-004 | Concurrent users | Not Executed | Pending |
| PERF-005 | Concurrent transactions | Not Executed | Pending |
| PERF-006 | Database | Not Executed | Pending |
| PERF-007 | Error rate | Not Executed | Pending |
| PERF-008 | Payment processing | Not Executed | Pending |
| PERF-009 | Frontend build | Not Executed | Pending |
| PERF-010 | Recovery | Not Executed | Pending |
| PERF-011 | Stress testing | Not Executed | Pending |
| PERF-012 | Endurance testing | Not Executed | Pending |

## 9. Performance Test Exit Criteria

Performance testing is considered complete when:

- The test environment and workload are documented.
- Baseline response-time measurements are collected.
- Defined workload targets are evaluated.
- Concurrent financial operations preserve data integrity.
- Resource bottlenecks are documented.
- Critical performance defects are resolved or formally accepted.
- Recovery behaviour is verified.
- Evidence and test reports are retained.

## 10. Reporting Requirements

The final performance report should include:

- Environment and deployment version
- Hardware and resource allocation
- Database configuration
- Test tool and version
- Workload profile
- Virtual-user count
- Test duration
- Throughput
- p50, p95 and p99 latency
- Error rate
- CPU and memory utilization
- Database utilization
- Identified bottlenecks
- Financial integrity verification
- Defects and recommendations

Performance results must identify the environment and conditions under
which they were measured.

Development performance targets must not be represented as production
service-level agreements.
