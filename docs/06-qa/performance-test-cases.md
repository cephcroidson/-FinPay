# FinPay Performance Test Cases

## 1. Purpose

This document defines performance test cases for the FinPay payment
platform.

Testing focuses on API response time, concurrent requests, database
performance, transaction processing, frontend build performance, and system
stability under load.

## 2. Performance Testing Scope

- API response time
- Authentication performance
- Account API performance
- Transaction API performance
- Database query performance
- Concurrent users
- Concurrent transactions
- Error rate under load
- Resource utilization
- Frontend build performance
- System stability
- Recovery after load

## 3. Performance Objectives

The following are initial performance targets for the development environment:

| Metric | Target |
|---|---|
| Authentication response | < 1 second |
| Account API response | < 1 second |
| Transaction API response | < 2 seconds |
| Error rate under normal load | < 1% |
| Database availability | 99% during test |
| Frontend production build | Successful |
| System recovery after load | No data corruption |

Targets may be adjusted after baseline measurements are collected.

---

## 4. Test Environment

**Backend:**

```text
Spring Boot
Java 25
Maven
