# User Stories & Acceptance Criteria

This document details the user stories across all 8 supported roles in the **Digital Human Marketplace**.

---

## 1. Learner Persona Stories

### US-L01: Structured Subject Learning
- **As a** Learner / Student,
- **I want to** select a Digital Twin (e.g., Physics Professor) and learn in "Teacher" mode,
- **So that** I can receive step-by-step concept explanations with cited source materials.
- **Acceptance Criteria**:
  1. User can choose "Teacher Mode" on any verified expert page.
  2. Responses break down complex topics into clear sections with citation links.
  3. User can generate follow-up quizzes or revision flashcards.

### US-L02: Goal-Oriented Roadmap
- **As a** Learner,
- **I want to** inform the Platform Assistant of my learning goal (e.g., "Learn Full-Stack Web Development"),
- **So that** it generates a step-by-step roadmap and recommends relevant verified Digital Humans.
- **Acceptance Criteria**:
  1. Platform Assistant identifies skill gaps and outputs a ordered curriculum (Step 1 to Step N).
  2. Assistant highlights top 3 verified Digital Humans matching the curriculum topics.

---

## 2. Professional Persona Stories

### US-P01: Mock Technical Interview
- **As a** Job Seeker / Professional,
- **I want to** practice a live coding interview with a Digital Twin in "Interviewer" mode,
- **So that** I get realistic interview questions and immediate feedback on my code and answers.
- **Acceptance Criteria**:
  1. Digital Twin asks 1 technical question at a time.
  2. Learner provides code snippet or answer.
  3. Digital Twin critiques response based on clean code standards and time complexity.

### US-P02: Resume ATS Analysis
- **As a** Professional,
- **I want to** upload my resume for analysis against target job descriptions,
- **So that** I receive ATS compatibility scores and formatting improvements.
- **Acceptance Criteria**:
  1. System extracts resume text and performs keyword match against target JD.
  2. System provides breakdown: ATS Score, Missing Keywords, Strengths, Weaknesses.

---

## 3. Expert Persona Stories

### US-E01: Expert Onboarding & Knowledge Upload
- **As an** Expert / Creator,
- **I want to** upload my books, papers, and lecture transcripts and configure a Digital Twin,
- **So that** my knowledge can be monetized 24/7 without spending manual time.
- **Acceptance Criteria**:
  1. Wizard guides expert through identity verification, document upload, and twin behavior setup.
  2. Document processing engine ingests files and presents status (`PROCESSING` -> `READY`).
  3. On-chain Content Hash is registered upon submission.

### US-E02: Monetization & Revenue Dashboard
- **As an** Expert,
- **I want to** view my earnings, subscriber metrics, and pay-per-use micropayments in real-time,
- **So that** I can track my passive income and withdraw funds to my wallet.
- **Acceptance Criteria**:
  1. Dashboard graphs daily revenue, x402 transaction hashes, active subscribers, and popular topics.
  2. "Withdraw" button permits withdrawing settled balances to creator wallet.

---

## 4. Healthcare Educator Persona Stories

### US-H01: Health Education & Wellness Guidance
- **As a** Verified Healthcare Educator,
- **I want to** publish educational content regarding nutrition and preventive healthcare,
- **So that** users receive evidence-based health information safely.
- **Acceptance Criteria**:
  1. Mandatory legal disclaimers appear on all interactions: *"This content is for educational purposes only and does not constitute medical diagnosis or treatment."*
  2. System rejects attempts to ask the Digital Twin to prescribe drugs or diagnose acute symptoms.

---

## 5. Career Mentor Persona Stories

### US-C01: Portfolio & Career Coaching
- **As a** Career Mentor,
- **I want** my Digital Twin to evaluate learner portfolios and career transition plans,
- **So that** mentees receive actionable advice aligned with my industry experience.
- **Acceptance Criteria**:
  1. Twin reviews uploaded portfolio links or text.
  2. Twin provides structured advice in "Coach Mode" with actionable steps.

---

## 6. Business Mentor Persona Stories

### US-B01: Pitch Deck & Strategy Coaching
- **As a** Startup Founder / Business Mentor,
- **I want to** configure my Digital Twin to evaluate business models and pitch deck narratives,
- **So that** early-stage entrepreneurs receive structured feedback on fundraising and GTM.
- **Acceptance Criteria**:
  1. Twin analyzes uploaded deck slides/text for value prop, market size, and unit economics clarity.

---

## 7. Enterprise Admin Persona Stories

### US-EN01: Private Corporate Vault & Employee Licensing
- **As an** Enterprise Admin,
- **I want to** deploy internal Digital Twins accessible exclusively to company employees,
- **So that** internal knowledge transfer is streamlined securely.
- **Acceptance Criteria**:
  1. Private twin visibility restricted to organization members.
  2. Enterprise usage analytics display team-level metrics and seat consumption.

---

## 8. Platform Administrator Persona Stories

### US-A01: Verification Review & Moderation
- **As a** Platform Administrator,
- **I want to** review submitted expert credentials and flag suspicious or unsafe Digital Twins,
- **So that** platform quality and user safety are guaranteed.
- **Acceptance Criteria**:
  1. Admin dashboard lists pending verification requests with uploaded credentials.
  2. Admin can approve (`VERIFIED`), reject (`REJECTED`), or request additional proof.
