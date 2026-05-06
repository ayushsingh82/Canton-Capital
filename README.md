# Canton Capital

> Private fund operations on the Canton Network — propose, vote, execute, and watch the analytics move in real time.

Canton Capital is a Next.js demo for **on-ledger private capital management**: create a fund, file a proposal, collect votes, execute when it passes, and see treasury, governance, and capital-flow metrics update live on the dashboard. The Daml templates (`Fund`, `Proposal`, `Treasury`) describe the on-ledger model; the App Router API routes can talk to a real Canton **JSON API** when you wire one up, and otherwise fall back to a seeded in-memory store so the UI is always demo-ready.

```
┌──────────────┐    fetch     ┌─────────────────┐   /v1/query   ┌──────────────┐
│  Next.js UI  │  ────────▶   │  /api/* routes  │  ──────────▶  │  Canton JSON │
│  (App Router)│              │   in-mem store  │               │   API + Daml │
└──────────────┘              └─────────────────┘               └──────────────┘
```

---

## Highlights

- **Fund + proposal lifecycle** — create funds, file proposals, vote YES/NO, execute when the count passes. Treasury debits flow back into every chart.
- **Live analytics dashboard** — capital trajectory, fund distribution, monthly inflow/outflow, vote outcomes, weekly activity. Polls `/api/analytics` every 4s.
- **Advanced analytics view** — participation gauge, fund radar, vote distribution per proposal, execution timeline, and best-voter ranking.
- **Real-or-demo data path** — runs on a seeded store out of the box; merges live contract state when `CANTON_URL` is set.
- **Daml-backed model** — `daml/CantonCapital.daml` is the source of truth for templates and choices.

---

## What you get

| Route | Purpose |
|-------|---------|
| `/` | Landing — product story, hero, CTA into the dashboard |
| `/dashboard` | Live operations dashboard — totals, success rate, participation, multi-chart layout |
| `/funds`, `/funds/[id]` | Fund index and fund detail (treasury, proposals, investors) |
| `/create-fund` | Create a new fund (`POST /api/funds`) |
| `/proposal/create` | File a new proposal against a fund |
| `/proposal/[id]` | Vote YES/NO and execute when passed |
| `/analytics` | Advanced analytics — gauges, radar, vote breakdowns, execution timeline |

The UI matches the **PolkaBasket** style in the parent repo (floating nav, silver PixelBlast hero, gradient headlines, `rounded-2xl` glass cards). See `components/polkabasket-style/`.

---

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000> and click **Open dashboard**, or jump straight to `/dashboard`.

### Production build

```bash
npm run build
npm start
```

---

## Environment variables

Copy `.env.example` to `.env.local` and set as needed. Without these, the app uses the **seeded in-memory store**.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CANTON_JSON_API_URL` / `CANTON_URL` | Base URL of the **Canton JSON API** (port `7575` with `daml start`). No `/v1` suffix. |
| `NEXT_PUBLIC_DAML_PACKAGE_ID` | From `daml build` — required so `/v1/query` can target `CantonCapital:Fund` and `:Proposal` (see `lib/canton-capital/config.ts`). |
| `CANTON_TOKEN` / `JSON_API_TOKEN` | Optional bearer. If a URL is set without a token, the server uses an unsigned **sandbox admin JWT** (Slinky-style local dev). |

**Ledger path:** analytics uses `POST /v1/query` (not v2), aligned with `slinky/src/lib/canton.ts`. If the API is unset or unreachable, the app falls back to the demo store. See the repo root **`docs/CANTON_DAML_AND_STACK.md`** for the broader Daml + folder overview.

---

## Demo flow (great for a video)

1. **Create fund** → `/create-fund` (e.g. `Manager::alpha`, $1.25M).
2. **File a proposal** → `/proposal/create?fundId=<id>` (e.g. *"Allocate 250k to structured notes"*).
3. **Vote YES** until YES > NO, then **Execute** — watch the treasury debit and the dashboard charts react.
4. **Open `/dashboard`** — totals, capital trajectory, fund distribution, monthly capital flow, weekly activity.
5. **Open `/analytics`** — participation gauge, fund radar, per-proposal vote breakdown, execution timeline.

See **`DEMO.md`** for the verified end-to-end walkthrough, including the route-to-Daml mapping and the wallet/testnet section.

---

## API surface

| Method | Path | Description |
|--------|------|--------------|
| `GET` | `/api/funds` | List funds |
| `POST` | `/api/funds` | Create fund (`manager`, `initialCapital`) |
| `GET` | `/api/fund/[id]` | Fund + proposals for that fund |
| `POST` | `/api/proposal/create` | Create proposal (`fundId`, `description`, `amount`) |
| `GET` | `/api/proposal/[id]` | Proposal + parent fund |
| `POST` | `/api/vote` | `{ proposalId, choice: "yes" \| "no" }` |
| `POST` | `/api/execute` | `{ proposalId }` — succeeds only if YES > NO |
| `GET` | `/api/analytics` | Aggregated metrics + every chart series the dashboard renders |

---

## Project layout

```text
app/
  page.tsx                       # Landing
  dashboard/page.tsx             # Live ops dashboard
  funds/, funds/[id]/            # Fund index + detail
  create-fund/page.tsx
  proposal/create/, proposal/[id]/
  analytics/page.tsx             # Advanced analytics
  api/                           # funds, fund, proposal, vote, execute, analytics
components/canton-capital/       # CcBox, StatsCard, AnalyticsCharts, MiniCharts
components/polkabasket-style/    # PolkaNavbar, LandingPolka, PixelBlast (PolkaBasket-aligned)
lib/canton-capital/              # types, store, analytics, config, ledger-map, canton (v1 JSON API)
lib/polka-ui.ts                  # Shared Tailwind class strings
daml/CantonCapital.daml          # Fund, Proposal, Treasury templates
daml.yaml                        # Daml package: canton-capital
```

---

## Daml

Templates live in `daml/CantonCapital.daml` (`Fund`, `Proposal`, `Treasury`). Build with the [Daml SDK](https://docs.daml.com/) version pinned in `daml.yaml`:

```bash
daml build
```

Once you move past the demo store, deploy and wire the resulting template IDs to your participant / JSON API.

---


## License

Private / hackathon use unless you add your own license.
