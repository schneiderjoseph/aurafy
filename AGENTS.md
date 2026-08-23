# AGENTS.md — Work contract for Aurafy

You are building **AURAFY V0+**, a beauty / grooming / wellness discovery + booking platform
with an integrated studio SaaS. This file is your employment contract.

Violating it is a failed task.

## Current version

**0.0.0 — specification only.** No application code exists yet. Do not scaffold apps unless explicitly requested.

## Binding standards (read before coding)

| Standard | Path | When |
|---|---|---|
| **production-app-standard** | `G:/CODE/production-app-standard` | Architecture, security, DB, API, CI, maturity |
| **vibe-prod-rules** | `G:/CODE/vibe-prod-rules` | Auth, tenancy, payments, testing, red flags |
| **design-system-standard** | `G:/CODE/design-system-standard` | UX/UI, a11y, tokens, states, review format |
| **Kontrest discipline** | `G:/CODE/kontrest` (inspiration) | Spec-before-code, pure domain, API-first, front-page honesty |

Load the matching `AGENTS.md` / `advice/*.md` / `rules/` for the domain you touch.

## Product truth lives here

```text
docs/00-product/     positioning, principles, stack, phase
docs/01-domain/      glossary, model, tenancy (planned)
docs/02-workflows/   booking, discover, chat, studio ops (planned)
docs/03-business-rules/  testable AF-* rules (planned)
docs/04-analysis/    gaps, debt, evidence (planned)
docs/06-api/         /v1 contract (planned)
docs/07-design/      brand + surface map (planned)
decisions/           ADRs
```

**Never invent APIs, DB fields, or business rules** that are not in these docs or an ADR.

## Non-negotiable

1. **Multi-tenant from day one in data shape.** Do not bake single-studio assumptions into schema or UX.
2. **Tenant isolation is P0.** `organization_id` from verified auth context — never from client body alone. Cross-tenant denial tests required.
3. **User ≠ Customer ≠ Membership.** Global `User`; CRM link via `customer_organizations`; staff via `organization_members`.
4. **API-first.** FastAPI `/v1` owns business rules. Web and mobile are clients. No rule lives only in a screen.
5. **Postgres = transactional core. Convex = social/realtime. R2 = media.** Do not dump everything into one store.
6. **Complexity must be earned.** No Redis/K8s/microservices “for seriousness” until a measured need.
7. **Every new dependency is a liability.** Justify in the PR.
8. **Design system owns appearance; docs own semantics.** Numbers/labels without a cited `AF-*` rule are inventions.
9. **Never claim production-ready** while P0 gaps remain. Use production-app-standard maturity language.
10. **No secrets in git.** Ever.

## Hard stops

- Cross-tenant or cross-user data leakage
- Client-only authorization
- Secrets in source / client bundles
- Payment webhooks without signature verification
- Schema change without versioned migration
- Shipping UI without keyboard path / accessible name on interactive controls
- Application code in V0 without explicit human approval

## Required workflow

```text
BEFORE CODING
  → Read this AGENTS.md + docs/00-product/PHASE0.md
  → Read relevant docs/ + decisions/
  → Load matching production-app-standard / vibe-prod-rules / design-system-standard domain docs
  → Implement smallest change that satisfies the request
  → Add/update tests for critical paths (authz, booking, tenancy, payments)
  → Report Standard + Advice + Design compliance
```

## Output contract

```text
## Aurafy compliance
- Version: 0.0.0 (or current)
- Domains touched: ...
- Docs/ADRs cited: ...
- AF-* rules affected: ...
- Standards applied: production-app-standard | vibe-prod-rules | design-system-standard
- P0 passed: ...
- P0 gaps (blockers): ...
- P1 remaining: ...
- Checks run / NOT run: ...
- Tests added/updated: ...
- New dependencies (justification or none): ...
```

## Front-page discipline (from Kontrest)

- Never put perishable sprint facts in `README.md` ## Now (no test counts, no “next we build X”).
- If a PR changes what the product *is*, update `## Now` in the same PR.
- Detail belongs in tables that PRs already update (`docs/06-api`, migrations when they exist).
