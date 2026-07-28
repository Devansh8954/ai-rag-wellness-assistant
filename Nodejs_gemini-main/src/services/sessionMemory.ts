import logger from '../utils/logger';

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: Date;
}

export class SessionMemoryService {
  private sessions: Map<string, ChatMessage[]>;
  private maxHistoryPerSession: number;

  constructor(maxHistory = 10) {
    this.sessions = new Map();
    this.maxHistoryPerSession = maxHistory;
  }

  public getHistory(sessionId: string): ChatMessage[] {
    return this.sessions.get(sessionId) || [];
  }

  public addMessage(sessionId: string, role: 'user' | 'model', content: string): void {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, []);
    }

    const history = this.sessions.get(sessionId)!;
    history.push({
      role,
      content,
      timestamp: new Date(),
    });

    if (history.length > this.maxHistoryPerSession * 2) {
      this.sessions.set(sessionId, history.slice(-this.maxHistoryPerSession * 2));
    }

    logger.debug('Session message appended', { sessionId, role, totalMessages: history.length });
  }

  public clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}

export const sessionMemory = new SessionMemoryService();
