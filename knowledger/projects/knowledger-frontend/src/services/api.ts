const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface DigitalTwin {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  pillar?: string;
  languages: string[];
  supported_modes: string[];
  price_per_question_algo: number;
  monthly_subscription_usd: number;
  rating: number;
  total_interactions: number;
  expert_name: string;
  verification_status: string;
}

export interface ChatMessageRequest {
  digital_twin_id: string;
  message: string;
  mode?: string;
  x402_proof?: string;
}

export interface Citation {
  source_title: string;
  chunk_index: number;
  content_snippet: string;
  confidence: number;
}

export interface ChatMessageResponse {
  id: string;
  sender: 'assistant' | 'user' | 'system';
  content: string;
  mode?: string;
  citations?: Citation[];
  x402_required?: boolean;
  x402_challenge?: any;
}

export const apiService = {
  // --- SESSION ENROLLMENT ENDPOINTS (Prompt Requirements 1, 11, 13, 18, 27) ---
  async enrollSession(digitalTwinId: string, walletAddress: string, transactionId: string, durationMinutes = 30, expectedAmountMicro = 500000): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/sessions/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ digitalTwinId, walletAddress, transactionId, durationMinutes, expectedAmountMicro }),
    });
    return res.json();
  },

  async getActiveSessions(walletAddress: string): Promise<{ walletAddress: string; activeSessions: any[] }> {
    const res = await fetch(`${API_BASE_URL}/sessions/active?walletAddress=${encodeURIComponent(walletAddress)}`);
    return res.json();
  },

  async getSessionHistory(walletAddress: string): Promise<{ walletAddress: string; history: any[] }> {
    const res = await fetch(`${API_BASE_URL}/sessions/history?walletAddress=${encodeURIComponent(walletAddress)}`);
    return res.json();
  },

  async validateSessionAccess(sessionId: string, walletAddress?: string): Promise<{ valid: boolean; session?: any; error?: string }> {
    const res = await fetch(`${API_BASE_URL}/sessions/${encodeURIComponent(sessionId)}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress }),
    });
    return res.json();
  },

  // --- WALLET ENDPOINTS (Phases 7, 8, 9, 23, 31) ---
  async requestWalletNonce(address: string): Promise<{ address: string; nonce: string; expiresAt: string }> {
    const res = await fetch(`${API_BASE_URL}/wallet/nonce`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    });
    return res.json();
  },

  async verifyWalletSignature(payload: { address: string; nonce: string; signature: string }): Promise<{ address: string; verified: boolean; message: string }> {
    const res = await fetch(`${API_BASE_URL}/wallet/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getWalletBalance(address: string): Promise<{ address: string; network: string; algo: number; microAlgo: number }> {
    const res = await fetch(`${API_BASE_URL}/wallet/balance?address=${encodeURIComponent(address)}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch balance: status ${res.status}`);
    }
    return res.json();
  },

  async getWalletTransactions(address: string): Promise<{ address: string; transactions: any[] }> {
    const res = await fetch(`${API_BASE_URL}/wallet/transactions?address=${encodeURIComponent(address)}`);
    return res.json();
  },

  async disconnectWallet(address: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/wallet/disconnect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    });
    return res.json();
  },

  // --- PAYMENT ENDPOINTS (Phases 15, 17, 18, 31) ---
  async preparePayment(digitalHumanId: string, plan: 'pay_per_use' | 'weekly' | 'monthly' = 'pay_per_use', senderAddress?: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/payments/prepare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ digitalHumanId, plan, senderAddress }),
    });
    return res.json();
  },

  async verifyPayment(paymentIntentId: string, txId: string, digitalHumanId?: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentIntentId, txId, digitalHumanId }),
    });
    return res.json();
  },

  // --- SUBSCRIPTIONS ENDPOINTS (Phases 21, 22, 31) ---
  async getUserSubscriptions(address: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/subscriptions/me?address=${encodeURIComponent(address)}`);
    return res.json();
  },

  async purchaseSubscription(walletAddress: string, digitalHumanId: string, plan: 'weekly' | 'monthly', txId: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/subscriptions/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress, digitalHumanId, plan, txId }),
    });
    return res.json();
  },

  // 1. Digital Humans / Marketplace
  async getDigitalHumans(): Promise<DigitalTwin[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/digital-humans`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const list = data.digitalHumans || data.digitalTwins || [];
      return list.map((item: any) => ({
        id: item.id,
        name: item.name,
        tagline: item.tagline || item.description?.substring(0, 60) || 'AI Digital Twin',
        description: item.description || '',
        category: item.category || 'tech',
        pillar: item.pillar || 'practical',
        languages: item.languages || ['English'],
        supported_modes: item.supported_modes || ['teacher', 'mentor', 'interviewer', 'coach', 'practice', 'reviewer', 'voice', 'study'],
        price_per_question_algo: item.price_per_question_algo || (item.pricing?.priceMicro ? item.pricing.priceMicro / 1000000 : 0.01),
        monthly_subscription_usd: item.monthly_subscription_usd || 19.99,
        rating: item.rating || 5.0,
        total_interactions: item.total_interactions || 120,
        expert_name: item.expert_name || item.name,
        verification_status: item.verification_status || 'verified'
      }));
    } catch (err) {
      console.warn('[API Client] getDigitalHumans fallback:', err);
      return [];
    }
  },

  // 2. Chat / Inference
  async sendChatMessage(payload: ChatMessageRequest): Promise<ChatMessageResponse> {
    const res = await fetch(`${API_BASE_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user_id': 'dev_user_1'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Chat API server returned status: ${res.status}`);
    }

    const data = await res.json();
    return {
      id: data.id || `msg_${Date.now()}`,
      sender: 'assistant',
      content: data.content || data.responseMarkdown || '',
      mode: payload.mode || 'teacher',
      citations: (data.citations || []).map((c: any) => ({
        source_title: c.documentTitle || c.source_title || 'Authorized Playbook.pdf',
        chunk_index: c.chunkIndex ?? c.chunk_index ?? 0,
        content_snippet: c.contentSnippet || c.content_snippet || '',
        confidence: c.confidence || 0.95
      })),
      x402_required: data.x402_required,
      x402_challenge: data.x402_challenge
    };
  },

  // 3. Create Digital Human
  async createDigitalHuman(twinData: Partial<DigitalTwin>): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/digital-humans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev_access_token'
      },
      body: JSON.stringify(twinData)
    });
    return res.json();
  },

  // 4. Knowledge Upload & RAG Indexing
  async uploadKnowledgeDocument(digitalHumanId: string, fileName: string, fileContentBase64?: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/knowledge/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev_access_token'
      },
      body: JSON.stringify({
        digitalHumanId,
        fileName,
        fileContentBase64: fileContentBase64 || Buffer.from('Sample expert knowledge').toString('base64')
      })
    });
    return res.json();
  },

  // 5. Creator Analytics & Payout
  async getCreatorAnalytics(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/creator/analytics`, {
      headers: { 'Authorization': 'Bearer dev_access_token' }
    });
    return res.json();
  },

  async withdrawCreatorEarnings(amountUsdc: number, destinationWallet?: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/creator/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev_access_token'
      },
      body: JSON.stringify({ amountUsdc, destinationWallet })
    });
    return res.json();
  },

  // 6. Assistant Discovery & Compare
  async getAssistantDiscovery(messageOrGoal: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/recommendations/discovery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: messageOrGoal, goal: messageOrGoal })
    });
    return res.json();
  },

  async compareTwins(twinIdA: string, twinIdB: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/recommendations/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ twin_id_a: twinIdA, twin_id_b: twinIdB })
    });
    return res.json();
  },

  // 7. Career Prep Services
  async evaluateResume(resumeText: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/career/resume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText })
    });
    return res.json();
  },

  async getMockInterview(role: string, message: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/career/mock-interview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, message })
    });
    return res.json();
  },

  // 8. Wellness Session
  async getWellnessSession(activityType: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/wellness/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activityType })
    });
    return res.json();
  }
};
