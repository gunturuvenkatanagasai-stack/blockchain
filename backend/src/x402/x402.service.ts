import crypto from 'crypto';
import { config } from '../config';
import { blockchainService } from '../blockchain/blockchain.service';

export interface PaymentRequirement {
  id: string;
  digitalHumanId: string;
  amountMicroAlgo: number;
  payeeAddress: string;
  nonce: string;
  expiresAt: string;
  network: string;
}

export interface RevenueRecord {
  paymentId: string;
  creatorId: string;
  grossAmountAlgo: number;
  platformFeeAlgo: number;
  creatorAmountAlgo: number;
  transactionId: string;
  status: 'CONFIRMED' | 'SETTLED' | 'PENDING';
  createdAt: string;
}

export class X402Service {
  private settledNonces: Set<string> = new Set();
  private settledTxHashes: Set<string> = new Set();
  private activePaymentIntents: Map<string, PaymentRequirement> = new Map();
  private revenueRecords: RevenueRecord[] = [];

  public generateRequirement(
    digitalHumanId: string,
    customPriceMicroAlgo?: number,
    payeeAddress?: string
  ): PaymentRequirement {
    const nonce = crypto.randomBytes(16).toString('hex');
    const paymentIntentId = `req_${nonce.substring(0, 8)}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 min expiry

    const req: PaymentRequirement = {
      id: paymentIntentId,
      digitalHumanId,
      amountMicroAlgo: customPriceMicroAlgo || 10000, // Default 0.01 ALGO (10,000 microALGO)
      payeeAddress: payeeAddress || config.algorand.treasuryAddress || 'ABGJ7R7JNNV2XNHGL2LFKQKS5VIL5RVLH5C6MXSHOBDRBHVEAPTYY4SXEM',
      nonce,
      expiresAt,
      network: config.algorand.network || 'testnet',
    };

    this.activePaymentIntents.set(paymentIntentId, req);
    return req;
  }

  public getRequirement(paymentIntentId: string): PaymentRequirement | undefined {
    return this.activePaymentIntents.get(paymentIntentId);
  }

  public async verifyPaymentProof(
    proofString: string,
    expectedRequirement?: PaymentRequirement
  ): Promise<{ success: boolean; txHash?: string; message?: string; revenue?: RevenueRecord }> {
    if (!proofString) {
      return { success: false, message: 'Missing payment proof header or body parameter.' };
    }

    // Format: "TX_HASH" or "PAYMENT_INTENT_ID:TX_HASH"
    const parts = proofString.split(':');
    let txHash = parts[0].trim();
    let paymentIntentId = parts[1] ? parts[1].trim() : undefined;

    if (parts.length > 1 && parts[0].startsWith('req_')) {
      paymentIntentId = parts[0].trim();
      txHash = parts[1].trim();
    }

    // Check anti-replay / duplicate usage (Phase 19)
    if (this.settledTxHashes.has(txHash)) {
      return {
        success: false,
        message: 'PAYMENT_ALREADY_PROCESSED: Transaction hash already spent.',
      };
    }

    // Verify transaction on Algorand blockchain (Phase 18)
    const verification = await blockchainService.verifyTransactionOnChain(
      txHash,
      undefined,
      expectedRequirement?.payeeAddress,
      expectedRequirement?.amountMicroAlgo || 10000
    );

    if (!verification.verified) {
      return {
        success: false,
        message: `BLOCKCHAIN_VERIFICATION_FAILED: ${verification.error || 'Transaction invalid on Algorand TestNet.'}`,
      };
    }

    // Mark transaction as spent to prevent double-spending
    this.settledTxHashes.add(txHash);

    // Calculate revenue split (Phase 26)
    const grossAlgo = verification.algoAmount || (expectedRequirement ? expectedRequirement.amountMicroAlgo / 1000000 : 0.01);
    const platformFeePercentage = 0.15; // 15% platform fee
    const platformFeeAlgo = Number((grossAlgo * platformFeePercentage).toFixed(6));
    const creatorAmountAlgo = Number((grossAlgo - platformFeeAlgo).toFixed(6));

    const revenueRecord: RevenueRecord = {
      paymentId: paymentIntentId || `pay_${crypto.randomBytes(6).toString('hex')}`,
      creatorId: expectedRequirement?.digitalHumanId || 'expert_creator_1',
      grossAmountAlgo: grossAlgo,
      platformFeeAlgo,
      creatorAmountAlgo,
      transactionId: txHash,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    this.revenueRecords.push(revenueRecord);

    return {
      success: true,
      txHash,
      message: 'Payment confirmed on Algorand TestNet.',
      revenue: revenueRecord,
    };
  }

  public getRevenueRecords(): RevenueRecord[] {
    return [...this.revenueRecords];
  }
}

export const x402Service = new X402Service();
