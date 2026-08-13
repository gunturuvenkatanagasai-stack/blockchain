# Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose
This document provides the formal software requirements specification for the **Digital Human Marketplace**, an enterprise-grade AI knowledge platform with Algorand x402 payment integration.

### 1.2 Scope
The scope encompasses all client applications (Web Next.js, Mobile Flutter, Admin Dashboard, Enterprise Dashboard), modular services (API Gateway, Core Backend, AI/RAG Engine, Payment Engine, Blockchain Engine), vector storage, PostgreSQL database, and Algorand smart contracts.

---

## 2. Functional Requirements (FR)

### 2.1 User Authentication & Account Management
- **FR-01**: The system MUST allow registration with email/password, OAuth (Google/GitHub), and Algorand wallet signatures.
- **FR-02**: Passwords MUST be hashed using bcrypt (cost factor >= 12) or Argon2id. Plaintext passwords MUST NEVER be logged or stored.
- **FR-03**: The system MUST issue short-lived JWT access tokens (15 min) and HTTP-only refresh tokens (7 days).
- **FR-04**: Role-Based Access Control (RBAC) MUST enforce granular access per endpoint based on user roles (`LEARNER`, `PROFESSIONAL`, `EXPERT`, `HEALTHCARE_EDUCATOR`, `CAREER_MENTOR`, `BUSINESS_MENTOR`, `ENTERPRISE_ADMIN`, `PLATFORM_ADMIN`).

### 2.2 Expert Onboarding & Verification
- **FR-05**: The system MUST provide an 11-step onboarding wizard for experts (Identity, Bio, Expertise, Experience, Languages, Rights, Consent, Knowledge Upload, Twin Config, Testing, Pricing).
- **FR-06**: Verification status MUST be tracked (`UNVERIFIED`, `PENDING_REVIEW`, `VERIFIED`, `REJECTED`, `SUSPENDED`).
- **FR-07**: Unverified experts MUST NOT be marked as verified or highlighted in marketplace listings.

### 2.3 Knowledge Processing & Ingestion
- **FR-08**: The system MUST process PDF, DOCX, PPTX, TXT, CSV, XLSX, Images (OCR), Audio/Video (Whisper transcription), URLs, and Git repositories.
- **FR-09**: Uploaded documents MUST undergo MIME-type verification, malware scanning, chunking, and vector embedding.
- **FR-10**: Document processing status MUST transition through: `UPLOADED` -> `PROCESSING` -> `INDEXING` -> `READY` (or `FAILED`).

### 2.4 Retrieval-Augmented Generation (RAG) & AI Engine
- **FR-11**: The AI engine MUST execute hybrid retrieval (dense vector similarity + sparse BM25 keyword matching) and cross-encoder reranking.
- **FR-12**: All Digital Twin factual assertions MUST include verifiable citation metadata (Document ID, Chunk ID, Page/Line reference).
- **FR-13**: If retrieved context is below the confidence threshold, the AI MUST respond: *"I couldn't find sufficient information in this Digital Human's verified knowledge base."*
- **FR-14**: System prompts MUST include explicit mandatory disclaimers: *"You are interacting with an AI Digital Twin created from the expert's authorized knowledge."*

### 2.5 Digital Twin Modes & Voice AI
- **FR-15**: Digital Twins MUST support 8 interaction modes: Teacher, Mentor, Interviewer, Coach, Practice, Reviewer, Study, Voice AI.
- **FR-16**: Voice AI MUST support real-time speech-to-text (STT), low-latency RAG response generation, and text-to-speech (TTS) streaming.

### 2.6 Payments, Metering & x402 Integration
- **FR-17**: The payment engine MUST process x402 HTTP header payments (`X-402-Payment-Authorization`, `X-402-Payment-Proof`) on Algorand TestNet/MainNet.
- **FR-18**: Pay-per-use requests (per question, per session, per minute, per premium analysis) MUST be authorized, metered, and ledger-recorded.
- **FR-19**: Subscriptions (Weekly, Monthly, Annual, Enterprise) MUST be tracked with fair-use limits and auto-renewal capabilities.
- **FR-20**: Platform revenue splits (e.g., 85% Creator / 15% Platform) MUST be automatically calculated, off-chain ledger recorded, and synchronized with on-chain payout events.

### 2.7 Platform AI Assistant (Human Intelligence Assistant)
- **FR-21**: The global platform assistant MUST provide expert recommendations, learning roadmaps, subscription guidance, conversation summaries, and Digital Twin onboarding assistance.

### 2.8 Specialized Modules
- **FR-22**: **Education Module**: Tutoring, quiz generation, flashcards, assignments, progress roadmaps, and certificates.
- **FR-23**: **Career Platform**: Resume upload, ATS-style scoring, portfolio review, mock technical/HR interviews, and skill-gap analysis.
- **FR-24**: **Wellness Modules (Student & Professional)**: Study break planning, relaxation/mindfulness routines, workload coaching (with explicit non-medical healthcare disclaimers).
- **FR-25**: **Medical Education**: Verified healthcare educator area strictly enforcing Education != Diagnosis != Treatment boundaries.
- **FR-26**: **Business & Financial Education**: Startup ideas, pitch deck review, fundraising education, budgeting, tax/investing fundamentals (no guaranteed financial returns).

---

## 3. Non-Functional Requirements (NFR)

### 3.1 Performance & Latency
- **NFR-01**: API Gateway response time MUST be < 100ms for non-AI REST calls.
- **NFR-02**: RAG vector retrieval & reranking time MUST be < 350ms.
- **NFR-03**: Time-to-First-Token (TTFT) for AI chat streaming MUST be < 800ms.
- **NFR-04**: Voice AI end-to-end audio round-trip latency MUST be < 1.5s.

### 3.2 Security & Compliance
- **NFR-05**: All network communications MUST enforce TLS 1.3 encryption.
- **NFR-06**: Input payloads MUST be sanitized against SQL injection, XSS, and indirect prompt injection attacks.
- **NFR-07**: Rate limiting MUST enforce max 100 requests/minute per IP / user token to prevent denial of service.
- **NFR-08**: Security audit logs MUST capture all authentication attempts, expert approvals, pricing edits, and funds transfers.

### 3.3 Reliability & Scalability
- **NFR-09**: System availability target is 99.9% uptime.
- **NFR-10**: Modular monolith architecture MUST allow independent vertical or horizontal scaling of AI, Payment, and API nodes.
- **NFR-11**: PostgreSQL databases MUST have point-in-time automated backups enabled.

### 3.4 Data Privacy & AI Safety
- **NFR-12**: Users MUST have explicit controls to export conversation logs, delete personal session memory, or permanently erase their account (GDPR compliance).
- **NFR-13**: Creator knowledge bases MUST NOT be used to train general foundation models without explicit written opt-in consent.
