# Booking model

**Version:** 0.0.0 · **Status:** DECIDED  
**Store:** PostgreSQL (authoritative). Events may fan out to Convex for notify/chat.

---

## Goal

Compute availability and create appointments that:

- respect business hours, staff hours, buffers, blocks, existing appointments
- support multi-service duration
- support staff = specific **or** any available
- never double-book the same staff slot (server truth)

---

## Entities

```text
business_hours          org or location · day_of_week · open/close
special_hours           date overrides (holiday, closed, custom)
staff_availability      staff · day · windows · exceptions
staff_time_blocks       staff · starts_at · ends_at · reason
services                duration_minutes · buffer_before · buffer_after · bookable_online
appointment             header
appointment_services    lines (service, staff?, duration, price snapshot)
booking_policies        cancel window, auto_confirm flag, booking_window_days
```

---

## Appointment state machine

```text
requested ──► confirmed ──► checked_in ──► in_progress ──► completed
    │              │                                          │
    │              ├──► cancelled                             └──► review_eligible
    │              └──► no_show
    └──► declined
```

| Transition | Who | Notes |
|---|---|---|
| → requested | Customer / studio walk-in | Default for online booking |
| requested → confirmed | Studio (manual default) | Auto-confirm if policy enabled |
| requested → declined | Studio | Reason optional |
| * → cancelled | Customer or studio | Record `cancelled_by`, `reason`, `cancelled_at` |
| confirmed → no_show | Studio | No automated fee in V1 |
| → completed | Studio | Enables sale + review |

---

## Multi-service

One appointment = N `appointment_services` lines.

```text
Total duration = sum(service.duration + buffers)
Staff per line optional; if omitted and appointment.staff_id set, inherit
If any available: engine assigns staff per line or one staff for whole appointment (policy OPEN — default: one staff for whole visit in V1)
```

**V1 default:** one primary staff for the whole appointment; lines may still list services without per-line staff.

---

## Availability algorithm (pure domain)

Inputs: organization, location?, service_ids[], staff_id? | ANY, range start/end, duration.

```text
1. Resolve total duration from services (+ buffers)
2. Load business hours ∩ special hours for location/org
3. Load candidate staff (specific OR all bookable staff for those services)
4. Load staff_availability + time_blocks + existing appointments (non-terminal statuses)
5. Generate candidate slots on a grid (e.g. 15 min)
6. Filter slots where every required minute is free for chosen staff
7. Apply booking_window (min lead time, max days ahead)
8. Return slots { starts_at, ends_at, staff_id }
```

Rules:

- Pure function — no I/O inside math; adapters load data (AF-P4)
- Conflict check on create is transactional + re-check availability
- Idempotency key on create (AF-P5)

---

## Book this look

```text
Post (Convex) has tagged service_ids[]
  → Client opens booking with those services preselected
  → Availability for org + services
  → Create appointment (requested) via FastAPI
  → Store source: post_id (optional) for attribution
```

---

## Cancellation (V1)

| When | Effect |
|---|---|
| ≥ 24h before start | Allowed; no financial penalty |
| &lt; 24h | Allowed if policy says so; **no automated fee** — studio handles offline |
| Studio cancel | Always allowed; notify customer |

---

## Deposits

**Out of V1.** Schema may reserve `deposit_required` / `deposit_amount` as null/unused.

---

## Policies (per organization / location)

```text
auto_confirm: bool = false
cancel_window_hours: int = 24
min_lead_minutes: int
max_advance_days: int
slot_interval_minutes: int = 15
```

---

## Related

- [DOMAIN_MODEL.md](DOMAIN_MODEL.md)
- [PRODUCT_DECISIONS.md](../00-product/PRODUCT_DECISIONS.md)
- [MONEY_MODEL.md](MONEY_MODEL.md) — price snapshots on appointment_services / sales
