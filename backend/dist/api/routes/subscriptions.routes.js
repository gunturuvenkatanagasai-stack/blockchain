"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const algosdk_1 = __importDefault(require("algosdk"));
const router = (0, express_1.Router)();
const activeSubscriptions = [];
/**
 * GET /api/subscriptions/me
 */
router.get('/me', (req, res) => {
    const address = req.query.address || req.headers['x-wallet-address'];
    if (!address || !algosdk_1.default.isValidAddress(address)) {
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
router.post('/purchase', async (req, res) => {
    try {
        const { walletAddress, digitalHumanId, plan, txId } = req.body;
        if (!walletAddress || !algosdk_1.default.isValidAddress(walletAddress)) {
            return res.status(400).json({ error: 'INVALID_ADDRESS', message: 'Valid wallet address required.' });
        }
        if (!txId) {
            return res.status(400).json({ error: 'MISSING_TX', message: 'Transaction ID required for subscription activation.' });
        }
        const durationDays = plan === 'monthly' ? 30 : 7;
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
        const subRecord = {
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
    }
    catch (err) {
        return res.status(500).json({ error: 'SUBSCRIPTION_FAILED', message: err.message });
    }
});
exports.default = router;
