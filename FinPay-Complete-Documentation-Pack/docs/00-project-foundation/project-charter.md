# FinPay Project Charter

## 1. Project identity

**Name:** FinPay
**Category:** Digital financial services / fintech platform
**Initial market focus:** Kenya
**Primary interfaces:** Responsive web application and Android mobile application
**Primary users:** Individual customers, operations/support personnel and system administrators.

## 2. Executive summary

FinPay is intended to provide a unified digital platform through which customers can securely onboard, access a digital account, fund it through supported payment channels, transfer funds, make withdrawals or payouts where supported, and monitor their financial activity. The platform aims to make common digital financial interactions convenient, transparent and accessible while maintaining strong controls over identity, authentication, authorisation, transaction integrity and auditability.

The first product release is intended to establish the core customer and account lifecycle, local payment integration, transaction history, operational visibility and a foundation for future payment-channel expansion.

## 3. Problem statement

Customers often interact with financial services through fragmented channels and inconsistent user experiences. Funding, transfers, transaction tracking and customer support may be spread across separate applications or processes. Users need a clear view of their account activity and understandable transaction outcomes. FinPay is intended to address this by bringing core account and payment interactions into one consistent digital experience.

This statement describes the product opportunity; it is not a claim that all existing financial platforms share the same deficiencies.

## 4. Vision

To provide a secure, accessible and extensible digital financial platform that simplifies everyday money movement and gives customers clear visibility and control over their financial activity.

## 5. Objectives

- Provide a straightforward customer registration and onboarding experience.
- Establish secure customer authentication and account access.
- Provide a digital account view with balances and transaction history.
- Support deposits/funding through approved payment integrations, beginning with M-Pesa.
- Support customer-to-customer transfers subject to account, balance, risk and authorisation controls.
- Support withdrawals or payouts through approved channels when available.
- Give customers clear transaction statuses, references, receipts and notifications.
- Give authorised operations staff tools to investigate and resolve payment issues.
- Maintain a reliable financial record and reconciliation process.
- Establish a modular architecture that can accommodate additional currencies, payment providers and markets.

## 6. Scope

### 6.1 Intended in-scope capabilities

- Customer registration and onboarding.
- Email and/or phone verification.
- Password setup, login, logout and session/token lifecycle.
- Transaction PIN setup, verification, retry limits and temporary lockout.
- Customer profile and account management.
- Account balance and transaction history.
- M-Pesa STK Push funding and asynchronous callback processing.
- Internal transfers between eligible FinPay accounts.
- Withdrawal/payout workflow through supported providers.
- Payment and transaction status management.
- Receipts, alerts and notifications.
- Customer support and administrative operations.
- Audit logging, monitoring, reconciliation and reporting.
- Web and Android customer experiences.
- Security, QA, DevOps and operational readiness.

### 6.2 Future or conditional scope

- Multiple currencies and cross-border transfers.
- Bank transfers and card acquiring.
- Additional mobile-money providers.
- ISO 8583 message processing and bank/payment-switch connectivity.
- Merchant payments, bill payments and bulk disbursements.
- Advanced fraud scoring and machine-learning-assisted monitoring.
- Additional regional markets and localisation.

These items require separate business, regulatory, provider and technical assessment before commitment.

### 6.3 Out of scope for an initial academic MVP unless separately approved

- Acting as a bank or deposit-taking institution.
- Issuing credit or lending.
- Custody of cryptocurrency or trading in digital assets.
- Guaranteed real-world settlement without a contracted and tested provider.
- Production financial services before licensing, compliance, security and provider approvals are satisfied.

## 7. Stakeholders and responsibilities

| Stakeholder | Interest / responsibility |
|---|---|
| Product owner | Product vision, scope, priorities and acceptance |
| Business analyst | Requirements, workflows, business rules and traceability |
| Project manager | Schedule, resources, risks, communication and change control |
| Solution architect | Architecture, integrations, non-functional design and technical decisions |
| Backend developer | API, domain logic, payment orchestration and data access |
| Web developer | Responsive customer and staff web interfaces |
| Android developer | Kotlin mobile application and device integration |
| QA engineer | Test design, execution, defect tracking and quality reporting |
| Security reviewer | Threat assessment, security controls and verification |
| Operations/support | Monitoring, reconciliation, customer issue handling and incident response |
| Customers | Use the platform and provide feedback through approved channels |
| External providers | Payment execution, identity/communications services and settlement reporting |

## 8. Success measures

Targets should be agreed before release and measured using evidence. Candidate measures include onboarding completion rate, successful payment completion rate, transfer success rate, transaction-status accuracy, support resolution time, application availability, API latency, reconciliation variance, security defect closure and customer satisfaction.

Do not assign numerical targets without a baseline, capacity plan and business approval.

## 9. Assumptions and dependencies

- FinPay will use a regulated and appropriately authorised provider for payment execution.
- Provider sandbox access, credentials, callback configuration and documentation will be available.
- Supabase-hosted PostgreSQL is the current database hosting direction.
- Email/SMS delivery requires an approved external provider.
- Legal, compliance and operational requirements will be reviewed before live launch.
- External provider uptime, limits, fees and settlement timelines affect service behaviour.

## 10. Constraints

The project is developed within an academic/capstone context and has finite time and resources. Live payment processing, regulatory permissions, provider onboarding, penetration testing and production operations may require external approvals and services beyond the project team's direct control.

## 11. High-level delivery phases

1. Product definition and business analysis.
2. UX research, journeys and interface design.
3. Architecture, database and API contracts.
4. Customer onboarding and account foundation.
5. Core account and transaction services.
6. M-Pesa and payment-provider integration.
7. Web and Android application completion.
8. Security hardening and QA.
9. Deployment, monitoring and operational validation.
10. UAT, documentation, presentation and controlled release decision.
