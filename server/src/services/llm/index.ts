// server/src/services/llm/index.ts

import { buildPrompt } from '../../lib/prompt.js';
import { geminiGenerateContent } from './providers/gemini.js';



function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Returns `true` when the error looks like a transient rate-limit / capacity
 * issue that is worth retrying.
 */
function isRetryable(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  // The SDK wraps HTTP errors – look for status codes in the message.
  return msg.includes('429') || msg.includes('503') || msg.includes('rate') || msg.includes('resource_exhausted');
}

/**
 * Unified LLM answer function.
 *
 * 1. Resolves provider / apiKey / model from the input or env.
 * 2. Dispatches to the correct provider.
 * 3. Retries transient failures with exponential back-off.
 */
export async function llmAnswer(question: string, profile: unknown): Promise<string> {

  const prompt = buildPrompt(question, profile);

  const delays: number[] = [800, 1500, 3000, 6000, 12000];

  for (let attempt = 0; attempt < delays.length; attempt++) {
    try {
      const text = await geminiGenerateContent(prompt);
      return text;
    } catch (err: unknown) {
      console.error(`LLM attempt ${attempt + 1} failed:`, err instanceof Error ? err.message : err);

      if (!isRetryable(err)) {
        return `LLM error: ${err instanceof Error ? err.message : String(err)}`;
      }

      const waitMs = delays[attempt] ?? delays[delays.length - 1] ?? 6000;
      await sleep(waitMs);
    }
  }

  return 'LLM error: rate_limited_after_retries';
}

