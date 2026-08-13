"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const mockDigitalHumans = {
    'dt_marcus_algo': {
        id: 'dt_marcus_algo',
        expertId: 'exp_marcus_1',
        name: 'Marcus Vance Digital Twin',
        description: '15+ years leading high-throughput database design, consensus algorithms, and fault-tolerant cloud engines.',
        category: 'tech',
        languages: ['English', 'Spanish'],
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        voice: 'en-US-Neural2-F',
        personality: 'Rigorous, clear, architectural, analytical',
        communicationStyle: 'Direct and code-oriented with step-by-step breakdowns',
        knowledgeVersion: 2,
        pricing: { type: 'PAY_PER_USE', priceMicro: 50000 },
        status: 'PUBLISHED',
        createdAt: new Date().toISOString()
    },
    'twin_1': {
        id: 'twin_1',
        expertId: 'exp_evelyn_1',
        name: 'Dr. Evelyn Vance AI',
        description: 'Distributed Systems & Database Architect. High-throughput database design and consensus algorithms.',
        category: 'tech',
        languages: ['English', 'Spanish'],
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
        voice: 'en-US-Neural2-C',
        personality: 'Academic, structured, encouraging',
        communicationStyle: 'Detailed conceptual explanation with real-world architectural examples',
        knowledgeVersion: 1,
        pricing: { type: 'PAY_PER_USE', priceMicro: 50000 },
        status: 'PUBLISHED',
        createdAt: new Date().toISOString()
    },
    'twin_2': {
        id: 'twin_2',
        expertId: 'exp_sterling_1',
        name: 'Dr. Marcus Sterling AI',
        description: 'Authorized medical knowledge twin focusing on cardiovascular wellness education and lifestyle intervention.',
        category: 'medical',
        languages: ['English'],
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d',
        voice: 'en-US-Neural2-D',
        personality: 'Empathetic, clear, evidence-based',
        communicationStyle: 'Educational guidance with strict medical disclaimers',
        knowledgeVersion: 1,
        pricing: { type: 'PAY_PER_USE', priceMicro: 75000 },
        status: 'PUBLISHED',
        createdAt: new Date().toISOString()
    },
    'twin_3': {
        id: 'twin_3',
        expertId: 'exp_chen_1',
        name: 'Sarah Chen AI',
        description: 'Executive Career & FAANG Interview Coach. Technical interviews, ATS resume reviews, and career roadmaps.',
        category: 'career',
        languages: ['English', 'Mandarin'],
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
        voice: 'en-US-Neural2-F',
        personality: 'Strategic, motivational, results-driven',
        communicationStyle: 'Mock interview questions, actionable feedback, and scorecards',
        knowledgeVersion: 1,
        pricing: { type: 'PAY_PER_USE', priceMicro: 60000 },
        status: 'PUBLISHED',
        createdAt: new Date().toISOString()
    }
};
// GET /api/v1/digital-humans & /api/v1/digital-twins
router.get(['/', '/digital-twins'], (req, res) => {
    const published = Object.values(mockDigitalHumans).filter((dh) => dh.status === 'PUBLISHED');
    return res.json({ digitalHumans: published, digitalTwins: published });
});
// GET /api/v1/digital-humans/:id
router.get('/:id', (req, res) => {
    const dh = mockDigitalHumans[req.params.id];
    if (!dh)
        return res.status(404).json({ error: 'Digital Human not found' });
    return res.json({ digitalHuman: dh, digitalTwin: dh });
});
// POST /api/v1/digital-humans
router.post(['/', '/digital-twins'], auth_middleware_1.authenticateJWT, (req, res) => {
    const { name, description, category, languages, personality, communicationStyle } = req.body;
    const id = `dh_${Date.now()}`;
    const newDH = {
        id,
        expertId: req.user?.id || 'exp_marcus_1',
        name: name || 'New Digital Human',
        description: description || '',
        category: category || 'general',
        languages: languages || ['English'],
        personality: personality || 'Helpful expert',
        communicationStyle: communicationStyle || 'Professional',
        knowledgeVersion: 1,
        status: 'DRAFT',
        createdAt: new Date().toISOString()
    };
    mockDigitalHumans[id] = newDH;
    return res.status(201).json({ message: 'Digital Human created', digitalHuman: newDH, digitalTwin: newDH });
});
// PUT /api/v1/digital-humans/:id
router.put('/:id', auth_middleware_1.authenticateJWT, (req, res) => {
    const dh = mockDigitalHumans[req.params.id];
    if (!dh)
        return res.status(404).json({ error: 'Digital Human not found' });
    Object.assign(dh, req.body, { updatedAt: new Date().toISOString() });
    return res.json({ message: 'Digital Human updated', digitalHuman: dh });
});
// POST /api/v1/digital-humans/:id/publish
router.post('/:id/publish', auth_middleware_1.authenticateJWT, (req, res) => {
    const dh = mockDigitalHumans[req.params.id];
    if (!dh)
        return res.status(404).json({ error: 'Digital Human not found' });
    dh.status = 'PUBLISHED';
    return res.json({ message: 'Digital Human published to marketplace', digitalHuman: dh });
});
// POST /api/v1/digital-humans/:id/unpublish
router.post('/:id/unpublish', auth_middleware_1.authenticateJWT, (req, res) => {
    const dh = mockDigitalHumans[req.params.id];
    if (!dh)
        return res.status(404).json({ error: 'Digital Human not found' });
    dh.status = 'DRAFT';
    return res.json({ message: 'Digital Human unpublished', digitalHuman: dh });
});
exports.default = router;
