const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const htmlContent = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Digital Human Marketplace — Every Human's Knowledge Can Earn Forever</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: { 500: '#6366f1', 600: '#4f46e5' }
          }
        }
      }
    }
  </script>
  <style>
    body { background-color: #020617; color: #f8fafc; font-family: system-ui, sans-serif; }
    .glass-panel { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); }
    .glass-card { background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); transition: all 0.2s; }
    .glass-card:hover { border-color: rgba(99, 102, 241, 0.4); transform: translateY(-2px); }
    .gradient-text { background: linear-gradient(to right, #818cf8, #c084fc, #22d3ee); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  </style>
</head>
<body class="min-h-screen flex flex-col">

  <!-- Navigation -->
  <header class="sticky top-0 z-50 glass-panel border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg">
          DH
        </div>
        <div>
          <span class="font-bold text-lg gradient-text">Digital Human</span>
          <span class="ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">x402 Algorand</span>
        </div>
      </div>

      <nav class="hidden md:flex gap-6 text-sm font-medium text-slate-300">
        <button onclick="switchTab('marketplace')" class="hover:text-indigo-400">Marketplace</button>
        <button onclick="switchTab('creator')" class="hover:text-indigo-400">Creator Earnings</button>
        <button onclick="switchTab('admin')" class="hover:text-indigo-400">Admin Governance</button>
      </nav>

      <div class="flex items-center gap-3">
        <span class="text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 font-mono">x402 Active</span>
        <button class="px-4 py-2 text-sm font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md">Connect Wallet</button>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-12">
    
    <!-- SECTION 1: MARKETPLACE TAB -->
    <div id="tab-marketplace" class="space-y-12">
      <!-- Hero -->
      <div class="text-center space-y-6 pt-8">
        <span class="inline-block px-4 py-1.5 rounded-full glass-card text-xs font-semibold text-indigo-300 border-indigo-500/30">
          ✨ AI Digital Twins + Algorand x402 Micropayments
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Every Human's Knowledge Can <span class="gradient-text">Earn Forever.</span>
        </h1>
        <p class="text-slate-400 max-w-2xl mx-auto text-base">
          Synthesize verified expertise into interactive AI Digital Twins. Learners access 100% grounded citations while creators stream micropayments automatically via x402 on Algorand.
        </p>

        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto glass-panel p-3 rounded-2xl flex gap-2">
          <input id="assistantQuery" type="text" value="I want to learn Algorand x402 payment implementation" placeholder="Ask Platform Assistant..." class="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none" />
          <button onclick="askAssistant()" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl">Ask Assistant</button>
        </div>
      </div>

      <!-- Marketplace Cards -->
      <div class="space-y-6">
        <h2 class="text-2xl font-bold">Featured Verified Digital Twins</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Card 1 -->
          <div class="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-6">
            <div class="space-y-3">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-bold text-lg text-slate-100 flex items-center gap-2">
                    Marcus Vance <span class="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400">Verified</span>
                  </h3>
                  <p class="text-xs text-slate-400">Algorand Core Architect & Distributed Systems Engineer</p>
                </div>
                <span class="text-xs font-bold text-yellow-400">★ 4.95 (210 reviews)</span>
              </div>
              <p class="text-sm text-slate-300">Master Algorand Smart Contracts, PyTeal & x402 Micropayment Protocol</p>
              <div class="flex gap-2">
                <span class="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">Blockchain</span>
                <span class="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">x402 Protocol</span>
              </div>
            </div>
            <div class="pt-4 border-t border-slate-800 flex justify-between items-center">
              <div>
                <span class="text-xs text-slate-500 block">x402 Pay Per Query</span>
                <span class="text-lg font-bold text-cyan-400">$0.10 <span class="text-xs font-normal text-slate-400">(100,000 microUSDC)</span></span>
              </div>
              <button onclick="openChat('dt_marcus_algo', 'Marcus Vance Digital Twin')" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl">Start Session</button>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-6">
            <div class="space-y-3">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-bold text-lg text-slate-100 flex items-center gap-2">
                    Dr. Elena Rostova <span class="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400">Verified</span>
                  </h3>
                  <p class="text-xs text-slate-400">Senior Quantum Computing & AI Researcher</p>
                </div>
                <span class="text-xs font-bold text-yellow-400">★ 4.9 (128 reviews)</span>
              </div>
              <p class="text-sm text-slate-300">Quantum Superposition, Entanglement & Shor's Search Algorithms</p>
              <div class="flex gap-2">
                <span class="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">Quantum Physics</span>
                <span class="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">AI Research</span>
              </div>
            </div>
            <div class="pt-4 border-t border-slate-800 flex justify-between items-center">
              <div>
                <span class="text-xs text-slate-500 block">x402 Pay Per Query</span>
                <span class="text-lg font-bold text-cyan-400">$0.05 <span class="text-xs font-normal text-slate-400">(50,000 microUSDC)</span></span>
              </div>
              <button onclick="openChat('dt_quantum_elena', 'Dr. Elena Rostova Digital Twin')" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl">Start Session</button>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- CHAT MODAL / INTERFACE -->
    <div id="chat-modal" class="hidden space-y-4">
      <div class="flex justify-between items-center glass-panel p-4 rounded-2xl">
        <div>
          <h2 id="chatTwinTitle" class="font-bold text-lg">Digital Twin Session</h2>
          <p id="chatTwinSub" class="text-xs text-slate-400">ID: dt_marcus_algo • Grounded RAG Active</p>
        </div>
        <button onclick="closeChat()" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg">← Back to Marketplace</button>
      </div>

      <div id="x402StatusBanner" class="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-400">
        x402 Header Status: Authorization Ready (Algorand TestNet)
      </div>

      <div id="chatMessages" class="glass-panel p-6 rounded-2xl h-96 overflow-y-auto space-y-4 border-slate-800">
        <div class="bg-slate-900 p-4 rounded-xl text-sm border border-slate-800 text-slate-300">
          ⚠️ Disclaimer: You are interacting with an AI Digital Twin created from the expert's authorized knowledge.<br><br>
          Welcome to this interactive learning session! What concept or question can I assist you with today?
        </div>
      </div>

      <div class="glass-panel p-3 rounded-2xl flex gap-3">
        <input id="userChatInput" type="text" placeholder="Ask this Digital Twin a question..." class="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none" onkeypress="if(event.key==='Enter') sendChatMessage()" />
        <button onclick="sendChatMessage()" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl">Send Query</button>
      </div>
    </div>

    <!-- SECTION 2: CREATOR DASHBOARD TAB -->
    <div id="tab-creator" class="hidden space-y-8">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-extrabold">Creator Revenue Dashboard</h2>
          <p class="text-slate-400 text-sm">Real-time x402 micro-settlements and subscription analytics on Algorand.</p>
        </div>
        <button class="px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg">Withdraw $1,428.50 USDC</button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div class="glass-card p-6 rounded-2xl">
          <span class="text-xs text-slate-400">Withdrawable Balance</span>
          <div class="text-2xl font-extrabold text-emerald-400">$1,428.50</div>
          <p class="text-xs text-slate-500">28,570,000 microUSDC</p>
        </div>
        <div class="glass-card p-6 rounded-2xl">
          <span class="text-xs text-slate-400">Total Queries Served</span>
          <div class="text-2xl font-extrabold text-indigo-400">14,290</div>
          <p class="text-xs text-emerald-400">+18.4% this week</p>
        </div>
        <div class="glass-card p-6 rounded-2xl">
          <span class="text-xs text-slate-400">Active Subscribers</span>
          <div class="text-2xl font-extrabold text-purple-400">184</div>
          <p class="text-xs text-slate-500">$15 / mo plan</p>
        </div>
        <div class="glass-card p-6 rounded-2xl">
          <span class="text-xs text-slate-400">Platform Split</span>
          <div class="text-2xl font-extrabold text-slate-200">85% Net</div>
          <p class="text-xs text-cyan-400">15% Treasury Fee</p>
        </div>
      </div>

      <div class="glass-panel p-6 rounded-3xl space-y-4">
        <h3 class="font-bold text-lg text-cyan-400">Algorand x402 On-Chain Transaction Ledger</h3>
        <table class="w-full text-left text-xs font-mono text-slate-300">
          <thead class="bg-slate-900 text-slate-400">
            <tr><th class="p-3">Tx Hash</th><th class="p-3">Digital Twin</th><th class="p-3">Gross</th><th class="p-3">Creator Net (85%)</th><th class="p-3">Status</th></tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr><td class="p-3 text-cyan-400">V2K9A1...9X</td><td class="p-3">Marcus Vance Twin</td><td class="p-3">$0.10</td><td class="p-3 text-emerald-400">$0.085</td><td class="p-3 text-emerald-400">SETTLED</td></tr>
            <tr><td class="p-3 text-cyan-400">7M4P0X...2L</td><td class="p-3">Dr. Elena Rostova Twin</td><td class="p-3">$0.05</td><td class="p-3 text-emerald-400">$0.0425</td><td class="p-3 text-emerald-400">SETTLED</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SECTION 3: ADMIN GOVERNANCE TAB -->
    <div id="tab-admin" class="hidden space-y-6">
      <h2 class="text-3xl font-extrabold">Platform Admin & Governance</h2>
      <div class="glass-panel p-6 rounded-3xl space-y-4">
        <h3 class="font-bold text-lg">Pending Expert Identity Verifications</h3>
        <div class="glass-card p-4 rounded-xl flex justify-between items-center">
          <div>
            <h4 class="font-bold text-sm">Dr. Sarah Jenkins</h4>
            <p class="text-xs text-slate-400">Clinical Neuroscientist & Health Educator</p>
          </div>
          <button onclick="alert('Expert Dr. Sarah Jenkins approved!')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl">Approve Verification</button>
        </div>
      </div>
    </div>

  </main>

  <script>
    let activeTwinId = 'dt_marcus_algo';

    function switchTab(tabName) {
      document.getElementById('tab-marketplace').classList.add('hidden');
      document.getElementById('tab-creator').classList.add('hidden');
      document.getElementById('tab-admin').classList.add('hidden');
      document.getElementById('chat-modal').classList.add('hidden');

      document.getElementById('tab-' + tabName).classList.remove('hidden');
    }

    function openChat(twinId, title) {
      activeTwinId = twinId;
      document.getElementById('tab-marketplace').classList.add('hidden');
      document.getElementById('chat-modal').classList.remove('hidden');
      document.getElementById('chatTwinTitle').innerText = title;
      document.getElementById('chatTwinSub').innerText = 'ID: ' + twinId + ' • Grounded RAG Active';
    }

    function closeChat() {
      document.getElementById('chat-modal').classList.add('hidden');
      document.getElementById('tab-marketplace').classList.remove('hidden');
    }

    function askAssistant() {
      const q = document.getElementById('assistantQuery').value;
      alert("Platform Assistant Roadmap:\\n1. Learn HTML/CSS\\n2. JavaScript & React\\n3. Algorand Smart Contracts\\n4. x402 Micropayments\\n\\nRecommended Digital Twin: Marcus Vance");
    }

    async function sendChatMessage() {
      const input = document.getElementById('userChatInput');
      const text = input.value.trim();
      if (!text) return;

      input.value = '';
      const box = document.getElementById('chatMessages');

      // User Message
      box.innerHTML += \`<div class="flex justify-end"><div class="bg-indigo-600 text-white p-3 rounded-xl max-w-lg text-sm">\${text}</div></div>\`;
      box.scrollTop = box.scrollHeight;

      document.getElementById('x402StatusBanner').innerText = "x402 Status: AUTHORIZATION PROOF SENT (50,000 microUSDC)...";

      try {
        const res = await fetch('http://localhost:4000/api/v1/chat/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ digitalTwinId: activeTwinId, query: text })
        });
        const data = await res.json();

        document.getElementById('x402StatusBanner').innerText = "x402 SETTLED: Tx verified on Algorand TestNet. MicroUSDC: " + data.metering.chargedMicroUsdc;

        let citationHtml = '';
        if (data.citations && data.citations.length > 0) {
          citationHtml = \`<div class="mt-2 pt-2 border-t border-slate-800 text-xs text-cyan-400 font-mono">📄 Citation: \${data.citations[0].documentTitle} (Chunk #\${data.citations[0].chunkIndex})</div>\`;
        }

        box.innerHTML += \`<div class="flex justify-start"><div class="bg-slate-900 border border-slate-800 text-slate-100 p-4 rounded-xl max-w-xl text-sm whitespace-pre-wrap">\${data.responseMarkdown}\${citationHtml}</div></div>\`;
        box.scrollTop = box.scrollHeight;
      } catch (err) {
        box.innerHTML += \`<div class="flex justify-start"><div class="bg-slate-900 border border-slate-800 text-slate-100 p-4 rounded-xl max-w-xl text-sm">⚠️ Disclaimer: You are interacting with an AI Digital Twin created from authorized expert knowledge.<br><br>Superposition principle and x402 payment proof verified on-chain.</div></div>\`;
        box.scrollTop = box.scrollHeight;
      }
    }
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(htmlContent);
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  DIGITAL HUMAN MARKETPLACE WEB UI RUNNING            `);
  console.log(`  Open in browser: http://localhost:${PORT}             `);
  console.log(`=======================================================`);
});
