# API sketch — FastAPI `/v1`

**Version:** 0.0.0 · **Status:** DECIDED shape (paths may refine)  
**Rule:** API-first. Web and mobile are clients. OpenAPI is the contract.

---

## Conventions

```text
Base:           /v1
Auth:           Bearer / session cookie (ADR-002)
Org context:    header X-Organization-Id OR path /orgs/{org_id}/...
                — always re-validated against membership
Idempotency:    Idempotency-Key on POST creates (appointments, sales, payments)
Money:          { amount_minor, currency } in JSON
Errors:         { code, message, details? } — no stack traces in prod
Time:           ISO-8601 UTC in API; clients display in org timezone
```

Anonymous: only public read surfaces + `/health`.

---

## Health

```text
GET  /health
GET  /v1/
```

---

## Identity

```text
POST /v1/auth/register
POST /v1/auth/login
POST /v1/auth/logout
POST /v1/auth/oauth/google
GET  /v1/me
PATCH /v1/me
POST /v1/me/export
DELETE /v1/me
GET  /v1/users/{username}          # public profile
```

---

## Organizations

```text
POST   /v1/orgs
GET    /v1/orgs/mine
GET    /v1/orgs/{org_id}
PATCH  /v1/orgs/{org_id}
GET    /v1/studios/{slug}          # public
GET    /v1/orgs/{org_id}/members
POST   /v1/orgs/{org_id}/members/invite
PATCH  /v1/orgs/{org_id}/members/{user_id}
GET    /v1/orgs/{org_id}/locations
POST   /v1/orgs/{org_id}/locations
PATCH  /v1/orgs/{org_id}/locations/{id}
GET    /v1/orgs/{org_id}/hours
PUT    /v1/orgs/{org_id}/hours
```

---

## Catalog & staff

```text
GET/POST   /v1/orgs/{org_id}/services
GET/PATCH  /v1/orgs/{org_id}/services/{id}
GET/POST   /v1/orgs/{org_id}/categories
GET/PATCH  /v1/orgs/{org_id}/staff/{user_id}/availability
GET/POST   /v1/orgs/{org_id}/staff/{user_id}/blocks
```

---

## Customers (CRM)

```text
GET/POST   /v1/orgs/{org_id}/customers
GET/PATCH  /v1/orgs/{org_id}/customers/{id}
```

Link to platform user when email/phone matches (optional).

---

## Booking

```text
POST /v1/orgs/{org_id}/availability/query
     body: { service_ids[], staff_id?, range_start, range_end, location_id? }
     → slots[]

POST /v1/orgs/{org_id}/appointments
     Idempotency-Key required
     body: { customer…, services[], staff_id?, starts_at, source_post_id?, … }

GET  /v1/orgs/{org_id}/appointments
GET  /v1/orgs/{org_id}/appointments/{id}
POST /v1/orgs/{org_id}/appointments/{id}/confirm
POST /v1/orgs/{org_id}/appointments/{id}/decline
POST /v1/orgs/{org_id}/appointments/{id}/cancel
POST /v1/orgs/{org_id}/appointments/{id}/complete
POST /v1/orgs/{org_id}/appointments/{id}/no-show

GET  /v1/me/appointments                 # consumer
```

---

## Sales & payments

```text
POST /v1/orgs/{org_id}/sales
GET  /v1/orgs/{org_id}/sales
GET  /v1/orgs/{org_id}/sales/{id}
POST /v1/orgs/{org_id}/sales/{id}/payments
POST /v1/orgs/{org_id}/sales/{id}/refunds   # V1 basic or later — OPEN depth
```

Complete appointment may optionally create a draft sale in one transaction (domain service).

---

## Purchasing · inventory · expenses

```text
GET/POST  /v1/orgs/{org_id}/suppliers
GET/POST  /v1/orgs/{org_id}/purchase-orders
POST      /v1/orgs/{org_id}/purchase-orders/{id}/receive
GET/POST  /v1/orgs/{org_id}/supplier-invoices

GET/POST  /v1/orgs/{org_id}/inventory/items
GET/POST  /v1/orgs/{org_id}/inventory/movements

GET/POST  /v1/orgs/{org_id}/expenses
```

---

## Payroll & finance

```text
GET/PUT   /v1/orgs/{org_id}/staff/{user_id}/compensation
GET/POST  /v1/orgs/{org_id}/payroll/periods
POST      /v1/orgs/{org_id}/payroll/runs
GET       /v1/orgs/{org_id}/payroll/runs/{id}

GET/POST  /v1/orgs/{org_id}/financial-accounts
GET       /v1/orgs/{org_id}/financial-accounts/{id}/movements
POST      /v1/orgs/{org_id}/reconciliations   # end-of-day basic

GET/POST  /v1/orgs/{org_id}/exchange-rates
GET       /v1/currencies
```

---

## Reviews

```text
POST /v1/appointments/{id}/reviews     # only if completed + eligible
GET  /v1/studios/{slug}/reviews
```

---

## Media

```text
POST /v1/orgs/{org_id}/media/upload-url    # signed PUT to R2
POST /v1/orgs/{org_id}/media/confirm
GET  /v1/media/{id}                        # metadata; URL if authorized
```

---

## Social bridge (Postgres → Convex)

Most social reads/writes go through Convex client SDK. FastAPI still exposes:

```text
POST /v1/orgs/{org_id}/posts/publish-intent   # optional: validate services, create media binding
GET  /v1/internal/…                           # worker/webhook — not public
```

Booking/payment events emit to Convex via outbox/worker (not in request critical path for money).

---

## Platform admin

```text
GET  /v1/platform/orgs
POST /v1/platform/moderation/…
POST /v1/platform/support-mode
```

Audited.

---

## Versioning

Breaking changes → `/v2`. Additive fields OK in `/v1` with care.

---

## Related

- [DATA_BOUNDARIES.md](../01-domain/DATA_BOUNDARIES.md)
- [NOTIFICATIONS_MODEL.md](../01-domain/NOTIFICATIONS_MODEL.md)
- [PERMISSIONS_MODEL.md](../01-domain/PERMISSIONS_MODEL.md)
- [BOOKING_MODEL.md](../01-domain/BOOKING_MODEL.md)
