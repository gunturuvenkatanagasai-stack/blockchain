export interface SessionMeta {
  id: string;
  priceAlgo: number;
  currency: 'ALGO';
  durationMinutes: number;
  tierName: 'Basic' | 'Expert' | 'Premium';
}

export const SESSION_PRICING: Record<string, { priceAlgo: number; durationMinutes: number; tierName: 'Basic' | 'Expert' | 'Premium' }> = {
  // Category Default Pricing Rules
  tech: { priceAlgo: 0.50, durationMinutes: 30, tierName: 'Basic' },
  medical: { priceAlgo: 1.00, durationMinutes: 30, tierName: 'Expert' },
  career: { priceAlgo: 0.50, durationMinutes: 30, tierName: 'Basic' },
  business: { priceAlgo: 2.00, durationMinutes: 30, tierName: 'Premium' },
  finance: { priceAlgo: 1.00, durationMinutes: 30, tierName: 'Expert' },
  real_estate: { priceAlgo: 1.00, durationMinutes: 30, tierName: 'Expert' },
  legal: { priceAlgo: 1.00, durationMinutes: 30, tierName: 'Expert' },
  parenting: { priceAlgo: 0.50, durationMinutes: 30, tierName: 'Basic' },
  mindfulness: { priceAlgo: 0.50, durationMinutes: 30, tierName: 'Basic' },
  cooking: { priceAlgo: 0.50, durationMinutes: 30, tierName: 'Basic' },
  hobbies: { priceAlgo: 0.50, durationMinutes: 30, tierName: 'Basic' },
  community: { priceAlgo: 0.50, durationMinutes: 30, tierName: 'Basic' },
  travel: { priceAlgo: 0.50, durationMinutes: 30, tierName: 'Basic' },
  sleep: { priceAlgo: 0.50, durationMinutes: 30, tierName: 'Basic' },
  relationships: { priceAlgo: 0.50, durationMinutes: 30, tierName: 'Basic' },

  // Specific Twin Override Pricing
  'marcus-vance-tech': { priceAlgo: 0.50, durationMinutes: 30, tierName: 'Basic' },
  'twin_1': { priceAlgo: 0.50, durationMinutes: 30, tierName: 'Basic' },
  'twin_2': { priceAlgo: 1.00, durationMinutes: 30, tierName: 'Expert' },
  'twin_4': { priceAlgo: 2.00, durationMinutes: 30, tierName: 'Premium' },
};

// Valid Algorand TestNet Treasury Address
export const DEFAULT_TREASURY_ADDRESS = process.env.VITE_PAYMENT_RECEIVER_ADDRESS || 'ABGJ7R7JNNV2XNHGL2LFKQKS5VIL5RVLH5C6MXSHOBDRBHVEAPTYY4SXEM';

export function getSessionPricing(digitalTwinId: string, category: string = 'tech'): SessionMeta {
  const meta = SESSION_PRICING[digitalTwinId] || SESSION_PRICING[category] || { priceAlgo: 0.50, durationMinutes: 30, tierName: 'Basic' };
  return {
    id: digitalTwinId,
    priceAlgo: meta.priceAlgo,
    currency: 'ALGO',
    durationMinutes: meta.durationMinutes,
    tierName: meta.tierName,
  };
}
