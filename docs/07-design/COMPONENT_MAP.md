# Component map

**Version:** 0.0.0 · **Status:** DECIDED (inventory)  
Components live in `packages/ui` (web) with mobile counterparts via tokens + gluestack later.

---

## Shared primitives

```text
Button · IconButton · Input · Textarea · Select · Checkbox · Switch
Dialog · Sheet · Drawer · Popover · Tooltip
Avatar · Badge · Chip · Tabs · Toast
Skeleton · EmptyState · ErrorState · Spinner
```

---

## Consumer / social

```text
PostCard          feed unit (4:5 media)
PostDetail
EngagementBar     like · comment · save · share
BookThisLookButton
StudioCard
ServiceCard
ProfileHeader     user or studio
FollowButton
FeedTabs          For You | Following | Explore
ChatThread · ChatBubble · ChatComposer
```

---

## Booking

```text
BookingSheet
ServicePicker
StaffPicker       specific | any available
SlotGrid
BookingSummary
BookingStatusBanner
```

---

## Studio / ops

```text
AppSidebar · AppTopbar
StatBlock · MoneyDisplay      (amount + currency)
CalendarDay · CalendarWeek · AppointmentBlock
CustomerRow · CustomerHeader
DataTable · FilterBar
SaleLineEditor · PaymentForm · FxSnapshotHint
```

---

## Rules

- Prefer composing primitives over one-off screens
- Money always through `MoneyDisplay` (never raw numbers)
- Every interactive control: accessible name + focus ring
- Cite design-system-standard rule IDs in UI reviews

---

## Related

- [BRAND.md](BRAND.md)
- [DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md)
