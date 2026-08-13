# BACKEND ARCHITECTURE & SERVICE DESIGN

## Directory Structure
The backend services will be organized in clean micro-services / modular monorepo directories:

```text
backend/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── experts.routes.ts
│   │   │   ├── digital-humans.routes.ts
│   │   │   ├── knowledge.routes.ts
│   │   │   ├── ai.routes.ts
│   │   │   ├── marketplace.routes.ts
│   │   │   ├── payments.routes.ts
│   │   │   ├── subscriptions.routes.ts
│   │   │   ├── creator.routes.ts
│   │   │   ├── student.routes.ts
│   │   │   ├── career.routes.ts
│   │   │   ├── wellness.routes.ts
│   │   │   └── admin.routes.ts
│   │   └── middlewares/
│   │       ├── auth.middleware.ts
│   │       ├── rbac.middleware.ts
│   │       ├── rate-limit.middleware.ts
│   │       └── error.middleware.ts
│   ├── x402/
│   │   ├── x402.config.ts
│   │   ├── x402.middleware.ts
│   │   ├── x402.service.ts
│   │   ├── x402.types.ts
│   │   └── x402.verifier.ts
│   ├── blockchain/
│   │   ├── algorand.client.ts
│   │   ├── contracts.ts
│   │   ├── transactions.ts
│   │   ├── events.ts
│   │   ├── indexer.ts
│   │   └── blockchain.service.ts
│   ├── services/
│   │   ├── rag.service.ts
│   │   ├── lora.service.ts
│   │   ├── metering.service.ts
│   │   ├── revenue.service.ts
│   │   └── storage.service.ts
│   ├── config/
│   └── index.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── package.json
└── tsconfig.json

ai-service/
├── main.py
├── config.py
├── rag/
│   ├── chunker.py
│   ├── embedder.py
│   └── retriever.py
├── lora/
│   ├── dataset_builder.py
│   ├── train_lora.py
│   ├── evaluate_lora.py
│   └── adapter_manager.py
├── inference/
│   └── pipeline.py
└── requirements.txt
```

---

## Tech Stack Requirements

1. **API Server (`backend/`):**
   - Node.js + TypeScript
   - Fastify or Express
   - Prisma ORM
   - PostgreSQL (with `pgvector` extension)
   - Redis (Session cache, rate limiting, job queues via BullMQ)

2. **AI & Fine-Tuning Server (`ai-service/`):**
   - Python 3.10+
   - FastAPI
   - PyTorch + HuggingFace Transformers
   - PEFT (Parameter-Efficient Fine-Tuning for LoRA)
   - SentenceTransformers (Embedding generation)
   - PyMuPDF, python-docx, python-pptx (Document extraction)

3. **Blockchain Layer:**
   - Algorand Python SDK & `algosdk` (TypeScript)
   - AlgoKit (Dev environment and smart contract deployment)
   - Algorand Indexer API & TestNet RPC endpoints
