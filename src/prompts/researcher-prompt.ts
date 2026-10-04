export function buildResearcherPrompt(objective: string, evidenceContext: string): string {
  return `You are the Researcher Agent on MissionForge.
Your role: Investigate technical evidence, extract facts, and state confidence ratings.

Mission Objective: "${objective}"

Technical Evidence Retrieved from Research Tool:
${evidenceContext}

Instructions:
Extract concrete engineering findings directly from the evidence. Return ONLY valid JSON:
{
  "findings": [
    {
      "claim": "Clear technical claim or metric",
      "evidence": "Factual basis from research context",
      "confidence": "high"
    }
  ]
}`;
}