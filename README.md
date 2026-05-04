# Canton Capital (Canton Analytics)

Next.js app for a **hackathon-style demo**: private funds, proposal flow, voting, execution, and an **analytics dashboard**—with a **black / silver** UI and App Router **API routes** you can point at a real **Canton JSON API** when you are ready.

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
| `CANTON_URL` | Base URL of the Canton JSON API (e.g. `https://…`). Also accepts the same value as `NEXT_PUBLIC_CANTON_JSON_API_URL` in `lib/canton-capital/canton.ts`. |
| `CANTON_TOKEN` | Bearer token for ledger calls. `JSON_API_TOKEN` is an alias. |

If these are unset, all write/read paths still work against the **demo store** in the same Node process (data resets on cold start in serverless; in `next dev` it persists for the life of the dev server).

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
components/canton-capital/ # Navbar, cards, landing, charts
lib/canton-capital/        # types, store, mock seed, analytics, optional fetchContracts
styles/canton-capital.css   # Black / silver / square “cc-*” theme
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
