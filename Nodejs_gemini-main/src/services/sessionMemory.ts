import logger from '../utils/logger';

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: Date;
}

export class SessionMemoryService {
  private sessions = new Map<string, ChatMessage[]>();
  private readonly maxHistory: number;

  constructor(maxHistory = 10) {
    this.maxHistory = maxHistory;
  }

  public getHistory(sessionId: string): ChatMessage[] {
    return this.sessions.get(sessionId) ?? [];
  }

  public addMessage(sessionId: string, role: 'user' | 'model', content: string): void {
    const history = this.sessions.get(sessionId) ?? [];
    history.push({ role, content, timestamp: new Date() });

    // Keep last N*2 messages (N turns = N user + N model messages)
    const trimmed = history.length > this.maxHistory * 2 ? history.slice(-this.maxHistory * 2) : history;
    this.sessions.set(sessionId, trimmed);

    logger.debug('Session message appended', { sessionId, role, totalMessages: trimmed.length });
  }

  public clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}

export const sessionMemory = new SessionMemoryService();
