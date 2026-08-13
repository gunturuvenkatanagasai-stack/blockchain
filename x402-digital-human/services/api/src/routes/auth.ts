import { Router, Request, Response } from 'express';
import { 
  hashPassword, 
  verifyPassword, 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken, 
  verifyAlgorandSignature 
} from '@x402-digital-human/security';
import { UserRole } from '@x402-digital-human/types';

export const authRouter = Router();

// In-memory mock DB fallback for initial API service testing if Prisma PG is offline
const mockUsers = new Map<string, any>();

// POST /api/v1/auth/register
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, roles } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Missing required fields: email, password, fullName' });
    }

    const assignedRoles: UserRole[] = Array.isArray(roles) && roles.length > 0 
      ? roles 
      : [UserRole.LEARNER];

    const passwordHash = await hashPassword(password);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const user = {
      id: userId,
      email,
      passwordHash,
      fullName,
      roles: assignedRoles,
      isEmailVerified: false,
      createdAt: new Date()
    };

    mockUsers.set(email, user);

    const accessToken = generateAccessToken({ userId, email, roles: assignedRoles });
    const refreshToken = generateRefreshToken({ userId, email, roles: assignedRoles });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: { id: userId, email, fullName, roles: assignedRoles },
      accessToken
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST /api/v1/auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = mockUsers.get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email, roles: user.roles });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email, roles: user.roles });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, fullName: user.fullName, roles: user.roles },
      accessToken
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST /api/v1/auth/wallet-login (Algorand Wallet Nonce Verification)
authRouter.post('/wallet-login', async (req: Request, res: Response) => {
  try {
    const { algorandAddress, nonce, signature } = req.body;
    if (!algorandAddress || !nonce || !signature) {
      return res.status(400).json({ error: 'algorandAddress, nonce, signature are required' });
    }

    const isValid = verifyAlgorandSignature(algorandAddress, nonce, signature);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid Algorand signature' });
    }

    const userId = `usr_algo_${algorandAddress.substring(0, 8)}`;
    const roles = [UserRole.LEARNER];

    const accessToken = generateAccessToken({ userId, email: `${algorandAddress}@algo.wallet`, roles, algorandAddress });
    const refreshToken = generateRefreshToken({ userId, email: `${algorandAddress}@algo.wallet`, roles, algorandAddress });

    return res.json({
      message: 'Algorand wallet authenticated',
      user: { id: userId, algorandAddress, roles },
      accessToken
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});
