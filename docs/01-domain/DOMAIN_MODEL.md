# Domain model — overview

**Version:** 0.0.0  
Bounded contexts for AURAFY. PostgreSQL holds authoritative state unless noted.

---

## Platform layers

```text
┌─────────────────────────────────────────────────────────┐
│                    AURAFY PLATFORM                       │
├─────────────────────────────────────────────────────────┤
│  identity · organizations · billing (SaaS plans)        │
│  platform_admin · audit · feature_flags                 │
└─────────────────────────────────────────────────────────┘
          │                              │
          ▼                              ▼
┌──────────────────────┐    ┌──────────────────────────────┐
│   CONSUMER + SOCIAL   │    │   STUDIO OPERATING SYSTEM     │
│   (Convex + Postgres  │    │   (PostgreSQL authoritative)  │
│    metadata refs)     │    │                               │
├──────────────────────┤    ├──────────────────────────────┤
│ feed · posts          │    │ booking · calendar            │
│ likes · comments      │    │ customers · catalog · staff   │
│ saves · follows       │    │ sales · payments              │
│ chat · notifications  │    │ purchasing · inventory      │
│ reviews (gate)        │    │ expenses · payroll            │
│ profiles              │    │ finance · accounting_foundation│
└──────────────────────┘    │ reporting · media_refs        │
                            └──────────────────────────────┘
```

---

## Bounded contexts

| Context | Responsibility | Primary store |
|---|---|---|
| `identity` | Global users, auth identities, usernames | Postgres |
| `organizations` | Tenants, locations, settings, memberships | Postgres |
| `customers` | CRM link user↔org, preferences, tags | Postgres |
| `staff` | Staff profiles, roles, compensation rules | Postgres |
| `catalog` | Services, variants, add-ons, categories | Postgres |
| `booking` | Availability, appointments, policies | Postgres |
| `sales` | Orders/sales, line items, snapshots | Postgres |
| `payments` | Payment records, methods, status | Postgres |
| `purchasing` | Suppliers, POs, receipts, supplier invoices | Postgres |
| `inventory` | Items, ledger movements, on-hand projection | Postgres |
| `expenses` | Operating expenses | Postgres |
| `payroll` | Pay periods, runs, earnings, deductions | Postgres |
| `finance` | Financial accounts, movements, reconciliation | Postgres |
| `accounting` | Chart of accounts, journal entries (foundation) | Postgres |
| `money` | Currencies, exchange rates | Postgres |
| `social` | Posts, likes, comments, saves, follows | Convex (+ Postgres refs) |
| `messaging` | Conversations, messages | Convex |
| `notifications` | Delivery queue, read state | Convex (+ Postgres for email/SMS jobs) |
| `media` | Object keys, variants, visibility | Postgres metadata · R2 bytes |
| `billing` | SaaS plans, subscriptions, entitlements | Postgres |
| `reporting` | Read models / aggregates | Postgres (derived) |

---

## Core entities (Postgres)

### Identity

```text
users
  id, email, phone?, username?, display_name, avatar_media_id?, …

auth_identities
  user_id, provider, provider_subject, …

organization_members
  organization_id, user_id, role, status, permissions?, …
```

### Organization

```text
organizations
  id, slug, name, base_currency, timezone, locale,   // locale: fr | en | ht
  country, …

locations
  organization_id, address, city, lat, lng, …

customer_organizations          // CRM bridge (many-to-many)
  customer_id, organization_id, first_visit_at, last_visit_at, …
```

### Booking

```text
appointments
  organization_id, customer_id, location_id, status, starts_at, ends_at, …

appointment_services
  appointment_id, service_id, staff_id?, duration_minutes, price_snapshot, …
```

### Financial (see MONEY_MODEL.md)

```text
sales · sale_items · payments
purchase_orders · goods_receipts · supplier_invoices
inventory_items · inventory_movements
expenses
payroll_runs · payroll_earnings
financial_accounts · financial_movements
exchange_rates
journal_entries · journal_lines   // accounting foundation
```

---

## Convex entities (social / realtime)

```text
posts · post_media · post_services
likes · comments · saves
follows
conversations · conversation_members · messages
notification_events
presence (optional)
```

Postgres holds stable IDs referenced by Convex (`organization_id`, `service_id`, `user_id`, `media_id`).

---

## Key relationships

```text
User 1──* organization_members *──1 Organization
User 1──* customer_organizations *──1 Organization
Organization 1──* locations
Organization 1──* services
Organization 1──* staff (via members + staff_profiles)
Appointment *──* services (appointment_services)
Post (Convex) ──refs──► Organization, User, Service[], Media[]
Conversation ──refs──► Organization + Customer/User
```

---

## Appointment status (sketch)

```text
draft → requested → confirmed → in_progress → completed → (review_eligible)
                 ↘ declined
                 ↘ cancelled (by customer | by studio)
                 ↘ no_show
```

---

## Inventory ledger (sketch)

Movement types: `receive`, `sale`, `consumption`, `waste`, `adjust`, `transfer`, `return`.

On-hand = fold of movements (cache allowed, recomputable).

---

## Rules

- Every business table: `organization_id` (AF-P1)
- Financial rows: Money + rate snapshots (see MONEY_MODEL)
- Social engagement does not mutate financial state directly — events go through API/domain

---

## Related

- [MONEY_MODEL.md](MONEY_MODEL.md)
- [DATA_BOUNDARIES.md](DATA_BOUNDARIES.md)
- [MVP_SCOPE.md](../00-product/MVP_SCOPE.md)
