# WALLET INTERACTION AUDIT — x402 DIGITAL HUMAN MARKETPLACE

## 1. Existing Wallet Implementation
- **Packages Installed**:
  - `@perawallet/connect` (^1.4.1 / 1.6.0) in `knowledger/projects/knowledger-frontend/package.json`
  - `@txnlab/use-wallet-react` (^4.0.0) in `knowledger/projects/knowledger-frontend/package.json`
  - `algosdk` (^3.0.0) in frontend & backend
- **Initialization**:
  - `WalletManager` initialized in `knowledger/projects/knowledger-frontend/src/App.tsx` with providers: `WalletId.DEFLY`, `WalletId.PERA`, `WalletId.EXODUS` (and `WalletId.KMD` on localnet).
- **Existing Connection & Disconnect UI**:
  - Component `ConnectWallet.tsx` renders a modal opening wallet options and calling `wallet.connect()` or `activeWallet.disconnect()`.
  - Component `Account.tsx` displays `activeAddress` and a link to `lora.algokit.io` explorer.

## 2. Existing Transaction Implementation
- **Frontend Transaction Code**:
  - Component `Transact.tsx` demonstrates transaction signing using `useWallet()`'s `transactionSigner` and `AlgorandClient` from `@algorandfoundation/algokit-utils`.
- **Backend Transaction Code**:
  - `backend/src/blockchain/blockchain.service.ts` uses `algosdk.Algodv2` and `algosdk.Indexer` to query balance (`getAccountInformation`) and lookup transactions (`verifyTransactionOnChain`).

## 3. Existing Network
- **Algorand Network**: `Algorand TestNet`
- **Algod Node**: `https://testnet-api.algonode.cloud`
- **Indexer**: `https://testnet-idx.algonode.cloud`

## 4. Existing API & Payment Service
- **Backend Service**: `backend/src/index.ts` (Express server on port 8000)
- **x402 Middleware & Service**: `backend/src/x402/x402.middleware.ts` and `backend/src/x402/x402.service.ts` generate requirement nonces and verify proof strings.
- **Frontend API Client**: `knowledger/projects/knowledger-frontend/src/services/api.ts` connects to `http://localhost:8000/api/v1`.

## 5. Existing Wallet UI
- `Navbar.tsx` displays a static/hardcoded wallet balance badge (`walletBalance.toFixed(1) ALGO`).
- `DigitalTwinChat.tsx` handles HTTP 402 challenge modals, but currently triggers client-side mock proofs rather than building & requesting a real signed Algorand transaction via Pera Wallet.

## 6. Missing Functionality
1. **Centralized Pera Wallet Service** (`services/peraWallet.ts`): Single source of truth for Pera Wallet connection, signing, disconnection, reconnection, balance, and network validation.
2. **Centralized Wallet State**: State machine tracking statuses (`DISCONNECTED`, `CONNECTING`, `CONNECTED`, `SIGNING`, `TRANSACTION_PENDING`, `VERIFYING`, `READY`, `ERROR`).
3. **Cryptographic Nonce Verification**: Backend endpoints (`POST /api/wallet/nonce` and `POST /api/wallet/verify`) to verify ownership of the wallet signature before marking `wallet.verified = true`.
4. **Real Blockchain Balance Integration**: Backend endpoint (`GET /api/wallet/balance`) querying Algorand TestNet via `Algodv2` node.
5. **Strict Network Safeguard**: Enforcement that `expectedNetwork === actualNetwork` (Algorand TestNet) before signing transactions.
6. **Connected Wallet Panel & Address Modal**: Interactive panel showing Pera Wallet status, address formatting, balance refresh, clipboard copy, network display, and transaction history.
7. **End-to-End x402 Real Payment Flow**:
   - Backend payment requirement generation (`POST /api/payments/prepare`)
   - Unsigned transaction construction for 0.01 ALGO per query (Pay-Per-Use) or subscriptions (7-day / 30-day)
   - Opening Pera Wallet for user authorization & signature
   - Submitting transaction to Algorand TestNet
   - Submitting `txId` to backend (`POST /api/payments/verify`)
   - Server-side independent validation of transaction on TestNet (sender, receiver, amount, confirmed round, duplicate protection)
   - Unlocking AI access only after confirmed payment
   - Revenue distribution recording (gross amount, platform fee, creator amount)
8. **Real Wallet Transaction History**: Backend endpoint (`GET /api/wallet/transactions`) and UI details view with explorer links.

## 7. Files That Need Modification / Addition
- `docs/WALLET_INTERACTION_AUDIT.md` (Created)
- `knowledger/projects/knowledger-frontend/src/services/peraWallet.ts` (New)
- `knowledger/projects/knowledger-frontend/src/services/api.ts` (Modify)
- `knowledger/projects/knowledger-frontend/src/components/Navbar.tsx` (Modify)
- `knowledger/projects/knowledger-frontend/src/components/ConnectedWalletModal.tsx` (New)
- `knowledger/projects/knowledger-frontend/src/components/PaymentModal.tsx` (New)
- `knowledger/projects/knowledger-frontend/src/components/DigitalTwinChat.tsx` (Modify)
- `knowledger/projects/knowledger-frontend/src/Home.tsx` (Modify)
- `backend/src/api/routes/wallet.routes.ts` (New)
- `backend/src/api/routes/payments.routes.ts` (New)
- `backend/src/api/routes/subscriptions.routes.ts` (New)
- `backend/src/blockchain/blockchain.service.ts` (Modify)
- `backend/src/x402/x402.service.ts` (Modify)
- `backend/src/x402/x402.middleware.ts` (Modify)
- `backend/src/api/routes/ai.routes.ts` (Modify)
- `backend/src/index.ts` (Modify)
- `docs/WALLET_INTERACTION.md` (New - Phase 35)
