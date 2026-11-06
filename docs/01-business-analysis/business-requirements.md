# FinPay Business Analysis and Requirements

## 1. Purpose

This document defines the intended business capabilities and functional/non-functional requirements for FinPay. Requirements are target-state requirements until implementation and acceptance evidence are recorded.

## 2. Business goals

- Simplify access to everyday digital financial services.
- Provide transparent and traceable money movement.
- Reduce uncertainty around payment status and transaction history.
- Provide consistent experiences across web and Android.
- Establish a foundation for additional payment providers and markets.

## 3. Actors

- **Customer:** registers, authenticates, views account information, funds an account, transfers funds, requests payouts and views transaction records.
- **Support agent:** investigates customer issues using restricted, audited access.
- **Operations officer:** monitors payment queues, reconciles provider activity and manages permitted operational exceptions.
- **Administrator:** manages roles, configuration and access under least-privilege controls.
- **Payment provider:** processes external payment requests and sends asynchronous status notifications.
- **Notification provider:** delivers approved email, SMS or push messages.

## 4. Functional requirements

| ID | Requirement |
|---|---|
| FR-001 | The system shall allow a customer to register with the required identity and contact details. |
| FR-002 | The system shall verify nominated contact channels before activating the relevant account capabilities. |
| FR-003 | The system shall securely store passwords using an approved adaptive password-hashing algorithm. |
| FR-004 | The system shall allow customers to authenticate and securely terminate sessions. |
| FR-005 | The system shall support transaction PIN setup and verification for sensitive financial actions. |
| FR-006 | The system shall enforce retry limits and temporary lockout for failed PIN attempts. |
| FR-007 | The system shall allow an eligible customer to view their account details and available balance. |
| FR-008 | The system shall allow customers to initiate account funding through supported payment providers. |
| FR-009 | The system shall maintain payment requests and asynchronous provider outcomes as distinct states. |
| FR-010 | The system shall credit an account only after a valid, verified funding outcome has been accepted. |
| FR-011 | The system shall allow eligible customers to transfer funds to another eligible FinPay account. |
| FR-012 | The system shall validate balance, currency, account status, limits and authorisation before a transfer. |
| FR-013 | The system shall prevent duplicate processing of the same financial instruction. |
| FR-014 | The system shall support withdrawal/payout requests through approved providers where enabled. |
| FR-015 | The system shall provide transaction history, references, statuses and receipts. |
| FR-016 | The system shall notify customers of important account and transaction events. |
| FR-017 | The system shall provide authorised operations users with payment investigation and reconciliation tools. |
| FR-018 | The system shall maintain immutable or tamper-evident audit records for sensitive actions. |
| FR-019 | The system shall enforce role-based access for customer, support, operations and administrator functions. |
| FR-020 | The system shall provide a responsive web experience and an Android mobile experience. |
| FR-021 | The system shall support customer support workflows for disputed, delayed or failed transactions. |
| FR-022 | The system shall support configurable transaction limits and risk controls. |

## 5. Non-functional requirements

| ID | Quality attribute | Requirement |
|---|---|---|
| NFR-001 | Security | Protect credentials, tokens, PINs and payment data using current security practices. |
| NFR-002 | Privacy | Collect and process only data needed for defined purposes; apply retention and access controls. |
| NFR-003 | Integrity | Financial state changes must be atomic, traceable and protected against duplicate or concurrent processing. |
| NFR-004 | Availability | Define availability objectives and recovery targets before production release. |
| NFR-005 | Performance | Establish measurable latency and throughput targets through workload modelling and testing. |
| NFR-006 | Scalability | Support horizontal scaling of stateless application components where appropriate. |
| NFR-007 | Usability | Use clear language, consistent navigation, accessible controls and understandable transaction statuses. |
| NFR-008 | Compatibility | Support agreed modern browsers and Android versions. |
| NFR-009 | Maintainability | Use modular boundaries, code review, automated tests and documented interfaces. |
| NFR-010 | Observability | Record structured logs, metrics, traces and actionable alerts without exposing secrets. |
| NFR-011 | Recoverability | Maintain tested backup, restore and disaster-recovery procedures. |
| NFR-012 | Auditability | Retain traceable records of financial and privileged operations in line with approved retention policy. |

Numerical service-level objectives must be approved and supported by measured capacity and operational evidence.

## 6. Core business rules

1. A customer may access only their own profile, account and transaction information unless an explicitly authorised staff role permits otherwise.
2. A customer must complete the required onboarding checks before account capabilities are activated.
3. A transaction PIN is required for defined high-risk financial actions.
4. A transaction amount must be greater than zero and comply with configured limits.
5. A transfer must not debit more than the available spendable balance.
6. Source and destination accounts must be eligible and compatible with the transaction currency.
7. A transaction reference must be unique.
8. An external payment request remains pending until a trusted provider outcome is processed.
9. Duplicate callbacks or repeated requests must not create duplicate financial effects.
10. Reversals and refunds must be represented as linked compensating financial entries; historical financial records must not be silently overwritten.
11. Staff actions must be authorised, attributable and audited.
12. Customer-facing statuses must not imply settlement when only initiation or acceptance has occurred.

## 7. Key use cases

### UC-01 — Customer onboarding

**Primary actor:** Customer  
**Preconditions:** Customer has access to a valid contact channel.  
**Main flow:** Submit registration details → validate details → send verification challenge → verify contact → set password → complete required identity checks → create/activate account → set transaction PIN → show onboarding completion.  
**Alternative flows:** Duplicate contact, invalid challenge, expired challenge, retry limit reached, provider delivery failure, identity review required.  
**Postcondition:** Customer profile and account are in the appropriate lifecycle state.

### UC-02 — Fund account using M-Pesa

**Primary actor:** Customer  
**Preconditions:** Customer is authenticated, account is eligible and provider integration is available.  
**Main flow:** Enter amount and phone → review fee/amount → confirm with transaction PIN or required step-up control → create pending payment instruction → request STK Push → customer approves on handset → provider sends callback → validate callback and correlate payment → post financial credit exactly once → notify customer and provide receipt.  
**Alternative flows:** Rejected prompt, timeout, cancelled request, callback delay, invalid callback, duplicate callback, amount mismatch or reconciliation exception.  
**Postcondition:** Payment and account ledger reflect the verified outcome.

### UC-03 — Internal transfer

**Primary actor:** Customer  
**Preconditions:** Customer is authenticated and source account is eligible.  
**Main flow:** Select recipient → enter amount → show confirmation → verify transaction PIN → validate limits and available balance → atomically post debit and credit entries → issue reference and receipt → notify parties.  
**Alternative flows:** Invalid recipient, insufficient funds, account restriction, PIN lockout, duplicate request, concurrent debit conflict or posting failure.  
**Postcondition:** Both sides of the transfer are consistent or neither side is posted.

### UC-04 — Withdrawal or payout

**Primary actor:** Customer  
**Preconditions:** A payout provider and customer eligibility are configured.  
**Main flow:** Select destination/channel → enter amount → review fees and net payout → authenticate action → validate balance and limits → create pending payout → submit to provider → process asynchronous outcome → post completion or failure/reversal → notify customer.  
**Alternative flows:** Provider unavailable, rejection, timeout, pending result, returned payout or reconciliation mismatch.

### UC-05 — Transaction investigation

**Primary actor:** Support/operations user  
**Preconditions:** Staff user has appropriate role and case-related access.  
**Main flow:** Search by reference → verify customer and permissions → inspect lifecycle and provider events → compare ledger and provider records → record findings → initiate approved resolution workflow.  
**Postcondition:** Case activity is recorded and any financial adjustment follows maker-checker controls.

## 8. Acceptance principles

A requirement is accepted only when its acceptance criteria are met, the relevant tests have passed, defects are resolved or formally accepted, and evidence is linked. A written requirement alone does not prove delivery.
