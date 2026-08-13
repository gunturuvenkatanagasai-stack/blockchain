import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

import { authRouter } from './routes/auth';
import { usersRouter } from './routes/users';
import { expertsRouter } from './routes/experts';
import { digitalTwinsRouter } from './routes/digitalTwins';
import { chatRouter } from './routes/chat';
import { x402Router } from './routes/x402';
import { adminRouter } from './routes/admin';

const app: Express = express();
const PORT = process.env.PORT || 4000;

// Security & Headers
app.use(helmet());
app.use(cors({
  origin: process.env.WEB_APP_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiting (100 requests / 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

app.use('/api/v1/', apiLimiter);

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'Digital Human Marketplace API Gateway',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API v1 Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/experts', expertsRouter);
app.use('/api/v1/digital-twins', digitalTwinsRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/x402', x402Router);
app.use('/api/v1/admin', adminRouter);

// Centralized Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[API Gateway Error]:', err.stack || err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    requestId: req.headers['x-request-id'] || 'req_unknown'
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  DIGITAL HUMAN MARKETPLACE - API GATEWAY OPERATIONAL   `);
    console.log(`  Running on: http://localhost:${PORT}                 `);
    console.log(`  Algorand x402 Protocol Engine Active                 `);
    console.log(`=======================================================`);
  });
}

export default app;
