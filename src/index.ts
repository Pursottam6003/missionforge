import { routeAgentRequest } from '@cloudflare/agents';
import { MissionAgent } from './agents/mission-agent';
import { MissionWorkflow } from './workflows/mission-workflow';
import { signSession, verifySession, parseCookie } from './utils/auth';

export { MissionAgent, MissionWorkflow };

export interface Env {
  AI: Ai;
  MissionAgent: DurableObjectNamespace<MissionAgent>;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  AUTH_SECRET?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const authSecret = env.AUTH_SECRET || 'mf_default_fallback_secret_32_chars';

    // ── 1. ROUTE: GET /api/auth/github (Redirect to GitHub) ────────────────
    if (url.pathname === '/api/auth/github') {
      const redirectUri = `${url.origin}/api/auth/callback`;
      const githubUrl = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&scope=read:user`;

      return Response.redirect(githubUrl, 302);
    }

    // ── 2. ROUTE: GET /api/auth/callback (Exchange code & set cookie) ──────
    if (url.pathname === '/api/auth/callback') {
      const code = url.searchParams.get('code');
      if (!code) {
        return new Response('Missing authorization code', { status: 400 });
      }

      try {
        // Exchange code for GitHub access token
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code,
          }),
        });

        const tokenData = (await tokenRes.json()) as { access_token?: string; error?: string };
        if (!tokenData.access_token) {
          return new Response(`OAuth Error: ${tokenData.error || 'Token exchange failed'}`, { status: 400 });
        }

        // Fetch authenticated user profile
        const userRes = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            'User-Agent': 'MissionForge-Auth',
          },
        });

        const ghUser = (await userRes.json()) as { id: number; login: string; name?: string; avatar_url?: string };

        const sessionToken = await signSession(
          {
            id: String(ghUser.id),
            login: ghUser.login,
            name: ghUser.name,
            avatar_url: ghUser.avatar_url,
          },
          authSecret
        );

        // Set HttpOnly signed cookie and redirect back to app
        const headers = new Headers();
        headers.set(
          'Set-Cookie',
          `mf_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=604800`
        );
        headers.set('Location', `${url.origin}/`);

        return new Response(null, { status: 302, headers });
      } catch (err) {
        return new Response(`Authentication failed: ${String(err)}`, { status: 500 });
      }
    }

    // ── 3. ROUTE: GET /api/auth/me (Check session state) ───────────────────
    if (url.pathname === '/api/auth/me') {
      const cookie = parseCookie(request, 'mf_session');
      if (!cookie) {
        return Response.json({ authenticated: false, isGuest: true });
      }

      const user = await verifySession(cookie, authSecret);
      if (!user) {
        return Response.json({ authenticated: false, isGuest: true });
      }

      return Response.json({ authenticated: true, isGuest: false, user });
    }

    // ── 4. ROUTE: POST /api/auth/logout (Clear session) ────────────────────
    if (url.pathname === '/api/auth/logout') {
      const headers = new Headers();
      headers.set('Set-Cookie', 'mf_session=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0');
      return Response.json({ success: true }, { headers });
    }

    // ── 5. AGENTS & STATIC ASSETS ROUTING ─────────────────────────────────
    return (await routeAgentRequest(request, env)) || new Response('Not found', { status: 404 });
  },
};