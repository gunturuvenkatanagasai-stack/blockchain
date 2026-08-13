import React, { useState, useEffect } from 'react';
import { Wallet, Copy, RefreshCw, ExternalLink, History, LogOut, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { peraWalletService, WalletState } from '../services/peraWallet';
import { apiService } from '../services/api';

interface ConnectedWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletState: WalletState;
}

export const ConnectedWalletModal: React.FC<ConnectedWalletModalProps> = ({
  isOpen,
  onClose,
  walletState,
}) => {
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (isOpen && walletState.address && activeTab === 'history') {
      loadHistory();
    }
  }, [isOpen, activeTab, walletState.address]);

  const loadHistory = async () => {
    if (!walletState.address) return;
    setLoadingHistory(true);
    try {
      const data = await apiService.getWalletTransactions(walletState.address);
      setTransactions(data.transactions || []);
    } catch (e) {
      console.warn('[ConnectedWalletModal] Failed to load transaction history:', e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleCopyAddress = () => {
    if (walletState.address) {
      navigator.clipboard.writeText(walletState.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefreshBalance = async () => {
    setIsRefreshing(true);
    try {
      await peraWalletService.refreshBalance();
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDisconnect = async () => {
    await peraWalletService.disconnect();
    onClose();
  };

  if (!isOpen) return null;

  const shortAddress = walletState.address
    ? `${walletState.address.substring(0, 6)}...${walletState.address.substring(walletState.address.length - 6)}`
    : 'Not Connected';

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
      <div className="glass-panel" style={{ width: '90%', maxWidth: '540px', padding: '28px', borderRadius: '20px', border: '1px solid rgba(0, 242, 254, 0.3)', position: 'relative' }}>

        {/* Close Icon */}
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={26} color="#FFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>Pera Wallet</h3>
              <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34D399', padding: '2px 8px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                🟢 Connected
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Verified Algorand Account Integration</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          <button
            onClick={() => setActiveTab('details')}
            style={{ background: activeTab === 'details' ? 'rgba(0, 242, 254, 0.15)' : 'transparent', color: activeTab === 'details' ? '#00F2FE' : '#94A3B8', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Wallet Details
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{ background: activeTab === 'history' ? 'rgba(0, 242, 254, 0.15)' : 'transparent', color: activeTab === 'history' ? '#00F2FE' : '#94A3B8', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <History size={16} /> Transaction History
          </button>
        </div>

        {activeTab === 'details' ? (
          <div>
            {/* Information Grid */}
            <div style={{ background: '#1E293B', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Public Address</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'monospace', color: '#00F2FE' }}>{shortAddress}</span>
                  <button
                    onClick={handleCopyAddress}
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-color)', color: '#FFF', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {copied ? <CheckCircle2 size={14} color="#10B981" /> : <Copy size={14} />}
                    {copied ? 'Address Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Network</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FBBF24', marginTop: '2px' }}>Algorand TestNet</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Real Balance</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#34D399', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {walletState.balance !== null ? `${walletState.balance.toFixed(3)} ALGO` : 'Loading...'}
                    <button onClick={handleRefreshBalance} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                      <RefreshCw size={14} className={isRefreshing ? 'spin' : ''} />
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Ownership Nonce Status</span>
                <span style={{ fontSize: '0.75rem', color: walletState.verified ? '#10B981' : '#FBBF24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} /> {walletState.verified ? 'Verified (verified = true)' : 'Pending Verification'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <a
                href={`https://lora.algokit.io/testnet/account/${walletState.address}/`}
                target="_blank"
                rel="noreferrer"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: '#FFF', padding: '12px', borderRadius: '10px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}
              >
                Explorer <ExternalLink size={14} />
              </a>

              <button
                onClick={handleDisconnect}
                style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', padding: '12px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700 }}
              >
                <LogOut size={16} /> Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Transaction History view */}
            {loadingHistory ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#94A3B8' }}>Loading blockchain transaction history...</div>
            ) : transactions.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#94A3B8' }}>No recorded transactions found on Algorand TestNet.</div>
            ) : (
              <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {transactions.map((tx, idx) => (
                  <div key={idx} style={{ background: '#1E293B', padding: '12px 16px', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#00F2FE', fontFamily: 'monospace' }}>
                        {tx.txId ? `${tx.txId.substring(0, 12)}...` : 'Tx Pending'}
                      </div>
                      <div style={{ color: '#94A3B8', fontSize: '0.7rem' }}>
                        {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: '#34D399' }}>{tx.algoAmount} ALGO</div>
                      <a
                        href={`https://lora.algokit.io/testnet/tx/${tx.txId}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#38BDF8', fontSize: '0.7rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end' }}
                      >
                        View <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setActiveTab('details')}
              style={{ width: '100%', marginTop: '16px', background: 'transparent', border: '1px solid var(--border-color)', color: '#FFF', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Back to Details
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
