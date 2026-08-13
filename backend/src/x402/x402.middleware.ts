import { Request, Response, NextFunction } from 'express';
import { x402Service } from './x402.service';

export interface X402Request extends Request {
  x402Payment?: {
    txHash: string;
    verifiedAt: string;
  };
}

export const x402PaymentMiddleware = (digitalHumanParamName: string = 'id') => {
  return async (req: X402Request, res: Response, next: NextFunction) => {
    const digitalHumanId = req.params[digitalHumanParamName] || req.body?.digital_twin_id || req.body?.digitalHumanId || 'default_dt';
    const proofHeader = (req.headers['x-402-payment-proof'] as string) || req.body?.x402_proof || req.body?.paymentProof;

    if (!proofHeader) {
      const requirement = x402Service.generateRequirement(digitalHumanId);
      res.setHeader('WWW-Authenticate', `x402 realm="Algorand Digital Human API", nonce="${requirement.nonce}"`);
      return res.status(402).json({
        error: 'Payment Required',
        statusCode: 402,
        protocol: 'x402',
        message: 'Valid microUSDC payment proof on Algorand TestNet is required to execute this request.',
        requirement
      });
    }

    const verification = await x402Service.verifyPaymentProof(proofHeader);
    if (!verification.success) {
      const requirement = x402Service.generateRequirement(digitalHumanId);
      return res.status(402).json({
        error: 'Payment Verification Failed',
        statusCode: 402,
        protocol: 'x402',
        message: verification.message || 'Payment proof verification failed.',
        requirement
      });
    }

    req.x402Payment = {
      txHash: verification.txHash || 'tx_verified',
      verifiedAt: new Date().toISOString(),
    };

    next();
  };
};
