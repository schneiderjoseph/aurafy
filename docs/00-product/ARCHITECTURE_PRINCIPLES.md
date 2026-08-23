# Architecture principles — scalable by design

Stack is decided ([STACK_DECISION.md](STACK_DECISION.md)). These constraints bind **all** implementation. A spike that violates a MUST is a **negative result**, even if the demo looks good.

Inspired by Kontrest P-rules; Aurafy-specific numbering: **AF-P\***.

---

## AF-P1 — Tenant-ready keys from day one (MUST)

Every business table carries `organization_id` (or platform-level isolation) from the first migration.

Multi-tenant **features** (billing UI, platform admin) can lag MVP — the **data shape** cannot.

## AF-P2 — Global user, scoped memberships (MUST)

```text
User (platform)
  ├── organization_members (staff / owner / …)
  └── customer_organizations (CRM link to N studios)
```

Never model “user belongs to one salon” as the primary identity.

## AF-P3 — API-first (MUST)

Every capability exists as a versioned HTTP API (`/v1`) before or independently of any UI. Web, mobile, webhooks, and future public API are clients. **No business rule may live only in a screen.**

## AF-P4 — Engines are pure domain modules (MUST)

Booking availability, commissions, plan limits, feed ranking inputs are pure functions:

- no I/O inside the math;
- unit-tested against documented oracles;
- policies injected, not hardcoded silent defaults.

## AF-P5 — Idempotent mutations (MUST)

Creates that can retry (offline outbox, flaky mobile, webhooks) carry an idempotency key / `mutation_id`. Replaying must not double-book or double-charge.

**Financial commands are always idempotent (AF-PAY):** create payment, receive purchase, post payroll run, record expense, record inventory movement tied to money. A repeated request with the same idempotency key must not create a second financial transaction.

## AF-P6 — Declared policies, not hidden defaults (MUST)

Cancellation window, deposit %, timezone, currency, valuation — explicit per organization/location with recorded values. Silent defaults are how trust dies.

## AF-P7 — Split stores by job (MUST)

| Store | Owns |
|---|---|
| **PostgreSQL** | Organizations, memberships, services, appointments, orders, payments, subscriptions, inventory, audit, **notification jobs / templates / consent / delivery state** |
| **Convex** | Posts, likes, comments, saves, follows, conversations, messages, **in-app** notifications |
| **R2** | Media bytes; metadata IDs live in Postgres/Convex |
| **Resend** | Email transport only — not source of truth |

Do not put ERP ledgers in Convex. Do not put chat history only in Postgres if realtime UX depends on Convex.

## AF-P8 — AuthZ on the server (MUST)

UI may hide controls; **server must enforce** organization membership, role, permission, and plan entitlement. Tenant id comes from verified session — never trusted from body alone.

## AF-P9 — Money and time are first-class (MUST)

- Amounts in minor units (cents) + currency on the row — never a bare number
- Multi-currency from day one: org base currency + allowed currencies + exchange rate snapshots on every conversion
- Never recalculate historical amounts with today's rate
- Sale currency and payment currency may differ
- Store UTC; display in organization/location timezone
- Financial snapshots (price at sale, commission rule at earning) are immutable
- Separate operational, financial, and accounting layers — purchases ≠ expenses ≠ payroll

## AF-P10 — Everything auditable (MUST)

Who changed appointment, price, role, inventory, billing — before/after, actor, time. Support “break glass” access is explicit and audited.

## AF-P11 — Private media by default (MUST)

Customer record photos are not world-readable URLs. Public portfolio posts are an explicit visibility choice. Signed URLs / controlled access for private objects.

## AF-P12 — Online booking is a product surface, not an afterthought (MUST)

Availability accounts for business hours, staff hours, buffers, existing appointments, blocks, multi-service duration, booking window, and policies.

## AF-P13 — Boring, replaceable infrastructure (SHOULD)

Prefer Postgres + one API + managed Convex/R2 over microservices in MVP. Scale path: indexes → read models → partition — not premature distributed systems.

## AF-P14 — Complexity must be earned (MUST)

No Redis, Kubernetes, event bus, or second database “for seriousness”. Add when a measured pain appears. Aligns with production-app-standard PRINCIPLES.

## AF-P15 — Clients compute nothing critical (MUST)

Web/mobile may format and optimistic-UI; authoritative totals, availability, entitlements, and permissions are computed server-side (or in documented pure domain modules called by the server).

## AF-P16 — Standards are gates, not posters (MUST)

P0 items from production-app-standard, vibe-prod-rules, and design-system-standard block merge/ship. Passing unit tests alone ≠ production-ready.
