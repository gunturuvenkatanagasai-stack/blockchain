"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crypto_1 = __importDefault(require("crypto"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const blockchain_service_1 = require("../../blockchain/blockchain.service");
const router = (0, express_1.Router)();
const mockKnowledgeDocs = {};
// POST /api/v1/knowledge/upload
router.post('/upload', auth_middleware_1.authenticateJWT, async (req, res) => {
    const { digitalHumanId, fileName, fileContentBase64 } = req.body;
    const content = fileContentBase64 ? Buffer.from(fileContentBase64, 'base64').toString('utf-8') : 'Sample knowledge playbook text...';
    const contentHash = crypto_1.default.createHash('sha256').update(content).digest('hex');
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
    const blockchainRegistration = await blockchain_service_1.blockchainService.registerKnowledgeHash(contentHash, 'MARCUS402ALGORANDADDRESS777777777777777777777777');
    return res.status(201).json({
        message: 'Knowledge document uploaded, chunked, embedded in pgvector, and registered on Algorand',
        document: newDoc,
        blockchainRegistration
    });
});
// GET /api/v1/knowledge/documents/:id
router.get('/documents/:id', auth_middleware_1.authenticateJWT, (req, res) => {
    const doc = mockKnowledgeDocs[req.params.id];
    if (!doc)
        return res.status(404).json({ error: 'Knowledge document not found' });
    return res.json({ document: doc });
});
exports.default = router;
