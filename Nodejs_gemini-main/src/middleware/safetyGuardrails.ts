import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Keywords that trigger an immediate crisis-intervention response
const CRISIS_KEYWORDS = [
  'suicide', 'suicidal', 'kill myself', 'end my life',
  'self harm', 'cutting myself', 'want to die', 'overdose', 'hurt myself',
];

const CRISIS_RESPONSE = `🚨 **IMMEDIATE SUPPORT AVAILABLE** 🚨\n\nIf you or someone you know is in crisis, please know that you are not alone and help is available 24/7:\n\n• **National Suicide & Crisis Lifeline:** Call or text **988** (US/Canada)\n• **Crisis Text Line:** Text **HOME** to **741741**\n• **International Resources:** Find support in your country at [Befrienders Worldwide](https://www.befrienders.org/)\n• **Emergency Services:** Call your local emergency number (e.g. 911 / 112 / 100) immediately.\n\nPlease reach out to a trusted professional or person in your life right now.`;

export function safetyGuardrails(req: Request, res: Response, next: NextFunction): void {
  const prompt = (req.body.prompt || req.body.question || '').toLowerCase();
  const matched = CRISIS_KEYWORDS.find((kw) => prompt.includes(kw));

  if (matched) {
    logger.warn('Crisis guardrail triggered', { keyword: matched, ip: req.ip });
    res.status(200).json({ isCrisisIntervention: true, response: CRISIS_RESPONSE, ragContext: [] });
    return;
  }

  next();
}
