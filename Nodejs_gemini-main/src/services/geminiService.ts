import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config';
import logger from '../utils/logger';
import { ChatMessage } from './sessionMemory';

const SYSTEM_DIRECTIVE = `You are an empathetic, evidence-based AI Mental Health & Wellness Assistant.
Your goal is to provide supportive, compassionate, and practical guidance based on verified psychological techniques.
Disclaimer: You are an AI assistant, not a licensed therapist or physician. Always advise consulting a medical professional for medical emergencies.`;

export class GeminiService {
  private googleAI: GoogleGenerativeAI | null = null;
  private modelName: string;

  constructor() {
    this.modelName = config.geminiModel || 'gemini-3.6-flash';

    if (config.geminiApiKey) {
      this.googleAI = new GoogleGenerativeAI(config.geminiApiKey);
    } else {
      logger.warn('GEMINI_API_KEY not set — AI fallback mode active.');
    }
  }

  /** Generate a RAG-augmented response with optional conversation history */
  public async generateRAGResponse(userPrompt: string, contextSnippet: string, history: ChatMessage[] = []): Promise<string> {
    if (!this.googleAI) return this.getMockResponse(userPrompt, contextSnippet);

    const historyText = history.map((h) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n');
    const augmented = [
      SYSTEM_DIRECTIVE,
      contextSnippet && `VERIFIED RAG KNOWLEDGE BASE CONTEXT:\n${contextSnippet}`,
      historyText && `CONVERSATION HISTORY:\n${historyText}`,
      `CURRENT USER MESSAGE: ${userPrompt}`,
      '\nPlease provide a warm, empathetic response grounded in the provided context and techniques where applicable.',
    ].filter(Boolean).join('\n\n');

    try {
      const model = this.googleAI.getGenerativeModel({ model: this.modelName });
      const result = await model.generateContent(augmented);
      return result.response.text();
    } catch (err) {
      logger.warn(`Gemini model "${this.modelName}" failed`, { error: (err as Error).message });
      return this.getMockResponse(userPrompt, contextSnippet, (err as Error).message);
    }
  }

  /** Analyze an uploaded image from a wellness perspective */
  public async analyzeImage(promptText: string, imageBuffer: Buffer, mimeType: string): Promise<string> {
    if (!this.googleAI) return 'Mock Image Analysis: A peaceful setting conducive for stress relief and mindfulness.';

    const imagePart = { inlineData: { data: imageBuffer.toString('base64'), mimeType } };
    const prompt = promptText || 'Analyze this image from a wellness perspective:';
    try {
      const model = this.googleAI.getGenerativeModel({ model: this.modelName });
      const result = await model.generateContent([prompt, imagePart] as unknown as string);
      return result.response.text();
    } catch (err) {
      logger.warn('Gemini image analysis failed', { error: (err as Error).message });
      return 'Unable to analyze image. Please verify the API key and image format.';
    }
  }

  /** Evidence-based static response when the API is unavailable */
  private getMockResponse(userPrompt: string, contextSnippet: string, apiError?: string): string {
    let hint = '(Set a valid GEMINI_API_KEY in .env for live AI responses.)';
    if (apiError) {
      if (/429|quota/i.test(apiError))   hint = '(Gemini free-tier rate limit reached — serving RAG response.)';
      else if (/401|403|API key/i.test(apiError)) hint = '(Please verify GEMINI_API_KEY in .env.)';
      else hint = `(Gemini temporarily unavailable — ${apiError.substring(0, 100)}...)`;
    }

    return contextSnippet
      ? `[RAG Assisted Guidance]\n\nBased on established wellness techniques:\n${contextSnippet.split('\n\n')[0]}\n\nRemember to breathe deeply and take things one step at a time. ${hint}`
      : `Thank you for sharing. It sounds like you are reflecting on "${userPrompt}". Box Breathing (4s inhale → 4s hold → 4s exhale) can help calm your nervous system. ${hint}`;
  }
}

export const geminiService = new GeminiService();
