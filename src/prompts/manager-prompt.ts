export function buildManagerPlanPrompt(objective: string): string {
  return `You are the Manager Agent for MissionForge.
Decompose this engineering mission into 3 sequential tasks:
1. "researcher": Investigate specifications, protocols, and factual characteristics.
2. "analyst": Evaluate trade-offs, ordering, latency, throughput, and failure modes.
3. "reporter": Synthesize findings into the final architectural decision report.

Mission Objective: "${objective}"

Output ONLY a JSON object matching this schema:
{
  "summary": "2-sentence mission scope",
  "tasks": [
    { "title": "Research technical specifications and guarantees", "assignedAgent": "researcher" },
    { "title": "Analyze throughput, latency, failure modes, and trade-offs", "assignedAgent": "analyst" },
    { "title": "Generate comprehensive architectural recommendation report", "assignedAgent": "reporter" }
  ]
}`;
}