import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MarketplaceGrid } from './components/MarketplaceGrid';
import { DigitalTwinData } from './components/MarketplaceCard';
import { DigitalTwinChat } from './components/DigitalTwinChat';
import { VoiceInteractionModal } from './components/VoiceInteractionModal';
import { HumanIntelligenceAssistant } from './components/HumanIntelligenceAssistant';
import { CreatorOnboardingWizard } from './components/CreatorOnboardingWizard';
import { UserDashboard } from './components/UserDashboard';
import { CreatorDashboard } from './components/CreatorDashboard';
import { StudentWellnessModal } from './components/StudentWellnessModal';
import { CareerPrepModule } from './components/CareerPrepModule';
import { ConnectedWalletModal } from './components/ConnectedWalletModal';
import { apiService } from './services/api';
import { peraWalletService, WalletState } from './services/peraWallet';

const INITIAL_TWINS: DigitalTwinData[] = [
  {
    id: 'marcus-vance-tech',
    name: 'Marcus Vance Digital Twin',
    tagline: 'Technology & Software Engineering Expert',
    description: '15+ years leading high-throughput database design, consensus algorithms, and fault-tolerant cloud engines.',
    category: 'tech',
    pillar: 'practical',
    languages: ['English', 'Spanish'],
    supported_modes: ['teacher', 'mentor', 'interviewer', 'coach', 'practice', 'reviewer', 'voice', 'study'],
    price_per_question_algo: 0.01,
    monthly_subscription_usd: 19.99,
    rating: 4.9,
    total_interactions: 3420,
    expert_name: 'Marcus Vance',
    verification_status: 'verified'
  },
  {
    id: 'twin_1',
    name: 'Dr. Evelyn Vance AI',
    tagline: 'Distributed Systems & Database Architect',
    description: '15+ years leading high-throughput database design, consensus algorithms, and fault-tolerant cloud engines.',
    category: 'tech',
    pillar: 'practical',
    languages: ['English', 'Spanish'],
    supported_modes: ['teacher', 'mentor', 'interviewer', 'coach', 'practice', 'reviewer', 'voice', 'study'],
    price_per_question_algo: 0.01,
    monthly_subscription_usd: 19.99,
    rating: 4.9,
    total_interactions: 3420,
    expert_name: 'Dr. Evelyn Vance',
    verification_status: 'verified'
  },
  {
    id: 'twin_2',
    name: 'Dr. Marcus Sterling AI',
    tagline: 'Preventive Cardiology & Clinical Education',
    description: 'Authorized medical knowledge twin focusing on cardiovascular wellness education, lifestyle intervention, and diagnostic fundamentals.',
    category: 'medical',
    pillar: 'practical',
    languages: ['English'],
    supported_modes: ['teacher', 'mentor', 'coach', 'voice', 'study'],
    price_per_question_algo: 0.01,
    monthly_subscription_usd: 29.99,
    rating: 5.0,
    total_interactions: 1890,
    expert_name: 'Dr. Marcus Sterling, MD',
    verification_status: 'verified'
  },
  {
    id: 'twin_3',
    name: 'Sarah Chen AI',
    tagline: 'Executive Career & FAANG Interview Coach',
    description: 'Former Tech Recruiter & HR Director. Conducts mock technical interviews, resume ATS evaluations, and career roadmaps.',
    category: 'career',
    pillar: 'practical',
    languages: ['English', 'Mandarin'],
    supported_modes: ['teacher', 'interviewer', 'coach', 'reviewer', 'voice'],
    price_per_question_algo: 0.01,
    monthly_subscription_usd: 24.99,
    rating: 4.85,
    total_interactions: 2750,
    expert_name: 'Sarah Chen',
    verification_status: 'verified'
  },
  {
    id: 'twin_4',
    name: 'Marcus Thorne AI',
    tagline: 'Venture Capital & Startup Strategy Mentor',
    description: 'Serial Founder & VC Partner. Mentors early-stage founders on product-market fit, unit economics, and seed fundraising.',
    category: 'business',
    pillar: 'practical',
    languages: ['English'],
    supported_modes: ['mentor', 'coach', 'reviewer', 'voice'],
    price_per_question_algo: 0.01,
    monthly_subscription_usd: 39.99,
    rating: 4.95,
    total_interactions: 1120,
    expert_name: 'Marcus Thorne',
    verification_status: 'verified'
  },
  {
    id: 'twin_5',
    name: 'Elena Rostova AI',
    tagline: 'Financial Literacy & Wealth Education Mentor',
    description: 'Certified Financial Educator. Specialized in budgeting, savings strategies, tax literacy, retirement planning, and investing fundamentals.',
    category: 'finance',
    pillar: 'practical',
    languages: ['English'],
    supported_modes: ['teacher', 'mentor', 'coach', 'study', 'voice'],
    price_per_question_algo: 0.01,
    monthly_subscription_usd: 19.99,
    rating: 4.9,
    total_interactions: 1450,
    expert_name: 'Elena Rostova, CFP',
    verification_status: 'verified'
  },
  {
    id: 'twin_6',
    name: 'Arthur Pendelton AI',
    tagline: 'Property Valuation & Home Buying Mentor',
    description: 'Specialist in home buying checklists, mortgage calculations, rental yield evaluation, property inspection, and negotiation strategies.',
    category: 'real_estate',
    pillar: 'home_life',
    languages: ['English'],
    supported_modes: ['teacher', 'mentor', 'coach', 'voice'],
    price_per_question_algo: 0.01,
    monthly_subscription_usd: 22.99,
    rating: 4.92,
    total_interactions: 1980,
    expert_name: 'Arthur Pendelton',
    verification_status: 'verified'
  },
  {
    id: 'twin_7',
    name: 'Advocate Ananya Roy AI',
    tagline: 'Consumer Protection & Rights Educator',
    description: 'Guides users on contract red flags, refund rights, tenant protection, scam detection, and legal complaint filing fundamentals. (General information only).',
    category: 'legal',
    pillar: 'practical',
    languages: ['English', 'Hindi'],
    supported_modes: ['teacher', 'reviewer', 'coach', 'voice'],
    price_per_question_algo: 0.01,
    monthly_subscription_usd: 18.99,
    rating: 4.89,
    total_interactions: 2310,
    expert_name: 'Advocate Ananya Roy',
    verification_status: 'verified'
  },
  {
    id: 'twin_8',
    name: 'Claire Montgomery AI',
    tagline: 'Child Development & Positive Parenting Coach',
    description: 'Empowers parents with positive communication, screen-time balance strategies, emotional intelligence modeling, and family routines.',
    category: 'parenting',
    pillar: 'home_life',
    languages: ['English'],
    supported_modes: ['mentor', 'coach', 'teacher', 'voice'],
    price_per_question_algo: 0.01,
    monthly_subscription_usd: 16.99,
    rating: 4.96,
    total_interactions: 3120,
    expert_name: 'Claire Montgomery, M.Ed',
    verification_status: 'verified'
  },
  {
    id: 'twin_9',
    name: 'Guru Bodhi AI',
    tagline: 'Meditation, Breathwork & Inner Growth Educator',
    description: 'Offers guided breathwork, self-reflection prompts, digital detox plans, morning mindfulness routines, and daily gratitude practices.',
    category: 'mindfulness',
    pillar: 'wellbeing',
    languages: ['English', 'Sanskrit'],
    supported_modes: ['teacher', 'coach', 'study', 'voice'],
    price_per_question_algo: 0.01,
    monthly_subscription_usd: 14.99,
    rating: 4.98,
    total_interactions: 4150,
    expert_name: 'Guru Bodhi',
    verification_status: 'verified'
  },
  {
    id: 'twin_10',
    name: 'Chef Vikram Kapoor AI',
    tagline: 'Culinary Arts & Meal Prep Mentor',
    description: 'Master quick 20-minute dinners, weekly meal planning, budget grocery hacks, essential knife skills, and authentic spice blending techniques.',
    category: 'cooking',
    pillar: 'practical',
    languages: ['English', 'Hindi'],
    supported_modes: ['teacher', 'coach', 'voice'],
    price_per_question_algo: 0.01,
    monthly_subscription_usd: 17.99,
    rating: 4.94,
    total_interactions: 2890,
    expert_name: 'Chef Vikram Kapoor',
    verification_status: 'verified'
  },
  {
    id: 'twin_11',
    name: 'Aria Nova AI',
    tagline: 'Photography, DIY & Creative Habit Coach',
    description: 'Helps beginners launch photography projects, daily sketch routines, easy DIY crafts, and overcome creative blocks with limited time.',
    category: 'hobbies',
    pillar: 'creativity',
    languages: ['English'],
    supported_modes: ['teacher', 'mentor', 'coach', 'voice'],
    price_per_question_algo: 0.01,
    monthly_subscription_usd: 15.99,
    rating: 4.88,
    total_interactions: 1740,
    expert_name: 'Aria Nova',
    verification_status: 'verified'
  },
  {
    id: 'twin_12',
    name: 'Julian Vance AI',
    tagline: 'Networking & Introvert Social Skills Coach',
    description: 'Teaches confident professional networking, meaningful conversation starters, mentor outreach strategies, and authentic personal branding.',
    category: 'community',
    pillar: 'creativity',
    languages: ['English'],
    supported_modes: ['mentor', 'coach', 'interviewer', 'voice'],
    price_per_question_algo: 0.01,
    monthly_subscription_usd: 21.99,
    rating: 4.91,
    total_interactions: 2560,
    expert_name: 'Julian Vance',
    verification_status: 'verified'
  },
  {
    id: 'twin_13',
    name: 'Sienna Rivers AI',
    tagline: 'Solo Travel Planning & Digital Nomad Mentor',
    description: 'Guides solo travelers on safety, realistic itineraries, budget booking, packing light, and transitioning to a location-independent lifestyle.',
    category: 'travel',
    pillar: 'home_life',
    languages: ['English', 'Spanish'],
    supported_modes: ['mentor', 'coach', 'voice'],
    price_per_question_algo: 0.01,
    monthly_subscription_usd: 19.99,
    rating: 4.97,
    total_interactions: 3820,
    expert_name: 'Sienna Rivers',
    verification_status: 'verified'
  },
  {
    id: 'twin_14',
    name: 'Dr. Aris Thorne AI',
    tagline: 'Sleep Hygiene & Restful Routine Specialist',
    description: 'Provides evidence-based sleep hygiene tips, evening wind-down rituals, bedroom environment optimization, and recovery routines.',
    category: 'sleep',
    pillar: 'wellbeing',
    languages: ['English'],
    supported_modes: ['teacher', 'coach', 'voice'],
    price_per_question_algo: 0.01,
    monthly_subscription_usd: 16.99,
    rating: 4.93,
    total_interactions: 2140,
    expert_name: 'Dr. Aris Thorne',
    verification_status: 'verified'
  },
  {
    id: 'twin_15',
    name: 'Dr. Priya Nair AI',
    tagline: 'Emotional Intelligence & Communication Coach',
    description: 'Develop active listening, healthy boundary setting, constructive conflict resolution, and adult friendship maintenance skills.',
    category: 'relationships',
    pillar: 'wellbeing',
    languages: ['English', 'Malayalam'],
    supported_modes: ['mentor', 'coach', 'teacher', 'voice'],
    price_per_question_algo: 0.01,
    monthly_subscription_usd: 20.99,
    rating: 4.96,
    total_interactions: 3290,
    expert_name: 'Dr. Priya Nair',
    verification_status: 'verified'
  }
];

export default function Home() {
  const [currentRole, setRole] = useState<'learner' | 'expert' | 'admin'>('learner');
  const [twins, setTwins] = useState<DigitalTwinData[]>(INITIAL_TWINS);

  // Central Wallet State Management (Phase 3 & Phase 11)
  const [walletState, setWalletState] = useState<WalletState>(peraWalletService.getState());
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);

  // Active Session & Overlays State
  const [selectedChatTwin, setSelectedChatTwin] = useState<DigitalTwinData | null>(null);
  const [selectedVoiceTwin, setSelectedVoiceTwin] = useState<DigitalTwinData | null>(null);
  const [showAssistant, setShowAssistant] = useState<boolean>(false);
  const [showCreatorWizard, setShowCreatorWizard] = useState<boolean>(false);
  const [showWellness, setShowWellness] = useState<boolean>(false);
  const [showCareer, setShowCareer] = useState<boolean>(false);

  useEffect(() => {
    // Subscribe to central wallet state changes
    const unsubscribe = peraWalletService.subscribe((newState) => {
      setWalletState(newState);
    });

    // Reconnect existing Pera Wallet session on reload (Phase 11)
    peraWalletService.reconnect();

    async function loadBackendTwins() {
      const remoteTwins = await apiService.getDigitalHumans();
      if (remoteTwins && remoteTwins.length > 0) {
        setTwins((prev) => {
          const existingIds = new Set(prev.map((t) => t.id));
          const newEntries = remoteTwins.filter((rt: any) => !existingIds.has(rt.id));
          return [...newEntries, ...prev];
        });
      }
    }
    loadBackendTwins();

    return () => unsubscribe();
  }, []);

  const handleConnectWallet = async () => {
    try {
      await peraWalletService.connect();
    } catch (e) {
      console.warn('[Home] Wallet connect handled:', e);
    }
  };

  const handleSelectChat = (twin: DigitalTwinData, mode: string) => {
    setSelectedChatTwin(twin);
  };

  const handleSelectVoice = (twin: DigitalTwinData) => {
    setSelectedVoiceTwin(twin);
  };

  const handlePublishSuccess = (newTwin: DigitalTwinData) => {
    setTwins((prev) => [newTwin, ...prev]);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>

      <Navbar
        currentRole={currentRole}
        setRole={setRole}
        openAssistant={() => setShowAssistant(true)}
        openCreatorWizard={() => setShowCreatorWizard(true)}
        openWellness={() => setShowWellness(true)}
        openCareer={() => setShowCareer(true)}
        walletState={walletState}
        onConnectWallet={handleConnectWallet}
        onOpenWalletModal={() => setShowWalletModal(true)}
      />

      <main style={{ flex: 1 }}>
        {selectedChatTwin ? (
          <DigitalTwinChat
            twin={selectedChatTwin}
            onBack={() => setSelectedChatTwin(null)}
            onOpenVoice={() => setSelectedVoiceTwin(selectedChatTwin)}
            walletState={walletState}
            onConnectWallet={handleConnectWallet}
          />
        ) : (
          <>
            {currentRole === 'learner' && (
              <div>
                <MarketplaceGrid
                  twins={twins}
                  onSelectChat={handleSelectChat}
                  onSelectVoice={handleSelectVoice}
                  openAssistant={() => setShowAssistant(true)}
                />
                <UserDashboard
                  twins={twins}
                  onSelectChat={handleSelectChat}
                  walletState={walletState}
                  onConnectWallet={handleConnectWallet}
                />
              </div>
            )}

            {currentRole === 'expert' && (
              <CreatorDashboard />
            )}

            {currentRole === 'admin' && (
              <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>Platform Admin & Governance</h2>
                <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '24px' }}>Observability, safety incidents, and x402 Algorand settlement metrics.</p>

                <div className="glass-panel" style={{ padding: '28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Total Registered Twins</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#00F2FE' }}>{twins.length} Twins</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Algorand RPC Node</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34D399', marginTop: '8px' }}>● Connected</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>x402 Protocol Layer</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FBBF24', marginTop: '8px' }}>⚡ Active (0.01 ALGO per query)</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* CONNECTED WALLET PANEL MODAL */}
      <ConnectedWalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        walletState={walletState}
      />

      {/* OVERLAY MODALS & DRAWERS */}
      {selectedVoiceTwin && (
        <VoiceInteractionModal
          twin={selectedVoiceTwin}
          onClose={() => setSelectedVoiceTwin(null)}
        />
      )}

      {showAssistant && (
        <HumanIntelligenceAssistant
          onClose={() => setShowAssistant(false)}
          twins={twins}
          onSelectTwin={(t) => {
            setShowAssistant(false);
            setSelectedChatTwin(t);
          }}
        />
      )}

      {showCreatorWizard && (
        <CreatorOnboardingWizard
          onClose={() => setShowCreatorWizard(false)}
          onPublishSuccess={handlePublishSuccess}
        />
      )}

      {showWellness && (
        <StudentWellnessModal onClose={() => setShowWellness(false)} />
      )}

      {showCareer && (
        <CareerPrepModule onClose={() => setShowCareer(false)} />
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '24px', textAlign: 'center', fontSize: '0.8rem', color: '#64748B' }}>
        <p>© 2026 Knowledger AI — Digital Human Marketplace. "Every Human's Knowledge Can Earn Forever."</p>
      </footer>

    </div>
  );
}
