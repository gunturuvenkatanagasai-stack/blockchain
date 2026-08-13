import express from 'express';
import cors from 'cors';
import { config } from './config';

import authRoutes from './api/routes/auth.routes';
import expertsRoutes from './api/routes/experts.routes';
import digitalHumansRoutes from './api/routes/digital-humans.routes';
import knowledgeRoutes from './api/routes/knowledge.routes';
import aiRoutes from './api/routes/ai.routes';
import marketplaceRoutes from './api/routes/marketplace.routes';
import studentRoutes from './api/routes/student.routes';
import careerRoutes from './api/routes/career.routes';
import wellnessRoutes from './api/routes/wellness.routes';
import creatorRoutes from './api/routes/creator.routes';
import walletRoutes from './api/routes/wallet.routes';
import paymentsRoutes from './api/routes/payments.routes';
import subscriptionsRoutes from './api/routes/subscriptions.routes';
import sessionsRoutes from './api/routes/sessions.routes';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use((req, res, next) => {
  if (req.headers['content-type']) {
    req.headers['content-type'] = req.headers['content-type'].toLowerCase();
  }
  next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health & Observability routes
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));
app.get('/ready', (req, res) => res.json({ status: 'READY', database: 'CONNECTED', redis: 'CONNECTED' }));
app.get('/metrics', (req, res) => res.json({ uptime: process.uptime(), memory: process.memoryUsage() }));

// Mount API routes under /api/v1 as well as root /api aliases
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/wallet', walletRoutes);

app.use('/api/v1/payments', paymentsRoutes);
app.use('/api/payments', paymentsRoutes);

app.use('/api/v1/subscriptions', subscriptionsRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);

app.use('/api/v1/sessions', sessionsRoutes);
app.use('/api/sessions', sessionsRoutes);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/experts', expertsRoutes);
app.use('/api/v1/digital-humans', digitalHumansRoutes);
app.use('/api/digital-humans', digitalHumansRoutes);
app.use('/api/v1/knowledge', knowledgeRoutes);
app.use('/api/v1', aiRoutes); // /api/v1/chat, /api/v1/chat/message, /api/v1/chat/query
app.use('/api', aiRoutes);
app.use('/api/v1/marketplace', marketplaceRoutes);
app.use('/api/v1/student', studentRoutes);
app.use('/api/v1/career', careerRoutes);
app.use('/api/v1/wellness', wellnessRoutes);
app.use('/api/v1/creator', creatorRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Backend Server Error]:', err);
  res.status(err.status || 500).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected backend error occurred.'
  });
});

const PORT = config.port;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  x402 DIGITAL HUMAN MARKETPLACE BACKEND ACTIVE        `);
    console.log(`  Listening on: http://localhost:${PORT}               `);
    console.log(`  Algorand TestNet Network: ${config.algorand.network} `);
    console.log(`=======================================================`);
  });
}

export default app;
