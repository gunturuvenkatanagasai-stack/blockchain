import { Router, Request, Response } from 'express';
import { x402Service } from '../../x402/x402.service';
import algosdk from 'algosdk';

const router = Router();

// In-memory subscriptions store
interface SubscriptionRecord {
  id: string;
  walletAddress: string;
  digitalHumanId: string;
  plan: 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED';
  paymentId: string;
}

const activeSubscriptions: SubscriptionRecord[] = [];

/**
 * GET /api/subscriptions/me
 */
router.get('/me', (req: Request, res: Response) => {
  const address = (req.query.address as string) || (req.headers['x-wallet-address'] as string);
  if (!address || !algosdk.isValidAddress(address)) {
    return res.json({ subscriptions: [] });
  }

  const now = new Date();
  const userSubs = activeSubscriptions.map((sub) => {
    if (sub.walletAddress === address && new Date(sub.endDate) < now) {
      sub.status = 'EXPIRED';
    }
    return sub;
  }).filter((sub) => sub.walletAddress === address);

  return res.json({ walletAddress: address, subscriptions: userSubs });
});

/**
 * POST /api/subscriptions/purchase
 */
router.post('/purchase', async (req: Request, res: Response) => {
  try {
    const { walletAddress, digitalHumanId, plan, txId } = req.body;
    if (!walletAddress || !algosdk.isValidAddress(walletAddress)) {
      return res.status(400).json({ error: 'INVALID_ADDRESS', message: 'Valid wallet address required.' });
    }

    if (!txId) {
      return res.status(400).json({ error: 'MISSING_TX', message: 'Transaction ID required for subscription activation.' });
    }

    const durationDays = plan === 'monthly' ? 30 : 7;
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const subRecord: SubscriptionRecord = {
      id: `sub_${Date.now()}`,
      walletAddress,
      digitalHumanId: digitalHumanId || 'all_twins',
      plan: plan === 'monthly' ? 'monthly' : 'weekly',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: 'ACTIVE',
      paymentId: txId,
    };

    activeSubscriptions.push(subRecord);

    return res.json({
      success: true,
      subscription: subRecord,
      message: `${plan === 'monthly' ? '30-Day Monthly' : '7-Day Weekly'} subscription activated!`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'SUBSCRIPTION_FAILED', message: err.message });
  }
});

export default router;
