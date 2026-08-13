# API SPECIFICATION & ROUTE REGISTRY

## Authentication Routes
```text
POST /api/v1/auth/register       - Body: { email, password, role }
POST /api/v1/auth/login          - Body: { email, password }
POST /api/v1/auth/refresh        - Body: { refreshToken }
POST /api/v1/auth/logout         - Authorization: Bearer <token>
GET  /api/v1/auth/me             - Authorization: Bearer <token>
```

## Expert Onboarding Routes
```text
POST /api/v1/experts              - Register expert profile
GET  /api/v1/experts/me           - Fetch current expert profile
PUT  /api/v1/experts/me           - Update expert profile
POST /api/v1/experts/verification - Submit verification credentials
GET  /api/v1/experts/verification - Get verification status
```

## Digital Human Management Routes
```text
POST /api/v1/digital-humans              - Create new Digital Human profile
GET  /api/v1/digital-humans              - List published Digital Humans
GET  /api/v1/digital-humans/:id          - Retrieve specific Digital Human
PUT  /api/v1/digital-humans/:id          - Update configuration / metadata
POST /api/v1/digital-humans/:id/publish  - Set status to PUBLISHED
POST /api/v1/digital-humans/:id/unpublish- Set status to DRAFT
```

## Knowledge Management & Document Ingestion
```text
POST /api/v1/knowledge/upload            - Multipart upload (PDF, DOCX, PPTX, TXT)
GET  /api/v1/knowledge/documents/:id     - Get document status & chunking breakdown
POST /api/v1/knowledge/reindex           - Re-trigger embedding generation & pgvector sync
```

## AI Inference & RAG Chat Routes
```text
POST /api/v1/ai/chat                     - Standard chat endpoint
POST /api/v1/digital-humans/:id/chat     - Specific Digital Human chat with x402 header
POST /api/v1/assistant/chat              - Platform recommendation & roadmap assistant
```

## Student & Career Module Routes
```text
POST /api/v1/student/roadmap             - Generate learning roadmap
POST /api/v1/student/quiz                - Generate practice quiz from knowledge base
POST /api/v1/student/flashcards          - Generate interactive flashcards
GET  /api/v1/student/progress            - Fetch student learning metrics

POST /api/v1/career/resume               - Upload & evaluate ATS resume compatibility
POST /api/v1/career/mock-interview       - Conduct interactive technical/HR interview
POST /api/v1/career/skill-gap            - Calculate skill gaps for target job role
```

## Marketplace & Monetization Routes
```text
GET  /api/v1/marketplace                 - Browse & filter Digital Human catalog
GET  /api/v1/marketplace/search          - Vector & text search marketplace
GET  /api/v1/marketplace/categories      - List expertise categories
GET  /api/v1/creator/analytics           - Fetch creator revenue & usage metrics
POST /api/v1/creator/withdraw            - Trigger royalty payout on Algorand
```
