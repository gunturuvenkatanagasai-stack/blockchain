import React, { useState } from 'react';
import { Search, Filter, Sparkles, Trophy, Cpu, Flame } from 'lucide-react';
import { MarketplaceCard, DigitalTwinData } from './MarketplaceCard';

interface GridProps {
  twins: DigitalTwinData[];
  onSelectChat: (twin: DigitalTwinData, mode: string) => void;
  onSelectVoice: (twin: DigitalTwinData) => void;
  openAssistant: () => void;
}

export const MarketplaceGrid: React.FC<GridProps> = ({
  twins,
  onSelectChat,
  onSelectVoice,
  openAssistant
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'popular' | 'price_low' | 'name'>('popular');

  const pillars = [
    { id: 'all', label: '🌐 All Pillars' },
    { id: 'home_life', label: '🏠 Home & Life' },
    { id: 'wellbeing', label: '🧘 Personal Well-being' },
    { id: 'practical', label: '📚 Practical Knowledge' },
    { id: 'creativity', label: '🎨 Creativity & Connection' }
  ];

  const categories = [
    { id: 'all', label: 'All Categories', emoji: '✨', pillar: 'all' },
    // Home & Life Pillar
    { id: 'real_estate', label: 'Real Estate', emoji: '🏠', pillar: 'home_life' },
    { id: 'parenting', label: 'Parenting & Family', emoji: '👨‍👩‍👧‍👦', pillar: 'home_life' },
    { id: 'travel', label: 'Travel & Lifestyle', emoji: '✈️', pillar: 'home_life' },
    // Personal Well-being Pillar
    { id: 'mindfulness', label: 'Mindfulness & Spiritual', emoji: '🧘', pillar: 'wellbeing' },
    { id: 'sleep', label: 'Sleep & Recovery', emoji: '😴', pillar: 'wellbeing' },
    { id: 'relationships', label: 'Relationships & Comm', emoji: '❤️', pillar: 'wellbeing' },
    // Practical Knowledge Pillar
    { id: 'legal', label: 'Legal & Consumer', emoji: '⚖️', pillar: 'practical' },
    { id: 'cooking', label: 'Food & Cooking', emoji: '🍳', pillar: 'practical' },
    { id: 'tech', label: 'Tech & Architecture', emoji: '💻', pillar: 'practical' },
    { id: 'medical', label: 'Medical & Healthcare', emoji: '🩺', pillar: 'practical' },
    { id: 'career', label: 'Career & FAANG', emoji: '💼', pillar: 'practical' },
    { id: 'business', label: 'Venture & Business', emoji: '🚀', pillar: 'practical' },
    { id: 'finance', label: 'Financial Education', emoji: '💰', pillar: 'practical' },
    // Creativity & Connection Pillar
    { id: 'hobbies', label: 'Hobbies & Creativity', emoji: '🎨', pillar: 'creativity' },
    { id: 'community', label: 'Community & Network', emoji: '🤝', pillar: 'creativity' }
  ];

  const modesList = [
    { id: 'all', label: 'All Modes' },
    { id: 'teacher', label: 'Teacher' },
    { id: 'mentor', label: 'Mentor' },
    { id: 'interviewer', label: 'Interviewer' },
    { id: 'coach', label: 'Coach' },
    { id: 'voice', label: 'Voice' },
    { id: 'study', label: 'Study' }
  ];

  // Filter categories by active pillar tab
  const visibleCategories = selectedPillar === 'all'
    ? categories
    : categories.filter((c) => c.id === 'all' || c.pillar === selectedPillar);

  // Calculate category counts
  const getCategoryCount = (catId: string) => {
    if (catId === 'all') {
      if (selectedPillar === 'all') return twins.length;
      return twins.filter((t) => t.pillar === selectedPillar).length;
    }
    return twins.filter((t) => t.category.toLowerCase() === catId.toLowerCase()).length;
  };

  const filteredTwins = twins.filter((t) => {
    const cat = t.category.toLowerCase();
    const selCat = selectedCategory.toLowerCase();
    const selPillar = selectedPillar.toLowerCase();

    // 1. Pillar Filter
    let matchesPillar = true;
    if (selPillar !== 'all') {
      matchesPillar = t.pillar === selPillar;
    }

    // 2. Category Filter
    let matchesCategory = true;
    if (selCat !== 'all') {
      matchesCategory = cat === selCat;
    }

    // 3. Mode Filter
    const matchesMode = selectedMode === 'all' || t.supported_modes.includes(selectedMode.toLowerCase());

    // 4. Search Filter
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.expert_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPillar && matchesCategory && matchesMode && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'popular') return b.total_interactions - a.total_interactions;
    if (sortBy === 'price_low') return a.price_per_question_algo - b.price_per_question_algo;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>

      {/* Hero Banner */}
      <div className="glass-panel" style={{ padding: '40px', marginBottom: '32px', position: 'relative', overflow: 'hidden', background: 'radial-gradient(circle at top right, rgba(0, 242, 254, 0.15), rgba(157, 78, 221, 0.05))' }}>
        <div style={{ maxWidth: '820px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0, 242, 254, 0.3)', color: '#00F2FE', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '16px' }}>
            <Flame size={14} /> AI Digital Twin Knowledge Economy
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '14px' }}>
            Interact with Verified <span className="gradient-text">AI Digital Humans</span> Powered by Real Authorized Knowledge
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '24px' }}>
            Every expert's knowledge can earn forever. Explore 10 main categories across 4 broader pillars in 8 interaction modes. Micro-settled via x402 on Algorand.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button onClick={openAssistant} className="gradient-button" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
              <Sparkles size={18} /> Launch Human Intelligence Assistant
            </button>
          </div>
        </div>

        {/* Live Platform Stats */}
        <div style={{ display: 'flex', gap: '24px', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={16} color="#FBBF24" />
            <span style={{ fontSize: '0.85rem', color: '#CBD5E1' }}><strong>{twins.length}</strong> Verified Twins</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={16} color="#00F2FE" />
            <span style={{ fontSize: '0.85rem', color: '#CBD5E1' }}><strong>35,000+</strong> Conversations</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#34D399" />
            <span style={{ fontSize: '0.85rem', color: '#CBD5E1' }}><strong>0.1 ALGO</strong> / query (x402 protocol)</span>
          </div>
        </div>
      </div>

      {/* 4 Broader Pillars Tab Switcher */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        {pillars.map((pil) => {
          const isSelected = selectedPillar === pil.id;
          return (
            <button
              key={pil.id}
              onClick={() => {
                setSelectedPillar(pil.id);
                setSelectedCategory('all');
              }}
              style={{
                background: isSelected ? 'linear-gradient(135deg, rgba(0, 242, 254, 0.2) 0%, rgba(123, 44, 191, 0.2) 100%)' : 'rgba(255, 255, 255, 0.03)',
                border: isSelected ? '1px solid #00F2FE' : '1px solid var(--border-color)',
                color: isSelected ? '#00F2FE' : '#94A3B8',
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {pil.label}
            </button>
          );
        })}
      </div>

      {/* Filter & Search Bar Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>

        {/* Search Input with Clear Button */}
        <div style={{ position: 'relative', minWidth: '300px', flex: '1 1 300px' }}>
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search experts, skills, or topics (e.g. real estate, meditation, legal)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: '#1E293B',
              border: '1px solid var(--border-color)',
              color: '#F8FAFC',
              padding: '10px 36px 10px 42px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#94A3B8' }}>
            <Filter size={15} /> Sort:
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              background: '#1E293B',
              border: '1px solid var(--border-color)',
              color: '#F8FAFC',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price_low">Lowest Price (ALGO)</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>

      </div>

      {/* Category Pills with Emojis & Count Badges */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {visibleCategories.map((cat) => {
          const count = getCategoryCount(cat.id);
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: isSelected ? 'linear-gradient(135deg, #00F2FE 0%, #7B2CBF 100%)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                color: isSelected ? '#FFF' : '#94A3B8',
                padding: '7px 14px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{cat.emoji}</span> {cat.label}
              <span style={{
                background: isSelected ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                padding: '1px 6px',
                borderRadius: '10px',
                fontSize: '0.72rem'
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interaction Mode Quick Filter Tags */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '28px', padding: '10px 14px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: 'var(--radius-md)' }}>
        <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Mode Filter:</span>
        {modesList.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedMode(m.id)}
            style={{
              background: selectedMode === m.id ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
              border: selectedMode === m.id ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid transparent',
              color: selectedMode === m.id ? '#00F2FE' : '#94A3B8',
              padding: '3px 10px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Results Header Counter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <span style={{ fontSize: '0.88rem', color: '#94A3B8' }}>
          Showing <strong style={{ color: '#F8FAFC' }}>{filteredTwins.length}</strong> of {twins.length} Digital Twins
        </span>
        {(selectedPillar !== 'all' || selectedCategory !== 'all' || selectedMode !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedPillar('all');
              setSelectedCategory('all');
              setSelectedMode('all');
              setSearchQuery('');
            }}
            style={{ background: 'none', border: 'none', color: '#00F2FE', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* Marketplace Grid */}
      {filteredTwins.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredTwins.map((twin) => (
            <MarketplaceCard
              key={twin.id}
              twin={twin}
              onSelectChat={onSelectChat}
              onSelectVoice={onSelectVoice}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No Digital Twins matched your search criteria.</p>
          <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>Try adjusting your search terms, pillar tab, mode filters, or category selection.</p>
          <button
            onClick={() => {
              setSelectedPillar('all');
              setSelectedCategory('all');
              setSelectedMode('all');
              setSearchQuery('');
            }}
            className="gradient-button"
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            Show All Digital Twins
          </button>
        </div>
      )}

    </div>
  );
};

