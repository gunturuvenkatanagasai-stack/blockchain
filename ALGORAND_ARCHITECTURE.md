# ALGORAND SMART CONTRACTS & BLOCKCHAIN INTEGRATION

## Smart Contract Registry Suite

1. **ContentHashRegistry App (`ContentHashRegistry.py` / AlgoKit):**
   - Registers SHA-256 hashes of expert knowledge documents on Algorand TestNet.
   - Stores: `(document_id, expert_address, content_hash, timestamp, round)`.

2. **DigitalTwinRegistry App (`DigitalTwinRegistry.py`):**
   - On-chain registry of Digital Humans.
   - Links Digital Human UUID, metadata hash, creator Algorand address, and royalty basis points.

3. **RevenueSharing & CreatorPayout Contract (`CreatorPayout.py`):**
   - Accepts microUSDC payments.
   - Splits protocol fee (e.g. 10% = 1000 bps) to Platform Treasury Address and creator share (90% = 9000 bps) to Expert Wallet.
   - Handles claimable creator balances and prevents double-spend / unauthorized withdrawals.

---

## Wallet Integration (Frontend & Backend)

- **Frontend:** Integrates `@txnlab/use-wallet-react` supporting **Pera Wallet** and **Defly Wallet**.
- **Security:** Private keys / mnemonics are **NEVER** transmitted to or requested by the backend or stored in source code.
- **Backend:** Performs read-only transaction verification via Algorand Indexer REST API (`testnet-idx.algonode.cloud`).
