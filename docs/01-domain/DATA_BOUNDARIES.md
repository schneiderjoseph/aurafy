# Data boundaries — PostgreSQL · Convex · R2

**Version:** 0.0.0  
**Rule:** Each store owns what it is best at. Sync via explicit events and stable IDs.

---

## Summary

| Store | Role | Authority |
|---|---|---|
| **PostgreSQL** | Transactional + financial + CRM + booking + notification jobs | **Source of truth** for business |
| **Convex** | Social graph, chat, in-app notify UI | **Source of truth** for realtime social |
| **R2** | Binary media | **Source of truth** for file bytes |
| **Resend** | Email transport | Provider only |
| **Redis** | Cache/queue | Not in V0/V1 until earned (AF-P14) |

---

## PostgreSQL owns

```text
Users, memberships, organizations, locations
Customers (customer_organizations CRM), staff, catalog, appointments
Sales, payments, purchases, inventory, expenses, payroll
Financial accounts, exchange rates, accounting foundation
SaaS billing (plans, subscriptions, entitlements)
Audit logs, idempotency keys, outbox (if used)
Media metadata (id, org, visibility, r2_key, variants)
Notification templates, events, deliveries, preferences, consents
Booking notification settings
```

Characteristics:

- ACID transactions across money + inventory + appointments
- Row-level tenant scoping + server-side authz
- Migrations via Alembic
- Historical immutability on financial snapshots

---

## Convex owns

```text
Posts, likes, comments, saves, follows
Feed ranking inputs (engagement counters denormalized)
Conversations, messages, typing/read receipts (optional)
In-app notification inbox (realtime)
Optimistic social interactions
```

Characteristics:

- Reactive queries for feed and chat
- Optimistic updates for like/save/comment
- Must not be sole store for money or booking truth

---

## Resend owns

```text
Email transport (API + delivery webhooks)
```

Not source of truth for reminder existence — that is `notification_deliveries` in Postgres.

---

## R2 owns

```text
Image originals, thumbnails, medium variants
(future) video, reels
```

Metadata in Postgres:

```text
media_assets
  id, organization_id, type (IMAGE|VIDEO), visibility (public|private)
  r2_bucket, r2_key, mime, width, height, variants_json
  created_by, created_at
```

Access:

- Public portfolio → CDN-friendly public or signed short TTL
- Private customer photos → signed URLs, org-scoped auth check

---

## Cross-boundary flows

### Publish post

```text
1. Client uploads bytes → API → R2
2. API writes media_assets (Postgres)
3. API/Convex mutation creates post (Convex) with media_id, org_id, service_ids[]
4. Feed subscribers receive update (Convex)
```

### Book from post

```text
1. Client reads post (Convex) + services (Postgres cache or API)
2. Client calls POST /v1/appointments (FastAPI)
3. Postgres creates appointment (requested)
4. Event → Convex notification to studio + customer
5. Chat may receive system message (Convex)
```

### Complete appointment → review

```text
1. Staff marks completed (FastAPI → Postgres)
2. API sets review_eligible flag / emits event
3. Consumer UI enables review (Postgres)
4. Review may surface on org profile (Postgres + optional Convex activity)
```

### Sale with inventory

```text
1. Single Postgres transaction:
   sale + payments + inventory_movements + commission snapshots
2. No Convex in critical path
```

---

## What never goes in Convex

- Payment amounts, balances, payroll totals
- Appointment slot authority / availability locks
- Exchange rates, inventory quantities
- Subscription entitlements (read via API)

---

## Idempotency & offline

- Booking creates: idempotency key → Postgres (authoritative)
- Mobile outbox may queue **safe** mutations; server rejects conflicts
- Social likes: Convex optimistic; duplicate like = dedupe by (user, post)

---

## Future sync options

```text
FastAPI --webhook/event--> Convex (appointment.created, message.system)
Postgres outbox table --> worker --> Convex (at-least-once, idempotent handlers)
```

Not implemented in V0. Document handlers when V1 starts.

---

## Related

- [DOMAIN_MODEL.md](DOMAIN_MODEL.md)
- [STACK_DECISION.md](../00-product/STACK_DECISION.md)
