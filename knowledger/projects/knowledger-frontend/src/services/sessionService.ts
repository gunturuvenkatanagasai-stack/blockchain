import { apiService } from './api';

export interface SessionEnrollment {
  id: string;
  userWallet: string;
  digitalTwinId: string;
  transactionId: string;
  amountAlgo: number;
  durationMinutes: number;
  status: 'active' | 'expired' | 'completed';
  startedAt: string;
  expiresAt: string;
  createdAt: string;
}

class SessionService {
  private activeSessions: Map<string, SessionEnrollment> = new Map();
  private listeners: Set<() => void> = new Set();
  private timerId: any = null;

  constructor() {
    this.startCountdownTimer();
  }

  private startCountdownTimer() {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      this.checkExpirations();
      this.notifyListeners();
    }, 1000);
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  private checkExpirations() {
    const now = new Date().getTime();
    this.activeSessions.forEach((session, key) => {
      if (new Date(session.expiresAt).getTime() <= now) {
        session.status = 'expired';
      }
    });
  }

  public normalizeTwinId(id: string): string {
    return id.toLowerCase().replace(/_/g, '-');
  }

  public getActiveSession(twinId: string, walletAddress?: string | null): SessionEnrollment | null {
    if (!twinId) return null;
    const normId = this.normalizeTwinId(twinId);
    const session = this.activeSessions.get(normId);

    if (!session) return null;
    if (walletAddress && session.userWallet !== walletAddress) return null;

    const now = new Date().getTime();
    if (new Date(session.expiresAt).getTime() <= now) {
      session.status = 'expired';
      return null;
    }

    return session.status === 'active' ? session : null;
  }

  public async syncActiveSessions(walletAddress: string): Promise<SessionEnrollment[]> {
    if (!walletAddress) return [];
    try {
      const data = await apiService.getActiveSessions(walletAddress);
      const list = data.activeSessions || [];
      const now = new Date().getTime();

      list.forEach((sess: SessionRecordRaw) => {
        if (new Date(sess.expiresAt).getTime() > now) {
          const normId = this.normalizeTwinId(sess.digitalTwinId);
          this.activeSessions.set(normId, {
            id: sess.id,
            userWallet: sess.userWallet,
            digitalTwinId: sess.digitalTwinId,
            transactionId: sess.transactionId,
            amountAlgo: sess.amountAlgo || 0.5,
            durationMinutes: sess.durationMinutes || 30,
            status: 'active',
            startedAt: sess.startedAt,
            expiresAt: sess.expiresAt,
            createdAt: sess.createdAt,
          });
        }
      });

      this.notifyListeners();
      return Array.from(this.activeSessions.values());
    } catch (err) {
      console.warn('[SessionService] Sync active sessions warning:', err);
      return Array.from(this.activeSessions.values());
    }
  }

  public async enrollSession(
    digitalTwinId: string,
    walletAddress: string,
    transactionId: string,
    durationMinutes = 30,
    expectedAmountAlgo = 0.50
  ): Promise<SessionEnrollment> {
    const expectedAmountMicro = Math.round(expectedAmountAlgo * 1_000_000);
    const res = await apiService.enrollSession(
      digitalTwinId,
      walletAddress,
      transactionId,
      durationMinutes,
      expectedAmountMicro
    );

    if (!res || !res.success || !res.session) {
      throw new Error(res?.message || 'Failed to enroll session on backend.');
    }

    const session: SessionEnrollment = res.session;
    const normId = this.normalizeTwinId(digitalTwinId);
    this.activeSessions.set(normId, session);

    this.notifyListeners();
    return session;
  }

  public getRemainingSeconds(expiresAt: string): number {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    return Math.max(0, Math.floor((expiry - now) / 1000));
  }

  public formatRemainingTime(expiresAt: string): string {
    const totalSec = this.getRemainingSeconds(expiresAt);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

interface SessionRecordRaw {
  id: string;
  userWallet: string;
  digitalTwinId: string;
  transactionId: string;
  amountAlgo: number;
  durationMinutes: number;
  status: 'active' | 'expired' | 'completed';
  startedAt: string;
  expiresAt: string;
  createdAt: string;
}

export const sessionService = new SessionService();
