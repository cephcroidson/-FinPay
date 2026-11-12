# FinPay API Specification

## 1. API principles

The FinPay backend exposes a versioned REST API over HTTPS. The API is the controlled interface for web, Android and authorised staff clients. Financial business rules must be enforced server-side.

## 2. Standards

- Base path: `/api/v1` for the target versioned contract.
- JSON request and response bodies.
- UTF-8 encoding.
- ISO 8601 timestamps in UTC.
- Monetary values represented as decimal strings or JSON numbers with documented precision; never use binary floating-point calculations.
- Bearer token authentication for protected endpoints.
- Role- and resource-level authorisation.
- Consistent validation and error response format.
- Pagination for collection endpoints.
- Idempotency keys for financial initiation endpoints.
- Correlation ID returned or propagated for support and tracing.

The `/api/v1` prefix is a target contract convention. Existing unversioned routes may require a migration or compatibility plan.

## 3. Proposed endpoint catalogue

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/auth/register` | Register customer | Public |
| POST | `/auth/verify-contact` | Verify contact challenge | Public / challenge token |
| POST | `/auth/login` | Authenticate | Public |
| POST | `/auth/refresh` | Refresh session/token | Authenticated session |
| POST | `/auth/logout` | Revoke session | Authenticated |
| POST | `/auth/password/forgot` | Start recovery | Public |
| POST | `/auth/password/reset` | Complete recovery | Recovery token |
| GET | `/customers/me` | Retrieve own profile | Customer |
| PATCH | `/customers/me` | Update permitted profile fields | Customer |
| GET | `/accounts` | List own accounts | Customer |
| GET | `/accounts/{accountId}` | Retrieve own account | Owner / authorised staff |
| POST | `/payments/mpesa/stk-push` | Initiate M-Pesa funding | Customer |
| POST | `/payments/provider-callbacks/mpesa` | Receive provider callback | Provider-authenticated endpoint |
| POST | `/transfers` | Initiate internal transfer | Customer |
| POST | `/payouts` | Initiate payout | Customer |
| GET | `/transactions` | List own transactions | Customer |
| GET | `/transactions/{reference}` | Retrieve transaction detail | Owner / authorised staff |
| POST | `/transactions/{reference}/receipt` | Retrieve/generate receipt | Owner / authorised staff |
| GET | `/notifications` | List own notifications | Customer |
| PATCH | `/notifications/{id}/read` | Mark notification read | Customer |
| POST | `/support/cases` | Create support case | Customer |
| GET | `/health/live` | Liveness probe | Restricted/public per deployment |
| GET | `/health/ready` | Readiness probe | Restricted/public per deployment |

This is a proposed target catalogue, not a claim that all endpoints currently exist.

## 4. Example transfer request

```http
POST /api/v1/transfers
Authorization: Bearer <access-token>
Idempotency-Key: 8e8a1a5d-unique-client-generated-value
Content-Type: application/json
```

```json
{
  "sourceAccountId": "acc_123",
  "destination": {
    "accountNumber": "••••••••4821"
  },
  "amount": "1250.00",
  "currency": "KES",
  "transactionPin": "<provided securely>",
  "description": "Personal transfer"
}
```

The PIN should be sent only over TLS, excluded from logs and handled under a strict secret-handling policy. A future design may use a dedicated challenge or device-bound authorisation mechanism instead of sending a reusable PIN in a general request body.

## 5. Example accepted response

```json
{
  "reference": "FP-TXN-EXAMPLE",
  "status": "PENDING",
  "amount": "1250.00",
  "currency": "KES",
  "createdAt": "2026-01-01T10:15:30Z",
  "message": "Your transfer is being processed."
}
```

A transfer may return `COMPLETED` only when the financial posting has succeeded. The exact response status code and body must be fixed in the OpenAPI contract.

## 6. Standard error shape

```json
{
  "type": "https://finpay.example/problems/validation-error",
  "title": "Request validation failed",
  "status": 400,
  "code": "VALIDATION_ERROR",
  "detail": "One or more fields are invalid.",
  "correlationId": "example-correlation-id",
  "fieldErrors": [
    {
      "field": "amount",
      "message": "Amount must be greater than zero."
    }
  ]
}
```

Do not expose stack traces, SQL details, secrets, internal hostnames or sensitive risk rules.

## 7. API security requirements

- TLS for all non-local traffic.
- Strict input validation and output shaping.
- Authentication and resource ownership checks.
- Rate limiting for login, OTP, PIN and payment initiation.
- Idempotency for financial operations.
- Request size and content-type limits.
- CORS restricted to approved origins.
- Secure token storage and revocation strategy.
- Audit events for sensitive operations.
- Provider callback authentication and replay protection.
- OpenAPI documentation reviewed alongside implementation.

## 8. API contract management

Maintain an OpenAPI specification as the contract source. Version breaking changes, define deprecation windows, provide examples and validate the contract in CI. Generate or verify client models where practical.
