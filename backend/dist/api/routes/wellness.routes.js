"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// POST /api/v1/wellness/session
router.post('/session', (req, res) => {
    const { activityType } = req.body;
    const disclaimer = '⚠️ Educational wellness guidance is not medical or psychological treatment. For clinical concerns, please consult a licensed healthcare professional.';
    if (activityType === 'breathing') {
        return res.json({
            activity: 'Box Breathing Exercise',
            disclaimer,
            steps: [
                'Inhale slowly for 4 seconds',
                'Hold breath for 4 seconds',
                'Exhale smoothly for 4 seconds',
                'Hold empty for 4 seconds'
            ]
        });
    }
    return res.json({
        activity: 'Study Break & Focus Planner',
        disclaimer,
        guidance: 'Take a 5-minute hydration break for every 25 minutes of intense coding or study session to maintain cognitive focus.'
    });
});
exports.default = router;
