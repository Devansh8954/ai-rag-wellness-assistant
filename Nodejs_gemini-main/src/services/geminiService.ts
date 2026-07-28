import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config';
import logger from '../utils/logger';
import { ChatMessage } from './sessionMemory';

export class GeminiService {
  private googleAI: GoogleGenerativeAI | null = null;
  private modelName: string;
  private fallbackModels: string[];

  constructor() {
    this.modelName = config.geminiModel || 'gemini-3.6-flash';
    this.fallbackModels = Array.from(new Set([
      this.modelName,
      'gemini-3.6-flash',
      'gemini-2.0-flash-lite',
      'gemini-2.0-flash',
    ]));

    if (config.geminiApiKey) {
      this.googleAI = new GoogleGenerativeAI(config.geminiApiKey);
    } else {
      logger.warn('GEMINI_API_KEY environment variable is not configured. AI fallback mode active.');
    }
  }

  /**
   * Generates AI Response with RAG Context + Session History and automatic Model Fallback
   */
  public async generateRAGResponse(
    userPrompt: string,
    contextSnippet: string,
    history: ChatMessage[] = []
  ): Promise<string> {
    if (!this.googleAI) {
      return this.getMockResponse(userPrompt, contextSnippet);
    }

    const historyFormatted = history
      .map((h) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`)
      .join('\n');

    const systemDirective = `You are an empathetic, evidence-based AI Mental Health & Wellness Assistant. 
Your goal is to provide supportive, compassionate, and practical guidance based on verified psychological techniques.
Disclaimer: You are an AI assistant, not a licensed therapist or physician. Always advise consulting a medical professional for medical emergencies.`;

    const augmentedPrompt = `${systemDirective}

${contextSnippet ? `VERIFIED RAG KNOWLEDGE BASE CONTEXT:\n${contextSnippet}\n\n` : ''}${historyFormatted ? `CONVERSATION HISTORY:\n${historyFormatted}\n\n` : ''}CURRENT USER MESSAGE: ${userPrompt}

Please provide a warm, empathetic response grounded in the provided context and techniques where applicable.`;

    let lastError: Error | null = null;

    for (const modelToTry of this.fallbackModels) {
      try {
        const model = this.googleAI.getGenerativeModel({ model: modelToTry });
        const result = await model.generateContent(augmentedPrompt);
        const responseText = result.response.text();
        return responseText;
      } catch (error) {
        lastError = error as Error;
        logger.warn(`Gemini API call failed for model ${modelToTry}`, { error: lastError.message });
      }
    }

    const errorMessage = lastError ? lastError.message : 'All Gemini models unavailable';
    logger.error('Gemini API call error across all candidate models', { error: errorMessage });
    return this.getMockResponse(userPrompt, contextSnippet, errorMessage);
  }

  /**
   * Multimodal Image Analysis
   */
  public async analyzeImage(promptText: string, imageBuffer: Buffer, mimeType: string): Promise<string> {
    if (!this.googleAI) {
      return 'Mock Image Analysis: The image shows a peaceful environmental setting conducive for stress relief and mindfulness.';
    }

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType,
      },
    };

    for (const modelToTry of this.fallbackModels) {
      try {
        const model = this.googleAI.getGenerativeModel({ model: modelToTry });
        const result = await model.generateContent([promptText || 'Analyze this image from a wellness perspective:', imagePart]);
        return result.response.text();
      } catch (error) {
        logger.warn(`Gemini Multimodal image analysis failed for model ${modelToTry}`, { error: (error as Error).message });
      }
    }

    return 'Unable to analyze image. Please ensure the API key is valid and image format is supported.';
  }

  private getMockResponse(userPrompt: string, contextSnippet: string, apiError?: string): string {
    let hint = '(Note: Set a valid GEMINI_API_KEY in .env for live AI responses).';
    if (apiError) {
      if (apiError.includes('429') || apiError.toLowerCase().includes('quota')) {
        hint = '(Note: Gemini API free tier rate limit reached. Serving evidence-based RAG response.)';
      } else if (apiError.includes('401') || apiError.includes('403') || apiError.includes('API key')) {
        hint = '(Note: Please verify GEMINI_API_KEY in .env)';
      } else {
        hint = `(Note: Gemini API temporarily unavailable - ${apiError.substring(0, 100)}...)`;
      }
    }

    if (contextSnippet) {
      return `[RAG Assisted Guidance]\n\nBased on established wellness techniques:\n${contextSnippet.split('\n\n')[0]}\n\nRemember to take deep, intentional breaths and take things one step at a time. ${hint}`;
    }
    return `Thank you for sharing. It sounds like you are navigating a thoughtful moment regarding "${userPrompt}". Practicing deep breathing (Box Breathing: 4s inhale, 4s hold, 4s exhale) can help calm your nervous system. ${hint}`;
  }
}

export const geminiService = new GeminiService();
