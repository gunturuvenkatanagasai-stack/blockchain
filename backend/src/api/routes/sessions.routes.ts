import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import algosdk from 'algosdk';
import { blockchainService } from '../../blockchain/blockchain.service';
import { x402Service } from '../../x402/x402.service';
import { config } from '../../config';

const router = Router();

export interface SessionRecord {
  id: string;
  userWallet: string;
  digitalTwinId: string;
  transactionId: string;
  amountAlgo: number;
  durationMinutes: number;
  status: 'active' | 'expired' | 'completed';
  startedAt: string;
  expiresAt: string;
  createdAt: string;
}

// In-memory store for active & past session enrollments
const sessionStore = new Map<string, SessionRecord>();

/**
 * POST /api/sessions/enroll
 */
router.post('/enroll', async (req: Request, res: Response) => {
  try {
    const { digitalTwinId, walletAddress, transactionId, durationMinutes = 30, expectedAmountMicro = 500000 } = req.body;

    if (!digitalTwinId) {
      return res.status(400).json({ error: 'MISSING_TWIN_ID', message: 'Digital Twin ID is required.' });
    }

    if (!walletAddress || !algosdk.isValidAddress(walletAddress)) {
      return res.status(400).json({ error: 'INVALID_WALLET', message: 'Valid Algorand wallet address required.' });
    }

    if (!transactionId) {
      return res.status(400).json({ error: 'MISSING_TX_ID', message: 'Confirmed transaction ID required.' });
    }

    // Check if txId already spent for another session enrollment (Phase 12: anti-replay)
    for (const [, session] of sessionStore.entries()) {
      if (session.transactionId === transactionId) {
        return res.status(400).json({
          error: 'PAYMENT_ALREADY_PROCESSED',
          message: `Transaction ID ${transactionId} has already been consumed for session ${session.id}.`,
        });
      }
    }

    // Server-side blockchain verification against Algorand TestNet
    const verification = await blockchainService.verifyTransactionOnChain(
      transactionId,
      walletAddress,
      config.algorand.treasuryAddress,
      expectedAmountMicro
    );

    if (!verification.verified) {
      return res.status(400).json({
        error: 'PAYMENT_VERIFICATION_FAILED',
        message: `Blockchain verification failed: ${verification.error || 'Invalid transaction on TestNet.'}`,
      });
    }

    // Check existing active session for this twin & user
    const now = new Date();
    for (const [, session] of sessionStore.entries()) {
      if (session.userWallet === walletAddress && session.digitalTwinId === digitalHumanNormalized(digitalTwinId)) {
        if (new Date(session.expiresAt) > now && session.status === 'active') {
          return res.json({
            success: true,
            session,
            message: 'User already has an active session for this Digital Twin.',
          });
        }
      }
    }

    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + durationMinutes * 60 * 1000);
    const sessionId = `sess_${crypto.randomBytes(8).toString('hex')}`;

    const sessionRecord: SessionRecord = {
      id: sessionId,
      userWallet: walletAddress,
      digitalTwinId: digitalHumanNormalized(digitalTwinId),
      transactionId,
      amountAlgo: verification.algoAmount || expectedAmountMicro / 1000000,
      durationMinutes,
      status: 'active',
      startedAt: startedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      createdAt: startedAt.toISOString(),
    };

    sessionStore.set(sessionId, sessionRecord);

    return res.json({
      success: true,
      status: 'active',
      session: sessionRecord,
      message: 'Paid Digital Twin session activated successfully!',
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'ENROLLMENT_FAILED', message: err.message });
  }
});

/**
 * GET /api/sessions/active
 */
router.get('/active', (req: Request, res: Response) => {
  const walletAddress = (req.query.walletAddress as string) || (req.headers['x-wallet-address'] as string);
  if (!walletAddress || !algosdk.isValidAddress(walletAddress)) {
    return res.json({ walletAddress: walletAddress || null, activeSessions: [] });
  }

  const now = new Date();
  const activeSessions: SessionRecord[] = [];

  for (const [, session] of sessionStore.entries()) {
    if (session.userWallet === walletAddress) {
      if (new Date(session.expiresAt) <= now && session.status === 'active') {
        session.status = 'expired';
      } else if (session.status === 'active') {
        activeSessions.push(session);
      }
    }
  }

  return res.json({ walletAddress, activeSessions });
});

/**
 * GET /api/sessions/history
 */
router.get('/history', (req: Request, res: Response) => {
  const walletAddress = (req.query.walletAddress as string) || (req.headers['x-wallet-address'] as string);
  if (!walletAddress || !algosdk.isValidAddress(walletAddress)) {
    return res.json({ walletAddress: walletAddress || null, history: [] });
  }

  const history: SessionRecord[] = [];
  const now = new Date();

  for (const [, session] of sessionStore.entries()) {
    if (session.userWallet === walletAddress) {
      if (new Date(session.expiresAt) <= now && session.status === 'active') {
        session.status = 'expired';
      }
      history.push(session);
    }
  }

  // Sort descending by startedAt
  history.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

  return res.json({ walletAddress, history });
});

/**
 * GET /api/sessions/:sessionId
 */
router.get('/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = sessionStore.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: 'SESSION_NOT_FOUND', message: `No session found with ID ${sessionId}` });
  }

  const now = new Date();
  if (new Date(session.expiresAt) <= now && session.status === 'active') {
    session.status = 'expired';
  }

  return res.json({ session });
});

/**
 * POST /api/sessions/:sessionId/validate
 */
router.post('/:sessionId/validate', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { walletAddress } = req.body;

  const session = sessionStore.get(sessionId);
  if (!session) {
    return res.status(404).json({ valid: false, error: 'SESSION_NOT_FOUND', message: 'Session not found.' });
  }

  if (walletAddress && session.userWallet !== walletAddress) {
    return res.status(403).json({ valid: false, error: 'ACCESS_DENIED', message: 'You are not the owner of this session.' });
  }

  const now = new Date();
  if (new Date(session.expiresAt) <= now) {
    session.status = 'expired';
    return res.status(403).json({ valid: false, error: 'SESSION_EXPIRED', message: 'Session has expired.' });
  }

  return res.json({ valid: true, session });
});

/**
 * POST /api/sessions/:sessionId/end
 */
router.post('/:sessionId/end', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = sessionStore.get(sessionId);
  if (session) {
    session.status = 'completed';
  }
  return res.json({ success: true, message: 'Session marked as completed.' });
});

function digitalHumanNormalized(id: string): string {
  return id.toLowerCase().replace(/_/g, '-');
}

export default router;
