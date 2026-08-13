import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import algosdk from 'algosdk';
import { UserRole } from '@x402-digital-human/types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_development_secret_32_bytes_min';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret_32_bytes_min';

export interface JwtPayload {
  userId: string;
  email: string;
  roles: UserRole[];
  algorandAddress?: string;
}

// 1. Password Security
export async function hashPassword(password: string): Promise<string> {
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// 2. JWT Authentication Tokens
export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}

// 3. Algorand Wallet Ed25519 Signature Verification
export function verifyAlgorandSignature(
  algorandAddress: string,
  nonceMessage: string,
  base64Signature: string
): boolean {
  try {
    const enc = new TextEncoder();
    const messageBytes = enc.encode(nonceMessage);
    const signatureBytes = Uint8Array.from(Buffer.from(base64Signature, 'base64'));
    
    // Validate Algorand public key from address
    const decodedAddress = algosdk.decodeAddress(algorandAddress);
    return algosdk.verifyBytes(messageBytes, signatureBytes, decodedAddress.publicKey);
  } catch (error) {
    return false;
  }
}

// 4. Role-Based Access Control (RBAC) Evaluator
export function hasRolePermission(userRoles: UserRole[], requiredRoles: UserRole[]): boolean {
  if (userRoles.includes(UserRole.SUPER_ADMIN) || userRoles.includes(UserRole.PLATFORM_ADMIN)) {
    return true; // Admins bypass role checks
  }
  return requiredRoles.some((role) => userRoles.includes(role));
}

// 5. Input Sanitization against XSS & Injection
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return input;
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
