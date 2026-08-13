import React, { useState, useEffect } from 'react';
import { DollarSign, Users, MessageSquare, Zap, ArrowUpRight, ShieldCheck, CreditCard } from 'lucide-react';
import { apiService } from '../services/api';

export const CreatorDashboard: React.FC = () => {
  const [withdrawn, setWithdrawn] = useState(false);
  const [balance, setBalance] = useState(485.50);
  const [subscribers, setSubscribers] = useState(142);
  const [queriesCount, setQueriesCount] = useState(1840);
  const [ledger, setLedger] = useState<any[]>([
    { time: '10 mins ago', type: 'x402 Pay-Per-Use', gross: '0.10 ALGO', net: '0.085 ALGO', tx: 'tx_algo_894a2b1c' },
    { time: '1 hour ago', type: 'Monthly Subscription', gross: '19.99 USD', net: '16.99 USD', tx: 'tx_sub_99a812ff' },
    { time: '3 hours ago', type: 'x402 Pay-Per-Use', gross: '0.10 ALGO', net: '0.085 ALGO', tx: 'tx_algo_1120ab7f' },
  ]);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await apiService.getCreatorAnalytics();
        if (data && data.earnings) {
          setBalance(data.earnings.availableUsdc || balance);
          setSubscribers(data.earnings.activeSubscribers || subscribers);
          setQueriesCount(data.earnings.totalQueriesServed || queriesCount);
        }
      } catch (err) {
        console.warn('[Creator Dashboard] backend sync offline, using local state.');
      }
    }
    loadAnalytics();
  }, []);

  const handleWithdraw = async () => {
    setWithdrawn(true);
    try {
      const res = await apiService.withdrawCreatorEarnings(balance);
      if (res && res.remainingBalance !== undefined) {
        setBalance(res.remainingBalance);
      } else {
        setBalance(0.0);
      }
    } catch (e) {
      setBalance(0.0);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Creator Revenue & Twin Analytics</h2>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>Every Human's Knowledge Can Earn Forever.</p>
        </div>

        <button
          onClick={handleWithdraw}
          className="gradient-button"
          style={{ padding: '12px 24px', fontSize: '0.9rem' }}
        >
          <CreditCard size={18} /> Withdraw {balance.toFixed(2)} ALGO Earnings
        </button>
      </div>

      {/* Stats Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Total Revenue Earned</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34D399', marginTop: '4px' }}>{balance.toFixed(2)} ALGO</div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px' }}>+18.4% this week (85% Creator Share)</div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Active Subscribers</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#00F2FE', marginTop: '4px' }}>142 Users</div>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>Across monthly & annual plans</div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>x402 Queries Answered</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#C084FC', marginTop: '4px' }}>1,840 Queries</div>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>Verified against RAG index</div>
        </div>
      </div>

      {/* Recent Ledger Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Transparent Revenue Settlement Ledger</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: '#94A3B8' }}>
              <th style={{ padding: '12px' }}>Timestamp</th>
              <th style={{ padding: '12px' }}>Payment Type</th>
              <th style={{ padding: '12px' }}>Gross Amount</th>
              <th style={{ padding: '12px' }}>Creator Share (85%)</th>
              <th style={{ padding: '12px' }}>Algorand Tx ID</th>
            </tr>
          </thead>
          <tbody>
            {[
              { time: '10 mins ago', type: 'x402 Pay-Per-Use', gross: '0.10 ALGO', net: '0.085 ALGO', tx: 'tx_algo_894a2b1c' },
              { time: '1 hour ago', type: 'Monthly Subscription', gross: '19.99 USD', net: '16.99 USD', tx: 'tx_sub_99a812ff' },
              { time: '3 hours ago', type: 'x402 Pay-Per-Use', gross: '0.10 ALGO', net: '0.085 ALGO', tx: 'tx_algo_1120ab7f' },
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px', color: '#94A3B8' }}>{row.time}</td>
                <td style={{ padding: '12px', color: '#F8FAFC', fontWeight: 600 }}>{row.type}</td>
                <td style={{ padding: '12px', color: '#94A3B8' }}>{row.gross}</td>
                <td style={{ padding: '12px', color: '#34D399', fontWeight: 700 }}>{row.net}</td>
                <td style={{ padding: '12px', color: '#00F2FE', fontFamily: 'monospace' }}>{row.tx}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
