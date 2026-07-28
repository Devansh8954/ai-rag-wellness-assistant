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

  // Helmet with relaxed CSP for local/embedded UI
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Serve static UI frontend
  const publicPath = path.join(__dirname, '../public');
  app.use(express.static(publicPath));

  app.get('/', (_req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });

  // API Routes
  app.use('/api', healthRouter);
  app.use('/api', chatRouter);

  // 404 Handler
  app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  return app;
}

if (process.env.NODE_ENV !== 'test') {
  const app = createApp();
  app.listen(config.port, () => {
    logger.info('🚀 AI RAG Wellness Assistant Platform started', {
      port: config.port,
      env: config.nodeEnv,
      model: config.geminiModel,
    });
  });
}
