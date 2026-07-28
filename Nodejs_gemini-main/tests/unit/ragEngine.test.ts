import { RAGEngine } from '../../src/services/ragEngine';

describe('RAGEngine Vector Context Retrieval', () => {
  let rag: RAGEngine;

  beforeEach(() => {
    rag = new RAGEngine();
  });

  it('should retrieve relevant grounding document for anxiety query', () => {
    const result = rag.retrieve('I am having a panic attack and feeling anxious');
    expect(result.documents.length).toBeGreaterThan(0);
    expect(result.documents[0].category).toBe('anxiety');
    expect(result.scores[0]).toBeGreaterThan(0);
    expect(result.contextSnippet).toContain('5-4-3-2-1');
  });

  it('should retrieve sleep hygiene document for insomnia query', () => {
    const result = rag.retrieve('I cannot sleep and have severe insomnia');
    expect(result.documents.length).toBeGreaterThan(0);
    expect(result.documents[0].category).toBe('sleep');
    expect(result.contextSnippet).toContain('Sleep Hygiene');
  });

  it('should return empty result for completely empty or irrelevent query', () => {
    const result = rag.retrieve('');
    expect(result.documents.length).toBe(0);
    expect(result.scores.length).toBe(0);
    expect(result.contextSnippet).toBe('');
  });
});
