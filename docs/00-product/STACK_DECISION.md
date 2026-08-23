# Stack decision

**Status:** DECIDED  
**Version:** 0.0.0  
**Date:** 2026-08-23  
**Context:** AURAFY — social beauty platform + studio SaaS (greenfield).

## Decision

| Layer | Choice |
|---|---|
| Web | Next.js (App Router) · React · TypeScript · Tailwind · shadcn/ui · Radix · Motion · TanStack Query |
| Mobile | React Native · Expo · Expo Router · gluestack-ui · NativeWind · Reanimated · SQLite (offline) |
| API | Python · FastAPI · Pydantic v2 · SQLAlchemy 2 · Alembic |
| Transactional DB | PostgreSQL |
| Auth | To be finalized in ADR-002 — lean Supabase Auth **or** FastAPI-issued sessions with Postgres; must support global users + org memberships |
| Social / realtime | Convex |
| Media | Cloudflare R2 |
| Email | **Resend** — transactional + consented marketing; provider only |
| Async jobs | Worker for notifications/reminders (start simple; Redis/queue when earned AF-P14) |
| Cache / jobs | Redis **only when earned** (AF-P14); start with FastAPI background tasks / simple worker |
| Monorepo | pnpm workspaces (JS) + `services/api` (Python) |
| CI | GitHub Actions (production-app-standard templates) |

## Why greenfield

AURAFY is a **new architecture** built for multi-tenant, social discovery, and global user identity from the start — not a retrofit of a single-studio app.

## Why FastAPI (Python) for business core

- Typed API, OpenAPI for web + mobile + future public API
- Clean domain modules and workers
- Separates transactional ERP from Next.js UI concerns

## Why Resend for email

Transactional email is part of the product loop (booking confirmations, reminders, auth), not a marketing afterthought.

- Resend = **provider** (send + delivery webhooks)
- PostgreSQL = templates, preferences, consent, delivery state, retries
- Convex = in-app realtime only
- Booking/sale requests **must not await** Resend (async worker)

Locales for templates: `fr`, `en`, `ht`. See [NOTIFICATIONS_MODEL.md](../01-domain/NOTIFICATIONS_MODEL.md).

## Why Convex for social

Live queries for feed interactions, chat, and **in-app** notifications without bolting a second websocket stack onto FastAPI for MVP social UX.

## Why not Flutter

Team/product DNA is React/TypeScript; need web SaaS + consumer web + admin + iOS/Android. Expo + shared tokens/types wins. Flutter remains OPEN only if a dedicated mobile-only product splits later.

## Why not Electron

PWA first for desktop. Capacitor later if store distribution is required.

## Consequences

- Shared `packages/types` and `packages/design-tokens` across web/mobile
- OpenAPI client generation from FastAPI for TypeScript apps
- Explicit sync boundaries when a booking (Postgres) emits social/notify events (Convex)
- Import/migration tooling for legacy studio data is a **later** concern — not V0

## Related

- [ARCHITECTURE_PRINCIPLES.md](ARCHITECTURE_PRINCIPLES.md)
- [PHASE0.md](PHASE0.md)
- [DATA_BOUNDARIES.md](../01-domain/DATA_BOUNDARIES.md) (planned)
- ADR-001 (repo layout) when filed under `decisions/`
