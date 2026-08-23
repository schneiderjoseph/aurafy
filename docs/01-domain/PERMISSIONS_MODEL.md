# Permissions model

**Version:** 0.0.0 · **Status:** DECIDED  
**Rule:** UI hides; **server enforces**. Cross-tenant denial tests are P0.

---

## Layers

```text
1. Authentication     who is the user?
2. Membership         which organizations?
3. Role               default permission pack
4. Permission         fine-grained capability
5. Entitlement        SaaS plan limits (billing)
6. Resource scope     this appointment belongs to org X
```

---

## Roles (organization)

| Role | Intent |
|---|---|
| `owner` | Full control including billing & delete org |
| `manager` | Operations without ownership transfer |
| `receptionist` | Calendar, customers, bookings — limited money |
| `staff` | Own agenda, complete jobs, limited sales |
| `accountant` | Financial read + expenses/purchases; no social admin |
| `viewer` | Read-only |

Platform role (separate):

| Role | Intent |
|---|---|
| `platform_admin` | Tenants, moderation, support mode (audited) |

---

## Permission catalog (V1)

Format: `domain.action`

```text
# org
org.view
org.manage
org.billing

# members
members.view
members.invite
members.manage

# customers
customers.view
customers.create
customers.edit
customers.delete

# catalog
services.view
services.manage
staff.view
staff.manage

# booking
appointments.view
appointments.view_own
appointments.create
appointments.edit
appointments.cancel
appointments.complete

# sales / money
sales.view
sales.create
sales.refund
payments.record
expenses.view
expenses.manage
purchases.view
purchases.manage
inventory.view
inventory.adjust
payroll.view
payroll.run
reports.view
finance.accounts

# social (studio side)
posts.create
posts.publish
posts.moderate

# chat
chat.view
chat.reply
```

Roles map to permission sets (defaults). Custom overrides OPEN for later; V1 = role packs only.

---

## Default packs (sketch)

| Permission | owner | manager | receptionist | staff | accountant |
|---|:-:|:-:|:-:|:-:|:-:|
| org.manage | ✓ | ✓ | | | |
| org.billing | ✓ | | | | |
| appointments.* | ✓ | ✓ | ✓ | own | view |
| sales.create | ✓ | ✓ | ✓ | ✓ | |
| sales.view | ✓ | ✓ | limited | own | ✓ |
| payroll.run | ✓ | ✓ | | | ✓ |
| posts.publish | ✓ | ✓ | | | |
| inventory.adjust | ✓ | ✓ | | | ✓ |

Exact matrix finalized in implementation tests — table above is intent, not a frozen spreadsheet.

---

## Customer relationship (not a role)

Being a customer of an organization is **`customer_organizations`**, not `organization_members`.

Customer may:

- book with that org
- chat with that org
- see own appointments / payments with that org
- review completed appointments

Customer must **not** see other customers or studio financials.

---

## Support / break-glass

```text
platform_admin enters org in support mode
  → every action audited
  → explicit header / claim support_mode=true
```

Never silent superuser queries without audit.

---

## Entitlements (plan limits)

Separate from RBAC:

```text
staff_count ≤ plan.max_staff
locations ≤ plan.max_locations
customers ≤ plan.max_customers
…
```

Enforced on write in FastAPI. Soft warnings in UI.

---

## Tests required (P0)

```text
UserA/OrgA cannot read OrgB appointments
Staff cannot run payroll without payroll.run
Customer cannot list org sales
Revoked membership → 403 on next request
```

---

## Related

- [AUTH_MODEL.md](AUTH_MODEL.md)
- [DOMAIN_MODEL.md](DOMAIN_MODEL.md)
