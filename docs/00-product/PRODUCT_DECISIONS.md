# Product decisions — locked for V0 blueprint

**Version:** 0.0.0  
**Status:** DECIDED (unless tagged OPEN)

Consolidated from product analysis. No application code until these docs are consistent.

---

## Market & locale

| Decision | Value |
|---|---|
| Launch market | Haiti first |
| Product shape | International from day one — **no Haiti hardcoded in logic** |
| Languages | **FR + EN + HT** (Kreyòl Ayisyen / Haitian Creole) |
| Locale codes | `fr`, `en`, `ht` (BCP 47) |
| Default locale | FR (`fr`) |
| Currencies at launch | HTG + USD (platform supports more) |
| Organization fields | `country`, `base_currency`, `allowed_currencies[]`, `timezone`, `locale` |
| User locale | Preferable from profile; fallback org → platform default |

UI strings, emails, and notifications must be translatable in all three languages from V1. Content posted by studios stays in the author's language (no forced translation of captions).

Payment at launch (Haiti): **MonCash + cash**. Card/Stripe later. Booking engine must **not** depend on Stripe.

---

## Identity & auth

| Decision | Value |
|---|---|
| V1 auth methods | Email + Google |
| Architecture ready for | Apple, phone/OTP |
| User model | Global platform `User` |
| Multi-role | Same user can be Customer, Staff, Owner across **multiple** organizations |
| Public username | Optional but encouraged — `/@username`, unique |
| Profiles | Customer profile + Organization (studio) profile |

---

## Product principle

AURAFY is **not** salon-management software alone.

```text
Consumer: Discover → Like/Save → Follow → Book → Visit → Review → Discover again
Studio:   Manage → Publish → Get discovered → Get booked → Operate → Retain
```

Two UI universes, **one design system**:

- **Consumer:** visual, image-first (discovery/marketplace)
- **Studio:** dense, productive (modern SaaS)

---

## Delivery phasing (DECIDED)

**Do not phase architecture into "consumer first" and "financial OS later".**

Foundations for **both** domains ship in parallel. First release is a **vertical slice** through the full chain — not a pretty feed with a broken studio, and not a complete ERP with no discovery.

### Phase A — Foundation (architecture + domain, all contexts)

```text
Identity · Organizations · Memberships · Permissions
Multi-currency · Money
Booking engine
Financial core (sales, payments, purchases, expenses, inventory ledger, payroll basics)
Social model · Convex model
```

### Phase B — First release (usable both sides, limited depth)

```text
CONSUMER                         STUDIO
Feed                             Calendar
Profiles                         Customers · Services · Staff
Book this look → Booking         Appointments
Chat                             Sales · Payments
Reviews                          Purchases · Expenses
                                 Basic Inventory · Basic Payroll
```

### Depth caps (V1)

| Module | V1 depth |
|---|---|
| Payroll | Basic, reliable (salary / commission / pay period) |
| Inventory | Basic ledger, reliable |
| Purchasing | PO → receive → supplier invoice |
| Accounting | Foundation only (journal shape; no full GL UI) |
| Reports | Basic operational / financial dashboard |

### Proof chain (must work end-to-end)

```text
Post → Book this look → Appointment → Completed
  → Sale → Payment (e.g. USD) → FX snapshot → HTG base
  → Commission → Payroll → Financial account → Dashboard
```

If this chain works, the product core is proven.

---

## V1 surfaces

### Consumer

1. Social feed — For You + Following; posts, likes, comments, saves; service tags; Book this look  
2. Booking — public booking; multi-service; staff optional; availability engine  
3. Profiles — customer + studio  
4. Chat — customer ↔ organization (Convex)  
5. Reviews — after completed appointment  

### Studio OS

6. Calendar · Customers · Services · Staff · Appointments  
7. Sales · Payments (multi-currency)  
8. Purchases · Expenses · Basic inventory · Basic payroll  
9. Studio publishing (posts, drafts, public profile)  

### Explicitly OUT of V1 UI (model may exist)

```text
Advanced analytics · Automated SaaS billing (Stripe) · Reels/Stories/Live · Ads
AI recommendations · Complex loyalty · Marketplace escrow payments
Full accounting export adapters · Advanced commission schemes · POS hardware
Advanced inventory (lots, multi-location transfers) · Advanced payroll tax engines
```

---

## Multi-currency (P0)

**Not P1.** Design from day one.

- `currencies`, `exchange_rates` with `effective_at`, `source`, manual/automatic/locked rates
- Every financial row stores **original amount + currency**
- Conversions store **rate snapshot at transaction time** — never recalculate history with today's rate
- Sale currency ≠ payment currency allowed
- Salon may use **commercial rate** different from bank rate

See [MONEY_MODEL.md](../01-domain/MONEY_MODEL.md).

---

## Booking (V1)

| Rule | Value |
|---|---|
| Confirmation | **Manual by default**; architecture supports auto-confirm later |
| Cancellation | Customer ≥24h → no penalty; &lt;24h → studio policy; **no automated financial penalty in V1** |
| Deposit | **No** in V1 |
| Multi-service | **Yes** — one appointment, many services |
| Staff | Optional — specific staff **or** any available |
| State machine | Explicit (requested → confirmed → …) |

---

## Social (V1)

| Rule | Value |
|---|---|
| Posts | Public + studio **draft/published/archived** |
| Reviews | Only after **completed** appointment |
| Moderation | Report + platform admin; states: reported, hidden, removed, blocked |
| Feed ranking V1 | For You + Following (Nearby/Trending later) |
| Media V1 | **Images only**; model supports VIDEO for later |
| Storage | R2-compatible; original + thumbnail + medium |

---

## Billing (SaaS)

- **Free-first** launch — studio can really operate on Free
- Model now: `Plan`, `Subscription`, `Entitlement`, `Usage`
- **Stripe not a V1 blocker** — limits configurable
- Example Free (indicative): 1 location, 2 staff, 100 customers, booking, calendar, profile, feed, basic analytics

---

## Offline & mobile

| Surface | V1 |
|---|---|
| Web | Cache, optimistic UI, network recovery — **not** full offline booking authority |
| Mobile | **Expo from V1** (not PWA-only) |
| Mobile offline | SQLite architecture from start; full offline booking **not** authoritative (no double-book conflicts) |

---

## Geo

Organization stores: address, city, country, lat, lng, timezone.  
Explore/studios in V1; complex Nearby ranking later.

---

## Legal (V1)

Delete account, export data, privacy settings, marketing consent, Terms, Privacy Policy.  
Retention rules at platform level.

---

## Architecture stores

| Store | Owns |
|---|---|
| **PostgreSQL** | All authoritative business + financial data |
| **Convex** | Social, chat, realtime notifications |
| **R2** | Media bytes |

FastAPI = business domain + `/v1` API. Next.js = web. Expo = mobile.

---

## Next docs (V0 deliverables)

Before scaffolding:

- [x] PRODUCT_DECISIONS.md
- [x] MVP_SCOPE.md
- [x] DOMAIN_MODEL.md
- [x] MONEY_MODEL.md
- [x] DATA_BOUNDARIES.md
- [x] BOOKING_MODEL.md
- [x] AUTH_MODEL.md
- [x] PERMISSIONS_MODEL.md
- [x] API_SKETCH.md
- [x] CONVEX_MODEL.md
- [x] V0_COHERENCE_REVIEW.md

**V0 blueprint complete.** Application code starts only after explicit human go-ahead.
