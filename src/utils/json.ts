export function cleanJsonParse<T>(raw: string, fallback: T): T {
  if (!raw || typeof raw !== 'string') return fallback;

  try {
    // 1. Try stripping standard markdown code fences
    let cleaned = raw
      .replace(/^```json\s*/im, '')
      .replace(/^```\s*/im, '')
      .replace(/\s*```$/im, '')
      .trim();

    // 2. If the string contains conversational preamble before the JSON, extract the JSON object
    if (!cleaned.startsWith('{') && !cleaned.startsWith('[')) {
      const match = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
      if (match) {
        cleaned = match[0];
      }
    }

    const parsed = JSON.parse(cleaned);
    return (parsed !== null && parsed !== undefined) ? (parsed as T) : fallback;
  } catch (err) {
    console.warn('cleanJsonParse failed to parse JSON, returning fallback:', err);
    return fallback;
  }
}