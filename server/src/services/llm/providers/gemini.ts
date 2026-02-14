// server/src/services/llm/providers/gemini.ts

import { GoogleGenAI } from '@google/genai';

/**
 * Call Gemini via the official `@google/genai` SDK.
 * Returns the model's text on success, or throws on error.
 */
export async function geminiGenerateContent(prompt: string): Promise<string> {

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  const text = response.text;
  console.log('Gemini response:', { text, response });
  if (!text) {
    throw new Error('LLM error: empty_response');
  }

  return text;
}
