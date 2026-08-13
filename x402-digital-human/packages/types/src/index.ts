// ==============================================================================
// DIGITAL HUMAN MARKETPLACE - CORE DOMAIN TYPES & INTERFACES
// ==============================================================================

export enum UserRole {
  LEARNER = 'LEARNER',
  PROFESSIONAL = 'PROFESSIONAL',
  EXPERT = 'EXPERT',
  HEALTHCARE_EDUCATOR = 'HEALTHCARE_EDUCATOR',
  CAREER_MENTOR = 'CAREER_MENTOR',
  BUSINESS_MENTOR = 'BUSINESS_MENTOR',
  ENTERPRISE_ADMIN = 'ENTERPRISE_ADMIN',
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum VerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING_REVIEW = 'PENDING_REVIEW',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export enum DigitalTwinMode {
  TEACHER = 'TEACHER',
  MENTOR = 'MENTOR',
  INTERVIEWER = 'INTERVIEWER',
  COACH = 'COACH',
  PRACTICE = 'PRACTICE',
  REVIEWER = 'REVIEWER',
  STUDY = 'STUDY',
  VOICE = 'VOICE',
}

export enum DocumentStatus {
  UPLOADED = 'UPLOADED',
  PROCESSING = 'PROCESSING',
  INDEXING = 'INDEXING',
  READY = 'READY',
  FAILED = 'FAILED',
}

export enum SubscriptionTier {
  PAY_PER_USE = 'PAY_PER_USE',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL',
  ENTERPRISE = 'ENTERPRISE',
}

export enum PaymentMethod {
  X402_ALGORAND = 'X402_ALGORAND',
  FIAT_STRIPE = 'FIAT_STRIPE',
  CREDIT_BALANCE = 'CREDIT_BALANCE',
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  roles: UserRole[];
  algorandAddress?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpertProfile {
  id: string;
  userId: string;
  title: string;
  organization?: string;
  experienceYears: number;
  verificationStatus: VerificationStatus;
  verificationBadgeUrl?: string;
  contentHashRegistryTxId?: string;
  ratingAverage: number;
  totalReviews: number;
}

export interface DigitalTwin {
  id: string;
  expertId: string;
  name: string;
  tagline: string;
  description: string;
  systemPromptInstruction: string;
  primaryLanguage: string;
  supportedModes: DigitalTwinMode[];
  pricePerQueryMicroUsdc: number;
  monthlyPlanPriceMicroUsdc: number;
  version: string;
  isActive: boolean;
  onChainAssetId?: number;
}

export interface KnowledgeDocument {
  id: string;
  digitalTwinId: string;
  title: string;
  fileMimeType: string;
  fileSizeBytes: number;
  storageUrl: string;
  contentHashSha256: string;
  status: DocumentStatus;
  chunkCount: number;
  uploadedAt: Date;
}

export interface KnowledgeChunkCitation {
  documentId: string;
  documentTitle: string;
  chunkId: string;
  chunkIndex: number;
  contentSnippet: string;
  relevanceScore: number;
}

export interface RAGChatResponse {
  conversationId: string;
  messageId: string;
  digitalTwinId: string;
  mode: DigitalTwinMode;
  responseMarkdown: string;
  citations: KnowledgeChunkCitation[];
  disclaimer: string;
  tokensUsed: number;
  x402TransactionId?: string;
}

export interface X402PaymentRequirement {
  version: string;
  network: string;
  priceMicroUsdc: number;
  receiverAddress: string;
  nonce: string;
  assetId: number;
}

export interface CreatorEarningsLedger {
  id: string;
  expertId: string;
  digitalTwinId: string;
  grossAmountMicroUsdc: number;
  platformFeeMicroUsdc: number;
  creatorNetMicroUsdc: number;
  txHash?: string;
  createdAt: Date;
}
