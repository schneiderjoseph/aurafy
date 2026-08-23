# Notifications model

**Version:** 0.0.0 · **Status:** DECIDED  
**Email provider (V1):** Resend  
**Rule:** Providers are adapters. PostgreSQL is source of truth for delivery jobs; Convex is for in-app realtime only.

---

## Split of concerns (MUST)

| Concern | Store | Role |
|---|---|---|
| In-app inbox, unread, live badges | **Convex** | Realtime UX |
| Email / SMS / WhatsApp jobs, templates, preferences, consent, delivery state | **PostgreSQL** | Durable, retryable |
| Push device tokens | **PostgreSQL** (`devices`) | Worker sends via push provider later |
| Actual email bytes sent | **Resend** | Provider only — not system of record |

Never store “half the notification” in both places without a clear owner.

---

## Architecture

```text
Domain event (booking confirmed, etc.)
        ↓
Postgres outbox / notification_events
        ↓
Worker (async) — NEVER block the booking request on Resend
        ↓
┌───────┼────────┐
│       │        │
Resend  Push   Convex in-app fanout
Email          (optional mirror)
```

If Resend is down: **appointment still exists**; delivery retries.

---

## Transactional vs marketing (MUST)

| Kind | Examples | Consent |
|---|---|---|
| **Transactional** | Verify email, booking confirm/reminder, receipt, security | Always on (account/booking necessary) |
| **Marketing** | Newsletter, promos, reactivation, AURAFY Weekly | Explicit opt-in; unsubscribe honored |

Disabling marketing **must not** stop booking reminders.

---

## Postgres entities

```text
notification_templates
  id, code, channel, locale (fr|en|ht), subject, body_ref, version

notification_events
  id, organization_id?, user_id?, type, payload_json, created_at

notification_deliveries
  id, event_id, channel (email|push|sms|whatsapp|in_app)
  recipient, status (queued|sending|sent|failed|retrying|suppressed)
  attempt_count, next_attempt_at, last_error
  provider (resend|…), provider_message_id
  created_at, sent_at

email_preferences
  user_id, marketing_opt_in, product_updates_opt_in, …

marketing_consents
  user_id | customer_organization_id
  channel, consented_at, revoked_at, source

email_suppressions
  email, reason, created_at

# Studio booking automation (per org)
booking_notification_settings
  organization_id
  confirmation_enabled
  reminder_24h_enabled
  reminder_2h_enabled
  review_request_enabled
  channels_json

# Growth (model now; studio campaigns UI later)
campaigns
campaign_recipients
campaign_deliveries
newsletter_subscriptions
```

---

## Resend usage (V1)

**Transactional (ship with V1 loop):**

```text
Account verification · password reset · welcome
Booking requested / confirmed / declined / cancelled
Booking reminder (T-24h; T-2h optional)
Appointment completed · review request
Payment receipt (basic)
Security alerts
```

**Marketing:**

- Platform newsletter / product updates — consented
- Studio campaigns — infrastructure ready; **Growth roadmap** for full UI; rate limits + unsubscribe + domain verification required before studios send bulk mail

---

## Booking reminder schedule

Configurable per org (not hardcoded):

```text
confirmed → immediate confirmation
         → T-24h reminder (default on)
         → T-2h reminder (default off)
completed → review request (default on)
```

Times computed in **organization timezone**; stored as UTC jobs.

---

## Templates

```text
packages/email/   (or services/api templates)
  templates/   welcome, booking-*, review-request, …
  components/  Header, Footer, Button, AppointmentCard
  locales: fr, en, ht
```

No raw HTML in route handlers.

---

## Sender identity

```text
Platform: notifications@aurafy.app (or similar on aurafy.app)
Studios:  custom domain later (verified DNS); no arbitrary From without verification
```

---

## Convex

```text
notifications (in-app)
  userId, type, title, body, data, readAt, createdAt
```

Worker may create Convex rows **after** Postgres delivery record for in-app channel.

---

## Related

- [STACK_DECISION.md](../00-product/STACK_DECISION.md)
- [DATA_BOUNDARIES.md](DATA_BOUNDARIES.md)
- [BOOKING_MODEL.md](BOOKING_MODEL.md)
