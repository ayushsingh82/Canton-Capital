# Canton Capital (Canton Analytics)

Next.js app for a **hackathon-style demo**: private funds, proposal flow, voting, execution, and an **analytics dashboard**. The **UI matches the PolkaBasket app** in this repo (floating nav, silver PixelBlast hero, gradient headlines, `rounded-2xl` glass cards)—see `polkabasket/src/pages/HomePage.tsx`. App Router **API routes** can point at a real **Canton JSON API** when you are ready.

## What you get

- **Landing** (`/`) — product story and CTA to the dashboard.
- **Dashboard** (`/dashboard`) — totals, success rate, participation, and simple charts; data from `GET /api/analytics` (polls every 4s).
- **Funds** (`/funds`, `/funds/[id]`) — list and fund detail (treasury, proposals, investors).
- **Create fund** (`/create-fund`) — `POST /api/funds`.
- **Proposals** (`/proposal/create`, `/proposal/[id]`) — create, vote yes/no, execute if passed; backed by in-memory store + API.
- **Advanced analytics** (`/analytics`) — extra readouts for judges (same analytics engine as the dashboard).

Without ledger env vars, the app uses a **seeded in-memory store** so the UI and API stay demo-ready. With `CANTON_URL` and `CANTON_TOKEN`, `/api/analytics` can **merge** live contract counts when the JSON API returns `Fund` / `Proposal` templates.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Open dashboard** on the home page, or go straight to `/dashboard`.

## Production build

```bash
npm run build
npm start
```

## Environment variables

Copy `.env.example` to `.env.local` and set as needed:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CANTON_JSON_API_URL` or `CANTON_URL` | Base URL of the **Canton JSON API** (port **7575** with `daml start` — same as **Slinky**). No `/v1` suffix. |
| `NEXT_PUBLIC_DAML_PACKAGE_ID` | From `daml build` — required for live **v1/query** of `CantonCapital:Fund` and `…:Proposal` (see `lib/canton-capital/config.ts`). |
| `CANTON_TOKEN` | Optional bearer. If unset but a URL is set, the server uses a **sandbox admin JWT** (unsigned), like Slinky local dev. `JSON_API_TOKEN` is an alias. |

**Ledger path:** analytics uses **POST `/v1/query`** (not v2), aligned with `slinky/src/lib/canton.ts`. If the API is unset or unreachable, the app uses the in-memory **demo store** only.

See repo root **`docs/CANTON_DAML_AND_STACK.md`** for Daml + folder overview.

## Project layout

```text
app/
  page.tsx                 # Landing
  dashboard/page.tsx
  funds/page.tsx
  funds/[id]/page.tsx
  create-fund/page.tsx
  proposal/create/page.tsx
  proposal/[id]/page.tsx
  analytics/page.tsx
  api/                     # Route handlers (funds, fund, proposal, vote, execute, analytics)
components/canton-capital/ # CcBox, StatsCard, MiniCharts
components/polkabasket-style/ # PolkaNavbar, LandingPolka, PixelBlast (copied from polkabasket)
lib/canton-capital/        # types, store, analytics, config, ledger-map, v1 JSON API (canton.ts)
lib/polka-ui.ts            # Shared Tailwind class strings (PolkaBasket-aligned)
daml/
  CantonCapital.daml       # Minimal Fund, Proposal, Treasury templates
daml.yaml                  # Daml package `canton-capital`
```

## API (summary)

| Method | Path | Description |
|--------|------|--------------|
| `GET` | `/api/funds` | List funds |
| `POST` | `/api/funds` | Create fund (`manager`, `initialCapital`) |
| `GET` | `/api/fund/[id]` | Fund + proposals for that fund |
| `POST` | `/api/proposal/create` | Create proposal (`fundId`, `description`, `amount`) |
| `GET` | `/api/proposal/[id]` | Proposal + fund |
| `POST` | `/api/vote` | `{ proposalId, choice: "yes" \| "no" }` |
| `POST` | `/api/execute` | `{ proposalId }` — succeeds only if yes votes exceed no votes |
| `GET` | `/api/analytics` | Aggregated metrics + chart series |

## Daml

Templates live in `daml/CantonCapital.daml` (`Fund`, `Proposal`, `Treasury`). Build with the [Daml SDK](https://docs.daml.com/) matching `sdk-version` in `daml.yaml`:

```bash
daml build
```

Deploy and wire template IDs to your participant / JSON API when you move beyond the demo store.

## Suggested demo flow

1. **Create fund** — `/create-fund`
2. **Create proposal** — `/proposal/create`
3. **Open proposal** — vote **YES** until it passes, then **Execute**
4. **Dashboard / Analytics** — show numbers updating

## Related repo

The sibling folder **canton-payroll** is a separate project (CantonPay payroll UI). This **canton-analytics** app is standalone and does not depend on it.

## License

Private / hackathon use unless you add your own license.
