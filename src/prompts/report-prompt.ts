import { Finding, AnalysisDimension } from '../types/mission';

export function buildReportPrompt(
  objective: string,
  findings: Finding[],
  analysis: AnalysisDimension[]
): string {
  return `You are the Reporter Agent on MissionForge.
Your role: Produce the final evidence-backed engineering report.

Objective: "${objective}"
Findings: ${JSON.stringify(findings, null, 2)}
Analysis: ${JSON.stringify(analysis, null, 2)}

Return ONLY valid JSON:
{
  "executiveSummary": "2-3 sentence bottom-line decision",
  "keyFindings": ["Finding 1 with metric", "Finding 2 with metric", "Finding 3 with metric"],
  "evidenceSummary": ["Key architectural evidence point 1", "Evidence point 2"],
  "tradeOffs": ["Trade-off 1", "Trade-off 2", "Trade-off 3"],
  "recommendation": "Concrete guidance stating exactly when to choose which option",
  "nextSteps": ["Immediate architectural step 1", "Step 2", "Step 3"],
  "confidence": "high"
}`;
}