import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const CRISIS_KEYWORDS = [
  'suicide',
  'suicidal',
  'kill myself',
  'end my life',
  'self harm',
  'cutting myself',
  'want to die',
  'overdose',
  'hurt myself',
];

export function safetyGuardrails(req: Request, res: Response, next: NextFunction): void {
  const userPrompt = req.body.prompt || req.body.question || '';

  if (typeof userPrompt === 'string') {
    const lower = userPrompt.toLowerCase();
    const matchedKeyword = CRISIS_KEYWORDS.find((keyword) => lower.includes(keyword));

    if (matchedKeyword) {
      logger.warn('Crisis guardrail triggered — immediate intervention response served', {
        keyword: matchedKeyword,
        ip: req.ip,
      });

      res.status(200).json({
        isCrisisIntervention: true,
        response: `🚨 **IMMEDIATE SUPPORT AVAILABLE** 🚨\n\nIf you or someone you know is in crisis, please know that you are not alone and help is available 24/7:\n\n• **National Suicide & Crisis Lifeline:** Call or text **988** (US/Canada)\n• **Crisis Text Line:** Text **HOME** to **741741**\n• **International Resources:** Find support in your country at [Befrienders Worldwide](https://www.befrienders.org/)\n• **Emergency Services:** Call your local emergency number (e.g. 911 / 112 / 100) immediately.\n\nPlease reach out to a trusted professional or person in your life right now.`,
        ragContext: [],
      });
      return;
    }
  }

  next();
}
