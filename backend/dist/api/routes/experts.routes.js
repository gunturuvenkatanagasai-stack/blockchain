"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const mockExperts = {
    'exp_marcus_1': {
        id: 'exp_marcus_1',
        userId: 'dev_user_1',
        name: 'Dr. Marcus Vance',
        title: 'Algorand & Distributed Systems Architect',
        bio: 'Pioneer in stateful smart contract verification and x402 payment protocol.',
        expertise: ['Distributed Systems', 'Blockchain', 'Algorand', 'Cryptography'],
        languages: ['English'],
        experience: 12,
        categories: ['tech', 'blockchain'],
        walletAddress: 'MARCUS402ALGORANDADDRESS777777777777777777777777',
        verificationStatus: 'VERIFIED',
        createdAt: new Date().toISOString()
    }
};
// POST /api/v1/experts
router.post('/', auth_middleware_1.authenticateJWT, (req, res) => {
    const { name, title, bio, expertise, languages, experience, categories, walletAddress } = req.body;
    const expertId = `exp_${Date.now()}`;
    const newExpert = {
        id: expertId,
        userId: req.user?.id || 'dev_user_1',
        name: name || 'Domain Expert',
        title: title || 'Specialist',
        bio: bio || '',
        expertise: expertise || [],
        languages: languages || ['English'],
        experience: experience || 5,
        categories: categories || ['general'],
        walletAddress: walletAddress || 'UNCONNECTED',
        verificationStatus: 'PENDING',
        createdAt: new Date().toISOString()
    };
    mockExperts[expertId] = newExpert;
    return res.status(201).json({ message: 'Expert profile submitted for review', expert: newExpert });
});
// GET /api/v1/experts/me
router.get('/me', auth_middleware_1.authenticateJWT, (req, res) => {
    const expert = Object.values(mockExperts).find((e) => e.userId === req.user?.id) || mockExperts['exp_marcus_1'];
    return res.json({ expert });
});
// PUT /api/v1/experts/me
router.put('/me', auth_middleware_1.authenticateJWT, (req, res) => {
    const expert = Object.values(mockExperts).find((e) => e.userId === req.user?.id) || mockExperts['exp_marcus_1'];
    Object.assign(expert, req.body, { updatedAt: new Date().toISOString() });
    return res.json({ message: 'Expert profile updated', expert });
});
// POST /api/v1/experts/verification
router.post('/verification', auth_middleware_1.authenticateJWT, (req, res) => {
    const { documents } = req.body;
    const expert = Object.values(mockExperts).find((e) => e.userId === req.user?.id) || mockExperts['exp_marcus_1'];
    expert.verificationStatus = 'PENDING';
    return res.json({
        message: 'Verification credentials uploaded and pending admin approval',
        verification: { expertId: expert.id, documents: documents || [], status: 'PENDING' }
    });
});
// GET /api/v1/experts/verification
router.get('/verification', auth_middleware_1.authenticateJWT, (req, res) => {
    const expert = Object.values(mockExperts).find((e) => e.userId === req.user?.id) || mockExperts['exp_marcus_1'];
    return res.json({ status: expert.verificationStatus });
});
exports.default = router;
