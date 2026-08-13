import { Router, Request, Response } from 'express';

export const usersRouter = Router();

// GET /api/v1/users/me
usersRouter.get('/me', (req: Request, res: Response) => {
  return res.json({
    id: 'usr_demo_123',
    email: 'learner@example.com',
    fullName: 'Demo Learner',
    roles: ['LEARNER'],
    avatarUrl: 'https://ui-avatars.com/api/?name=Demo+Learner',
    bio: 'Lifelong learner exploring AI & Web3',
    interests: ['Artificial Intelligence', 'Algorand', 'Full-Stack Engineering'],
    createdAt: new Date()
  });
});

// GET /api/v1/users/export (GDPR Data Export)
usersRouter.get('/export', (req: Request, res: Response) => {
  return res.json({
    userProfile: { id: 'usr_demo_123', email: 'learner@example.com' },
    conversations: [
      { id: 'conv_1', twinName: 'Prof. AI Physics', messageCount: 14 }
    ],
    memories: [
      { memoryKey: 'preferred_learning_style', memoryVal: 'Visual step-by-step code' }
    ],
    exportedAt: new Date()
  });
});

// DELETE /api/v1/users/memory (Erasure of User AI Memories)
usersRouter.delete('/memory', (req: Request, res: Response) => {
  return res.json({
    message: 'User AI memories and personalization preferences successfully erased',
    clearedKeysCount: 3
  });
});
