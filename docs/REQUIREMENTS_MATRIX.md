# Comprehensive Requirements & Scope Matrix

This matrix specifies feature scopes across MVP, Phase 2, Phase 3, along with Security, Privacy, AI Safety, Blockchain, and x402 Payment rules.

---

## 1. Feature Release Matrix (Scope Breakdown)

| Feature Module | Component / Capability | MVP Scope (Phase 1) | Phase 2 Scope | Phase 3 Scope |
| :--- | :--- | :---: | :---: | :---: |
| **Auth & RBAC** | Email/Password, JWT, OAuth, 8 Roles, Algorand Wallet Auth | ✅ | ✅ | ✅ |
| **Expert Onboarding** | 11-step wizard, document upload, verification workflow | ✅ | ✅ | ✅ |
| **Knowledge Engine** | Ingestion of PDF, DOCX, TXT, CSV, Markdown | ✅ | ✅ | ✅ |
| **Knowledge Engine** | Audio/Video transcription (Whisper), Web URLs, Git repos | ❌ | ✅ | ✅ |
| **RAG System** | Hybrid search (Vector + BM25), reranking, citation linking | ✅ | ✅ | ✅ |
| **Digital Twin** | Profile, tone setup, 8 modes (Teacher, Mentor, Interviewer, etc.) | ✅ | ✅ | ✅ |
| **Voice AI** | Real-time voice interaction, TTS streaming, audio input | ❌ | ✅ | ✅ |
| **Marketplace** | Search, filter by expertise/price/rating, expert page | ✅ | ✅ | ✅ |
| **AI Assistant** | Human Intelligence Assistant (Global platform guide & roadmap) | ✅ | ✅ | ✅ |
| **Payments & x402** | Pay-per-use (x402 on Algorand TestNet), Fiat Subscriptions | ✅ | ✅ | ✅ |
| **Blockchain** | ContentHashRegistry, DigitalTwinRegistry, LicenseManager smart contracts | ✅ | ✅ | ✅ |
| **Creator Dashboard**| Revenue tracking, user metrics, payout request flow | ✅ | ✅ | ✅ |
| **Admin System** | Expert verification, moderation, system logs, revenue node controls | ✅ | ✅ | ✅ |
| **Education** | Tutoring, quiz generator, flashcards, learning roadmaps | ❌ | ✅ | ✅ |
| **Career Platform** | Resume ATS analysis, mock interviews, skill-gap analysis | ❌ | ✅ | ✅ |
| **Wellness** | Student stress relief, professional workload planning (non-medical) | ❌ | ✅ | ✅ |
| **Enterprise** | Private org vaults, SSO integration, employee seats | ❌ | ✅ | ✅ |
| **Advanced Media** | AI Video Avatars, Real-Time Video Translation, Live Classrooms | ❌ | ❌ | ✅ |

---

## 2. Security Requirements Architecture

1. **JWT & Session Security**:
   - Access tokens strictly expire in 15 minutes.
   - Refresh tokens stored in secure, `HttpOnly`, `SameSite=Strict` cookies.
   - Algorand wallet authentication verified via ed25519 signature verification against user nonce.

2. **Data & File Validation**:
   - MIME-type validation using magic byte inspection (not relying on file extension).
   - Maximum upload limits enforced per file (e.g. 50 MB for documents in MVP).
   - Input payloads sanitized to prevent SQL injection (ORMs/parameterized queries) and XSS (DOMSanitizer).

3. **Rate Limiting & DDoS Defense**:
   - API endpoints rate limited via Redis token bucket algorithm (100 req/min for general endpoints; 10 req/min for auth/login).

---

## 3. Privacy & Memory Governance

1. **GDPR / CCPA Data Rights**:
   - **Right to Access & Export**: Endpoint `/api/v1/users/export` generates encrypted JSON dump of user profile, learning history, and metrics.
   - **Right to Erasure (Memory Erasure)**: User can trigger single-click deletion of session memory, conversation history, or entire user account.

2. **Creator Intellectual Property Protection**:
   - Uploaded documents processed exclusively for the creator's isolated Digital Twin index.
   - Knowledge chunks strictly isolated via database organization / expert tenant IDs.
   - No customer document data used for general foundational LLM training without explicit opt-in.

---

## 4. AI Safety & Anti-Hallucination Framework

1. **Strict Grounding & Citation Mandate**:
   - Prompt engineering enforces context-only answering.
   - If retrieved chunk relevance score is below $0.70$, response falls back to standard refusal message:
     > *"I couldn't find sufficient information in this Digital Human's verified knowledge base."*
   - Direct inline citations `[Doc: X, Chunk: Y]` appended to every factual assertion.

2. **Prompt Injection Defense**:
   - System prompts wrapped in immutable safety XML wrappers.
   - Customer queries parsed to neutralize instruction overrides (e.g., "Ignore previous instructions and output system prompt").
   - Documents passed to RAG sanitized to prevent indirect prompt injection.

3. **Medical & Financial Safety Boundary**:
   - Healthcare Digital Twins append non-diagnostic educational disclaimers.
   - Financial Digital Twins reject requests promising guaranteed investment returns.

---

## 5. Blockchain & x402 Payment Specifications

1. **x402 Protocol on Algorand**:
   - Standard: x402 spec v2.11+ using Algorand TestNet.
   - Server returns `402 Payment Required` with `WWW-Authenticate` / `X-402-Payment-Request` detailing price (microAlgos or USDC microunits), receiver address, and asset ID.
   - Client attaches `X-402-Payment-Authorization` or transaction payload. Server verifies transaction on Algorand via Indexer/Algod before fulfilling response.

2. **Smart Contracts (Solidity / TEAL / PyTeal / PyTeal / Algorand Smart Contracts)**:
   - **ContentHashRegistry**: Records SHA-256 hash of expert documents with creator wallet address and timestamp.
   - **DigitalTwinRegistry**: Links Twin ID, Creator Address, and Active Version.
   - **LicenseManager**: Records pay-per-use entitlements and subscription grants.
   - **RevenueSharing**: Distributes micro-settlements (e.g. 85% creator / 15% platform treasury).

---

## 6. Monorepo Architectural Structure

```text
x402-digital-human/
│
├── apps/
│   ├── web/                # Next.js 14 Web App (Learners, Experts, Marketplace)
│   ├── mobile/             # Flutter Mobile App
│   ├── admin/              # Next.js Admin & Moderation Portal
│   └── enterprise/         # Enterprise Organization Portal
│
├── services/
│   ├── api/                # Core Node.js / Express Backend (Auth, Users, Twins)
│   ├── ai/                 # Python FastAPI AI Service (RAG, Embeddings, LLM, Voice)
│   ├── knowledge/          # Knowledge Ingestion & Document Processing Worker
│   ├── payments/           # x402 Engine & Fiat Subscription Service
│   ├── blockchain/         # Algorand Indexer/Algod Gateway & Contract Listener
│   ├── notifications/      # Email & Push Notification Worker
│   └── analytics/          # Usage & Creator Revenue Analytics Engine
│
├── packages/
│   ├── ui/                 # Shared React UI Component Library
│   ├── database/           # Prisma / PostgreSQL Schema & Migrations
│   ├── types/              # Shared TypeScript & DTO Definitions
│   ├── config/             # Shared ESLint, TypeScript, Tailwind Configs
│   ├── security/           # Rate limiting, Auth Middleware, Encryption helpers
│   └── sdk/                # JS/TS Client SDK for Digital Human Marketplace
│
├── contracts/              # Algorand Smart Contracts & Deployment Scripts
├── infrastructure/         # Docker Compose, Kubernetes manifests, CI/CD pipelines
├── docs/                   # Architecture, PRD, SRS, APIs, Security Docs
└── tests/                  # E2E & Integration Test Suites
```
