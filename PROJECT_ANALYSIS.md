# PROJECT ANALYSIS & SYSTEM ARCHITECTURE

## System Vision
**"Every Human's Knowledge Can Earn Forever."**
The x402 Digital Human Marketplace is a decentralized platform enabling domain experts (professors, software architects, healthcare professionals, HR coaches, founders, educators) to monetize their verified knowledge by creating AI Digital Humans.

Users interact with these Digital Humans under various pricing models (pay-per-use, weekly, monthly, annual, enterprise) gated by the **x402 payment protocol** on the **Algorand Blockchain**.

---

## Existing Stack & Workspace Components

1. **Frontend Applications:**
   - `knowledger/projects/knowledger-frontend`: Main Vite + React + TypeScript web application with Pera/Defly Algorand wallet integration, Marketplace UI, Chat UI, AI Assistant, Creator Wizard, Career & Wellness modules.
   - `x402-digital-human/apps/web`: Next.js 14 glassmorphism application.

2. **Smart Contracts:**
   - `knowledger/projects/knowledger-contracts`: Algorand smart contract project powered by AlgoKit, Python (PyTeal/Beaker/Algorand Python SDK).
   - `x402-digital-human/contracts`: Digital Twin & Content Hash Solidity/Algorand ABI contracts.

3. **Reference Payment Examples:**
   - `x402-examples` & `x402-basic-tutorial`: Payment protocol HTTP 402 middleware, client challenge solver, and Algorand TestNet settlement facilitator.

---

## Architectural Principles

```text
RAG               = Knowledge retrieval from vectorized documents (What the expert knows)
LoRA              = Fine-tuned PEFT adapters (How the expert speaks/behaves)
LLM               = Core reasoning engine
x402              = HTTP 402 payment middleware & verification
Algorand          = On-chain settlement, licensing, proof-of-knowledge hashes
Smart Contracts   = Immutable registry, royalty, fee splits
Backend           = Business logic, auth, metering, queuing
PostgreSQL        = Structured state + pgvector vector embeddings
Frontend          = User Interface (Preserved without redesign)
```

---

## Key Core Workflow

```text
[ Expert ] ──► Uploads PDF/Doc ──► Document Processing ──► Chunks ──► Embeddings ──► pgvector
    │                                                                                   │
    ├──► Uploads Approved Q&A Examples ──► Dataset Builder ──► LoRA Training (PEFT)    │
    │                                                                   │               │
    └──► Registers Hash on Algorand ──► Algorand Smart Contract        │               │
                                                                        ▼               ▼
[ User ] ──► Selects Digital Human ──► Query ──► x402 402 Challenge ──► [ RAG + LoRA Pipeline ] ──► Response + Citations
                                                     │
                                                     ▼
                                          [ Algorand Settlement ] ──► Creator Earnings
```
