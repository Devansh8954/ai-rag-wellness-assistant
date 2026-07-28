import request from 'supertest';
import { createApp } from '../../src/server';

describe('Chat API Integration Tests', () => {
  const app = createApp();

  it('GET /api/health should return status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('AI RAG Wellness Assistant');
  });

  it('POST /api/chat should return RAG context and response', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: 'How do I manage anxiety with box breathing?', sessionId: 'test-session' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('response');
    expect(res.body).toHaveProperty('ragContext');
    expect(res.body.ragContext.length).toBeGreaterThan(0);
  });

  it('POST /api/chat should return 400 for empty prompt', async () => {
    const res = await request(app).post('/api/chat').send({ prompt: '' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('DELETE /api/chat/memory/:sessionId should clear session memory', async () => {
    const res = await request(app).delete('/api/chat/memory/test-session');
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('test-session');
  });
});
