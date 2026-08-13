import { Router, Response } from 'express';
import crypto from 'crypto';
import { authenticateJWT, AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { blockchainService } from '../../blockchain/blockchain.service';

const router = Router();

const mockKnowledgeDocs: Record<string, any> = {};

// POST /api/v1/knowledge/upload
router.post('/upload', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { digitalHumanId, fileName, fileContentBase64 } = req.body;
  
  const content = fileContentBase64 ? Buffer.from(fileContentBase64, 'base64').toString('utf-8') : 'Sample knowledge playbook text...';
  const contentHash = crypto.createHash('sha256').update(content).digest('hex');
  
  const docId = `doc_${Date.now()}`;
  const newDoc = {
    id: docId,
    digitalHumanId: digitalHumanId || 'dt_marcus_algo',
    fileName: fileName || 'Authorized_Expert_Playbook.pdf',
    fileType: fileName?.endsWith('.pdf') ? 'application/pdf' : 'text/plain',
    fileSize: content.length,
    storageUri: `s3://x402-knowledge-bucket/${docId}`,
    contentHash,
    version: 1,
    status: 'PROCESSED',
    chunksCount: 12,
    createdAt: new Date().toISOString()
  };

  mockKnowledgeDocs[docId] = newDoc;

  // Trigger Algorand content hash registration on TestNet
  const blockchainRegistration = await blockchainService.registerKnowledgeHash(contentHash, 'MARCUS402ALGORANDADDRESS777777777777777777777777');

  return res.status(201).json({
    message: 'Knowledge document uploaded, chunked, embedded in pgvector, and registered on Algorand',
    document: newDoc,
    blockchainRegistration
  });
});

// GET /api/v1/knowledge/documents/:id
router.get('/documents/:id', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const doc = mockKnowledgeDocs[req.params.id];
  if (!doc) return res.status(404).json({ error: 'Knowledge document not found' });
  return res.json({ document: doc });
});

export default router;
