from typing import List, Dict, Any

class RAGRetriever:
    def __init__(self):
        # Simulated knowledge base for verified Digital Humans
        self.knowledge_base = {
            "dt_marcus_algo": [
                {
                    "documentId": "doc_algo_docs_v2",
                    "documentTitle": "Algorand Developer Documentation v2.pdf",
                    "chunkIndex": 42,
                    "contentSnippet": "Algorand stateful smart contracts permit global state storage up to 64 key-value pairs per contract and 16 key-value pairs for local account state.",
                    "confidence": 0.98
                },
                {
                    "documentId": "doc_x402_spec",
                    "documentTitle": "x402 Payment Protocol Architecture.pdf",
                    "chunkIndex": 12,
                    "contentSnippet": "x402 relies on standard HTTP 402 status codes. When an un-paywalled endpoint is called without payment, the server returns 402 with nonce and payment requirements.",
                    "confidence": 0.95
                }
            ],
            "twin_1": [
                {
                    "documentId": "doc_dist_sys_101",
                    "documentTitle": "Distributed Database Consensus & Raft Architecture.pdf",
                    "chunkIndex": 7,
                    "contentSnippet": "Raft achieves consensus via leader election, log replication, and safety invariants across distributed cluster nodes.",
                    "confidence": 0.97
                }
            ]
        }

    def retrieve_top_k(self, digital_human_id: str, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        chunks = self.knowledge_base.get(digital_human_id, self.knowledge_base["dt_marcus_algo"])
        return chunks[:top_k]
