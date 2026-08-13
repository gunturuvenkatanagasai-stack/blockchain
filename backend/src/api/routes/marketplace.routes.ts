import { Router } from 'express';

const router = Router();

const mockListings = [
  {
    id: 'twin_1',
    name: 'Dr. Evelyn Vance AI',
    tagline: 'Distributed Systems & Database Architect',
    description: '15+ years leading high-throughput database design, consensus algorithms, and fault-tolerant cloud engines.',
    category: 'tech',
    pillar: 'practical',
    languages: ['English', 'Spanish'],
    supported_modes: ['teacher', 'mentor', 'interviewer', 'coach', 'practice', 'reviewer', 'voice', 'study'],
    price_per_question_algo: 0.1,
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
    price_per_question_algo: 0.15,
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
    languages: ['English', 'Mandarin'],
    supported_modes: ['teacher', 'interviewer', 'coach', 'reviewer', 'voice'],
    price_per_question_algo: 0.12,
    monthly_subscription_usd: 24.99,
    rating: 4.85,
    total_interactions: 2750,
    expert_name: 'Sarah Chen',
    verification_status: 'verified'
  }
];

// GET /api/v1/marketplace
router.get('/', (req, res) => {
  return res.json({ listings: mockListings });
});

// GET /api/v1/marketplace/search
router.get('/search', (req, res) => {
  const query = ((req.query.q as string) || '').toLowerCase();
  const category = (req.query.category as string) || '';

  let filtered = mockListings;
  if (category && category !== 'all') {
    filtered = filtered.filter((l) => l.category === category);
  }
  if (query) {
    filtered = filtered.filter((l) =>
      l.name.toLowerCase().includes(query) ||
      l.description.toLowerCase().includes(query) ||
      l.tagline.toLowerCase().includes(query)
    );
  }

  return res.json({ listings: filtered, total: filtered.length });
});

// GET /api/v1/marketplace/categories
router.get('/categories', (req, res) => {
  return res.json({
    categories: [
      { id: 'all', label: 'All Domains' },
      { id: 'tech', label: 'Software & Architecture' },
      { id: 'medical', label: 'Medical Education' },
      { id: 'career', label: 'Career & HR Coaching' },
      { id: 'finance', label: 'Business & Finance' }
    ]
  });
});

export default router;
