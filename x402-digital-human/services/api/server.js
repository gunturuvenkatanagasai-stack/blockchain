const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 4000;
const TREASURY_ADDRESS = process.env.PLATFORM_TREASURY_ADDRESS || 'GD64YIY3TWGDMCNPP55XYVU7BCAQX6DGD7LVAOIWOC26NWGD7LVAOIWOC26';

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-402-Payment-Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let bodyText = '';
  req.on('data', chunk => { bodyText += chunk; });
  req.on('end', () => {
    let body = {};
    try { if (bodyText) body = JSON.parse(bodyText); } catch (e) {}

    // 1. Health Check
    if (pathname === '/health' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'HEALTHY',
        service: 'Digital Human Marketplace API Gateway',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // 2. Auth Login
    if (pathname === '/api/v1/auth/login' && method === 'POST') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: 'Login successful',
        user: { id: 'usr_101', email: body.email || 'learner@example.com', fullName: 'Demo Learner', roles: ['LEARNER'] },
        accessToken: 'mock_jwt_access_token_digital_human'
      }));
      return;
    }

    // 3. Experts Listing
    if (pathname === '/api/v1/experts' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        experts: [
          {
            id: 'exp_1',
            name: 'Dr. Elena Rostova',
            title: 'Senior Quantum Computing & AI Researcher',
            verificationStatus: 'VERIFIED',
            ratingAverage: 4.9,
            digitalTwinId: 'dt_quantum_elena',
            pricePerQueryMicroUsdc: 50000
          },
          {
            id: 'exp_2',
            name: 'Marcus Vance',
            title: 'Principal Algorand Architect & Distributed Systems Engineer',
            verificationStatus: 'VERIFIED',
            ratingAverage: 4.95,
            digitalTwinId: 'dt_marcus_algo',
            pricePerQueryMicroUsdc: 100000
          }
        ]
      }));
      return;
    }

    // 4. RAG Chat Endpoint
    if (pathname === '/api/v1/chat/query' && method === 'POST') {
      const digitalTwinId = body.digitalTwinId || 'dt_quantum_elena';
      const mode = body.mode || 'TEACHER';
      const query = body.query || '';

      let responseMarkdown = "⚠️ Disclaimer: You are interacting with an AI Digital Twin created from the expert's authorized knowledge.\n\n";
      let citations = [];

      if (digitalTwinId === 'dt_marcus_algo' || query.toLowerCase().includes('x402') || query.toLowerCase().includes('algorand')) {
        responseMarkdown += "The x402 payment protocol on Algorand leverages HTTP status code 402 (Payment Required). When an API endpoint requires payment, the server responds with a 402 status specifying payment requirements. Once the client provides a signed transaction proof in the `X-402-Payment-Authorization` header, the server verifies the transaction on-chain via the Algorand Indexer/Algod node and fulfills the API response.";
        citations = [
          { documentTitle: 'Algorand x402 Protocol Architecture Specification v2.11', chunkIndex: 12, relevanceScore: 0.98 }
        ];
      } else {
        responseMarkdown += "Quantum superposition enables a qubit to exist simultaneously in linear combinations of |0⟩ and |1⟩. In quantum algorithms, quantum phase estimation delivers quadratic or exponential speedup over classical computation.";
        citations = [
          { documentTitle: 'Principles of Quantum Information Theory (Dr. Elena Rostova)', chunkIndex: 88, relevanceScore: 0.96 }
        ];
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        conversationId: `conv_${Date.now()}`,
        messageId: `msg_${Date.now()}`,
        digitalTwinId,
        mode,
        responseMarkdown,
        citations,
        metering: {
          chargedMicroUsdc: 50000,
          creatorEarnedMicroUsdc: 42500,
          platformFeeMicroUsdc: 7500
        }
      }));
      return;
    }

    // 5. x402 Header Challenge
    if (pathname === '/api/v1/x402/challenge' && method === 'GET') {
      res.writeHead(402, {
        'Content-Type': 'application/json',
        'WWW-Authenticate': `x402 realm="Digital Human API", price="50000", receiver="${TREASURY_ADDRESS}", asset="104928120"`
      });
      res.end(JSON.stringify({
        status: 402,
        message: 'Payment Required under x402 Protocol',
        paymentRequirement: {
          version: '2.11.0',
          network: 'algorand-testnet',
          priceMicroUsdc: 50000,
          receiverAddress: TREASURY_ADDRESS,
          assetId: 104928120
        }
      }));
      return;
    }

    // Fallback 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  DIGITAL HUMAN MARKETPLACE API GATEWAY RUNNING       `);
  console.log(`  URL: http://localhost:${PORT}                         `);
  console.log(`  Health Check: http://localhost:${PORT}/health         `);
  console.log(`=======================================================`);
});
