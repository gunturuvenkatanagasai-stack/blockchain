import hashlib
from typing import List, Dict, Any

class DocumentChunker:
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_text(self, text: str, source_title: str) -> List[Dict[str, Any]]:
        words = text.split()
        chunks = []
        chunk_index = 0

        i = 0
        while i < len(words):
            chunk_words = words[i : i + self.chunk_size]
            chunk_text = " ".join(chunk_words)
            content_hash = hashlib.sha256(chunk_text.encode('utf-8')).hexdigest()

            chunks.append({
                "chunk_index": chunk_index,
                "content": chunk_text,
                "source": source_title,
                "content_hash": content_hash,
                "word_count": len(chunk_words)
            })

            chunk_index += 1
            i += (self.chunk_size - self.chunk_overlap)

        return chunks
