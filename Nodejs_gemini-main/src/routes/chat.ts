import { Router, Request, Response } from 'express';
import multer from 'multer';
import { ragEngine } from '../services/ragEngine';
import { geminiService } from '../services/geminiService';
import { sessionMemory } from '../services/sessionMemory';
import { safetyGuardrails } from '../middleware/safetyGuardrails';
import logger from '../utils/logger';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export const chatRouter = Router();

/**
 * POST /api/chat
 * Primary RAG-assisted Chat endpoint
 */
chatRouter.post('/chat', safetyGuardrails, async (req: Request, res: Response) => {
  try {
    const prompt = req.body.prompt || req.body.question;
    const sessionId = (req.body.sessionId as string) || 'default-session';

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    // Step 1: Vector RAG Retrieval
    const ragResult = ragEngine.retrieve(prompt, 2);

    // Step 2: Fetch Conversation History
    const history = sessionMemory.getHistory(sessionId);

    // Step 3: Generate AI Response
    const responseText = await geminiService.generateRAGResponse(
      prompt,
      ragResult.contextSnippet,
      history
    );

    // Step 4: Record Memory
    sessionMemory.addMessage(sessionId, 'user', prompt);
    sessionMemory.addMessage(sessionId, 'model', responseText);

    res.json({
      sessionId,
      response: responseText,
      ragContext: ragResult.documents.map((d) => ({
        id: d.id,
        title: d.title,
        category: d.category,
      })),
      relevanceScores: ragResult.scores,
    });
  } catch (error) {
    logger.error('Error handling /api/chat request', { error: (error as Error).message });
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

/**
 * POST /api/analyze-image
 * Multimodal Image Upload & Analysis
 */
chatRouter.post('/analyze-image', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Image file is required' });
      return;
    }

    const promptText = (req.body.prompt as string) || 'Analyze this image from a wellness perspective';
    const resultText = await geminiService.analyzeImage(
      promptText,
      req.file.buffer,
      req.file.mimetype
    );

    res.json({
      prompt: promptText,
      analysis: resultText,
    });
  } catch (error) {
    logger.error('Error handling /api/analyze-image', { error: (error as Error).message });
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

/**
 * DELETE /api/chat/memory/:sessionId
 * Clear session memory
 */
chatRouter.delete('/chat/memory/:sessionId', (req: Request, res: Response) => {
  const sessionId = req.params.sessionId;
  sessionMemory.clearSession(sessionId);
  res.json({ message: `Session memory cleared for session ${sessionId}` });
});
