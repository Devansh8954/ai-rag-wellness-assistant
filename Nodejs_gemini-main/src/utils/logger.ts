import winston from 'winston';
import config from '../config';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  config.nodeEnv === 'production'
    ? winston.format.json()
    : winston.format.printf(({ level, message, timestamp, ...meta }) => {
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
        return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaStr}`;
      })
);

export const logger = winston.createLogger({
  level: config.nodeEnv === 'test' ? 'error' : 'info',
  format: logFormat,
  transports: [new winston.transports.Console()],
});

export default logger;
