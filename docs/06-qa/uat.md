# FinPay User Acceptance Testing (UAT)

## 1. Purpose

This document defines the User Acceptance Testing process for the FinPay
payment platform.

UAT verifies that FinPay meets expected business and user requirements before
release.

## 2. UAT Scope

UAT covers:

- User registration
- User login
- JWT authentication
- Account creation
- Account access control
- Deposits
- Withdrawals
- Transfers
- Transaction validation
- Transaction history
- Error handling
- Frontend functionality
- Security expectations

## 3. UAT Preconditions

- FinPay backend is running.
- PostgreSQL database is available.
- Frontend is available.
- Required test users exist.
- Test accounts have appropriate balances.
- API authentication is operational.
- Test environment is stable.

## 4. UAT Test Scenarios

| ID | Scenario | Expected Result |
|---|---|---|
| UAT-001 | Register a valid user | User is successfully registered |
| UAT-002 | Login with valid credentials | JWT token is returned |
| UAT-003 | Login with invalid password | Request is rejected |
| UAT-004 | Create an account | Account is created successfully |
| UAT-005 | Access protected endpoint without JWT | Request is rejected |
| UAT-006 | Deposit funds | Account balance increases |
| UAT-007 | Withdraw available funds | Account balance decreases |
| UAT-008 | Withdraw insufficient funds | Transaction is rejected |
| UAT-009 | Transfer between accounts | Source decreases and destination increases |
| UAT-010 | Transfer insufficient funds | Transfer is rejected |
| UAT-011 | Submit invalid transaction data | Validation error is returned |
| UAT-012 | Access another user's protected resource | Access is denied |
| UAT-013 | Verify frontend build | Production build completes successfully |
| UAT-014 | Verify transaction records | Database reflects completed transactions |

## 5. Acceptance Criteria

The system may be accepted when:

- Critical UAT scenarios pass.
- Authentication works correctly.
- Authorization prevents unauthorized access.
- Financial transactions update balances correctly.
- Invalid transactions are rejected.
- Database records remain consistent.
- No unresolved Critical or High severity defects remain.
- Backend tests pass.
- Frontend production build succeeds.
- Security checks have been completed.

## 6. UAT Evidence

Evidence may include:

- API request and response output
- Browser screenshots
- PostgreSQL verification queries
- Application logs
- Maven test results
- Frontend build results

Sensitive credentials and JWT tokens must not be committed.

## 7. UAT Result

**Status:** Pending final execution

**Approval:** Pending

**Release Decision:** Pending
