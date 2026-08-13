# DATABASE SCHEMA SPECIFICATION (PostgreSQL + Prisma)

## Overview
The database layer uses PostgreSQL with the `pgvector` extension. All 31 required domain entities are fully modeled below in Prisma Schema syntax.

---

## Prisma Schema Specification

```prisma
datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgvector(map: "vector")]
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

enum Role {
  STUDENT
  USER
  EXPERT
  HEALTHCARE_EXPERT
  ADMIN
  ENTERPRISE
}

enum VerificationStatus {
  PENDING
  VERIFIED
  REJECTED
  SUSPENDED
}

enum DigitalHumanStatus {
  DRAFT
  PROCESSING
  TESTING
  PUBLISHED
  SUSPENDED
  ARCHIVED
}

enum PricingType {
  PAY_PER_USE
  WEEKLY
  MONTHLY
  ANNUAL
  ENTERPRISE
}

enum LoRAStatus {
  QUEUED
  TRAINING
  EVALUATING
  FAILED
  PENDING_APPROVAL
  PUBLISHED
  ARCHIVED
}

model User {
  id                String             @id @default(uuid())
  email             String             @unique
  passwordHash      String
  role              Role               @default(USER)
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
  expert            Expert?
  wallets           Wallet[]
  subscriptions     Subscription[]
  conversations     Conversation[]
  usageRecords      UsageRecord[]
  payments          Payment[]
  ratings           Rating[]
  reviews           Review[]
  notifications     Notification[]
  auditLogs         AuditLog[]
  enterpriseLicenses EnterpriseLicense[]
}

model Expert {
  id                 String             @id @default(uuid())
  userId             String             @unique
  user               User               @relation(fields: [userId], references: [id])
  name               String
  title              String
  bio                String
  expertise          String[]
  languages          String[]
  experience         Int
  categories         String[]
  walletAddress      String
  verificationStatus VerificationStatus @default(PENDING)
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt
  verifications      ExpertVerification[]
  digitalHumans      DigitalHuman[]
  creatorBalance     CreatorBalance?
  revenues           Revenue[]
}

model ExpertVerification {
  id           String             @id @default(uuid())
  expertId     String
  expert       Expert             @relation(fields: [expertId], references: [id])
  documents    String[]
  status       VerificationStatus @default(PENDING)
  reviewedBy   String?
  reviewNotes  String?
  createdAt    DateTime           @default(now())
}

model DigitalHuman {
  id                 String             @id @default(uuid())
  expertId           String
  expert             Expert             @relation(fields: [expertId], references: [id])
  name               String
  description        String
  category           String
  languages          String[]
  avatar             String?
  voice              String?
  personality        String
  communicationStyle String
  knowledgeVersion   Int                @default(1)
  status             DigitalHumanStatus @default(DRAFT)
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt
  knowledgeDocs      KnowledgeDocument[]
  knowledgeChunks    KnowledgeChunk[]
  loraAdapters       LoRAAdapter[]
  conversations      Conversation[]
  pricingPlans       PricingPlan[]
  subscriptions      Subscription[]
  marketplaceListing MarketplaceListing?
  licenses           License[]
  usageRecords       UsageRecord[]
}

model KnowledgeDocument {
  id             String            @id @default(uuid())
  digitalHumanId String
  digitalHuman   DigitalHuman      @relation(fields: [digitalHumanId], references: [id])
  fileName       String
  fileType       String
  fileSize       Int
  storageUri     String
  contentHash    String            @unique
  version        Int               @default(1)
  createdAt      DateTime          @default(now())
  chunks         KnowledgeChunk[]
}

model KnowledgeVersion {
  id             String   @id @default(uuid())
  digitalHumanId String
  version        Int
  description    String
  createdAt      DateTime @default(now())
}

model KnowledgeChunk {
  id               String            @id @default(uuid())
  documentId       String
  document         KnowledgeDocument @relation(fields: [documentId], references: [id])
  digitalHumanId   String
  digitalHuman     DigitalHuman      @relation(fields: [digitalHumanId], references: [id])
  knowledgeVersion Int
  chunkIndex       Int
  content          String
  page             Int?
  section          String?
  source           String
  contentHash      String
  embedding        Unsupported("vector(1536)")?
  createdAt        DateTime          @default(now())
  citations        Citation[]
}

model LoRAAdapter {
  id                   String     @id @default(uuid())
  digitalHumanId       String
  digitalHuman         DigitalHuman @relation(fields: [digitalHumanId], references: [id])
  baseModel            String
  adapterVersion       String
  storageUri           String
  trainingDatasetHash  String
  trainingConfig       Json
  evaluationScore      Float?
  status               LoRAStatus @default(QUEUED)
  createdAt            DateTime   @default(now())
}

model AIModel {
  id           String   @id @default(uuid())
  name         String
  provider     String
  version      String
  active       Boolean  @default(true)
}

model Conversation {
  id             String       @id @default(uuid())
  userId         String
  user           User         @relation(fields: [userId], references: [id])
  digitalHumanId String
  digitalHuman   DigitalHuman @relation(fields: [digitalHumanId], references: [id])
  createdAt      DateTime     @default(now())
  messages       Message[]
}

model Message {
  id             String       @id @default(uuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  sender         String
  content        String
  mode           String       @default("teacher")
  createdAt      DateTime     @default(now())
  aiRequests     AIRequest[]
  aiResponses    AIResponse[]
}

model AIRequest {
  id             String      @id @default(uuid())
  messageId      String
  message        Message     @relation(fields: [messageId], references: [id])
  prompt         String
  digitalHumanId String
  createdAt      DateTime    @default(now())
  aiResponses    AIResponse[]
}

model AIResponse {
  id          String     @id @default(uuid())
  requestId   String
  request     AIRequest  @relation(fields: [requestId], references: [id])
  messageId   String
  message     Message    @relation(fields: [messageId], references: [id])
  response    String
  tokensUsed  Int
  latencyMs   Int
  createdAt   DateTime   @default(now())
  citations   Citation[]
}

model Citation {
  id           String         @id @default(uuid())
  aiResponseId String
  aiResponse   AIResponse     @relation(fields: [aiResponseId], references: [id])
  chunkId      String
  chunk        KnowledgeChunk @relation(fields: [chunkId], references: [id])
  confidence   Float
}

model MarketplaceListing {
  id             String       @id @default(uuid())
  digitalHumanId String       @unique
  digitalHuman   DigitalHuman @relation(fields: [digitalHumanId], references: [id])
  featured       Boolean      @default(false)
  rating         Float        @default(5.0)
  totalReviews   Int          @default(0)
  active         Boolean      @default(true)
}

model PricingPlan {
  id             String       @id @default(uuid())
  digitalHumanId String
  digitalHuman   DigitalHuman @relation(fields: [digitalHumanId], references: [id])
  type           PricingType
  price          Float
  currency       String       @default("microUSDC")
  usageLimit     Int?
  active         Boolean      @default(true)
}

model Subscription {
  id             String       @id @default(uuid())
  userId         String
  user           User         @relation(fields: [userId], references: [id])
  digitalHumanId String
  digitalHuman   DigitalHuman @relation(fields: [digitalHumanId], references: [id])
  type           PricingType
  startDate      DateTime     @default(now())
  expiryDate     DateTime
  status         String       @default("ACTIVE")
}

model UsageRecord {
  id               String       @id @default(uuid())
  userId           String
  user             User         @relation(fields: [userId], references: [id])
  digitalHumanId   String
  digitalHuman     DigitalHuman @relation(fields: [digitalHumanId], references: [id])
  requestId        String       @unique
  paymentReference String
  tokens           Int
  cost             Float
  timestamp        DateTime     @default(now())
}

model Payment {
  id               String   @id @default(uuid())
  userId           String
  user             User     @relation(fields: [userId], references: [id])
  amount           Float
  currency         String
  txHash           String   @unique
  status           String
  timestamp        DateTime @default(now())
}

model PaymentRequirement {
  id           String   @id @default(uuid())
  resourceId   String
  amountMicro  BigInt
  assetId      Int
  payeeAddress String
  nonce        String   @unique
  expiresAt    DateTime
}

model Revenue {
  id           String   @id @default(uuid())
  expertId     String
  expert       Expert   @relation(fields: [expertId], references: [id])
  grossAmount  Float
  platformFee  Float
  creatorShare Float
  timestamp    DateTime @default(now())
}

model CreatorBalance {
  id           String   @id @default(uuid())
  expertId     String   @unique
  expert       Expert   @relation(fields: [expertId], references: [id])
  totalEarned  Float    @default(0.0)
  withdrawn    Float    @default(0.0)
  available    Float    @default(0.0)
  updatedAt    DateTime @updatedAt
}

model License {
  id             String       @id @default(uuid())
  digitalHumanId String
  digitalHuman   DigitalHuman @relation(fields: [digitalHumanId], references: [id])
  licenseHash    String
  grantedTo      String
  expiresAt      DateTime
}

model Enterprise {
  id        String              @id @default(uuid())
  name      String
  apiKey    String              @unique
  licenses  EnterpriseLicense[]
  createdAt DateTime            @default(now())
}

model EnterpriseLicense {
  id           String     @id @default(uuid())
  enterpriseId String
  enterprise   Enterprise @relation(fields: [enterpriseId], references: [id])
  userId       String
  user         User       @relation(fields: [userId], references: [id])
  maxSeats     Int
  active       Boolean    @default(true)
}

model Wallet {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  address    String   @unique
  provider   String
  createdAt  DateTime @default(now())
}

model BlockchainTransaction {
  id           String   @id @default(uuid())
  txHash       String   @unique
  round        BigInt
  sender       String
  receiver     String
  amount       BigInt
  assetId      Int
  type         String
  timestamp    DateTime @default(now())
}

model BlockchainEvent {
  id          String   @id @default(uuid())
  txHash      String
  round       BigInt
  logIndex    Int
  eventType   String
  appId       BigInt
  data        Json
  timestamp   DateTime @default(now())
}

model Rating {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  score     Int
  createdAt DateTime @default(now())
}

model Review {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  content   String
  createdAt DateTime @default(now())
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  title     String
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}

model AuditLog {
  id        String   @id @default(uuid())
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
  action    String
  details   Json
  timestamp DateTime @default(now())
}
```
