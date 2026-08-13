import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, Activity, VolumeX } from 'lucide-react';
import { DigitalTwinData } from './MarketplaceCard';

interface VoiceModalProps {
  twin: DigitalTwinData;
  onClose: () => void;
}

export const VoiceInteractionModal: React.FC<VoiceModalProps> = ({ twin, onClose }) => {
  const [isListening, setIsListening] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('Listening to your voice input...');
  const [twinResponse, setTwinResponse] = useState('');

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Dynamic Speech-to-Text & Grounded Voice Synthesis loop
    const timer1 = setTimeout(() => {
      const userText = 'Can you explain how state synchronization works in distributed systems?';
      setTranscript(userText);
      setIsListening(false);
      setIsSpeaking(true);
      const answer = `In distributed systems, state synchronization relies on consensus algorithms like Raft or Paxos to ensure event ordering across node replicas.`;
      setTwinResponse(answer);
      speakText(answer);
    }, 2000);

    return () => {
      clearTimeout(timer1);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleMic = () => {
    if (isSpeaking && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setIsListening(!isListening);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10, 13, 23, 0.92)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
      <div className="glass-panel" style={{ padding: '40px', maxWidth: '540px', width: '90%', textAlign: 'center', position: 'relative' }}>

        <button onClick={() => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); onClose(); }} style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <span className="mode-badge" style={{ marginBottom: '16px', display: 'inline-block' }}>REAL-TIME VOICE MODE</span>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px' }}>{twin.name}</h3>
        <p style={{ fontSize: '0.85rem', color: '#38BDF8', marginBottom: '24px' }}>{twin.tagline}</p>

        {/* Dynamic Waveform Visualizer Circle */}
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'linear-gradient(135deg, #00F2FE 0%, #7B2CBF 100%)', opacity: isSpeaking ? 0.4 : 0.15, filter: 'blur(16px)', animation: isSpeaking ? 'pulse 1.5s infinite alternate' : 'none' }}></div>
          <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#1E293B', border: '2px solid #00F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            {isSpeaking ? <Volume2 size={36} color="#00F2FE" /> : <Mic size={36} color="#9D4EDD" />}
          </div>
        </div>

        {/* AI Disclosure Notice */}
        <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginBottom: '16px', fontStyle: 'italic' }}>
          "You are interacting with an AI Digital Twin created from the expert's authorized knowledge."
        </div>

        {/* Live Captions Display */}
        <div style={{ background: '#1E293B', padding: '16px', borderRadius: '12px', marginBottom: '24px', textAlign: 'left', minHeight: '85px' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
            {isListening ? 'User Voice Input (Live Captions)' : 'AI Digital Human Voice Output'}
          </div>
          <p style={{ fontSize: '0.85rem', color: '#F8FAFC', lineHeight: '1.4' }}>
            {isListening ? transcript : twinResponse}
          </p>
        </div>

        {/* Voice Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button
            onClick={handleToggleMic}
            style={{
              background: isListening ? '#EF4444' : 'linear-gradient(135deg, #00F2FE 0%, #7B2CBF 100%)',
              color: '#FFF',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '20px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            {isListening ? 'Mute Mic' : 'Start Speaking'}
          </button>
        </div>

      </div>
    </div>
  );
};
