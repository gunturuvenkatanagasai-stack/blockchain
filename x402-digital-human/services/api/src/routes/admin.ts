import { Router, Request, Response } from 'express';
import { VerificationStatus } from '@x402-digital-human/types';

export const adminRouter = Router();

const pendingVerifications = [
  {
    id: 'verif_101',
    expertId: 'exp_onboard_pending',
    expertName: 'Dr. Sarah Jenkins',
    title: 'Clinical Neuroscientist & Educational Health Specialist',
    identityDocUrl: 'https://storage.digitalhuman.marketplace/docs/identity_proof_101.pdf',
    professionalProof: 'https://storage.digitalhuman.marketplace/docs/medical_license_101.pdf',
    submittedAt: new Date(Date.now() - 86400000),
    status: VerificationStatus.PENDING_REVIEW
  }
];

// GET /api/v1/admin/verifications
adminRouter.get('/verifications', (req: Request, res: Response) => {
  return res.json({
    verifications: pendingVerifications,
    count: pendingVerifications.length
  });
});

// POST /api/v1/admin/verifications/:id/review
adminRouter.post('/verifications/:id/review', (req: Request, res: Response) => {
  const { status, adminNotes } = req.body;
  if (!status || ![VerificationStatus.VERIFIED, VerificationStatus.REJECTED].includes(status)) {
    return res.status(400).json({ error: 'Valid status required: VERIFIED or REJECTED' });
  }

  const verif = pendingVerifications.find(v => v.id === req.params.id);
  if (!verif) {
    return res.status(404).json({ error: 'Verification request not found' });
  }

  verif.status = status;

  return res.json({
    message: `Expert verification request updated to ${status}`,
    verification: verif,
    adminNotes: adminNotes || 'Approved by Platform Admin'
  });
});

// GET /api/v1/admin/audit-logs
adminRouter.get('/audit-logs', (req: Request, res: Response) => {
  return res.json({
    auditLogs: [
      { id: 'log_1', action: 'EXPERT_VERIFICATION_APPROVE', details: 'Approved Dr. Elena Rostova', timestamp: new Date(Date.now() - 3600000) },
      { id: 'log_2', action: 'X402_REVENUE_SETTLEMENT', details: 'Settled 100000 microUSDC to Marcus Vance', timestamp: new Date(Date.now() - 1800000) }
    ]
  });
});
