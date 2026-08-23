# Auth model

**Version:** 0.0.0 · **Status:** DECIDED (provider choice OPEN in ADR-002)  
**Store:** PostgreSQL for users/memberships; session tokens via chosen provider.

---

## Principles

1. **Global User** — one account for the whole platform
2. **Authorization is org-scoped** — membership + role + permission
3. **Same user, many hats** — Customer of org A, Staff of org B, Owner of org C
4. **Never trust client-supplied `organization_id` alone** — resolve from verified membership
5. V1 methods: **Email + Google**; architecture ready for Apple + phone OTP

---

## Entities

```text
users
  id
  email                 unique, nullable if phone-only later
  email_verified_at
  phone                 nullable
  phone_verified_at
  username              unique, nullable (public /@username)
  display_name
  avatar_media_id
  locale                // fr | en | ht
  status                active | suspended | deleted
  created_at

auth_identities
  id
  user_id
  provider              email | google | apple | phone
  provider_subject
  created_at

sessions / tokens       // implementation detail of ADR-002
  user_id
  device_id?
  expires_at
  revoked_at
```

---

## Public identity

```text
/@{username}     → public consumer profile
/studio/{slug}   → public organization profile
```

Username optional at signup; strongly encouraged before publishing social content.

---

## Organization context

After login, the client may select an **active organization** for studio mode.

```text
Session claims (conceptual):
  sub: user_id
  // organization_id NOT blindly trusted from body —
  // every request re-checks organization_members
```

Studio API routes require:

```text
authenticated user
+ active membership for organization_id
+ permission for action
```

Consumer routes (feed, book, chat) require user (or guest OPEN for browse-only — V1: browse may be public, book/chat require auth).

---

## Guest vs authenticated (V1)

| Action | Auth |
|---|---|
| View public feed / studio profile / posts | Public |
| Like, save, comment, follow, chat | Authenticated |
| Create booking | Authenticated |
| Studio dashboard | Authenticated + membership |

---

## Devices (ready)

```text
devices
  id, user_id, platform, push_token, last_seen_at, app_version
```

Used for push and session hygiene. Not required for first login.

---

## Account lifecycle

| Action | Behavior |
|---|---|
| Delete account | Soft-delete user; anonymize public content per policy; revoke sessions |
| Export data | Package user + customer_org links + appointments/reviews (own data) |
| Suspend | Platform admin; blocks login |

---

## Provider decision (OPEN → ADR-002)

Options:

1. Supabase Auth → JWT → FastAPI validates → membership in Postgres  
2. FastAPI-native sessions (email/password + OAuth) → Postgres  

**Must support:** email/password or magic link, Google OAuth, future Apple/OTP, global user id stable across apps.

---

## Related

- [PERMISSIONS_MODEL.md](PERMISSIONS_MODEL.md)
- [PRODUCT_DECISIONS.md](../00-product/PRODUCT_DECISIONS.md)
