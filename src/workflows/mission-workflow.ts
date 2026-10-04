import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';
import { executeResearchTool } from '../tools/research';
import { cleanJsonParse } from '../utils/json';

export interface WorkflowParams {
  missionId: string;
  objective: string;
}

export interface WorkflowEnv {
  AI: Ai;
}

export class MissionWorkflow extends WorkflowEntrypoint<WorkflowEnv, WorkflowParams> {
  async run(event: WorkflowEvent<WorkflowParams>, step: WorkflowStep): Promise<void> {
    const { objective } = event.payload;

    // ── STEP 1: DURABLE PLANNING ──────────────────────────────────────────
    const plan = await step.do('manager-plan', async () => {
      const res = (await this.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages: [
          { role: 'system', content: 'Decompose the mission into 3 sequential tasks. Return JSON: { summary: string, tasks: string[] }' },
          { role: 'user', content: objective },
        ],
      })) as { response?: string };

      return cleanJsonParse(res.response || '', {
        summary: `Investigation of ${objective}`,
        tasks: ['Research specs', 'Analyze trade-offs', 'Generate report'],
      });
    });

    // ── STEP 2: DURABLE RESEARCH & TOOL CALL ──────────────────────────────
    const research = await step.do('researcher-evidence', async () => {
      const toolData = await executeResearchTool(objective);
      const res = (await this.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages: [
          { role: 'system', content: 'Extract 2 core technical findings from context. Return JSON: { findings: string[] }' },
          { role: 'user', content: `Objective: ${objective}\nContext: ${toolData.extractedContext}` },
        ],
      })) as { response?: string };

      return cleanJsonParse(res.response || '', {
        findings: ['Log partitioning enables replay.', 'In-memory queues optimize routing.'],
      });
    });

    // ── STEP 3: DURABLE ANALYSIS ──────────────────────────────────────────
    const analysis = await step.do('analyst-tradeoffs', async () => {
      const res = (await this.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages: [
          { role: 'system', content: 'Compare findings across throughput and reliability. Return JSON: { tradeOffs: string[] }' },
          { role: 'user', content: JSON.stringify(research) },
        ],
      })) as { response?: string };

      return cleanJsonParse(res.response || '', {
        tradeOffs: ['Throughput vs routing complexity', 'Storage footprint vs memory paging'],
      });
    });

    // ── STEP 4: DURABLE REPORT SYNTHESIS ──────────────────────────────────
    await step.do('reporter-synthesis', async () => {
      const res = (await this.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages: [
          { role: 'system', content: 'Produce an executive recommendation. Return JSON: { recommendation: string }' },
          { role: 'user', content: `Objective: ${objective}\nPlan: ${JSON.stringify(plan)}\nAnalysis: ${JSON.stringify(analysis)}` },
        ],
      })) as { response?: string };

      return cleanJsonParse(res.response || '', {
        recommendation: `Match deployment to throughput profile: partitioned logs for high event rates, queue broker for complex topic topologies.`,
      });
    });
  }
}