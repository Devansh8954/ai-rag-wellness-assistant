import { Router, Request, Response } from 'express';
import config from '../config';

export const healthRouter = Router();

healthRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'AI RAG Wellness Assistant',
    environment: config.nodeEnv,
    geminiModel: config.geminiModel,
    timestamp: new Date().toISOString(),
  });
});
