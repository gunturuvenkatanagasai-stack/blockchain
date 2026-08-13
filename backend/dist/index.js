"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const auth_routes_1 = __importDefault(require("./api/routes/auth.routes"));
const experts_routes_1 = __importDefault(require("./api/routes/experts.routes"));
const digital_humans_routes_1 = __importDefault(require("./api/routes/digital-humans.routes"));
const knowledge_routes_1 = __importDefault(require("./api/routes/knowledge.routes"));
const ai_routes_1 = __importDefault(require("./api/routes/ai.routes"));
const marketplace_routes_1 = __importDefault(require("./api/routes/marketplace.routes"));
const student_routes_1 = __importDefault(require("./api/routes/student.routes"));
const career_routes_1 = __importDefault(require("./api/routes/career.routes"));
const wellness_routes_1 = __importDefault(require("./api/routes/wellness.routes"));
const creator_routes_1 = __importDefault(require("./api/routes/creator.routes"));
const wallet_routes_1 = __importDefault(require("./api/routes/wallet.routes"));
const payments_routes_1 = __importDefault(require("./api/routes/payments.routes"));
const subscriptions_routes_1 = __importDefault(require("./api/routes/subscriptions.routes"));
const sessions_routes_1 = __importDefault(require("./api/routes/sessions.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use((req, res, next) => {
    if (req.headers['content-type']) {
        req.headers['content-type'] = req.headers['content-type'].toLowerCase();
    }
    next();
});
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
// Health & Observability routes
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));
app.get('/ready', (req, res) => res.json({ status: 'READY', database: 'CONNECTED', redis: 'CONNECTED' }));
app.get('/metrics', (req, res) => res.json({ uptime: process.uptime(), memory: process.memoryUsage() }));
// Mount API routes under /api/v1 as well as root /api aliases
app.use('/api/v1/wallet', wallet_routes_1.default);
app.use('/api/wallet', wallet_routes_1.default);
app.use('/api/v1/payments', payments_routes_1.default);
app.use('/api/payments', payments_routes_1.default);
app.use('/api/v1/subscriptions', subscriptions_routes_1.default);
app.use('/api/subscriptions', subscriptions_routes_1.default);
app.use('/api/v1/sessions', sessions_routes_1.default);
app.use('/api/sessions', sessions_routes_1.default);
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/experts', experts_routes_1.default);
app.use('/api/v1/digital-humans', digital_humans_routes_1.default);
app.use('/api/digital-humans', digital_humans_routes_1.default);
app.use('/api/v1/knowledge', knowledge_routes_1.default);
app.use('/api/v1', ai_routes_1.default); // /api/v1/chat, /api/v1/chat/message, /api/v1/chat/query
app.use('/api', ai_routes_1.default);
app.use('/api/v1/marketplace', marketplace_routes_1.default);
app.use('/api/v1/student', student_routes_1.default);
app.use('/api/v1/career', career_routes_1.default);
app.use('/api/v1/wellness', wellness_routes_1.default);
app.use('/api/v1/creator', creator_routes_1.default);
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('[Backend Server Error]:', err);
    res.status(err.status || 500).json({
        error: err.name || 'InternalServerError',
        message: err.message || 'An unexpected backend error occurred.'
    });
});
const PORT = config_1.config.port;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`=======================================================`);
        console.log(`  x402 DIGITAL HUMAN MARKETPLACE BACKEND ACTIVE        `);
        console.log(`  Listening on: http://localhost:${PORT}               `);
        console.log(`  Algorand TestNet Network: ${config_1.config.algorand.network} `);
        console.log(`=======================================================`);
    });
}
exports.default = app;
