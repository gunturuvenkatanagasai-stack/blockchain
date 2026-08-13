import { Router, Request, Response } from 'express';
import { DigitalTwinMode } from '@x402-digital-human/types';

export const chatRouter = Router();

// Mandatory AI Disclosure per Step 15 & Step 43
const AI_DISCLOSURE_PREFIX = "⚠️ Disclaimer: You are interacting with an AI Digital Twin created from the expert's authorized knowledge.\n\n";

const REFUSAL_FALLBACK = "I couldn't find sufficient information in this Digital Human's verified knowledge base to accurately answer your question.";

// POST /api/v1/chat/query (RAG Chat Generation)
chatRouter.post('/query', (req: Request, res: Response) => {
  const { digitalTwinId, mode, query, conversationId } = req.body;

  if (!digitalTwinId || !query) {
    return res.status(400).json({ error: 'digitalTwinId and query are required' });
  }

  const activeMode = mode || DigitalTwinMode.TEACHER;
  const convId = conversationId || `conv_${Date.now()}`;

  // Grounded knowledge domain mock responses based on twin ID & mode
  let responseContent = "";
  let citations = [];

  if (digitalTwinId === 'dt_quantum_elena') {
    responseContent = `${AI_DISCLOSURE_PREFIX}Quantum superposition enables a qubit to exist simultaneously in linear combinations of $|0\\rangle$ and $|1\\rangle$. In quantum algorithms like Grover's Search or Shor's Algorithm, quantum phase estimation leverages unitary transformations $U|u\\rangle = e^{2\\pi i \\varphi}|u\\rangle$ to achieve exponential or quadratic speedups over classical algorithms.`;
    citations = [
      {
        documentId: 'doc_quantum_101',
        documentTitle: 'Principles of Quantum Information Theory (Dr. Elena Rostova)',
        chunkId: 'chunk_88',
        chunkIndex: 88,
        contentSnippet: 'Superposition principle: |ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1.',
        relevanceScore: 0.96
      }
    ];
  } else if (digitalTwinId === 'dt_marcus_algo') {
    responseContent = `${AI_DISCLOSURE_PREFIX}The x402 payment protocol on Algorand leverages HTTP status code 402 (Payment Required). When an API endpoint requires payment, the server responds with a 402 status and an WWW-Authenticate header specifying the payment requirements (e.g. price in microUSDC, receiver address, asset ID). Once the client sends an Algorand transaction proof in the \`X-402-Payment-Authorization\` header, the server verifies the transaction on-chain via the Algorand Indexer/Algod node and fulfills the API response.`;
    citations = [
      {
        documentId: 'doc_algo_x402_spec',
        documentTitle: 'Algorand x402 Protocol Architecture Specification v2.11',
        chunkId: 'chunk_12',
        chunkIndex: 12,
        contentSnippet: 'x402 workflow: 402 Payment Required -> Signed Tx Proof Header -> On-chain verification -> Resource settlement.',
        relevanceScore: 0.98
      }
    ];
  } else {
    // Unverified topic fallback per Step 14
    responseContent = `${AI_DISCLOSURE_PREFIX}${REFUSAL_FALLBACK}`;
  }

  return res.json({
    conversationId: convId,
    messageId: `msg_${Date.now()}`,
    digitalTwinId,
    mode: activeMode,
    responseMarkdown: responseContent,
    citations,
    disclaimer: "This response was produced using RAG from verified creator documents.",
    tokensUsed: 240,
    metering: {
      chargedMicroUsdc: 50000,
      creatorEarnedMicroUsdc: 42500, // 85% creator split
      platformFeeMicroUsdc: 7500      // 15% platform split
    }
  });
});
