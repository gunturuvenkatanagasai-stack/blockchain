import React, { useState } from 'react';
import { Sparkles, X, Compass, Columns } from 'lucide-react';
import { DigitalTwinData } from './MarketplaceCard';
import { apiService } from '../services/api';

interface AssistantProps {
  onClose: () => void;
  twins: DigitalTwinData[];
  onSelectTwin: (twin: DigitalTwinData) => void;
}

export const HumanIntelligenceAssistant: React.FC<AssistantProps> = ({ onClose, twins, onSelectTwin }) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'compare' | 'planner'>('roadmap');
  const [goalInput, setGoalInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [roadmapResult, setRoadmapResult] = useState<any>(null);

  const [compareTwinA, setCompareTwinA] = useState<string>(twins[0]?.id || '');
  const [compareTwinB, setCompareTwinB] = useState<string>(twins[1]?.id || '');
  const [comparisonResult, setComparisonResult] = useState<any>(null);

  const handleGenerateRoadmap = async () => {
    if (!goalInput.trim()) return;
    setLoading(true);
    try {
      const data = await apiService.getAssistantDiscovery(goalInput);
      setRoadmapResult(data);
    } catch (e) {
      // Deterministic client fallback response
      setRoadmapResult({
        user_goal: goalInput,
        learning_roadmap: {
          title: `Learning Roadmap: ${goalInput}`,
          estimated_weeks: 8,
          milestones: [
            { week: '1-2', focus: 'Foundational Knowledge Ingestion', description: 'Engage with top-rated Teacher Mode twins.' },
            { week: '3-4', focus: 'Practical Hands-on Exercises', description: 'Solve practice problems in Practice & Reviewer Modes.' },
            { week: '5-6', focus: 'Mock Interviews & Scenario Practice', description: 'Conduct technical interview simulations in Interviewer Mode.' },
            { week: '7-8', focus: 'Cap-Stone Mastery & Career Coaching', description: 'Finalize career portfolio and strategic positioning with Mentor Mode.' }
          ]
        },
        explanation: `To achieve '${goalInput}', we recommend a structured 8-week path starting with verified expert twins.`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompareExperts = async () => {
    setLoading(true);
    try {
      const data = await apiService.compareTwins(compareTwinA, compareTwinB);
      setComparisonResult(data);
    } catch (e) {
      const tA = twins.find(t => t.id === compareTwinA) || twins[0];
      const tB = twins.find(t => t.id === compareTwinB) || twins[1];
      setComparisonResult({
        twin_a: tA,
        twin_b: tB,
        recommendation_verdict: `Choose '${tA?.name}' for deep focus in ${tA?.category}, or '${tB?.name}' for strategic overview in ${tB?.category}.`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10, 13, 23, 0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'flex-end', zIndex: 300 }}>
      <div className="glass-panel" style={{ width: '600px', height: '100%', borderRadius: 0, borderRight: 0, borderTop: 0, borderBottom: 0, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #00F2FE 0%, #7B2CBF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} color="#FFF" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Human Intelligence Assistant</h2>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Central Platform Discovery & Roadmap Intelligence</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Mode Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#1E293B', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => setActiveTab('roadmap')}
            style={{
              flex: 1,
              background: activeTab === 'roadmap' ? 'linear-gradient(135deg, #00F2FE 0%, #7B2CBF 100%)' : 'transparent',
              color: activeTab === 'roadmap' ? '#FFF' : '#94A3B8',
              border: 'none',
              padding: '8px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Compass size={14} /> Roadmap Builder
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            style={{
              flex: 1,
              background: activeTab === 'compare' ? 'linear-gradient(135deg, #00F2FE 0%, #7B2CBF 100%)' : 'transparent',
              color: activeTab === 'compare' ? '#FFF' : '#94A3B8',
              border: 'none',
              padding: '8px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Columns size={14} /> Compare Experts
          </button>
        </div>

        {/* TAB 1: ROADMAP BUILDER */}
        {activeTab === 'roadmap' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '16px' }}>
              State your learning or career goal (e.g. "I want to become a full-stack engineer" or "Prepare for medical licensing exams").
            </p>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              <input
                type="text"
                placeholder="Enter your goal..."
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                style={{ flex: 1, background: '#1E293B', border: '1px solid var(--border-color)', color: '#FFF', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem' }}
              />
              <button onClick={handleGenerateRoadmap} className="gradient-button" style={{ padding: '0 16px', fontSize: '0.85rem' }}>
                Build Roadmap
              </button>
            </div>

            {loading && (
              <div style={{ color: '#00F2FE', fontSize: '0.85rem', textAlign: 'center', padding: '24px' }}>
                Generating tailored learning roadmap...
              </div>
            )}

            {roadmapResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#1E293B', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #00F2FE' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>{roadmapResult.learning_roadmap.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{roadmapResult.explanation}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {roadmapResult.learning_roadmap.milestones.map((m: any, i: number) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '12px 16px', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#38BDF8', fontWeight: 700, marginBottom: '4px' }}>
                        <span>Week {m.week}</span>
                        <span>Phase #{i + 1}</span>
                      </div>
                      <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F8FAFC', marginBottom: '2px' }}>{m.focus}</h5>
                      <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{m.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMPARE EXPERTS */}
        {activeTab === 'compare' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '16px' }}>
              Select two Digital Twins to compare side-by-side on expertise, content, price, and supported modes.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Expert A</label>
                <select
                  value={compareTwinA}
                  onChange={(e) => setCompareTwinA(e.target.value)}
                  style={{ width: '100%', background: '#1E293B', border: '1px solid var(--border-color)', color: '#FFF', padding: '8px', borderRadius: '8px', fontSize: '0.8rem' }}
                >
                  {twins.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Expert B</label>
                <select
                  value={compareTwinB}
                  onChange={(e) => setCompareTwinB(e.target.value)}
                  style={{ width: '100%', background: '#1E293B', border: '1px solid var(--border-color)', color: '#FFF', padding: '8px', borderRadius: '8px', fontSize: '0.8rem' }}
                >
                  {twins.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>

            <button onClick={handleCompareExperts} className="gradient-button" style={{ width: '100%', justifyContent: 'center', marginBottom: '24px' }}>
              Compare Experts Side-by-Side
            </button>

            {comparisonResult && (
              <div style={{ background: '#1E293B', padding: '20px', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: '#00F2FE' }}>Comparison Verdict</h4>
                <p style={{ fontSize: '0.85rem', color: '#F8FAFC', lineHeight: 1.5, marginBottom: '16px' }}>
                  {comparisonResult.recommendation_verdict}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                    <strong>{comparisonResult.twin_a?.name}</strong>
                    <p style={{ color: '#38BDF8', marginTop: '2px' }}>{comparisonResult.twin_a?.category}</p>
                    <p style={{ color: '#FBBF24', marginTop: '2px' }}>★ {comparisonResult.twin_a?.rating?.toFixed(1)}</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                    <strong>{comparisonResult.twin_b?.name}</strong>
                    <p style={{ color: '#38BDF8', marginTop: '2px' }}>{comparisonResult.twin_b?.category}</p>
                    <p style={{ color: '#FBBF24', marginTop: '2px' }}>★ {comparisonResult.twin_b?.rating?.toFixed(1)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
