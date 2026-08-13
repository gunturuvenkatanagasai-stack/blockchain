import { Router, Request, Response } from 'express';
import { VerificationStatus } from '@x402-digital-human/types';

export const expertsRouter = Router();

const mockExperts = [
  {
    id: 'exp_1',
    name: 'Dr. Elena Rostova',
    title: 'Senior Quantum Computing & AI Researcher',
    organization: 'Institute for Advanced Studies',
    experienceYears: 14,
    verificationStatus: VerificationStatus.VERIFIED,
    verificationBadgeUrl: '/badges/verified-expert.png',
    ratingAverage: 4.9,
    totalReviews: 128,
    digitalTwinId: 'dt_quantum_elena',
    pricePerQueryMicroUsdc: 50000 // 0.05 USDC
  },
  {
    id: 'exp_2',
    name: 'Marcus Vance',
    title: 'Principal Distributed Systems Engineer & Algorand Architect',
    organization: 'Decentralized Tech Labs',
    experienceYears: 11,
    verificationStatus: VerificationStatus.VERIFIED,
    verificationBadgeUrl: '/badges/verified-expert.png',
    ratingAverage: 4.95,
    totalReviews: 210,
    digitalTwinId: 'dt_marcus_algo',
    pricePerQueryMicroUsdc: 100000 // 0.10 USDC
  }
];

// GET /api/v1/experts (Marketplace Search & Listing)
expertsRouter.get('/', (req: Request, res: Response) => {
  const { category, query, verification } = req.query;
  let filtered = mockExperts;

  if (verification === 'true') {
    filtered = filtered.filter(e => e.verificationStatus === VerificationStatus.VERIFIED);
  }

  return res.json({
    experts: filtered,
    totalCount: filtered.length
  });
});

// GET /api/v1/experts/:id
expertsRouter.get('/:id', (req: Request, res: Response) => {
  const expert = mockExperts.find(e => e.id === req.params.id);
  if (!expert) {
    return res.status(404).json({ error: 'Expert not found' });
  }
  return res.json({ expert });
});

// POST /api/v1/experts/onboard (11-Step Wizard Ingestion)
expertsRouter.post('/onboard', (req: Request, res: Response) => {
  const { 
    identity, 
    professionalInfo, 
    expertise, 
    experience, 
    languages, 
    knowledgeRightsConsent, 
    twinConfig, 
    pricing 
  } = req.body;

  if (!identity || !professionalInfo || !knowledgeRightsConsent) {
    return res.status(400).json({ error: 'Missing mandatory expert onboarding parameters' });
  }

  const newExpertId = `exp_${Date.now()}`;
  const newTwinId = `dt_${Date.now()}`;

  const registeredExpert = {
    id: newExpertId,
    name: identity.fullName || 'New Expert',
    title: professionalInfo.title || 'Domain Specialist',
    organization: professionalInfo.organization || 'Independent',
    experienceYears: experience?.years || 5,
    verificationStatus: VerificationStatus.PENDING_REVIEW,
    digitalTwinId: newTwinId,
    pricePerQueryMicroUsdc: pricing?.perQueryMicroUsdc || 50000,
    onboardedAt: new Date()
  };

  return res.status(201).json({
    message: 'Expert onboarding submitted successfully. Verification status: PENDING_REVIEW',
    expert: registeredExpert,
    digitalTwinId: newTwinId,
    nextSteps: ['Upload domain documents', 'Submit for admin identity verification']
  });
});

// POST /api/v1/experts/knowledge/upload (Knowledge Document Ingestion)
expertsRouter.post('/knowledge/upload', (req: Request, res: Response) => {
  const { digitalTwinId, documentTitle, fileMimeType, fileSizeBytes } = req.body;
  if (!digitalTwinId || !documentTitle) {
    return res.status(400).json({ error: 'digitalTwinId and documentTitle are required' });
  }

  const docId = `doc_${Date.now()}`;
  const contentHash = `sha256_${Math.random().toString(36).substring(2, 15)}`;

  return res.status(202).json({
    message: 'Document accepted for background processing, chunking, and embedding',
    document: {
      id: docId,
      digitalTwinId,
      title: documentTitle,
      fileMimeType: fileMimeType || 'application/pdf',
      fileSizeBytes: fileSizeBytes || 2048500,
      contentHashSha256: contentHash,
      status: 'PROCESSING', // PROCESSING -> INDEXING -> READY
      chunksCountEst: 142
    }
  });
});
