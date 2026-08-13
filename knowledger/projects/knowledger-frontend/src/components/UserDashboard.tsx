import React, { useState, useEffect } from 'react';
import { History, Clock, Zap, ShieldCheck } from 'lucide-react';
import { DigitalTwinData } from './MarketplaceCard';
import { WalletState } from '../services/peraWallet';
import { sessionService, SessionEnrollment } from '../services/sessionService';
import { SessionPaymentModal } from './SessionPaymentModal';
import { SessionHistoryModal } from './SessionHistoryModal';

interface UserDashProps {
  twins: DigitalTwinData[];
  onSelectChat: (twin: DigitalTwinData, mode: string) => void;
  walletState: WalletState;
  onConnectWallet: () => void;
}

export const UserDashboard: React.FC<UserDashProps> = ({
  twins,
  onSelectChat,
  walletState,
  onConnectWallet,
}) => {
  const [selectedTwinForPayment, setSelectedTwinForPayment] = useState<DigitalTwinData | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    // Subscribe to sessionService timer ticks (every 1 second)
    const unsubscribe = sessionService.subscribe(() => {
      setTick((prev) => prev + 1);
    });

    if (walletState.connected && walletState.address) {
      sessionService.syncActiveSessions(walletState.address);
    }

    return () => unsubscribe();
  }, [walletState.connected, walletState.address]);

  const handleContinueSessionClick = (twin: DigitalTwinData) => {
    // Check if user has an existing active session
    const activeSession = sessionService.getActiveSession(twin.id, walletState.address);

    if (activeSession) {
      // Re-open active session immediately WITHOUT asking for payment
      onSelectChat(twin, 'teacher');
      return;
    }

    // Check wallet connection
    if (!walletState.connected || !walletState.address) {
      onConnectWallet();
      return;
    }

    // Open payment confirmation modal
    setSelectedTwinForPayment(twin);
  };

  const handlePaymentSuccess = (session: SessionEnrollment) => {
    if (selectedTwinForPayment) {
      const targetTwin = selectedTwinForPayment;
      setSelectedTwinForPayment(null);
      onSelectChat(targetTwin, 'teacher');
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>

      {/* Top Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '4px' }}>Learner Intelligence Dashboard</h2>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>Track active Digital Twin sessions, daily learning streaks, and skill milestones.</p>
        </div>

        <button
          onClick={() => setShowHistoryModal(true)}
          style={{ background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0, 242, 254, 0.3)', color: '#00F2FE', padding: '8px 16px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <History size={16} /> View Session History
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Registered Digital Twins</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#00F2FE', marginTop: '4px' }}>{twins.length} Twins</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Learning Streak</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FBBF24', marginTop: '4px' }}>14 Days 🔥</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Queries Executed</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#C084FC', marginTop: '4px' }}>128 Queries</div>
        </div>
      </div>

      {/* My Active Digital Twins (16) Grid */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>My Active Digital Twins ({twins.length})</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {twins.map((t) => {
          const activeSession = sessionService.getActiveSession(t.id, walletState.address);
          const isActive = !!activeSession;
          const remainingText = activeSession ? sessionService.formatRemainingTime(activeSession.expiresAt) : null;

          return (
            <div
              key={t.id}
              className="glass-panel"
              style={{
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: isActive ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid var(--border-color)',
                boxShadow: isActive ? '0 0 16px rgba(16, 185, 129, 0.15)' : 'none',
                position: 'relative',
              }}
            >
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>{t.name}</h4>
                <p style={{ fontSize: '0.75rem', color: '#38BDF8', margin: '2px 0 6px' }}>{t.category}</p>

                {/* Active Animated Badge & Countdown */}
                {isActive && (
                  <div style={{ fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34D399', padding: '2px 8px', borderRadius: '10px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.6rem' }}>●</span> SESSION ACTIVE ({remainingText} remaining)
                  </div>
                )}
              </div>

              <button
                onClick={() => handleContinueSessionClick(t)}
                className="gradient-button"
                style={{
                  padding: '8px 14px',
                  fontSize: '0.8rem',
                  background: isActive ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : undefined,
                }}
              >
                Continue Session
              </button>
            </div>
          );
        })}
      </div>

      {/* Session Payment Modal */}
      {selectedTwinForPayment && (
        <SessionPaymentModal
          isOpen={!!selectedTwinForPayment}
          onClose={() => setSelectedTwinForPayment(null)}
          twin={selectedTwinForPayment}
          walletState={walletState}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Session History Modal */}
      <SessionHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        walletAddress={walletState.address}
      />

    </div>
  );
};
