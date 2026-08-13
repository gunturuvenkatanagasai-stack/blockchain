"""
FastAPI Microservice for AI Engine & RAG Grounding
"""

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from rag_engine import RAGEngine

app = FastAPI(
    title="Digital Human Marketplace - AI & RAG Microservice",
    version="1.0.0",
    description="Python FastAPI service delivering hybrid vector retrieval, RAG grounding, citation generation, and voice transcription adapters."
)

rag_service = RAGEngine()

class RAGQueryRequest(BaseModel):
    digital_twin_id: str
    query: str
    mode: Optional[str] = "TEACHER"

class RAGQueryResponse(BaseModel):
    digital_twin_id: str
    mode: str
    response_markdown: str
    citations: List[Dict[str, Any]]
    grounded: bool
    refusal_triggered: bool

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "AI & RAG FastAPI Service",
        "version": "1.0.0"
    }

@app.post("/api/v1/ai/rag/query", response_model=RAGQueryResponse)
def handle_rag_query(request: RAGQueryRequest):
    if not request.digital_twin_id or not request.query:
        raise HTTPException(status_code=400, detail="digital_twin_id and query are required")
        
    result = rag_service.execute_rag_pipeline(
        digital_twin_id=request.digital_twin_id,
        query=request.query,
        mode=request.mode
    )
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
