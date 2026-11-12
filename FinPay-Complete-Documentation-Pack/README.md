# FinPay — Complete Project Documentation

**Project:** FinPay
**Document pack:** Target-state product and system specification
**Version:** 1.0
**Audience:** Tracom Academy assessors, product stakeholders, business analysts, developers, QA, operations and future maintainers.

## 1. Documentation purpose

This pack defines the intended FinPay product: what it is meant to solve, who it serves, how it should behave, and how it should be designed, built, tested, secured and operated. It is a forward-looking specification and development baseline, not a declaration that every capability is already implemented.

The documents use these labels:

- **Target requirement:** a capability FinPay is intended to provide.
- **Design decision:** the proposed approach that should guide implementation.
- **Acceptance criterion:** an observable condition used to determine whether a requirement is satisfied.
- **Implementation evidence:** code, test results, configuration or operational evidence that demonstrates delivery. Evidence must be recorded separately from the target requirement.

Existing QA execution reports in `docs/06-qa` and `docs/qa` are retained as historical project evidence. They should not be interpreted as proof that every target-state requirement in this pack has been delivered.

## 2. Product summary

FinPay is a proposed digital financial services platform designed to provide customers with a secure and convenient way to register, access a digital account, manage funds, initiate payments, transfer money, and review transaction activity. The intended initial market is Kenya, with a design that can be extended to additional markets, currencies and payment rails.

The platform is intended to combine a responsive web application, an Android mobile application, a secure backend API, a relational data store, and integrations with external payment providers. M-Pesa is a priority local payment channel. The architecture should allow future integration with banks, card processors, international payment service providers and ISO 8583-based payment networks where commercially and technically appropriate.

## 3. Documentation map

| Area | Document |
|---|---|
| Project overview, scope and objectives | `docs/00-project-foundation/project-charter.md` |
| Business analysis and requirements | `docs/01-business-analysis/business-requirements.md` |
| Product behaviour and user journeys | `docs/02-product-design/product-specification.md` |
| Architecture and technical decisions | `docs/03-system-architecture/system-architecture.md` |
| Data model and dictionary | `docs/04-data-design/data-model.md` |
| Payments and financial processing | `docs/05-payment-system/payment-system.md` |
| API standards and endpoint catalogue | `docs/06-api/api-specification.md` |
| Security, privacy and compliance design | `docs/07-security/security-and-compliance.md` |
| QA approach and acceptance coverage | `docs/08-quality-assurance/quality-assurance-plan.md` |
| Environments, delivery and operations | `docs/09-devops-operations/devops-and-operations.md` |
| Project delivery and risk controls | `docs/10-project-management/project-management-plan.md` |
| End-user and support procedures | `docs/11-user-guides/user-and-support-guide.md` |
| Academic and technical report structure | `docs/12-final-report/final-project-report.md` |
| Shared glossary | `docs/glossary.md` |

## 4. Proposed technology direction

- Backend: Java and Spring Boot REST API.
- Web: React, TypeScript, Vite and Tailwind CSS.
- Mobile: Kotlin and Android Jetpack Compose.
- Data: PostgreSQL, with Supabase-hosted PostgreSQL as the selected hosting direction.
- Authentication: secure password hashing, token-based API authentication and transaction-level authorisation.
- Integrations: M-Pesa Daraja API initially; provider adapters for future payment rails.
- Delivery: Git, automated builds and tests, Docker-based packaging, environment-based configuration and controlled deployment.

Technology versions and provider products must be confirmed against the actual build configuration at implementation time.

## 5. Guiding principles

1. The backend is authoritative for balances, transaction state, account ownership and payment outcomes.
2. Every financial movement must be traceable and auditable.
3. A client must never be trusted to calculate or directly set a financial balance.
4. Payment initiation is not the same as payment completion.
5. Failed, pending, reversed and completed transactions must be represented distinctly.
6. Sensitive information must be protected in transit, at rest and in logs.
7. Customer experience must be accessible, understandable and consistent across web and mobile.
8. The system must be designed for reliability, reconciliation, recovery and controlled growth.
9. Requirements, design, implementation and test evidence must remain traceable.
10. Security and regulatory obligations must be validated with qualified providers and relevant authorities before any live financial service launch.

## 6. Status and change control

This pack describes the intended target state. When implementation decisions change, update the relevant design document and record significant architectural changes as Architecture Decision Records (ADRs). Do not silently change financial rules, API contracts, security assumptions or data definitions.
