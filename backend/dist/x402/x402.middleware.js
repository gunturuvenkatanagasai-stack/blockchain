"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.x402PaymentMiddleware = void 0;
const x402_service_1 = require("./x402.service");
const x402PaymentMiddleware = (digitalHumanParamName = 'id') => {
    return async (req, res, next) => {
        const digitalHumanId = req.params[digitalHumanParamName] || req.body?.digital_twin_id || req.body?.digitalHumanId || 'default_dt';
        const proofHeader = req.headers['x-402-payment-proof'] || req.body?.x402_proof || req.body?.paymentProof;
        if (!proofHeader) {
            const requirement = x402_service_1.x402Service.generateRequirement(digitalHumanId);
            res.setHeader('WWW-Authenticate', `x402 realm="Algorand Digital Human API", nonce="${requirement.nonce}"`);
            return res.status(402).json({
                error: 'Payment Required',
                statusCode: 402,
                protocol: 'x402',
                message: 'Valid microUSDC payment proof on Algorand TestNet is required to execute this request.',
                requirement
            });
        }
        const verification = await x402_service_1.x402Service.verifyPaymentProof(proofHeader);
        if (!verification.success) {
            const requirement = x402_service_1.x402Service.generateRequirement(digitalHumanId);
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
exports.x402PaymentMiddleware = x402PaymentMiddleware;
