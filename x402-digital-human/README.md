# Digital Human Marketplace

> **Tagline:** "Every Human's Knowledge Can Earn Forever."

[![x402 Protocol](https://img.shields.io/badge/x402-v2.11.0-blue.svg)](https://x402.org)
[![Network](https://img.shields.io/badge/Network-Algorand%20TestNet-green.svg)](https://algorand.co)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](#)

---

## Executive Summary

The **Digital Human Marketplace** is an enterprise-grade AI knowledge platform integrated with the **Algorand x402 payment protocol** and smart contract licensing. Domain experts, creators, professors, and mentors synthesize their verified expertise into interactive **AI Digital Twins**. Learners, students, and professionals interact with these Digital Twins across 8 specialized modes (Teacher, Mentor, Interviewer, Coach, Practice, Reviewer, Study, Voice AI).

Every query, session, or subscription triggers automated micro-settlements on Algorand via HTTP status 402 payment authorization headers, providing creators with transparent 85% net revenue streams.

---

## Monorepo Architecture Overview

```text
x402-digital-human/
├── apps/
│   └── web/                # Next.js 14 Web App (Marketplace, Chat, Dashboards)
├── services/
│   ├── api/                # Express API Gateway (Auth, Users, Twins, x402, Admin)
│   └── ai/                 # Python FastAPI Microservice (Hybrid RAG, Grounding, Citations)
├── packages/
│   ├── database/           # PostgreSQL Prisma ORM Schema (28 Core Tables)
│   ├── security/           # JWT, Bcrypt, Algorand Ed25519 Auth & RBAC
│   └── types/              # Domain Models, Enums & TypeScript DTOs
├── contracts/              # Algorand Smart Contracts (ContentHashRegistry, DigitalTwinRegistry)
├── docs/                   # Full System PRD, SRS, User Stories & Requirements Matrix
└── tests/                  # Unit, Integration & Step 64 End-to-End Test Suite
```

---

## System Requirements & Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Glassmorphic UI System
- **Backend API**: Node.js, Express, TypeScript, Helmet, Rate Limiting
- **AI & RAG Engine**: Python 3.11+, FastAPI, Qdrant Vector Search, LLM Abstraction, Grounded Citation Engine
- **Database**: PostgreSQL (28 relational tables), Prisma ORM
- **Blockchain & Payments**: Algorand TestNet, x402 Protocol v2.11+, Algod / Indexer Node APIs
- **Smart Contracts**: ContentHashRegistry, DigitalTwinRegistry

---

## Quick Start Guide

### 1. Environment Configuration
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```

### 2. Monorepo Installation & Build
```bash
npm install
npm run build
```

### 3. Running Automated Test Suites
Execute unit, security, RAG grounding, and Step 64 E2E test scenarios:
```bash
npm run test
```

---

## Key Features & Security Disclaimers

1. **Mandatory AI Disclosure**: Every Digital Twin interaction starts with explicit disclosure:
   > *"You are interacting with an AI Digital Twin created from the expert's authorized knowledge."*
2. **Strict Citation Grounding**: Zero-hallucination policy for expert facts. Ungrounded responses fall back to:
   > *"I couldn't find sufficient information in this Digital Human's verified knowledge base."*
3. **Medical & Financial Boundaries**: Educational wellness guidance explicitly states it does not replace professional medical diagnosis/treatment or guarantee financial returns.
