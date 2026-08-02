import { Router, Request, Response } from 'express';
import multer from 'multer';
import { ragEngine } from '../services/ragEngine';
import { geminiService } from '../services/geminiService';
import { sessionMemory } from '../services/sessionMemory';
import { safetyGuardrails } from '../middleware/safetyGuardrails';
import logger from '../utils/logger';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

export const chatRouter = Router();

/** POST /api/chat — RAG-assisted chat with session memory */
chatRouter.post('/chat', safetyGuardrails, async (req: Request, res: Response) => {
  const prompt = req.body.prompt || req.body.question;
  const sessionId: string = req.body.sessionId || 'default-session';

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  try {
    const ragResult   = ragEngine.retrieve(prompt, 2);                              // 1. Vector retrieval
    const history     = sessionMemory.getHistory(sessionId);                        // 2. Session history
    const responseText = await geminiService.generateRAGResponse(                   // 3. AI generation
      prompt, ragResult.contextSnippet, history
    );

    sessionMemory.addMessage(sessionId, 'user', prompt);                            // 4. Persist memory
    sessionMemory.addMessage(sessionId, 'model', responseText);

    res.json({
      sessionId,
      response: responseText,
      ragContext: ragResult.documents.map(({ id, title, category }) => ({ id, title, category })),
      relevanceScores: ragResult.scores,
    });
  } catch (error) {
    logger.error('Error in /api/chat', { error: (error as Error).message });
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

/** POST /api/analyze-image — Multimodal image upload & wellness analysis */
chatRouter.post('/analyze-image', upload.single('image'), async (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: 'Image file is required' }); return; }

  const promptText = (req.body.prompt as string) || 'Analyze this image from a wellness perspective';
  try {
    const analysis = await geminiService.analyzeImage(promptText, req.file.buffer, req.file.mimetype);
    res.json({ prompt: promptText, analysis });
  } catch (error) {
    logger.error('Error in /api/analyze-image', { error: (error as Error).message });
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

/** DELETE /api/chat/memory/:sessionId — Clear session conversation history */
chatRouter.delete('/chat/memory/:sessionId', (req: Request, res: Response) => {
  sessionMemory.clearSession(req.params.sessionId);
  res.json({ message: `Session memory cleared for session ${req.params.sessionId}` });
});
