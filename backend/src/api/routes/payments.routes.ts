import { Router, Request, Response } from 'express';
import { x402Service } from '../../x402/x402.service';
import { blockchainService } from '../../blockchain/blockchain.service';
import { config } from '../../config';

const router = Router();

/**
 * POST /api/payments/prepare
 */
router.post('/prepare', async (req: Request, res: Response) => {
  try {
    const { digitalHumanId = 'default_dt', plan = 'pay_per_use', senderAddress } = req.body;

    let customPriceMicro = 10000; // 0.01 ALGO per question
    if (plan === 'weekly') {
      customPriceMicro = 500000; // 0.5 ALGO weekly
    } else if (plan === 'monthly') {
      customPriceMicro = 1500000; // 1.5 ALGO monthly
    }

    const requirement = x402Service.generateRequirement(
      digitalHumanId,
      customPriceMicro,
      config.algorand.treasuryAddress
    );

    const suggestedParams = await blockchainService.getSuggestedParams();

    return res.json({
      success: true,
      paymentIntentId: requirement.id,
      requirement: {
        id: requirement.id,
        digitalHumanId: requirement.digitalHumanId,
        amountAlgo: requirement.amountMicroAlgo / 1000000,
        amountMicroAlgo: requirement.amountMicroAlgo,
        payeeAddress: requirement.payeeAddress,
        nonce: requirement.nonce,
        expiresAt: requirement.expiresAt,
        network: requirement.network,
      },
      suggestedParams: {
        fee: Number(suggestedParams.fee || 1000),
        firstRound: Number(suggestedParams.firstValid || 38291000),
        lastRound: Number(suggestedParams.lastValid || 38292000),
        genesisID: suggestedParams.genesisID || 'testnet-v1.0',
        genesisHash: suggestedParams.genesisHash || 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJO4c=',
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'PAYMENT_PREPARATION_FAILED', message: err.message });
  }
});

/**
 * POST /api/payments/verify
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { paymentIntentId, txId, digitalHumanId } = req.body;

    if (!txId) {
      return res.status(400).json({ error: 'MISSING_TX_ID', message: 'Transaction ID is required for verification.' });
    }

    const requirement = paymentIntentId ? x402Service.getRequirement(paymentIntentId) : undefined;
    const proofString = paymentIntentId ? `${paymentIntentId}:${txId}` : txId;

    const verification = await x402Service.verifyPaymentProof(proofString, requirement);

    if (!verification.success) {
      return res.status(400).json({
        error: 'PAYMENT_VERIFICATION_FAILED',
        message: verification.message || 'Payment proof verification failed on Algorand TestNet.',
      });
    }

    return res.json({
      success: true,
      status: 'CONFIRMED',
      txId: verification.txHash,
      accessUnlocked: true,
      revenue: verification.revenue,
      message: 'Payment confirmed on Algorand TestNet. AI access unlocked.',
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'VERIFICATION_ERROR', message: err.message });
  }
});

/**
 * GET /api/payments/:id
 */
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const requirement = x402Service.getRequirement(id);
  if (!requirement) {
    return res.status(404).json({ error: 'PAYMENT_NOT_FOUND', message: `No payment intent found with ID ${id}` });
  }
  return res.json({ payment: requirement });
});

export default router;
