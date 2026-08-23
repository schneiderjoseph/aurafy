# AURAFY V0 — Spec before product code

**Version:** 0.0.0  
**Rule:** no application code until V0 blueprint is complete and reviewed.

## Status

**Blueprint complete** — see [`docs/04-analysis/V0_COHERENCE_REVIEW.md`](../04-analysis/V0_COHERENCE_REVIEW.md).

Scaffolding application code requires **explicit human go-ahead**.

## What V0 means

```text
AURAFY V0 = product definition + architecture + standards binding
            — no runnable app yet
```

**Allowed in V0**

- Product docs (`docs/`)
- Architecture decisions (`decisions/`)
- Design direction (`design-system/`, `brand/`)
- Folder placeholders for future apps (empty)

**Forbidden in V0**

- Framework install “to move forward” without go-ahead
- Copying a vendor schema or UI
- Claiming MVP, beta, or production readiness

## Evidence tags

| Tag | Meaning |
|-----|---------|
| **DECIDED** | Product rule we commit to |
| **OPEN** | To validate later — do not code as certainty |
| **INDUSTRY** | Common practice, expressed in Aurafy terms |

## Sequence

```text
V0 Spec (done) → V1 Foundation (auth, org, API, money, booking, social)
              → V1 Vertical release (consumer loop + studio OS basic)
              → Later: advanced payroll/inventory/accounting/reports UI
```

No stack re-decision in V0 beyond [STACK_DECISION.md](STACK_DECISION.md).
