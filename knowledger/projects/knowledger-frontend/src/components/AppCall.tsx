import React from 'react';

interface AppCallsInterface {
  openModal: boolean;
  setModalState: (value: boolean) => void;
}

const AppCalls: React.FC<AppCallsInterface> = ({ openModal, setModalState }) => {
  if (!openModal) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ padding: '24px', maxWidth: '400px' }}>
        <h3>Algorand Smart Contract App Calls</h3>
        <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '8px' }}>
          Interacting with Digital Twin Registry & Revenue Sharing smart contracts.
        </p>
        <button onClick={() => setModalState(false)} className="gradient-button" style={{ marginTop: '16px' }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AppCalls;
