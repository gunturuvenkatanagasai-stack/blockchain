# x402 PAYMENT PROTOCOL ARCHITECTURE (ALGORAND)

## Protocol Execution Sequence

```text
CLIENT                           RESOURCE SERVER                       FACILITATOR / ALGORAND
  │                                    │                                        │
  │─── 1. POST /api/v1/ai/chat ───────►│                                        │
  │     (No Payment Header)            │                                        │
  │                                    │                                        │
  │◄── 2. HTTP 402 Payment Required ───│                                        │
  │     Header: WWW-Authenticate        │                                        │
  │     Payload: {                      │                                        │
  │       amountMicro: 50000,          │                                        │
  │       assetId: 31566704,           │ (USDC TestNet Asset ID)                │
  │       payee: "CREATOR_ALGO_ADDR",  │                                        │
  │       nonce: "random_uuid_nonce"   │                                        │
  │     }                              │                                        │
  │                                    │                                        │
  │─── 3. Client Signs Algorand Tx ────┼───────────────────────────────────────►│
  │     (via Pera/Defly Wallet)        │                                        │
  │                                    │                                        │
  │─── 4. POST /api/v1/ai/chat ───────►│                                        │
  │     Header: X-402-Payment-Proof:   │                                        │
  │             "TX_HASH:NONCE"        │                                        │
  │                                    │                                        │
  │                                    │─── 5. Verify Tx on Algorand Indexer ──►│
  │                                    │◄── 6. Tx Confirmed (Amount & Payee) ───│
  │                                    │                                        │
  │                                    │─── 7. Execute RAG + LoRA AI ───────────│
  │                                    │                                        │
  │◄── 8. HTTP 200 OK + AI Response ───│                                        │
```

---

## Payment Middleware Verification Logic

```typescript
export async function x402Middleware(req: FastifyRequest, reply: FastifyReply) {
  const paymentProof = req.headers['x-402-payment-proof'] as string;

  if (!paymentProof) {
    const requirement = await x402Service.generateRequirement(req.params.digitalHumanId);
    return reply.status(402).send({
      error: "Payment Required",
      protocol: "x402",
      requirement
    });
  }

  const isValid = await x402Verifier.verifyTransaction(paymentProof);
  if (!isValid) {
    return reply.status(402).send({ error: "Invalid or Unsettled Payment Proof" });
  }
}
```
