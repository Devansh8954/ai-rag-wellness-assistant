import logger from '../utils/logger';

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: Date;
}

const sessions = new Map<string, ChatMessage[]>();
const MAX_HISTORY = 10;

export const sessionMemory = {
  getHistory(sessionId: string): ChatMessage[] {
    return sessions.get(sessionId) ?? [];
  },

  addMessage(sessionId: string, role: 'user' | 'model', content: string): void {
    const history = sessions.get(sessionId) ?? [];
    history.push({ role, content, timestamp: new Date() });

    const trimmed = history.length > MAX_HISTORY * 2 ? history.slice(-MAX_HISTORY * 2) : history;
    sessions.set(sessionId, trimmed);

    logger.debug('Session message appended', { sessionId, role, totalMessages: trimmed.length });
  },

  clearSession(sessionId: string): void {
    sessions.delete(sessionId);
  },
};
