# V0 coherence review

**Date:** 2026-08-23  
**Version:** 0.0.0  
**Purpose:** Confirm docs agree before any application scaffold.

---

## Verdict

**PASS — V0 blueprint is coherent enough to start V1 foundation code.**

Corrections from post-review applied: FX realized rules, notifications split (Postgres jobs + Resend + Convex in-app), financial idempotence (AF-PAY), `customer_organizations` as first-class CRM, Resend in stack.

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
| FX realized on settlement; unrealized later | ✓ |
| Notifications: Postgres jobs + Resend + Convex in-app | ✓ |
| Financial idempotence (AF-PAY) | ✓ |
| customer_organizations first-class CRM | ✓ |
| Resend in stack for transactional email | ✓ |
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
| O4 | Unrealized FX revaluation UI | Out of V1; realized FX on settlement DECIDED in MONEY_MODEL |
| O5 | Exact Free/Pro numeric limits | Configurable; not schema blockers |
| O6 | Guest browse vs auth wall fine print | AUTH_MODEL: public read OK |
| O7 | Studio marketing campaign UI | Infra + consent in V1; bulk send Growth |

---

## Explicit non-goals still held

- Full GL / tax payroll engines / advanced inventory
- Stripe SaaS billing as V1 blocker
- Offline authoritative booking
- Reels / AI ranking / marketplace escrow

---

## Gate to V1 code

Allowed next (with human go-ahead):

1. **Design system** — `packages/design-tokens` (started) + `packages/ui` + docs/07-design
2. **UI prototype** — surfaces in SURFACE_MAP (mock data, real TypeScript types)
3. Freeze OpenAPI / contract stubs against booking + feed happy paths
4. Parallel: FastAPI skeleton, Alembic (users, orgs, memberships, customer_organizations, money), Convex stub, Resend worker stub
5. ADR-001 repo layout, ADR-002 auth

**Order:** UI-first + contract-first. First eng objective still includes tenancy + identity + money — not empty flashy pages without contracts.

**Still forbidden:** claiming production-ready.

---

## Agent instruction (locked)

> Do not phase the architecture into "consumer first" and "financial OS later". Build both domains in V1 foundations and keep their boundaries explicit. First release = vertical slice through Discover→Book→Sale→Payment→Commission→Dashboard. Advanced accounting/payroll/inventory/reporting remain later UI phases; domain model must not require a financial rewrite.
