import React from 'react';
import { Sparkles, Cpu, Wallet, Briefcase, HeartPulse, Loader2 } from 'lucide-react';
import { WalletState } from '../services/peraWallet';

interface NavbarProps {
  currentRole: 'learner' | 'expert' | 'admin';
  setRole: (role: 'learner' | 'expert' | 'admin') => void;
  openAssistant: () => void;
  openCreatorWizard: () => void;
  openWellness: () => void;
  openCareer: () => void;
  walletState: WalletState;
  onConnectWallet: () => void;
  onOpenWalletModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setRole,
  openAssistant,
  openCreatorWizard,
  openWellness,
  openCareer,
  walletState,
  onConnectWallet,
  onOpenWalletModal,
}) => {
  const isConnected = walletState.connected && !!walletState.address;
  const isConnecting = walletState.status === 'CONNECTING';

  const shortAddress = isConnected && walletState.address
    ? `${walletState.address.substring(0, 4)}...${walletState.address.substring(walletState.address.length - 4)}`
    : null;

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '14px 28px', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Brand Logo & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #00F2FE 0%, #7B2CBF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(0,242,254,0.5)' }}>
            <Cpu size={24} color="#FFF" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em' }} className="gradient-text">KNOWLEDGER</span>
            <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 500, letterSpacing: '0.05em' }}>DIGITAL HUMAN MARKETPLACE</div>
          </div>
        </div>

        {/* Global Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

          {/* AI Assistant Quick Trigger */}
          <button
            onClick={openAssistant}
            className="gradient-button"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Sparkles size={16} />
            Human Intelligence Assistant
          </button>

          {/* Module Quick Shortcuts */}
          <button onClick={openCareer} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#F8FAFC', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
            <Briefcase size={15} color="#38BDF8" /> Career & Resume
          </button>

          <button onClick={openWellness} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#F8FAFC', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
            <HeartPulse size={15} color="#10B981" /> Wellness Reset
          </button>

          {/* Role Switcher */}
          <div style={{ background: '#1E293B', padding: '4px', borderRadius: '10px', display: 'flex', gap: '4px' }}>
            {(['learner', 'expert', 'admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{
                  background: currentRole === r ? 'linear-gradient(135deg, #00F2FE 0%, #7B2CBF 100%)' : 'transparent',
                  color: currentRole === r ? '#FFF' : '#94A3B8',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  cursor: 'pointer'
                }}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Creator Onboarding Action */}
          {currentRole === 'expert' && (
            <button onClick={openCreatorWizard} style={{ background: '#10B981', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
              + Create AI Twin
            </button>
          )}

          {/* Real Pera Wallet Interaction Button */}
          {isConnected ? (
            <button
              onClick={onOpenWalletModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                padding: '6px 14px',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '0.75rem' }}>🟢</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FBBF24', fontFamily: 'monospace' }}>
                {shortAddress}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34D399', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '8px' }}>
                {walletState.balance !== null ? `${walletState.balance.toFixed(2)} ALGO` : '0.00 ALGO'}
              </span>
            </button>
          ) : (
            <button
              onClick={onConnectWallet}
              disabled={isConnecting}
              className="gradient-button"
              style={{ padding: '8px 18px', fontSize: '0.85rem', fontWeight: 700, background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}
            >
              {isConnecting ? (
                <>
                  <Loader2 size={16} className="spin" /> Connecting Wallet...
                </>
              ) : (
                <>
                  <Wallet size={16} color="#FFF" /> Connect Pera Wallet
                </>
              )}
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
