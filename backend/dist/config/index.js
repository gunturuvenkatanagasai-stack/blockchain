"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 8000,
    jwtSecret: process.env.JWT_SECRET || 'x402_super_secret_jwt_key_2026',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'x402_super_secret_refresh_key_2026',
    databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/x402_db',
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8001',
    algorand: {
        network: process.env.ALGORAND_NETWORK || 'testnet',
        nodeUrl: process.env.ALGORAND_RPC_URL || 'https://testnet-api.algonode.cloud',
        indexerUrl: process.env.ALGORAND_INDEXER_URL || 'https://testnet-idx.algonode.cloud',
        treasuryAddress: process.env.TREASURY_ADDRESS || 'ABGJ7R7JNNV2XNHGL2LFKQKS5VIL5RVLH5C6MXSHOBDRBHVEAPTYY4SXEM',
    },
    x402: {
        usdcAssetId: parseInt(process.env.X402_USDC_ASSET_ID || '31566704', 10),
        defaultMicroUsdcPrice: 50000, // 0.05 USDC per question
    }
};
