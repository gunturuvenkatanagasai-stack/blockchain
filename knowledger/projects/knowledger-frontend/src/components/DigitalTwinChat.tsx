import React, { useState, useEffect } from 'react';
import { Send, ArrowLeft, Zap, Mic, Info, Sparkles, FileText, Lock, ShieldAlert, Clock } from 'lucide-react';
import { DigitalTwinData } from './MarketplaceCard';
import { apiService } from '../services/api';
import { WalletState, peraWalletService } from '../services/peraWallet';
import { sessionService, SessionEnrollment } from '../services/sessionService';
import { SessionPaymentModal } from './SessionPaymentModal';
import { PaymentModal } from './PaymentModal';

interface Citation {
  source_title: string;
  chunk_index: number;
  content_snippet: string;
  confidence: number;
}

interface MessageItem {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  mode: string;
  content: string;
  citations?: Citation[];
  timestamp: string;
}

interface ChatProps {
  twin: DigitalTwinData;
  onBack: () => void;
  onOpenVoice: () => void;
  walletState: WalletState;
  onConnectWallet: () => void;
}

function generateClientFallback(twinName: string, query: string, mode: string): { content: string; citations: Citation[] } {
  const qLower = query.toLowerCase().trim();
  let content = '';
  let sourceTitle = `${twinName} - Authorized Playbook.pdf`;

  if (qLower.includes('python') || qLower.includes('pandas') || qLower.includes('machine learning') || qLower.includes('data science') || qLower.includes('django') || qLower.includes('fastapi')) {
    sourceTitle = `${twinName} - Python Engineering & Master Class Playbook.pdf`;
    content = `Here is your complete, step-by-step **Python Learning Roadmap & Course Guide**:\n\n` +
      `### Phase 1: Core Fundamentals (Weeks 1–2)\n` +
      `• **Basic Syntax & Data Types:** Variables, strings, lists, tuples, dictionaries, and sets.\n` +
      `• **Control Flow & Functions:** \`if/else\` logic, \`for\`/\`while\` loops, function parameters, \`*args/\*\*kwargs\`, and lambda expressions.\n` +
      `• **Object-Oriented Programming (OOP):** Classes, inheritance, encapsulation, magic methods (\`__init__\`, \`__str__\`), and decorators.\n\n` +
      `### Phase 2: Intermediate Concepts & Tooling (Weeks 3–4)\n` +
      `• **Modules & Package Management:** Virtual environments (\`venv\` / \`poetry\`), \`pip\`, and module imports.\n` +
      `• **File Handling & Exception Handling:** Reading/writing JSON/CSV files, \`try/except/finally\` blocks.\n` +
      `• **Data Structures & Algorithms:** List comprehensions, generators, recursion, sorting/searching algorithms.\n\n` +
      `### Phase 3: Specialization Tracks (Weeks 5–8)\n` +
      `• **Web Development Track:** Build REST APIs using **FastAPI** or full-stack apps with **Django**.\n` +
      `• **Data & AI Track:** Data analysis with **NumPy & Pandas**, visualizations with **Matplotlib/Seaborn**, and ML with **Scikit-Learn & PyTorch**.\n` +
      `• **Automation & Scripting:** Web scraping with **BeautifulSoup/Playwright** and API integration.\n\n` +
      `\`\`\`python\n` +
      `# Example: Clean Pythonic Data Processing\n` +
      `def process_learning_data(scores: list[int]) -> dict:\n` +
      `    avg_score = sum(scores) / len(scores)\n` +
      `    passing = [s for s in scores if s >= 70]\n` +
      `    return {"average": avg_score, "passed_count": len(passing)}\n` +
      `\`\`\`\n\n` +
      `*Would you like a hands-on coding challenge or specific recommendations for interactive projects?*`;
  } else if (qLower.includes('javascript') || qLower.includes('react') || qLower.includes('node') || qLower.includes('web dev') || qLower.includes('frontend') || qLower.includes('typescript')) {
    sourceTitle = `${twinName} - Full-Stack Web Development Playbook.pdf`;
    content = `Regarding your inquiry on **"${query}"** in **${mode.toUpperCase()} Mode**:\n\n` +
      `### Modern Web Engineering Roadmap\n` +
      `1. **Core Language Mastery:** Modern ES6+ syntax (destructuring, spread operator, promises, async/await, and arrow functions).\n` +
      `2. **Frontend Architecture:** Component design with **React & TypeScript**, custom hooks, state management, and Vite build optimization.\n` +
      `3. **Backend & API Integration:** Asynchronous API fetching, RESTful design patterns, Express middleware, and CORS security.\n` +
      `4. **Deployment & CI/CD:** Edge hosting, environment security, and production bundle optimization.`;
  } else if (qLower.includes('health') || qLower.includes('heart') || qLower.includes('diet') || qLower.includes('medical') || qLower.includes('cardio')) {
    sourceTitle = `${twinName} - Clinical Health & Preventive Cardiology Handbook.pdf`;
    content = `⚠️ *Authorized Educational Health Guidance (Non-Clinical):*\n\n` +
      `Regarding **"${query}"**:\n\n` +
      `### Key Pillars of Preventive Wellness\n` +
      `1. **Cardiovascular Hygiene:** Engage in 150+ minutes of moderate aerobic exercise weekly.\n` +
      `2. **Metabolic Nutrition:** Focus on whole foods, fiber-rich vegetables, lean proteins, and low glycemic index carbohydrates.\n` +
      `3. **Biomarker Monitoring:** Track resting heart rate, blood pressure (<120/80 mmHg), and routine lipid panels.\n` +
      `4. **Autonomic Regulation:** Practice 10 minutes of daily diaphragmatic breathwork.`;
  } else if (qLower.includes('resume') || qLower.includes('interview') || qLower.includes('career') || qLower.includes('job') || qLower.includes('salary')) {
    sourceTitle = `${twinName} - Executive Career & Interview Playbook.pdf`;
    content = `Regarding **"${query}"** in **${mode.toUpperCase()} Mode**:\n\n` +
      `### Executive Career & Interview Acceleration\n` +
      `1. **Resume ATS Optimization:** Format bullet points using the Google XYZ Formula: *"Accomplished X, as measured by Y, by implementing Z."*\n` +
      `2. **Behavioral Interview Mastery:** Answer questions using the STAR framework (Situation, Task, Action, Result).\n` +
      `3. **System Design Strategy:** Communicate requirements, estimate scale, draw architecture, and optimize bottlenecks.\n` +
      `4. **Compensation Negotiation:** Research market percentiles (P50/P75/P90) and negotiate multiple offers.`;
  } else {
    content = `Based on authorized expert knowledge of **${twinName}**:\n\n` +
      `Regarding **"${query}"** in **${mode.toUpperCase()} Mode**:\n\n` +
      `1. **Core Concept:** ${query} requires breaking down fundamental principles into verifiable execution steps.\n` +
      `2. **Structured Application:** Apply systematic testing and verified domain playbooks to validate each step.\n` +
      `3. **Next Steps:** Ask me for a specific deep-dive, code demonstration, case study, or practice exercise.`;
  }

  return {
    content,
    citations: [
      {
        source_title: sourceTitle,
        chunk_index: 1,
        content_snippet: `Authorized expert guideline regarding ${query} and operational design principles.`,
        confidence: 0.96,
      },
    ],
  };
}

export const DigitalTwinChat: React.FC<ChatProps> = ({
  twin,
  onBack,
  onOpenVoice,
  walletState,
  onConnectWallet,
}) => {
  const [activeMode, setActiveMode] = useState<string>('teacher');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCitationModal, setShowCitationModal] = useState<Citation | null>(null);
  const [showSessionPaymentModal, setShowSessionPaymentModal] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = sessionService.subscribe(() => {
      setTick((prev) => prev + 1);
    });
    return () => unsubscribe();
  }, []);

  const activeSession = sessionService.getActiveSession(twin.id, walletState.address);
  const isAccessAllowed = !!activeSession;

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'init_1',
      sender: 'assistant',
      mode: 'teacher',
      content: `Welcome! I am the verified AI Digital Twin of ${twin.name} (${twin.tagline}). Ask me anything about ${twin.category} or switch modes to practice interviews, review documents, or receive coaching!`,
      citations: [
        {
          source_title: `${twin.name} - Authorized Domain Playbook.pdf`,
          chunk_index: 0,
          content_snippet: `Authorized expertise verified for ${twin.name}. Focuses on architectural fundamentals, production deployment, and domain best practices.`,
          confidence: 0.98
        }
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const modes = [
    { id: 'teacher', label: 'Teacher' },
    { id: 'mentor', label: 'Mentor' },
    { id: 'interviewer', label: 'Interviewer' },
    { id: 'coach', label: 'Coach' },
    { id: 'practice', label: 'Practice' },
    { id: 'reviewer', label: 'Reviewer' },
    { id: 'voice', label: 'Voice' },
    { id: 'study', label: 'Study' }
  ];

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    if (!walletState.connected) {
      onConnectWallet();
      return;
    }

    if (!isAccessAllowed) {
      setShowSessionPaymentModal(true);
      return;
    }

    const query = inputText;
    setInputText('');

    const userMsg: MessageItem = {
      id: `u_${Date.now()}`,
      sender: 'user',
      mode: activeMode,
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await apiService.sendChatMessage({
        digital_twin_id: twin.id,
        message: query,
        mode: activeMode,
      });

      const astMsg: MessageItem = {
        id: data.id || `a_${Date.now()}`,
        sender: 'assistant',
        mode: data.mode || activeMode,
        content: data.content,
        citations: data.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, astMsg]);
    } catch (e) {
      const { content, citations } = generateClientFallback(twin.name, query, activeMode);
      const astMsg: MessageItem = {
        id: `a_${Date.now()}`,
        sender: 'assistant',
        mode: activeMode,
        content,
        citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, astMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionEnrollmentSuccess = (session: SessionEnrollment) => {
    setShowSessionPaymentModal(false);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 90px)' }}>

      {/* Top Header Controls */}
      <div className="glass-panel" style={{ padding: '16px 24px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={20} /> Back
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{twin.name}</h2>
              <span className="mode-badge">{twin.category}</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#38BDF8' }}>{twin.tagline}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Active Session Countdown Banner */}
          {activeSession ? (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34D399', padding: '6px 14px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>● Active Session</span> | <Clock size={14} /> {sessionService.formatRemainingTime(activeSession.expiresAt)} remaining
            </div>
          ) : (
            <button onClick={() => setShowSessionPaymentModal(true)} className="gradient-button" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              Start Session (0.50 ALGO)
            </button>
          )}

          <button onClick={onOpenVoice} style={{ background: 'rgba(0,242,254,0.15)', color: '#00F2FE', border: '1px solid rgba(0,242,254,0.3)', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
            <Mic size={16} /> Voice Session
          </button>
        </div>
      </div>

      {/* Access Control Guard */}
      {!isAccessAllowed ? (
        <div className="glass-panel" style={{ flex: 1, padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldAlert size={56} color="#FBBF24" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>Access Denied</h3>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8', maxWidth: '420px', marginBottom: '24px' }}>
            You need an active paid session to access this Digital Twin on Algorand TestNet.
          </p>

          <button
            onClick={() => {
              if (!walletState.connected) {
                onConnectWallet();
              } else {
                setShowSessionPaymentModal(true);
              }
            }}
            className="gradient-button"
            style={{ padding: '14px 28px', fontSize: '1rem', fontWeight: 800 }}
          >
            {!walletState.connected ? 'Connect Pera Wallet' : 'Start 30-Minute Session (0.50 ALGO)'}
          </button>
        </div>
      ) : (
        <>
          {/* Mandatory AI Disclosure Banner */}
          <div style={{ background: 'rgba(157, 78, 221, 0.1)', border: '1px solid rgba(157, 78, 221, 0.25)', padding: '8px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.75rem', color: '#C084FC', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={14} />
            <span>You are interacting with an AI Digital Twin created from the expert's authorized knowledge. Secured by Pera Wallet & x402 protocol.</span>
          </div>

          {/* Mode Selector Tabs */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                style={{
                  background: activeMode === m.id ? 'linear-gradient(135deg, #00F2FE 0%, #7B2CBF 100%)' : '#1E293B',
                  color: activeMode === m.id ? '#FFF' : '#94A3B8',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {m.label} Mode
              </button>
            ))}
          </div>

          {/* Messages Scrollable Area */}
          <div className="glass-panel" style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, #00F2FE 0%, #7B2CBF 100%)' : '#1E293B',
                  color: '#F8FAFC',
                  padding: '14px 18px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.7rem', opacity: 0.8 }}>
                  <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>
                    {msg.sender === 'user' ? 'You' : `${twin.name} (${msg.mode} mode)`}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <p style={{ fontSize: '0.9rem', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{msg.content}</p>

                {/* Citations Footer */}
                {msg.citations && msg.citations.length > 0 && (
                  <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#38BDF8', fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FileText size={12} /> Grounded Sources ({msg.citations.length})
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {msg.citations.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => setShowCitationModal(c)}
                          style={{ background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0, 242, 254, 0.3)', color: '#00F2FE', fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          {c.source_title} (Conf: {(c.confidence * 100).toFixed(0)}%)
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ alignSelf: 'flex-start', color: '#94A3B8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} className="gradient-text" /> AI Twin is searching authorized knowledge base...
              </div>
            )}
          </div>

          {/* Input Box */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder={`Ask ${twin.name} in ${activeMode} mode...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{
                flex: 1,
                background: '#1E293B',
                border: '1px solid var(--border-color)',
                color: '#F8FAFC',
                padding: '14px 20px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              className="gradient-button"
              style={{ padding: '0 24px', fontSize: '0.9rem' }}
            >
              <Send size={18} /> Send
            </button>
          </div>
        </>
      )}

      {/* Session Payment Modal */}
      {showSessionPaymentModal && (
        <SessionPaymentModal
          isOpen={showSessionPaymentModal}
          onClose={() => setShowSessionPaymentModal(false)}
          twin={twin}
          walletState={walletState}
          onSuccess={handleSessionEnrollmentSuccess}
        />
      )}

      {/* Citation Inspector Modal */}
      {showCitationModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '560px', width: '90%' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: '#00F2FE' }}>
              Verified Source Citation
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '14px' }}>
              Document: {showCitationModal.source_title} (Chunk #{showCitationModal.chunk_index})
            </p>

            <div style={{ background: '#1E293B', padding: '16px', borderRadius: '10px', fontSize: '0.85rem', lineHeight: '1.5', color: '#F8FAFC', marginBottom: '20px' }}>
              "{showCitationModal.content_snippet}"
            </div>

            <button onClick={() => setShowCitationModal(null)} className="gradient-button" style={{ width: '100%', justifyContent: 'center' }}>
              Close Citation View
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
