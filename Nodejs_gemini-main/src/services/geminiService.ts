import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config';
import logger from '../utils/logger';
import { ChatMessage } from './sessionMemory';

export class GeminiService {
  private googleAI: GoogleGenerativeAI | null = null;
  private modelName: string;

  constructor() {
    this.modelName = config.geminiModel;
    if (config.geminiApiKey) {
      this.googleAI = new GoogleGenerativeAI(config.geminiApiKey);
    } else {
      logger.warn('GEMINI_API_KEY environment variable is not configured. AI fallback mode active.');
    }
  }

  /**
   * Generates AI Response with RAG Context + Session History
   */
  public async generateRAGResponse(
    userPrompt: string,
    contextSnippet: string,
    history: ChatMessage[] = []
  ): Promise<string> {
    if (!this.googleAI) {
      return this.getMockResponse(userPrompt, contextSnippet);
    }

    try {
      const model = this.googleAI.getGenerativeModel({ model: this.modelName });

      const historyFormatted = history
        .map((h) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`)
        .join('\n');

      const systemDirective = `You are an empathetic, evidence-based AI Mental Health & Wellness Assistant. 
Your goal is to provide supportive, compassionate, and practical guidance based on verified psychological techniques.
Disclaimer: You are an AI assistant, not a licensed therapist or physician. Always advise consulting a medical professional for medical emergencies.`;

      const augmentedPrompt = `${systemDirective}

${contextSnippet ? `VERIFIED RAG KNOWLEDGE BASE CONTEXT:\n${contextSnippet}\n\n` : ''}${historyFormatted ? `CONVERSATION HISTORY:\n${historyFormatted}\n\n` : ''}CURRENT USER MESSAGE: ${userPrompt}

Please provide a warm, empathetic response grounded in the provided context and techniques where applicable.`;

      const result = await model.generateContent(augmentedPrompt);
      const responseText = result.response.text();

      return responseText;
    } catch (error) {
      logger.error('Gemini API call error', { error: (error as Error).message });
      return this.getMockResponse(userPrompt, contextSnippet);
    }
  }

  /**
   * Multimodal Image Analysis
   */
  public async analyzeImage(promptText: string, imageBuffer: Buffer, mimeType: string): Promise<string> {
    if (!this.googleAI) {
      return 'Mock Image Analysis: The image shows a peaceful environmental setting conducive for stress relief and mindfulness.';
    }

    try {
      const model = this.googleAI.getGenerativeModel({ model: this.modelName });
      const imagePart = {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType,
        },
      };

      const result = await model.generateContent([promptText || 'Analyze this image from a wellness perspective:', imagePart]);
      return result.response.text();
    } catch (error) {
      logger.error('Gemini Multimodal image analysis error', { error: (error as Error).message });
      return 'Unable to analyze image. Please ensure the API key is valid and image format is supported.';
    }
  }

  private getMockResponse(userPrompt: string, contextSnippet: string): string {
    if (contextSnippet) {
      return `[RAG Assisted Guidance]\n\nBased on established wellness techniques:\n${contextSnippet.split('\n\n')[0]}\n\nRemember to take deep, intentional breaths and take things one step at a time. (Note: Set GEMINI_API_KEY for live AI responses).`;
    }
    return `Thank you for sharing. It sounds like you are navigating a thoughtful moment regarding "${userPrompt}". Practicing deep breathing (Box Breathing: 4s inhale, 4s hold, 4s exhale) can help calm your nervous system. (Note: Set GEMINI_API_KEY for live AI responses).`;
  }
}

export const geminiService = new GeminiService();
