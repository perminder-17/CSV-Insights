// server/src/services/llm/prompt.ts

/**
 * Safely stringify the CSV profile, truncating if it exceeds `maxLen` characters.
 */
export function safeStringifyProfile(profile: unknown, maxLen = 12_000): string {
  let s = '';
  try {
    s = typeof profile === 'string' ? profile : JSON.stringify(profile, null, 2);
  } catch {
    s = String(profile);
  }
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen) + '\n...[truncated]...';
}

/**
 * Build the system + user prompt sent to the LLM.
 */
export function buildPrompt(question: string, profile: unknown): string {
  const profileText = safeStringifyProfile(profile);
  return [
    'You are a data analyst. Answer the user question using the CSV profile/summary below.',
    'Rules:',
    '- Be specific and grounded in the data profile.',
    "- If you can't know from the profile, say what info is missing.",
    '- Keep it concise (5-10 bullet points max unless asked otherwise).',
    '',
    'CSV PROFILE:',
    profileText,
    '',
    'USER QUESTION:',
    question,
  ].join('\n');
}
