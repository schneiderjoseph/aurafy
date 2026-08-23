# Money model

**Status:** DECIDED · **Priority:** P0  
**Rule:** No important amount is a bare `number` without currency context.

---

## Concepts

```text
Currency          ISO code (HTG, USD, CAD, …)
ExchangeRate      base → quote at effective_at, with source
Money             { amount_minor, currency }   // amounts in minor units (cents)
ConvertedMoney    original + rate snapshot + base representation
```

---

## Organization money settings

```text
Organization
├── base_currency          // reporting default (e.g. HTG)
├── allowed_currencies[]   // HTG, USD, …
├── timezone
└── locale
```

Studio may set a **commercial exchange rate** override vs automatic/bank rate.

---

## Exchange rates

```text
exchange_rates
  id
  organization_id?       // null = platform rate; set = org override
  base_currency
  quote_currency
  rate                   // high precision decimal
  effective_at
  source                 // manual | automatic | locked
  source_reference
  created_at
```

Rules:

- Historical transactions **keep the rate used at posting time**
- Never revalue past rows when today's rate changes
- Support manual entry for markets without reliable API feeds

---

## Transaction pattern

Every financial document stores:

```text
document_currency
document_amount_minor

// when converted to org base for reporting:
base_currency
base_amount_minor
exchange_rate
exchange_rate_at
exchange_rate_source
```

### Sale example (HTG salon, USD payment)

```text
Sale:
  total: 5,000 HTG
  rate: 1.0
  base: 5,000 HTG

Payment:
  amount: 40 USD
  rate: 132.50
  base: 5,300 HTG
```

Sale currency ≠ payment currency is **normal**.

---

## Domain objects using Money

| Domain | Examples |
|---|---|
| Catalog | Service price, variant price |
| Sales | Line items, discounts, tips, totals |
| Payments | Amount, method, status |
| Purchasing | PO lines, invoice totals |
| Inventory | Unit cost on receipt |
| Expenses | Operating expense amount |
| Payroll | Salary, commission, bonus, deduction, net pay |
| Financial accounts | Balance snapshots, movements |

---

## Payroll & multi-currency

Employee compensation may be defined in USD while org base is HTG:

```text
Contract:
  salary: 500 USD / month

Payroll run:
  original: 500 USD
  rate snapshot: 132.50
  base equivalent: 66,250 HTG

Payment:
  paid: 500 USD (actual disbursement)
```

Both representations retained.

---

## Compensation history

```text
compensation_rules
  staff_id
  rule_type          // salary | commission_pct | fixed | …
  parameters         // JSON or typed columns
  effective_from
  effective_to
```

Payroll calculations **snapshot** applicable rules on the earning row — past sales keep old commission %.

---

## Financial accounts

```text
financial_accounts
  organization_id
  name                 // Cash HTG, MonCash, Bank USD, …
  currency
  type                 // cash | bank | mobile_money | …
  is_active

financial_movements
  account_id
  direction            // in | out
  money                // amount + currency
  base_money           // converted snapshot
  reference_type       // sale | payment | expense | payroll | …
  reference_id
  occurred_at
```

Enables end-of-day reconciliation: expected vs actual vs difference.

---

## Three layers (do not collapse)

```text
Operational     Appointments, inventory moves, time tracking
Financial       Sales, payments, purchases, expenses, payroll
Accounting      Journal entries, periods (foundation V1; full UI later)
```

**Purchases ≠ Expenses ≠ Payroll** — separate modules, separate workflows.

---

## Reporting

Org reports default to **base_currency**.  
Drill-down shows original transaction currency.

## FX gain / loss (DECIDED for V1 foundation)

V1 **does not** require a full FX P&amp;L UI, but the model must not pretend FX differences do not exist.

| Concept | V1 rule |
|---|---|
| **Realized FX** | When a multi-currency document is **settled** (e.g. sale in HTG paid in USD, or foreign balance closed), compute difference between expected base (at document rate) and payment base (at payment rate). Persist on the payment / settlement row as `fx_gain_loss_base_minor` (signed). Optional journal line later. |
| **Unrealized FX** | Revaluation of open foreign balances at period end — **OUT of V1 UI**. Schema may reserve `revaluation_runs` later; do not silently revalue history. |
| **Accounting** | Foundation: realized FX may post to a dedicated equity/P&amp;L account when journal entries are generated; until then, store on financial row + report in basic dashboard as “FX difference”. |

Never overwrite historical rates to “fix” FX. Always snapshot.

---

## Related

- [DOMAIN_MODEL.md](DOMAIN_MODEL.md)
- [PRODUCT_DECISIONS.md](../00-product/PRODUCT_DECISIONS.md)
- [NOTIFICATIONS_MODEL.md](NOTIFICATIONS_MODEL.md)
