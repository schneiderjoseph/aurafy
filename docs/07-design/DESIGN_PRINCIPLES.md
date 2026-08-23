# Design principles — AURAFY

**Version:** 0.0.0 · **Status:** DECIDED  
**Companion:** design-system-standard (tokens, a11y, states).

---

## Two universes, one DNA

| Surface | Feel | References (spirit, not clones) |
|---|---|---|
| **Consumer** | Editorial, visual, social | Pinterest × Instagram × marketplace |
| **Studio** | Precise, dense, operational | Linear × Cal.com × modern SaaS |

Same tokens, typography, radius, icons, motion language. Different density and layout patterns.

---

## Non-negotiables

1. **Content wins on consumer** — neutral shell; studio photos dominate color.
2. **Beautiful ≠ empty** — studio UI is data-dense when needed; avoid giant sparse cards.
3. **No Dribbble theater** — every screen serves a real workflow from PRODUCT_DECISIONS.
4. **States always** — default, hover, focus, active, disabled, loading, empty, error, success (+ offline/permission when relevant).
5. **Accessible** — keyboard paths, visible focus, contrast, accessible names (design-system-standard MUST rules).
6. **Motion with purpose** — like/save/book/chat feedback; 150–300ms; no carnival.
7. **Mock with real types** — prototype against `Post`, `Studio`, `Service`, `Appointment` shapes; swap mock → API later.
8. **Not a “beauty pink” brand** — AURAFY is style + discovery + transformation (nails, barber, hair, spa…).

---

## Delivery order (after V0)

```text
Design system foundation (tokens + ui package)
        ↓
UI/UX prototype — critical flows only (~10–12 screens)
        ↓
API / domain contracts frozen against those screens
        ↓
Backend + DB scaffold (parallel OK)
        ↓
Connect UI to real data
        ↓
Realtime / jobs / offline hardening
```

**Not:** all pages before backend.  
**Not:** backend CRUD before proving the happy path in UI.  
**Yes:** UI-first + **contract-first**.

---

## Image system

| Use | Ratio |
|---|---|
| Feed post | **4:5** |
| Preview / grid | 1:1 |
| Future story/reel | 9:16 |

---

## Icons

**Lucide** only as base — consistent stroke; no mixing icon libraries.

Social/actions: Heart, Bookmark, MessageCircle, Share, Bell, Calendar, Sparkles, MapPin.

---

## Related

- [BRAND.md](BRAND.md)
- [SURFACE_MAP.md](SURFACE_MAP.md)
- [COMPONENT_MAP.md](COMPONENT_MAP.md)
