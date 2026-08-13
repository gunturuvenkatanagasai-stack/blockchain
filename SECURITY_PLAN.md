# SECURITY PLAN & THREAT MODELING

## 1. Application & Auth Security
- **JWT + Refresh Token:** Short-lived JWTs (15 min) with httpOnly refresh cookies.
- **Password Hashing:** Argon2id or bcrypt (salt rounds = 12).
- **Role-Based Access Control (RBAC):** Strict policy enforcement for `STUDENT`, `USER`, `EXPERT`, `HEALTHCARE_EXPERT`, `ADMIN`, `ENTERPRISE`.
- **Input Validation:** Zod schema validation on all Fastify / Express request bodies and query parameters.
- **Rate Limiting:** Redis-backed rate limiter on chat and auth routes (max 60 req/min per IP/user).

---

## 2. AI & Prompt Security
- **Prompt Injection Defense:** Input sanitizer stripping prompt override tokens (`Ignore previous instructions`, `System:`, `Developer Mode`).
- **System Prompt Protection:** System prompts isolated from user parameters.
- **RAG & Memory Isolation:** Strict SQL/vector filtering by `userId` and `digitalHumanId` to prevent cross-tenant memory leakage.
- **Medical / Healthcare Guardrails:** Enforces mandatory disclaimer rule (`EDUCATION != DIAGNOSIS != TREATMENT`). AI explicitly refuses diagnostic or prescription queries.

---

## 3. Blockchain & Payment Security
- **x402 Double-Spend Prevention:** Replay protection storing used transaction hashes/nonces in Redis with TTL.
- **Backend Verification:** Backend independently queries the Algorand Indexer; frontend tx claims are never trusted blindly.
- **Key Safety:** Zero private keys stored in frontend code or user sessions.
