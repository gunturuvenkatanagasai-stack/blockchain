import { hashPassword, verifyPassword, generateAccessToken, verifyAccessToken, hasRolePermission } from '@x402-digital-human/security';
import { UserRole } from '@x402-digital-human/types';

describe('Security & Auth Unit Tests (Step 8 & 42)', () => {
  test('Password Hashing & Verification', async () => {
    const rawPass = 'SecureP@ssw0rd2026!';
    const hash = await hashPassword(rawPass);
    expect(hash).not.toEqual(rawPass);
    expect(await verifyPassword(rawPass, hash)).toBe(true);
    expect(await verifyPassword('WrongPassword', hash)).toBe(false);
  });

  test('JWT Access Token Generation & Decoding', () => {
    const payload = {
      userId: 'usr_test_100',
      email: 'expert@marketplace.ai',
      roles: [UserRole.EXPERT]
    };
    const token = generateAccessToken(payload);
    expect(typeof token).toBe('string');

    const decoded = verifyAccessToken(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.roles).toContain(UserRole.EXPERT);
  });

  test('RBAC Role Permission Evaluator', () => {
    expect(hasRolePermission([UserRole.LEARNER], [UserRole.LEARNER])).toBe(true);
    expect(hasRolePermission([UserRole.LEARNER], [UserRole.EXPERT])).toBe(false);
    expect(hasRolePermission([UserRole.PLATFORM_ADMIN], [UserRole.EXPERT])).toBe(true); // Admin bypass
  });
});
