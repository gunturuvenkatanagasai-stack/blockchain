"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const mockCreatorBalance = {
    expertId: 'exp_marcus_1',
    totalEarnedUsdc: 1420.50,
    withdrawnUsdc: 400.00,
    availableUsdc: 1020.50,
    totalQueriesServed: 28410,
    activeSubscribers: 42
};
// GET /api/v1/creator/analytics
router.get('/analytics', auth_middleware_1.authenticateJWT, (req, res) => {
    return res.json({
        expertId: mockCreatorBalance.expertId,
        earnings: mockCreatorBalance,
        recentTransactions: [
            { id: 'tx_1', amountUsdc: 0.05, type: 'PAY_PER_USE', timestamp: new Date(Date.now() - 3600000).toISOString() },
            { id: 'tx_2', amountUsdc: 19.99, type: 'MONTHLY_SUBSCRIPTION', timestamp: new Date(Date.now() - 86400000).toISOString() }
        ]
    });
});
// POST /api/v1/creator/withdraw
router.post('/withdraw', auth_middleware_1.authenticateJWT, (req, res) => {
    const { amountUsdc, destinationWallet } = req.body;
    const withdrawAmount = amountUsdc || mockCreatorBalance.availableUsdc;
    if (withdrawAmount <= 0 || withdrawAmount > mockCreatorBalance.availableUsdc) {
        return res.status(400).json({ error: 'Insufficient available balance or invalid withdrawal amount' });
    }
    mockCreatorBalance.availableUsdc -= withdrawAmount;
    mockCreatorBalance.withdrawnUsdc += withdrawAmount;
    return res.json({
        message: 'Royalty payout transaction initiated on Algorand TestNet',
        payout: {
            amountUsdc: withdrawAmount,
            destinationWallet: destinationWallet || 'MARCUS402ALGORANDADDRESS777777777777777777777777',
            status: 'SETTLED',
            txHash: `ALGO_PAYOUT_${Date.now()}`
        },
        remainingBalance: mockCreatorBalance.availableUsdc
    });
});
exports.default = router;
