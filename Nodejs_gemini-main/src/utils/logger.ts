import config from '../config';

const isTest = config.nodeEnv === 'test';

export const logger = {
  info: (msg: string, meta?: object) => !isTest && console.log(`[INFO] ${msg}`, meta ? JSON.stringify(meta) : ''),
  warn: (msg: string, meta?: object) => !isTest && console.warn(`[WARN] ${msg}`, meta ? JSON.stringify(meta) : ''),
  error: (msg: string, meta?: object) => console.error(`[ERROR] ${msg}`, meta ? JSON.stringify(meta) : ''),
  debug: (msg: string, meta?: object) => config.nodeEnv === 'development' && console.debug(`[DEBUG] ${msg}`, meta ? JSON.stringify(meta) : ''),
};

export default logger;
