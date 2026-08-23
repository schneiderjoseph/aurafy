# Surface map — first UI prototype

**Version:** 0.0.0 · **Status:** DECIDED  
**Rule:** ~10–12 screens only. Happy path before breadth.

---

## Consumer (8)

| # | Surface | Job |
|---|---|---|
| 1 | Home / Feed | For You + Following; post cards; Book this look |
| 2 | Explore | Search styles / studios / looks |
| 3 | Post detail | Media, tags, engagement, book CTA |
| 4 | Studio profile | Grid, services, follow, book |
| 5 | Service detail | Duration, price, book |
| 6 | Booking flow | Services → staff? → slot → request |
| 7 | Chat | Customer ↔ organization |
| 8 | Customer profile | Public /@user |

### Happy path to validate

```text
Feed → Post → Book this look → Service/staff → Slot → Request → Confirmation
```

---

## Studio (4)

| # | Surface | Job |
|---|---|---|
| 9 | Dashboard | Today: appointments, sales snapshot |
| 10 | Calendar | Day/week; confirm/decline; complete |
| 11 | Customer (CRM) | Profile, history, notes |
| 12 | Sales / daily ops | Complete → sale → payment (multi-currency) |

### Happy path to validate

```text
New booking → Confirm → Appointment → Complete → Sale → Payment
```

---

## Explicitly later (UI)

```text
Full payroll config · supplier deep CRUD · accounting settings
Inventory advanced · marketing campaigns · platform admin
Mobile parity for every studio screen
```

Architecture still models them; first prototype does not.

---

## Mobile (V1 prototype)

```text
apps/mobile — foundation + consumer feed/book shell
Studio calendar subset when web studio path is stable
```

---

## Related

- [COMPONENT_MAP.md](COMPONENT_MAP.md)
- [MVP_SCOPE.md](../00-product/MVP_SCOPE.md)
