import React, { useState, useEffect } from 'react';
import { HeartPulse, X, ShieldAlert, Sparkles, CheckCircle, Briefcase, DollarSign, Compass, Play, Pause, RefreshCw, Info } from 'lucide-react';
import { apiService } from '../services/api';

interface WellnessProps {
  onClose: () => void;
  initialTab?: 'student' | 'pro' | 'finance' | 'growth';
}

export const StudentWellnessModal: React.FC<WellnessProps> = ({ onClose, initialTab = 'student' }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'pro' | 'finance' | 'growth'>(initialTab);
  const [showBreathingSession, setShowBreathingSession] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(true);
  const [completedCycles, setCompletedCycles] = useState(0);

  useEffect(() => {
    let timer: any = null;
    if (showBreathingSession && isBreathingActive) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev > 1) return prev - 1;
          
          // Phase transitions (4-4-4-4 Box Breathing)
          if (breathingPhase === 'Inhale') {
            setBreathingPhase('Hold');
            return 4;
          } else if (breathingPhase === 'Hold') {
            setBreathingPhase('Exhale');
            return 4;
          } else if (breathingPhase === 'Exhale') {
            setBreathingPhase('Rest');
            return 4;
          } else {
            setBreathingPhase('Inhale');
            setCompletedCycles((c) => c + 1);
            return 4;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showBreathingSession, isBreathingActive, breathingPhase]);

  const getCircleScale = () => {
    if (breathingPhase === 'Inhale') return 1.35;
    if (breathingPhase === 'Hold') return 1.35;
    if (breathingPhase === 'Exhale') return 0.85;
    return 0.85;
  };

  const getPhaseColor = () => {
    if (breathingPhase === 'Inhale') return '#00F2FE';
    if (breathingPhase === 'Hold') return '#FBBF24';
    if (breathingPhase === 'Exhale') return '#34D399';
    return '#C084FC';
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10, 13, 23, 0.92)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
      <div className="glass-panel" style={{ padding: '36px', maxWidth: '640px', width: '92%', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>

        <button onClick={onClose} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        {/* Header Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('student')}
            style={{
              background: activeTab === 'student' ? 'linear-gradient(135deg, #00F2FE 0%, #7B2CBF 100%)' : '#1E293B',
              color: '#FFF',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <HeartPulse size={14} /> Student Wellness
          </button>

          <button
            onClick={() => setActiveTab('pro')}
            style={{
              background: activeTab === 'pro' ? 'linear-gradient(135deg, #00F2FE 0%, #7B2CBF 100%)' : '#1E293B',
              color: '#FFF',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Briefcase size={14} /> Pro Wellness
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            style={{
              background: activeTab === 'finance' ? 'linear-gradient(135deg, #00F2FE 0%, #7B2CBF 100%)' : '#1E293B',
              color: '#FFF',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <DollarSign size={14} /> Financial Education
          </button>

          <button
            onClick={() => setActiveTab('growth')}
            style={{
              background: activeTab === 'growth' ? 'linear-gradient(135deg, #00F2FE 0%, #7B2CBF 100%)' : '#1E293B',
              color: '#FFF',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Compass size={14} /> Life Growth
          </button>
        </div>

        {/* TAB 1: STUDENT WELLNESS */}
        {activeTab === 'student' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: '#F8FAFC' }}>
              Student Stress Relief & Resilience Program
            </h3>

            {/* Educational Disclaimer Banner (Sleek Cyan/Blue Notice Style) */}
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.82rem', color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Info size={18} style={{ flexShrink: 0 }} />
              <span>This is educational wellness support and does not replace professional mental healthcare.</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {[
                'Study-break planner',
                'Relaxation exercises',
                'Breathing exercises (4-7-8 method)',
                'Mindfulness education',
                'Journaling prompts',
                'Time-management coaching',
                'Exam preparation routines',
                'Healthy study habits',
                'Motivation building',
                'Confidence exercises'
              ].map((feat, i) => (
                <div key={i} style={{ background: '#1E293B', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} color="#34D399" /> {feat}
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setShowBreathingSession(true);
                setIsBreathingActive(true);
                setBreathingPhase('Inhale');
                setSecondsLeft(4);
              }}
              style={{ background: 'rgba(52, 211, 153, 0.15)', border: '1px solid #34D399', color: '#34D399', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', width: '100%', fontSize: '0.9rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              ⚡ Launch Interactive Guided Breathing Session
            </button>
          </div>
        )}

        {/* TAB 2: PROFESSIONAL WELLNESS */}
        {activeTab === 'pro' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: '#F8FAFC' }}>
              Professional Wellness & Workload Optimization
            </h3>

            {/* Educational Disclaimer Banner */}
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.82rem', color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Info size={18} style={{ flexShrink: 0 }} />
              <span>Educational workplace stress-management and productivity coaching only. Do not market or provide as medical treatment.</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {[
                'Workload planning',
                'Productivity optimization',
                'Communication mastery',
                'Career growth strategy',
                'Healthy work habits',
                'Work-life organization',
                'Leadership development',
                'Stress-management education'
              ].map((feat, i) => (
                <div key={i} style={{ background: '#1E293B', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} color="#00F2FE" /> {feat}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FINANCIAL EDUCATION */}
        {activeTab === 'finance' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: '#F8FAFC' }}>
              Financial Education & Wealth Literacy
            </h3>

            {/* Disclaimer Banner */}
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.82rem', color: '#60A5FA', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Info size={18} style={{ flexShrink: 0 }} />
              <span>Educational financial literacy support only. Does not provide or guarantee financial returns or personalized investment advice.</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {[
                'Budgeting & expense tracking',
                'Saving strategies & emergency funds',
                'Financial literacy principles',
                'Investing fundamentals & portfolio basics',
                'Tax education & deduction strategies',
                'Retirement education & long-term growth'
              ].map((feat, i) => (
                <div key={i} style={{ background: '#1E293B', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} color="#34D399" /> {feat}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: LIFE GROWTH */}
        {activeTab === 'growth' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: '#F8FAFC' }}>
              Life Growth & Leadership Framework
            </h3>

            <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '20px' }}>
              Comprehensive personal development and executive leadership pillars for long-term growth.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {[
                'Goal setting & vision architecture',
                'Habit tracking & routine building',
                'Motivation & resilience mindset',
                'Personal development principles',
                'Public speaking & presentation mastery',
                'Decision-making & critical thinking',
                'Communication & interpersonal skills',
                'Financial literacy & resource planning',
                'Leadership development & team coaching',
                'Time management & priority matrices'
              ].map((feat, i) => (
                <div key={i} style={{ background: '#1E293B', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} color="#C084FC" /> {feat}
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={onClose} className="gradient-button" style={{ width: '100%', justifyContent: 'center' }}>
          <CheckCircle size={18} /> Module Overview Completed — Return to Platform
        </button>

      </div>

      {/* INTERACTIVE ANIMATED GUIDED BREATHING SESSION OVERLAY */}
      {showBreathingSession && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5, 8, 18, 0.95)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 }}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '480px', padding: '36px', borderRadius: '24px', textAlign: 'center', position: 'relative', border: '1px solid rgba(52, 211, 153, 0.4)' }}>

            <button onClick={() => setShowBreathingSession(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
              <X size={22} />
            </button>

            <div style={{ fontSize: '0.75rem', color: '#34D399', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px' }}>Guided Wellness Session</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF', marginBottom: '24px' }}>Box Breathing (4-4-4-4)</h3>

            {/* Pulsing Visual Circle */}
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div
                style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${getPhaseColor()} 0%, rgba(0,0,0,0) 70%)`,
                  border: `3px solid ${getPhaseColor()}`,
                  transform: `scale(${getCircleScale()})`,
                  transition: 'transform 4s ease-in-out, background 1s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 30px ${getPhaseColor()}`,
                }}
              >
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>{breathingPhase}</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FFF' }}>{secondsLeft}s</div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '16px 0 24px' }}>
              Completed Cycles: <strong style={{ color: '#34D399' }}>{completedCycles}</strong>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                style={{ background: isBreathingActive ? '#1E293B' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFF', border: '1px solid var(--border-color)', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {isBreathingActive ? <Pause size={16} /> : <Play size={16} />}
                {isBreathingActive ? 'Pause' : 'Resume'}
              </button>

              <button
                onClick={() => {
                  setBreathingPhase('Inhale');
                  setSecondsLeft(4);
                  setCompletedCycles(0);
                }}
                style={{ background: '#1E293B', color: '#94A3B8', border: '1px solid var(--border-color)', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RefreshCw size={16} /> Reset
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
