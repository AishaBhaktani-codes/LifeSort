import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  databaseUrl: process.env.DATABASE_URL,
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
  },
  huggingface: {
    token: process.env.HF_TOKEN,
  },
  tee: {
    masterSecret: process.env.TEE_MASTER_SECRET, // Must be 32 bytes hex string for AES-256
  }
};
