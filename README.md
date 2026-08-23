# AURAFY

**Discover your look. Book your moment.**

> **Version 0.0.0** — specification only. No application code yet.

```text
                    AURAFY
                       │
         ┌─────────────┼─────────────┐
         │             │             │
      DISCOVER      CONNECT        BOOK
         │             │             │
       Feed         Follow         Calendar
       Nearby       Chat           Appointments
       Save         Notify         Payments
         │             │             │
         └─────────────┼─────────────┘
                       │
                    STUDIO
                       │
              Manage · Grow · Retain
```

AURAFY is a **beauty, grooming & wellness platform**: consumers discover looks and book them; studios run their business and publish work that gets them booked.

---

## What this repository is

Product home for Aurafy: positioning, domain spec, architecture, and (later) software.

Discipline inspired by Kontrest-style **spec before code**, **API-first**, **pure domain**, and **honest front page**.

Bound by:

| Standard | Role |
|---|---|
| [production-app-standard](../production-app-standard) | Production maturity, security, CI |
| [vibe-prod-rules](../vibe-prod-rules) | Ship gates, tenancy, red flags |
| [design-system-standard](../design-system-standard) | UX/UI/a11y rules |

Agents: read [`AGENTS.md`](AGENTS.md) before any change.

---

## Now

**AURAFY V0 — blueprint complete.** Vertical-slice delivery locked (consumer + studio foundations in parallel). Coherence review: **PASS** ([`docs/04-analysis/V0_COHERENCE_REVIEW.md`](docs/04-analysis/V0_COHERENCE_REVIEW.md)).

**No application code yet.** Scaffolding starts only with explicit go-ahead.

---

## Product loop (target)

```text
Studio publishes look
        ↓
Consumer discovers (For You / Following / Nearby)
        ↓
Like · Save · Follow · Chat
        ↓
Book this look
        ↓
Visit → Review / Photo
        ↓
Discover again
```

Studio side:

```text
Manage calendar & CRM → Publish → Get discovered → Get booked → Retain → Upgrade plan
```

Vertical proof chain:

```text
Post → Book → Appointment → Completed → Sale → Payment (FX)
  → Commission → Payroll → Financial account → Dashboard
```

---

## Surfaces (planned)

| Surface | Audience | Stack |
|---|---|---|
| Web (`apps/web`) | Consumer + Studio + Platform admin | Next.js · shadcn/ui |
| Mobile (`apps/mobile`) | Consumer + Staff | Expo · gluestack-ui |
| API (`services/api`) | All clients | FastAPI · `/v1` |
| Social realtime (`convex/`) | Feed, chat, likes, notifies | Convex |
| Media | Photos / video | Cloudflare R2 |

---

## Spec map

| Doc | Status |
|-----|--------|
| [Positioning](docs/00-product/POSITIONING.md) | ✅ |
| [Phase 0](docs/00-product/PHASE0.md) | ✅ |
| [Product decisions](docs/00-product/PRODUCT_DECISIONS.md) | ✅ |
| [MVP scope](docs/00-product/MVP_SCOPE.md) | ✅ |
| [Architecture principles](docs/00-product/ARCHITECTURE_PRINCIPLES.md) | ✅ |
| [Stack decision](docs/00-product/STACK_DECISION.md) | ✅ |
| [Domain model](docs/01-domain/DOMAIN_MODEL.md) | ✅ |
| [Money model](docs/01-domain/MONEY_MODEL.md) | ✅ |
| [Data boundaries](docs/01-domain/DATA_BOUNDARIES.md) | ✅ |
| [Booking model](docs/01-domain/BOOKING_MODEL.md) | ✅ |
| [Auth model](docs/01-domain/AUTH_MODEL.md) | ✅ |
| [Permissions](docs/01-domain/PERMISSIONS_MODEL.md) | ✅ |
| [API sketch](docs/06-api/API_SKETCH.md) | ✅ |
| [Convex model](docs/06-api/CONVEX_MODEL.md) | ✅ |
| [V0 coherence review](docs/04-analysis/V0_COHERENCE_REVIEW.md) | ✅ PASS |

---

## Monorepo shape (target)

```text
aurafy/
├── apps/web/              Next.js
├── apps/mobile/           Expo
├── services/api/          FastAPI
├── convex/                Social / realtime
├── packages/
│   ├── design-tokens/
│   └── types/
├── docs/
├── design-system/
├── brand/
└── decisions/
```

---

## License

MIT — see [`LICENSE`](LICENSE).
