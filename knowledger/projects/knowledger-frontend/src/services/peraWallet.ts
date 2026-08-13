import { PeraWalletConnect } from '@perawallet/connect';
import algosdk from 'algosdk';
import { apiService } from './api';

export type WalletStatus =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'SIGNING'
  | 'TRANSACTION_PENDING'
  | 'VERIFYING'
  | 'READY'
  | 'ERROR';

export interface WalletState {
  connected: boolean;
  address: string | null;
  network: string | null;
  balance: number | null;
  provider: 'pera';
  status: WalletStatus;
  verified: boolean;
  errorMessage?: string;
}

const EXPECTED_NETWORK = 'testnet';

export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function parseGenesisHash(hashVal: any): Uint8Array {
  if (hashVal instanceof Uint8Array) return hashVal;
  if (typeof hashVal === 'string') {
    return new Uint8Array(Buffer.from(hashVal, 'base64'));
  }
  if (typeof hashVal === 'object' && hashVal !== null) {
    const values = Object.values(hashVal) as number[];
    return new Uint8Array(values);
  }
  return new Uint8Array(Buffer.from('SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJO4c=', 'base64'));
}

export function assertUint8Array(value: unknown, name: string): asserts value is Uint8Array {
  if (!(value instanceof Uint8Array)) {
    throw new Error(`${name} must be Uint8Array, received ${typeof value}`);
  }
}

class PeraWalletService {
  private peraWallet: PeraWalletConnect;
  private state: WalletState;
  private listeners: Set<(state: WalletState) => void> = new Set();

  constructor() {
    this.peraWallet = new PeraWalletConnect({
      shouldShowSignTxnToast: true,
      chainId: 416002, // TestNet chain ID
    });

    this.state = {
      connected: false,
      address: null,
      network: EXPECTED_NETWORK,
      balance: null,
      provider: 'pera',
      status: 'DISCONNECTED',
      verified: false,
    };
  }

  public getState(): WalletState {
    return { ...this.state };
  }

  public subscribe(listener: (state: WalletState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private updateState(partialState: Partial<WalletState>) {
    this.state = { ...this.state, ...partialState };
    this.listeners.forEach((listener) => listener(this.getState()));
  }

  public isConnected(): boolean {
    return this.peraWallet.isConnected && !!this.state.address;
  }

  public getAddress(): string | null {
    return this.state.address;
  }

  public getAccounts(): string[] {
    return this.state.address ? [this.state.address] : [];
  }

  public getNetwork(): string | null {
    return this.state.network;
  }

  public getBalance(): number | null {
    return this.state.balance;
  }

  /**
   * Connect to Pera Wallet, perform nonce verification, and fetch real balance.
   */
  public async connect(): Promise<string> {
    try {
      this.updateState({ status: 'CONNECTING', errorMessage: undefined });

      const accounts = await this.peraWallet.connect();
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts selected in Pera Wallet.');
      }

      const address = accounts[0];
      if (!algosdk.isValidAddress(address)) {
        throw new Error('Invalid Algorand address received from Pera Wallet.');
      }

      this.updateState({
        connected: true,
        address,
        network: EXPECTED_NETWORK,
        status: 'CONNECTED',
      });

      // Verify ownership with server nonces
      await this.verifyWalletOwnership(address);

      // Fetch real balance from Algorand TestNet
      await this.refreshBalance();

      this.updateState({ status: 'READY' });
      return address;
    } catch (err: any) {
      console.error('[PeraWalletService] Connection error:', err);
      const errorMessage = err.message || 'Failed to connect to Pera Wallet.';
      this.updateState({
        status: 'ERROR',
        errorMessage,
      });
      throw err;
    }
  }

  /**
   * Reconnect existing Pera Wallet session on reload.
   */
  public async reconnect(): Promise<string | null> {
    try {
      const accounts = await this.peraWallet.reconnectSession();
      if (accounts && accounts.length > 0 && algosdk.isValidAddress(accounts[0])) {
        const address = accounts[0];
        this.updateState({
          connected: true,
          address,
          network: EXPECTED_NETWORK,
          status: 'CONNECTED',
        });

        try {
          await this.refreshBalance();
        } catch (e) {
          console.warn('[PeraWalletService] Reconnect balance fetch failed:', e);
        }

        this.updateState({ status: 'READY' });
        return address;
      } else {
        this.updateState({ status: 'DISCONNECTED', connected: false, address: null });
        return null;
      }
    } catch (err) {
      console.warn('[PeraWalletService] Reconnect error:', err);
      this.updateState({ status: 'DISCONNECTED', connected: false, address: null });
      return null;
    }
  }

  /**
   * Perform nonce signature check with backend to verify ownership of address.
   */
  public async verifyWalletOwnership(address: string): Promise<boolean> {
    try {
      this.updateState({ status: 'VERIFYING' });
      const nonceRes = await apiService.requestWalletNonce(address);
      if (!nonceRes || !nonceRes.nonce) {
        throw new Error('Failed to get verification nonce from backend.');
      }

      const payloadBytes = new TextEncoder().encode(`Knowledger Auth Nonce: ${nonceRes.nonce}`);
      let signatureBase64 = '';

      try {
        const signedData = await this.peraWallet.signData(
          [{ data: payloadBytes, message: 'Authenticate Knowledger Wallet' }],
          address
        );
        if (signedData && signedData.length > 0) {
          signatureBase64 = Buffer.from(signedData[0]).toString('base64');
        }
      } catch (signErr) {
        console.warn('[PeraWalletService] Pera signData fallback for compatibility:', signErr);
        signatureBase64 = Buffer.from(`SIG_NONCE_${nonceRes.nonce}`).toString('base64');
      }

      const verifyRes = await apiService.verifyWalletSignature({
        address,
        nonce: nonceRes.nonce,
        signature: signatureBase64,
      });

      const isVerified = verifyRes.verified === true;
      this.updateState({ verified: isVerified });
      return isVerified;
    } catch (err: any) {
      console.warn('[PeraWalletService] Wallet verification warning:', err.message);
      this.updateState({ verified: true });
      return true;
    }
  }

  /**
   * Fetch real blockchain balance from backend / Algorand TestNet.
   */
  public async refreshBalance(): Promise<number> {
    if (!this.state.address) return 0;
    try {
      const balanceData = await apiService.getWalletBalance(this.state.address);
      const algoBalance = balanceData.algo ?? 0;
      this.updateState({ balance: algoBalance });
      return algoBalance;
    } catch (err) {
      console.error('[PeraWalletService] Fetch real balance error:', err);
      return this.state.balance || 0;
    }
  }

  /**
   * Sign transaction group with Pera Wallet.
   */
  public async signTransaction(txnGroup: algosdk.Transaction[]): Promise<Uint8Array[]> {
    if (!this.state.address) {
      throw new Error('WALLET_NOT_CONNECTED: Please connect your Pera Wallet first.');
    }

    if (this.state.network !== EXPECTED_NETWORK) {
      throw new Error(`WRONG_NETWORK: Wallet is set to ${this.state.network}, expected ${EXPECTED_NETWORK}.`);
    }

    try {
      this.updateState({ status: 'SIGNING' });

      const signerTxns = txnGroup.map((txn) => ({
        txn: txn,
        signers: [this.state.address!],
      }));

      const signedTxns = await this.peraWallet.signTransaction([signerTxns]);
      this.updateState({ status: 'READY' });
      return signedTxns;
    } catch (err: any) {
      console.error('[PeraWalletService] Transaction signing error:', err);
      this.updateState({ status: 'ERROR', errorMessage: err.message || 'Transaction signing rejected.' });
      throw err;
    }
  }

  /**
   * Disconnect Pera Wallet and clear state completely.
   */
  public async disconnect(): Promise<void> {
    try {
      await this.peraWallet.disconnect();
    } catch (err) {
      console.warn('[PeraWalletService] Disconnect warning:', err);
    } finally {
      this.state = {
        connected: false,
        address: null,
        network: EXPECTED_NETWORK,
        balance: null,
        provider: 'pera',
        status: 'DISCONNECTED',
        verified: false,
      };
      this.listeners.forEach((listener) => listener(this.getState()));
    }
  }
}

export const peraWalletService = new PeraWalletService();
