import logger from '../utils/logger';

export interface KnowledgeDocument {
  id: string;
  category: 'anxiety' | 'depression' | 'stress' | 'sleep' | 'mindfulness' | 'general';
  title: string;
  content: string;
  tags: string[];
}

export interface RetrievalResult {
  documents: KnowledgeDocument[];
  scores: number[];
  contextSnippet: string;
}

/**
 * Curated Mental Health & Wellness RAG Knowledge Base
 */
const KNOWLEDGE_BASE: KnowledgeDocument[] = [
  {
    id: 'kb-anxiety-01',
    category: 'anxiety',
    title: '5-4-3-2-1 Grounding Technique for Acute Anxiety',
    content: 'The 5-4-3-2-1 technique is a sensory grounding exercise to calm anxiety and panic attacks. Identify 5 things you see, 4 things you can physically touch, 3 things you hear, 2 things you smell, and 1 thing you taste. Take slow, deep breaths throughout.',
    tags: ['anxiety', 'panic', 'grounding', 'sensory', 'calm'],
  },
  {
    id: 'kb-anxiety-02',
    category: 'anxiety',
    title: 'Box Breathing for Nervous System Regulation',
    content: 'Box breathing activates the parasympathetic nervous system: Inhale deeply through your nose for 4 seconds, hold your breath for 4 seconds, exhale slowly through your mouth for 4 seconds, and hold empty for 4 seconds. Repeat for 4 cycles.',
    tags: ['breathing', 'panic', 'stress', 'vagus nerve'],
  },
  {
    id: 'kb-sleep-01',
    category: 'sleep',
    title: 'Sleep Hygiene & Progressive Muscle Relaxation',
    content: 'Improve sleep quality by maintaining a consistent sleep schedule, limiting screens 1 hour before bed, and practicing Progressive Muscle Relaxation (PMR): tense each muscle group from toes to forehead for 5 seconds, then release slowly.',
    tags: ['sleep', 'insomnia', 'relaxation', 'routine'],
  },
  {
    id: 'kb-stress-01',
    category: 'stress',
    title: 'Cognitive Reframing for Overwhelming Thoughts',
    content: 'Cognitive reframing involves identifying automatic negative thoughts (ANTs), examining evidence for and against them, and forming balanced alternative thoughts. Ask yourself: "Is this thought a factual guarantee or a feeling?"',
    tags: ['cbt', 'reframing', 'stress', 'thoughts', 'overthinking'],
  },
  {
    id: 'kb-mindfulness-01',
    category: 'mindfulness',
    title: 'Mindful Body Scan Meditation',
    content: 'A body scan helps reconnect your mind with physical sensations. Focus attention sequentially on your feet, calves, knees, hips, abdomen, chest, shoulders, and head, noticing tension without judgment and releasing it on each exhale.',
    tags: ['mindfulness', 'meditation', 'body scan', 'calm'],
  },
  {
    id: 'kb-general-01',
    category: 'general',
    title: 'Daily Self-Care & Habit Stacking',
    content: 'Build mental resilience through small daily routines: 15 minutes of physical movement, 10 minutes of hydration and sun exposure in the morning, and journaling 3 things you are grateful for before sleep.',
    tags: ['habits', 'routine', 'self-care', 'wellness'],
  },
];

/**
 * TF-IDF / Term Frequency Cosine Vector Retrieval Engine
 */
export class RAGEngine {
  private documents: KnowledgeDocument[];

  constructor(customDocs?: KnowledgeDocument[]) {
    this.documents = customDocs || KNOWLEDGE_BASE;
  }

  /**
   * Vector Similarity Retrieval
   * Calculates similarity between user query and knowledge documents
   */
  public retrieve(query: string, topK = 2): RetrievalResult {
    const queryTokens = this.tokenize(query);

    if (queryTokens.length === 0) {
      return { documents: [], scores: [], contextSnippet: '' };
    }

    const scored = this.documents.map((doc) => {
      const docTokens = this.tokenize(`${doc.title} ${doc.content} ${doc.tags.join(' ')}`);
      const score = this.calculateSimilarity(queryTokens, docTokens);
      return { doc, score };
    });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    // Filter documents with non-zero relevance
    const topMatches = scored.filter((item) => item.score > 0.05).slice(0, topK);

    const documents = topMatches.map((m) => m.doc);
    const scores = topMatches.map((m) => parseFloat(m.score.toFixed(3)));

    const contextSnippet = documents
      .map((d) => `[Reference (${d.title})]: ${d.content}`)
      .join('\n\n');

    logger.info('RAG context retrieved', {
      query,
      matchesCount: documents.length,
      topScores: scores,
    });

    return { documents, scores, contextSnippet };
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((t) => t.length > 2);
  }

  private calculateSimilarity(queryTokens: string[], docTokens: string[]): number {
    const queryFreq: Record<string, number> = {};
    const docFreq: Record<string, number> = {};

    queryTokens.forEach((t) => (queryFreq[t] = (queryFreq[t] || 0) + 1));
    docTokens.forEach((t) => (docFreq[t] = (docFreq[t] || 0) + 1));

    let dotProduct = 0;
    let queryMag = 0;
    let docMag = 0;

    Object.keys(queryFreq).forEach((token) => {
      const qVal = queryFreq[token];
      queryMag += qVal * qVal;
      if (docFreq[token]) {
        dotProduct += qVal * docFreq[token];
      }
    });

    Object.values(docFreq).forEach((val) => {
      docMag += val * val;
    });

    if (queryMag === 0 || docMag === 0) return 0;
    return dotProduct / (Math.sqrt(queryMag) * Math.sqrt(docMag));
  }
}

export const ragEngine = new RAGEngine();
