import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import config from './config';
import logger from './utils/logger';
import { chatRouter } from './routes/chat';
import { healthRouter } from './routes/health';

export function createApp() {
  const app = express();
  const publicPath = path.join(__dirname, '../public');

  // Security + parsing middleware
  app.use(helmet({ contentSecurityPolicy: false })); // CSP disabled for embedded UI
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Static frontend + root route
  app.use(express.static(publicPath));
  app.get('/', (_req, res) => res.sendFile(path.join(publicPath, 'index.html')));

  // API routes
  app.use('/api', healthRouter);
  app.use('/api', chatRouter);

  // 404 catch-all
  app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

  return app;
}

// Start server only outside test environment
if (process.env.NODE_ENV !== 'test') {
  const app = createApp();
  app.listen(config.port, () =>
    logger.info('🚀 AI RAG Wellness Assistant Platform started', {
      port: config.port,
      env: config.nodeEnv,
      model: config.geminiModel,
    })
  );
}
