# REAL RAG (RETRIEVAL-AUGMENTED GENERATION) PIPELINE

## Architecture & Data Flow

```text
USER QUESTION
     │
     ▼
[ 1. Query Validation & Intent Classifier ]
     │
     ▼
[ 2. Embedding Generation (all-MiniLM-L6-v2 / OpenAI) ]
     │
     ▼
[ 3. Cosine Similarity Vector Search in pgvector ]
     │
     ▼
[ 4. Top-K Chunks Retrieval (K = 5 to 10) ]
     │
     ▼
[ 5. Cross-Encoder Reranking ]
     │
     ▼
[ 6. Filter Relevant Knowledge & Citations ]
     │
     ▼
[ 7. Dynamic Prompt Construction with Persona System Prompt ]
     │
     ▼
[ 8. LLM Generation (Base LLM + LoRA Adapter) ]
     │
     ▼
[ 9. Citation & Groundedness Verification ]
     │
     ▼
[ 10. Output Guardrails & Safety Filter ]
     │
     ▼
FINAL RESPONSE WITH CITATIONS
```

---

## Strict Groundedness Rule

If the similarity score of the top retrieved chunks falls below the threshold ($\text{threshold} < 0.65$), the system **MUST NOT** hallucinate an answer. It returns:

> *"I don't have enough verified information in this Digital Human's knowledge base to answer that reliably."*

---

## Document Chunking Metadata Specification

Each stored chunk in PostgreSQL contains:
- `documentId`: UUID of source document.
- `digitalHumanId`: UUID of Digital Human owner.
- `knowledgeVersion`: Version index.
- `chunkIndex`: Monotonically increasing chunk order.
- `page`: Page number in original PDF/document.
- `section`: Header or section title.
- `source`: Filename or URL.
- `contentHash`: SHA-256 hash of content chunk.
- `embedding`: 1536-dim (or 384-dim) vector representation.
