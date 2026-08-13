"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// In-memory / mock state when DB is initializing
const mockUsers = {
    'dev_user_1': {
        id: 'dev_user_1',
        email: 'user@x402marketplace.io',
        passwordHash: '$2b$10$abcdefghijklmnopqrstuv', // hashed dummy
        role: 'USER',
        createdAt: new Date().toISOString()
    }
};
// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' });
    }
    const existing = Object.values(mockUsers).find((u) => u.email === email);
    if (existing) {
        return res.status(409).json({ error: 'User already exists' });
    }
    const passwordHash = await bcrypt_1.default.hash(password, 10);
    const userId = `usr_${Date.now()}`;
    const newUser = {
        id: userId,
        email,
        passwordHash,
        role: role || 'USER',
        createdAt: new Date().toISOString()
    };
    mockUsers[userId] = newUser;
    const accessToken = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, config_1.config.jwtSecret, { expiresIn: '15m' });
    const refreshToken = jsonwebtoken_1.default.sign({ id: newUser.id }, config_1.config.jwtRefreshSecret, { expiresIn: '7d' });
    return res.status(201).json({
        message: 'User registered successfully',
        user: { id: newUser.id, email: newUser.email, role: newUser.role },
        accessToken,
        refreshToken
    });
});
// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = Object.values(mockUsers).find((u) => u.email === email);
    if (!user) {
        // Return standard success mock for dev login
        const devUser = mockUsers['dev_user_1'];
        const accessToken = jsonwebtoken_1.default.sign({ id: devUser.id, email: devUser.email, role: devUser.role }, config_1.config.jwtSecret, { expiresIn: '1h' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: devUser.id }, config_1.config.jwtRefreshSecret, { expiresIn: '7d' });
        return res.json({
            user: { id: devUser.id, email: devUser.email, role: devUser.role },
            accessToken,
            refreshToken
        });
    }
    const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, config_1.config.jwtSecret, { expiresIn: '1h' });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, config_1.config.jwtRefreshSecret, { expiresIn: '7d' });
    return res.json({
        user: { id: user.id, email: user.email, role: user.role },
        accessToken,
        refreshToken
    });
});
// POST /api/v1/auth/refresh
router.post('/refresh', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.status(400).json({ error: 'Missing refresh token' });
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.config.jwtRefreshSecret);
        const user = mockUsers[decoded.id] || mockUsers['dev_user_1'];
        const newAccessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, config_1.config.jwtSecret, { expiresIn: '1h' });
        return res.json({ accessToken: newAccessToken });
    }
    catch (err) {
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
});
// POST /api/v1/auth/logout
router.post('/logout', (req, res) => {
    return res.json({ message: 'Logged out successfully' });
});
// GET /api/v1/auth/me
router.get('/me', auth_middleware_1.authenticateJWT, (req, res) => {
    return res.json({ user: req.user });
});
exports.default = router;
