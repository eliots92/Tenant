# Silver Star Capital — Resident Portal

A resident-facing companion to the manager Field-Reporting app. It teaches
residents **what they are responsible for and what to fix**, shows their
per-unit lease and utility obligations, and lets them file a maintenance
request that routes to the property manager.

`index.html` is fully self-contained — one file, no build step, no
dependencies. Open it in a browser or host it as a static page.

## What it does

- **The gate** — the resident enters their own name, property address, and
  unit. There is no dropdown of other homes; the typed address is matched to
  the right unit behind the scenes so the whole experience is tailored.
- **Who fixes this?** — the handbook's Maintenance Responsibility Guide as
  tap-through cards with a clear verdict (**You handle this** / **We handle it —
  report it** / **Shared**), the tenant-vs-owner split, and DIY steps for the
  tenant items. Property-aware where the lease is (e.g. lawn care is the
  tenant's at the single-family homes, the owner's at the co-living houses).
- **Report an issue** — a guided funnel with the handbook's response windows
  (Emergency same-day 24/7 → Project scheduled). Saves on-device and POSTs to a
  configurable Formspree endpoint.
- **My lease & utilities** — per-unit: utilities you pay and the provider to set
  up, what the owner covers, late/NSF fees, grace period, renter's-insurance
  requirement, pet/parking rules, deposit, and any special terms.
- **Emergency help** — the handbook's emergency procedures with tap-to-call
  vendors routed by service area, plus the gas-emergency line where the home
  has gas.
- **Handbook** — the full Resident Handbook reference (workflow, entry rules,
  house rules, insurance).

## Configuration

All editable config is at the top of the `<script>` in `index.html`:

- `FORMSPREE_REQUESTS` — paste your Formspree endpoint to receive emailed
  requests. Left as an `XXXX` placeholder, nothing is sent; the app still works
  fully on-device and shows the official Maintenance Request Form link.
- `OFFICIAL` — the maintenance form URL, monitored inbox, and gas-emergency line.
- `PROPERTIES` — the residential units, each with utilities, lease terms, owner,
  and emergency service area.
- `RESP` — the Maintenance Responsibility Guide rows.
- `EMERGENCY_VENDORS` — the emergency vendor directory by service area.

Content is grounded in the Silver Star Capital Residential Handbook & Service
Protocol and the tenant/property master data.
