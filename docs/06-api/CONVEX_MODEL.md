# Convex model — social & realtime

**Version:** 0.0.0 · **Status:** DECIDED  
**Rule:** Convex owns social/realtime. Money and booking truth stay in PostgreSQL.

---

## Why Convex here

- Live feed counters, likes, comments
- Chat with presence/unread
- Optimistic UI for engagement
- Fanout notifications to connected clients

---

## Tables (conceptual)

```text
profiles                    // mirror of public user fields (synced from API)
  userId                    // Postgres user id (string)
  username
  displayName
  avatarUrl
  bio?

organizationsPublic         // public studio card cache
  organizationId
  slug
  name
  avatarUrl
  followerCount

posts
  _id
  organizationId
  authorUserId
  caption
  mediaIds[]                // Postgres media ids or Convex file refs + R2 keys
  serviceIds[]              // Postgres service ids
  visibility                // public
  status                    // draft | published | archived | hidden | removed
  likeCount
  commentCount
  saveCount
  createdAt

postLikes
  postId, userId            // unique pair

postComments
  postId, userId, parentId?, body, createdAt, status

postSaves
  postId, userId

follows
  followerUserId
  targetType                // user | organization
  targetId

conversations
  organizationId
  customerUserId
  lastMessageAt
  lastPreview

conversationMembers
  conversationId
  userId
  role                      // customer | studio
  lastReadAt

messages
  conversationId
  senderUserId
  type                      // text | image | system | booking
  body?
  payload?                  // booking ref, etc.
  createdAt

notifications
  userId
  type
  title
  body
  data
  readAt?
  createdAt
```

---

## Auth bridge

Convex authenticates with a JWT / Convex auth that maps to **Postgres `user.id`**.

Every mutation:

1. Resolve `userId` from auth
2. For studio publish: call or trust recently validated org membership (prefer server-issued short-lived claim or FastAPI gate for publish)

**V1 preference:** create/publish post via FastAPI (validates membership + media) then writes Convex document; likes/comments/saves/chat may be Convex-native with auth checks.

---

## Feed queries

```text
followingFeed(userId)     // posts from followed orgs/users, recent
forYouFeed(userId)        // V1: recent public + light engagement boost
                          // not ML — score = recency + engagement + following
```

Nearby / Trending = later.

---

## Chat rules

```text
One conversation per (organizationId, customerUserId) in V1
Studio members with chat.reply can send as organization
System messages for booking lifecycle (from worker after Postgres event)
```

---

## Moderation

```text
reports
  targetType, targetId, reporterUserId, reason, status

Admin (platform) sets post status hidden|removed
Block list: user blocks (ready in model; UI later)
```

---

## Sync from Postgres events

| Event | Convex effect |
|---|---|
| `appointment.requested` | Notify studio; optional system chat message |
| `appointment.confirmed` | Notify customer |
| `appointment.completed` | Notify; unlock review (review itself may live in Postgres) |
| `organization.updated` | Refresh `organizationsPublic` |
| `user.profile.updated` | Refresh `profiles` |

Delivery: FastAPI outbox → worker → Convex mutation (idempotent by event id).

---

## Explicitly NOT in Convex

```text
Sales, payments, exchange rates, inventory qty
Appointment slot locks / availability
Payroll, expenses, purchase orders
Plan entitlements
```

---

## Related

- [DATA_BOUNDARIES.md](../01-domain/DATA_BOUNDARIES.md)
- [DOMAIN_MODEL.md](../01-domain/DOMAIN_MODEL.md)
- [API_SKETCH.md](../06-api/API_SKETCH.md)
