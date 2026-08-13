import { Router, Request, Response } from 'express';
import { DigitalTwinMode } from '@x402-digital-human/types';

export const digitalTwinsRouter = Router();

const mockDigitalTwins = new Map<string, any>([
  [
    'dt_quantum_elena',
    {
      id: 'dt_quantum_elena',
      expertId: 'exp_1',
      name: 'Dr. Elena Rostova AI Twin',
      tagline: 'Quantum Computing, Entanglement & Quantum Algorithms Specialist',
      description: 'Interactive Digital Twin synthesized from 14 years of research, peer-reviewed journals, and lecture series on Quantum Information Theory.',
      systemPromptInstruction: 'You are interacting with an AI Digital Twin created from Dr. Elena Rostova’s authorized knowledge.',
      primaryLanguage: 'en',
      supportedModes: [
        DigitalTwinMode.TEACHER,
        DigitalTwinMode.MENTOR,
        DigitalTwinMode.PRACTICE,
        DigitalTwinMode.VOICE
      ],
      pricePerQueryMicroUsdc: 50000,
      monthlyPlanPriceMicroUsdc: 10000000,
      version: '1.2.0',
      isActive: true,
      onChainAssetId: 104928120
    }
  ],
  [
    'dt_marcus_algo',
    {
      id: 'dt_marcus_algo',
      expertId: 'exp_2',
      name: 'Marcus Vance Algorand & x402 Digital Twin',
      tagline: 'Master Algorand Smart Contracts, x402 Micropayments & Distributed Systems',
      description: 'Grounded AI Digital Twin providing hands-on code reviews, architecture guidance, and x402 implementation tutorials.',
      systemPromptInstruction: 'You are interacting with an AI Digital Twin created from Marcus Vance’s authorized knowledge base.',
      primaryLanguage: 'en',
      supportedModes: [
        DigitalTwinMode.TEACHER,
        DigitalTwinMode.INTERVIEWER,
        DigitalTwinMode.REVIEWER,
        DigitalTwinMode.VOICE
      ],
      pricePerQueryMicroUsdc: 100000,
      monthlyPlanPriceMicroUsdc: 15000000,
      version: '2.0.1',
      isActive: true,
      onChainAssetId: 104928125
    }
  ]
]);

// GET /api/v1/digital-twins/:id
digitalTwinsRouter.get('/:id', (req: Request, res: Response) => {
  const twin = mockDigitalTwins.get(req.params.id);
  if (!twin) {
    return res.status(404).json({ error: 'Digital Twin not found' });
  }
  return res.json({ digitalTwin: twin });
});

// POST /api/v1/digital-twins
digitalTwinsRouter.post('/', (req: Request, res: Response) => {
  const { expertId, name, tagline, description, supportedModes, pricePerQueryMicroUsdc } = req.body;
  if (!expertId || !name) {
    return res.status(400).json({ error: 'expertId and name are required' });
  }

  const id = `dt_${Date.now()}`;
  const newTwin = {
    id,
    expertId,
    name,
    tagline: tagline || 'Domain Knowledge Digital Twin',
    description: description || 'Authorized AI Digital Twin',
    systemPromptInstruction: `You are interacting with an AI Digital Twin created from authorized expert knowledge.`,
    primaryLanguage: 'en',
    supportedModes: supportedModes || [DigitalTwinMode.TEACHER, DigitalTwinMode.MENTOR],
    pricePerQueryMicroUsdc: pricePerQueryMicroUsdc || 50000,
    monthlyPlanPriceMicroUsdc: 10000000,
    version: '1.0.0',
    isActive: true,
    createdAt: new Date()
  };

  mockDigitalTwins.set(id, newTwin);
  return res.status(201).json({ message: 'Digital Twin configured and active', digitalTwin: newTwin });
});
