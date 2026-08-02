import dotenv from 'dotenv';
import path from 'path';

// Load .env from multiple possible locations (root, src, and two levels up)
['.env', '../.env', '../../.env'].forEach((p) =>
  dotenv.config({ path: path.resolve(__dirname, p) })
);

export interface AppConfig {
  port: number;
  nodeEnv: string;
  geminiApiKey: string;
  geminiModel: string;
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY || process.env.API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
};

export default config;
