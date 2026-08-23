# V0 coherence review

**Date:** 2026-08-23  
**Version:** 0.0.0  
**Purpose:** Confirm docs agree before any application scaffold.

---

## Verdict

**PASS — V0 blueprint is coherent enough to start V1 foundation code.**

No major product decisions remain open that would force a financial or tenancy rewrite. Residual OPENs are implementation choices (auth provider ADR-002, refund depth, per-line staff assignment default).

---

## Documents in scope

| Doc | Present |
|-----|:-------:|
| POSITIONING | ✓ |
| PHASE0 | ✓ |
| PRODUCT_DECISIONS | ✓ |
| MVP_SCOPE | ✓ |
| ARCHITECTURE_PRINCIPLES | ✓ |
| STACK_DECISION | ✓ |
| DOMAIN_MODEL | ✓ |
| MONEY_MODEL | ✓ |
| DATA_BOUNDARIES | ✓ |
| BOOKING_MODEL | ✓ |
| AUTH_MODEL | ✓ |
| PERMISSIONS_MODEL | ✓ |
| API_SKETCH | ✓ |
| CONVEX_MODEL | ✓ |

---

## Consistency checks

| Check | Result |
|---|---|
| Locales FR + EN + HT (Kreyòl) from day one | ✓ |
| Dual product (consumer + studio OS) reflected everywhere | ✓ |
| Vertical slice phasing (not consumer-first) locked | ✓ |
| Multi-currency P0 + rate snapshots | ✓ |
| Purchases ≠ expenses ≠ payroll | ✓ |
| Booking: manual confirm, no deposit, multi-service | ✓ |
| Postgres vs Convex vs R2 boundaries explicit | ✓ |
| Global user + multi-org memberships | ✓ |
| Server-side permissions / tenant isolation P0 | ✓ |
| Expo + Next + FastAPI stack aligned | ✓ |
| Depth caps (basic payroll/inventory, accounting foundation) | ✓ |
| Proof chain Post→…→Dashboard documented | ✓ |
| No single-studio hardcoded assumptions | ✓ |

---

## OPEN items (non-blocking for scaffold)

| ID | Topic | Resolution path |
|---|---|---|
| O1 | Auth provider: Supabase vs FastAPI-native | ADR-002 before login shipping |
| O2 | Sale refund API depth in V1 | Decide when implementing sales |
| O3 | Multi-service staff: one staff vs per-line | BOOKING_MODEL default = one staff/visit |
| O4 | FX gain/loss reporting | MONEY_MODEL notes OPEN |
| O5 | Exact Free/Pro numeric limits | Configurable; not schema blockers |
| O6 | Guest browse vs auth wall fine print | AUTH_MODEL: public read OK |

---

## Explicit non-goals still held

- Full GL / tax payroll engines / advanced inventory
- Stripe SaaS billing as V1 blocker
- Offline authoritative booking
- Reels / AI ranking / marketplace escrow

---

## Gate to V1 code

Allowed next (with human go-ahead):

1. `git init` + remote (if desired)
2. Monorepo scaffold: `services/api` (FastAPI skeleton), `apps/web`, `apps/mobile` placeholders, `packages/types`
3. First Alembic migrations: users, orgs, memberships, money tables
4. ADR-001 repo layout, ADR-002 auth

**Still forbidden until go-ahead:** pretending V0 is a runnable product; claiming production-ready.

---

## Agent instruction (locked)

> Do not phase the architecture into "consumer first" and "financial OS later". Build both domains in V1 foundations and keep their boundaries explicit. First release = vertical slice through Discover→Book→Sale→Payment→Commission→Dashboard. Advanced accounting/payroll/inventory/reporting remain later UI phases; domain model must not require a financial rewrite.
