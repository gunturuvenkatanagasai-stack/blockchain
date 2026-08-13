# FRONTEND INTEGRATION SPECIFICATION

## Overview
This document specifies the exact mapping between the existing frontend components (`knowledger-frontend` & `x402-digital-human/apps/web`) and the backend services (Node.js/TypeScript API, Python FastAPI AI/LoRA Service, PostgreSQL + pgvector Database, x402 Payment Middleware, and Algorand TestNet Blockchain).

**ABSOLUTE RULE ENFORCED:**
* NO redesigning or rebuilding of the UI.
* NO simulated responses or hardcoded mocks in production paths.
* If a feature cannot be completed immediately during a phase, it is explicitly marked as `NOT IMPLEMENTED`.

---

## Component & Service Mapping Matrix

| UI View / Component | Page / Route | Functionality | Backend API Endpoint | AI / RAG / LoRA Service | Blockchain / x402 Protocol |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MarketplaceGrid** | `/` (Home) | Catalog of Digital Humans, search & filter | `GET /api/v1/marketplace` | N/A | Validates published status |
| **DigitalTwinChat** | Chat Modal/Tab | Real-time chat with Digital Human | `POST /api/v1/ai/chat` | RAG retrieval + LoRA adapter inference | x402 HTTP 402 requirement verification & settlement |
| **HumanIntelligenceAssistant** | Assistant Drawer | Platform AI recommendation & guidance | `POST /api/v1/assistant/chat` | Roadmap & recommendation LLM agent | Metered usage |
| **CreatorOnboardingWizard** | `/creator/new` | Digital Human creation & knowledge upload | `POST /api/v1/digital-humans`<br>`POST /api/v1/knowledge/upload` | Chunker, Embedder, LoRA dataset builder | Algorand Knowledge Hash registration (`ContentHashRegistry`) |
| **CreatorDashboard** | `/creator/dashboard` | Revenue, analytics & adapter status | `GET /api/v1/creator/analytics`<br>`POST /api/v1/creator/withdraw` | Training job monitoring | Algorand Revenue distribution & withdrawal contract |
| **StudentWellnessModal** | Wellness Modal | Study break, stress relief, focus tools | `POST /api/v1/wellness/session` | Wellness LLM agent (Educational only, non-medical) | Free / Metered access |
| **CareerPrepModule** | Career Tab | Mock interview, resume review, roadmap | `POST /api/v1/career/mock-interview`<br>`POST /api/v1/career/resume` | Specialized career RAG & persona | x402 Pay-per-analysis |
| **ConnectWallet** | Header / Navbar | Wallet connection (Pera / Defly) | Algorand SDK Client | N/A | Algorand TestNet Account sign & send transaction |

---

## x402 Payment Protocol Integration Flow

```text
[ Frontend Chat Request ] 
          │
          ▼
[ POST /api/v1/ai/chat ] ── (No Payment Header) ──► Returns 402 Payment Required
          │                                            │
          │ (With Signed Tx / Payment Header)          ▼
          │                                 [ Payment Requirement Payload ]
          ▼                                            │
[ x402 Verifier Middleware ]                           ▼
          │                                 [ User Wallet Signs Algorand Payment ]
          ├── Verifies Tx on Algorand                  │
          ├── Settles MicroUSDC / ALGO                 │
          └── Records Usage & Entitlement              │
          │                                            │
          ▼ ◄──────────────────────────────────────────┘
[ AI RAG + LoRA Pipeline ]
          │
          ▼
[ Response + Citations ]
```

---

## Detailed Data Models Contract

### 1. Chat Query & Response
* **Frontend Payload:**
```json
{
  "digital_twin_id": "dt_marcus_algo",
  "message": "Explain Algorand stateful smart contract storage limits",
  "mode": "teacher",
  "x402_proof": "ALGO_TX_HASH_OR_HEADER"
}
```

* **Backend / AI Service Response:**
```json
{
  "id": "msg_982347293",
  "responseMarkdown": "Algorand stateful smart contracts allow up to 64 key-value pairs of global state and 16 key-value pairs of local state per account opt-in...",
  "citations": [
    {
      "documentId": "doc_algo_docs_v2",
      "documentTitle": "Algorand Developer Documentation v2.pdf",
      "chunkIndex": 42,
      "contentSnippet": "Global state allows an application to store up to 64 key-value pairs of global state...",
      "confidence": 0.96
    }
  ],
  "metering": {
    "usageId": "usg_881923",
    "chargedMicroUsdc": 50000,
    "tokens": 420
  }
}
```

---

## Unimplemented Feature Flags (`NOT IMPLEMENTED`)

In accordance with strict system rules, features that require external live hardware or unconfigured third-party services during bootstrap will return structured error responses:

```json
{
  "error": "NOT IMPLEMENTED",
  "message": "Medical Diagnosis feature is strictly disabled. Only educational medical guidance is provided.",
  "status": 501
}
```
