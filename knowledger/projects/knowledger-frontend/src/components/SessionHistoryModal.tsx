import React, { useState, useEffect } from 'react';
import { History, ExternalLink, ShieldCheck, X, Clock, Calendar } from 'lucide-react';
import { apiService } from '../services/api';
import { SessionEnrollment } from '../services/sessionService';

interface SessionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string | null;
}

export const SessionHistoryModal: React.FC<SessionHistoryModalProps> = ({
  isOpen,
  onClose,
  walletAddress,
}) => {
  const [history, setHistory] = useState<SessionEnrollment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && walletAddress) {
      loadSessionHistory();
    }
  }, [isOpen, walletAddress]);

  const loadSessionHistory = async () => {
    if (!walletAddress) return;
    setLoading(true);
    try {
      const data = await apiService.getSessionHistory(walletAddress);
      setHistory(data.history || []);
    } catch (err) {
      console.warn('[SessionHistoryModal] Failed to load session history:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
      <div className="glass-panel" style={{ width: '90%', maxWidth: '580px', padding: '28px', borderRadius: '24px', border: '1px solid rgba(0, 242, 254, 0.3)', position: 'relative' }}>

        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #00F2FE 0%, #7B2CBF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <History size={22} color="#FFF" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>Digital Twin Session History</h3>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Verified Paid Enrollments on Algorand TestNet</p>
          </div>
        </div>

        {/* List of Sessions */}
        {loading ? (
          <div style={{ padding: '36px', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>Loading session history...</div>
        ) : history.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>No paid Digital Twin sessions found for this wallet.</div>
        ) : (
          <div style={{ maxHeight: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {history.map((sess) => {
              const formattedDate = new Date(sess.startedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={sess.id} style={{ background: '#1E293B', padding: '16px', borderRadius: '14px', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#FFF', fontSize: '0.95rem' }}>{sess.digitalTwinId.replace(/-/g, ' ').toUpperCase()}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <Calendar size={12} /> {formattedDate}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#00F2FE', fontFamily: 'monospace', marginTop: '4px' }}>
                      TXID: {sess.transactionId ? `${sess.transactionId.substring(0, 14)}...` : 'N/A'}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: '#FBBF24', fontSize: '1rem' }}>{sess.amountAlgo.toFixed(2)} ALGO</div>
                    <span style={{ fontSize: '0.7rem', background: sess.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.15)', color: sess.status === 'active' ? '#34D399' : '#94A3B8', padding: '2px 8px', borderRadius: '10px', fontWeight: 700, display: 'inline-block', marginTop: '4px' }}>
                      {sess.status === 'active' ? '● Active' : 'Expired'}
                    </span>
                    <a
                      href={`https://lora.algokit.io/testnet/tx/${sess.transactionId}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#38BDF8', fontSize: '0.7rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end', marginTop: '6px' }}
                    >
                      View on Algorand Explorer <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={onClose}
          style={{ width: '100%', marginTop: '20px', background: 'transparent', border: '1px solid var(--border-color)', color: '#FFF', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
        >
          Close History
        </button>

      </div>
    </div>
  );
};
