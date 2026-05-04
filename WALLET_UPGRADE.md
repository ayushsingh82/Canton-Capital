# Upgrading to Wallet SDK v1

This document outlines the transition to **Wallet SDK v1**, which serves as the new long-term API shape for application development targeting Canton 3.4.X - 3.5.X and Splice 0.5.X - 0.6.X.

## Why Move to v1?

The v1 release introduces a cleaner, explicit model focused on composability and thread safety:

1. **Stateless Default**: Global SDK/controller party states are removed. You must explicitly provide `partyId` during call time, increasing thread safety for concurrent multi-party operations.
2. **Clear Transaction Lifecycle**: Flows are modeled into explicit `prepare -> sign -> execute` steps.
3. **API Organization**: The generic v0 controllers have been restructured into clean namespaces (`ledger`, `party`, `token`, `amulet`, `user`, `asset`, `events`).
4. **Transport Flexibility**: Supports static configuration and provider-based initialization, easily enabling Browser, dApp, and remote wallet setups.
5. **Offline Support**: Wallet SDK v1.1.0 enables SDK signing offline without required ledger access.

## Essential Changes & Migration Guide

### 1. Unified Event Subscriptions (WebSockets)
Instead of polling mechanisms, v1 fully embraces WebSocket async generators for real-time reactivity.

**Subscribe to Ledger Updates:**
```typescript
const stream = sdk.userLedger?.subscribeToUpdates({
    partyId: sender!.partyId,
    interfaceIds: [HOLDING_INTERFACE_ID],
})

for await (const update of stream!) {
    console.log('Received ledger update', update)
    if (done) break
}
```

### 2. Awaiting Execution
Previous variations required `waitForCompletion` with specific offsets. The new SDK simplifies this into combined commands with configurable retry logic.

**New Execution Flow:**
```typescript
const completion = await sdk.userLedger?.prepareSignExecuteAndWaitFor(
    transferCommand,
    keyPairSender.privateKey,
    uuidv4(),
    disclosedContracts,
    10000 // 10 second timeout
)
```

### 3. Controller Naming and Initialization
`LedgerController` parameters are now passed as a named object, improving readability and allowing proxy features.

**v1 Controller Instantiation:**
```typescript
const ledger = new LedgerController({
    userId,
    baseUrl: new URL('http://127.0.0.1:5001'),
    token,
    fetch: myCustomProxyFetch // Optional pass-through
})
```

### 4. Splice Asset Management (UTXOs)
The Token Standard namespace introduces easy-to-use helpers for merging UTXOs and tracking traffic status.

**Merge UTXOs (Max 100 inputs limit split automatically):**
```typescript
const [mergeUtxoCommands, mergedDisclosedContracts] = await sdk.tokenStandard!.mergeHoldingUtxos()!

for (let i = 0; i < mergeUtxoCommands.length; i++) {
    await sdk.userLedger?.prepareSignExecuteAndWaitFor(
        mergeUtxoCommands[i],
        keyPairSender.privateKey,
        uuidv4(),
        mergedDisclosedContracts
    )
}
```

### 5. Multi-hosted Parties & Observability
You can spin up external parties hosted across multiple validators simultaneously.

```typescript
async generateExternalParty(
    publicKey: PrivateKey,
    partyHint?: string,
    confirmingThreshold?: number,
    confirmingParticipantUids?: string[],
    observingParticipantUids?: string[] // NEW in v1 to add pure observers
)
```

### Compatibility Path
- **v1.1.0**: Canton 3.5.X & Splice 0.6.X (Backwards compatible with 3.4.X).
- Requires `decimal.js` internally now to prevent floating-point precision gaps when scaling Splice CC amulets.
- Switch your imports in the browser environments to use `@canton-network/core-ledger-client` directly without node-specific polyfills.
