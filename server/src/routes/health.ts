import { Router } from 'express';
import mongoose from 'mongoose';

export const healthRouter = Router();

healthRouter.get('/health', async (_req, res) => {
  const dbState = mongoose.connection?.readyState ?? 0;

  const provider = process.env.LLM_PROVIDER ?? 'mock';

  // Don’t call external LLM from health (it causes 429/500 and slows status)
  const llmOk =
    provider === 'mock'
      ? true
      : provider === 'gemini'
      ? Boolean(process.env.GEMINI_API_KEY)
      : provider === 'openai'
      ? Boolean(process.env.OPENAI_API_KEY)
      : false;

  res.json({
    backend: { ok: true },
    db: { ok: dbState === 1, state: dbState },
    llm: {
      ok: llmOk,
      provider,
      configured: llmOk,
      timestamp: new Date().toISOString(),
    },
  });
});
