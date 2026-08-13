import React from 'react';
import { Star, ShieldCheck, MessageSquare, Mic, Zap, BookOpen, Layers } from 'lucide-react';

export interface DigitalTwinData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  pillar?: string;
  avatar_url?: string;
  languages: string[];
  supported_modes: string[];
  price_per_question_algo: number;
  monthly_subscription_usd: number;
  rating: number;
  total_interactions: number;
  expert_name: string;
  verification_status: string;
}

interface CardProps {
  twin: DigitalTwinData;
  onSelectChat: (twin: DigitalTwinData, mode: string) => void;
  onSelectVoice: (twin: DigitalTwinData) => void;
}

const CATEGORY_MAP: Record<string, { label: string; emoji: string }> = {
  real_estate: { label: 'Real Estate', emoji: '🏠' },
  legal: { label: 'Legal & Consumer', emoji: '⚖️' },
  parenting: { label: 'Parenting & Family', emoji: '👨‍👩‍👧‍👦' },
  mindfulness: { label: 'Mindfulness & Spiritual', emoji: '🧘' },
  cooking: { label: 'Food & Cooking', emoji: '🍳' },
  hobbies: { label: 'Hobbies & Creativity', emoji: '🎨' },
  community: { label: 'Community & Network', emoji: '🤝' },
  travel: { label: 'Travel & Lifestyle', emoji: '✈️' },
  sleep: { label: 'Sleep & Recovery', emoji: '😴' },
  relationships: { label: 'Relationships & Comm', emoji: '❤️' },
  tech: { label: 'Tech & Architecture', emoji: '💻' },
  medical: { label: 'Medical & Healthcare', emoji: '🩺' },
  career: { label: 'Career & FAANG', emoji: '💼' },
  business: { label: 'Venture & Business', emoji: '🚀' },
  finance: { label: 'Financial Education', emoji: '💰' }
};

export const MarketplaceCard: React.FC<CardProps> = ({ twin, onSelectChat, onSelectVoice }) => {
  const catInfo = CATEGORY_MAP[twin.category] || { label: twin.category, emoji: '✨' };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div>
        {/* Category & Verification Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span className="mode-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span>{catInfo.emoji}</span> {catInfo.label}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', padding: '3px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600 }}>
            <ShieldCheck size={12} /> Verified Expert
          </div>
        </div>

        {/* Digital Human Name & Tagline */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', color: '#00F2FE', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
            {twin.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '2px', color: '#F8FAFC' }}>{twin.name}</h3>
            <p style={{ fontSize: '0.8rem', color: '#38BDF8', fontWeight: 500 }}>{twin.tagline}</p>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>By {twin.expert_name}</p>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.85rem', color: '#CBD5E1', lineHeight: '1.5', marginBottom: '16px' }}>
          {twin.description}
        </p>

        {/* Modes Pill Cloud */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {twin.supported_modes.slice(0, 5).map((m) => (
            <span key={m} style={{ background: '#1E293B', color: '#94A3B8', fontSize: '0.7rem', padding: '3px 8px', borderRadius: '6px', textTransform: 'capitalize' }}>
              {m}
            </span>
          ))}
          {twin.supported_modes.length > 5 && (
            <span style={{ fontSize: '0.7rem', color: '#64748B' }}>+{twin.supported_modes.length - 5} modes</span>
          )}
        </div>
      </div>

      <div>
        {/* Rating & Pricing Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={16} color="#FBBF24" fill="#FBBF24" />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{twin.rating.toFixed(1)}</span>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>({twin.total_interactions} interactions)</span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div className="x402-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={11} /> {twin.price_per_question_algo} ALGO / query
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '2px' }}>
              ${twin.monthly_subscription_usd}/mo sub
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            onClick={() => onSelectChat(twin, 'teacher')}
            className="gradient-button"
            style={{ width: '100%', justifyContent: 'center', padding: '10px 0', fontSize: '0.85rem' }}
          >
            <MessageSquare size={16} /> Start Chat
          </button>

          <button
            onClick={() => onSelectVoice(twin)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: '#F8FAFC',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Mic size={16} color="#00F2FE" /> Voice Mode
          </button>
        </div>
      </div>
    </div>
  );
};
