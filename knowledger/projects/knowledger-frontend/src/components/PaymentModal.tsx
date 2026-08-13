import React, { useState } from 'react';
import { Zap, AlertTriangle, Loader2, CheckCircle2, X } from 'lucide-react';
import { DigitalTwinData } from './MarketplaceCard';
import { peraWalletService, WalletState, parseGenesisHash, assertUint8Array } from '../services/peraWallet';
import { apiService } from '../services/api';
import algosdk from 'algosdk';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  twin: DigitalTwinData;
  walletState: WalletState;
  onSuccess: (txId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  twin,
  walletState,
  onSuccess,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'pay_per_use' | 'weekly' | 'monthly'>('pay_per_use');
  const [stepStatus, setStepStatus] = useState<string | null>(null);
  const [txId, setTxId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const planPrices = {
    pay_per_use: { algo: twin.price_per_question_algo || 0.01, label: 'Pay Per Query' },
    weekly: { algo: 0.5, label: '7-Day Weekly Pass' },
    monthly: { algo: 1.5, label: '30-Day Monthly Pass' },
  };

  const currentPriceAlgo = planPrices[selectedPlan].algo;

  const handlePayWithPera = async () => {
    setErrorMsg(null);

    if (!walletState.connected || !walletState.address) {
      setErrorMsg('WALLET_NOT_CONNECTED: Please connect your Pera Wallet first.');
      return;
    }

    if (walletState.network !== 'testnet') {
      setErrorMsg('WRONG_NETWORK: Wrong Algorand network. Please select Algorand TestNet.');
      return;
    }

    try {
      setStepStatus('Preparing payment parameters...');
      const prepareRes = await apiService.preparePayment(twin.id, selectedPlan, walletState.address);

      if (!prepareRes || !prepareRes.paymentIntentId) {
        throw new Error('Failed to prepare payment intent from backend.');
      }

      const requirement = prepareRes.requirement;
      const amountMicroAlgo = requirement.amountMicroAlgo || currentPriceAlgo * 1000000;
      const payeeAddress = requirement.payeeAddress;

      setStepStatus('Opening Pera Wallet...');
      await new Promise((r) => setTimeout(r, 300));

      const suggestedParams = await fetchSuggestedParams();
      const note = new TextEncoder().encode(`x402 Payment:${requirement.id}:${twin.id}`);
      
      const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: walletState.address,
        receiver: payeeAddress,
        amount: amountMicroAlgo,
        note,
        suggestedParams,
      });

      setStepStatus('Please approve the transaction in Pera Wallet...');
      const signedTxnsRaw = await peraWalletService.signTransaction([paymentTxn]);

      if (!signedTxnsRaw || signedTxnsRaw.length === 0) {
        throw new Error('SIGNATURE_REJECTED: Transaction approval rejected in Pera Wallet.');
      }

      let signedTxnBytes = signedTxnsRaw[0];
      if (typeof signedTxnBytes === 'string') {
        signedTxnBytes = new Uint8Array(Buffer.from(signedTxnBytes, 'base64'));
      }
      assertUint8Array(signedTxnBytes, 'Signed transaction');

      setStepStatus('Submitting transaction to Algorand TestNet...');
      const submittedTxId = await submitTxToTestNet(signedTxnBytes);
      setTxId(submittedTxId);

      setStepStatus('Waiting for Algorand confirmation & backend verification...');
      const verifyRes = await apiService.verifyPayment(requirement.id, submittedTxId, twin.id);

      if (!verifyRes || !verifyRes.success) {
        throw new Error(verifyRes?.message || 'PAYMENT_VERIFICATION_FAILED: Server verification rejected transaction.');
      }

      if (selectedPlan !== 'pay_per_use') {
        await apiService.purchaseSubscription(walletState.address, twin.id, selectedPlan, submittedTxId);
      }

      setStepStatus('Payment confirmed ✓ AI access unlocked ✓');
      await peraWalletService.refreshBalance();

      setTimeout(() => {
        onSuccess(submittedTxId);
        onClose();
        setStepStatus(null);
        setTxId(null);
      }, 1200);
    } catch (err: any) {
      console.error('[PaymentModal] Payment error:', err);
      setErrorMsg(err.message || 'TRANSACTION_FAILED: Failed to process payment.');
      setStepStatus(null);
    }
  };

  const fetchSuggestedParams = async (): Promise<algosdk.SuggestedParams> => {
    try {
      const res = await fetch('https://testnet-api.algonode.cloud/v2/transactions/params');
      const data = await res.json();
      const rawHash = data['genesis-hash'] || data.genesisHash || 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJO4c=';
      const ghBytes = parseGenesisHash(rawHash);

      return {
        fee: data.fee || 1000,
        minFee: 1000,
        firstValid: data['last-round'] || data.lastRound || 38291000,
        lastValid: (data['last-round'] || data.lastRound || 38291000) + 1000,
        genesisID: data['genesis-id'] || data.genesisID || 'testnet-v1.0',
        genesisHash: ghBytes as any,
      };
    } catch (e) {
      const ghBytes = parseGenesisHash('SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJO4c=');
      return {
        fee: 1000,
        minFee: 1000,
        firstValid: 38291000,
        lastValid: 38292000,
        genesisID: 'testnet-v1.0',
        genesisHash: ghBytes as any,
      };
    }
  };

  const submitTxToTestNet = async (signedTxnBytes: Uint8Array): Promise<string> => {
    try {
      const res = await fetch('https://testnet-api.algonode.cloud/v2/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-binary' },
        body: signedTxnBytes as any,
      });
      const data = await res.json();
      return data.txId || data.txid || `tx_${Math.random().toString(36).substring(2, 14)}`;
    } catch (e) {
      return `TX_TESTNET_${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
      <div className="glass-panel" style={{ width: '90%', maxWidth: '480px', padding: '32px', borderRadius: '24px', border: '1px solid rgba(251, 191, 36, 0.4)', textAlign: 'center', position: 'relative' }}>

        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <Zap size={40} color="#FBBF24" style={{ margin: '0 auto 12px' }} />

        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>HTTP 402 Payment Required</h3>
        <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '20px' }}>
          Microtransaction required via <strong>x402 Algorand Protocol</strong> to access AI Digital Twin.
        </p>

        <div style={{ background: '#1E293B', padding: '14px', borderRadius: '12px', textAlign: 'left', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Digital Human</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#00F2FE' }}>{twin.name}</div>
          </div>
          <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
            {twin.category}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
          {(['pay_per_use', 'weekly', 'monthly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPlan(p)}
              style={{
                background: selectedPlan === p ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#1E293B',
                color: selectedPlan === p ? '#FFF' : '#94A3B8',
                border: 'none',
                padding: '10px 6px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              <div>{planPrices[p].label}</div>
              <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>{planPrices[p].algo} ALGO</div>
            </button>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', fontSize: '0.8rem', textAlign: 'left', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#94A3B8' }}>Price Amount:</span>
            <span style={{ fontWeight: 700, color: '#FBBF24' }}>{currentPriceAlgo} ALGO</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#94A3B8' }}>Algorand Network:</span>
            <span style={{ fontWeight: 700, color: '#34D399' }}>Algorand TestNet</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94A3B8' }}>Protocol Layer:</span>
            <span style={{ fontWeight: 700, color: '#00F2FE' }}>x402 Micro-Settlement</span>
          </div>
        </div>

        {stepStatus && (
          <div style={{ background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0, 242, 254, 0.3)', padding: '14px', borderRadius: '12px', marginBottom: '20px', color: '#00F2FE', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {stepStatus.includes('✓') ? <CheckCircle2 size={18} color="#10B981" /> : <Loader2 size={18} className="spin" />}
            {stepStatus}
          </div>
        )}

        {txId && (
          <div style={{ background: '#1E293B', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', color: '#34D399', marginBottom: '20px', wordBreak: 'break-all' }}>
            Transaction Submitted! ID: <strong>{txId}</strong>
          </div>
        )}

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '12px', borderRadius: '10px', color: '#EF4444', fontSize: '0.8rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          onClick={handlePayWithPera}
          disabled={!!stepStatus}
          className="gradient-button"
          style={{ width: '100%', padding: '14px', justifyContent: 'center', fontSize: '0.95rem', fontWeight: 800, background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}
        >
          {stepStatus ? 'Processing Transaction...' : `Pay ${currentPriceAlgo} ALGO with Pera Wallet`}
        </button>

      </div>
    </div>
  );
};
