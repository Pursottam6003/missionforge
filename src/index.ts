import { routeAgentRequest } from '@cloudflare/agents';
import { MissionAgent, Env } from './agents/mission-agent';

export { MissionAgent };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Defensive normalization: map PascalCase to kebab-case expected by the agent router
    if (url.pathname.startsWith('/agents/MissionAgent/')) {
      const rewrittenUrl = new URL(request.url);
      rewrittenUrl.pathname = rewrittenUrl.pathname.replace(
        '/agents/MissionAgent/',
        '/agents/mission-agent/'
      );
      request = new Request(rewrittenUrl.toString(), request);
    }

    // Route /agents/mission-agent/:id to the Agent instance
    const agentResponse = await routeAgentRequest(request, env);
    if (agentResponse) {
      return agentResponse;
    }

    if (url.pathname === '/api/health') {
      return Response.json({ status: 'ok', service: 'MissionForge' });
    }

    return new Response('MissionForge API Running', { status: 200 });
  }
};