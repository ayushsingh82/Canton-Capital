# Canton Analytics — Demo Guide

Welcome to the Canton Analytics interactive demo. This guide outlines the flow for utilizing the application and explains how you can acquire Splice testnet tokens to interact with real ledger operations.

## Complete Demo Flow

The application provides a seamless flow from initial capital allocation to governance execution. Here is the suggested path to demonstrate all features:

### 1. Create a Fund
1. Navigate to **Create** (`/create-fund`).
2. Input a unique Manager Party name (e.g., `Manager::alpha`) and an initial Capital allocation.
3. Click **Create** to post to `/api/funds` and initialize your fund in the simulated store (or submit via JSON API if connected).
4. You will be redirected to the Fund details page where you can see the new Treasury balance.

### 2. Formulate a Proposal
1. On the Fund detail page, click **New proposal** (or use the top nav).
2. Select your newly created Fund from the dropdown.
3. Add a description (e.g., *“Allocate 250k to real-estate structured notes”*) and the precise amount.
4. Click **Submit proposal**. This generates the Proposal contract and waits for voting.

### 3. Vote on the Proposal
1. The new proposal is now Open. On the Proposal detail page, you will see the YES/NO tallies at zero.
2. Click **Vote YES** or **Vote NO** to cast decisions. The voting models a multi-party DAO where allocators evaluate the request.
3. Observe the live tally update.

### 4. Execute the Decision
1. Once **YES** votes strictly exceed **NO** votes, the proposal passes threshold.
2. Click **Execute**. This closes the proposal, updates its state to Executed, and theoretically disperses funds from the Treasury.

### 5. Review Global Analytics
1. Navigate to the **Dashboard** (`/dashboard`). You will immediately see Recharts-powered interactive analytics showing Capital Trajectory, Fund Distributions, and Monthly Flows.
2. Go to **Analytics** (`/analytics`) to see deepened metrics: Voting distributions, Multi-axis radar scoring for Funds, and Participation Gauges based on the activity you just performed.

---

## Obtaining Splice Testnet Tokens

If you are expanding this demo from the in-memory store to live Canton/Splice Testnet interactions, you will need Testnet CC (Canton Coin) / Amulets.

**How to get Testnet Tokens:**
1. Secure a Wallet SDK instance or use the Splice App Wallet connected to Testnet.
2. Complete the initial SV (Sponsor Validator) onboarding if you are spinning up a new participant.
3. Locate the **Testnet Faucet**. The faucet provides a starting allocation of CC.
4. If using Wallet SDK scripts directly, you can programmatically tap the internal faucet (when testing locally) like so:
   ```typescript
   await sdk.tokenStandard?.createAndSubmitTapInternal(
       validatorOperatorParty!,
       '20000000', // Amount to tap
       {
           instrumentId: 'Amulet',
           instrumentAdmin: instrumentAdminPartyId,
       }
   )
   ```
5. Once your party possesses Amulets (UTXOs), you can cover the traffic costs of your Daml transactions on the Canton Network.
