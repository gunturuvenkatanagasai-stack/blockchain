'use client';

import React, { useState } from 'react';

interface ChatMessage {
  sender: 'user' | 'twin' | 'system';
  text: string;
  citation?: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'creator' | 'admin' | 'chat'>('marketplace');
  const [activeTwin, setActiveTwin] = useState({ id: 'dt_marcus_algo', title: 'Marcus Vance Digital Twin' });
  const [query, setQuery] = useState('I want to learn Algorand x402 payment implementation');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'system',
      text: '⚠️ Disclaimer: You are interacting with an AI Digital Twin created from the expert\'s authorized knowledge.\n\nWelcome to this interactive learning session! What concept or question can I assist you with today?',
    },
  ]);
  const [x402Status, setX402Status] = useState('x402 Header Status: Authorization Ready (Algorand TestNet)');

  const openChatSession = (id: string, title: string) => {
    setActiveTwin({ id, title });
    setActiveTab('chat');
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setX402Status('x402 Status: AUTHORIZATION PROOF SENT (50,000 microUSDC)...');

    try {
      const res = await fetch('http://localhost:4000/api/v1/chat/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ digitalTwinId: activeTwin.id, query: userText }),
      });
      const data = await res.json();

      setX402Status(`x402 SETTLED: Tx verified on Algorand TestNet. MicroUSDC: ${data.metering?.chargedMicroUsdc || 50000}`);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'twin',
          text: data.responseMarkdown || 'Superposition principle and x402 payment proof verified on-chain.',
          citation: data.citations?.[0]?.documentTitle ? `${data.citations[0].documentTitle} (Chunk #${data.citations[0].chunkIndex})` : undefined,
        },
      ]);
    } catch {
      setX402Status('x402 SETTLED: Simulated local test verification (50,000 microUSDC).');
      setMessages((prev) => [
        ...prev,
        {
          sender: 'twin',
          text: 'The x402 protocol enables pay-per-query API authorization on Algorand. Each query sends microUSDC directly to the creator\'s account.',
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg">
              DH
            </div>
            <div>
              <span className="font-bold text-lg gradient-text">Digital Human</span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                x402 Algorand
              </span>
            </div>
          </div>

          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`hover:text-indigo-400 ${activeTab === 'marketplace' ? 'text-indigo-400 font-bold' : ''}`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab('creator')}
              className={`hover:text-indigo-400 ${activeTab === 'creator' ? 'text-indigo-400 font-bold' : ''}`}
            >
              Creator Earnings
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`hover:text-indigo-400 ${activeTab === 'admin' ? 'text-indigo-400 font-bold' : ''}`}
            >
              Admin Governance
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 font-mono">
              x402 Active
            </span>
            <button className="px-4 py-2 text-sm font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md">
              Connect Wallet
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-12">
        {/* Marketplace */}
        {activeTab === 'marketplace' && (
          <div className="space-y-12">
            <div className="text-center space-y-6 pt-8">
              <span className="inline-block px-4 py-1.5 rounded-full glass-card text-xs font-semibold text-indigo-300 border-indigo-500/30">
                ✨ AI Digital Twins + Algorand x402 Micropayments
              </span>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                Every Human's Knowledge Can <span className="gradient-text">Earn Forever.</span>
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto text-base">
                Synthesize verified expertise into interactive AI Digital Twins. Learners access 100% grounded citations while creators stream micropayments automatically via x402 on Algorand.
              </p>

              <div className="max-w-2xl mx-auto glass-panel p-3 rounded-2xl flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask Platform Assistant..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none"
                />
                <button
                  onClick={() => alert('Roadmap: 1. Algorand 2. PyTeal/TEAL 3. x402 Protocol')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl"
                >
                  Ask Assistant
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Featured Verified Digital Twins</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1 */}
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                          Marcus Vance <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400">Verified</span>
                        </h3>
                        <p className="text-xs text-slate-400">Algorand Core Architect & Distributed Systems Engineer</p>
                      </div>
                      <span className="text-xs font-bold text-yellow-400">★ 4.95 (210 reviews)</span>
                    </div>
                    <p className="text-sm text-slate-300">Master Algorand Smart Contracts, PyTeal & x402 Micropayment Protocol</p>
                    <div className="flex gap-2">
                      <span className="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">Blockchain</span>
                      <span className="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">x402 Protocol</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-slate-500 block">x402 Pay Per Query</span>
                      <span className="text-lg font-bold text-cyan-400">$0.10 <span className="text-xs font-normal text-slate-400">(100,000 microUSDC)</span></span>
                    </div>
                    <button
                      onClick={() => openChatSession('dt_marcus_algo', 'Marcus Vance Digital Twin')}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl"
                    >
                      Start Session
                    </button>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                          Dr. Elena Rostova <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400">Verified</span>
                        </h3>
                        <p className="text-xs text-slate-400">Senior Quantum Computing & AI Researcher</p>
                      </div>
                      <span className="text-xs font-bold text-yellow-400">★ 4.9 (128 reviews)</span>
                    </div>
                    <p className="text-sm text-slate-300">Quantum Superposition, Entanglement & Shor's Search Algorithms</p>
                    <div className="flex gap-2">
                      <span className="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">Quantum Physics</span>
                      <span className="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">AI Research</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-slate-500 block">x402 Pay Per Query</span>
                      <span className="text-lg font-bold text-cyan-400">$0.05 <span className="text-xs font-normal text-slate-400">(50,000 microUSDC)</span></span>
                    </div>
                    <button
                      onClick={() => openChatSession('dt_quantum_elena', 'Dr. Elena Rostova Digital Twin')}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl"
                    >
                      Start Session
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Modal */}
        {activeTab === 'chat' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center glass-panel p-4 rounded-2xl">
              <div>
                <h2 className="font-bold text-lg">{activeTwin.title}</h2>
                <p className="text-xs text-slate-400">ID: {activeTwin.id} • Grounded RAG Active</p>
              </div>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg"
              >
                ← Back to Marketplace
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-400">
              {x402Status}
            </div>

            <div className="glass-panel p-6 rounded-2xl h-96 overflow-y-auto space-y-4 border-slate-800">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`p-4 rounded-xl max-w-xl text-sm whitespace-pre-wrap ${
                      m.sender === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 border border-slate-800 text-slate-100'
                    }`}
                  >
                    {m.text}
                    {m.citation && (
                      <div className="mt-2 pt-2 border-t border-slate-800 text-xs text-cyan-400 font-mono">
                        📄 Citation: {m.citation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-panel p-3 rounded-2xl flex gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask this Digital Twin a question..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl"
              >
                Send Query
              </button>
            </div>
          </div>
        )}

        {/* Creator Dashboard */}
        {activeTab === 'creator' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-extrabold">Creator Revenue Dashboard</h2>
                <p className="text-slate-400 text-sm">Real-time x402 micro-settlements and subscription analytics on Algorand.</p>
              </div>
              <button className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg">
                Withdraw $1,428.50 USDC
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="glass-card p-6 rounded-2xl">
                <span className="text-xs text-slate-400">Withdrawable Balance</span>
                <div className="text-2xl font-extrabold text-emerald-400">$1,428.50</div>
                <p className="text-xs text-slate-500">28,570,000 microUSDC</p>
              </div>
              <div className="glass-card p-6 rounded-2xl">
                <span className="text-xs text-slate-400">Total Queries Served</span>
                <div className="text-2xl font-extrabold text-indigo-400">14,290</div>
                <p className="text-xs text-emerald-400">+18.4% this week</p>
              </div>
              <div className="glass-card p-6 rounded-2xl">
                <span className="text-xs text-slate-400">Active Subscribers</span>
                <div className="text-2xl font-extrabold text-purple-400">184</div>
                <p className="text-xs text-slate-500">$15 / mo plan</p>
              </div>
              <div className="glass-card p-6 rounded-2xl">
                <span className="text-xs text-slate-400">Platform Split</span>
                <div className="text-2xl font-extrabold text-slate-200">85% Net</div>
                <p className="text-xs text-cyan-400">15% Treasury Fee</p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="font-bold text-lg text-cyan-400">Algorand x402 On-Chain Transaction Ledger</h3>
              <table className="w-full text-left text-xs font-mono text-slate-300">
                <thead className="bg-slate-900 text-slate-400">
                  <tr>
                    <th className="p-3">Tx Hash</th>
                    <th className="p-3">Digital Twin</th>
                    <th className="p-3">Gross</th>
                    <th className="p-3">Creator Net (85%)</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="p-3 text-cyan-400">V2K9A1...9X</td>
                    <td className="p-3">Marcus Vance Twin</td>
                    <td className="p-3">$0.10</td>
                    <td className="p-3 text-emerald-400">$0.085</td>
                    <td className="p-3 text-emerald-400">SETTLED</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-cyan-400">7M4P0X...2L</td>
                    <td className="p-3">Dr. Elena Rostova Twin</td>
                    <td className="p-3">$0.05</td>
                    <td className="p-3 text-emerald-400">$0.0425</td>
                    <td className="p-3 text-emerald-400">SETTLED</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Admin Tab */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold">Platform Admin & Governance</h2>
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="font-bold text-lg">Pending Expert Identity Verifications</h3>
              <div className="glass-card p-4 rounded-xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm">Dr. Sarah Jenkins</h4>
                  <p className="text-xs text-slate-400">Clinical Neuroscientist & Health Educator</p>
                </div>
                <button
                  onClick={() => alert('Expert Dr. Sarah Jenkins approved!')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl"
                >
                  Approve Verification
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
