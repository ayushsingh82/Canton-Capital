# Canton Capital — Demo Guide

This document is the verified end-to-end walkthrough for Canton Capital. Every step here is exercised against the in-memory store and the live `/api/*` route handlers, and the same Daml templates (`Fund`, `Proposal`) describe the on-ledger model.

---

## Prerequisites

```bash
npm install
npm run dev   # starts at http://localhost:3000
```

No env vars required for the demo store. Add `NEXT_PUBLIC_CANTON_JSON_API_URL`, `CANTON_TOKEN`, and `NEXT_PUBLIC_DAML_PACKAGE_ID` if you want `/api/analytics` to merge live ledger contracts. See `.env.example`.

---

## Complete Demo Flow

### 1. Create a Fund

1. Go to **Create** (`/create-fund`).
2. Manager party (e.g. `Manager::alpha`) and an initial Capital amount.
3. **Create** → POST `/api/funds` → returns `{ id, manager, totalCapital, treasuryBalance, ... }` and redirects to `/funds/{id}`.
4. The fund detail page shows the manager, total capital, and the live treasury balance.

### 2. File a Proposal

1. On the fund detail page click **New proposal**. The link includes `?fundId=<id>` so the form pre-selects your fund.
2. Description (e.g. *"Allocate 250k to real-estate structured notes"*) and amount.
3. **Submit proposal** → POST `/api/proposal/create` → redirects to `/proposal/{id}`.

### 3. Vote on the Proposal

1. The detail page starts at YES = 0 / NO = 0.
2. Click **Vote YES** or **Vote NO** to record votes via POST `/api/vote`.
3. The treasury balance for the parent fund is shown below the tally, so you can confirm it has not yet moved.

### 4. Execute

1. **Execute** is enabled only when YES strictly exceeds NO. Until then the button shows the disabled tooltip.
2. POST `/api/execute` returns `{ proposal, fund }`. The page swaps to a green "Proposal executed" banner with the debit amount, and the linked fund now shows the lower treasury balance.
3. Repeat-execute (already executed) returns HTTP 409. Voting on an executed proposal returns HTTP 400.

### 5. Review Global Analytics

1. **Dashboard** (`/dashboard`) — totals, success rate, participation, capital trajectory, fund distribution, monthly capital flow, activity bars. Polls `/api/analytics` every 4 s.
2. **Analytics** (`/analytics`) — participation gauge, fund radar, vote distribution, execution timeline, best-voter ranking.

---

## How the routes map to Daml

| HTTP route | What the in-memory store does | Equivalent Daml choice |
|------------|------------------------------|------------------------|
| `POST /api/funds` | Create `Fund` row with `treasuryBalance = totalCapital` | `create Fund` |
| `POST /api/proposal/create` | Create `Proposal` row | `create Proposal` |
| `POST /api/vote` (`yes`) | `yesVotes += 1` (refuses if executed) | `Proposal.CastYes` |
| `POST /api/vote` (`no`) | `noVotes += 1` (refuses if executed) | `Proposal.CastNo` |
| `POST /api/execute` | Requires `yesVotes > noVotes`; flips `executed` and subtracts `amount` from the fund treasury | `Proposal.ExecuteProposal` + `Fund.Disburse` |
| `GET /api/analytics` | Aggregates funds + proposals into chart series | Reads the same templates via `POST /v1/query` |

---

## Canton Wallet & Testnet Funds

When you flip on a real Canton participant, this app authenticates and submits via the **Canton Wallet SDK v1** (`@canton-network/core-ledger-client`) using the `prepare → sign → execute` lifecycle. For browser flows, connect the **Splice App Wallet** on the Splice testnet — it holds the Canton Coin (Amulet) UTXOs your party uses to pay traffic.

### Where to obtain Splice testnet tokens (Canton Coin / Amulets)

1. **Splice App Wallet faucet** — onboard your party with a Sponsor Validator, open the wallet, and request testnet CC from the built-in faucet.
2. **Wallet SDK helper** — for scripted/local runs you can tap the validator faucet directly:

   ```typescript
   await sdk.tokenStandard?.createAndSubmitTapInternal(
     validatorOperatorParty!,
     '20000000', // amount to tap
     {
       instrumentId: 'Amulet',
       instrumentAdmin: instrumentAdminPartyId,
     },
   )
   ```

3. **SV onboarding** — only required the very first time you spin up a participant on testnet.

Once your party has Amulets, every Daml transaction this app submits — `CastYes`, `CastNo`, `ExecuteProposal`, `Disburse` — pays Canton Network traffic from those UTXOs.

Compatibility: Canton 3.4.X – 3.5.X, Splice 0.5.X – 0.6.X (see `WALLET_UPGRADE.md`).

---

## Analytics Roadmap & Test Plan

The analytics surface is the demo's payoff. This is the staged plan and the test coverage we need behind each stage.

### Stage 0 — Today (in-memory store)

- ✅ `lib/canton-capital/store.ts` seeds two funds + three proposals.
- ✅ `lib/canton-capital/analytics.ts` builds 12 chart series from those rows.
- ✅ `app/dashboard` and `app/analytics` consume `/api/analytics` (polling every 4 s).
- ✅ Treasury debits on execute now feed back into `capitalDistribution` and the radar `capital` axis.

### Stage 1 — Real ledger reads

- Wire `lib/canton-capital/canton.ts` `loadLedgerCapitalRows` to a participant via `NEXT_PUBLIC_CANTON_JSON_API_URL` + `NEXT_PUBLIC_DAML_PACKAGE_ID`.
- Ensure `LedgerFundPayload.treasuryBalance` is populated by re-deploying the updated Daml.
- Confirm the merge (`mergeCapitalRows`) prefers ledger contracts when both store and ledger expose the same id.

### Stage 2 — Real ledger writes

- Replace each route handler's in-memory call with a Wallet SDK `prepareSignExecuteAndWaitFor`:
  - `POST /api/funds` → `create Fund`
  - `POST /api/proposal/create` → `create Proposal`
  - `POST /api/vote` → `CastYes` / `CastNo`
  - `POST /api/execute` → `ExecuteProposal` + `Fund.Disburse`
- Keep the in-memory store as a fallback for offline / hackathon mode.

### Stage 3 — Streaming analytics

- Subscribe via Wallet SDK `subscribeToUpdates` to push contract changes into the analytics aggregator instead of 4 s polling.
- Replace the simulated `capitalOverTime` / `monthlyCapitalFlow` series with derived time-bucket aggregations from the actual update stream.

### Test Plan

| Layer | Coverage | Tooling |
|-------|---------|---------|
| **Pure analytics** | `buildAnalytics([], [])` returns zero-safe defaults; totals match input sums; `successRate` = passed / total; `participationRate` clamps to [0, 1]; `capitalDistribution` colors cycle; `voteBreakdown` truncates long descriptions to 28 chars. | `vitest` against `lib/canton-capital/analytics.ts`. |
| **Store invariants** | `executeProposal` returns each `ExecuteFailure` reason (`not-found`, `already-executed`, `not-passed`, `insufficient-treasury`); treasury never goes negative; double-execute is a no-op. | `vitest` against `lib/canton-capital/store.ts`. |
| **API routes** | Each handler returns the documented status codes (200 / 400 / 404 / 409); `/api/funds` rejects negative capital; `/api/vote` rejects executed proposals; `/api/execute` returns `{ proposal, fund }` shape on success. | `vitest` + `next-test` invoking the route handlers, or `supertest` against a child `next dev`. |
| **Ledger mapping** | `contractToFundRow` honors `treasuryBalance` when present, falls back to `totalCapital` when absent; `contractToProposalRow` resolves `fundId` via `fundManager` lookup; `mergeById` lets ledger rows shadow local rows. | `vitest` against `lib/canton-capital/ledger-map.ts` with fixture payloads. |
| **End-to-end demo flow** | Reproduce the four-step DEMO walkthrough: create fund → create proposal pre-selected via `?fundId=` → vote → execute → confirm treasury debit + dashboard refresh. | `playwright test` driving `next dev` on a random port. |
| **Daml** | `daml test` scripts: a fund manager onboards an investor, a proposal collects YES votes, manager executes, treasury debits via `Disburse`. | `daml test` (Daml SDK matching `daml.yaml`). |
| **Smoke** | `next build` exits 0; every page returns 200; `/api/analytics` returns `ledgerConnected: false` when no env vars set, `true` when Canton is reachable. | CI step in GitHub Actions. |

### Concrete next-step commands

```bash
# Unit tests for the analytics + store layers
npx vitest run lib/canton-capital

# Daml model tests (after `daml build`)
daml test

# End-to-end UI flow
npx playwright test e2e/demo-flow.spec.ts
```

(The test files do not exist yet — Stage 0 of the roadmap is to add them; the table above is the contract those tests must satisfy.)
