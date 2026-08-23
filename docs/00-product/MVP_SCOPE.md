# MVP scope — AURAFY V1

**Version:** 0.0.0 (targets V1, not yet built)  
**Principle:** Prove **Discover → Book → Studio value** while the studio can **actually run** day-to-day.

---

## Success criteria

A real studio can:

1. Publish looks and receive booking requests from the feed
2. Manage calendar, customers, services, and staff
3. Record sales and basic payments (multi-currency)
4. Record purchases, expenses, and basic inventory
5. Run basic payroll / commissions for staff
6. Chat with customers in realtime

A consumer can:

1. Browse For You / Following feed
2. Like, save, comment, follow
3. Book from a post or studio profile (multi-service)
4. Message the studio
5. Review after a completed visit

---

## In scope — Consumer

| # | Module | V1 capability |
|---|---|---|
| C1 | Feed | For You, Following; post cards; engagement counts |
| C2 | Posts | Image, caption, tagged services, studio author |
| C3 | Engagement | Like, comment (thread later), save |
| C4 | Profiles | User + organization; posts grid; services list; followers |
| C5 | Booking | Book this look / book service; multi-service; manual confirm flow |
| C6 | Chat | 1:1 customer ↔ organization thread |
| C7 | Reviews | Post-appointment only; star + text |
| C8 | Notifications | In-app + push (mobile); booking, chat, social (basic) |

---

## In scope — Studio OS

| # | Module | V1 capability |
|---|---|---|
| S1 | Organization | Profile, slug, branding, hours, location, currencies |
| S2 | Calendar | Day/week views; appointments; block time |
| S3 | Customers | CRM per org; link to global user when registered |
| S4 | Catalog | Services (+ variants later if needed); categories |
| S5 | Staff | Members, roles (owner/manager/staff); optional assignment |
| S6 | Appointments | State machine; multi-service lines; cancellation metadata |
| S7 | Sales | Sale + line items; price snapshots; tips (basic) |
| S8 | Payments | Record payment against sale; methods; multi-currency |
| S9 | Purchasing | Suppliers; PO; receive → inventory; supplier invoice |
| S10 | Inventory | Ledger movements; on-hand derived; basic adjust/waste |
| S11 | Expenses | Operating expenses (not stock purchases) |
| S12 | Payroll | Compensation rules (salary/commission/fixed); pay period; earnings snapshot |
| S13 | Financial accounts | Cash, bank, MonCash, etc.; movements |
| S14 | Publishing | Create/edit/publish posts; drafts |
| S15 | Dashboard | Today summary — appointments, sales, basic KPIs |

---

## Out of scope — V1 (may exist in domain model)

```text
Automated Stripe SaaS billing
Deposit / escrow / online payment capture at booking
Auto financial penalties (no-show fees)
Reels, stories, live video
AI For You ranking
Complex loyalty / campaigns
Full chart-of-accounts UI
Accounting export adapters (QB, Xero)
Advanced inventory (lots, expiry, transfers between locations)
Multi-location UI (data shape ready)
Marketplace payments between consumer and platform
POS hardware integration
Payroll tax / statutory compliance engines
```

---

## Delivery model (DECIDED)

**Foundations in parallel for consumer + studio OS.** First release = **one vertical slice**, not sequential product halves.

### Phase A — Foundation

All bounded contexts modeled and scaffolded: identity, orgs, permissions, money, booking engine, financial core, social/Convex.

### Phase B — First vertical release

Both sides usable at once:

| Consumer | Studio |
|---|---|
| Feed, Profiles | Calendar, Customers, Services, Staff |
| Book this look → Appointment | Appointments |
| Chat, Reviews | Sale → Payment → Commission |
| | Purchases, Expenses, Basic Inventory, Basic Payroll |

### Proof chain

```text
Post → Book → Appointment → Completed → Sale → Payment (FX snapshot)
  → Commission → Payroll → Financial account → Dashboard
```

### Depth caps

Basic payroll · basic inventory ledger · PO→receive→invoice · accounting foundation only · basic dashboard.  
UI polish may lag on financial modules; **domain correctness must not**.

---

## Platforms

| Platform | V1 |
|---|---|
| Web (Next.js) | Consumer + Studio (responsive) |
| Mobile (Expo) | Consumer + staff agenda subset |
| API | FastAPI `/v1` — all clients |
| Admin | Minimal platform admin (reports, moderation) |

---

## Non-goals for V1

- Replace full accounting software
- Guarantee offline booking without server truth
- Launch in all countries with localized payments day one
- Consumer-only launch while studio cannot operate financially
- Financial OS complete before any consumer loop feedback
