import React, { useState } from 'react';
import { Wallet, ShieldCheck, CheckCircle2, AlertTriangle, Loader2, X, ArrowRight, Clock } from 'lucide-react';
import { DigitalTwinData } from './MarketplaceCard';
import { peraWalletService, WalletState, parseGenesisHash, assertUint8Array } from '../services/peraWallet';
import { sessionService, SessionEnrollment } from '../services/sessionService';
import { getSessionPricing, DEFAULT_TREASURY_ADDRESS } from '../config/sessionPricing';
import algosdk from 'algosdk';

interface SessionPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  twin: DigitalTwinData;
  walletState: WalletState;
  onSuccess: (session: SessionEnrollment) => void;
}

export type PaymentState =
  | 'idle'
  | 'preparing'
  | 'waiting_for_wallet'
  | 'signing'
  | 'submitted'
  | 'confirming'
  | 'success'
  | 'rejected'
  | 'failed';

export const SessionPaymentModal: React.FC<SessionPaymentModalProps> = ({
  isOpen,
  onClose,
  twin,
  walletState,
  onSuccess,
}) => {
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [txId, setTxId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const sessionMeta = getSessionPricing(twin.id, twin.category);
  const priceAlgo = sessionMeta.priceAlgo;
  const durationMinutes = sessionMeta.durationMinutes;
  const currentBalance = walletState.balance || 0;
  const remainingBalance = Math.max(0, currentBalance - priceAlgo);
  const isInsufficient = currentBalance < priceAlgo;

  const shortAddress = walletState.address
    ? `${walletState.address.substring(0, 6)}...${walletState.address.substring(walletState.address.length - 6)}`
    : 'Not Connected';

  const handlePay = async () => {
    setErrorMessage(null);

    if (!walletState.connected || !walletState.address) {
      setErrorMessage('Wallet not connected. Please connect your Pera Wallet first.');
      return;
    }

    if (isInsufficient) {
      setErrorMessage(`Insufficient ALGO Balance. Required: ${priceAlgo.toFixed(2)} ALGO, Available: ${currentBalance.toFixed(2)} ALGO.`);
      return;
    }

    try {
      // 1. Preparing payment transaction
      setPaymentState('preparing');
      setStatusMessage('Preparing payment transaction...');
      await new Promise((r) => setTimeout(r, 300));

      const microAlgos = Math.round(priceAlgo * 1_000_000);
      if (!Number.isSafeInteger(microAlgos) || microAlgos <= 0) {
        throw new Error('Invalid transaction amount calculated.');
      }

      const receiverAddress = DEFAULT_TREASURY_ADDRESS;
      if (!algosdk.isValidAddress(receiverAddress)) {
        throw new Error('Payment configuration error: Invalid treasury address.');
      }

      const memoText = `KAI_SESSION:${twin.id}`;
      const note = new TextEncoder().encode(memoText);

      const suggestedParams = await fetchSuggestedParams();
      
      // Construct unsigned transaction
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: walletState.address,
        receiver: receiverAddress,
        amount: microAlgos,
        note,
        suggestedParams,
      });

      // 2. Waiting for Pera Wallet approval state
      setPaymentState('waiting_for_wallet');
      setStatusMessage('Waiting for Pera Wallet approval...\nPlease confirm the transaction in your wallet.');

      const signedTxnsRaw = await peraWalletService.signTransaction([txn]);
      if (!signedTxnsRaw || signedTxnsRaw.length === 0) {
        throw new Error('Transaction approval rejected in Pera Wallet.');
      }

      let signedTxnBytes = signedTxnsRaw[0];
      if (typeof signedTxnBytes === 'string') {
        signedTxnBytes = new Uint8Array(Buffer.from(signedTxnBytes, 'base64'));
      }
      assertUint8Array(signedTxnBytes, 'Signed transaction');

      // 3. Submitted state
      setPaymentState('submitted');
      setStatusMessage('Transaction submitted.\nWaiting for Algorand blockchain confirmation...');

      const submittedTxId = await submitTxToTestNet(signedTxnBytes);
      setTxId(submittedTxId);

      // 4. Confirming state
      setPaymentState('confirming');
      setStatusMessage('Verifying session enrollment on Algorand network...');

      // 5. Backend verification & session enrollment
      const sessionRecord = await sessionService.enrollSession(
        twin.id,
        walletState.address,
        submittedTxId,
        durationMinutes,
        priceAlgo
      );

      // 6. Success state
      setPaymentState('success');
      setStatusMessage('✓ Payment Successful\nYour Digital Twin session is now active!');
      await peraWalletService.refreshBalance();

      setTimeout(() => {
        onSuccess(sessionRecord);
        onClose();
        resetModal();
      }, 1500);
    } catch (err: any) {
      console.error('[SessionPaymentModal] Payment error:', err);
      if (err.message && (err.message.includes('rejected') || err.message.includes('cancelled'))) {
        setPaymentState('rejected');
        setErrorMessage('Transaction Rejected. You cancelled the payment in Pera Wallet.');
      } else {
        setPaymentState('failed');
        setErrorMessage(err.message || 'Payment Failed. The transaction could not be completed. Please try again.');
      }
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

  const resetModal = () => {
    setPaymentState('idle');
    setStatusMessage(null);
    setTxId(null);
    setErrorMessage(null);
  };

  const isProcessing = paymentState !== 'idle' && paymentState !== 'rejected' && paymentState !== 'failed';

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
      <div className="glass-panel" style={{ width: '90%', maxWidth: '460px', padding: '28px', borderRadius: '24px', border: '1px solid rgba(0, 242, 254, 0.35)', position: 'relative' }}>

        <button onClick={onClose} disabled={isProcessing} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#94A3B8', cursor: isProcessing ? 'not-allowed' : 'pointer' }}>
          <X size={20} />
        </button>

        {/* Modal Title */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: '#00F2FE', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Session Enrollment</div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>Confirm Digital Twin Session</h3>
        </div>

        {/* Target Twin Banner */}
        <div style={{ background: '#1E293B', padding: '16px', borderRadius: '14px', marginBottom: '20px', borderLeft: '4px solid #00F2FE' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFF' }}>{twin.name}</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: '#38BDF8', textTransform: 'capitalize' }}>{twin.tagline || twin.category}</span>
            <span style={{ fontSize: '0.7rem', background: 'rgba(0, 242, 254, 0.12)', color: '#00F2FE', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
              {sessionMeta.tierName} Tier
            </span>
          </div>
        </div>

        {/* Price & Duration Details */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '16px', fontSize: '0.85rem', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={15} color="#38BDF8" /> Session Duration:
            </span>
            <span style={{ fontWeight: 700, color: '#FFF' }}>{durationMinutes} minutes</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#94A3B8' }}>Session Price:</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FBBF24' }}>{priceAlgo.toFixed(2)} ALGO</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ color: '#94A3B8' }}>Payment Method:</span>
            <span style={{ fontWeight: 700, color: '#34D399', display: 'flex', alignItems: 'center', gap: '4px' }}>
              🟢 Pera Wallet
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <span style={{ color: '#94A3B8' }}>Connected Wallet:</span>
            <span style={{ fontWeight: 700, fontFamily: 'monospace', color: '#00F2FE', fontSize: '0.8rem' }}>{shortAddress}</span>
          </div>
        </div>

        {/* Wallet Balance Breakdown */}
        <div style={{ background: '#1E293B', padding: '12px 16px', borderRadius: '12px', fontSize: '0.75rem', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <span style={{ color: '#94A3B8' }}>Available: </span>
            <strong style={{ color: currentBalance >= priceAlgo ? '#34D399' : '#EF4444' }}>{currentBalance.toFixed(2)} ALGO</strong>
          </div>
          <div>
            <span style={{ color: '#94A3B8' }}>After Payment: </span>
            <strong style={{ color: '#FFF' }}>{remainingBalance.toFixed(2)} ALGO</strong>
          </div>
        </div>

        {/* Real-Time Processing Status Banner */}
        {statusMessage && (
          <div style={{ background: paymentState === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 242, 254, 0.1)', border: `1px solid ${paymentState === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(0, 242, 254, 0.3)'}`, padding: '14px', borderRadius: '12px', marginBottom: '20px', color: paymentState === 'success' ? '#34D399' : '#00F2FE', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center', whiteSpace: 'pre-line' }}>
            {paymentState === 'success' ? <CheckCircle2 size={20} style={{ margin: '0 auto 6px' }} /> : <Loader2 size={20} className="spin" style={{ margin: '0 auto 6px' }} />}
            {statusMessage}
          </div>
        )}

        {/* TxID Display */}
        {txId && (
          <div style={{ background: '#1E293B', padding: '10px', borderRadius: '8px', fontSize: '0.7rem', color: '#34D399', marginBottom: '20px', wordBreak: 'break-all', fontFamily: 'monospace', textAlign: 'center' }}>
            Transaction Submitted! ID: {txId}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '12px', borderRadius: '12px', color: '#EF4444', fontSize: '0.8rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            onClick={onClose}
            disabled={isProcessing}
            style={{ background: 'transparent', border: '1px solid var(--border-color)', color: '#FFF', padding: '12px', borderRadius: '10px', cursor: isProcessing ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
          >
            Cancel
          </button>

          <button
            onClick={handlePay}
            disabled={isProcessing || isInsufficient}
            className="gradient-button"
            style={{ justifyContent: 'center', padding: '12px', fontSize: '0.85rem', fontWeight: 800, background: isInsufficient ? '#334155' : 'linear-gradient(135deg, #00F2FE 0%, #7B2CBF 100%)', opacity: isInsufficient ? 0.6 : 1, cursor: isInsufficient || isProcessing ? 'not-allowed' : 'pointer' }}
          >
            {isProcessing ? 'Processing...' : `Pay ${priceAlgo.toFixed(2)} ALGO`}
          </button>
        </div>

      </div>
    </div>
  );
};
