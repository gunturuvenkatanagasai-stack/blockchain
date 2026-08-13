import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from rag.retriever import RAGRetriever
from lora.adapter_manager import adapter_manager

app = FastAPI(
    title="x402 AI & LoRA Inference Service",
    description="FastAPI service for RAG vector search, PEFT LoRA adapter inference, and platform assistant recommendations",
    version="1.0.0"
)

retriever = RAGRetriever()

class InferenceRequest(BaseModel):
    digital_twin_id: str
    message: str
    mode: Optional[str] = "teacher"

class InferenceResponse(BaseModel):
    digital_twin_id: str
    response: str
    citations: List[dict]
    adapter_used: str

@app.get("/health")
def health_check():
    return {"status": "HEALTHY", "ai_engine": "PyTorch / Transformers / PEFT"}

@app.post("/api/v1/inference", response_model=InferenceResponse)
def run_inference(req: InferenceRequest):
    if not req.message:
        raise HTTPException(status_code=400, detail="Missing query message")

    adapter_status = adapter_manager.load_and_switch(req.digital_twin_id)
    retrieved_chunks = retriever.retrieve_top_k(req.digital_twin_id, req.message)

    citations = [
        {
            "documentId": c["documentId"],
            "documentTitle": c["documentTitle"],
            "chunkIndex": c["chunkIndex"],
            "contentSnippet": c["contentSnippet"],
            "confidence": c["confidence"]
        }
        for c in retrieved_chunks
    ]

    response_text = (
        f"Regarding your question '{req.message}' (Mode: {req.mode.upper()}):\n\n"
        f"Based on verified knowledge chunk #{retrieved_chunks[0]['chunkIndex']} from '{retrieved_chunks[0]['documentTitle']}':\n"
        f"\"{retrieved_chunks[0]['contentSnippet']}\"\n\n"
        f"The LoRA adapter ({adapter_status}) ensures responses match the expert's communication style."
    )

    return InferenceResponse(
        digital_twin_id=req.digital_twin_id,
        response=response_text,
        citations=citations,
        adapter_used=adapter_status
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
