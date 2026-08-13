# PERA WALLET REAL INTERACTION SYSTEM DOCUMENTATION
## x402 Digital Human Marketplace

### Overview
This document details the production-grade Real Pera Wallet Interaction Architecture integrated into the **x402 Digital Human Marketplace**. It enables real on-chain Algorand TestNet payment verification, cryptographic wallet ownership verification, live balance fetching, pay-per-use (0.01 ALGO per query), 7-day weekly subscriptions, 30-day monthly subscriptions, and automated platform revenue distribution.

---

### System Architecture

```
                 USER
                   |
                   v
             CONNECT WALLET
                   |
                   v
             PERA WALLET
                   |
                   v
           USER APPROVES
                   |
                   v
           WALLET CONNECTED
                   |
                   v
         WALLET INFORMATION
                   |
       +-----------+-----------+
       |           |           |
       v           v           v
    Address     Balance     Network
       |
       v
  DIGITAL HUMAN
       |
       v
   ASK QUESTION
       |
       v
  PAYMENT CHECK
       |
       v
 HTTP 402 / x402
       |
       v
 PAYMENT REQUEST
       |
       v
 PERA WALLET
       |
       v
 USER APPROVES
       |
       v
 ALGORAND
       |
       v
 TRANSACTION ID
       |
       v
 BACKEND VERIFICATION
       |
       v
 PAYMENT CONFIRMED
       |
       v
 AI ACCESS UNLOCKED
       |
       v
 DIGITAL HUMAN RESPONSE
       |
       v
 USAGE + REVENUE
```

---

### 1. Wallet Connection Flow
- **Service**: `peraWalletService` (`knowledger-frontend/src/services/peraWallet.ts`).
- Uses `@perawallet/connect` (`PeraWalletConnect`) configured for Algorand TestNet (Chain ID: `416002`).
- Clicking **Connect Pera Wallet** sets state status to `CONNECTING`, opens the Pera Wallet popup/extension, receives the public Algorand address, and validates address format with `algosdk.isValidAddress()`.

---

### 2. Wallet Verification (Nonce Signature Challenge)
- **Endpoints**:
  - `POST /api/wallet/nonce`: Backend generates a cryptographically secure 16-byte random hex nonce with a 10-minute expiry window.
  - `POST /api/wallet/verify`: Front-end requests signature via `peraWallet.signData()` or signed payload. Backend validates signature using `algosdk.verifyBytes()`.
- Upon successful verification, backend sets `wallet.verified = true`.

---

### 3. Real Blockchain Balance Retrieval
- **Endpoint**: `GET /api/wallet/balance?address=<ALGORAND_ADDRESS>`
- Connects directly to Algorand TestNet RPC (`https://testnet-api.algonode.cloud`).
- Queries `algodClient.accountInformation(address)` and returns actual `algo` and `microAlgo` amounts.
- Refreshes automatically after connection, after payment transaction, and on manual refresh click.

---

### 4. Network Enforcement
- Configured for **Algorand TestNet**.
- Standardized guard verifies `expectedNetwork === actualNetwork`. If a network mismatch is detected, transactions are halted immediately and an error is displayed: *"Wrong Algorand network. Please select Algorand TestNet."*

---

### 5. x402 Payment Interaction & Preparation
- When a user submits a paid query without active entitlement, the backend issues an **HTTP 402 Payment Required** response.
- `PaymentModal` displays the Digital Human name, exact payment amount (0.01 ALGO per query), selected plan (Pay-Per-Use, 7-Day Weekly, 30-Day Monthly), network, and receiver treasury address.
- `POST /api/payments/prepare` returns payment requirements and suggested transaction parameters from Algorand TestNet.

---

### 6. Pera Wallet Transaction Signing & Submission
- `PaymentModal` constructs an unsigned Algorand `PaymentTxn` with note payload `x402 Payment:<ID>`.
- Calls `peraWalletService.signTransaction()` to open Pera Wallet for user authorization.
- The signed binary transaction is submitted to Algorand TestNet via Algonode RPC (`https://testnet-api.algonode.cloud/v2/transactions`), returning the transaction ID (`txId`).

---

### 7. Server-Side Blockchain Verification & Anti-Replay Protection
- **Endpoint**: `POST /api/payments/verify`
- Backend queries Algorand Indexer (`https://testnet-idx.algonode.cloud`) to independently verify:
  1. Transaction exists and is confirmed.
  2. Sender matches user wallet address.
  3. Receiver matches expected payee address.
  4. Amount matches required microALGO amount.
  5. Transaction has not been processed previously (`PAYMENT_ALREADY_PROCESSED` anti-replay check).

---

### 8. AI Access Unlocking & Revenue Settlement
- Once transaction status is `CONFIRMED`, AI inference is executed.
- Platform revenue calculation:
  - **Gross Amount**: e.g., 0.01 ALGO
  - **Platform Fee (15%)**: 0.0015 ALGO
  - **Creator Earnings (85%)**: 0.0085 ALGO
- Logs `RevenueRecord` in backend ledger.

---

### 9. Wallet Session Restoration & Disconnect
- **Session Restoration**: On page reload, `peraWalletService.reconnect()` restores active Pera Wallet session automatically without requiring user reconnect.
- **Disconnect**: Clicking **Disconnect** clears wallet state, cached address, and balance.

---

### 10. Security Guarantees
- **ABSOLUTE RULE**: Mnemonic phrases, seed phrases, and private keys are **NEVER requested, NEVER stored, and NEVER transmitted**.
- Frontend transaction details cannot be forged; server-side verification against Algorand Indexer is authoritative.
- Microtransaction double-spending is mathematically impossible due to single-use `txHash` tracking.
